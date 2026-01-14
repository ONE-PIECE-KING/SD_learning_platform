"""
Order and Payment Models
訂單與付款資料表定義
"""
from datetime import datetime
from decimal import Decimal
from enum import Enum as PyEnum
from typing import Optional, TYPE_CHECKING
from uuid import uuid4, UUID as PyUUID

from sqlalchemy import String, Numeric, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.course import Course
    from app.models.enrollment import Enrollment


class OrderStatus(str, PyEnum):
    """訂單狀態"""
    PENDING = "PENDING"        # 待付款
    PAID = "PAID"              # 已付款
    REFUNDED = "REFUNDED"      # 已退款
    CANCELLED = "CANCELLED"    # 已取消


class Order(Base, TimestampMixin):
    """
    訂單資料表

    Attributes:
        id: 主鍵 UUID
        user_id: 購買者 ID
        course_id: 購買課程 ID
        amount: 訂單金額
        platform_fee: 平台抽成 (20%)
        creator_revenue: 創作者收益 (80%)
        status: 訂單狀態
    """
    __tablename__ = "orders"

    id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    user_id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    course_id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("courses.id"),
        nullable=False,
        index=True,
    )
    amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )
    platform_fee: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )
    creator_revenue: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )
    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus),
        default=OrderStatus.PENDING,
        nullable=False,
        index=True,
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="orders",
    )
    course: Mapped["Course"] = relationship(
        "Course",
        back_populates="orders",
    )
    payment: Mapped[Optional["Payment"]] = relationship(
        "Payment",
        back_populates="order",
        uselist=False,
    )
    enrollment: Mapped[Optional["Enrollment"]] = relationship(
        "Enrollment",
        back_populates="order",
        uselist=False,
    )

    def __repr__(self) -> str:
        return f"<Order(id={self.id}, amount={self.amount}, status={self.status})>"


class Payment(Base):
    """
    付款資料表

    Attributes:
        id: 主鍵 UUID
        order_id: 訂單 ID (唯一)
        ecpay_trade_no: ECPay 交易編號
        amount: 付款金額
        paid_at: 付款時間
    """
    __tablename__ = "payments"

    id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    order_id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("orders.id"),
        unique=True,
        nullable=False,
    )
    ecpay_trade_no: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )
    paid_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        nullable=True,
    )

    # Relationships
    order: Mapped["Order"] = relationship(
        "Order",
        back_populates="payment",
    )

    def __repr__(self) -> str:
        return f"<Payment(id={self.id}, order_id={self.order_id})>"
