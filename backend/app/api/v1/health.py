"""
Health Check API
健康檢查端點 - 用於監控和負載均衡器
"""
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.config import settings
from app.schemas.common import HealthResponse, DetailedHealthResponse

router = APIRouter()


@router.get("", response_model=HealthResponse)
async def health_check():
    """
    基本健康檢查
    用於 Kubernetes liveness probe
    """
    return HealthResponse(
        status="healthy",
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
    )


@router.get("/ready", response_model=DetailedHealthResponse)
async def readiness_check(db: AsyncSession = Depends(get_db)):
    """
    就緒檢查 - 檢查所有依賴服務
    用於 Kubernetes readiness probe
    """
    checks = {}

    # Database check
    try:
        await db.execute(text("SELECT 1"))
        checks["database"] = "healthy"
    except Exception as e:
        checks["database"] = f"unhealthy: {str(e)}"

    # TODO: Add Redis check
    # TODO: Add MinIO check

    all_healthy = all(v == "healthy" for v in checks.values())

    return DetailedHealthResponse(
        status="healthy" if all_healthy else "degraded",
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
        checks=checks,
    )
