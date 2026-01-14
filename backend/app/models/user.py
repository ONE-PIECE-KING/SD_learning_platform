"""
User Model
用戶資料表定義
"""
from enum import Enum as PyEnum
from typing import Optional, List, TYPE_CHECKING
from uuid import uuid4

from sqlalchemy import String, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.oauth import OAuthAccount
    from app.models.course import Course
    from app.models.order import Order
    from app.models.enrollment import Enrollment
    from app.models.audit import AuditLog


class UserRole(str, PyEnum):
    """用戶角色"""
    USER = "USER"      # 一般會員
    ADMIN = "ADMIN"    # 管理員


class UserStatus(str, PyEnum):
    """用戶狀態"""
    ACTIVE = "ACTIVE"        # 正常
    SUSPENDED = "SUSPENDED"  # 停權


class User(Base, TimestampMixin):
    """
    用戶資料表

    Attributes:
        id: 主鍵 UUID
        email: 電子郵件 (唯一，登入帳號)
        password_hash: 密碼雜湊 (OAuth 用戶可為空)
        name: 顯示名稱
        role: 用戶角色 (USER/ADMIN)
        status: 用戶狀態 (ACTIVE/SUSPENDED)
        avatar_url: 頭像網址
        bio: 個人簡介
    """
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    password_hash: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole),
        default=UserRole.USER,
        nullable=False,
    )
    status: Mapped[UserStatus] = mapped_column(
        Enum(UserStatus),
        default=UserStatus.ACTIVE,
        nullable=False,
    )
    avatar_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    bio: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # Relationships
    oauth_accounts: Mapped[List["OAuthAccount"]] = relationship(
        "OAuthAccount",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    courses: Mapped[List["Course"]] = relationship(
        "Course",
        back_populates="creator",
    )
    orders: Mapped[List["Order"]] = relationship(
        "Order",
        back_populates="user",
    )
    enrollments: Mapped[List["Enrollment"]] = relationship(
        "Enrollment",
        back_populates="user",
    )
    audit_logs: Mapped[List["AuditLog"]] = relationship(
        "AuditLog",
        back_populates="user",
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
