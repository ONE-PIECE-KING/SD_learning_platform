"""
Pydantic Schemas Module
統一匯出所有 Schema
"""
from app.schemas.common import (
    BaseSchema,
    TimestampSchema,
    HealthResponse,
    DetailedHealthResponse,
    ErrorResponse,
    ValidationErrorResponse,
    PaginatedResponse,
    MessageResponse,
    IDResponse,
)
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    TokenResponse,
    TokenRefreshRequest,
    TokenPayload,
    GoogleOAuthRequest,
    OAuthUserInfo,
)
from app.schemas.user import (
    UserResponse,
    UserDetailResponse,
    UserUpdateRequest,
    UserListResponse,
    InstructorPublicProfile,
)
from app.schemas.course import (
    CourseCreateRequest,
    CourseUpdateRequest,
    CourseResponse,
    CourseDetailResponse,
    CourseListResponse,
    CourseSummary,
    ChapterResponse,
    ChapterWithVideos,
    VideoSummary,
)
from app.schemas.video import (
    VideoResponse,
    VideoDetailResponse,
    VideoUploadInitResponse,
    VideoStreamResponse,
    VideoProgressUpdateRequest,
    VideoProgressResponse,
    TranscodeCallbackRequest,
)
from app.schemas.enrollment import (
    EnrollmentResponse,
    EnrollmentDetailResponse,
    EnrollmentListResponse,
    OrderCreateRequest,
    OrderResponse,
    OrderDetailResponse,
    PaymentInitResponse,
    PaymentCallbackRequest,
    PaymentStatusResponse,
)

__all__ = [
    # Common
    "BaseSchema",
    "TimestampSchema",
    "HealthResponse",
    "DetailedHealthResponse",
    "ErrorResponse",
    "ValidationErrorResponse",
    "PaginatedResponse",
    "MessageResponse",
    "IDResponse",
    # Auth
    "LoginRequest",
    "LoginResponse",
    "RegisterRequest",
    "TokenResponse",
    "TokenRefreshRequest",
    "TokenPayload",
    "GoogleOAuthRequest",
    "OAuthUserInfo",
    # User
    "UserResponse",
    "UserDetailResponse",
    "UserUpdateRequest",
    "UserListResponse",
    "InstructorPublicProfile",
    # Course
    "CourseCreateRequest",
    "CourseUpdateRequest",
    "CourseResponse",
    "CourseDetailResponse",
    "CourseListResponse",
    "CourseSummary",
    "ChapterResponse",
    "ChapterWithVideos",
    "VideoSummary",
    # Video
    "VideoResponse",
    "VideoDetailResponse",
    "VideoUploadInitResponse",
    "VideoStreamResponse",
    "VideoProgressUpdateRequest",
    "VideoProgressResponse",
    "TranscodeCallbackRequest",
    # Enrollment
    "EnrollmentResponse",
    "EnrollmentDetailResponse",
    "EnrollmentListResponse",
    "OrderCreateRequest",
    "OrderResponse",
    "OrderDetailResponse",
    "PaymentInitResponse",
    "PaymentCallbackRequest",
    "PaymentStatusResponse",
]
