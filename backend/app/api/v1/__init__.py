"""
API v1 Router Module
統一管理所有 v1 版本的 API 路由
"""
from fastapi import APIRouter

from app.api.v1 import auth, users, courses, videos, enrollments, health
from app.payment.router import router as payment_router

# Create main API router
api_router = APIRouter()

# Include all sub-routers
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(courses.router, prefix="/courses", tags=["Courses"])
api_router.include_router(videos.router, prefix="/videos", tags=["Videos"])
api_router.include_router(enrollments.router, prefix="/enrollments", tags=["Enrollments"])
api_router.include_router(payment_router, prefix="/payments", tags=["Payments"])
