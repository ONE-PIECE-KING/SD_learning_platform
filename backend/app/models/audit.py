"""
Audit Log Model
稽核日誌資料表定義
"""
from datetime import datetime
from typing import Optional, Any, TYPE_CHECKING
from uuid import uuid4, UUID as PyUUID

from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class AuditLog(Base):
    """
    稽核日誌資料表

    Attributes:
        id: 主鍵 UUID
        user_id: 操作者 ID
        action: 操作類型 (如 COURSE_APPROVED)
        entity_type: 實體類型 (如 Course)
        entity_id: 實體 ID
        old_value: 變更前的值 (JSON)
        new_value: 變更後的值 (JSON)
        ip_address: 操作者 IP
        created_at: 建立時間
    """
    __tablename__ = "audit_logs"

    id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    user_id: Mapped[Optional[PyUUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,  # 系統操作可能沒有用戶
        index=True,
    )
    action: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )
    entity_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    entity_id: Mapped[Optional[PyUUID]] = mapped_column(
        UUID(as_uuid=True),
        nullable=True,
    )
    old_value: Mapped[Optional[Any]] = mapped_column(
        JSON,
        nullable=True,
    )
    new_value: Mapped[Optional[Any]] = mapped_column(
        JSON,
        nullable=True,
    )
    ip_address: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )

    # Relationships
    user: Mapped[Optional["User"]] = relationship(
        "User",
        back_populates="audit_logs",
    )

    def __repr__(self) -> str:
        return f"<AuditLog(action={self.action}, entity_type={self.entity_type})>"
