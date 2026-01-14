"""
Video Processing Tasks
影片處理背景任務
"""
import os
import subprocess
from typing import Optional
from celery import shared_task

from worker.celery_app import celery_app


@celery_app.task(bind=True, max_retries=3)
def process_video(self, video_id: str, input_path: str, output_dir: str) -> dict:
    """
    處理上傳的影片：轉碼為 HLS 格式

    Args:
        video_id: 影片 ID
        input_path: 原始影片路徑
        output_dir: 輸出目錄

    Returns:
        處理結果字典
    """
    try:
        # 更新任務狀態
        self.update_state(state="PROCESSING", meta={"video_id": video_id, "progress": 0})

        # 建立輸出目錄
        os.makedirs(output_dir, exist_ok=True)

        # 生成縮圖
        thumbnail_path = os.path.join(output_dir, "thumbnail.jpg")
        generate_thumbnail(input_path, thumbnail_path)
        self.update_state(state="PROCESSING", meta={"video_id": video_id, "progress": 20})

        # 轉碼為 HLS 720p
        hls_720p_dir = os.path.join(output_dir, "720p")
        transcode_to_hls(input_path, hls_720p_dir, "1280x720", "2500k")
        self.update_state(state="PROCESSING", meta={"video_id": video_id, "progress": 60})

        # 轉碼為 HLS 1080p
        hls_1080p_dir = os.path.join(output_dir, "1080p")
        transcode_to_hls(input_path, hls_1080p_dir, "1920x1080", "5000k")
        self.update_state(state="PROCESSING", meta={"video_id": video_id, "progress": 90})

        # 生成主播放列表
        master_playlist = generate_master_playlist(output_dir)
        self.update_state(state="PROCESSING", meta={"video_id": video_id, "progress": 100})

        return {
            "status": "success",
            "video_id": video_id,
            "thumbnail": thumbnail_path,
            "master_playlist": master_playlist,
            "resolutions": ["720p", "1080p"],
        }

    except Exception as exc:
        self.retry(exc=exc, countdown=60)


def generate_thumbnail(input_path: str, output_path: str, time: str = "00:00:05") -> None:
    """從影片生成縮圖"""
    cmd = [
        "ffmpeg", "-y",
        "-i", input_path,
        "-ss", time,
        "-vframes", "1",
        "-vf", "scale=640:360",
        output_path
    ]
    subprocess.run(cmd, check=True, capture_output=True)


def transcode_to_hls(
    input_path: str,
    output_dir: str,
    resolution: str,
    bitrate: str
) -> None:
    """轉碼影片為 HLS 格式"""
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "playlist.m3u8")

    cmd = [
        "ffmpeg", "-y",
        "-i", input_path,
        "-vf", f"scale={resolution}",
        "-c:v", "libx264",
        "-preset", "medium",
        "-b:v", bitrate,
        "-c:a", "aac",
        "-b:a", "128k",
        "-hls_time", "10",
        "-hls_list_size", "0",
        "-hls_segment_filename", os.path.join(output_dir, "segment_%03d.ts"),
        "-f", "hls",
        output_path
    ]
    subprocess.run(cmd, check=True, capture_output=True)


def generate_master_playlist(output_dir: str) -> str:
    """生成 HLS 主播放列表"""
    master_path = os.path.join(output_dir, "master.m3u8")

    content = """#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=2628000,RESOLUTION=1280x720
720p/playlist.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=5128000,RESOLUTION=1920x1080
1080p/playlist.m3u8
"""

    with open(master_path, "w") as f:
        f.write(content)

    return master_path


@celery_app.task(bind=True)
def get_video_duration(self, input_path: str) -> Optional[int]:
    """
    取得影片時長（秒）

    Args:
        input_path: 影片路徑

    Returns:
        影片時長（秒）
    """
    try:
        cmd = [
            "ffprobe",
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            input_path
        ]
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        return int(float(result.stdout.strip()))
    except Exception:
        return None
