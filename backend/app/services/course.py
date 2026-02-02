"""
Course Service
處理課程相關的業務邏輯
"""
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.course import CourseRepository
from app.models.course import CourseStatus

class CourseService:
    def __init__(self, db: AsyncSession):
        self.repository = CourseRepository(db)

    async def get_courses(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        search: Optional[str] = None,
        category: Optional[str] = None,
        only_published: bool = True
    ):
        """
        獲取課程列表，預設僅查看已發布課程
        """
        status = CourseStatus.PUBLISHED if only_published else None
        
        courses, total = await self.repository.list(
            skip=skip,
            limit=limit,
            search=search,
            category=category,
            status=status
        )
        
        return {
            "items": courses,
            "total": total,
            "skip": skip,
            "limit": limit,
            "has_more": total > (skip + limit)
        }

    async def get_course_detail(self, course_id):
        """
        獲取特定課程詳情
        """
        return await self.repository.get_by_id(course_id)
