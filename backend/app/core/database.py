"""
Database Configuration
SQLAlchemy 2.0 Async Engine Setup
"""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


# 建立異步引擎
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DATABASE_ECHO,
    future=True,
)

# 建立異步 Session 工廠
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    """SQLAlchemy 宣告式基礎類別"""
    pass


async def get_db() -> AsyncSession:
    """
    依賴注入：獲取資料庫 Session

    Usage:
        @router.get("/items")
        async def get_items(db: AsyncSession = Depends(get_db)):
            ...
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """初始化資料庫（開發用）"""
    async with engine.begin() as conn:
        # 在生產環境應使用 Alembic 遷移
        from app.models import Base
        await conn.run_sync(Base.metadata.create_all)
