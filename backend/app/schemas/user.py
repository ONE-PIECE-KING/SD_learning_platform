"""
User Schemas
用戶相關的 Pydantic 模型
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import EmailStr, Field, HttpUrl

from app.schemas.common import BaseSchema, PaginatedResponse


class UserBase(BaseSchema):
    """用戶基礎資料"""
    email: EmailStr
    display_name: str = Field(..., min_length=2, max_length=100)


class UserResponse(UserBase):
    """用戶回應 (公開資訊)"""
    id: UUID
    avatar_url: Optional[str] = None
    role: str = Field(..., examples=["student", "instructor", "admin"])
    status: str = Field(..., examples=["active", "inactive", "suspended"])
    created_at: datetime


class UserDetailResponse(UserResponse):
    """用戶詳細回應 (私有資訊)"""
    bio: Optional[str] = None
    website: Optional[str] = None
    total_courses: int = 0
    total_enrollments: int = 0
    updated_at: datetime


class UserUpdateRequest(BaseSchema):
    """更新用戶資料請求"""
    display_name: Optional[str] = Field(None, min_length=2, max_length=100)
    bio: Optional[str] = Field(None, max_length=1000)
    website: Optional[str] = None
    avatar_url: Optional[str] = None


class UserListResponse(PaginatedResponse[UserResponse]):
    """用戶列表回應"""
    pass


class InstructorPublicProfile(BaseSchema):
    """講師公開檔案"""
    id: UUID
    display_name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    total_courses: int = 0
    total_students: int = 0
    average_rating: Optional[float] = None
