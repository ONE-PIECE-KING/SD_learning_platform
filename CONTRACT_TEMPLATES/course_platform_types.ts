/**
 * ============================================================
 * 線上課程平台 MVP - TypeScript 介面定義
 * ============================================================
 * 自動生成自: course_platform_api_contract.yaml
 * 版本: v1.0.0
 * 更新日期: 2025-12-29
 *
 * 使用說明:
 * 1. 前端專案直接 import 此檔案使用
 * 2. 與後端 API 契約保持同步
 * 3. 任何變更需經過前後端 Review
 * ============================================================
 */

// ============================================================
// 基礎型別
// ============================================================

/** 基礎回應格式 */
export interface BaseResponse {
  success: boolean;
}

/** 成功回應 */
export interface SuccessResponse extends BaseResponse {
  message?: string;
}

/** 錯誤詳情 */
export interface ErrorDetail {
  field: string;
  message: string;
}

/** 錯誤回應 */
export interface ErrorResponse extends BaseResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
}

/** 分頁資訊 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** 分頁請求參數 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ============================================================
// 用戶模組 (Users)
// ============================================================

/** 用戶角色 */
export type UserRole = 'student' | 'instructor' | 'admin';

/** 用戶資料 */
export interface User {
  id: string;  // 格式: usr_[a-zA-Z0-9]+
  email: string;
  name: string;
  avatar: string | null;
  role: UserRole;
  bio?: string | null;
  createdAt: string;  // ISO 8601 格式
  updatedAt?: string;
}

/** 用戶公開資料 */
export interface UserPublic {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  courseCount?: number;
}

/** 用戶回應 */
export interface UserResponse extends BaseResponse {
  data: User;
}

/** 用戶公開資料回應 */
export interface UserPublicResponse extends BaseResponse {
  data: UserPublic;
}

/** 更新用戶請求 */
export interface UpdateUserRequest {
  name?: string;
  bio?: string;
}

// ============================================================
// 認證模組 (Auth)
// ============================================================

/** Google 登入請求 */
export interface GoogleAuthRequest {
  idToken: string;
}

/** 認證回應 */
export interface AuthResponse extends BaseResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;  // 秒
    user: User;
  };
}

/** 刷新 Token 請求 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============================================================
// 課程模組 (Courses)
// ============================================================

/** 課程狀態 */
export type CourseStatus = 'draft' | 'published' | 'archived';

/** 課程基本資料 */
export interface Course {
  id: string;  // 格式: crs_[a-zA-Z0-9]+
  title: string;
  description?: string;
  thumbnail: string | null;
  instructorId: string;
  duration: number;  // 秒
  videoCount: number;
  enrollmentCount: number;
  status: CourseStatus;
  createdAt: string;
  updatedAt?: string;
}

/** 課程 (含講師資訊) */
export interface CourseWithInstructor extends Course {
  instructor: {
    id: string;
    name: string;
    avatar: string | null;
    bio?: string;
  };
}

/** 課程章節 */
export interface Section {
  id: string;  // 格式: sec_[a-zA-Z0-9]+
  title: string;
  order: number;
  videos: VideoMeta[];
}

/** 課程詳情 (含章節) */
export interface CourseDetail extends CourseWithInstructor {
  sections: Section[];
}

/** 課程列表回應 */
export interface CourseListResponse extends BaseResponse {
  data: {
    courses: CourseWithInstructor[];
    pagination: Pagination;
  };
}

/** 課程回應 */
export interface CourseResponse extends BaseResponse {
  data: CourseWithInstructor;
}

/** 課程詳情回應 */
export interface CourseDetailResponse extends BaseResponse {
  data: CourseDetail;
}

/** 課程列表查詢參數 */
export interface GetCoursesParams extends PaginationParams {
  search?: string;
  category?: string;
  sortBy?: 'createdAt' | 'title' | 'enrollmentCount';
  sortOrder?: 'asc' | 'desc';
}

/** 建立課程請求 */
export interface CreateCourseRequest {
  title: string;
  description?: string;
  thumbnail?: string;
}

/** 更新課程請求 */
export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  thumbnail?: string;
  status?: CourseStatus;
}

// ============================================================
// 影片模組 (Videos)
// ============================================================

/** 影片狀態 */
export type VideoStatus =
  | 'pending_upload'
  | 'uploading'
  | 'transcoding'
  | 'ready'
  | 'failed';

/** 影片元資料 (列表顯示用) */
export interface VideoMeta {
  id: string;  // 格式: vid_[a-zA-Z0-9]+
  title: string;
  duration?: number;  // 秒
  order: number;
  status: VideoStatus;
  thumbnail?: string | null;
}

/** 影片完整資料 */
export interface Video extends VideoMeta {
  courseId: string;
  sectionId?: string;
  originalFilename?: string;
  fileSize?: number;  // bytes
  createdAt: string;
  updatedAt?: string;
}

/** 影片列表回應 */
export interface VideoListResponse extends BaseResponse {
  data: {
    videos: Video[];
  };
}

/** 影片回應 */
export interface VideoResponse extends BaseResponse {
  data: Video;
}

/** 建立影片請求 */
export interface CreateVideoRequest {
  title: string;
  sectionId?: string;
  filename: string;
  fileSize: number;  // bytes, 最大 5GB
  mimeType: 'video/mp4' | 'video/quicktime' | 'video/x-msvideo';
}

/** 更新影片請求 */
export interface UpdateVideoRequest {
  title?: string;
  sectionId?: string;
  order?: number;
}

/** 上傳資訊 */
export interface UploadInfo {
  uploadId: string;
  signedUrl: string;
  expiresAt: string;
  chunkSize?: number;  // bytes
  totalChunks?: number;
}

/** 影片上傳回應 */
export interface VideoUploadResponse extends BaseResponse {
  data: {
    id: string;
    title: string;
    status: VideoStatus;
    upload: UploadInfo;
  };
}

/** 完成上傳請求 */
export interface CompleteUploadRequest {
  uploadId: string;
}

/** 解析度狀態 */
export interface ResolutionStatus {
  resolution: '720p' | '1080p';
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

/** 影片狀態回應 */
export interface VideoStatusResponse extends BaseResponse {
  data: {
    id: string;
    status: VideoStatus;
    progress?: number;  // 0-100
    resolutions?: ResolutionStatus[];
    estimatedCompletion?: string;
    errorMessage?: string;
  };
}

// ============================================================
// 播放模組 (Playback)
// ============================================================

/** 解析度選項 */
export interface ResolutionOption {
  label: string;  // e.g., "720p", "1080p"
  url: string;
}

/** 播放進度 */
export interface Progress {
  position: number;  // 秒
  completed: boolean;
}

/** 播放資訊回應 */
export interface PlaybackResponse extends BaseResponse {
  data: {
    videoId: string;
    title: string;
    duration: number;
    hlsUrl: string;  // HLS 主播放清單 URL (帶 Token)
    resolutions: ResolutionOption[];
    expiresAt: string;
    progress?: Progress;
  };
}

/** 進度回應 */
export interface ProgressResponse extends BaseResponse {
  data: Progress;
}

/** 更新進度請求 */
export interface UpdateProgressRequest {
  position: number;  // 秒
  duration?: number; // 秒
}

// ============================================================
// 報名模組 (Enrollments)
// ============================================================

/** 報名記錄 */
export interface Enrollment {
  id: string;  // 格式: enr_[a-zA-Z0-9]+
  userId: string;
  courseId: string;
  progress: number;  // 0-100
  completedVideos: number;
  totalVideos: number;
  enrolledAt: string;
  completedAt: string | null;
}

/** 報名記錄 (含課程資訊) */
export interface EnrollmentWithCourse extends Enrollment {
  course: CourseWithInstructor;
}

/** 報名列表回應 */
export interface EnrollmentListResponse extends BaseResponse {
  data: {
    enrollments: EnrollmentWithCourse[];
    pagination: Pagination;
  };
}

/** 報名回應 */
export interface EnrollmentResponse extends BaseResponse {
  data: Enrollment;
}

/** 報名列表查詢參數 */
export interface GetEnrollmentsParams extends PaginationParams {
  status?: 'in_progress' | 'completed' | 'all';
}

/** 報名請求 */
export interface EnrollCourseRequest {
  courseId: string;
}

// ============================================================
// API 錯誤代碼
// ============================================================

/** API 錯誤代碼常數 */
export const API_ERROR_CODES = {
  // 通用錯誤
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',

  // 認證相關
  INVALID_TOKEN: 'INVALID_TOKEN',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',

  // 用戶相關
  USER_EMAIL_EXISTS: 'USER_EMAIL_EXISTS',

  // 課程相關
  INSTRUCTOR_REQUIRED: 'INSTRUCTOR_REQUIRED',
  COURSE_HAS_ENROLLMENTS: 'COURSE_HAS_ENROLLMENTS',

  // 報名相關
  ALREADY_ENROLLED: 'ALREADY_ENROLLED',
  NOT_ENROLLED: 'NOT_ENROLLED',
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES];

// ============================================================
// API 路徑常數
// ============================================================

/** API 端點路徑 */
export const API_PATHS = {
  // Auth
  AUTH_GOOGLE: '/auth/google',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',

  // Users
  USER: (userId: string) => `/users/${userId}`,

  // Courses
  COURSES: '/courses',
  COURSE: (courseId: string) => `/courses/${courseId}`,
  COURSE_VIDEOS: (courseId: string) => `/courses/${courseId}/videos`,

  // Videos
  VIDEO: (videoId: string) => `/videos/${videoId}`,
  VIDEO_UPLOAD_COMPLETE: (videoId: string) => `/videos/${videoId}/upload/complete`,
  VIDEO_STATUS: (videoId: string) => `/videos/${videoId}/status`,
  VIDEO_PLAYBACK: (videoId: string) => `/videos/${videoId}/playback`,
  VIDEO_PROGRESS: (videoId: string) => `/videos/${videoId}/progress`,

  // Enrollments
  ENROLLMENTS: '/enrollments',
  ENROLLMENT: (courseId: string) => `/enrollments/${courseId}`,
} as const;

// ============================================================
// 型別守衛 (Type Guards)
// ============================================================

/** 檢查是否為錯誤回應 */
export function isErrorResponse(response: BaseResponse): response is ErrorResponse {
  return !response.success;
}

/** 檢查是否為成功回應 */
export function isSuccessResponse<T extends BaseResponse>(
  response: T | ErrorResponse
): response is T {
  return response.success;
}
