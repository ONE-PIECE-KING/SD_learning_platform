"""
Enrollments API
課程註冊與購買相關端點
"""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.enrollment import (
    EnrollmentResponse,
    EnrollmentListResponse,
    OrderCreateRequest,
    OrderResponse,
    PaymentCallbackRequest,
)
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/my", response_model=EnrollmentListResponse)
async def get_my_enrollments(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    獲取我的課程列表 (已購買/註冊)
    """
    # TODO: Implement get my enrollments
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Get enrollments not implemented yet",
    )


@router.get("/{enrollment_id}", response_model=EnrollmentResponse)
async def get_enrollment_detail(
    enrollment_id: UUID,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    獲取註冊詳情 (包含觀看進度)
    """
    # TODO: Implement get enrollment detail
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Get enrollment detail not implemented yet",
    )


@router.post("/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    request: OrderCreateRequest,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    建立訂單
    """
    # TODO: Implement order creation
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Order creation not implemented yet",
    )


@router.get("/orders", response_model=list[OrderResponse])
async def get_my_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    獲取我的訂單列表
    """
    # TODO: Implement get my orders
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Get orders not implemented yet",
    )


@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order_detail(
    order_id: UUID,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    獲取訂單詳情
    """
    # TODO: Implement get order detail
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Get order detail not implemented yet",
    )


@router.post("/orders/{order_id}/pay")
async def initiate_payment(
    order_id: UUID,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    發起付款 (跳轉至金流頁面)
    """
    # TODO: Implement payment initiation (ECPay integration)
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Payment initiation not implemented yet",
    )


@router.post("/payment/callback")
async def payment_callback(
    request: PaymentCallbackRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    金流回調 (ECPay webhook)
    """
    # TODO: Implement payment callback handler
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Payment callback not implemented yet",
    )
