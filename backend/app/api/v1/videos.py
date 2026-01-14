"""
Videos API
影片管理相關端點
"""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.video import (
    VideoResponse,
    VideoUploadInitResponse,
    VideoProgressUpdateRequest,
)
from app.api.deps import get_current_user, get_current_instructor

router = APIRouter()


@router.post("/upload/init", response_model=VideoUploadInitResponse)
async def init_video_upload(
    course_id: UUID,
    chapter_id: UUID,
    filename: str,
    content_type: str,
    file_size: int,
    current_user=Depends(get_current_instructor),
    db: AsyncSession = Depends(get_db),
):
    """
    初始化影片上傳
    返回預簽名 URL 用於分段上傳
    """
    # TODO: Implement upload initialization with MinIO presigned URL
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Video upload initialization not implemented yet",
    )


@router.post("/upload/{video_id}/complete")
async def complete_video_upload(
    video_id: UUID,
    current_user=Depends(get_current_instructor),
    db: AsyncSession = Depends(get_db),
):
    """
    完成影片上傳
    觸發轉碼任務
    """
    # TODO: Implement upload completion and trigger transcoding
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Video upload completion not implemented yet",
    )


@router.get("/{video_id}", response_model=VideoResponse)
async def get_video_info(
    video_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    獲取影片資訊
    """
    # TODO: Implement get video info
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Get video info not implemented yet",
    )


@router.get("/{video_id}/stream")
async def get_video_stream_url(
    video_id: UUID,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    獲取影片串流 URL (HLS)
    需要驗證用戶是否有權限觀看
    """
    # TODO: Implement video stream URL with access control
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Video streaming not implemented yet",
    )


@router.post("/{video_id}/progress")
async def update_video_progress(
    video_id: UUID,
    request: VideoProgressUpdateRequest,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    更新影片觀看進度
    用於斷點續看功能
    """
    # TODO: Implement progress update
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Progress update not implemented yet",
    )


@router.delete("/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_video(
    video_id: UUID,
    current_user=Depends(get_current_instructor),
    db: AsyncSession = Depends(get_db),
):
    """
    刪除影片 (僅課程擁有者)
    """
    # TODO: Implement video deletion
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Video deletion not implemented yet",
    )


@router.post("/webhook/transcode-complete")
async def transcode_webhook(
    video_id: UUID,
    status: str,
    output_path: Optional[str] = None,
    error_message: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """
    轉碼完成回調 Webhook
    由 Worker 服務調用
    """
    # TODO: Implement transcode webhook handler
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Transcode webhook not implemented yet",
    )
