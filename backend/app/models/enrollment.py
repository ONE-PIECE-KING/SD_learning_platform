# backend/app/models/enrollment.py
"""
報名記錄與觀看進度資料模型
"""
from sqlalchemy import Column, Numeric, Boolean, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime
from .base import Base


class Enrollment(Base):
    """報名記錄表 (用戶擁有的課程)"""
    __tablename__ = "enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), unique=True, nullable=False)
    progress_percentage = Column(Numeric(5, 2), default=0)  # 進度百分比
    last_accessed_at = Column(DateTime, default=datetime.utcnow)

    # 關聯
    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    order = relationship("Order", back_populates="enrollment")
    video_progress = relationship("VideoProgress", back_populates="enrollment", cascade="all, delete-orphan")

    __table_args__ = (
        # 同一用戶只能報名同一課程一次
        UniqueConstraint("user_id", "course_id", name="uq_enrollment_user_course"),
    )


class VideoProgress(Base):
    """影片觀看進度"""
    __tablename__ = "video_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    enrollment_id = Column(UUID(as_uuid=True), ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False)
    video_id = Column(UUID(as_uuid=True), ForeignKey("videos.id", ondelete="CASCADE"), nullable=False)
    watched_seconds = Column(Integer, default=0)  # 已觀看秒數
    completed = Column(Boolean, default=False)
    last_watched_at = Column(DateTime, default=datetime.utcnow)

    # 關聯
    enrollment = relationship("Enrollment", back_populates="video_progress")
    video = relationship("Video", back_populates="progress_records")

    __table_args__ = (
        UniqueConstraint("enrollment_id", "video_id", name="uq_progress_enrollment_video"),
    )
