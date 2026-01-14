"""
Course Model
課程資料表定義
"""
from decimal import Decimal
from enum import Enum as PyEnum
from typing import Optional, List, TYPE_CHECKING
from uuid import uuid4, UUID as PyUUID

from sqlalchemy import String, Text, Numeric, Integer, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.video import Chapter
    from app.models.enrollment import Enrollment
    from app.models.order import Order
    from app.models.review import CourseReview


class CourseStatus(str, PyEnum):
    """課程狀態"""
    DRAFT = "DRAFT"            # 草稿
    PENDING = "PENDING"        # 待審核
    PUBLISHED = "PUBLISHED"    # 已上架
    REJECTED = "REJECTED"      # 已退回


class CourseCategory(str, PyEnum):
    """課程分類"""
    SOFTWARE_DEV = "SOFTWARE_DEV"    # 軟體開發
    DATA_SCIENCE = "DATA_SCIENCE"    # 資料科學
    DESIGN = "DESIGN"                # 設計
    MARKETING = "MARKETING"          # 行銷
    BUSINESS = "BUSINESS"            # 商業
    OTHER = "OTHER"                  # 其他


class Course(Base, TimestampMixin):
    """
    課程資料表

    Attributes:
        id: 主鍵 UUID
        creator_id: 課程創建者 ID
        title: 課程標題
        description: 課程描述
        cover_image: 封面圖片網址
        price: 價格 (TWD)
        status: 課程狀態
        category: 課程分類
        total_duration: 總時長 (秒)
    """
    __tablename__ = "courses"

    id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    creator_id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    cover_image: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )
    status: Mapped[CourseStatus] = mapped_column(
        Enum(CourseStatus),
        default=CourseStatus.DRAFT,
        nullable=False,
        index=True,
    )
    category: Mapped[CourseCategory] = mapped_column(
        Enum(CourseCategory),
        default=CourseCategory.OTHER,
        nullable=False,
    )
    total_duration: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    # Relationships
    creator: Mapped["User"] = relationship(
        "User",
        back_populates="courses",
    )
    chapters: Mapped[List["Chapter"]] = relationship(
        "Chapter",
        back_populates="course",
        cascade="all, delete-orphan",
        order_by="Chapter.order_index",
    )
    enrollments: Mapped[List["Enrollment"]] = relationship(
        "Enrollment",
        back_populates="course",
    )
    orders: Mapped[List["Order"]] = relationship(
        "Order",
        back_populates="course",
    )
    review: Mapped[Optional["CourseReview"]] = relationship(
        "CourseReview",
        back_populates="course",
        uselist=False,
    )

    def __repr__(self) -> str:
        return f"<Course(id={self.id}, title={self.title}, status={self.status})>"
