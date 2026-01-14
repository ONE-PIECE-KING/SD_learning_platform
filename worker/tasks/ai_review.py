"""
AI Review Tasks
AI 內容審核背景任務
"""
import json
from typing import Optional, List, Dict, Any
from celery import shared_task

from worker.celery_app import celery_app


@celery_app.task(bind=True, max_retries=3)
def analyze_video_content(
    self,
    video_id: str,
    screenshots: List[str],
    transcript: Optional[str] = None,
    course_description: Optional[str] = None
) -> dict:
    """
    使用 AI 分析影片內容

    Args:
        video_id: 影片 ID
        screenshots: 影片截圖路徑列表
        transcript: 影片文字稿
        course_description: 課程描述

    Returns:
        AI 審核結果
    """
    try:
        self.update_state(state="ANALYZING", meta={"video_id": video_id, "progress": 0})

        # TODO: 整合 OpenAI/Claude API 進行多模態分析
        # 目前返回模擬結果

        result = {
            "status": "PASSED",
            "confidence_score": 0.95,
            "issues": [],
            "categories": {
                "violence": False,
                "adult_content": False,
                "hate_speech": False,
                "copyright_violation": False,
            },
            "recommendations": [],
        }

        self.update_state(state="ANALYZING", meta={"video_id": video_id, "progress": 100})

        return {
            "status": "success",
            "video_id": video_id,
            "ai_result": result,
        }

    except Exception as exc:
        self.retry(exc=exc, countdown=120)


@celery_app.task(bind=True, max_retries=3)
def analyze_course_metadata(
    self,
    course_id: str,
    title: str,
    description: str,
    category: str
) -> dict:
    """
    分析課程元資料是否符合規範

    Args:
        course_id: 課程 ID
        title: 課程標題
        description: 課程描述
        category: 課程分類

    Returns:
        審核結果
    """
    try:
        # TODO: 整合 AI API 進行文字分析
        # 檢查標題和描述是否包含違規內容

        issues = []

        # 簡單規則檢查
        if len(title) < 5:
            issues.append({
                "type": "title_too_short",
                "message": "課程標題過短，建議至少 5 個字元"
            })

        if len(description) < 50:
            issues.append({
                "type": "description_too_short",
                "message": "課程描述過短，建議至少 50 個字元"
            })

        status = "PASSED" if not issues else "WARNING"

        return {
            "status": "success",
            "course_id": course_id,
            "ai_result": {
                "status": status,
                "confidence_score": 0.90,
                "issues": issues,
            }
        }

    except Exception as exc:
        self.retry(exc=exc, countdown=60)


@celery_app.task
def generate_course_summary(course_id: str, content: str) -> dict:
    """
    使用 AI 生成課程摘要

    Args:
        course_id: 課程 ID
        content: 課程內容文字

    Returns:
        生成的摘要
    """
    # TODO: 整合 AI API 生成摘要
    return {
        "status": "success",
        "course_id": course_id,
        "summary": "AI 生成的課程摘要（待實作）",
    }
