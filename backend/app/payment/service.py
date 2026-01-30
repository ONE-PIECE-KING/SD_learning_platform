"""金流模組業務邏輯"""
from datetime import datetime, timedelta
from decimal import Decimal
from uuid import UUID

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.payment.models import (
    Order, ECPayTransaction, RefundRecord,
    OrderStatus, TradeStatus, RefundStatus, RefundSource, ApprovalStatus
)
from app.payment.schemas import (
    CreateOrderRequest, RefundRequestCreate, AdminRefundRequest, RefundReviewRequest
)
from app.payment.ecpay.client import get_ecpay_client
from app.payment.ecpay.utils import generate_merchant_trade_no


# 平台抽成比例
PLATFORM_FEE_RATE = Decimal("0.20")


class PaymentService:
    """金流服務"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.ecpay = get_ecpay_client()
    
    async def create_order(
        self,
        user_id: UUID,
        course_id: UUID,
        amount: Decimal,
        payment_type: str,
        return_url: str | None = None,
        credit_installment: str | None = None,
    ) -> tuple[Order, ECPayTransaction, dict]:
        """
        建立訂單
        
        Args:
            user_id: 用戶 ID
            course_id: 課程 ID
            amount: 金額
            payment_type: 付款方式
            return_url: 完成後導向
            credit_installment: 分期期數
            
        Returns:
            (訂單, 交易記錄, ECPay 表單參數)
        """
        # 計算金額
        platform_fee = amount * PLATFORM_FEE_RATE
        creator_income = amount - platform_fee
        
        # 產生訂單編號
        order_no = generate_merchant_trade_no("OLP")
        
        # 建立訂單
        order = Order(
            order_no=order_no,
            user_id=user_id,
            course_id=course_id,
            amount=amount,
            platform_fee=platform_fee,
            creator_income=creator_income,
            status=OrderStatus.PENDING.value,
            expired_at=datetime.utcnow() + timedelta(hours=1),
        )
        self.db.add(order)
        await self.db.flush()
        
        # 建立交易記錄
        transaction = ECPayTransaction(
            order_id=order.id,
            merchant_trade_no=order_no,
            payment_type=payment_type,
            trade_amt=amount,
            trade_status=TradeStatus.PENDING.value,
        )
        self.db.add(transaction)
        await self.db.flush()
        
        # 產生 ECPay 表單
        from app.payment.ecpay.aio import PaymentType
        ecpay_payment_type = PaymentType.CREDIT
        
        checkout_params = self.ecpay.aio.create_checkout_form(
            trade_no=order_no,
            amount=int(amount),
            item_name="線上課程購買",
            trade_desc="Online Learning Platform Course",
            return_url=return_url,
            payment_type=ecpay_payment_type,
            credit_installment=credit_installment or "",
        )
        
        await self.db.commit()
        
        return order, transaction, checkout_params
    
    async def process_callback(self, callback_data: dict) -> bool:
        """
        處理 ECPay 回調
        
        Args:
            callback_data: ECPay 回調資料
            
        Returns:
            處理是否成功
        """
        import logging
        logger = logging.getLogger(__name__)
        
        # 驗證 CheckMacValue
        if not self.ecpay.verify_callback(callback_data):
            logger.error(f"CheckMacValue 驗證失敗 (訂單: {callback_data.get('MerchantTradeNo')})")
            return False
        
        merchant_trade_no = callback_data.get("MerchantTradeNo")
        rtn_code = callback_data.get("RtnCode")
        
        # 查詢交易記錄
        result = await self.db.execute(
            select(ECPayTransaction)
            .where(ECPayTransaction.merchant_trade_no == merchant_trade_no)
            .options(selectinload(ECPayTransaction.order))
        )
        transaction = result.scalar_one_or_none()
        
        if not transaction:
            logger.error(f"找不到交易記錄: {merchant_trade_no}")
            return False
        
        # 更新交易記錄
        transaction.trade_no = callback_data.get("TradeNo")
        transaction.rtn_code = str(rtn_code)
        transaction.rtn_msg = callback_data.get("RtnMsg")
        transaction.payment_type_charge = callback_data.get("PaymentType")
        transaction.card_4_no = callback_data.get("card4no")
        transaction.auth_code = callback_data.get("auth_code")
        
        # 解析付款時間
        from app.payment.ecpay.utils import parse_ecpay_date
        transaction.payment_date = parse_ecpay_date(callback_data.get("PaymentDate"))
        transaction.trade_date = parse_ecpay_date(callback_data.get("TradeDate"))
        
        # 判斷交易狀態
        if str(rtn_code) == "1":  # 付款成功
            if transaction.trade_status != TradeStatus.CAPTURED.value:
                transaction.trade_status = TradeStatus.CAPTURED.value
                transaction.order.status = OrderStatus.PAID.value
                transaction.order.paid_at = datetime.utcnow()
                logger.info(f"訂單付款成功: {merchant_trade_no}")
        else:
            transaction.trade_status = TradeStatus.FAILED.value
            logger.warning(f"訂單付款失敗: {merchant_trade_no}, RtnCode: {rtn_code}")
        
        await self.db.commit()
        return True
    
    async def get_order_by_id(self, order_id: UUID, user_id: UUID | None = None) -> Order | None:
        """查詢訂單"""
        query = select(Order).where(Order.id == order_id)
        if user_id:
            query = query.where(Order.user_id == user_id)
        result = await self.db.execute(query.options(selectinload(Order.transactions)))
        return result.scalar_one_or_none()
    
    async def get_order_by_no(self, order_no: str) -> Order | None:
        """依訂單編號查詢"""
        result = await self.db.execute(
            select(Order)
            .where(Order.order_no == order_no)
            .options(selectinload(Order.transactions))
        )
        return result.scalar_one_or_none()
    
    async def list_orders(
        self,
        status: str | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
        page: int = 1,
        per_page: int = 20,
    ) -> tuple[list[Order], int]:
        """查詢訂單列表 (管理員)"""
        query = select(Order)
        count_query = select(func.count(Order.id))
        
        if status:
            query = query.where(Order.status == status)
            count_query = count_query.where(Order.status == status)
        
        if date_from:
            query = query.where(Order.created_at >= date_from)
            count_query = count_query.where(Order.created_at >= date_from)
        
        if date_to:
            query = query.where(Order.created_at <= date_to)
            count_query = count_query.where(Order.created_at <= date_to)
        
        # 分頁
        query = query.offset((page - 1) * per_page).limit(per_page)
        query = query.order_by(Order.created_at.desc())
        
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        
        return list(result.scalars().all()), count_result.scalar() or 0
    
    async def sync_order_status(self, order_id: UUID) -> ECPayTransaction | None:
        """同步訂單狀態"""
        order = await self.get_order_by_id(order_id)
        if not order or not order.transactions:
            return None
        
        transaction = order.transactions[0]
        
        # 呼叫 ECPay 查詢
        trade_info = await self.ecpay.query_trade_info(transaction.merchant_trade_no)
        
        # 更新狀態
        if trade_info.get("TradeStatus") == "1":
            transaction.trade_status = TradeStatus.CAPTURED.value
            order.status = OrderStatus.PAID.value
            order.paid_at = datetime.utcnow()
        
        transaction.trade_no = trade_info.get("TradeNo")
        transaction.rtn_code = trade_info.get("RtnCode")
        transaction.rtn_msg = trade_info.get("RtnMsg")
        
        await self.db.commit()
        return transaction
    
    async def admin_refund(
        self,
        order_id: UUID,
        admin_id: UUID,
        request: AdminRefundRequest,
    ) -> RefundRecord | None:
        """管理員直接退款"""
        order = await self.get_order_by_id(order_id)
        if not order or order.status != OrderStatus.PAID.value:
            return None
        
        if not order.transactions:
            return None
        
        transaction = order.transactions[0]
        refund_amount = order.amount if request.refund_type == "full" else order.amount
        
        # 建立退款記錄
        refund = RefundRecord(
            order_id=order.id,
            transaction_id=transaction.id,
            refund_type=request.refund_type,
            refund_amount=refund_amount,
            reason=request.reason,
            request_source=RefundSource.ADMIN.value,
            requested_by=admin_id,
            approval_status=ApprovalStatus.APPROVED.value,
            status=RefundStatus.PROCESSING.value,
        )
        self.db.add(refund)
        await self.db.flush()
        
        # 執行 ECPay 退款
        try:
            result = await self.ecpay.credit.refund(
                merchant_trade_no=transaction.merchant_trade_no,
                trade_no=transaction.trade_no,
                refund_amount=int(refund_amount),
                trade_status=transaction.trade_status,
            )
            
            refund.rtn_code = result.get("RtnCode")
            refund.rtn_msg = result.get("RtnMsg")
            
            if result.get("RtnCode") == "1":
                refund.status = RefundStatus.SUCCESS.value
                refund.processed_at = datetime.utcnow()
                order.status = OrderStatus.REFUNDED.value
            else:
                refund.status = RefundStatus.FAILED.value
        except Exception as e:
            refund.status = RefundStatus.FAILED.value
            refund.rtn_msg = str(e)
        
        await self.db.commit()
        return refund
    
    async def user_refund_request(
        self,
        order_id: UUID,
        user_id: UUID,
        request: RefundRequestCreate,
    ) -> RefundRecord | None:
        """學員申請退款"""
        order = await self.get_order_by_id(order_id, user_id)
        if not order or order.status != OrderStatus.PAID.value:
            return None
        
        if not order.transactions:
            return None
        
        transaction = order.transactions[0]
        
        # 建立退款記錄 (待審核)
        refund = RefundRecord(
            order_id=order.id,
            transaction_id=transaction.id,
            refund_type="full",
            refund_amount=order.amount,
            reason=request.reason,
            request_source=RefundSource.USER.value,
            requested_by=user_id,
            approval_status=ApprovalStatus.PENDING.value,
            status=RefundStatus.PENDING_APPROVAL.value,
        )
        self.db.add(refund)
        await self.db.commit()
        
        return refund
    
    async def review_refund(
        self,
        refund_id: UUID,
        admin_id: UUID,
        request: RefundReviewRequest,
    ) -> RefundRecord | None:
        """審核退款申請"""
        result = await self.db.execute(
            select(RefundRecord)
            .where(RefundRecord.id == refund_id)
            .options(
                selectinload(RefundRecord.order),
                selectinload(RefundRecord.transaction)
            )
        )
        refund = result.scalar_one_or_none()
        
        if not refund or refund.approval_status != ApprovalStatus.PENDING.value:
            return None
        
        refund.reviewed_by = admin_id
        refund.reviewed_at = datetime.utcnow()
        
        if request.action == "reject":
            refund.approval_status = ApprovalStatus.REJECTED.value
            refund.status = RefundStatus.REJECTED.value
            refund.reject_reason = request.reject_reason
        else:
            refund.approval_status = ApprovalStatus.APPROVED.value
            refund.status = RefundStatus.PROCESSING.value
            
            # 執行退款
            try:
                ecpay_result = await self.ecpay.credit.refund(
                    merchant_trade_no=refund.transaction.merchant_trade_no,
                    trade_no=refund.transaction.trade_no,
                    refund_amount=int(refund.refund_amount),
                    trade_status=refund.transaction.trade_status,
                )
                
                refund.rtn_code = ecpay_result.get("RtnCode")
                refund.rtn_msg = ecpay_result.get("RtnMsg")
                
                if ecpay_result.get("RtnCode") == "1":
                    refund.status = RefundStatus.SUCCESS.value
                    refund.processed_at = datetime.utcnow()
                    refund.order.status = OrderStatus.REFUNDED.value
                else:
                    refund.status = RefundStatus.FAILED.value
            except Exception as e:
                refund.status = RefundStatus.FAILED.value
                refund.rtn_msg = str(e)
        
        await self.db.commit()
        return refund
    
    async def list_refunds(
        self,
        status: str | None = None,
        page: int = 1,
        per_page: int = 20,
    ) -> tuple[list[RefundRecord], int]:
        """查詢退款列表"""
        query = select(RefundRecord)
        count_query = select(func.count(RefundRecord.id))
        
        if status:
            query = query.where(RefundRecord.status == status)
            count_query = count_query.where(RefundRecord.status == status)
        
        query = query.offset((page - 1) * per_page).limit(per_page)
        query = query.order_by(RefundRecord.requested_at.desc())
        
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        
        return list(result.scalars().all()), count_result.scalar() or 0
    
    async def get_stats(self) -> dict:
        """取得統計數據"""
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        month_start = today.replace(day=1)
        
        # 今日統計
        today_result = await self.db.execute(
            select(
                func.count(Order.id),
                func.sum(Order.amount),
                func.sum(Order.platform_fee)
            ).where(
                and_(
                    Order.status == OrderStatus.PAID.value,
                    Order.paid_at >= today
                )
            )
        )
        today_stats = today_result.one()
        
        # 本月統計
        month_result = await self.db.execute(
            select(
                func.count(Order.id),
                func.sum(Order.amount),
                func.sum(Order.platform_fee)
            ).where(
                and_(
                    Order.status == OrderStatus.PAID.value,
                    Order.paid_at >= month_start
                )
            )
        )
        month_stats = month_result.one()
        
        return {
            "today": {
                "total_orders": today_stats[0] or 0,
                "total_amount": float(today_stats[1] or 0),
                "platform_revenue": float(today_stats[2] or 0),
            },
            "this_month": {
                "total_orders": month_stats[0] or 0,
                "total_amount": float(month_stats[1] or 0),
                "platform_revenue": float(month_stats[2] or 0),
            },
            "payment_methods": {}  # 可依需求擴充
        }
