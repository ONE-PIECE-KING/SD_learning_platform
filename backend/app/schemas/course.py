"""
Course Schemas
課程相關的 Pydantic 模型
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import Field, field_validator

from app.schemas.common import BaseSchema, PaginatedResponse
from app.schemas.user import InstructorPublicProfile


class ChapterBase(BaseSchema):
    """章節基礎資料"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    order_index: int = Field(..., ge=0)


class ChapterResponse(ChapterBase):
    """章節回應"""
    id: UUID
    course_id: UUID
    video_count: int = 0
    total_duration: int = 0  # 秒


class VideoSummary(BaseSchema):
    """影片摘要 (用於章節列表)"""
    id: UUID
    title: str
    duration: int = 0  # 秒
    order_index: int
    is_preview: bool = False


class ChapterWithVideos(ChapterResponse):
    """章節回應 (包含影片列表)"""
    videos: list[VideoSummary] = []


class CourseBase(BaseSchema):
    """課程基礎資料"""
    title: str = Field(..., min_length=1, max_length=200)
    subtitle: Optional[str] = Field(None, max_length=300)
    description: Optional[str] = None
    category: Optional[str] = None
    price: Decimal = Field(..., ge=0)
    is_free: bool = False


class CourseCreateRequest(CourseBase):
    """建立課程請求"""

    @field_validator("price", mode="before")
    @classmethod
    def validate_price(cls, v):
        if isinstance(v, str):
            return Decimal(v)
        return v


class CourseUpdateRequest(BaseSchema):
    """更新課程請求"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    subtitle: Optional[str] = Field(None, max_length=300)
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[Decimal] = Field(None, ge=0)
    is_free: Optional[bool] = None
    thumbnail_url: Optional[str] = None


class CourseResponse(CourseBase):
    """課程回應"""
    id: UUID
    creator_id: UUID
    status: str = Field(..., examples=["draft", "pending_review", "published", "archived"])
    thumbnail_url: Optional[str] = None
    total_duration: int = 0  # 秒
    total_videos: int = 0
    total_chapters: int = 0
    average_rating: Optional[float] = None
    total_reviews: int = 0
    total_enrollments: int = 0
    created_at: datetime
    updated_at: datetime


class CourseDetailResponse(CourseResponse):
    """課程詳情回應"""
    instructor: InstructorPublicProfile
    chapters: list[ChapterWithVideos] = []
    requirements: Optional[str] = None
    target_audience: Optional[str] = None
    learning_objectives: Optional[str] = None


class CourseListResponse(PaginatedResponse[CourseResponse]):
    """課程列表回應"""
    pass


class CourseSummary(BaseSchema):
    """課程摘要 (用於列表顯示)"""
    id: UUID
    title: str
    thumbnail_url: Optional[str] = None
    instructor_name: str
    price: Decimal
    is_free: bool
    average_rating: Optional[float] = None
    total_enrollments: int = 0
