# backend/app/models/order.py
"""
訂單與付款資料模型
"""
from enum import Enum as PyEnum
from sqlalchemy import Column, String, Numeric, Enum, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from .base import Base, TimestampMixin


class OrderStatus(str, PyEnum):
    """訂單狀態"""
    PENDING = "PENDING"      # 待付款
    PAID = "PAID"            # 已付款
    REFUNDED = "REFUNDED"    # 已退款
    CANCELLED = "CANCELLED"  # 已取消


class Order(Base, TimestampMixin):
    """訂單資料表"""
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)  # 訂單金額
    platform_fee = Column(Numeric(10, 2), nullable=False)  # 平台抽成 (20%)
    creator_revenue = Column(Numeric(10, 2), nullable=False)  # 創作者收益 (80%)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)

    # 關聯
    user = relationship("User", back_populates="orders")
    course = relationship("Course", back_populates="orders")
    payment = relationship("Payment", back_populates="order", uselist=False)
    enrollment = relationship("Enrollment", back_populates="order", uselist=False)


class Payment(Base):
    """付款記錄表"""
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), unique=True, nullable=False)
    ecpay_trade_no = Column(String(50), nullable=True)  # ECPay 交易編號
    amount = Column(Numeric(10, 2), nullable=False)
    paid_at = Column(DateTime, nullable=True)

    # 關聯
    order = relationship("Order", back_populates="payment")
