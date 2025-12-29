# backend/app/models/oauth.py
"""
OAuth 第三方登入模型
"""
from sqlalchemy import Column, String, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from .base import Base


class OAuthAccount(Base):
    """OAuth 第三方登入連結"""
    __tablename__ = "oauth_accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(50), nullable=False)  # google, facebook
    provider_account_id = Column(String(255), nullable=False)
    access_token = Column(String(500), nullable=True)
    refresh_token = Column(String(500), nullable=True)
    expires_at = Column(DateTime, nullable=True)

    # 關聯
    user = relationship("User", back_populates="oauth_accounts")

    __table_args__ = (
        # 同一個 provider 的帳號只能綁定一次
        UniqueConstraint("provider", "provider_account_id", name="uq_oauth_provider_account"),
    )
