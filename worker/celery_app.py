"""
Celery 應用程式配置
"""
from celery import Celery

celery_app = Celery(
    "sd_learning_worker",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
    include=["worker.tasks.video_processing", "worker.tasks.ai_review"]
)

# Celery 配置
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Taipei",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,  # 1 hour
    worker_prefetch_multiplier=1,
)
