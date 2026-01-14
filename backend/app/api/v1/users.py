"""
Users API
用戶管理相關端點
"""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.user import UserResponse, UserUpdateRequest, UserListResponse
from app.api.deps import get_current_user, get_current_admin_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user=Depends(get_current_user),
):
    """
    獲取當前用戶資料
    """
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    request: UserUpdateRequest,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    更新當前用戶資料
    """
    # TODO: Implement profile update
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Profile update not implemented yet",
    )


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    根據 ID 獲取用戶資料 (公開資訊)
    """
    # TODO: Implement get user by ID
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Get user by ID not implemented yet",
    )


@router.get("", response_model=UserListResponse)
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    role: Optional[str] = None,
    current_user=Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """
    列出所有用戶 (僅管理員)
    """
    # TODO: Implement list users
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="List users not implemented yet",
    )
