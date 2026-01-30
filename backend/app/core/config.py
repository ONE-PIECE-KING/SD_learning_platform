"""
Application Configuration
使用 pydantic-settings 管理環境變數
"""
from functools import lru_cache
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """應用程式設定"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Application
    APP_NAME: str = "Learning Platform API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # Database (預設使用 SQLite 進行本地測試)
    DATABASE_URL: str = "sqlite+aiosqlite:///./test.db"
    DATABASE_ECHO: bool = False

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT Authentication
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: str = "http://localhost:3000/auth/google/callback"

    # MinIO / S3 Storage
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET_NAME: str = "learning-platform"
    MINIO_SECURE: bool = False

    # ECPay Payment Gateway (測試環境)
    ECPAY_MERCHANT_ID: str = "3002607"
    ECPAY_HASH_KEY: str = "pwFHCqoQZGmho4w6"
    ECPAY_HASH_IV: str = "EkRm7iFT261dpevs"
    ECPAY_AIO_CHECKOUT_URL: str = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5"
    ECPAY_QUERY_TRADE_URL: str = "https://payment-stage.ecpay.com.tw/Cashier/QueryTradeInfo/V5"
    ECPAY_CREDIT_ACTION_URL: str = "https://payment-stage.ecpay.com.tw/CreditDetail/DoAction"
    ECPAY_CALLBACK_URL: str = "http://localhost:8000/api/v1/payments/callback"
    ECPAY_RETURN_URL: str = "http://localhost:8000/api/v1/payments/return"

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    # Platform Settings
    PLATFORM_FEE_PERCENTAGE: float = 0.20  # 20% 平台抽成


@lru_cache
def get_settings() -> Settings:
    """獲取快取的設定實例"""
    return Settings()


settings = get_settings()
