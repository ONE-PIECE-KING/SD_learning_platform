import asyncio
import sys
import os
from datetime import datetime
from decimal import Decimal

# Add the current directory to sys.path to import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select

from app.core.config import settings
from app.models.user import User, UserRole, UserStatus
from app.models.course import Course, CourseStatus, CourseCategory
from app.models.base import Base

async def seed_data():
    engine = create_async_engine(str(settings.DATABASE_URL))
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        # 1. Create a test instructor if not exists
        instructor_email = "teacher@example.com"
        result = await session.execute(select(User).where(User.email == instructor_email))
        instructor = result.scalar_one_or_none()

        if not instructor:
            instructor = User(
                email=instructor_email,
                name="桑尼老師",
                role=UserRole.USER, # In your model, teachers are also Role.USER, just identified by being creator
                status=UserStatus.ACTIVE,
                bio="資深資料科學家，擁有 10 年 Python 開發經驗。"
            )
            session.add(instructor)
            await session.commit()
            await session.refresh(instructor)
            print(f"Created instructor: {instructor.name}")
        else:
            print(f"Instructor {instructor.name} already exists.")

        # 2. Create sample courses
        courses_to_create = [
            {
                "title": "Python 基礎程式設計：從零開始",
                "description": "這門課將帶領你深入淺出地學習 Python，適合完全沒有程式背景的初學者。",
                "price": Decimal("1200.00"),
                "category": CourseCategory.SOFTWARE_DEV,
                "cover_image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60"
            },
            {
                "title": "AI 機器學習實戰：Scikit-Learn 入門",
                "description": "學習如何使用 Scikit-Learn 建立分類與預測模型，開啟你的 AI 之路。",
                "price": Decimal("2500.00"),
                "category": CourseCategory.DATA_SCIENCE,
                "cover_image": "https://images.unsplash.com/photo-1555255707-c07966485bc4?w=800&auto=format&fit=crop&q=60"
            },
            {
                "title": "資料視覺化大師：使用 Matplotlib 與 Seaborn",
                "description": "讓數據說話！掌握 Python 最強大的視覺化工具，製作精美的商業圖表。",
                "price": Decimal("1800.00"),
                "category": CourseCategory.DATA_SCIENCE,
                "cover_image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60"
            },
            {
                "title": "深度學習與神經網路：PyTorch 實作",
                "description": "深入探索深度學習的核心原理，並使用 PyTorch 框架實作電腦視覺與自然語言處理模型。",
                "price": Decimal("3200.00"),
                "category": CourseCategory.DATA_SCIENCE,
                "cover_image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60"
            }
        ]

        for course_data in courses_to_create:
            # Check if course title already exists to avoid duplicates
            result = await session.execute(select(Course).where(Course.title == course_data["title"]))
            if not result.scalar_one_or_none():
                new_course = Course(
                    creator_id=instructor.id,
                    title=course_data["title"],
                    description=course_data["description"],
                    price=course_data["price"],
                    category=course_data["category"],
                    cover_image=course_data["cover_image"],
                    status=CourseStatus.PUBLISHED # Directly set to PUBLISHED for testing search
                )
                session.add(new_course)
                print(f"Adding course: {new_course.title}")
        
        await session.commit()
        print("Successfully seeded courses data!")

if __name__ == "__main__":
    asyncio.run(seed_data())
