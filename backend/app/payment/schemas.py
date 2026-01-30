"""金流模組 Pydantic Schemas"""
from datetime import datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


# ===================== Enums =====================

class PaymentTypeEnum(str, Enum):
    """付款方式"""
    CREDIT = "Credit"
    CREDIT_INSTALLMENT = "CreditInstallment"


class OrderStatusEnum(str, Enum):
    """訂單狀態"""
    PENDING = "pending"
    PAID = "paid"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class RefundTypeEnum(str, Enum):
    """退款類型"""
    FULL = "full"
    PARTIAL = "partial"


class ReviewActionEnum(str, Enum):
    """審核動作"""
    APPROVE = "approve"
    REJECT = "reject"


# ===================== Request Schemas =====================

class CreateOrderRequest(BaseModel):
    """建立訂單請求"""
    course_id: UUID
    payment_type: PaymentTypeEnum = PaymentTypeEnum.CREDIT
    return_url: str | None = None
    credit_installment: str | None = Field(None, description="分期期數 (3,6,12,18,24)")


class RefundRequestCreate(BaseModel):
    """學員退款申請"""
    reason: str = Field(..., min_length=1, max_length=500)


class AdminRefundRequest(BaseModel):
    """管理員退款請求"""
    refund_type: RefundTypeEnum = RefundTypeEnum.FULL
    reason: str = Field(..., min_length=1, max_length=500)


class RefundReviewRequest(BaseModel):
    """退款審核請求"""
    action: ReviewActionEnum
    reject_reason: str | None = Field(None, max_length=500)


# ===================== Response Schemas =====================

class CourseInfo(BaseModel):
    """課程資訊"""
    id: UUID
    name: str


class UserInfo(BaseModel):
    """用戶資訊"""
    id: UUID
    name: str


class CreateOrderResponse(BaseModel):
    """建立訂單回應"""
    order_id: UUID
    order_no: str
    payment_url: str
    expires_at: datetime


class TransactionInfo(BaseModel):
    """交易資訊"""
    trade_no: str | None
    payment_type: str
    card_4_no: str | None
    trade_status: str


class OrderDetailResponse(BaseModel):
    """訂單詳情回應"""
    id: UUID
    order_no: str
    course: CourseInfo
    amount: Decimal
    platform_fee: Decimal
    creator_income: Decimal
    status: str
    created_at: datetime
    paid_at: datetime | None
    transaction: TransactionInfo | None


class OrderListItem(BaseModel):
    """訂單列表項目"""
    id: UUID
    order_no: str
    user: UserInfo
    course: CourseInfo
    amount: Decimal
    status: str
    created_at: datetime
    paid_at: datetime | None


class OrderListResponse(BaseModel):
    """訂單列表回應"""
    items: list[OrderListItem]
    total: int
    page: int
    per_page: int


class RefundRequestResponse(BaseModel):
    """退款申請回應"""
    refund_id: UUID
    status: str
    message: str


class RefundListItem(BaseModel):
    """退款列表項目"""
    refund_id: UUID
    order_no: str
    user: UserInfo
    course: CourseInfo
    refund_amount: Decimal
    reason: str | None
    status: str
    approval_status: str
    request_source: str
    requested_at: datetime


class RefundListResponse(BaseModel):
    """退款列表回應"""
    items: list[RefundListItem]
    total: int
    page: int
    per_page: int


class PaymentMethodStats(BaseModel):
    """付款方式統計"""
    count: int
    amount: Decimal


class PeriodStats(BaseModel):
    """期間統計"""
    total_orders: int
    total_amount: Decimal
    platform_revenue: Decimal


class PaymentStatsResponse(BaseModel):
    """統計數據回應"""
    today: PeriodStats
    this_month: PeriodStats
    payment_methods: dict[str, PaymentMethodStats]


# ===================== Callback Schemas =====================

class ECPayCallbackData(BaseModel):
    """ECPay 回調資料"""
    MerchantID: str
    MerchantTradeNo: str
    StoreID: str | None = None
    RtnCode: str
    RtnMsg: str
    TradeNo: str
    TradeAmt: int
    PaymentDate: str
    PaymentType: str
    PaymentTypeChargeFee: str | None = None
    TradeDate: str
    SimulatePaid: str | None = None
    CheckMacValue: str
    
    # 信用卡專用
    card4no: str | None = None
    auth_code: str | None = None
    
    class Config:
        extra = "allow"  # 允許額外欄位
