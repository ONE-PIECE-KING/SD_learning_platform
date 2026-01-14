"""
Enrollment and VideoProgress Models
報名與學習進度資料表定義
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional, List, TYPE_CHECKING
from uuid import uuid4, UUID as PyUUID

from sqlalchemy import Numeric, Boolean, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.course import Course
    from app.models.order import Order
    from app.models.video import Video


class Enrollment(Base):
    """
    課程報名資料表

    Attributes:
        id: 主鍵 UUID
        user_id: 報名用戶 ID
        course_id: 報名課程 ID
        order_id: 對應訂單 ID
        progress_percentage: 進度百分比 (0-100)
        last_accessed_at: 最後存取時間
    """
    __tablename__ = "enrollments"

    id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    user_id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    course_id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("courses.id"),
        nullable=False,
        index=True,
    )
    order_id: Mapped[Optional[PyUUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("orders.id"),
        unique=True,
        nullable=True,  # 免費課程可能沒有訂單
    )
    progress_percentage: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        default=Decimal("0.00"),
        nullable=False,
    )
    last_accessed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        nullable=True,
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="enrollments",
    )
    course: Mapped["Course"] = relationship(
        "Course",
        back_populates="enrollments",
    )
    order: Mapped[Optional["Order"]] = relationship(
        "Order",
        back_populates="enrollment",
    )
    video_progress: Mapped[List["VideoProgress"]] = relationship(
        "VideoProgress",
        back_populates="enrollment",
        cascade="all, delete-orphan",
    )

    # Constraints - 同一用戶只能報名同一課程一次
    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "course_id",
            name="uq_enrollment_user_course",
        ),
    )

    def __repr__(self) -> str:
        return f"<Enrollment(user_id={self.user_id}, course_id={self.course_id})>"


class VideoProgress(Base):
    """
    影片觀看進度資料表

    Attributes:
        id: 主鍵 UUID
        enrollment_id: 報名記錄 ID
        video_id: 影片 ID
        watched_seconds: 已觀看秒數
        completed: 是否完成
        last_watched_at: 最後觀看時間
    """
    __tablename__ = "video_progress"

    id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    enrollment_id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("enrollments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    video_id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("videos.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    watched_seconds: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    last_watched_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        nullable=True,
    )

    # Relationships
    enrollment: Mapped["Enrollment"] = relationship(
        "Enrollment",
        back_populates="video_progress",
    )
    video: Mapped["Video"] = relationship(
        "Video",
        back_populates="progress_records",
    )

    # Constraints - 同一報名記錄對同一影片只有一筆進度
    __table_args__ = (
        UniqueConstraint(
            "enrollment_id",
            "video_id",
            name="uq_video_progress_enrollment_video",
        ),
    )

    def __repr__(self) -> str:
        return f"<VideoProgress(enrollment_id={self.enrollment_id}, video_id={self.video_id})>"
