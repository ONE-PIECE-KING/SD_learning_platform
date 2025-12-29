# backend/app/api/v1/courses.py
"""
課程 API 端點 (基礎框架)
"""
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.deps import get_db
from app.models import Course, CourseStatus

router = APIRouter()


@router.get("")
async def list_courses(
    page: int = Query(1, ge=1, description="頁碼"),
    page_size: int = Query(10, ge=1, le=50, description="每頁數量"),
    status: Optional[str] = Query(None, description="課程狀態篩選"),
    search: Optional[str] = Query(None, description="搜尋關鍵字"),
    db: AsyncSession = Depends(get_db)
):
    """
    取得課程列表 (分頁)

    - **page**: 頁碼 (從 1 開始)
    - **page_size**: 每頁數量 (1-50)
    - **status**: 篩選課程狀態 (DRAFT, PENDING, PUBLISHED, REJECTED)
    - **search**: 搜尋課程標題
    """
    # 基礎查詢
    query = select(Course)
    count_query = select(func.count(Course.id))

    # 狀態篩選
    if status:
        try:
            course_status = CourseStatus(status)
            query = query.where(Course.status == course_status)
            count_query = count_query.where(Course.status == course_status)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status: {status}"
            )

    # 搜尋
    if search:
        search_pattern = f"%{search}%"
        query = query.where(Course.title.ilike(search_pattern))
        count_query = count_query.where(Course.title.ilike(search_pattern))

    # 計算總數
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # 分頁
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size).order_by(Course.created_at.desc())

    # 執行查詢
    result = await db.execute(query)
    courses = result.scalars().all()

    return {
        "items": [
            {
                "id": str(course.id),
                "title": course.title,
                "description": course.description[:200] + "..." if len(course.description) > 200 else course.description,
                "cover_image": course.cover_image,
                "price": float(course.price),
                "status": course.status.value,
                "category": course.category.value,
                "total_duration": course.total_duration,
                "created_at": course.created_at.isoformat()
            }
            for course in courses
        ],
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": (total + page_size - 1) // page_size
        }
    }


@router.get("/{course_id}")
async def get_course(
    course_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """根據 ID 取得課程詳情"""
    result = await db.execute(
        select(Course)
        .options(selectinload(Course.chapters))
        .where(Course.id == course_id)
    )
    course = result.scalar_one_or_none()

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    return {
        "id": str(course.id),
        "creator_id": str(course.creator_id),
        "title": course.title,
        "description": course.description,
        "cover_image": course.cover_image,
        "price": float(course.price),
        "status": course.status.value,
        "category": course.category.value,
        "total_duration": course.total_duration,
        "chapters": [
            {
                "id": str(chapter.id),
                "title": chapter.title,
                "order_index": chapter.order_index
            }
            for chapter in sorted(course.chapters, key=lambda c: c.order_index)
        ],
        "created_at": course.created_at.isoformat(),
        "updated_at": course.updated_at.isoformat()
    }
