"""
API Dependencies
共用的依賴注入函數
"""
from typing import Optional
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models.user import UserRole

# HTTP Bearer token scheme
security = HTTPBearer(auto_error=False)


async def get_token_payload(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Optional[dict]:
    """
    從 Bearer token 中提取 payload
    """
    if credentials is None:
        return None

    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return payload
    except JWTError:
        return None


async def get_current_user(
    payload: Optional[dict] = Depends(get_token_payload),
    db: AsyncSession = Depends(get_db),
):
    """
    獲取當前登入用戶
    如果未登入或 token 無效，拋出 401 錯誤
    """
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # TODO: Fetch user from database
    # from app.repositories.user import UserRepository
    # user_repo = UserRepository(db)
    # user = await user_repo.get_by_id(UUID(user_id))
    # if user is None:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="User not found",
    #     )
    # return user

    # Temporary: Return payload as user placeholder
    return {
        "id": user_id,
        "email": payload.get("email"),
        "role": payload.get("role", "student"),
    }


async def get_current_user_optional(
    payload: Optional[dict] = Depends(get_token_payload),
    db: AsyncSession = Depends(get_db),
):
    """
    獲取當前用戶 (可選)
    如果未登入，返回 None
    """
    if payload is None:
        return None

    user_id = payload.get("sub")
    if user_id is None:
        return None

    # TODO: Fetch user from database
    return {
        "id": user_id,
        "email": payload.get("email"),
        "role": payload.get("role", "student"),
    }


async def get_current_instructor(
    current_user=Depends(get_current_user),
):
    """
    確認當前用戶是講師
    """
    if current_user.get("role") not in ["instructor", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Instructor access required",
        )
    return current_user


async def get_current_admin_user(
    current_user=Depends(get_current_user),
):
    """
    確認當前用戶是管理員
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user
