"""
Celery Application Configuration
背景任務處理器配置
"""
from celery import Celery
import os

# 從環境變數取得 Redis URL
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# 建立 Celery 應用程式
celery_app = Celery(
    "learning_platform_worker",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=[
        "worker.tasks.video_processing",
        "worker.tasks.ai_review",
    ],
)

# Celery 配置
celery_app.conf.update(
    # 任務序列化
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",

    # 時區設定
    timezone="Asia/Taipei",
    enable_utc=True,

    # 任務追蹤
    task_track_started=True,
    task_time_limit=3600,  # 1 小時超時

    # 結果過期時間
    result_expires=86400,  # 24 小時

    # Worker 設定
    worker_prefetch_multiplier=1,
    worker_concurrency=4,

    # 任務路由
    task_routes={
        "worker.tasks.video_processing.*": {"queue": "video"},
        "worker.tasks.ai_review.*": {"queue": "ai"},
    },

    # 任務重試設定
    task_acks_late=True,
    task_reject_on_worker_lost=True,
)


if __name__ == "__main__":
    celery_app.start()
