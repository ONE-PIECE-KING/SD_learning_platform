"""
Base Model and Mixins
SQLAlchemy 2.0 宣告式基礎
"""
from datetime import datetime
from sqlalchemy import DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """SQLAlchemy 宣告式基礎類別"""
    pass


class TimestampMixin:
    """時間戳記 Mixin - 自動管理 created_at 和 updated_at"""

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
