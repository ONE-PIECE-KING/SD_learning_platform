# backend/app/api/v1/health.py
"""
健康檢查端點
"""
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.deps import get_db

router = APIRouter()


@router.get("")
async def health_check():
    """基本健康檢查"""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }


@router.get("/db")
async def database_health(db: AsyncSession = Depends(get_db)):
    """資料庫連線健康檢查"""
    try:
        result = await db.execute(text("SELECT 1"))
        result.scalar()
        return {
            "status": "healthy",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }


@router.get("/ready")
async def readiness_check(db: AsyncSession = Depends(get_db)):
    """就緒檢查 (用於 K8s/Docker)"""
    checks = {
        "database": False
    }

    # 檢查資料庫
    try:
        result = await db.execute(text("SELECT 1"))
        result.scalar()
        checks["database"] = True
    except Exception:
        pass

    all_ready = all(checks.values())

    return {
        "status": "ready" if all_ready else "not_ready",
        "checks": checks
    }
