# 🎓 SD Learning Platform

**線上學習平台 MVP** - 6 週內交付核心價值

> 採用模組化單體架構 (Modular Monolith)，快速迭代、成本可控

---

## 📋 專案概覽

### 🎯 五大核心功能

| # | 功能 | 說明 |
|---|------|------|
| 1 | **環境架設與資料庫** | Docker 容器化、PostgreSQL、Redis、MinIO |
| 2 | **用戶認證** | Google OAuth SSO、JWT Token |
| 3 | **課程瀏覽** | 課程列表、搜尋、詳情頁 |
| 4 | **影片上傳** | 分段上傳、HLS 轉碼、AI 審核 |
| 5 | **影片播放** | HLS 串流、斷點續看 |

### 🛠️ 技術棧

| 分類 | 技術 |
|------|------|
| **Frontend** | Next.js 14+, TypeScript, Tailwind CSS, Zustand |
| **Backend** | FastAPI, Python 3.11+, SQLAlchemy 2.0, Pydantic 2 |
| **Database** | PostgreSQL 15+, Redis 7+ |
| **Storage** | MinIO (S3 相容) |
| **Infrastructure** | Docker, Nginx, Celery |

---

## 🚀 快速開始

### 環境需求

- Docker & Docker Compose
- Node.js 20+ (前端開發)
- Python 3.11+ (後端開發)
- Git

### 啟動開發環境

```bash
# 1. Clone 專案
git clone https://github.com/your-username/SD_learning_platform.git
cd SD_learning_platform

# 2. 複製環境變數
cp .env.example .env

# 3. 啟動所有服務
docker-compose up -d

# 4. 查看服務狀態
docker-compose ps
```

### 服務端點

| 服務 | URL | 說明 |
|------|-----|------|
| Frontend | http://localhost:3000 | Next.js 前端 |
| Backend API | http://localhost:8000 | FastAPI 後端 |
| API Docs | http://localhost:8000/docs | Swagger UI |
| MinIO Console | http://localhost:9001 | 物件儲存管理 |
| PostgreSQL | localhost:5432 | 資料庫 |
| Redis | localhost:6379 | 快取/佇列 |

---

## 📁 專案結構

```
SD_learning_platform/
├── frontend/                    # Next.js 前端
│   ├── src/
│   │   ├── app/                 # App Router (頁面)
│   │   ├── components/          # React 元件
│   │   ├── hooks/               # 自定義 Hooks
│   │   ├── lib/                 # 工具函式
│   │   ├── services/            # API 呼叫
│   │   └── styles/              # 樣式
│   └── public/                  # 靜態資源
│
├── backend/                     # FastAPI 後端
│   ├── app/
│   │   ├── api/v1/              # API 路由
│   │   ├── core/                # 核心設定
│   │   ├── models/              # SQLAlchemy Models
│   │   ├── schemas/             # Pydantic Schemas
│   │   ├── services/            # 業務邏輯
│   │   ├── repositories/        # 資料存取層
│   │   └── tasks/               # Celery 任務
│   ├── alembic/                 # 資料庫遷移
│   ├── tests/                   # 測試
│   └── main.py                  # 應用入口
│
├── worker/                      # Celery Worker
│   ├── tasks/
│   │   ├── video_processing.py  # 影片處理
│   │   └── ai_review.py         # AI 審核
│   └── celery_app.py
│
├── nginx/                       # Nginx 設定
├── docker/                      # Dockerfile
├── docs/                        # 專案文檔
│   ├── MVP_wbs.md               # WBS 開發計劃
│   └── MVP_系統架構.md           # 系統架構設計
│
├── docker-compose.yml           # 開發環境
├── .env.example                 # 環境變數範例
└── CLAUDE.md                    # AI 協作規範
```

---

## 📊 開發進度

### 里程碑

| ID | 名稱 | 週數 | 狀態 |
|----|------|------|------|
| M1 | 環境穩定化 | Week 1 | 🔄 進行中 |
| M2 | 認證閉環 | Week 2 | ⏳ 待處理 |
| M3 | 上傳-播放打通 | Week 4 | ⏳ 待處理 |
| M4 | 交付版本 | Week 6 | ⏳ 待處理 |

### WBS 任務追蹤

| Phase | 名稱 | 任務數 | 狀態 |
|-------|------|--------|------|
| 1.0 | 環境架設與資料庫 | 4 | 🔄 進行中 |
| 2.0 | 用戶認證系統 | 3 | ⏳ 待處理 |
| 3.0 | 課程內容展示 | 3 | ⏳ 待處理 |
| 4.0 | 內容管理與上傳 | 3 | ⏳ 待處理 |
| 5.0 | 影片串流播放 | 2 | ⏳ 待處理 |

> 詳細任務請參考 [docs/MVP_wbs.md](docs/MVP_wbs.md)

---

## 👥 團隊分工

| 模組 | Owner | 職責 |
|------|-------|------|
| `backend/core` | 冠瑋 | 核心業務邏輯、影片上傳 |
| `backend/auth` | Celia | 認證、權限、安全 |
| `backend/courses` | 子科 | 課程搜尋與管理 |
| `frontend/core` | 古古 | 前端核心架構 |
| `frontend/features` | Jane | 功能模組 |

---

## 🔧 開發指南

### 後端開發

```bash
# 進入後端目錄
cd backend

# 建立虛擬環境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安裝依賴
pip install -r requirements.txt

# 啟動開發伺服器
uvicorn main:app --reload --port 8000
```

### 前端開發

```bash
# 進入前端目錄
cd frontend

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

### 資料庫遷移

```bash
cd backend

# 建立遷移
alembic revision --autogenerate -m "描述"

# 執行遷移
alembic upgrade head
```

---

## 📝 Git 規範

### 分支策略

```
main (production)
  └── develop (integration)
        └── feature/<owner>-<module>-<feature>
```

### Commit 規範

使用 [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

# 範例
feat(auth): 新增 Google OAuth 登入
fix(video): 修正上傳進度顯示錯誤
docs(readme): 更新安裝說明
```

**Type**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

---

## 📚 相關文檔

- [系統架構設計](docs/MVP_系統架構.md) - 完整技術架構
- [WBS 開發計劃](docs/MVP_wbs.md) - 任務分解與排程
- [CLAUDE.md](CLAUDE.md) - AI 協作開發規範
- [VibeCoding 範本](VibeCoding_Workflow_Templates/) - 開發流程範本

---

## 📜 版本資訊

- **版本**: 0.1.0 (MVP)
- **更新日期**: 2025-12-29
- **狀態**: 開發中

---

**Built with ❤️ by SD Learning Team**
