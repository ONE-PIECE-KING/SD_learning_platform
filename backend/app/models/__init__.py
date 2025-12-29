# backend/app/models/__init__.py
"""
SQLAlchemy Models - 所有資料模型的統一導出
"""
from .base import Base, TimestampMixin

# 用戶相關
from .user import User, UserRole, UserStatus
from .oauth import OAuthAccount

# 課程相關
from .course import Course, CourseStatus, CourseCategory
from .video import Chapter, Video, VideoStatus

# 訂單相關
from .order import Order, OrderStatus, Payment

# 報名與進度
from .enrollment import Enrollment, VideoProgress

# 審核相關
from .review import CourseReview, ReviewStatus, AIReviewResult, AIReviewStatus

# 稽核日誌
from .audit import AuditLog


__all__ = [
    # Base
    "Base",
    "TimestampMixin",
    # User
    "User",
    "UserRole",
    "UserStatus",
    "OAuthAccount",
    # Course
    "Course",
    "CourseStatus",
    "CourseCategory",
    "Chapter",
    "Video",
    "VideoStatus",
    # Order
    "Order",
    "OrderStatus",
    "Payment",
    # Enrollment
    "Enrollment",
    "VideoProgress",
    # Review
    "CourseReview",
    "ReviewStatus",
    "AIReviewResult",
    "AIReviewStatus",
    # Audit
    "AuditLog",
]
