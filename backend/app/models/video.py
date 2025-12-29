# backend/app/models/video.py
"""
章節與影片資料模型
"""
from enum import Enum as PyEnum
from sqlalchemy import Column, String, Integer, Boolean, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from .base import Base, TimestampMixin


class VideoStatus(str, PyEnum):
    """影片處理狀態"""
    UPLOADING = "UPLOADING"    # 上傳中
    PROCESSING = "PROCESSING"  # 處理中
    READY = "READY"            # 可播放
    FAILED = "FAILED"          # 失敗


class Chapter(Base, TimestampMixin):
    """章節資料表"""
    __tablename__ = "chapters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    order_index = Column(Integer, nullable=False)

    # 關聯
    course = relationship("Course", back_populates="chapters")
    videos = relationship("Video", back_populates="chapter", cascade="all, delete-orphan", order_by="Video.order_index")


class Video(Base, TimestampMixin):
    """影片資料表"""
    __tablename__ = "videos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    chapter_id = Column(UUID(as_uuid=True), ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    storage_key = Column(String(500), nullable=False)  # MinIO object key
    thumbnail_url = Column(String(500), nullable=True)
    duration = Column(Integer, default=0)  # 影片長度 (秒)
    order_index = Column(Integer, nullable=False)
    is_preview = Column(Boolean, default=False)  # 是否為預覽影片
    status = Column(Enum(VideoStatus), default=VideoStatus.UPLOADING, nullable=False)

    # 關聯
    chapter = relationship("Chapter", back_populates="videos")
    progress_records = relationship("VideoProgress", back_populates="video", cascade="all, delete-orphan")
