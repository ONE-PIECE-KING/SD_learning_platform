"""
============================================================
Python Protocol Contract Template
用於定義後端模組之間的抽象契約
============================================================

使用說明：
1. 在 Day 1 契約定義日，由模組 Owner 建立/更新此文件
2. 依賴方 Owner 共同 Review 並簽核
3. 契約確定後，雙方可平行開發

檔案命名規則：
- contracts/[module_name]_contract.py
- 例：contracts/user_contract.py

============================================================
契約元資料 (Contract Metadata)
============================================================

@contract: UserModule
@version: 1.0.0
@owner: [Backend Owner 姓名]
@dependents: [Service A Owner], [Service B Owner]
@status: approved
@created_at: 2024-01-15
@updated_at: 2024-01-15

變更歷史：
| 版本   | 日期       | 變更者 | 變更內容   |
|--------|------------|--------|------------|
| v1.0.0 | 2024-01-15 | [姓名] | 初始版本   |

============================================================
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import (
    Any,
    Generic,
    List,
    Optional,
    Protocol,
    TypeVar,
    Union,
    runtime_checkable,
)


# ============================================================
# 基礎型別定義 (Base Types)
# ============================================================

class UserRole(str, Enum):
    """使用者角色"""
    ADMIN = "admin"
    MEMBER = "member"
    GUEST = "guest"


class ApiStatus(str, Enum):
    """API 回應狀態"""
    SUCCESS = "success"
    ERROR = "error"


# ============================================================
# 值物件定義 (Value Objects)
# ============================================================

@dataclass(frozen=True)
class UserId:
    """
    使用者 ID 值物件

    格式: usr_xxxxx
    """
    value: str

    def __post_init__(self) -> None:
        if not self.value.startswith("usr_"):
            raise ValueError(f"Invalid UserId format: {self.value}")

    def __str__(self) -> str:
        return self.value

    @classmethod
    def generate(cls) -> "UserId":
        """生成新的 UserId"""
        import uuid
        return cls(f"usr_{uuid.uuid4().hex[:12]}")


@dataclass(frozen=True)
class Email:
    """Email 值物件"""
    value: str

    def __post_init__(self) -> None:
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, self.value):
            raise ValueError(f"Invalid email format: {self.value}")

    def __str__(self) -> str:
        return self.value


# ============================================================
# 實體定義 (Entity)
# ============================================================

@dataclass
class User:
    """
    使用者實體

    Attributes:
        id: 使用者唯一識別碼
        email: Email 地址
        name: 使用者名稱
        role: 使用者角色
        avatar: 頭像 URL
        created_at: 建立時間
        updated_at: 更新時間
    """
    id: UserId
    email: Email
    name: str
    role: UserRole
    avatar: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

    def to_dict(self) -> dict[str, Any]:
        """轉換為字典"""
        return {
            "id": str(self.id),
            "email": str(self.email),
            "name": self.name,
            "role": self.role.value,
            "avatar": self.avatar,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "User":
        """從字典建立"""
        return cls(
            id=UserId(data["id"]),
            email=Email(data["email"]),
            name=data["name"],
            role=UserRole(data["role"]),
            avatar=data.get("avatar"),
            created_at=datetime.fromisoformat(data["created_at"]),
            updated_at=datetime.fromisoformat(data["updated_at"]),
        )


@dataclass
class UserSummary:
    """使用者摘要 (用於列表顯示)"""
    id: UserId
    name: str
    avatar: Optional[str] = None


# ============================================================
# 請求/回應型別 (Request/Response Types)
# ============================================================

@dataclass
class PaginationParams:
    """分頁參數"""
    page: int = 1
    limit: int = 20

    def __post_init__(self) -> None:
        if self.page < 1:
            raise ValueError("Page must be >= 1")
        if self.limit < 1 or self.limit > 100:
            raise ValueError("Limit must be between 1 and 100")


@dataclass
class PaginationInfo:
    """分頁資訊"""
    page: int
    limit: int
    total: int
    total_pages: int

    @classmethod
    def create(cls, page: int, limit: int, total: int) -> "PaginationInfo":
        """建立分頁資訊"""
        total_pages = (total + limit - 1) // limit
        return cls(
            page=page,
            limit=limit,
            total=total,
            total_pages=total_pages,
        )


@dataclass
class GetUsersParams(PaginationParams):
    """取得使用者列表的參數"""
    search: Optional[str] = None
    role: Optional[UserRole] = None


@dataclass
class CreateUserRequest:
    """建立使用者的請求"""
    email: str
    password: str
    name: str

    def __post_init__(self) -> None:
        # 驗證 email
        Email(self.email)
        # 驗證密碼
        if len(self.password) < 8:
            raise ValueError("Password must be at least 8 characters")
        # 驗證名稱
        if not self.name or len(self.name) > 100:
            raise ValueError("Name must be between 1 and 100 characters")


@dataclass
class UpdateUserRequest:
    """更新使用者的請求"""
    name: Optional[str] = None
    avatar: Optional[str] = None


@dataclass
class ApiErrorDetail:
    """API 錯誤詳情"""
    field: str
    message: str


@dataclass
class ApiError:
    """API 錯誤"""
    code: str
    message: str
    details: Optional[List[ApiErrorDetail]] = None


# 泛型型別變數
T = TypeVar("T")


@dataclass
class ApiResponse(Generic[T]):
    """通用 API 回應包裝"""
    success: bool
    data: Optional[T] = None
    error: Optional[ApiError] = None

    @classmethod
    def ok(cls, data: T) -> "ApiResponse[T]":
        """建立成功回應"""
        return cls(success=True, data=data)

    @classmethod
    def fail(cls, error: ApiError) -> "ApiResponse[T]":
        """建立失敗回應"""
        return cls(success=False, error=error)


@dataclass
class ListResponse(Generic[T]):
    """列表 API 回應"""
    items: List[T]
    pagination: PaginationInfo


# ============================================================
# 事件型別 (Event Types)
# ============================================================

class UserEventType(str, Enum):
    """使用者事件類型"""
    CREATED = "user:created"
    UPDATED = "user:updated"
    DELETED = "user:deleted"
    LOGIN = "user:login"
    LOGOUT = "user:logout"


@dataclass
class UserEvent(Generic[T]):
    """使用者事件基礎類別"""
    type: UserEventType
    payload: T
    timestamp: datetime = field(default_factory=datetime.utcnow)


@dataclass
class UserCreatedEvent(UserEvent[User]):
    """使用者建立事件"""
    type: UserEventType = field(default=UserEventType.CREATED, init=False)


@dataclass
class UserUpdatedPayload:
    """使用者更新事件 Payload"""
    user_id: UserId
    changes: dict[str, Any]


@dataclass
class UserUpdatedEvent(UserEvent[UserUpdatedPayload]):
    """使用者更新事件"""
    type: UserEventType = field(default=UserEventType.UPDATED, init=False)


# ============================================================
# 服務介面定義 (Service Interface / Protocol)
# ============================================================

@runtime_checkable
class IUserRepository(Protocol):
    """
    使用者儲存庫介面

    定義資料存取層的契約，由基礎設施層實作。
    領域層和應用層依賴此介面，而非具體實作。
    """

    async def find_by_id(self, user_id: UserId) -> Optional[User]:
        """根據 ID 查詢使用者"""
        ...

    async def find_by_email(self, email: Email) -> Optional[User]:
        """根據 Email 查詢使用者"""
        ...

    async def find_all(
        self,
        params: GetUsersParams,
    ) -> tuple[List[User], int]:
        """
        查詢使用者列表

        Returns:
            tuple[List[User], int]: (使用者列表, 總筆數)
        """
        ...

    async def save(self, user: User) -> User:
        """儲存使用者 (新增或更新)"""
        ...

    async def delete(self, user_id: UserId) -> bool:
        """刪除使用者"""
        ...


@runtime_checkable
class IUserService(Protocol):
    """
    使用者服務介面

    定義應用層的業務邏輯契約。
    """

    async def get_users(
        self,
        params: Optional[GetUsersParams] = None,
    ) -> ApiResponse[ListResponse[User]]:
        """取得使用者列表"""
        ...

    async def get_user(self, user_id: UserId) -> ApiResponse[User]:
        """取得單一使用者"""
        ...

    async def create_user(
        self,
        request: CreateUserRequest,
    ) -> ApiResponse[User]:
        """建立使用者"""
        ...

    async def update_user(
        self,
        user_id: UserId,
        request: UpdateUserRequest,
    ) -> ApiResponse[User]:
        """更新使用者"""
        ...

    async def delete_user(self, user_id: UserId) -> ApiResponse[None]:
        """刪除使用者"""
        ...


@runtime_checkable
class IEventPublisher(Protocol):
    """
    事件發布者介面

    用於模組間的事件驅動通訊。
    """

    async def publish(self, event: UserEvent[Any]) -> None:
        """發布事件"""
        ...


@runtime_checkable
class IEventSubscriber(Protocol):
    """
    事件訂閱者介面
    """

    async def subscribe(
        self,
        event_type: UserEventType,
        handler: Any,
    ) -> None:
        """訂閱事件"""
        ...


# ============================================================
# 抽象基礎類別 (Abstract Base Classes)
# ============================================================

class BaseRepository(ABC, Generic[T]):
    """
    儲存庫抽象基礎類別

    提供 CRUD 操作的基本骨架。
    """

    @abstractmethod
    async def find_by_id(self, id: Any) -> Optional[T]:
        """根據 ID 查詢"""
        pass

    @abstractmethod
    async def find_all(self, **kwargs: Any) -> List[T]:
        """查詢全部"""
        pass

    @abstractmethod
    async def save(self, entity: T) -> T:
        """儲存"""
        pass

    @abstractmethod
    async def delete(self, id: Any) -> bool:
        """刪除"""
        pass


# ============================================================
# 常數定義 (Constants)
# ============================================================

# 使用者角色顯示名稱
USER_ROLE_LABELS: dict[UserRole, str] = {
    UserRole.ADMIN: "管理員",
    UserRole.MEMBER: "成員",
    UserRole.GUEST: "訪客",
}

# API 錯誤代碼
class ApiErrorCode:
    """API 錯誤代碼常數"""
    VALIDATION_ERROR = "VALIDATION_ERROR"
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"
    NOT_FOUND = "NOT_FOUND"
    CONFLICT = "CONFLICT"
    INTERNAL_ERROR = "INTERNAL_ERROR"


# 預設分頁設定
DEFAULT_PAGE = 1
DEFAULT_LIMIT = 20
MAX_LIMIT = 100


# ============================================================
# 工廠函式 (Factory Functions)
# ============================================================

def create_api_error(
    code: str,
    message: str,
    details: Optional[List[tuple[str, str]]] = None,
) -> ApiError:
    """建立 API 錯誤"""
    error_details = None
    if details:
        error_details = [
            ApiErrorDetail(field=field, message=msg)
            for field, msg in details
        ]
    return ApiError(code=code, message=message, details=error_details)


def create_validation_error(
    details: List[tuple[str, str]],
) -> ApiError:
    """建立驗證錯誤"""
    return create_api_error(
        code=ApiErrorCode.VALIDATION_ERROR,
        message="請求參數驗證失敗",
        details=details,
    )


def create_not_found_error(resource: str = "資源") -> ApiError:
    """建立找不到資源錯誤"""
    return create_api_error(
        code=ApiErrorCode.NOT_FOUND,
        message=f"找不到指定的{resource}",
    )


# ============================================================
# 型別檢查輔助函式 (Type Guards)
# ============================================================

def is_valid_user_id(value: str) -> bool:
    """檢查是否為有效的 UserId"""
    return isinstance(value, str) and value.startswith("usr_")


def is_valid_email(value: str) -> bool:
    """檢查是否為有效的 Email"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return isinstance(value, str) and bool(re.match(pattern, value))


# ============================================================
# 使用範例 (Usage Examples)
# ============================================================

if __name__ == "__main__":
    # 建立使用者
    user = User(
        id=UserId.generate(),
        email=Email("user@example.com"),
        name="John Doe",
        role=UserRole.MEMBER,
    )
    print(f"Created user: {user.to_dict()}")

    # 建立 API 回應
    response = ApiResponse.ok(user)
    print(f"API Response success: {response.success}")

    # 建立錯誤回應
    error = create_validation_error([
        ("email", "Email 格式不正確"),
        ("password", "密碼至少需要 8 個字元"),
    ])
    error_response: ApiResponse[User] = ApiResponse.fail(error)
    print(f"Error Response: {error_response.error}")
