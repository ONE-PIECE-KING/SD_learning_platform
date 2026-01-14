"""
Enrollment Schemas
課程註冊與訂單相關的 Pydantic 模型
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import Field

from app.schemas.common import BaseSchema, PaginatedResponse
from app.schemas.course import CourseSummary
from app.schemas.video import VideoProgressResponse


class EnrollmentBase(BaseSchema):
    """註冊基礎資料"""
    course_id: UUID
    user_id: UUID


class EnrollmentResponse(EnrollmentBase):
    """註冊回應"""
    id: UUID
    progress_percentage: float = Field(..., ge=0, le=100)
    completed_at: Optional[datetime] = None
    enrolled_at: datetime


class EnrollmentDetailResponse(EnrollmentResponse):
    """註冊詳情回應"""
    course: CourseSummary
    video_progress: list[VideoProgressResponse] = []
    total_videos: int = 0
    completed_videos: int = 0


class EnrollmentListResponse(PaginatedResponse[EnrollmentDetailResponse]):
    """註冊列表回應"""
    pass


class OrderCreateRequest(BaseSchema):
    """建立訂單請求"""
    course_id: UUID


class OrderResponse(BaseSchema):
    """訂單回應"""
    id: UUID
    user_id: UUID
    course_id: UUID
    course_title: str
    amount: Decimal
    platform_fee: Decimal
    instructor_revenue: Decimal
    status: str = Field(..., examples=["pending", "paid", "refunded", "cancelled"])
    payment_method: Optional[str] = None
    created_at: datetime
    paid_at: Optional[datetime] = None


class OrderDetailResponse(OrderResponse):
    """訂單詳情回應"""
    course: CourseSummary
    payment_info: Optional[dict] = None


class PaymentInitResponse(BaseSchema):
    """付款初始化回應"""
    order_id: UUID
    payment_url: str  # 金流頁面 URL
    merchant_trade_no: str
    expires_at: datetime


class PaymentCallbackRequest(BaseSchema):
    """金流回調請求 (ECPay)"""
    MerchantID: str
    MerchantTradeNo: str
    RtnCode: int
    RtnMsg: str
    TradeNo: str
    TradeAmt: int
    PaymentDate: str
    PaymentType: str
    CheckMacValue: str
    # 其他欄位可依需求添加


class PaymentStatusResponse(BaseSchema):
    """付款狀態回應"""
    order_id: UUID
    status: str
    payment_method: Optional[str] = None
    paid_at: Optional[datetime] = None
    transaction_id: Optional[str] = None
