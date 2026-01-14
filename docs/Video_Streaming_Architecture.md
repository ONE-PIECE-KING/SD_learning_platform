# 影片上傳、轉檔、串流 技術架構文件

> 線上學習平台 MVP - 影片處理系統設計規格書
>
> 版本: 1.0
> 更新日期: 2026-01-14
> 作者: 技術團隊

---

## 目錄

1. [系統概述](#1-系統概述)
2. [影片上傳機制](#2-影片上傳機制)
3. [影片轉碼流程](#3-影片轉碼流程)
4. [HLS 串流播放](#4-hls-串流播放)
5. [存儲架構設計](#5-存儲架構設計)
6. [安全機制](#6-安全機制)
7. [技術選型](#7-技術選型)
8. [效能指標](#8-效能指標)
9. [實作範例](#9-實作範例)

---

## 1. 系統概述

### 1.1 整體架構圖

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            VIDEO PIPELINE ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│   Worker    │────▶│   Storage   │
│  (React)    │     │  (FastAPI)  │     │  (Celery)   │     │  (MinIO)    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                    │                   │                   │
      ▼                    ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ 分段上傳     │     │ Presigned   │     │ FFmpeg      │     │ HLS 串流    │
│ 進度追蹤     │     │ URL 生成    │     │ 轉碼        │     │ Segments    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### 1.2 核心流程

```
用戶上傳影片 → 分段上傳至 MinIO → 觸發轉碼任務 → FFmpeg 轉 HLS → 存儲至 MinIO → 前端串流播放
```

### 1.3 技術堆疊

| 層級 | 技術 | 用途 |
|------|------|------|
| Frontend | React + HLS.js | 影片播放器 |
| Backend | FastAPI | API 服務 |
| Worker | Celery + Redis | 非同步轉碼 |
| Transcoder | FFmpeg | 影片轉碼 |
| Storage | MinIO (S3 相容) | 檔案存儲 |
| Protocol | HLS (fMP4) | 串流協議 |

---

## 2. 影片上傳機制

### 2.1 為什麼使用分段上傳 (Multipart Upload)

| 優點 | 說明 |
|------|------|
| **斷點續傳** | 網路中斷可從斷點繼續，不需重新上傳 |
| **並行上傳** | 多個 chunk 同時上傳，提升整體速度 |
| **大檔案支援** | 突破瀏覽器單檔上傳限制，支援 10GB+ |
| **進度追蹤** | 可即時計算並顯示上傳百分比 |
| **錯誤恢復** | 單一 chunk 失敗只需重傳該 chunk |

### 2.2 上傳流程圖

```
┌──────────────────────────────────────────────────────────────────┐
│                    MULTIPART UPLOAD FLOW                          │
└──────────────────────────────────────────────────────────────────┘

Frontend                     Backend                      MinIO
    │                           │                           │
    │  1. 初始化上傳請求         │                           │
    │ ─────────────────────────▶│                           │
    │   POST /videos/upload/init│                           │
    │   {filename, filesize,    │  create_multipart_upload  │
    │    content_type}          │ ─────────────────────────▶│
    │                           │◀───── upload_id ──────────│
    │◀──── upload_id + URLs ────│                           │
    │                           │                           │
    │  2. 直接上傳各分段到 MinIO  │                           │
    │ ─────────────────────────────────────────────────────▶│
    │   PUT presigned_url       │                           │
    │   Body: chunk_1 (5MB)     │                           │
    │◀─────────────────────────────────── ETag 1 ───────────│
    │                           │                           │
    │   PUT presigned_url       │                           │
    │   Body: chunk_2 (5MB)     │                           │
    │ ─────────────────────────────────────────────────────▶│
    │◀─────────────────────────────────── ETag 2 ───────────│
    │   ...重複直到所有 chunk     │                           │
    │                           │                           │
    │  3. 完成上傳               │                           │
    │ ─────────────────────────▶│                           │
    │   POST /videos/upload/    │  complete_multipart       │
    │        complete           │ ─────────────────────────▶│
    │   {upload_id, parts}      │◀───── 合併完成 ────────────│
    │                           │                           │
    │                           │  4. 觸發轉碼任務           │
    │                           │ ──▶ Celery Worker         │
    │◀── 返回 video_id ─────────│                           │
```

### 2.3 關鍵參數配置

```python
# 上傳參數配置
UPLOAD_CONFIG = {
    "CHUNK_SIZE": 5 * 1024 * 1024,           # 5MB (S3 最小 chunk 大小)
    "MAX_VIDEO_SIZE": 10 * 1024 * 1024 * 1024,  # 10GB
    "PRESIGNED_URL_EXPIRY": 3600,            # 1 小時
    "MAX_UPLOAD_DURATION": 24 * 3600,        # 24 小時內完成
    "ALLOWED_CONTENT_TYPES": [
        "video/mp4",
        "video/quicktime",      # .mov
        "video/x-msvideo",      # .avi
        "video/x-matroska",     # .mkv
        "video/webm"
    ]
}
```

### 2.4 檔案驗證機制

```python
# 檔案安全驗證 (後端)
class VideoValidator:
    # Magic bytes 簽名驗證 (防止偽造副檔名)
    VIDEO_SIGNATURES = {
        b'\x00\x00\x00\x18ftypmp42': 'mp4',
        b'\x00\x00\x00\x1cftypisom': 'mp4',
        b'\x66\x74\x79\x70': 'mp4/mov',
        b'\x1a\x45\xdf\xa3': 'mkv/webm',
        b'\x52\x49\x46\x46': 'avi'
    }

    def validate(self, file_path: str) -> bool:
        # 1. 驗證檔案簽名
        # 2. 驗證檔案大小
        # 3. 驗證 MIME type
        # 4. 計算 SHA-256 hash
        pass
```

---

## 3. 影片轉碼流程

### 3.1 HLS (HTTP Live Streaming) 原理

HLS 是 Apple 開發的串流協議，將影片切割成多個小片段 (segments)，並透過播放清單 (playlist) 管理。

```
┌──────────────────────────────────────────────────────────────────┐
│                    HLS 轉碼輸出結構                                │
└──────────────────────────────────────────────────────────────────┘

Original Video (input.mp4)
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│                     FFmpeg Transcoder                          │
│                                                                │
│  編碼參數:                                                      │
│  - Video: H.264 (libx264), CRF 23                             │
│  - Audio: AAC, 128kbps, Stereo                                │
│  - GOP: 2 秒 (關鍵幀間隔)                                       │
│  - Segment: 6 秒                                               │
│  - Format: fMP4 (Fragmented MP4)                              │
└───────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  {video_id}/                                                     │
│  │                                                               │
│  ├── master.m3u8              # 主播放清單 (指向各畫質)           │
│  │                                                               │
│  ├── 360p/                    # 低畫質 (行動網路)                 │
│  │   ├── playlist.m3u8       # 360p 播放清單                     │
│  │   ├── init.mp4            # 初始化片段                        │
│  │   ├── segment-0.m4s       # 第 1 個片段 (0-6秒)               │
│  │   ├── segment-1.m4s       # 第 2 個片段 (6-12秒)              │
│  │   └── ...                                                     │
│  │                                                               │
│  ├── 720p/                    # 中畫質 (一般 WiFi)                │
│  │   ├── playlist.m3u8                                           │
│  │   └── segment-*.m4s                                           │
│  │                                                               │
│  └── 1080p/                   # 高畫質 (高速網路)                 │
│      ├── playlist.m3u8                                           │
│      └── segment-*.m4s                                           │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 自適應位元率 (ABR) 規格

| 畫質 | 解析度 | 視訊位元率 | 最大位元率 | Buffer | 適用場景 |
|------|--------|-----------|-----------|--------|----------|
| **360p** | 640×360 | 800 kbps | 856 kbps | 1,200 kbps | 3G / 行動網路 |
| **720p** | 1280×720 | 2,500 kbps | 2,675 kbps | 3,750 kbps | WiFi / 一般寬頻 |
| **1080p** | 1920×1080 | 5,000 kbps | 5,350 kbps | 7,500 kbps | 高速網路 / 大螢幕 |

### 3.3 FFmpeg 轉碼指令

```bash
# 完整 FFmpeg HLS 轉碼指令 (720p 為例)
ffmpeg -i input.mp4 \
  # 視訊編碼設定
  -c:v libx264 \                    # H.264 編碼器
  -preset fast \                    # 編碼速度/品質平衡
  -crf 23 \                         # 品質 (18-28, 越低越好)
  -b:v 2500k \                      # 目標位元率
  -maxrate 2675k \                  # 最大位元率
  -bufsize 3750k \                  # Buffer 大小
  -vf "scale=-2:720" \              # 縮放至 720p (保持比例)

  # 關鍵幀設定 (HLS 切割必須)
  -g 120 \                          # GOP = 120 幀 (2秒@60fps)
  -keyint_min 120 \                 # 最小關鍵幀間隔
  -sc_threshold 0 \                 # 停用場景偵測
  -force_key_frames "expr:gte(t,n_forced*2)" \  # 強制每 2 秒關鍵幀

  # 音訊編碼設定
  -c:a aac \                        # AAC 編碼器
  -b:a 128k \                       # 音訊位元率
  -ac 2 \                           # 雙聲道

  # HLS 輸出設定
  -f hls \                          # HLS 格式
  -hls_time 6 \                     # 每片段 6 秒
  -hls_segment_type fmp4 \          # fMP4 格式 (比 TS 更高效)
  -hls_playlist_type vod \          # VOD 模式
  -hls_list_size 0 \                # 保留所有片段
  -hls_flags independent_segments \ # 獨立片段
  -hls_segment_filename "720p/segment-%d.m4s" \

  720p/playlist.m3u8
```

### 3.4 Celery 非同步轉碼流程

```
┌──────────────────────────────────────────────────────────────────┐
│                    CELERY TRANSCODING PIPELINE                    │
└──────────────────────────────────────────────────────────────────┘

Backend API                Redis Queue              Celery Worker
    │                          │                          │
    │  上傳完成                 │                          │
    │  video.status='uploaded' │                          │
    │                          │                          │
    │  transcode_video.delay() │                          │
    │ ─────────────────────────▶│                          │
    │                          │                          │
    │                          │◀─── 取得任務 ─────────────│
    │                          │                          │
    │                          │    更新狀態               │
    │                          │    video.status=         │
    │                          │    'processing'          │
    │                          │                          │
    │                          │    執行 FFmpeg           │
    │◀─ WebSocket: 進度 10% ───│◀─── 進度回報 ────────────│
    │◀─ WebSocket: 進度 30% ───│◀─── 進度回報 ────────────│
    │◀─ WebSocket: 進度 60% ───│◀─── 進度回報 ────────────│
    │◀─ WebSocket: 進度 100% ──│◀─── 轉碼完成 ────────────│
    │                          │                          │
    │                          │    上傳 HLS 到 MinIO     │
    │                          │    video.status='ready'  │
    │                          │                          │
    │◀─ 轉碼完成通知 ───────────│◀─── 任務完成 ────────────│
```

### 3.5 轉碼任務狀態

| 狀態 | 說明 | 觸發條件 |
|------|------|----------|
| `pending` | 等待處理 | 剛建立 Video 記錄 |
| `uploading` | 上傳中 | 開始分段上傳 |
| `uploaded` | 上傳完成 | 所有 chunk 上傳完成 |
| `processing` | 轉碼中 | Celery Worker 開始處理 |
| `ready` | 可播放 | 轉碼完成，HLS 已上傳 |
| `failed` | 失敗 | 轉碼過程發生錯誤 |

---

## 4. HLS 串流播放

### 4.1 Master Playlist 結構

```m3u8
#EXTM3U
#EXT-X-VERSION:3

# 360p 變體
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360,CODECS="avc1.4D401E,mp4a.40.2"
360p/playlist.m3u8

# 720p 變體
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720,CODECS="avc1.4D401F,mp4a.40.2"
720p/playlist.m3u8

# 1080p 變體
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080,CODECS="avc1.4D4028,mp4a.40.2"
1080p/playlist.m3u8
```

### 4.2 Variant Playlist 結構 (720p 為例)

```m3u8
#EXTM3U
#EXT-X-VERSION:7
#EXT-X-TARGETDURATION:6
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-MAP:URI="init.mp4"

#EXTINF:6.000000,
segment-0.m4s
#EXTINF:6.000000,
segment-1.m4s
#EXTINF:6.000000,
segment-2.m4s
#EXTINF:4.500000,
segment-3.m4s
#EXT-X-ENDLIST
```

### 4.3 前端 HLS.js 播放架構

```
┌──────────────────────────────────────────────────────────────────┐
│                    HLS.js ADAPTIVE STREAMING                      │
└──────────────────────────────────────────────────────────────────┘

                     ┌─────────────────┐
                     │  Master M3U8    │
                     │  (ABR 清單)      │
                     └────────┬────────┘
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
     ┌──────────┐      ┌──────────┐      ┌──────────┐
     │  360p    │      │  720p    │      │  1080p   │
     │ 800kbps  │      │ 2.5Mbps  │      │  5Mbps   │
     └──────────┘      └──────────┘      └──────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   HLS.js ABR    │
                    │   Algorithm     │
                    │   (EWMA)        │
                    └────────┬────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            ▼                 ▼                 ▼
   ┌────────────────┐  ┌───────────┐  ┌────────────────┐
   │ 頻寬偵測        │  │ Buffer    │  │ 畫質切換       │
   │ 滑動平均        │  │ 30秒      │  │ < 1秒          │
   └────────────────┘  └───────────┘  └────────────────┘
```

### 4.4 瀏覽器支援

| 瀏覽器 | HLS 支援方式 |
|--------|-------------|
| Safari (macOS/iOS) | 原生支援 `<video src="*.m3u8">` |
| Chrome | 需 HLS.js |
| Firefox | 需 HLS.js |
| Edge | 需 HLS.js |
| Android WebView | 需 HLS.js |

---

## 5. 存儲架構設計

### 5.1 MinIO Bucket 結構

```
learning-platform/                    # 主 Bucket
│
├── uploads/                          # 原始檔案區 (私有)
│   └── originals/
│       └── {video_id}/
│           └── original.mp4          # 原始影片
│
├── transcoded/                       # HLS 串流區 (公開讀取)
│   └── {video_id}/
│       ├── master.m3u8              # 主播放清單
│       │
│       ├── 360p/
│       │   ├── playlist.m3u8        # 360p 播放清單
│       │   ├── init.mp4             # 初始化片段
│       │   ├── segment-0.m4s        # 影片片段
│       │   ├── segment-1.m4s
│       │   └── ...
│       │
│       ├── 720p/
│       │   ├── playlist.m3u8
│       │   ├── init.mp4
│       │   └── segment-*.m4s
│       │
│       └── 1080p/
│           ├── playlist.m3u8
│           ├── init.mp4
│           └── segment-*.m4s
│
├── thumbnails/                       # 縮圖區 (公開讀取)
│   └── {video_id}/
│       ├── thumb-0.jpg              # 0 秒縮圖
│       ├── thumb-30.jpg             # 30 秒縮圖
│       └── sprite.jpg               # 預覽圖片集
│
└── temp/                             # 暫存區 (自動清理)
    └── {upload_id}/
        └── chunks/
```

### 5.2 Bucket Policy 設定

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicReadTranscoded",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::learning-platform/transcoded/*"
    },
    {
      "Sid": "AllowPublicReadThumbnails",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::learning-platform/thumbnails/*"
    },
    {
      "Sid": "DenyPublicUploads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::learning-platform/uploads/*",
      "Condition": {
        "StringNotEquals": {
          "aws:PrincipalArn": "arn:aws:iam::*:role/backend-service"
        }
      }
    }
  ]
}
```

### 5.3 生命週期規則

```yaml
# MinIO Lifecycle Configuration
lifecycle_rules:
  - id: "cleanup-temp-uploads"
    prefix: "temp/"
    status: Enabled
    expiration:
      days: 1                    # 暫存檔 1 天後刪除

  - id: "archive-originals"
    prefix: "uploads/originals/"
    status: Enabled
    transition:
      days: 30
      storage_class: "GLACIER"   # 30 天後轉冷存儲
```

---

## 6. 安全機制

### 6.1 Token-Based 存取控制流程

```
┌──────────────────────────────────────────────────────────────────┐
│                    VIDEO ACCESS CONTROL FLOW                      │
└──────────────────────────────────────────────────────────────────┘

User                      Backend                    MinIO/CDN
  │                          │                          │
  │  1. 請求播放影片          │                          │
  │ ─────────────────────────▶│                          │
  │    GET /videos/{id}/stream                          │
  │    Header: Authorization: Bearer {jwt}              │
  │                          │                          │
  │                          │  2. 權限驗證              │
  │                          │  ┌──────────────────┐    │
  │                          │  │ - JWT 有效?       │    │
  │                          │  │ - 用戶已購買?     │    │
  │                          │  │ - 課程已發布?     │    │
  │                          │  └──────────────────┘    │
  │                          │                          │
  │  3. 返回帶 Token 的 URL   │                          │
  │◀─────────────────────────│                          │
  │  {                       │                          │
  │    stream_url: "...?token=xxx",                     │
  │    expires_in: 86400     │                          │
  │  }                       │                          │
  │                          │                          │
  │  4. 請求 HLS Master       │                          │
  │ ─────────────────────────────────────────────────────▶
  │    GET master.m3u8?token=xxx                        │
  │◀──────────────────────────────────────────────────────
  │                          │                          │
  │  5. 請求各 Segment        │                          │
  │ ─────────────────────────────────────────────────────▶
  │    GET segment-0.m4s?token=xxx                      │
  │◀──────────────────────────────────────────────────────
```

### 6.2 Video Access Token 結構

```python
# JWT Payload 結構
{
    "sub": "user_uuid",           # 用戶 ID
    "video_id": "video_uuid",     # 影片 ID
    "course_id": "course_uuid",   # 課程 ID
    "max_quality": "1080p",       # 最高可觀看畫質
    "iat": 1705200000,            # 簽發時間
    "exp": 1705286400,            # 過期時間 (24小時)
    "ip": "192.168.1.1",          # IP 綁定 (可選)
    "permissions": ["stream"]     # 權限類型
}
```

### 6.3 安全檢查清單

| 檢查項目 | 說明 | 實作方式 |
|----------|------|----------|
| 檔案類型驗證 | 防止惡意檔案上傳 | Magic bytes 簽名檢查 |
| 檔案大小限制 | 防止 DoS 攻擊 | 後端 + Nginx 限制 |
| Token 過期 | 限制播放時間 | JWT exp claim |
| IP 綁定 | 防止 Token 分享 | Optional IP check |
| Rate Limiting | 防止爬蟲下載 | API Gateway 限制 |
| HTTPS | 傳輸加密 | TLS 1.3 |
| CORS | 跨域保護 | 白名單 Origin |

### 6.4 進階保護 (Phase 2)

```
┌──────────────────────────────────────────────────────────────────┐
│                    DRM PROTECTION (Premium)                       │
└──────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │  Widevine DRM   │
                    │  License Server │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
  │ Chrome/Edge │    │ Safari      │    │ Firefox     │
  │ Widevine    │    │ FairPlay    │    │ Widevine    │
  └─────────────┘    └─────────────┘    └─────────────┘
```

---

## 7. 技術選型

### 7.1 MVP 階段 (Phase 1)

| 組件 | 選擇 | 原因 |
|------|------|------|
| **上傳機制** | Multipart + Presigned URL | 簡單可靠，支援大檔案，直傳 S3 |
| **轉碼引擎** | FFmpeg | 開源、功能完整、社群支援 |
| **任務佇列** | Celery + Redis | Python 生態系標準選擇 |
| **串流協議** | HLS (fMP4) | 相容性最佳，支援 ABR |
| **存儲服務** | MinIO | S3 相容，可自建，成本低 |
| **前端播放** | HLS.js | 開源、穩定、功能完整 |
| **畫質** | 720p 單一畫質 | MVP 簡化，快速上線 |

### 7.2 進階階段 (Phase 2)

| 組件 | 升級方案 | 原因 |
|------|----------|------|
| **畫質** | 360p/720p/1080p ABR | 適應不同網路環境 |
| **CDN** | CloudFlare / AWS CloudFront | 加速全球存取，降低延遲 |
| **監控** | Prometheus + Grafana | 即時監控轉碼狀態 |
| **縮圖** | FFmpeg + 自動生成 | 提升使用者體驗 |

### 7.3 Premium 階段 (Phase 3)

| 組件 | 升級方案 | 原因 |
|------|----------|------|
| **DRM** | Widevine / FairPlay | 付費內容版權保護 |
| **低延遲** | LL-HLS | 接近即時串流 (2-5秒) |
| **4K** | 2160p 變體 | 高端用戶需求 |
| **分析** | 播放品質分析 | 優化用戶體驗 |

---

## 8. 效能指標

### 8.1 目標 KPI

| 指標 | 目標值 | 測量方式 |
|------|--------|----------|
| **上傳速度** | 50-100 Mbps | 分段並行上傳 |
| **轉碼時間** | < 影片長度 50% | 720p 單一畫質 |
| **首次播放時間** | < 2 秒 | 從點擊到播放 |
| **畫質切換時間** | < 1 秒 | ABR 自動切換 |
| **Buffering 比例** | < 1% | 正常網路環境 |
| **錯誤率** | < 0.1% | 播放失敗次數 |

### 8.2 頻寬需求估算

| 畫質 | 位元率 | 1 小時影片大小 | 建議網路 |
|------|--------|---------------|----------|
| 360p | 800 kbps | ~350 MB | 2 Mbps |
| 720p | 2.5 Mbps | ~1.1 GB | 5 Mbps |
| 1080p | 5 Mbps | ~2.2 GB | 10 Mbps |

### 8.3 存儲空間估算

```
原始影片 (1080p, 1小時) ≈ 5-10 GB

轉碼後 HLS:
├── 360p  ≈ 350 MB
├── 720p  ≈ 1.1 GB
└── 1080p ≈ 2.2 GB
─────────────────────
總計     ≈ 3.6 GB (原始 + 轉碼)

壓縮比: 轉碼後 / 原始 ≈ 50-70%
```

---

## 9. 實作範例

### 9.1 Backend API 端點

```python
# FastAPI 路由定義
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.video import *

router = APIRouter(prefix="/videos", tags=["Videos"])

@router.post("/upload/init", response_model=VideoUploadInitResponse)
async def init_upload(
    request: VideoUploadInitRequest,
    current_user: User = Depends(get_current_instructor)
):
    """
    初始化分段上傳
    返回 upload_id 和各分段的 presigned URLs
    """
    pass

@router.post("/upload/{video_id}/complete")
async def complete_upload(
    video_id: UUID,
    request: VideoUploadCompleteRequest,
    current_user: User = Depends(get_current_instructor)
):
    """
    完成上傳並觸發轉碼
    """
    pass

@router.get("/{video_id}/stream", response_model=VideoStreamResponse)
async def get_stream_url(
    video_id: UUID,
    current_user: User = Depends(get_current_user)
):
    """
    獲取 HLS 串流 URL (需驗證權限)
    """
    pass

@router.get("/{video_id}/progress", response_model=TranscodeProgressResponse)
async def get_transcode_progress(
    video_id: UUID,
    current_user: User = Depends(get_current_instructor)
):
    """
    獲取轉碼進度
    """
    pass
```

### 9.2 Celery 轉碼任務

```python
# worker/tasks/video_processing.py
from celery import shared_task
import subprocess

@shared_task(bind=True, max_retries=3)
def transcode_video(self, video_id: str, input_path: str):
    """
    非同步影片轉碼任務
    """
    try:
        # 更新狀態
        self.update_state(state='PROGRESS', meta={'progress': 0})

        # 執行 FFmpeg 轉碼
        qualities = ['720p']  # MVP: 單一畫質

        for quality in qualities:
            cmd = build_ffmpeg_command(input_path, video_id, quality)
            process = subprocess.Popen(cmd, ...)

            # 監控進度
            for progress in monitor_ffmpeg_progress(process):
                self.update_state(
                    state='PROGRESS',
                    meta={'progress': progress, 'quality': quality}
                )

        # 上傳到 MinIO
        upload_hls_to_minio(video_id)

        # 更新資料庫
        update_video_status(video_id, 'ready')

        return {'status': 'completed', 'video_id': video_id}

    except Exception as e:
        update_video_status(video_id, 'failed', str(e))
        raise self.retry(exc=e, countdown=60)
```

### 9.3 React HLS Player 組件

```tsx
// components/VideoPlayer.tsx
import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  streamUrl: string;
  onProgress?: (position: number) => void;
}

export function VideoPlayer({ streamUrl, onProgress }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [quality, setQuality] = useState<string>('auto');
  const [levels, setLevels] = useState<QualityLevel[]>([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLevels(hls.levels.map((l, i) => ({
          index: i,
          height: l.height,
          bitrate: l.bitrate,
        })));
      });

      hlsRef.current = hls;

      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    }
  }, [streamUrl]);

  return (
    <div className="video-container">
      <video ref={videoRef} controls />
      <QualitySelector
        levels={levels}
        current={quality}
        onChange={setQuality}
      />
    </div>
  );
}
```

---

## 附錄

### A. 相關文件連結

- [MVP 系統架構](./MVP_系統架構.md)
- [API 設計規格](./api_design.md)
- [資料庫 Schema](../backend/alembic/)

### B. 參考資源

- [HLS 協議規範 (RFC 8216)](https://datatracker.ietf.org/doc/html/rfc8216)
- [FFmpeg HLS 文檔](https://ffmpeg.org/ffmpeg-formats.html#hls)
- [HLS.js 官方文檔](https://github.com/video-dev/hls.js)
- [MinIO 文檔](https://min.io/docs/minio/linux/index.html)

### C. 更新記錄

| 版本 | 日期 | 更新內容 |
|------|------|----------|
| 1.0 | 2026-01-14 | 初版文件 |

---

> **文件維護**: 技術團隊
> **最後更新**: 2026-01-14
