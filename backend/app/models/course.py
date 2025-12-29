# backend/app/models/course.py
"""
課程資料模型
"""
from enum import Enum as PyEnum
from sqlalchemy import Column, String, Text, Numeric, Integer, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from .base import Base, TimestampMixin


class CourseStatus(str, PyEnum):
    """課程狀態"""
    DRAFT = "DRAFT"                # 草稿
    PENDING_REVIEW = "PENDING"     # 待審核
    PUBLISHED = "PUBLISHED"        # 已上架
    REJECTED = "REJECTED"          # 已退回


class CourseCategory(str, PyEnum):
    """課程類別"""
    SOFTWARE_DEV = "SOFTWARE_DEV"  # 軟體開發
    DATA_SCIENCE = "DATA_SCIENCE"  # 資料科學
    OTHER = "OTHER"                # 其他


class Course(Base, TimestampMixin):
    """課程資料表"""
    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    creator_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    cover_image = Column(String(500), nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(CourseStatus), default=CourseStatus.DRAFT, nullable=False)
    category = Column(Enum(CourseCategory), default=CourseCategory.OTHER, nullable=False)
    total_duration = Column(Integer, default=0)  # 總時長 (秒)

    # 關聯
    creator = relationship("User", back_populates="courses")
    chapters = relationship("Chapter", back_populates="course", cascade="all, delete-orphan", order_by="Chapter.order_index")
    enrollments = relationship("Enrollment", back_populates="course")
    orders = relationship("Order", back_populates="course")
    review = relationship("CourseReview", back_populates="course", uselist=False)
