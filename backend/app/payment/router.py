"""金流模組 API 路由"""
from datetime import datetime
from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Form, Request
from fastapi.responses import HTMLResponse, PlainTextResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.config import get_settings
from app.payment.service import PaymentService
from app.payment.schemas import (
    CreateOrderRequest, CreateOrderResponse,
    OrderDetailResponse, OrderListResponse, OrderListItem,
    RefundRequestCreate, RefundRequestResponse,
    AdminRefundRequest, RefundReviewRequest,
    RefundListResponse, RefundListItem,
    PaymentStatsResponse, CourseInfo, UserInfo, TransactionInfo,
)

router = APIRouter()
settings = get_settings()


# ===================== 模擬認證 (請替換為實際實作) =====================

async def get_current_user_id() -> UUID:
    """取得當前用戶 ID (模擬)"""
    # TODO: 實作實際的 JWT 認證
    return UUID("00000000-0000-0000-0000-000000000001")


async def get_current_admin_id() -> UUID:
    """取得當前管理員 ID (模擬)"""
    # TODO: 實作實際的 JWT 認證 + 權限檢查
    return UUID("00000000-0000-0000-0000-000000000002")


async def get_course_info(course_id: UUID) -> tuple[str, Decimal]:
    """取得課程資訊 (模擬)"""
    # TODO: 實作實際的課程查詢
    return "範例課程", Decimal("1990.00")


# ===================== 會員 API =====================

@router.post("/orders", response_model=CreateOrderResponse)
async def create_order(
    request: CreateOrderRequest,
    db: AsyncSession = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id),
):
    """
    建立付款訂單
    
    會員購買課程時呼叫此 API 建立訂單，並取得 ECPay 付款頁面。
    """
    # 取得課程資訊
    course_name, course_price = await get_course_info(request.course_id)
    
    service = PaymentService(db)
    order, transaction, checkout_params = await service.create_order(
        user_id=user_id,
        course_id=request.course_id,
        amount=course_price,
        payment_type=request.payment_type.value,
        return_url=request.return_url,
        credit_installment=request.credit_installment,
    )
    
    # 回傳付款 URL (實際使用 HTML 表單自動提交)
    return CreateOrderResponse(
        order_id=order.id,
        order_no=order.order_no,
        payment_url=f"/api/v1/payment/checkout/{order.order_no}",
        expires_at=order.expired_at,
    )


@router.get("/checkout/{order_no}", response_class=HTMLResponse)
async def checkout_page(
    order_no: str,
    db: AsyncSession = Depends(get_db),
):
    """
    產生 ECPay 結帳頁面
    
    自動提交表單導向 ECPay 付款頁面。
    """
    service = PaymentService(db)
    order = await service.get_order_by_no(order_no)
    
    if not order:
        raise HTTPException(status_code=404, detail="訂單不存在")
    
    # 重新產生表單參數
    from app.payment.ecpay.client import get_ecpay_client
    from app.payment.ecpay.aio import PaymentType
    
    ecpay = get_ecpay_client()
    params = ecpay.aio.create_checkout_form(
        trade_no=order.order_no,
        amount=int(order.amount),
        item_name="線上課程購買",
        trade_desc="Online Learning Platform Course",
    )
    
    return ecpay.aio.build_checkout_html(params)


@router.post("/callback", response_class=PlainTextResponse)
async def payment_callback(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    ECPay 付款回調 (Webhook)
    
    接收 ECPay 付款結果通知，更新訂單狀態。
    """
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        form_data = await request.form()
        callback_data = dict(form_data)
        logger.info(f"收到 ECPay callback: {callback_data}")
        
        service = PaymentService(db)
        success = await service.process_callback(callback_data)
        
        if success:
            return "1|OK"
        logger.warning(f"Callback 處理失敗 (訂單: {callback_data.get('MerchantTradeNo')})")
        return "0|Error"
    except Exception as e:
        logger.exception(f"Callback 發生例外: {e}")
        return "0|Error"


@router.post("/return", response_class=HTMLResponse)
async def payment_return(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    ECPay 付款完成導向頁面
    
    用戶在 ECPay 完成付款後導向此頁面。
    """
    form_data = await request.form()
    callback_data = dict(form_data)
    
    merchant_trade_no = callback_data.get("MerchantTradeNo", "")
    rtn_code = callback_data.get("RtnCode", "")
    
    if rtn_code == "1":
        return f"""
        <html>
        <head><meta charset="UTF-8"><title>付款成功</title></head>
        <body>
            <h1>付款成功！</h1>
            <p>訂單編號: {merchant_trade_no}</p>
            <p>感謝您的購買，課程已加入您的學習列表。</p>
            <a href="/">返回首頁</a>
        </body>
        </html>
        """
    else:
        return f"""
        <html>
        <head><meta charset="UTF-8"><title>付款失敗</title></head>
        <body>
            <h1>付款失敗</h1>
            <p>訂單編號: {merchant_trade_no}</p>
            <p>錯誤訊息: {callback_data.get('RtnMsg', '未知錯誤')}</p>
            <a href="/">返回首頁</a>
        </body>
        </html>
        """


@router.get("/orders/{order_id}", response_model=OrderDetailResponse)
async def get_order(
    order_id: UUID,
    db: AsyncSession = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id),
):
    """
    查詢訂單詳情
    
    會員查詢自己的訂單詳情與付款狀態。
    """
    service = PaymentService(db)
    order = await service.get_order_by_id(order_id, user_id)
    
    if not order:
        raise HTTPException(status_code=404, detail="訂單不存在")
    
    transaction = order.transactions[0] if order.transactions else None
    
    return OrderDetailResponse(
        id=order.id,
        order_no=order.order_no,
        course=CourseInfo(id=order.course_id, name="課程名稱"),  # TODO: 查詢實際課程
        amount=order.amount,
        platform_fee=order.platform_fee,
        creator_income=order.creator_income,
        status=order.status,
        created_at=order.created_at,
        paid_at=order.paid_at,
        transaction=TransactionInfo(
            trade_no=transaction.trade_no if transaction else None,
            payment_type=transaction.payment_type if transaction else "",
            card_4_no=transaction.card_4_no if transaction else None,
            trade_status=transaction.trade_status if transaction else "",
        ) if transaction else None,
    )


@router.post("/orders/{order_id}/refund-request", response_model=RefundRequestResponse)
async def request_refund(
    order_id: UUID,
    request: RefundRequestCreate,
    db: AsyncSession = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id),
):
    """
    學員申請退款
    
    學員對已購買的課程提出退款申請，需等待管理員審核。
    """
    service = PaymentService(db)
    refund = await service.user_refund_request(order_id, user_id, request)
    
    if not refund:
        raise HTTPException(status_code=400, detail="無法建立退款申請")
    
    return RefundRequestResponse(
        refund_id=refund.id,
        status=refund.status,
        message="退款申請已送出，待管理員審核",
    )


# ===================== 管理員 API =====================

@router.get("/admin/orders", response_model=OrderListResponse)
async def list_orders(
    status: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    page: int = 1,
    per_page: int = 20,
    db: AsyncSession = Depends(get_db),
    admin_id: UUID = Depends(get_current_admin_id),
):
    """
    查詢訂單列表 (管理員)
    
    管理員查詢所有訂單，支援篩選與分頁。
    """
    service = PaymentService(db)
    orders, total = await service.list_orders(status, date_from, date_to, page, per_page)
    
    items = [
        OrderListItem(
            id=order.id,
            order_no=order.order_no,
            user=UserInfo(id=order.user_id, name="用戶"),  # TODO: 查詢實際用戶
            course=CourseInfo(id=order.course_id, name="課程"),  # TODO: 查詢實際課程
            amount=order.amount,
            status=order.status,
            created_at=order.created_at,
            paid_at=order.paid_at,
        )
        for order in orders
    ]
    
    return OrderListResponse(items=items, total=total, page=page, per_page=per_page)


@router.post("/admin/orders/{order_id}/sync")
async def sync_order_status(
    order_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin_id: UUID = Depends(get_current_admin_id),
):
    """
    同步訂單狀態
    
    主動向 ECPay 查詢並同步訂單的最新狀態。
    """
    service = PaymentService(db)
    transaction = await service.sync_order_status(order_id)
    
    if not transaction:
        raise HTTPException(status_code=404, detail="訂單不存在")
    
    return {
        "message": "同步完成",
        "trade_status": transaction.trade_status,
        "rtn_code": transaction.rtn_code,
        "rtn_msg": transaction.rtn_msg,
    }


@router.post("/admin/orders/{order_id}/refund")
async def admin_refund(
    order_id: UUID,
    request: AdminRefundRequest,
    db: AsyncSession = Depends(get_db),
    admin_id: UUID = Depends(get_current_admin_id),
):
    """
    管理員直接退款
    
    管理員直接對已付款訂單進行退款，無需審核流程。
    """
    service = PaymentService(db)
    refund = await service.admin_refund(order_id, admin_id, request)
    
    if not refund:
        raise HTTPException(status_code=400, detail="無法執行退款")
    
    return {
        "refund_id": refund.id,
        "status": refund.status,
        "rtn_code": refund.rtn_code,
        "rtn_msg": refund.rtn_msg,
    }


@router.get("/admin/refunds", response_model=RefundListResponse)
async def list_refunds(
    status: str | None = None,
    page: int = 1,
    per_page: int = 20,
    db: AsyncSession = Depends(get_db),
    admin_id: UUID = Depends(get_current_admin_id),
):
    """
    查詢退款申請列表 (管理員)
    
    管理員查詢所有退款申請，支援篩選與分頁。
    """
    service = PaymentService(db)
    refunds, total = await service.list_refunds(status, page, per_page)
    
    items = [
        RefundListItem(
            refund_id=refund.id,
            order_no=refund.order.order_no if refund.order else "",
            user=UserInfo(id=refund.requested_by, name="用戶"),  # TODO: 查詢實際用戶
            course=CourseInfo(id=refund.order.course_id if refund.order else UUID(int=0), name="課程"),
            refund_amount=refund.refund_amount,
            reason=refund.reason,
            status=refund.status,
            approval_status=refund.approval_status,
            request_source=refund.request_source,
            requested_at=refund.requested_at,
        )
        for refund in refunds
    ]
    
    return RefundListResponse(items=items, total=total, page=page, per_page=per_page)


@router.post("/admin/refunds/{refund_id}/review")
async def review_refund(
    refund_id: UUID,
    request: RefundReviewRequest,
    db: AsyncSession = Depends(get_db),
    admin_id: UUID = Depends(get_current_admin_id),
):
    """
    審核退款申請
    
    管理員審核學員的退款申請，可通過或拒絕。
    """
    service = PaymentService(db)
    refund = await service.review_refund(refund_id, admin_id, request)
    
    if not refund:
        raise HTTPException(status_code=400, detail="無法審核此申請")
    
    return {
        "refund_id": refund.id,
        "status": refund.status,
        "approval_status": refund.approval_status,
        "message": "已拒絕" if refund.approval_status == "rejected" else "已通過並執行退款",
    }


@router.get("/admin/stats", response_model=PaymentStatsResponse)
async def get_payment_stats(
    db: AsyncSession = Depends(get_db),
    admin_id: UUID = Depends(get_current_admin_id),
):
    """
    取得統計數據
    
    取得金流相關的 KPI 統計數據。
    """
    service = PaymentService(db)
    stats = await service.get_stats()
    
    return PaymentStatsResponse(
        today=stats["today"],
        this_month=stats["this_month"],
        payment_methods=stats["payment_methods"],
    )
