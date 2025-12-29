"""
AI 審核任務
"""
from worker.celery_app import celery_app


@celery_app.task(bind=True, name="ai_content_review")
def ai_content_review(self, video_id: str, screenshots: list, transcript: str):
    """
    AI 內容審核
    1. 發送截圖 + 文字 + 課程描述至 AI API
    2. 解析審核結果
    3. 儲存審核報告
    """
    # TODO: 實作 AI 審核邏輯
    self.update_state(state="REVIEWING", meta={"step": "analyzing"})

    # Step 1: 準備審核資料
    # Step 2: 呼叫 AI API
    # Step 3: 解析結果
    # Step 4: 儲存報告

    return {
        "status": "completed",
        "video_id": video_id,
        "review_result": "approved"
    }
