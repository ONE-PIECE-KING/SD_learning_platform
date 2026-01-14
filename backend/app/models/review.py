"""
Course Review and AI Review Result Models
課程審核與 AI 審核結果資料表定義
"""
from datetime import datetime
from decimal import Decimal
from enum import Enum as PyEnum
from typing import Optional, Any, TYPE_CHECKING
from uuid import uuid4, UUID as PyUUID

from sqlalchemy import String, Text, Numeric, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.course import Course
    from app.models.user import User


class ReviewStatus(str, PyEnum):
    """審核狀態"""
    PENDING = "PENDING"      # 待審核
    APPROVED = "APPROVED"    # 已通過
    REJECTED = "REJECTED"    # 已退回


class AIReviewStatus(str, PyEnum):
    """AI 審核結果狀態"""
    PASSED = "PASSED"      # 通過
    WARNING = "WARNING"    # 警告
    FAILED = "FAILED"      # 失敗


class CourseReview(Base, TimestampMixin):
    """
    課程審核資料表

    Attributes:
        id: 主鍵 UUID
        course_id: 課程 ID (唯一)
        reviewer_id: 審核管理員 ID (可為空)
        status: 審核狀態
        feedback: 審核意見
        reviewed_at: 審核時間
    """
    __tablename__ = "course_reviews"

    id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    course_id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("courses.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    reviewer_id: Mapped[Optional[PyUUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    status: Mapped[ReviewStatus] = mapped_column(
        Enum(ReviewStatus),
        default=ReviewStatus.PENDING,
        nullable=False,
    )
    feedback: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        nullable=True,
    )

    # Relationships
    course: Mapped["Course"] = relationship(
        "Course",
        back_populates="review",
    )
    reviewer: Mapped[Optional["User"]] = relationship(
        "User",
    )
    ai_result: Mapped[Optional["AIReviewResult"]] = relationship(
        "AIReviewResult",
        back_populates="course_review",
        uselist=False,
    )

    def __repr__(self) -> str:
        return f"<CourseReview(course_id={self.course_id}, status={self.status})>"


class AIReviewResult(Base):
    """
    AI 審核結果資料表

    Attributes:
        id: 主鍵 UUID
        course_review_id: 課程審核 ID (唯一)
        status: AI 審核結果狀態
        confidence_score: 信心分數 (0.00-1.00)
        issues: 違規項目列表 (JSON)
        raw_response: AI 原始回應 (JSON)
        created_at: 建立時間
    """
    __tablename__ = "ai_review_results"

    id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    course_review_id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("course_reviews.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    status: Mapped[AIReviewStatus] = mapped_column(
        Enum(AIReviewStatus),
        nullable=False,
    )
    confidence_score: Mapped[Decimal] = mapped_column(
        Numeric(3, 2),
        nullable=False,
    )
    issues: Mapped[Optional[Any]] = mapped_column(
        JSON,
        nullable=True,
    )
    raw_response: Mapped[Optional[Any]] = mapped_column(
        JSON,
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    # Relationships
    course_review: Mapped["CourseReview"] = relationship(
        "CourseReview",
        back_populates="ai_result",
    )

    def __repr__(self) -> str:
        return f"<AIReviewResult(course_review_id={self.course_review_id}, status={self.status})>"
