"""
影片處理任務
"""
from worker.celery_app import celery_app


@celery_app.task(bind=True, name="process_video")
def process_video(self, video_id: str):
    """
    影片處理 Pipeline
    1. 下載原始影片
    2. FFmpeg 截圖 (每 10s)
    3. FFmpeg 提取音訊
    4. Whisper 語音轉文字
    5. 更新影片狀態
    """
    # TODO: 實作影片處理邏輯
    self.update_state(state="PROCESSING", meta={"step": "downloading"})

    # Step 1: 下載影片
    # Step 2: 截圖
    # Step 3: 提取音訊
    # Step 4: 語音轉文字
    # Step 5: 更新狀態

    return {"status": "completed", "video_id": video_id}


@celery_app.task(name="generate_thumbnail")
def generate_thumbnail(video_id: str):
    """產生影片縮圖"""
    # TODO: 實作縮圖產生邏輯
    return {"status": "completed", "video_id": video_id}
