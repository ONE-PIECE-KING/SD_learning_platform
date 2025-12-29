# FastAPI 架構與開發指南

> **專案**：SD Learning Platform
> **版本**：1.0
> **最後更新**：2025-12-29

---

## 目錄

1. [FastAPI 簡介](#1-fastapi-簡介)
2. [專案架構總覽](#2-專案架構總覽)
3. [分層架構設計](#3-分層架構設計)
4. [核心元件詳解](#4-核心元件詳解)
5. [路由與端點設計](#5-路由與端點設計)
6. [依賴注入系統](#6-依賴注入系統)
7. [資料驗證 (Pydantic)](#7-資料驗證-pydantic)
8. [資料庫操作 (SQLAlchemy)](#8-資料庫操作-sqlalchemy)
9. [錯誤處理](#9-錯誤處理)
10. [中介軟體 (Middleware)](#10-中介軟體-middleware)
11. [實戰範例](#11-實戰範例)
12. [測試指南](#12-測試指南)
13. [部署指南](#13-部署指南)

---

## 1. FastAPI 簡介

### 1.1 什麼是 FastAPI

FastAPI 是一個現代、高效能的 Python Web 框架，專門用於建置 API。

```
FastAPI 特點：
├── 🚀 高效能 (與 Node.js、Go 同等級)
├── ⚡ 開發快速 (自動生成文件)
├── 🔒 類型安全 (Python 型別提示)
├── 📝 自動文件 (Swagger UI / ReDoc)
└── 🔄 非同步支援 (async/await)
```

### 1.2 為什麼選擇 FastAPI

| 特性 | Flask | Django REST | FastAPI |
|------|-------|-------------|---------|
| 效能 | 中等 | 中等 | 極高 |
| 開發速度 | 快 | 中等 | 極快 |
| 自動文件 | 需插件 | 需插件 | 內建 |
| 類型檢查 | 無 | 無 | 內建 |
| 非同步支援 | 有限 | 有限 | 原生 |
| 學習曲線 | 低 | 高 | 中等 |

### 1.3 核心概念

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")           # 路由裝飾器
async def root():       # 非同步函數
    return {"message": "Hello World"}
```

---

## 2. 專案架構總覽

### 2.1 目錄結構

```
backend/
├── main.py                      # 應用程式入口點
├── alembic.ini                  # 資料庫遷移配置
├── requirements.txt             # Python 依賴
│
├── app/                         # 應用程式主目錄
│   ├── __init__.py
│   │
│   ├── api/                     # API 路由層
│   │   ├── __init__.py
│   │   └── v1/                  # API 版本 1
│   │       ├── __init__.py      # 路由彙整
│   │       ├── health.py        # 健康檢查
│   │       ├── users.py         # 用戶 API
│   │       └── courses.py       # 課程 API
│   │
│   ├── core/                    # 核心配置
│   │   ├── __init__.py
│   │   ├── config.py            # 環境設定
│   │   ├── security.py          # 安全相關
│   │   └── deps.py              # 依賴注入
│   │
│   ├── models/                  # SQLAlchemy 資料模型
│   │   ├── __init__.py          # 模型導出
│   │   ├── base.py              # 基礎類別
│   │   ├── user.py              # 用戶模型
│   │   ├── course.py            # 課程模型
│   │   └── ...
│   │
│   ├── schemas/                 # Pydantic 資料驗證
│   │   ├── __init__.py
│   │   ├── user.py              # 用戶 Schema
│   │   └── course.py            # 課程 Schema
│   │
│   ├── services/                # 業務邏輯層
│   │   ├── __init__.py
│   │   ├── user.py              # 用戶服務
│   │   └── course.py            # 課程服務
│   │
│   ├── repositories/            # 資料存取層
│   │   ├── __init__.py
│   │   └── base.py              # 基礎 Repository
│   │
│   └── tasks/                   # 背景任務
│       ├── __init__.py
│       └── video_processing.py  # 影片處理
│
├── alembic/                     # 資料庫遷移
│   ├── env.py
│   └── versions/
│
└── tests/                       # 測試
    ├── __init__.py
    └── test_health.py
```

### 2.2 架構流程圖

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client Request                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            main.py (FastAPI App)                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     Middleware (CORS, Auth, etc.)                │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        API Layer (app/api/v1/)                           │
│                                                                          │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                │
│  │   health.py   │  │   users.py    │  │  courses.py   │                │
│  │   /health     │  │   /users      │  │   /courses    │                │
│  └───────────────┘  └───────────────┘  └───────────────┘                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                        ┌───────────┴───────────┐
                        ▼                       ▼
┌───────────────────────────────┐  ┌───────────────────────────────┐
│     Dependency Injection      │  │     Pydantic Validation       │
│      (app/core/deps.py)       │  │     (app/schemas/*.py)        │
│                               │  │                               │
│  • get_db()                   │  │  • Request 驗證               │
│  • get_current_user()         │  │  • Response 序列化            │
└───────────────────────────────┘  └───────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Service Layer (app/services/)                       │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                        業務邏輯處理                                 │  │
│  │  • 資料處理                                                         │  │
│  │  • 複雜運算                                                         │  │
│  │  • 跨模組協調                                                       │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   Repository Layer (app/repositories/)                   │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                       資料存取抽象                                  │  │
│  │  • CRUD 操作                                                        │  │
│  │  • 資料庫查詢                                                       │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       Model Layer (app/models/)                          │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     SQLAlchemy ORM Models                          │  │
│  │  • User, Course, Video, Order...                                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          PostgreSQL Database                             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 分層架構設計

### 3.1 各層職責

```
┌─────────────────────────────────────────────────────────────────┐
│ 層級        │ 職責                      │ 檔案位置              │
├─────────────────────────────────────────────────────────────────┤
│ API        │ 接收請求、回傳回應          │ app/api/v1/*.py      │
│ Schema     │ 資料驗證、序列化            │ app/schemas/*.py     │
│ Service    │ 業務邏輯                   │ app/services/*.py    │
│ Repository │ 資料存取                   │ app/repositories/*.py│
│ Model      │ 資料結構定義               │ app/models/*.py      │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 各層原則

```python
# ===== API 層 (Thin Controller) =====
# 只負責：接收請求、呼叫服務、回傳結果
# 不應該有：業務邏輯、資料庫操作

@router.post("/courses")
async def create_course(
    course_data: CourseCreate,           # Schema 驗證
    db: AsyncSession = Depends(get_db),  # 依賴注入
    current_user: User = Depends(get_current_user)
):
    # 呼叫 Service 處理業務邏輯
    course = await course_service.create(db, course_data, current_user)
    return course


# ===== Service 層 (Business Logic) =====
# 負責：業務規則、跨模組協調
# 不應該有：HTTP 相關邏輯

class CourseService:
    async def create(self, db, data, user):
        # 業務邏輯
        if user.role != UserRole.ADMIN:
            raise PermissionDenied()

        # 呼叫 Repository 存取資料
        return await self.repo.create(db, data)


# ===== Repository 層 (Data Access) =====
# 負責：資料庫 CRUD 操作
# 不應該有：業務邏輯

class CourseRepository:
    async def create(self, db, data):
        course = Course(**data.dict())
        db.add(course)
        await db.commit()
        return course
```

---

## 4. 核心元件詳解

### 4.1 main.py - 應用程式入口

```python
# backend/main.py

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.deps import engine
from app.api.v1 import router as api_v1_router


# ===== 生命週期管理 =====
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    應用程式啟動和關閉時執行的程式碼
    """
    # Startup (應用啟動時)
    print(f"Starting {settings.PROJECT_NAME}")
    # 可以在這裡初始化資料庫連線池、快取等

    yield  # 應用程式運行中

    # Shutdown (應用關閉時)
    print("Shutting down...")
    await engine.dispose()  # 釋放資料庫連線


# ===== 建立 FastAPI 應用 =====
app = FastAPI(
    title=settings.PROJECT_NAME,           # API 標題
    description="API 描述",                 # API 描述
    version=settings.VERSION,              # API 版本
    openapi_url=f"{settings.API_V1_STR}/openapi.json",  # OpenAPI 規格路徑
    docs_url=f"{settings.API_V1_STR}/docs",             # Swagger UI 路徑
    redoc_url=f"{settings.API_V1_STR}/redoc",           # ReDoc 路徑
    lifespan=lifespan                      # 生命週期處理器
)


# ===== 中介軟體 =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,  # 允許的來源
    allow_credentials=True,                        # 允許帶認證
    allow_methods=["*"],                          # 允許所有 HTTP 方法
    allow_headers=["*"],                          # 允許所有標頭
)


# ===== 路由註冊 =====
app.include_router(api_v1_router, prefix=settings.API_V1_STR)
```

### 4.2 config.py - 環境配置

```python
# backend/app/core/config.py

from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    使用 Pydantic 管理環境變數
    - 自動從 .env 檔案讀取
    - 自動型別轉換
    - 支援預設值
    """

    # 基本設定
    PROJECT_NAME: str = "SD Learning Platform"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    # 安全設定
    SECRET_KEY: str = "your-secret-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    # 資料庫
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost/db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"        # 從 .env 檔案讀取
        case_sensitive = True    # 區分大小寫


# 建立全域設定實例
settings = Settings()
```

**使用 .env 檔案**：

```bash
# .env
PROJECT_NAME=My Project
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/mydb
SECRET_KEY=super-secret-key-123
```

### 4.3 deps.py - 依賴注入

```python
# backend/app/core/deps.py

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.core.config import settings

# 建立資料庫引擎
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,           # 開發時顯示 SQL
    pool_size=5,         # 連線池大小
    max_overflow=10      # 最大溢出連線數
)

# 建立 Session 工廠
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    資料庫 Session 依賴
    每個請求會獲得獨立的 Session
    請求結束後自動關閉
    """
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()


# 進階：認證依賴
async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """取得當前登入用戶"""
    payload = verify_token(token)
    user = await db.get(User, payload["sub"])
    if not user:
        raise HTTPException(status_code=401)
    return user


# 進階：權限檢查依賴
def require_role(required_role: UserRole):
    """建立角色檢查依賴"""
    async def check_role(
        current_user: User = Depends(get_current_user)
    ):
        if current_user.role != required_role:
            raise HTTPException(status_code=403)
        return current_user
    return check_role
```

---

## 5. 路由與端點設計

### 5.1 路由組織方式

```python
# backend/app/api/v1/__init__.py

from fastapi import APIRouter

from app.api.v1 import health, users, courses, videos, orders

router = APIRouter()

# 依功能模組組織路由
router.include_router(health.router,  prefix="/health",  tags=["Health"])
router.include_router(users.router,   prefix="/users",   tags=["Users"])
router.include_router(courses.router, prefix="/courses", tags=["Courses"])
router.include_router(videos.router,  prefix="/videos",  tags=["Videos"])
router.include_router(orders.router,  prefix="/orders",  tags=["Orders"])
```

### 5.2 RESTful API 設計

```python
# backend/app/api/v1/courses.py

from fastapi import APIRouter, Depends, HTTPException, Query, status
from uuid import UUID

router = APIRouter()


# ===== GET - 取得資源列表 =====
@router.get("")
async def list_courses(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """
    取得課程列表

    - 支援分頁
    - 支援篩選
    - 支援排序
    """
    pass


# ===== GET - 取得單一資源 =====
@router.get("/{course_id}")
async def get_course(
    course_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """根據 ID 取得課程詳情"""
    pass


# ===== POST - 建立資源 =====
@router.post("", status_code=status.HTTP_201_CREATED)
async def create_course(
    course_data: CourseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """建立新課程"""
    pass


# ===== PUT - 完整更新資源 =====
@router.put("/{course_id}")
async def update_course(
    course_id: UUID,
    course_data: CourseUpdate,
    db: AsyncSession = Depends(get_db)
):
    """更新課程 (完整替換)"""
    pass


# ===== PATCH - 部分更新資源 =====
@router.patch("/{course_id}")
async def partial_update_course(
    course_id: UUID,
    course_data: CoursePartialUpdate,
    db: AsyncSession = Depends(get_db)
):
    """更新課程 (部分欄位)"""
    pass


# ===== DELETE - 刪除資源 =====
@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(
    course_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """刪除課程"""
    pass
```

### 5.3 HTTP 狀態碼

| 狀態碼 | 含義 | 使用場景 |
|--------|------|----------|
| 200 | OK | GET, PUT, PATCH 成功 |
| 201 | Created | POST 成功建立 |
| 204 | No Content | DELETE 成功 |
| 400 | Bad Request | 請求格式錯誤 |
| 401 | Unauthorized | 未認證 |
| 403 | Forbidden | 無權限 |
| 404 | Not Found | 資源不存在 |
| 422 | Unprocessable Entity | 驗證錯誤 |
| 500 | Internal Server Error | 伺服器錯誤 |

---

## 6. 依賴注入系統

### 6.1 什麼是依賴注入

```
依賴注入 (Dependency Injection) = 把元件需要的東西「注入」進去

不使用依賴注入：
┌─────────────────────────────────────┐
│ def get_user():                     │
│     db = Database()  # 自己建立     │
│     return db.query(User)           │
│                                     │
│ 問題：                              │
│ • 難以測試 (無法替換 Database)       │
│ • 資源管理困難                       │
│ • 程式碼耦合度高                     │
└─────────────────────────────────────┘

使用依賴注入：
┌─────────────────────────────────────┐
│ def get_user(db = Depends(get_db)): │
│     return db.query(User)           │
│                                     │
│ 優點：                              │
│ • 易於測試 (可注入 Mock)            │
│ • 自動管理資源生命週期              │
│ • 程式碼解耦                         │
└─────────────────────────────────────┘
```

### 6.2 依賴注入範例

```python
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession


# ===== 基礎依賴：資料庫連線 =====
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


# ===== 進階依賴：認證 =====
async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    # 驗證 Token
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    # 查詢用戶
    user = await db.get(User, payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


# ===== 進階依賴：權限檢查 =====
async def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin required")
    return current_user


# ===== 在路由中使用 =====
@router.get("/admin/dashboard")
async def admin_dashboard(
    admin: User = Depends(get_current_admin)  # 自動檢查權限
):
    return {"message": f"Welcome admin: {admin.name}"}
```

### 6.3 依賴注入流程

```
                     請求進入
                        │
                        ▼
              ┌─────────────────┐
              │  get_current_admin  │
              └─────────────────┘
                        │
                        │ Depends(get_current_user)
                        ▼
              ┌─────────────────┐
              │  get_current_user   │
              └─────────────────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │  get_db  │  │ oauth2   │  │  其他    │
    │          │  │ _scheme  │  │  依賴    │
    └──────────┘  └──────────┘  └──────────┘
          │
          ▼
    ┌──────────────────┐
    │   Database       │
    │   Connection     │
    └──────────────────┘
```

---

## 7. 資料驗證 (Pydantic)

### 7.1 什麼是 Pydantic

```
Pydantic = Python 資料驗證庫

功能：
├── 自動驗證輸入資料
├── 自動轉換資料類型
├── 產生 JSON Schema
└── 產生 API 文件
```

### 7.2 Schema 設計

```python
# backend/app/schemas/course.py

from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field, validator


# ===== 基礎 Schema =====
class CourseBase(BaseModel):
    """課程基礎欄位"""
    title: str = Field(..., min_length=1, max_length=200, description="課程標題")
    description: str = Field(..., min_length=10, description="課程描述")
    price: Decimal = Field(..., ge=0, description="價格")
    category: str = Field(..., description="課程分類")


# ===== 建立用 Schema =====
class CourseCreate(CourseBase):
    """建立課程時的輸入"""

    @validator("title")
    def title_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip()


# ===== 更新用 Schema =====
class CourseUpdate(BaseModel):
    """更新課程時的輸入 (所有欄位可選)"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, ge=0)
    category: Optional[str] = None


# ===== 回應用 Schema =====
class CourseResponse(CourseBase):
    """API 回應格式"""
    id: UUID
    creator_id: UUID
    status: str
    total_duration: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # 允許從 ORM 物件轉換


# ===== 列表回應 Schema =====
class CourseListResponse(BaseModel):
    """課程列表回應"""
    items: List[CourseResponse]
    pagination: dict
```

### 7.3 驗證器

```python
from pydantic import BaseModel, validator, root_validator
from typing import Optional


class UserCreate(BaseModel):
    email: str
    password: str
    confirm_password: str
    age: Optional[int] = None

    # 單一欄位驗證
    @validator("email")
    def email_must_be_valid(cls, v):
        if "@" not in v:
            raise ValueError("Invalid email format")
        return v.lower()

    # 密碼強度驗證
    @validator("password")
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain uppercase")
        return v

    # 跨欄位驗證
    @root_validator
    def passwords_match(cls, values):
        pw = values.get("password")
        cpw = values.get("confirm_password")
        if pw and cpw and pw != cpw:
            raise ValueError("Passwords do not match")
        return values
```

---

## 8. 資料庫操作 (SQLAlchemy)

### 8.1 非同步資料庫操作

```python
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload


# ===== 查詢單一記錄 =====
async def get_course(db: AsyncSession, course_id: UUID) -> Course | None:
    result = await db.execute(
        select(Course).where(Course.id == course_id)
    )
    return result.scalar_one_or_none()


# ===== 查詢多筆記錄 =====
async def list_courses(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(
        select(Course)
        .offset(skip)
        .limit(limit)
        .order_by(Course.created_at.desc())
    )
    return result.scalars().all()


# ===== 帶關聯查詢 =====
async def get_course_with_chapters(db: AsyncSession, course_id: UUID):
    result = await db.execute(
        select(Course)
        .options(selectinload(Course.chapters))  # 預載入關聯
        .where(Course.id == course_id)
    )
    return result.scalar_one_or_none()


# ===== 建立記錄 =====
async def create_course(db: AsyncSession, data: CourseCreate) -> Course:
    course = Course(**data.dict())
    db.add(course)
    await db.commit()
    await db.refresh(course)
    return course


# ===== 更新記錄 =====
async def update_course(db: AsyncSession, course_id: UUID, data: CourseUpdate):
    await db.execute(
        update(Course)
        .where(Course.id == course_id)
        .values(**data.dict(exclude_unset=True))
    )
    await db.commit()


# ===== 刪除記錄 =====
async def delete_course(db: AsyncSession, course_id: UUID):
    await db.execute(
        delete(Course).where(Course.id == course_id)
    )
    await db.commit()
```

### 8.2 複雜查詢

```python
from sqlalchemy import select, func, and_, or_


# ===== 分頁查詢 =====
async def paginate_courses(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 10,
    status: str = None,
    search: str = None
):
    # 基礎查詢
    query = select(Course)
    count_query = select(func.count(Course.id))

    # 動態篩選
    if status:
        query = query.where(Course.status == status)
        count_query = count_query.where(Course.status == status)

    if search:
        pattern = f"%{search}%"
        query = query.where(Course.title.ilike(pattern))
        count_query = count_query.where(Course.title.ilike(pattern))

    # 計算總數
    total = (await db.execute(count_query)).scalar()

    # 分頁
    offset = (page - 1) * page_size
    items = (await db.execute(
        query.offset(offset).limit(page_size)
    )).scalars().all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }


# ===== 聚合查詢 =====
async def get_course_stats(db: AsyncSession):
    result = await db.execute(
        select(
            Course.status,
            func.count(Course.id).label("count"),
            func.sum(Course.price).label("total_revenue")
        )
        .group_by(Course.status)
    )
    return result.all()
```

---

## 9. 錯誤處理

### 9.1 HTTPException

```python
from fastapi import HTTPException, status


@router.get("/{course_id}")
async def get_course(course_id: UUID, db: AsyncSession = Depends(get_db)):
    course = await db.get(Course, course_id)

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    return course
```

### 9.2 自訂例外

```python
# backend/app/core/exceptions.py

from fastapi import HTTPException, status


class CourseNotFoundError(HTTPException):
    def __init__(self, course_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Course {course_id} not found"
        )


class PermissionDeniedError(HTTPException):
    def __init__(self, message: str = "Permission denied"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=message
        )


class ValidationError(HTTPException):
    def __init__(self, message: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=message
        )
```

### 9.3 全域例外處理

```python
# backend/main.py

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


app = FastAPI()


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)}
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # 記錄錯誤
    print(f"Unexpected error: {exc}")

    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )
```

---

## 10. 中介軟體 (Middleware)

### 10.1 內建中介軟體

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware


app = FastAPI()

# CORS 中介軟體
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 信任主機中介軟體
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["example.com", "*.example.com"]
)

# Gzip 壓縮中介軟體
app.add_middleware(GZipMiddleware, minimum_size=1000)
```

### 10.2 自訂中介軟體

```python
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import time


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """請求日誌中介軟體"""

    async def dispatch(self, request: Request, call_next):
        # 請求前
        start_time = time.time()
        print(f"[REQUEST] {request.method} {request.url}")

        # 處理請求
        response = await call_next(request)

        # 請求後
        duration = time.time() - start_time
        print(f"[RESPONSE] {response.status_code} ({duration:.3f}s)")

        # 加入回應標頭
        response.headers["X-Response-Time"] = f"{duration:.3f}s"

        return response


# 註冊中介軟體
app.add_middleware(RequestLoggingMiddleware)
```

---

## 11. 實戰範例

### 11.1 完整的 CRUD API

```python
# backend/app/api/v1/courses.py

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db, get_current_user
from app.models import Course, User
from app.schemas.course import CourseCreate, CourseUpdate, CourseResponse

router = APIRouter()


# ===== 取得列表 =====
@router.get("", response_model=dict)
async def list_courses(
    page: int = Query(1, ge=1, description="頁碼"),
    page_size: int = Query(10, ge=1, le=50, description="每頁數量"),
    search: Optional[str] = Query(None, description="搜尋關鍵字"),
    db: AsyncSession = Depends(get_db)
):
    """取得課程列表"""
    query = select(Course)
    count_query = select(func.count(Course.id))

    if search:
        pattern = f"%{search}%"
        query = query.where(Course.title.ilike(pattern))
        count_query = count_query.where(Course.title.ilike(pattern))

    total = (await db.execute(count_query)).scalar()
    offset = (page - 1) * page_size

    courses = (await db.execute(
        query.offset(offset).limit(page_size).order_by(Course.created_at.desc())
    )).scalars().all()

    return {
        "items": courses,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total
        }
    }


# ===== 取得單一課程 =====
@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(
    course_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """取得課程詳情"""
    course = await db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


# ===== 建立課程 =====
@router.post("", response_model=CourseResponse, status_code=201)
async def create_course(
    data: CourseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """建立新課程"""
    course = Course(**data.dict(), creator_id=current_user.id)
    db.add(course)
    await db.commit()
    await db.refresh(course)
    return course


# ===== 更新課程 =====
@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: UUID,
    data: CourseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """更新課程"""
    course = await db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # 檢查權限
    if course.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # 更新欄位
    for key, value in data.dict(exclude_unset=True).items():
        setattr(course, key, value)

    await db.commit()
    await db.refresh(course)
    return course


# ===== 刪除課程 =====
@router.delete("/{course_id}", status_code=204)
async def delete_course(
    course_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """刪除課程"""
    course = await db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    if course.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    await db.delete(course)
    await db.commit()
```

---

## 12. 測試指南

### 12.1 測試設定

```python
# backend/tests/conftest.py

import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from main import app
from app.core.deps import get_db


# 測試用資料庫
TEST_DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost/test_db"

engine = create_async_engine(TEST_DATABASE_URL)
TestingSessionLocal = async_sessionmaker(engine)


async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac
```

### 12.2 測試範例

```python
# backend/tests/test_courses.py

import pytest


@pytest.mark.asyncio
async def test_list_courses(client):
    response = await client.get("/api/v1/courses")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "pagination" in data


@pytest.mark.asyncio
async def test_get_course_not_found(client):
    response = await client.get("/api/v1/courses/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_create_course_unauthorized(client):
    response = await client.post("/api/v1/courses", json={
        "title": "Test Course",
        "description": "Test description",
        "price": 100
    })
    assert response.status_code == 401  # 未認證
```

---

## 13. 部署指南

### 13.1 Uvicorn 啟動

```bash
# 開發環境
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 生產環境 (多 worker)
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 13.2 Gunicorn + Uvicorn

```bash
# 使用 Gunicorn 管理多個 Uvicorn workers
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 13.3 Docker 部署

```dockerfile
# docker/Dockerfile.backend
FROM python:3.12-slim

WORKDIR /app

# 安裝 uv
RUN pip install uv

# 複製依賴檔案
COPY backend/requirements.txt .

# 安裝依賴
RUN uv pip install --system -r requirements.txt

# 複製原始碼
COPY backend/ .

# 啟動命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 快速參考卡

```python
# ===== 基本路由 =====
@app.get("/items/{item_id}")
@app.post("/items")
@app.put("/items/{item_id}")
@app.delete("/items/{item_id}")

# ===== 查詢參數 =====
@app.get("/items")
async def list_items(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=100)
): ...

# ===== 依賴注入 =====
async def get_db(): ...
async def get_user(db = Depends(get_db)): ...

@app.get("/items")
async def get_items(db = Depends(get_db)): ...

# ===== 錯誤處理 =====
raise HTTPException(status_code=404, detail="Not found")

# ===== 回應模型 =====
@app.get("/items", response_model=List[Item])

# ===== 狀態碼 =====
@app.post("/items", status_code=201)
@app.delete("/items/{id}", status_code=204)

# ===== 資料庫操作 =====
result = await db.execute(select(Model))
items = result.scalars().all()
item = result.scalar_one_or_none()

await db.commit()
await db.refresh(item)
```

---

**維護者**：SD Learning Platform 開發團隊
