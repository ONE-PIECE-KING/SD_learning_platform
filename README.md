# 線上學習平台 MVP

> 一站式影片課程學習平台，支援影片上傳、HLS 串流、課程管理與購買流程

## 技術架構

| 層級 | 技術選型 |
|------|----------|
| **Frontend** | Vite + React 18 + TypeScript + TailwindCSS |
| **Backend** | FastAPI + SQLAlchemy 2.0 (async) + Pydantic v2 |
| **Database** | PostgreSQL 15+ |
| **Cache/Queue** | Redis 7+ |
| **Storage** | MinIO (S3-compatible) |
| **Worker** | Celery + FFmpeg |
| **Proxy** | Nginx |
| **Container** | Docker Compose |

## 專案結構

```
Learning_platform/
├── backend/                    # FastAPI 後端服務
│   ├── app/
│   │   ├── api/v1/            # API 路由 (RESTful)
│   │   ├── core/              # 配置、資料庫連線
│   │   ├── models/            # SQLAlchemy ORM 模型
│   │   ├── repositories/      # 資料存取層
│   │   ├── schemas/           # Pydantic 請求/回應結構
│   │   ├── services/          # 業務邏輯層
│   │   └── tasks/             # 背景任務定義
│   ├── alembic/               # 資料庫遷移
│   ├── tests/                 # 單元測試與整合測試
│   ├── main.py                # 應用程式入口
│   └── requirements.txt       # Python 依賴
│
├── frontend/                   # React SPA 前端
│   ├── src/
│   │   ├── components/        # UI 元件
│   │   ├── contexts/          # React Context
│   │   ├── hooks/             # Custom Hooks
│   │   ├── layouts/           # 頁面佈局
│   │   ├── lib/               # 工具函式
│   │   └── pages/             # 頁面元件
│   └── package.json
│
├── worker/                     # Celery 背景任務
│   ├── celery_app.py          # Celery 配置
│   └── tasks/
│       ├── video_processing.py # 影片轉碼 (HLS)
│       └── ai_review.py        # AI 內容審核
│
├── docker/                     # Docker 建置檔
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── Dockerfile.worker
│
├── nginx/                      # Nginx 反向代理配置
│   ├── nginx.conf
│   └── conf.d/
│       ├── default.conf       # API/Media/Frontend 路由
│       └── frontend.conf      # 靜態檔案服務
│
├── scripts/
│   └── db/
│       └── init.sql           # 資料庫初始化
│
├── docs/                       # 專案文檔
│   ├── MVP_wbs.md             # 工作分解結構
│   ├── MVP_系統架構.md         # 系統架構設計
│   └── Project_Brief_and_PRD.md
│
├── docker-compose.yml          # 開發環境
├── docker-compose.prod.yml     # 生產環境
└── .env.example               # 環境變數範本
```

## 快速開始

### 前置需求

- Docker Desktop 4.0+
- Node.js 20+ (本地開發)
- Python 3.11+ (本地開發)

### 1. 環境設定

```bash
# 複製環境變數範本
cp .env.example .env

# 編輯 .env 填入必要設定
# - POSTGRES_PASSWORD
# - SECRET_KEY
# - MINIO_ROOT_PASSWORD
```

### 2. 啟動開發環境

```bash
# 啟動所有服務 (PostgreSQL, Redis, MinIO, Backend, Frontend, Worker)
docker-compose up -d

# 查看服務狀態
docker-compose ps

# 查看日誌
docker-compose logs -f backend
```

### 3. 資料庫遷移

```bash
# 進入 backend 容器執行遷移
docker-compose exec backend alembic upgrade head
```

### 4. 存取服務

| 服務 | URL | 說明 |
|------|-----|------|
| Frontend | http://localhost:5173 | React 開發伺服器 |
| Backend API | http://localhost:8000 | FastAPI 服務 |
| API Docs | http://localhost:8000/docs | Swagger UI |
| MinIO Console | http://localhost:9001 | 物件儲存管理 |
| PgAdmin | http://localhost:5050 | 資料庫管理 (需啟用 tools profile) |

### 5. 啟動管理工具 (可選)

```bash
# 啟動 PgAdmin
docker-compose --profile tools up -d pgadmin
```

## 開發指令

### Docker Compose

```bash
# 啟動服務
docker-compose up -d

# 停止服務
docker-compose down

# 重建特定服務
docker-compose up -d --build backend

# 清除所有資料 (含 volumes)
docker-compose down -v
```

### Backend 開發

```bash
# 本地安裝依賴
cd backend
pip install -r requirements.txt

# 本地執行 (需要 .env 配置)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 執行測試
pytest

# 建立新的資料庫遷移
alembic revision --autogenerate -m "description"

# 執行遷移
alembic upgrade head
```

### Frontend 開發

```bash
# 安裝依賴
cd frontend
npm install

# 開發伺服器
npm run dev

# 建置生產版本
npm run build

# 型別檢查
npm run type-check

# Lint 檢查
npm run lint
```

## 生產部署

```bash
# 使用生產配置啟動
docker-compose -f docker-compose.prod.yml up -d

# 生產環境包含:
# - Nginx 反向代理
# - 前端靜態檔案服務
# - 優化的資源配置
```

## 資料庫模型

```
Users (用戶)
├── OAuthAccounts (第三方登入)
├── Courses (課程) [講師]
│   ├── Chapters (章節)
│   │   └── Videos (影片)
│   └── CourseReviews (評價)
│       └── AIReviewResults (AI 審核)
├── Orders (訂單)
│   └── Payments (付款)
├── Enrollments (註冊)
│   └── VideoProgress (觀看進度)
└── AuditLogs (操作日誌)
```

## API 端點

### 認證
- `POST /api/v1/auth/register` - 註冊
- `POST /api/v1/auth/login` - 登入
- `POST /api/v1/auth/refresh` - 刷新 Token
- `GET /api/v1/auth/oauth/{provider}` - OAuth 登入

### 課程
- `GET /api/v1/courses` - 課程列表
- `GET /api/v1/courses/{id}` - 課程詳情
- `POST /api/v1/courses` - 建立課程 (講師)
- `PUT /api/v1/courses/{id}` - 更新課程

### 影片
- `POST /api/v1/videos/upload` - 上傳影片
- `GET /api/v1/videos/{id}/stream` - HLS 串流

### 訂單
- `POST /api/v1/orders` - 建立訂單
- `POST /api/v1/orders/{id}/pay` - 付款
- `GET /api/v1/orders` - 訂單列表

## 環境變數

| 變數 | 說明 | 預設值 |
|------|------|--------|
| `POSTGRES_USER` | 資料庫使用者 | learning_admin |
| `POSTGRES_PASSWORD` | 資料庫密碼 | (必填) |
| `POSTGRES_DB` | 資料庫名稱 | learning_platform |
| `REDIS_HOST` | Redis 主機 | redis |
| `MINIO_ROOT_USER` | MinIO 使用者 | minioadmin |
| `MINIO_ROOT_PASSWORD` | MinIO 密碼 | (必填) |
| `SECRET_KEY` | JWT 密鑰 | (必填) |

完整環境變數請參考 `.env.example`

---

## TaskMaster 開發協作

本專案整合 TaskMaster 智能協作系統，提供以下功能：

### 核心命令

| 命令 | 功能 |
|------|------|
| `/task-status` | 查看專案狀態與 WBS 進度 |
| `/task-next` | 獲得下個任務建議 |
| `/hub-delegate` | 委派任務給專業智能體 |
| `/review-code` | 程式碼審查 |

### 專案配置

- 專案資料: `.claude/taskmaster-data/project.json`
- WBS 任務: `.claude/taskmaster-data/wbs-todos.json`
- 專案規範: `CLAUDE.md`

---

## 授權

MIT License
