"""
SD Learning Platform - FastAPI Backend Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """健康檢查端點"""
    return {"status": "healthy", "version": settings.VERSION}


# API v1 路由將在此引入
# from app.api.v1 import router as api_v1_router
# app.include_router(api_v1_router, prefix=settings.API_V1_STR)
