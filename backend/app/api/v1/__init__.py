# backend/app/api/v1/__init__.py
"""
API v1 路由彙整
"""
from fastapi import APIRouter

from app.api.v1 import health, users, courses

router = APIRouter()

# 健康檢查
router.include_router(health.router, prefix="/health", tags=["Health"])

# 用戶相關
router.include_router(users.router, prefix="/users", tags=["Users"])

# 課程相關
router.include_router(courses.router, prefix="/courses", tags=["Courses"])
