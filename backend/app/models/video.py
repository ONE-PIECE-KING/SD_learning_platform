"""
Video and Chapter Models
影片與章節資料表定義
"""
from enum import Enum as PyEnum
from typing import Optional, List, TYPE_CHECKING
from uuid import uuid4, UUID as PyUUID

from sqlalchemy import String, Integer, Boolean, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.course import Course
    from app.models.enrollment import VideoProgress


class VideoStatus(str, PyEnum):
    """影片狀態"""
    UPLOADING = "UPLOADING"      # 上傳中
    PROCESSING = "PROCESSING"    # 處理中 (轉碼)
    READY = "READY"              # 可播放
    FAILED = "FAILED"            # 失敗


class Chapter(Base, TimestampMixin):
    """
    章節資料表

    Attributes:
        id: 主鍵 UUID
        course_id: 所屬課程 ID
        title: 章節標題
        order_index: 排序索引
    """
    __tablename__ = "chapters"

    id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    course_id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    order_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    # Relationships
    course: Mapped["Course"] = relationship(
        "Course",
        back_populates="chapters",
    )
    videos: Mapped[List["Video"]] = relationship(
        "Video",
        back_populates="chapter",
        cascade="all, delete-orphan",
        order_by="Video.order_index",
    )

    def __repr__(self) -> str:
        return f"<Chapter(id={self.id}, title={self.title}, order={self.order_index})>"


class Video(Base, TimestampMixin):
    """
    影片資料表

    Attributes:
        id: 主鍵 UUID
        chapter_id: 所屬章節 ID
        title: 影片標題
        storage_key: MinIO 物件鍵
        thumbnail_url: 縮圖網址
        duration: 影片長度 (秒)
        order_index: 排序索引
        is_preview: 是否為預覽影片 (免費觀看)
        status: 影片狀態
    """
    __tablename__ = "videos"

    id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    chapter_id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("chapters.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    storage_key: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    thumbnail_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    duration: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    order_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    is_preview: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    status: Mapped[VideoStatus] = mapped_column(
        Enum(VideoStatus),
        default=VideoStatus.UPLOADING,
        nullable=False,
    )

    # Relationships
    chapter: Mapped["Chapter"] = relationship(
        "Chapter",
        back_populates="videos",
    )
    progress_records: Mapped[List["VideoProgress"]] = relationship(
        "VideoProgress",
        back_populates="video",
    )

    def __repr__(self) -> str:
        return f"<Video(id={self.id}, title={self.title}, status={self.status})>"
