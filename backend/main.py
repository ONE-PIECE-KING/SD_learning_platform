"""
Learning Platform API - FastAPI Application Entry Point
線上學習平台 API 入口
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.core.config import settings
from app.core.exceptions import setup_exception_handlers
from app.api.v1 import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application Lifespan Events
    處理啟動和關閉事件
    """
    # Startup
    print(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    print(f"📝 Debug mode: {settings.DEBUG}")
    print(f"🔗 API Prefix: {settings.API_V1_PREFIX}")

    # TODO: Initialize database connection pool
    # TODO: Initialize Redis connection
    # TODO: Initialize MinIO client

    yield

    # Shutdown
    print(f"👋 Shutting down {settings.APP_NAME}")
    # TODO: Close database connections
    # TODO: Close Redis connections


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
## 線上學習平台 MVP API

提供課程管理、影片上傳、用戶認證等功能的 RESTful API。

### 功能模組

* **認證** - 用戶註冊、登入、Google OAuth
* **用戶** - 個人檔案管理
* **課程** - 課程 CRUD、搜尋、分類
* **影片** - 上傳、轉碼、HLS 串流
* **註冊** - 課程購買、訂單管理

### 認證方式

使用 JWT Bearer Token 進行認證。
在需要認證的端點，請在 Header 中加入：
```
Authorization: Bearer <your_token>
```
    """,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
    lifespan=lifespan,
)

# Setup exception handlers
setup_exception_handlers(app)

# Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)


# Include API routers
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


# Root endpoints (outside of API versioning)
@app.get("/", tags=["Root"])
async def root():
    """API 根端點"""
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.APP_VERSION,
        "docs": "/docs" if settings.DEBUG else "Disabled in production",
        "api": settings.API_V1_PREFIX,
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    基本健康檢查端點
    用於負載均衡器和容器健康檢查
    """
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
