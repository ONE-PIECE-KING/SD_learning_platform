# backend/app/models/review.py
"""
課程審核與 AI 審核結果資料模型
"""
from enum import Enum as PyEnum
from sqlalchemy import Column, Text, Numeric, Enum, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship
from uuid import uuid4
from .base import Base, TimestampMixin


class ReviewStatus(str, PyEnum):
    """審核狀態"""
    PENDING = "PENDING"    # 待審核
    APPROVED = "APPROVED"  # 已通過
    REJECTED = "REJECTED"  # 已退回


class AIReviewStatus(str, PyEnum):
    """AI 審核結果狀態"""
    PASSED = "PASSED"    # 通過
    WARNING = "WARNING"  # 警告 (需人工注意)
    FAILED = "FAILED"    # 未通過


class CourseReview(Base, TimestampMixin):
    """課程審核單"""
    __tablename__ = "course_reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), unique=True, nullable=False)
    reviewer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)  # 審核的管理員
    status = Column(Enum(ReviewStatus), default=ReviewStatus.PENDING, nullable=False)
    feedback = Column(Text, nullable=True)  # 審核意見
    reviewed_at = Column(DateTime, nullable=True)

    # 關聯
    course = relationship("Course", back_populates="review")
    reviewer = relationship("User")
    ai_result = relationship("AIReviewResult", back_populates="course_review", uselist=False)


class AIReviewResult(Base, TimestampMixin):
    """AI 審核結果"""
    __tablename__ = "ai_review_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    course_review_id = Column(UUID(as_uuid=True), ForeignKey("course_reviews.id", ondelete="CASCADE"), unique=True, nullable=False)
    status = Column(Enum(AIReviewStatus), nullable=False)
    confidence_score = Column(Numeric(3, 2), nullable=False)  # 0.00 ~ 1.00
    issues = Column(JSON, nullable=True)  # 違規項目 [{ "time": 123, "reason": "..." }]
    raw_response = Column(JSON, nullable=True)  # AI 原始回應

    # 關聯
    course_review = relationship("CourseReview", back_populates="ai_result")
