"""
依賴注入
"""
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.core.config import settings

# 建立非同步資料庫引擎
engine = create_async_engine(settings.DATABASE_URL, echo=True)

# 建立非同步 Session 工廠
async_session_maker = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """取得資料庫 Session"""
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()
