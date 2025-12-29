# backend/main.py
"""
SD Learning Platform - FastAPI Backend Entry Point
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.deps import engine
from app.api.v1 import router as api_v1_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    應用程式生命週期管理

    - startup: 資料庫連線池初始化
    - shutdown: 資源釋放
    """
    # Startup
    print(f"[STARTUP] Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    print(f"[STARTUP] API Docs: http://localhost:8000{settings.API_V1_STR}/docs")

    yield

    # Shutdown
    print("[SHUTDOWN] Shutting down...")
    await engine.dispose()
    print("[SHUTDOWN] Database connections closed")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="線上學習平台 API - 提供課程管理、影片串流、用戶認證等功能",
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 根路徑
@app.get("/", tags=["Root"])
async def root():
    """API 根路徑"""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_STR}/docs",
        "health": f"{settings.API_V1_STR}/health"
    }


# 簡易健康檢查 (根路徑)
@app.get("/health", tags=["Health"])
async def health_check():
    """簡易健康檢查端點"""
    return {"status": "healthy", "version": settings.VERSION}


# API v1 路由
app.include_router(api_v1_router, prefix=settings.API_V1_STR)
