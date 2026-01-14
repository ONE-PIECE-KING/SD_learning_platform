"""
Authentication API
用戶認證相關端點
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    TokenRefreshRequest,
    TokenResponse,
)

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    用戶註冊
    """
    # TODO: Implement user registration
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Registration endpoint not implemented yet",
    )


@router.post("/login", response_model=LoginResponse)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    用戶登入 (Email/Password)
    """
    # TODO: Implement login logic
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Login endpoint not implemented yet",
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: TokenRefreshRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    刷新 Access Token
    """
    # TODO: Implement token refresh
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Token refresh endpoint not implemented yet",
    )


@router.get("/oauth/google")
async def google_oauth_redirect():
    """
    Google OAuth 重導向
    """
    # TODO: Implement Google OAuth redirect
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Google OAuth not implemented yet",
    )


@router.get("/oauth/google/callback")
async def google_oauth_callback(
    code: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Google OAuth 回調處理
    """
    # TODO: Implement Google OAuth callback
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Google OAuth callback not implemented yet",
    )


@router.post("/logout")
async def logout():
    """
    用戶登出
    """
    return {"message": "Successfully logged out"}
