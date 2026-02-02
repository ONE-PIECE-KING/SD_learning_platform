"""
Course Repository
處理課程相關的資料庫操作
"""
from typing import List, Optional, Tuple
from sqlalchemy import select, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.course import Course, CourseStatus

class CourseRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        search: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[CourseStatus] = None
    ) -> Tuple[List[Course], int]:
        """
        列表查詢，支援關鍵字搜尋、分類過濾與分頁
        """
        query = select(Course)
        
        # 狀態過濾
        if status:
            query = query.where(Course.status == status)
            
        # 分類過濾
        if category:
            query = query.where(Course.category == category)
            
        # 關鍵字搜尋 (標題或描述)
        if search:
            search_filter = or_(
                Course.title.ilike(f"%{search}%"),
                Course.description.ilike(f"%{search}%")
            )
            query = query.where(search_filter)
            
        # 獲取總筆數
        count_query = select(func.count()).select_from(query.subquery())
        total = await self.db.scalar(count_query)
        
        # 排序 (預設最新優先)
        query = query.order_by(Course.created_at.desc())
        
        # 分頁執行
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        
        return list(result.scalars().all()), total or 0

    async def get_by_id(self, course_id) -> Optional[Course]:
        """
        透過 ID 獲取課程詳情
        """
        query = select(Course).where(Course.id == course_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
