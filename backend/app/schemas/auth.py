"""
Authentication Schemas
認證相關的 Pydantic 模型
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.schemas.common import BaseSchema


class LoginRequest(BaseSchema):
    """登入請求"""
    email: EmailStr = Field(..., examples=["user@example.com"])
    password: str = Field(..., min_length=8, examples=["password123"])


class RegisterRequest(BaseSchema):
    """註冊請求"""
    email: EmailStr = Field(..., examples=["user@example.com"])
    password: str = Field(..., min_length=8, examples=["password123"])
    display_name: str = Field(..., min_length=2, max_length=100, examples=["John Doe"])

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class TokenResponse(BaseSchema):
    """Token 回應"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Token 過期時間 (秒)")


class TokenRefreshRequest(BaseSchema):
    """刷新 Token 請求"""
    refresh_token: str


class LoginResponse(TokenResponse):
    """登入回應"""
    user_id: UUID
    email: EmailStr
    display_name: str
    role: str


class TokenPayload(BaseSchema):
    """JWT Token Payload"""
    sub: str  # user_id
    email: str
    role: str
    exp: datetime
    iat: datetime


class GoogleOAuthRequest(BaseSchema):
    """Google OAuth 請求"""
    code: str
    redirect_uri: Optional[str] = None


class OAuthUserInfo(BaseSchema):
    """OAuth 用戶資訊"""
    provider: str
    provider_user_id: str
    email: EmailStr
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
