"""
OAuth Account Model
第三方登入連結資料表
"""
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from uuid import uuid4, UUID as PyUUID

from sqlalchemy import String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class OAuthAccount(Base):
    """
    OAuth 第三方登入連結

    Attributes:
        id: 主鍵 UUID
        user_id: 關聯用戶 ID
        provider: OAuth 提供者 (google, facebook)
        provider_account_id: 第三方平台用戶 ID
        access_token: 存取令牌
        refresh_token: 刷新令牌
        expires_at: 令牌過期時間
    """
    __tablename__ = "oauth_accounts"

    id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    user_id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    provider: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    provider_account_id: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    access_token: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    refresh_token: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    expires_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        nullable=True,
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="oauth_accounts",
    )

    # Constraints
    __table_args__ = (
        UniqueConstraint(
            "provider",
            "provider_account_id",
            name="uq_oauth_provider_account",
        ),
    )

    def __repr__(self) -> str:
        return f"<OAuthAccount(provider={self.provider}, user_id={self.user_id})>"
