"""
應用程式配置設定
"""
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # 基本設定
    PROJECT_NAME: str = "SD Learning Platform"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    # 安全設定
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # 資料庫設定
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/sd_learning"

    # Redis 設定
    REDIS_URL: str = "redis://localhost:6379/0"

    # MinIO 設定
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET_NAME: str = "sd-learning"

    # CORS 設定
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # Google OAuth 設定
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
