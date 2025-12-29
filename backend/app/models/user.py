# backend/app/models/user.py
"""
用戶資料模型
"""
from enum import Enum as PyEnum
from sqlalchemy import Column, String, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from .base import Base, TimestampMixin


class UserRole(str, PyEnum):
    """用戶角色"""
    USER = "USER"      # 一般會員
    ADMIN = "ADMIN"    # 管理員


class UserStatus(str, PyEnum):
    """用戶狀態"""
    ACTIVE = "ACTIVE"        # 正常
    SUSPENDED = "SUSPENDED"  # 停權


class User(Base, TimestampMixin):
    """用戶資料表"""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)  # OAuth 用戶可能無密碼
    name = Column(String(100), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    status = Column(Enum(UserStatus), default=UserStatus.ACTIVE, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)  # 個人簡介

    # 關聯
    oauth_accounts = relationship("OAuthAccount", back_populates="user", cascade="all, delete-orphan")
    courses = relationship("Course", back_populates="creator")
    orders = relationship("Order", back_populates="user")
    enrollments = relationship("Enrollment", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")
