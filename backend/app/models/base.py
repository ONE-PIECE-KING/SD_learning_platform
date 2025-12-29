# backend/app/models/base.py
"""
SQLAlchemy Base 類別與共用 Mixin
"""
from datetime import datetime
from uuid import uuid4
from sqlalchemy import Column, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """SQLAlchemy 宣告式基類"""
    pass


class TimestampMixin:
    """時間戳記 Mixin - 自動管理 created_at 和 updated_at"""
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
