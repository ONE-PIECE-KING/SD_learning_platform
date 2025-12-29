/**
 * ============================================================
 * TypeScript Interface Contract Template
 * 用於定義前端模組之間的型別契約
 * ============================================================
 *
 * 使用說明：
 * 1. 在 Day 1 契約定義日，由模組 Owner 建立/更新此文件
 * 2. 依賴方 Owner 共同 Review 並簽核
 * 3. 契約確定後，雙方可平行開發
 *
 * 檔案命名規則：
 * - contracts/[module-name].contract.ts
 * - 例：contracts/user.contract.ts
 *
 * ============================================================
 */

// ============================================================
// 契約元資料 (Contract Metadata)
// ============================================================

/**
 * @contract UserModule
 * @version 1.0.0
 * @owner [Frontend Owner 姓名]
 * @dependents [Feature A Owner], [Feature B Owner]
 * @status approved
 * @createdAt 2024-01-15
 * @updatedAt 2024-01-15
 *
 * 變更歷史：
 * | 版本   | 日期       | 變更者 | 變更內容   |
 * |--------|------------|--------|------------|
 * | v1.0.0 | 2024-01-15 | [姓名] | 初始版本   |
 */

// ============================================================
// 基礎型別定義 (Base Types)
// ============================================================

/** 使用者 ID 型別 (格式: usr_xxxxx) */
export type UserId = `usr_${string}`;

/** 時間戳型別 (ISO 8601 格式) */
export type Timestamp = string;

/** 使用者角色 */
export type UserRole = 'admin' | 'member' | 'guest';

/** API 回應狀態 */
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

// ============================================================
// 實體型別定義 (Entity Types)
// ============================================================

/**
 * 使用者實體
 * @description 代表系統中的使用者資料結構
 */
export interface User {
  /** 使用者唯一識別碼 */
  readonly id: UserId;
  /** Email 地址 */
  email: string;
  /** 使用者名稱 */
  name: string;
  /** 使用者角色 */
  role: UserRole;
  /** 頭像 URL */
  avatar: string | null;
  /** 建立時間 */
  readonly createdAt: Timestamp;
  /** 更新時間 */
  updatedAt: Timestamp;
}

/**
 * 使用者摘要 (用於列表顯示)
 * @description 簡化版使用者資料，用於列表或選擇器
 */
export interface UserSummary {
  readonly id: UserId;
  name: string;
  avatar: string | null;
}

// ============================================================
// 請求/回應型別 (Request/Response Types)
// ============================================================

/**
 * 分頁參數
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * 分頁資訊
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * 取得使用者列表的參數
 */
export interface GetUsersParams extends PaginationParams {
  /** 搜尋關鍵字 */
  search?: string;
  /** 角色篩選 */
  role?: UserRole;
}

/**
 * 建立使用者的請求
 */
export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

/**
 * 更新使用者的請求
 */
export interface UpdateUserRequest {
  name?: string;
  avatar?: string | null;
}

/**
 * API 錯誤詳情
 */
export interface ApiErrorDetail {
  field: string;
  message: string;
}

/**
 * API 錯誤
 */
export interface ApiError {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

/**
 * 通用 API 回應包裝
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * 列表 API 回應
 */
export interface ListResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

// ============================================================
// 狀態管理型別 (State Types)
// ============================================================

/**
 * 使用者模組狀態
 * @description 用於 Redux/Zustand 等狀態管理
 */
export interface UserState {
  /** 當前使用者 */
  currentUser: User | null;
  /** 使用者列表 */
  users: User[];
  /** 分頁資訊 */
  pagination: PaginationInfo | null;
  /** 載入狀態 */
  status: ApiStatus;
  /** 錯誤資訊 */
  error: ApiError | null;
}

/**
 * 使用者模組初始狀態
 */
export const initialUserState: UserState = {
  currentUser: null,
  users: [],
  pagination: null,
  status: 'idle',
  error: null,
};

// ============================================================
// 事件型別 (Event Types)
// ============================================================

/**
 * 使用者事件類型
 */
export type UserEventType =
  | 'user:created'
  | 'user:updated'
  | 'user:deleted'
  | 'user:login'
  | 'user:logout';

/**
 * 使用者事件
 */
export interface UserEvent<T = unknown> {
  type: UserEventType;
  payload: T;
  timestamp: Timestamp;
}

/**
 * 使用者建立事件
 */
export interface UserCreatedEvent extends UserEvent<User> {
  type: 'user:created';
}

/**
 * 使用者更新事件
 */
export interface UserUpdatedEvent extends UserEvent<{ userId: UserId; changes: Partial<User> }> {
  type: 'user:updated';
}

// ============================================================
// 元件 Props 型別 (Component Props Types)
// ============================================================

/**
 * 使用者卡片元件 Props
 */
export interface UserCardProps {
  /** 使用者資料 */
  user: User | UserSummary;
  /** 是否顯示詳細資訊 */
  showDetails?: boolean;
  /** 點擊回呼 */
  onClick?: (userId: UserId) => void;
  /** 自訂 className */
  className?: string;
}

/**
 * 使用者列表元件 Props
 */
export interface UserListProps {
  /** 使用者列表 */
  users: User[];
  /** 載入狀態 */
  loading?: boolean;
  /** 選擇使用者回呼 */
  onSelectUser?: (user: User) => void;
  /** 空狀態文字 */
  emptyText?: string;
}

/**
 * 使用者表單元件 Props
 */
export interface UserFormProps {
  /** 初始值 (編輯模式) */
  initialValues?: Partial<CreateUserRequest>;
  /** 提交回呼 */
  onSubmit: (data: CreateUserRequest) => Promise<void>;
  /** 取消回呼 */
  onCancel?: () => void;
  /** 是否為編輯模式 */
  isEdit?: boolean;
  /** 載入狀態 */
  loading?: boolean;
}

// ============================================================
// Hook 回傳型別 (Hook Return Types)
// ============================================================

/**
 * useUser Hook 回傳型別
 */
export interface UseUserReturn {
  /** 使用者資料 */
  user: User | null;
  /** 載入狀態 */
  loading: boolean;
  /** 錯誤 */
  error: ApiError | null;
  /** 重新載入 */
  refetch: () => Promise<void>;
}

/**
 * useUsers Hook 回傳型別
 */
export interface UseUsersReturn {
  /** 使用者列表 */
  users: User[];
  /** 分頁資訊 */
  pagination: PaginationInfo | null;
  /** 載入狀態 */
  loading: boolean;
  /** 錯誤 */
  error: ApiError | null;
  /** 取得使用者 */
  fetchUsers: (params?: GetUsersParams) => Promise<void>;
  /** 建立使用者 */
  createUser: (data: CreateUserRequest) => Promise<User>;
  /** 更新使用者 */
  updateUser: (id: UserId, data: UpdateUserRequest) => Promise<User>;
  /** 刪除使用者 */
  deleteUser: (id: UserId) => Promise<void>;
}

// ============================================================
// 服務介面定義 (Service Interface)
// ============================================================

/**
 * 使用者服務介面
 * @description 定義使用者模組對外提供的服務契約
 */
export interface IUserService {
  /**
   * 取得使用者列表
   */
  getUsers(params?: GetUsersParams): Promise<ApiResponse<ListResponse<User>>>;

  /**
   * 取得單一使用者
   */
  getUser(id: UserId): Promise<ApiResponse<User>>;

  /**
   * 建立使用者
   */
  createUser(data: CreateUserRequest): Promise<ApiResponse<User>>;

  /**
   * 更新使用者
   */
  updateUser(id: UserId, data: UpdateUserRequest): Promise<ApiResponse<User>>;

  /**
   * 刪除使用者
   */
  deleteUser(id: UserId): Promise<ApiResponse<void>>;
}

// ============================================================
// 型別守衛 (Type Guards)
// ============================================================

/**
 * 檢查是否為有效的 UserId
 */
export function isUserId(value: unknown): value is UserId {
  return typeof value === 'string' && /^usr_[a-zA-Z0-9]+$/.test(value);
}

/**
 * 檢查是否為有效的 User
 */
export function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    isUserId(obj.id) &&
    typeof obj.email === 'string' &&
    typeof obj.name === 'string' &&
    ['admin', 'member', 'guest'].includes(obj.role as string)
  );
}

/**
 * 檢查是否為 API 錯誤回應
 */
export function isApiError(response: ApiResponse<unknown>): response is ApiResponse<never> & { error: ApiError } {
  return !response.success && response.error !== undefined;
}

// ============================================================
// 常數定義 (Constants)
// ============================================================

/** 使用者角色顯示名稱 */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: '管理員',
  member: '成員',
  guest: '訪客',
};

/** 預設分頁設定 */
export const DEFAULT_PAGINATION: PaginationParams = {
  page: 1,
  limit: 20,
};

/** API 錯誤代碼 */
export const API_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES];
