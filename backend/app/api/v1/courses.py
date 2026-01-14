"""
Courses API
課程管理相關端點
"""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.course import (
    CourseCreateRequest,
    CourseUpdateRequest,
    CourseResponse,
    CourseDetailResponse,
    CourseListResponse,
)
from app.api.deps import get_current_user, get_current_instructor

router = APIRouter()


@router.get("", response_model=CourseListResponse)
async def list_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """
    獲取課程列表
    支援分頁、分類篩選、關鍵字搜尋
    """
    # TODO: Implement course listing
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Course listing not implemented yet",
    )


@router.get("/{course_id}", response_model=CourseDetailResponse)
async def get_course_detail(
    course_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    獲取課程詳情
    包含講師資訊、章節列表、影片 Metadata
    """
    # TODO: Implement course detail
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Course detail not implemented yet",
    )


@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(
    request: CourseCreateRequest,
    current_user=Depends(get_current_instructor),
    db: AsyncSession = Depends(get_db),
):
    """
    建立新課程 (僅講師)
    """
    # TODO: Implement course creation
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Course creation not implemented yet",
    )


@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: UUID,
    request: CourseUpdateRequest,
    current_user=Depends(get_current_instructor),
    db: AsyncSession = Depends(get_db),
):
    """
    更新課程資訊 (僅課程擁有者)
    """
    # TODO: Implement course update
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Course update not implemented yet",
    )


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(
    course_id: UUID,
    current_user=Depends(get_current_instructor),
    db: AsyncSession = Depends(get_db),
):
    """
    刪除課程 (僅課程擁有者)
    """
    # TODO: Implement course deletion
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Course deletion not implemented yet",
    )


@router.post("/{course_id}/publish", response_model=CourseResponse)
async def publish_course(
    course_id: UUID,
    current_user=Depends(get_current_instructor),
    db: AsyncSession = Depends(get_db),
):
    """
    發布課程 (提交審核)
    """
    # TODO: Implement course publishing
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Course publishing not implemented yet",
    )


@router.get("/{course_id}/reviews")
async def get_course_reviews(
    course_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """
    獲取課程評價列表
    """
    # TODO: Implement course reviews
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Course reviews not implemented yet",
    )
