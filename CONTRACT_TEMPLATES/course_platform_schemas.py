"""
============================================================
線上課程平台 MVP - Python Pydantic 模型定義
============================================================
自動生成自: course_platform_api_contract.yaml
版本: v1.0.0
更新日期: 2025-12-29

使用說明:
1. 後端專案直接 import 此檔案使用
2. 與前端 API 契約保持同步
3. 任何變更需經過前後端 Review
============================================================
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, EmailStr, Field, HttpUrl


# ============================================================
# 列舉型別
# ============================================================

class UserRole(str, Enum):
    """用戶角色"""
    STUDENT = "student"
    INSTRUCTOR = "instructor"
    ADMIN = "admin"


class CourseStatus(str, Enum):
    """課程狀態"""
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class VideoStatus(str, Enum):
    """影片狀態"""
    PENDING_UPLOAD = "pending_upload"
    UPLOADING = "uploading"
    TRANSCODING = "transcoding"
    READY = "ready"
    FAILED = "failed"


class ResolutionStatus(str, Enum):
    """解析度處理狀態"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class VideoMimeType(str, Enum):
    """支援的影片格式"""
    MP4 = "video/mp4"
    QUICKTIME = "video/quicktime"
    AVI = "video/x-msvideo"


class EnrollmentStatusFilter(str, Enum):
    """報名狀態篩選"""
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ALL = "all"


class SortBy(str, Enum):
    """排序欄位"""
    CREATED_AT = "createdAt"
    TITLE = "title"
    ENROLLMENT_COUNT = "enrollmentCount"


class SortOrder(str, Enum):
    """排序方向"""
    ASC = "asc"
    DESC = "desc"


# ============================================================
# 錯誤代碼
# ============================================================

class APIErrorCode(str, Enum):
    """API 錯誤代碼"""
    # 通用錯誤
    VALIDATION_ERROR = "VALIDATION_ERROR"
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"
    NOT_FOUND = "NOT_FOUND"
    INTERNAL_ERROR = "INTERNAL_ERROR"

    # 認證相關
    INVALID_TOKEN = "INVALID_TOKEN"
    INVALID_REFRESH_TOKEN = "INVALID_REFRESH_TOKEN"

    # 用戶相關
    USER_EMAIL_EXISTS = "USER_EMAIL_EXISTS"

    # 課程相關
    INSTRUCTOR_REQUIRED = "INSTRUCTOR_REQUIRED"
    COURSE_HAS_ENROLLMENTS = "COURSE_HAS_ENROLLMENTS"

    # 報名相關
    ALREADY_ENROLLED = "ALREADY_ENROLLED"
    NOT_ENROLLED = "NOT_ENROLLED"


# ============================================================
# 基礎模型
# ============================================================

class BaseResponse(BaseModel):
    """基礎回應格式"""
    success: bool


T = TypeVar("T")


class SuccessResponse(BaseResponse, Generic[T]):
    """成功回應 (泛型)"""
    success: bool = True
    data: T


class ErrorDetail(BaseModel):
    """錯誤詳情"""
    field: str
    message: str


class ErrorInfo(BaseModel):
    """錯誤資訊"""
    code: str
    message: str
    details: Optional[List[ErrorDetail]] = None


class ErrorResponse(BaseResponse):
    """錯誤回應"""
    success: bool = False
    error: ErrorInfo


class Pagination(BaseModel):
    """分頁資訊"""
    page: int = Field(..., ge=1)
    limit: int = Field(..., ge=1)
    total: int = Field(..., ge=0)
    totalPages: int = Field(..., ge=0)


class PaginatedData(BaseModel, Generic[T]):
    """分頁資料容器"""
    items: List[T]
    pagination: Pagination


# ============================================================
# 用戶模組 (Users)
# ============================================================

class User(BaseModel):
    """用戶資料"""
    id: str = Field(..., pattern=r"^usr_[a-zA-Z0-9]+$")
    email: EmailStr
    name: str = Field(..., max_length=100)
    avatar: Optional[HttpUrl] = None
    role: UserRole
    bio: Optional[str] = Field(None, max_length=500)
    createdAt: datetime
    updatedAt: Optional[datetime] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class UserPublic(BaseModel):
    """用戶公開資料"""
    id: str
    name: str
    avatar: Optional[HttpUrl] = None
    bio: Optional[str] = None
    courseCount: Optional[int] = None


class UpdateUserRequest(BaseModel):
    """更新用戶請求"""
    name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)


class UserResponse(SuccessResponse[User]):
    """用戶回應"""
    pass


class UserPublicResponse(SuccessResponse[UserPublic]):
    """用戶公開資料回應"""
    pass


# ============================================================
# 認證模組 (Auth)
# ============================================================

class GoogleAuthRequest(BaseModel):
    """Google 登入請求"""
    idToken: str


class AuthData(BaseModel):
    """認證資料"""
    accessToken: str
    refreshToken: str
    expiresIn: int = Field(..., description="Access Token 有效秒數")
    user: User


class AuthResponse(SuccessResponse[AuthData]):
    """認證回應"""
    pass


class RefreshTokenRequest(BaseModel):
    """刷新 Token 請求"""
    refreshToken: str


# ============================================================
# 課程模組 (Courses)
# ============================================================

class InstructorInfo(BaseModel):
    """講師資訊"""
    id: str
    name: str
    avatar: Optional[HttpUrl] = None
    bio: Optional[str] = None


class Course(BaseModel):
    """課程基本資料"""
    id: str = Field(..., pattern=r"^crs_[a-zA-Z0-9]+$")
    title: str = Field(..., max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    thumbnail: Optional[HttpUrl] = None
    instructorId: str
    duration: int = Field(0, description="總時長 (秒)")
    videoCount: int = 0
    enrollmentCount: int = 0
    status: CourseStatus
    createdAt: datetime
    updatedAt: Optional[datetime] = None


class CourseWithInstructor(Course):
    """課程 (含講師資訊)"""
    instructor: InstructorInfo


class VideoMeta(BaseModel):
    """影片元資料 (列表顯示用)"""
    id: str = Field(..., pattern=r"^vid_[a-zA-Z0-9]+$")
    title: str = Field(..., max_length=200)
    duration: Optional[int] = Field(None, description="時長 (秒)")
    order: int
    status: VideoStatus
    thumbnail: Optional[HttpUrl] = None


class Section(BaseModel):
    """課程章節"""
    id: str = Field(..., pattern=r"^sec_[a-zA-Z0-9]+$")
    title: str
    order: int
    videos: List[VideoMeta] = []


class CourseDetail(CourseWithInstructor):
    """課程詳情 (含章節)"""
    sections: List[Section] = []


class CourseListData(BaseModel):
    """課程列表資料"""
    courses: List[CourseWithInstructor]
    pagination: Pagination


class CourseListResponse(SuccessResponse[CourseListData]):
    """課程列表回應"""
    pass


class CourseResponse(SuccessResponse[CourseWithInstructor]):
    """課程回應"""
    pass


class CourseDetailResponse(SuccessResponse[CourseDetail]):
    """課程詳情回應"""
    pass


class GetCoursesParams(BaseModel):
    """課程列表查詢參數"""
    page: int = Field(1, ge=1)
    limit: int = Field(12, ge=1, le=50)
    search: Optional[str] = Field(None, max_length=100)
    category: Optional[str] = None
    sortBy: SortBy = SortBy.CREATED_AT
    sortOrder: SortOrder = SortOrder.DESC


class CreateCourseRequest(BaseModel):
    """建立課程請求"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    thumbnail: Optional[HttpUrl] = None


class UpdateCourseRequest(BaseModel):
    """更新課程請求"""
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    thumbnail: Optional[HttpUrl] = None
    status: Optional[CourseStatus] = None


# ============================================================
# 影片模組 (Videos)
# ============================================================

class Video(VideoMeta):
    """影片完整資料"""
    courseId: str
    sectionId: Optional[str] = None
    originalFilename: Optional[str] = None
    fileSize: Optional[int] = Field(None, description="檔案大小 (bytes)")
    createdAt: datetime
    updatedAt: Optional[datetime] = None


class VideoListData(BaseModel):
    """影片列表資料"""
    videos: List[Video]


class VideoListResponse(SuccessResponse[VideoListData]):
    """影片列表回應"""
    pass


class VideoResponse(SuccessResponse[Video]):
    """影片回應"""
    pass


class CreateVideoRequest(BaseModel):
    """建立影片請求"""
    title: str = Field(..., max_length=200)
    sectionId: Optional[str] = None
    filename: str
    fileSize: int = Field(..., le=5368709120, description="最大 5GB")
    mimeType: VideoMimeType


class UpdateVideoRequest(BaseModel):
    """更新影片請求"""
    title: Optional[str] = Field(None, max_length=200)
    sectionId: Optional[str] = None
    order: Optional[int] = None


class UploadInfo(BaseModel):
    """上傳資訊"""
    uploadId: str
    signedUrl: str
    expiresAt: datetime
    chunkSize: Optional[int] = Field(None, description="建議分段大小 (bytes)")
    totalChunks: Optional[int] = None


class VideoUploadData(BaseModel):
    """影片上傳回應資料"""
    id: str
    title: str
    status: VideoStatus
    upload: UploadInfo


class VideoUploadResponse(SuccessResponse[VideoUploadData]):
    """影片上傳回應"""
    pass


class CompleteUploadRequest(BaseModel):
    """完成上傳請求"""
    uploadId: str


class ResolutionProgressInfo(BaseModel):
    """解析度處理進度"""
    resolution: str  # "720p" or "1080p"
    status: ResolutionStatus


class VideoStatusData(BaseModel):
    """影片狀態資料"""
    id: str
    status: VideoStatus
    progress: Optional[int] = Field(None, ge=0, le=100)
    resolutions: Optional[List[ResolutionProgressInfo]] = None
    estimatedCompletion: Optional[datetime] = None
    errorMessage: Optional[str] = None


class VideoStatusResponse(SuccessResponse[VideoStatusData]):
    """影片狀態回應"""
    pass


# ============================================================
# 播放模組 (Playback)
# ============================================================

class ResolutionOption(BaseModel):
    """解析度選項"""
    label: str
    url: str


class Progress(BaseModel):
    """播放進度"""
    position: int = Field(..., ge=0, description="播放位置 (秒)")
    completed: bool = False


class PlaybackData(BaseModel):
    """播放資訊"""
    videoId: str
    title: str
    duration: int
    hlsUrl: str = Field(..., description="HLS 主播放清單 URL (帶 Token)")
    resolutions: List[ResolutionOption]
    expiresAt: datetime
    progress: Optional[Progress] = None


class PlaybackResponse(SuccessResponse[PlaybackData]):
    """播放資訊回應"""
    pass


class ProgressResponse(SuccessResponse[Progress]):
    """進度回應"""
    pass


class UpdateProgressRequest(BaseModel):
    """更新進度請求"""
    position: int = Field(..., ge=0, description="當前播放位置 (秒)")
    duration: Optional[int] = Field(None, description="影片總長度 (秒)")


# ============================================================
# 報名模組 (Enrollments)
# ============================================================

class Enrollment(BaseModel):
    """報名記錄"""
    id: str = Field(..., pattern=r"^enr_[a-zA-Z0-9]+$")
    userId: str
    courseId: str
    progress: float = Field(0, ge=0, le=100, description="課程完成進度百分比")
    completedVideos: int = 0
    totalVideos: int = 0
    enrolledAt: datetime
    completedAt: Optional[datetime] = None


class EnrollmentWithCourse(Enrollment):
    """報名記錄 (含課程資訊)"""
    course: CourseWithInstructor


class EnrollmentListData(BaseModel):
    """報名列表資料"""
    enrollments: List[EnrollmentWithCourse]
    pagination: Pagination


class EnrollmentListResponse(SuccessResponse[EnrollmentListData]):
    """報名列表回應"""
    pass


class EnrollmentResponse(SuccessResponse[Enrollment]):
    """報名回應"""
    pass


class GetEnrollmentsParams(BaseModel):
    """報名列表查詢參數"""
    page: int = Field(1, ge=1)
    limit: int = Field(12, ge=1)
    status: EnrollmentStatusFilter = EnrollmentStatusFilter.ALL


class EnrollCourseRequest(BaseModel):
    """報名請求"""
    courseId: str


# ============================================================
# 工具函式
# ============================================================

def create_error_response(
    code: APIErrorCode | str,
    message: str,
    details: Optional[List[ErrorDetail]] = None
) -> ErrorResponse:
    """建立錯誤回應"""
    return ErrorResponse(
        error=ErrorInfo(
            code=code if isinstance(code, str) else code.value,
            message=message,
            details=details
        )
    )


def create_success_response(data: T) -> SuccessResponse[T]:
    """建立成功回應"""
    return SuccessResponse(data=data)


# ============================================================
# ID 生成輔助
# ============================================================

import secrets


def generate_user_id() -> str:
    """生成用戶 ID"""
    return f"usr_{secrets.token_urlsafe(8)}"


def generate_course_id() -> str:
    """生成課程 ID"""
    return f"crs_{secrets.token_urlsafe(8)}"


def generate_video_id() -> str:
    """生成影片 ID"""
    return f"vid_{secrets.token_urlsafe(8)}"


def generate_section_id() -> str:
    """生成章節 ID"""
    return f"sec_{secrets.token_urlsafe(8)}"


def generate_enrollment_id() -> str:
    """生成報名 ID"""
    return f"enr_{secrets.token_urlsafe(8)}"


def generate_upload_id() -> str:
    """生成上傳 ID"""
    return f"upload_{secrets.token_urlsafe(12)}"
