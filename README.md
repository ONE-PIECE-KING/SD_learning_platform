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
├── scripts/
│   └── db/
│       └── init.sql           # 資料庫初始化
│
├── docs/                       # 專案文檔
│   ├── MVP_wbs.md             # 工作分解結構
│   ├── MVP_系統架構.md         # 系統架構設計
│   ├── Database_Migration_Guide.md  # 資料庫遷移指南
│   └── Project_Brief_and_PRD.md
│
├── docker-compose.yml          # 開發環境
├── docker-compose.prod.yml     # 生產環境
└── .env.example               # 環境變數範本
```

---

## 完整建置步驟

### 前置需求

| 工具 | 版本 | 說明 |
|------|------|------|
| Docker Desktop | 4.0+ | 容器化服務 |
| Python | 3.11+ | 後端開發 |
| Node.js | 20+ | 前端開發 |
| uv (建議) | 最新 | Python 套件管理 (比 pip 快) |

### Step 1: 複製專案

```bash
git clone <repository-url>
cd SD_learning_platform
```

### Step 2: 環境變數設定

```bash
# 複製環境變數範本
cp .env.example .env

# 編輯 .env (可選，開發環境用預設值即可)
```

開發環境預設值：
- PostgreSQL: `postgres:postgres@localhost:5432`
- Redis: `localhost:6379`
- MinIO: `minioadmin:minioadmin@localhost:9000`

### Step 3: 啟動 Docker 容器

```bash
# 啟動基礎服務 (PostgreSQL, Redis, MinIO)
docker-compose up -d postgres redis minio

# 確認容器狀態
docker-compose ps

# 預期輸出:
# learning_platform_postgres   running   0.0.0.0:5432->5432/tcp
# learning_platform_redis      running   0.0.0.0:6379->6379/tcp
# learning_platform_minio      running   0.0.0.0:9000-9001->9000-9001/tcp
```

### Step 4: 建立 Python 虛擬環境

```bash
# 使用 uv (推薦)
uv venv .venv
.venv\Scripts\activate    # Windows
source .venv/bin/activate # Linux/Mac

# 或使用 venv
python -m venv .venv
.venv\Scripts\activate    # Windows
source .venv/bin/activate # Linux/Mac
```

### Step 5: 安裝 Backend 依賴

```bash
cd backend

# 使用 uv (推薦)
uv pip install -r requirements.txt

# 或使用 pip
pip install -r requirements.txt
```

### Step 6: 設定 Backend 環境變數

```bash
# 複製範本
cp .env.example .env

# 確認 DATABASE_URL 設定 (Windows 需加 ssl=disable)
# DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/learning_platform?ssl=disable"
```

### Step 7: 資料庫遷移

```bash
cd backend

# Windows 可能需要設定 UTF-8
set PYTHONUTF8=1

# 生成 migration (首次)
alembic revision --autogenerate -m "initial_schema"

# 執行 migration
alembic upgrade head

# 驗證資料表已建立
docker exec -it learning_platform_postgres psql -U postgres -d learning_platform -c "\dt"
```

### Step 8: 啟動 Backend 服務

```bash
cd backend

# 開發模式 (hot reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 或
python main.py
```

### Step 9: 安裝 Frontend 依賴

```bash
cd frontend

npm install
```

### Step 10: 啟動 Frontend 服務

```bash
cd frontend

npm run dev
```

---

## 服務存取

| 服務 | URL | 說明 |
|------|-----|------|
| Frontend | http://localhost:5173 | React 開發伺服器 |
| Backend API | http://localhost:8000 | FastAPI 服務 |
| API Docs | http://localhost:8000/docs | Swagger UI |
| MinIO Console | http://localhost:9001 | 物件儲存管理 |
| PgAdmin | http://localhost:5050 | 資料庫管理 (需啟用 tools profile) |
| Redis Commander | http://localhost:8081 | Redis 管理 (需啟用 tools profile) |

### 啟動管理工具 (可選)

```bash
docker-compose --profile tools up -d
```

---

## 開發指令速查

### Docker Compose

```bash
# 啟動基礎服務
docker-compose up -d postgres redis minio

# 啟動全部服務 (含 backend, frontend, worker)
docker-compose --profile full up -d

# 停止服務
docker-compose down

# 停止並清除資料
docker-compose down -v

# 查看日誌
docker-compose logs -f postgres
```

### Backend

```bash
cd backend

# 啟動開發伺服器
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 執行測試
pytest

# 資料庫遷移
alembic revision --autogenerate -m "description"
alembic upgrade head
alembic downgrade -1

# 查看遷移狀態
alembic current
alembic history
```

### Frontend

```bash
cd frontend

# 開發伺服器
npm run dev

# 建置生產版本
npm run build

# 型別檢查
npm run type-check

# Lint 檢查
npm run lint
```

---

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

---

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

---

## 環境變數

| 變數 | 說明 | 預設值 |
|------|------|--------|
| `POSTGRES_USER` | 資料庫使用者 | postgres |
| `POSTGRES_PASSWORD` | 資料庫密碼 | postgres |
| `POSTGRES_DB` | 資料庫名稱 | learning_platform |
| `REDIS_URL` | Redis 連線 | redis://localhost:6379/0 |
| `MINIO_ACCESS_KEY` | MinIO 使用者 | minioadmin |
| `MINIO_SECRET_KEY` | MinIO 密碼 | minioadmin |
| `SECRET_KEY` | JWT 密鑰 | (生產環境必填) |

完整環境變數請參考 `.env.example`

---

## 常見問題

### Windows 編碼問題

執行 alembic 時出現 `UnicodeDecodeError`：

```bash
set PYTHONUTF8=1
alembic revision --autogenerate -m "migration_name"
```

### 資料庫連線失敗

```bash
# 確認容器執行中
docker-compose ps

# 重啟 PostgreSQL
docker-compose restart postgres
```

### SSL 錯誤

在 `backend/.env` 的 DATABASE_URL 加上 `?ssl=disable`

---

## 相關文件

- [專案簡報與 PRD](./docs/Project_Brief_and_PRD.md)
- [MVP WBS 開發計劃](./docs/MVP_wbs.md)
- [MVP 系統架構文件](./docs/MVP_系統架構.md)
- [資料庫遷移指南](./docs/Database_Migration_Guide.md)
- [影片串流架構](./docs/Video_Streaming_Architecture.md)

---

## TaskMaster 開發協作

本專案整合 TaskMaster 智能協作系統：

| 命令 | 功能 |
|------|------|
| `/task-status` | 查看專案狀態與 WBS 進度 |
| `/task-next` | 獲得下個任務建議 |
| `/hub-delegate` | 委派任務給專業智能體 |
| `/review-code` | 程式碼審查 |

專案配置：
- 專案資料: `.claude/taskmaster-data/project.json`
- WBS 任務: `.claude/taskmaster-data/wbs-todos.json`
- 專案規範: `CLAUDE.md`

---

## 授權

MIT License
