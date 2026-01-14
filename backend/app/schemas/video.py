"""
Video Schemas
影片相關的 Pydantic 模型
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import Field

from app.schemas.common import BaseSchema


class VideoBase(BaseSchema):
    """影片基礎資料"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    order_index: int = Field(..., ge=0)
    is_preview: bool = False


class VideoResponse(VideoBase):
    """影片回應"""
    id: UUID
    chapter_id: UUID
    course_id: UUID
    duration: int = 0  # 秒
    status: str = Field(..., examples=["uploading", "processing", "ready", "failed"])
    thumbnail_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class VideoDetailResponse(VideoResponse):
    """影片詳情回應"""
    original_filename: Optional[str] = None
    file_size: Optional[int] = None
    resolution: Optional[str] = None
    error_message: Optional[str] = None


class VideoUploadInitResponse(BaseSchema):
    """影片上傳初始化回應"""
    video_id: UUID
    upload_url: str  # Presigned URL for upload
    upload_id: Optional[str] = None  # For multipart upload
    expires_in: int = 3600  # URL expiration in seconds


class VideoUploadPartResponse(BaseSchema):
    """分段上傳回應"""
    part_number: int
    upload_url: str
    expires_in: int = 3600


class VideoStreamResponse(BaseSchema):
    """影片串流回應"""
    video_id: UUID
    stream_url: str  # HLS manifest URL
    expires_in: int = 3600
    resolutions: list[str] = Field(default_factory=list, examples=[["720p", "1080p"]])


class VideoProgressUpdateRequest(BaseSchema):
    """更新觀看進度請求"""
    current_position: int = Field(..., ge=0, description="當前播放位置 (秒)")
    completed: bool = False


class VideoProgressResponse(BaseSchema):
    """觀看進度回應"""
    video_id: UUID
    user_id: UUID
    current_position: int = 0
    completed: bool = False
    last_watched_at: datetime


class TranscodeCallbackRequest(BaseSchema):
    """轉碼回調請求"""
    video_id: UUID
    status: str = Field(..., examples=["completed", "failed"])
    output_path: Optional[str] = None
    duration: Optional[int] = None
    resolutions: list[str] = Field(default_factory=list)
    error_message: Optional[str] = None
