# backend/app/api/v1/users.py
"""
用戶 API 端點 (基礎框架)
"""
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.models import User

router = APIRouter()


@router.get("/me")
async def get_current_user():
    """
    取得當前登入用戶資訊

    TODO: 實作認證後完善此端點
    """
    # 暫時回傳 placeholder
    return {
        "message": "Authentication not implemented yet",
        "hint": "This endpoint will return current user after OAuth2 integration"
    }


@router.get("/{user_id}")
async def get_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """根據 ID 取得用戶資訊"""
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {
        "id": str(user.id),
        "email": user.email,
        "name": user.name,
        "role": user.role.value,
        "status": user.status.value,
        "avatar_url": user.avatar_url,
        "created_at": user.created_at.isoformat()
    }
