# 整合性架構與設計文件 (Unified Architecture & Design Document) - 線上學習平台 MVP

---

**文件版本 (Document Version):** `v2.0`**最後更新 (Last Updated):** `2025-12-18`**主要作者 (Lead Author):** `技術架構師`**審核者 (Reviewers):** `Jane、古古`**狀態 (Status):** `草稿 (Draft) - 配合 PRD v1.1 更新`

---

## 目錄 (Table of Contents)

- [第 1 部分：架構總覽 (Architecture Overview)](about:blank#%E7%AC%AC-1-%E9%83%A8%E5%88%86%E6%9E%B6%E6%A7%8B%E7%B8%BD%E8%A6%BD-architecture-overview)
- [第 2 部分：需求摘要 (Requirements Summary)](about:blank#%E7%AC%AC-2-%E9%83%A8%E5%88%86%E9%9C%80%E6%B1%82%E6%91%98%E8%A6%81-requirements-summary)
- [第 3 部分：高層次架構設計 (High-Level Architectural Design)](about:blank#%E7%AC%AC-3-%E9%83%A8%E5%88%86%E9%AB%98%E5%B1%A4%E6%AC%A1%E6%9E%B6%E6%A7%8B%E8%A8%AD%E8%A8%88-high-level-architectural-design)
- [第 4 部分：技術選型詳述 (Technology Stack Details)](about:blank#%E7%AC%AC-4-%E9%83%A8%E5%88%86%E6%8A%80%E8%A1%93%E9%81%B8%E5%9E%8B%E8%A9%B3%E8%BF%B0-technology-stack-details)
- [第 5 部分：數據架構 (Data Architecture)](about:blank#%E7%AC%AC-5-%E9%83%A8%E5%88%86%E6%95%B8%E6%93%9A%E6%9E%B6%E6%A7%8B-data-architecture)
- [第 6 部分：詳細設計 (Detailed Design)](about:blank#%E7%AC%AC-6-%E9%83%A8%E5%88%86%E8%A9%B3%E7%B4%B0%E8%A8%AD%E8%A8%88-detailed-design)
- [第 7 部分：SEO 架構設計 (SEO Architecture)](about:blank#%E7%AC%AC-7-%E9%83%A8%E5%88%86seo-%E6%9E%B6%E6%A7%8B%E8%A8%AD%E8%A8%88-seo-architecture)
- [第 8 部分：穩定性設計 (Stability Design)](about:blank#%E7%AC%AC-8-%E9%83%A8%E5%88%86%E7%A9%A9%E5%AE%9A%E6%80%A7%E8%A8%AD%E8%A8%88-stability-design)
- [第 9 部分：部署與基礎設施 (Deployment & Infrastructure)](about:blank#%E7%AC%AC-9-%E9%83%A8%E5%88%86%E9%83%A8%E7%BD%B2%E8%88%87%E5%9F%BA%E7%A4%8E%E8%A8%AD%E6%96%BD-deployment--infrastructure)
- [第 10 部分：安全性與跨領域考量 (Security & Cross-Cutting Concerns)](about:blank#%E7%AC%AC-10-%E9%83%A8%E5%88%86%E5%AE%89%E5%85%A8%E6%80%A7%E8%88%87%E8%B7%A8%E9%A0%98%E5%9F%9F%E8%80%83%E9%87%8F-security--cross-cutting-concerns)
- [第 11 部分：監控與可觀測性 (Monitoring & Observability)](about:blank#%E7%AC%AC-11-%E9%83%A8%E5%88%86%E7%9B%A3%E6%8E%A7%E8%88%87%E5%8F%AF%E8%A7%80%E6%B8%AC%E6%80%A7-monitoring--observability)

---

**目的**: 本文件定義線上學習平台 MVP 的技術架構與設計。MVP 採用**模組化單體架構 (Modular Monolith)**，在有限資源下快速交付核心功能，同時保持未來擴展彈性。

**設計原則**:
- **簡單優先**: 避免過度設計，選擇成熟穩定的技術
- **快速迭代**: 易於開發、測試、部署
- **成本控制**: 最小化基礎設施成本 (本地 MinIO、自建服務)
- **未來可擴展**: 模組化設計，為後續拆分預留空間
- **SEO 友善**: SSR/SSG 確保搜尋引擎可索引

---

## 第 1 部分：架構總覽 (Architecture Overview)

### 1.1 系統情境圖 (System Context Diagram)

```mermaid
flowchart TB
    subgraph Users["使用者"]
        User["會員 (User)"]
        Admin["管理員"]
    end

    subgraph ExternalSystems["外部系統"]
        ECPay["ECPay 金流"]
        SendGrid["SendGrid<br/>(郵件)"]
        AI_API["OpenAI/Claude API<br/>(AI 審核)"]
        SocialLogin["Google/Facebook<br/>(OAuth 登入)"]
    end

    subgraph Infrastructure["自建基礎設施"]
        MinIO["MinIO<br/>(影片儲存)"]
        Nginx["Nginx<br/>(反向代理/快取)"]
    end

    Platform["線上學習平台<br/>MVP"]

    User -->|"瀏覽/購買/觀看/建立課程"| Nginx
    Admin -->|"審核/管理/監控"| Nginx
    Nginx -->|"路由請求"| Platform

    Platform -->|"處理付款"| ECPay
    Platform -->|"上傳/串流影片"| MinIO
    Platform -->|"發送郵件"| SendGrid
    Platform -->|"AI 內容審核"| AI_API
    Platform -->|"OAuth 認證"| SocialLogin

    Nginx -->|"快取影片串流"| MinIO
```

### 1.2 架構模式選擇

**選定模式**: 模組化單體架構 (Modular Monolith)

**選擇理由**:

| 考量因素 | 模組化單體 | 微服務 |
| --- | --- | --- |
| 開發複雜度 | 低 | 高 |
| 部署複雜度 | 低 | 高 |
| 團隊規模需求 | 2-3 人 | 5+ 人 |
| 基礎設施成本 | 低 | 高 |
| 開發速度 | 快 | 慢 |
| 未來可拆分 | 是 (模組化設計) | 已拆分 |

**結論**: MVP 階段團隊小、預算有限，採用模組化單體可快速交付，模組邊界清晰便於未來拆分。

### 1.3 模組劃分

```mermaid
flowchart TB
    subgraph Application["線上學習平台 (Modular Monolith)"]
        subgraph AuthModule["認證模組<br/>(Auth Module)"]
            Auth1["Email 註冊/登入"]
            Auth2["OAuth 登入<br/>(Google/FB)"]
            Auth3["JWT Token"]
        end

        subgraph UserModule["用戶模組<br/>(User Module)"]
            User1["會員管理"]
            User2["角色權限<br/>(USER/ADMIN)"]
        end

        subgraph CourseModule["課程模組<br/>(Course Module)"]
            Course1["課程 CRUD"]
            Course2["章節管理"]
            Course3["搜尋"]
        end

        subgraph VideoModule["影片模組<br/>(Video Module)"]
            Video1["影片上傳"]
            Video2["Processing Pipeline<br/>(截圖/轉檔)"]
            Video3["串流服務"]
        end

        subgraph PaymentModule["支付模組<br/>(Payment Module)"]
            Pay1["訂單管理"]
            Pay2["ECPay 整合"]
            Pay3["收益計算"]
        end

        subgraph EnrollmentModule["報名模組<br/>(Enrollment Module)"]
            Enroll1["課程報名"]
            Enroll2["進度追蹤"]
        end

        subgraph ReviewModule["審核模組<br/>(Review Module)"]
            Review1["課程審核"]
            Review2["AI 審核服務"]
        end

        subgraph AdminModule["管理模組<br/>(Admin Module)"]
            Admin1["KPI 儀表板"]
            Admin2["稽核日誌"]
        end
    end

    AuthModule --> UserModule
    CourseModule --> VideoModule
    CourseModule --> ReviewModule
    PaymentModule --> EnrollmentModule
    VideoModule --> ReviewModule
```

### 1.4 專案目錄結構

```
project-root/
├── frontend/                    # Next.js 前端
│   ├── src/
│   │   ├── app/                 # App Router (Next.js 14+)
│   │   ├── components/          # React 元件
│   │   ├── hooks/               # 自定義 Hooks
│   │   ├── lib/                 # 工具函式
│   │   ├── services/            # API 呼叫
│   │   └── styles/              # 樣式檔案
│   ├── public/                  # 靜態資源
│   ├── next.config.js
│   └── package.json
│
├── backend/                     # FastAPI 後端
│   ├── app/
│   │   ├── api/                 # API 路由
│   │   │   └── v1/              # API 版本控制
│   │   ├── core/                # 核心設定
│   │   │   ├── config.py        # 環境配置
│   │   │   ├── security.py      # 安全相關
│   │   │   └── deps.py          # 依賴注入
│   │   ├── models/              # SQLAlchemy Models
│   │   ├── schemas/             # Pydantic Schemas
│   │   ├── services/            # 業務邏輯
│   │   ├── repositories/        # 資料存取層
│   │   └── tasks/               # Celery 任務
│   ├── alembic/                 # 資料庫遷移
│   ├── tests/                   # 測試
│   ├── requirements.txt
│   └── main.py
│
├── worker/                      # Celery Worker
│   ├── tasks/
│   │   ├── video_processing.py
│   │   └── ai_review.py
│   └── celery_app.py
│
├── nginx/                       # Nginx 設定
│   ├── nginx.conf
│   └── conf.d/
│
├── docker/                      # Docker 相關
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── Dockerfile.worker
│
├── docker-compose.yml           # 開發環境
├── docker-compose.prod.yml      # 生產環境
└── .env.example                 # 環境變數範例
```

---

## 第 2 部分：需求摘要 (Requirements Summary)

### 2.1 角色定義

| 角色 | 代碼 | 說明 |
| --- | --- | --- |
| **會員 (User)** | `USER` | 一般會員，可瀏覽/購買/觀看課程，也可建立課程販售 |
| **管理員 (Admin)** | `ADMIN` | 平台管理者，審核課程、管理用戶、查看營運數據 |

### 2.2 功能性需求摘要

| 模組 | 核心功能 | 對應使用者故事 |
| --- | --- | --- |
| 認證模組 | Email/Google/FB 登入、JWT | US-AUTH-001~003 |
| 用戶模組 | 用戶管理、角色權限 | US-ADM-004~006 |
| 課程模組 | 課程 CRUD、搜尋瀏覽 | US-STU-001~002, US-TCH-002 |
| 影片模組 | 影片上傳、AI 預處理、串流 | US-TCH-003, US-STU-004 |
| 支付模組 | 訂單、ECPay 付款 | US-STU-003 |
| 報名模組 | 課程報名、進度追蹤 | US-STU-004~005 |
| 審核模組 | 課程審核、AI 內容分析 | US-ADM-001~003, US-SYS-001 |
| 管理模組 | KPI 儀表板、稽核日誌 | US-ADM-007~008 |

---

## 第 3 部分：高層次架構設計 (High-Level Architectural Design)

### 3.1 系統架構圖

```mermaid
flowchart TB
    subgraph Client["客戶端"]
        Browser["Web Browser"]
    end

    subgraph Nginx["Nginx 反向代理"]
        NginxProxy["負載均衡<br/>SSL 終止<br/>靜態快取"]
    end

    subgraph AppServers["應用伺服器"]
        NextJS["Next.js<br/>(SSR/SSG Frontend)"]
        FastAPI["FastAPI<br/>(Backend API)"]
    end

    subgraph Workers["背景任務"]
        Celery["Celery Worker"]
        Beat["Celery Beat<br/>(定時任務)"]
    end

    subgraph DataStores["資料儲存"]
        PostgreSQL[(PostgreSQL)]
        Redis[(Redis<br/>Cache/Queue/Session)]
        MinIO[(MinIO<br/>影片/檔案儲存)]
    end

    subgraph ExternalServices["外部服務"]
        SendGrid["SendGrid"]
        ECPay["ECPay"]
        AI_API["OpenAI/Claude"]
        OAuth["Google/FB OAuth"]
    end

    Browser --> NginxProxy
    NginxProxy --> NextJS
    NginxProxy -->|"/api/*"| FastAPI
    NginxProxy -->|"/media/*"| MinIO

    NextJS -->|"SSR API calls"| FastAPI
    FastAPI --> PostgreSQL
    FastAPI --> Redis
    FastAPI --> MinIO
    FastAPI -->|"發送任務"| Redis

    Redis -->|"消費任務"| Celery
    Celery --> PostgreSQL
    Celery --> MinIO
    Celery --> AI_API

    FastAPI --> SendGrid
    FastAPI --> ECPay
    FastAPI --> OAuth
```

### 3.2 請求流程說明

```mermaid
sequenceDiagram
    participant B as Browser
    participant N as Nginx
    participant F as Next.js
    participant A as FastAPI
    participant R as Redis
    participant P as PostgreSQL

    Note over B,P: 頁面請求流程 (SSR)
    B->>N: GET /courses
    N->>F: 轉發請求
    F->>A: API 呼叫 (Server Side)
    A->>R: 檢查快取
    alt Cache Hit
        R-->>A: 返回快取資料
    else Cache Miss
        A->>P: 查詢資料庫
        P-->>A: 返回資料
        A->>R: 寫入快取
    end
    A-->>F: 返回 JSON
    F-->>N: 返回渲染 HTML
    N-->>B: 返回頁面

    Note over B,P: API 請求流程
    B->>N: POST /api/v1/courses
    N->>A: 轉發到 FastAPI
    A->>P: 資料庫操作
    P-->>A: 返回結果
    A-->>N: 返回 JSON
    N-->>B: 返回回應
```

### 3.3 關鍵流程設計

### 流程 1: 會員購買課程

```mermaid
sequenceDiagram
    participant U as 會員
    participant F as Frontend
    participant B as Backend
    participant E as ECPay
    participant DB as Database

    U->>F: 點擊購買課程
    F->>B: POST /api/v1/orders
    B->>DB: 建立訂單 (status: PENDING)
    B->>E: 請求付款頁面
    E-->>B: 返回付款 URL
    B-->>F: 返回付款 URL
    F->>U: 導向 ECPay 付款頁
    U->>E: 完成付款
    E->>B: POST /api/v1/payments/ecpay/callback
    B->>B: 驗證簽章
    B->>DB: 更新訂單 (status: PAID)
    B->>DB: 建立報名記錄
    B-->>E: 回應成功 (1|OK)
    E->>U: 導回平台
    U->>F: 查看我的課程
```

### 流程 2: 影片上傳與 AI 審核 Pipeline

```mermaid
sequenceDiagram
    participant U as 會員
    participant B as Backend API
    participant M as MinIO
    participant R as Redis Queue
    participant W as Celery Worker
    participant AI as AI API
    participant DB as Database

    U->>B: 上傳影片
    B->>M: 儲存原始檔案
    B->>DB: 建立影片記錄 (status: UPLOADING)
    B->>R: 發送任務 "process_video"
    B-->>U: 返回上傳成功

    R->>W: 消費任務
    W->>DB: 更新狀態 (status: PROCESSING)

    Note over W: Step 1: 影片處理
    W->>M: 下載影片
    W->>W: FFmpeg 截圖 (每 10s)
    W->>W: FFmpeg 提取音訊
    W->>W: Whisper 語音轉文字

    Note over W: Step 2: AI 分析
    W->>AI: 發送圖片 + 文字 + 課程描述
    AI-->>W: 返回審核結果

    Note over W: Step 3: 儲存結果
    W->>M: 儲存截圖/縮圖
    W->>DB: 儲存 AI 審核報告
    W->>DB: 更新狀態 (status: READY)
```

### 流程 3: OAuth 第三方登入

```mermaid
sequenceDiagram
    participant U as 使用者
    participant F as Frontend
    participant B as Backend
    participant O as OAuth Provider
    participant DB as Database

    U->>F: 點擊 "Google 登入"
    F->>B: GET /api/v1/auth/oauth/google
    B-->>F: 返回 OAuth URL
    F->>O: 導向 Google 授權頁
    U->>O: 同意授權
    O->>F: 導回 callback URL (含 code)
    F->>B: POST /api/v1/auth/oauth/google/callback
    B->>O: 交換 access_token
    O-->>B: 返回 user info
    B->>DB: 查詢/建立用戶
    B->>DB: 建立/更新 OAuth 連結
    B->>B: 產生 JWT
    B-->>F: 返回 JWT Token
    F->>F: 儲存 Token
    F-->>U: 登入成功
```

---

## 第 4 部分：技術選型詳述 (Technology Stack Details)

### 4.1 技術棧總覽

| 分類 | 技術 | 版本 | 說明 |
| --- | --- | --- | --- |
| **Frontend** | Next.js | 14+ | SSR/SSG 支援 SEO，App Router |
| **Frontend UI** | React | 18+ | 元件化開發 |
| **Frontend 狀態** | Zustand | 4+ | 輕量狀態管理 |
| **Frontend 樣式** | Tailwind CSS | 3+ | Utility-first CSS |
| **Backend** | FastAPI | 0.109+ | 高效能 Python API 框架 |
| **Backend 驗證** | Pydantic | 2+ | 資料驗證與序列化 |
| **ORM** | SQLAlchemy | 2.0+ | Async 支援 |
| **資料庫** | PostgreSQL | 15+ | 主要資料儲存 |
| **快取/佇列** | Redis | 7+ | 快取、Session、任務佇列 |
| **任務佇列** | Celery | 5+ | 背景任務處理 |
| **物件儲存** | MinIO | latest | S3 相容，本地部署 |
| **反向代理** | Nginx | 1.24+ | 負載均衡、SSL、快取 |
| **影片處理** | FFmpeg | 6+ | 影片轉檔、截圖 |
| **OAuth** | Authlib | 1.3+ | OAuth 2.0 客戶端 |
| **AI 審核** | OpenAI API | - | GPT-4 Vision 多模態分析 |

### 4.2 技術選型理由

### Frontend: Next.js

| 優點 | 說明 |
| --- | --- |
| SSR/SSG | 伺服器端渲染，SEO 友善 |
| App Router | 最新路由系統，支援 RSC |
| 生態系豐富 | React 生態完整支援 |
| 內建優化 | Image、Font、Script 優化 |

### Backend: FastAPI

| 優點 | 說明 |
| --- | --- |
| 高效能 | 基於 Starlette，接近 Go/Node 效能 |
| 自動文檔 | OpenAPI (Swagger) 自動生成 |
| Type Hints | 完整型別支援，減少錯誤 |
| Async | 原生非同步支援 |

### ORM: SQLAlchemy 2.0

| 優點 | 說明 |
| --- | --- |
| 成熟穩定 | Python ORM 標準 |
| Async 支援 | 2.0 版原生 async |
| 靈活查詢 | 支援複雜查詢需求 |
| 遷移工具 | Alembic 整合 |

### 物件儲存: MinIO

| 優點 | 說明 |
| --- | --- |
| S3 相容 | 可無痛遷移至 AWS S3 |
| 本地部署 | 節省雲端成本 |
| 高效能 | 適合影片儲存場景 |
| 開源免費 | 無授權費用 |

---

## 第 5 部分：數據架構 (Data Architecture)

### 5.1 資料庫 Schema (ERD)

> 圖例說明:
- PK = Primary Key (主鍵)
- FK = Foreign Key (外鍵)
- UK = Unique Key (唯一鍵)
- ||--|| = 一對一關係
- ||--o{ = 一對多關係
- o|--o{ = 零或一對多關係
> 

### 5.1.1 整體關聯圖

```mermaid
erDiagram
    %% ==================== 用戶相關 ====================
    users ||--o{ oauth_accounts : "users.id = oauth_accounts.user_id"
    users ||--o{ courses : "users.id = courses.creator_id"
    users ||--o{ orders : "users.id = orders.user_id"
    users ||--o{ enrollments : "users.id = enrollments.user_id"
    users ||--o{ audit_logs : "users.id = audit_logs.user_id"
    users ||--o{ course_reviews : "users.id = course_reviews.reviewer_id"

    %% ==================== 課程相關 ====================
    courses ||--|{ chapters : "courses.id = chapters.course_id"
    courses ||--o{ orders : "courses.id = orders.course_id"
    courses ||--o{ enrollments : "courses.id = enrollments.course_id"
    courses ||--o| course_reviews : "courses.id = course_reviews.course_id"

    %% ==================== 章節與影片 ====================
    chapters ||--|{ videos : "chapters.id = videos.chapter_id"

    %% ==================== 訂單與付款 ====================
    orders ||--|| payments : "orders.id = payments.order_id"
    orders ||--o| enrollments : "orders.id = enrollments.order_id"

    %% ==================== 學習進度 ====================
    enrollments ||--o{ video_progress : "enrollments.id = video_progress.enrollment_id"
    videos ||--o{ video_progress : "videos.id = video_progress.video_id"

    %% ==================== 審核相關 ====================
    course_reviews ||--o| ai_review_results : "course_reviews.id = ai_review_results.course_review_id"

    %% ==================== 資料表定義 ====================
    users {
        uuid id PK "主鍵"
        varchar(255) email UK "唯一，登入帳號"
        varchar(255) password_hash "密碼雜湊，OAuth用戶可為空"
        varchar(100) name "顯示名稱"
        enum role "USER | ADMIN"
        enum status "ACTIVE | SUSPENDED"
        varchar(500) avatar_url "頭像網址"
        text bio "個人簡介"
        timestamp created_at "建立時間"
        timestamp updated_at "更新時間"
    }

    oauth_accounts {
        uuid id PK "主鍵"
        uuid user_id FK "→ users.id"
        varchar(50) provider "google | facebook"
        varchar(255) provider_account_id "第三方平台用戶ID"
        varchar(500) access_token "存取令牌"
        varchar(500) refresh_token "刷新令牌"
        timestamp expires_at "令牌過期時間"
    }

    courses {
        uuid id PK "主鍵"
        uuid creator_id FK "→ users.id (課程創建者)"
        varchar(200) title "課程標題"
        text description "課程描述"
        varchar(500) cover_image "封面圖片網址"
        decimal(10_2) price "價格 (TWD)"
        enum status "DRAFT | PENDING | PUBLISHED | REJECTED"
        enum category "SOFTWARE_DEV | DATA_SCIENCE | OTHER"
        int total_duration "總時長 (秒)"
        timestamp created_at "建立時間"
        timestamp updated_at "更新時間"
    }

    chapters {
        uuid id PK "主鍵"
        uuid course_id FK "→ courses.id"
        varchar(200) title "章節標題"
        int order_index "排序索引"
        timestamp created_at "建立時間"
        timestamp updated_at "更新時間"
    }

    videos {
        uuid id PK "主鍵"
        uuid chapter_id FK "→ chapters.id"
        varchar(200) title "影片標題"
        varchar(500) storage_key "MinIO 物件鍵"
        varchar(500) thumbnail_url "縮圖網址"
        int duration "影片長度 (秒)"
        int order_index "排序索引"
        boolean is_preview "是否為預覽影片"
        enum status "UPLOADING | PROCESSING | READY | FAILED"
        timestamp created_at "建立時間"
        timestamp updated_at "更新時間"
    }

    orders {
        uuid id PK "主鍵"
        uuid user_id FK "→ users.id (購買者)"
        uuid course_id FK "→ courses.id (購買課程)"
        decimal(10_2) amount "訂單金額"
        decimal(10_2) platform_fee "平台抽成 (20%)"
        decimal(10_2) creator_revenue "創作者收益 (80%)"
        enum status "PENDING | PAID | REFUNDED | CANCELLED"
        timestamp created_at "建立時間"
        timestamp updated_at "更新時間"
    }

    payments {
        uuid id PK "主鍵"
        uuid order_id FK "→ orders.id (唯一)"
        varchar(50) ecpay_trade_no "ECPay 交易編號"
        decimal(10_2) amount "付款金額"
        timestamp paid_at "付款時間"
    }

    enrollments {
        uuid id PK "主鍵"
        uuid user_id FK "→ users.id"
        uuid course_id FK "→ courses.id"
        uuid order_id FK "→ orders.id (唯一)"
        decimal(5_2) progress_percentage "進度百分比 (0-100)"
        timestamp last_accessed_at "最後存取時間"
    }

    video_progress {
        uuid id PK "主鍵"
        uuid enrollment_id FK "→ enrollments.id"
        uuid video_id FK "→ videos.id"
        int watched_seconds "已觀看秒數"
        boolean completed "是否完成"
        timestamp last_watched_at "最後觀看時間"
    }

    course_reviews {
        uuid id PK "主鍵"
        uuid course_id FK "→ courses.id (唯一)"
        uuid reviewer_id FK "→ users.id (審核管理員，可為空)"
        enum status "PENDING | APPROVED | REJECTED"
        text feedback "審核意見"
        timestamp reviewed_at "審核時間"
        timestamp created_at "建立時間"
        timestamp updated_at "更新時間"
    }

    ai_review_results {
        uuid id PK "主鍵"
        uuid course_review_id FK "→ course_reviews.id (唯一)"
        enum status "PASSED | WARNING | FAILED"
        decimal(3_2) confidence_score "信心分數 (0.00-1.00)"
        json issues "違規項目列表"
        json raw_response "AI 原始回應"
        timestamp created_at "建立時間"
    }

    audit_logs {
        uuid id PK "主鍵"
        uuid user_id FK "→ users.id (操作者)"
        varchar(100) action "操作類型 (如 COURSE_APPROVED)"
        varchar(50) entity_type "實體類型 (如 Course)"
        uuid entity_id "實體 ID"
        json old_value "變更前的值"
        json new_value "變更後的值"
        varchar(50) ip_address "操作者 IP"
        timestamp created_at "建立時間"
    }
```

### 5.1.2 外鍵關聯對照表

| 子表 (Child Table) | 外鍵欄位 (FK Column) | 父表 (Parent Table) | 參照欄位 (Reference) | 關係類型 | 說明 |
| --- | --- | --- | --- | --- | --- |
| `oauth_accounts` | `user_id` | `users` | `id` | 多對一 | 一個用戶可綁定多個 OAuth 帳號 |
| `courses` | `creator_id` | `users` | `id` | 多對一 | 一個用戶可建立多門課程 |
| `chapters` | `course_id` | `courses` | `id` | 多對一 | 一門課程包含多個章節 |
| `videos` | `chapter_id` | `chapters` | `id` | 多對一 | 一個章節包含多部影片 |
| `orders` | `user_id` | `users` | `id` | 多對一 | 一個用戶可有多筆訂單 |
| `orders` | `course_id` | `courses` | `id` | 多對一 | 一門課程可被多次購買 |
| `payments` | `order_id` | `orders` | `id` | 一對一 | 一筆訂單對應一筆付款 |
| `enrollments` | `user_id` | `users` | `id` | 多對一 | 一個用戶可報名多門課程 |
| `enrollments` | `course_id` | `courses` | `id` | 多對一 | 一門課程可有多人報名 |
| `enrollments` | `order_id` | `orders` | `id` | 一對一 | 一筆訂單對應一筆報名 |
| `video_progress` | `enrollment_id` | `enrollments` | `id` | 多對一 | 一筆報名對應多部影片進度 |
| `video_progress` | `video_id` | `videos` | `id` | 多對一 | 一部影片可被多人觀看 |
| `course_reviews` | `course_id` | `courses` | `id` | 一對一 | 一門課程只有一個審核單 |
| `course_reviews` | `reviewer_id` | `users` | `id` | 多對一 | 一個管理員可審核多門課程 |
| `ai_review_results` | `course_review_id` | `course_reviews` | `id` | 一對一 | 一個審核單對應一份 AI 結果 |
| `audit_logs` | `user_id` | `users` | `id` | 多對一 | 一個用戶產生多筆操作日誌 |

### 5.1.3 複合唯一鍵約束

| 資料表 | 唯一鍵欄位組合 | 說明 |
| --- | --- | --- |
| `oauth_accounts` | `(provider, provider_account_id)` | 同一第三方平台帳號只能綁定一次 |
| `enrollments` | `(user_id, course_id)` | 同一用戶只能報名同一課程一次 |
| `video_progress` | `(enrollment_id, video_id)` | 同一報名記錄對同一影片只有一筆進度 |

### 5.1.4 核心業務流程資料流

```
購買課程流程:
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌─────────────┐
│  users   │───→│  orders  │───→│ payments │───→│ enrollments │
│ (購買者) │    │ (訂單)   │    │ (付款)   │    │ (報名記錄) │
└──────────┘    └──────────┘    └──────────┘    └─────────────┘
                     │
                     ↓
               ┌──────────┐
               │ courses  │
               │ (課程)   │
               └──────────┘

課程建立流程:
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  users   │───→│ courses  │───→│ chapters │───→│  videos  │
│ (創作者) │    │ (課程)   │    │ (章節)   │    │ (影片)   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │
                     ↓
            ┌────────────────┐    ┌───────────────────┐
            │ course_reviews │───→│ ai_review_results │
            │ (審核單)       │    │ (AI 審核結果)     │
            └────────────────┘    └───────────────────┘

學習進度追蹤:
┌─────────────┐    ┌────────────────┐
│ enrollments │───→│ video_progress │←───┌──────────┐
│ (報名記錄)  │    │ (觀看進度)     │    │  videos  │
└─────────────┘    └────────────────┘    └──────────┘
```

### 5.2 SQLAlchemy Models 定義

```python
# backend/app/models/base.py
from datetime import datetime
from uuid import uuid4
from sqlalchemy import Column, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

class TimestampMixin:
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
```

```python
# backend/app/models/user.py
from enum import Enum as PyEnum
from sqlalchemy import Column, String, Text, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from .base import Base, TimestampMixin

class UserRole(str, PyEnum):
    USER = "USER"      # 一般會員
    ADMIN = "ADMIN"    # 管理員

class UserStatus(str, PyEnum):
    ACTIVE = "ACTIVE"        # 正常
    SUSPENDED = "SUSPENDED"  # 停權

class User(Base, TimestampMixin):
    """用戶資料表"""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)  # OAuth 用戶可能無密碼
    name = Column(String(100), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    status = Column(Enum(UserStatus), default=UserStatus.ACTIVE, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)  # 個人簡介

    # 關聯
    oauth_accounts = relationship("OAuthAccount", back_populates="user", cascade="all, delete-orphan")
    courses = relationship("Course", back_populates="creator")
    orders = relationship("Order", back_populates="user")
    enrollments = relationship("Enrollment", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")
```

```python
# backend/app/models/oauth.py
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from .base import Base

class OAuthAccount(Base):
    """OAuth 第三方登入連結"""
    __tablename__ = "oauth_accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(50), nullable=False)  # google, facebook
    provider_account_id = Column(String(255), nullable=False)
    access_token = Column(String(500), nullable=True)
    refresh_token = Column(String(500), nullable=True)
    expires_at = Column(DateTime, nullable=True)

    # 關聯
    user = relationship("User", back_populates="oauth_accounts")

    __table_args__ = (
        # 同一個 provider 的帳號只能綁定一次
        {"unique_together": ("provider", "provider_account_id")},
    )
```

```python
# backend/app/models/course.py
from enum import Enum as PyEnum
from sqlalchemy import Column, String, Text, Numeric, Integer, Enum, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from .base import Base, TimestampMixin

class CourseStatus(str, PyEnum):
    DRAFT = "DRAFT"                # 草稿
    PENDING_REVIEW = "PENDING"     # 待審核
    PUBLISHED = "PUBLISHED"        # 已上架
    REJECTED = "REJECTED"          # 已退回

class CourseCategory(str, PyEnum):
    SOFTWARE_DEV = "SOFTWARE_DEV"  # 軟體開發
    DATA_SCIENCE = "DATA_SCIENCE"  # 資料科學
    OTHER = "OTHER"                # 其他

class Course(Base, TimestampMixin):
    """課程資料表"""
    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    creator_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    cover_image = Column(String(500), nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(CourseStatus), default=CourseStatus.DRAFT, nullable=False)
    category = Column(Enum(CourseCategory), default=CourseCategory.OTHER, nullable=False)
    total_duration = Column(Integer, default=0)  # 總時長 (秒)

    # 關聯
    creator = relationship("User", back_populates="courses")
    chapters = relationship("Chapter", back_populates="course", cascade="all, delete-orphan", order_by="Chapter.order_index")
    enrollments = relationship("Enrollment", back_populates="course")
    orders = relationship("Order", back_populates="course")
    review = relationship("CourseReview", back_populates="course", uselist=False)
```

```python
# backend/app/models/video.py
from enum import Enum as PyEnum
from sqlalchemy import Column, String, Integer, Boolean, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from .base import Base, TimestampMixin

class VideoStatus(str, PyEnum):
    UPLOADING = "UPLOADING"    # 上傳中
    PROCESSING = "PROCESSING"  # 處理中
    READY = "READY"            # 可播放
    FAILED = "FAILED"          # 失敗

class Chapter(Base, TimestampMixin):
    """章節資料表"""
    __tablename__ = "chapters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    order_index = Column(Integer, nullable=False)

    # 關聯
    course = relationship("Course", back_populates="chapters")
    videos = relationship("Video", back_populates="chapter", cascade="all, delete-orphan", order_by="Video.order_index")

class Video(Base, TimestampMixin):
    """影片資料表"""
    __tablename__ = "videos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    chapter_id = Column(UUID(as_uuid=True), ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    storage_key = Column(String(500), nullable=False)  # MinIO object key
    thumbnail_url = Column(String(500), nullable=True)
    duration = Column(Integer, default=0)  # 影片長度 (秒)
    order_index = Column(Integer, nullable=False)
    is_preview = Column(Boolean, default=False)  # 是否為預覽影片
    status = Column(Enum(VideoStatus), default=VideoStatus.UPLOADING, nullable=False)

    # 關聯
    chapter = relationship("Chapter", back_populates="videos")
    progress_records = relationship("VideoProgress", back_populates="video", cascade="all, delete-orphan")
```

```python
# backend/app/models/order.py
from enum import Enum as PyEnum
from sqlalchemy import Column, Numeric, Enum, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from .base import Base, TimestampMixin

class OrderStatus(str, PyEnum):
    PENDING = "PENDING"      # 待付款
    PAID = "PAID"            # 已付款
    REFUNDED = "REFUNDED"    # 已退款
    CANCELLED = "CANCELLED"  # 已取消

class Order(Base, TimestampMixin):
    """訂單資料表"""
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)  # 訂單金額
    platform_fee = Column(Numeric(10, 2), nullable=False)  # 平台抽成 (20%)
    creator_revenue = Column(Numeric(10, 2), nullable=False)  # 創作者收益 (80%)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)

    # 關聯
    user = relationship("User", back_populates="orders")
    course = relationship("Course", back_populates="orders")
    payment = relationship("Payment", back_populates="order", uselist=False)
    enrollment = relationship("Enrollment", back_populates="order", uselist=False)

class Payment(Base):
    """付款記錄表"""
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), unique=True, nullable=False)
    ecpay_trade_no = Column(String(50), nullable=True)  # ECPay 交易編號
    amount = Column(Numeric(10, 2), nullable=False)
    paid_at = Column(DateTime, nullable=True)

    # 關聯
    order = relationship("Order", back_populates="payment")
```

```python
# backend/app/models/enrollment.py
from sqlalchemy import Column, Numeric, Boolean, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime
from .base import Base

class Enrollment(Base):
    """報名記錄表 (用戶擁有的課程)"""
    __tablename__ = "enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), unique=True, nullable=False)
    progress_percentage = Column(Numeric(5, 2), default=0)  # 進度百分比
    last_accessed_at = Column(DateTime, default=datetime.utcnow)

    # 關聯
    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    order = relationship("Order", back_populates="enrollment")
    video_progress = relationship("VideoProgress", back_populates="enrollment", cascade="all, delete-orphan")

    __table_args__ = (
        # 同一用戶只能報名同一課程一次
        {"unique_together": ("user_id", "course_id")},
    )

class VideoProgress(Base):
    """影片觀看進度"""
    __tablename__ = "video_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    enrollment_id = Column(UUID(as_uuid=True), ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False)
    video_id = Column(UUID(as_uuid=True), ForeignKey("videos.id", ondelete="CASCADE"), nullable=False)
    watched_seconds = Column(Integer, default=0)  # 已觀看秒數
    completed = Column(Boolean, default=False)
    last_watched_at = Column(DateTime, default=datetime.utcnow)

    # 關聯
    enrollment = relationship("Enrollment", back_populates="video_progress")
    video = relationship("Video", back_populates="progress_records")

    __table_args__ = (
        {"unique_together": ("enrollment_id", "video_id")},
    )
```

```python
# backend/app/models/review.py
from enum import Enum as PyEnum
from sqlalchemy import Column, String, Text, Numeric, Enum, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship
from uuid import uuid4
from .base import Base, TimestampMixin

class ReviewStatus(str, PyEnum):
    PENDING = "PENDING"    # 待審核
    APPROVED = "APPROVED"  # 已通過
    REJECTED = "REJECTED"  # 已退回

class AIReviewStatus(str, PyEnum):
    PASSED = "PASSED"    # 通過
    WARNING = "WARNING"  # 警告 (需人工注意)
    FAILED = "FAILED"    # 未通過

class CourseReview(Base, TimestampMixin):
    """課程審核單"""
    __tablename__ = "course_reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), unique=True, nullable=False)
    reviewer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)  # 審核的管理員
    status = Column(Enum(ReviewStatus), default=ReviewStatus.PENDING, nullable=False)
    feedback = Column(Text, nullable=True)  # 審核意見
    reviewed_at = Column(DateTime, nullable=True)

    # 關聯
    course = relationship("Course", back_populates="review")
    reviewer = relationship("User")
    ai_result = relationship("AIReviewResult", back_populates="course_review", uselist=False)

class AIReviewResult(Base, TimestampMixin):
    """AI 審核結果"""
    __tablename__ = "ai_review_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    course_review_id = Column(UUID(as_uuid=True), ForeignKey("course_reviews.id", ondelete="CASCADE"), unique=True, nullable=False)
    status = Column(Enum(AIReviewStatus), nullable=False)
    confidence_score = Column(Numeric(3, 2), nullable=False)  # 0.00 ~ 1.00
    issues = Column(JSON, nullable=True)  # 違規項目 [{ "time": 123, "reason": "..." }]
    raw_response = Column(JSON, nullable=True)  # AI 原始回應

    # 關聯
    course_review = relationship("CourseReview", back_populates="ai_result")
```

```python
# backend/app/models/audit.py
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime
from .base import Base

class AuditLog(Base):
    """稽核日誌"""
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False)  # e.g., COURSE_APPROVED
    entity_type = Column(String(50), nullable=False)  # e.g., Course
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    old_value = Column(JSON, nullable=True)
    new_value = Column(JSON, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # 關聯
    user = relationship("User", back_populates="audit_logs")
```

### 5.3 資料庫索引設計

```python
# backend/app/models/indexes.py
from sqlalchemy import Index

# 用戶查詢優化
Index("idx_users_email", "users.email")
Index("idx_users_role_status", "users.role", "users.status")

# 課程查詢優化
Index("idx_courses_status", "courses.status")
Index("idx_courses_creator", "courses.creator_id")
Index("idx_courses_category_status", "courses.category", "courses.status")

# 訂單查詢優化
Index("idx_orders_user", "orders.user_id")
Index("idx_orders_status", "orders.status")
Index("idx_orders_created", "orders.created_at")

# 報名查詢優化
Index("idx_enrollments_user", "enrollments.user_id")
Index("idx_enrollments_course", "enrollments.course_id")

# 稽核日誌查詢優化
Index("idx_audit_logs_user", "audit_logs.user_id")
Index("idx_audit_logs_created", "audit_logs.created_at")
Index("idx_audit_logs_entity", "audit_logs.entity_type", "audit_logs.entity_id")
```

---

## 第 6 部分：詳細設計 (Detailed Design)

### 6.1 API 設計規範

### API 版本控制

```
/api/v1/...
```

所有 API 使用 `/api/v1` 前綴，便於未來版本升級。

### RESTful 端點設計

| 模組 | 端點 | 方法 | 說明 |
| --- | --- | --- | --- |
| **認證** | `/api/v1/auth/register` | POST | Email 註冊 |
|  | `/api/v1/auth/login` | POST | Email 登入 |
|  | `/api/v1/auth/logout` | POST | 登出 |
|  | `/api/v1/auth/refresh` | POST | 刷新 Token |
|  | `/api/v1/auth/password/reset` | POST | 發送密碼重設信 |
|  | `/api/v1/auth/password/reset/confirm` | POST | 確認密碼重設 |
|  | `/api/v1/auth/oauth/{provider}` | GET | OAuth 登入跳轉 |
|  | `/api/v1/auth/oauth/{provider}/callback` | POST | OAuth 回調 |
| **用戶** | `/api/v1/users/me` | GET | 取得當前用戶資訊 |
|  | `/api/v1/users/me` | PATCH | 更新用戶資訊 |
|  | `/api/v1/users/{id}` | GET | 取得用戶公開資訊 |
| **課程** | `/api/v1/courses` | GET | 課程列表 (公開) |
|  | `/api/v1/courses` | POST | 建立課程 |
|  | `/api/v1/courses/{id}` | GET | 課程詳情 |
|  | `/api/v1/courses/{id}` | PATCH | 更新課程 |
|  | `/api/v1/courses/{id}` | DELETE | 刪除課程 |
|  | `/api/v1/courses/{id}/submit` | POST | 送出審核 |
|  | `/api/v1/courses/my` | GET | 我建立的課程 |
| **章節** | `/api/v1/courses/{id}/chapters` | GET/POST | 章節列表/建立 |
|  | `/api/v1/chapters/{id}` | PATCH/DELETE | 更新/刪除章節 |
| **影片** | `/api/v1/chapters/{id}/videos` | POST | 上傳影片 |
|  | `/api/v1/videos/{id}` | GET | 影片資訊 |
|  | `/api/v1/videos/{id}` | PATCH/DELETE | 更新/刪除影片 |
|  | `/api/v1/videos/{id}/stream` | GET | 取得串流 URL |
| **訂單** | `/api/v1/orders` | POST | 建立訂單 |
|  | `/api/v1/orders/{id}` | GET | 訂單詳情 |
|  | `/api/v1/orders/my` | GET | 我的訂單列表 |
| **支付** | `/api/v1/payments/ecpay/callback` | POST | ECPay 回調 |
| **報名** | `/api/v1/enrollments/my` | GET | 我的課程列表 |
|  | `/api/v1/enrollments/{id}/progress` | GET | 學習進度 |
|  | `/api/v1/enrollments/{id}/videos/{videoId}/progress` | PUT | 更新觀看進度 |
| **管理員** | `/api/v1/admin/users` | GET | 用戶列表 |
|  | `/api/v1/admin/users/{id}` | PATCH | 更新用戶狀態 |
|  | `/api/v1/admin/reviews` | GET | 待審核列表 |
|  | `/api/v1/admin/reviews/{id}` | GET | 審核詳情 |
|  | `/api/v1/admin/reviews/{id}/approve` | POST | 通過審核 |
|  | `/api/v1/admin/reviews/{id}/reject` | POST | 退回審核 |
|  | `/api/v1/admin/dashboard` | GET | KPI 儀表板 |
|  | `/api/v1/admin/audit-logs` | GET | 稽核日誌 |

### 回應格式標準

```python
# 成功回應
{
    "success": true,
    "data": { ... },
    "meta": {
        "page": 1,
        "per_page": 20,
        "total": 100
    }
}

# 錯誤回應
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "欄位驗證失敗",
        "details": [
            { "field": "email", "message": "Email 格式不正確" }
        ]
    }
}
```

### 錯誤碼定義

| 錯誤碼 | HTTP 狀態 | 說明 |
| --- | --- | --- |
| `VALIDATION_ERROR` | 400 | 請求參數驗證失敗 |
| `UNAUTHORIZED` | 401 | 未登入或 Token 失效 |
| `FORBIDDEN` | 403 | 權限不足 |
| `NOT_FOUND` | 404 | 資源不存在 |
| `CONFLICT` | 409 | 資源衝突 (如重複報名) |
| `RATE_LIMITED` | 429 | 請求過於頻繁 |
| `INTERNAL_ERROR` | 500 | 伺服器內部錯誤 |

### 6.2 認證與授權設計

### JWT Token 設計

```python
# Access Token Payload
{
    "sub": "user-uuid",
    "email": "user@example.com",
    "role": "USER",
    "exp": 1234567890,  # 15 分鐘
    "iat": 1234567890,
    "type": "access"
}

# Refresh Token Payload
{
    "sub": "user-uuid",
    "exp": 1234567890,  # 7 天
    "iat": 1234567890,
    "type": "refresh"
}
```

### 權限守衛

```python
# backend/app/core/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from app.models.user import UserRole

security = HTTPBearer()

async def get_current_user(token: str = Depends(security)):
    """取得當前登入用戶"""
    # 驗證 JWT Token
    # 返回用戶資訊
    pass

async def require_admin(user = Depends(get_current_user)):
    """要求管理員權限"""
    if user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要管理員權限"
        )
    return user
```

### 6.3 AI 審核 Pipeline 實作

```python
# backend/app/tasks/ai_review.py
from celery import shared_task
from app.services.ai_service import AIReviewService
from app.services.video_service import VideoService
from app.repositories.review_repository import ReviewRepository

@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def process_video_ai_review(self, video_id: str, course_info: dict):
    """
    影片 AI 審核任務

    步驟:
    1. 從 MinIO 下載影片
    2. FFmpeg 截取關鍵幀 (每 10 秒)
    3. Whisper 提取音訊轉文字 (前 1 分鐘)
    4. 呼叫 Vision API 分析
    5. 儲存審核結果
    """
    video_service = VideoService()
    ai_service = AIReviewService()
    review_repo = ReviewRepository()

    try:
        # Step 1: 更新狀態
        video_service.update_status(video_id, "PROCESSING")

        # Step 2: 截取關鍵幀
        frames = video_service.extract_keyframes(video_id, interval=10)

        # Step 3: 提取音訊轉文字
        transcription = video_service.extract_transcription(video_id, duration=60)

        # Step 4: AI 分析
        prompt = f"""
        課程標題:{course_info['title']}
        課程描述:{course_info['description']}
        前一分鐘口語內容:{transcription}

        任務:
        1. 檢查畫面是否包含色情、暴力、極端內容
        2. 檢查畫面與課程描述是否相符
        3. 檢查是否有版權疑慮

        請回傳 JSON 格式:
{{
            "passed": boolean,
            "score": 0-100,
            "issues": [{{ "time": number, "reason": string}}]
}}
        """

        result = ai_service.analyze_video_content(frames, prompt)

        # Step 5: 儲存結果
        review_repo.save_ai_result(
            video_id=video_id,
            status="PASSED" if result["passed"] else "WARNING",
            confidence_score=result["score"] / 100,
            issues=result["issues"]
        )

        video_service.update_status(video_id, "READY")

    except Exception as e:
        video_service.update_status(video_id, "FAILED")
        raise self.retry(exc=e)
```

### 6.4 影片串流設計

```python
# backend/app/services/video_service.py
from minio import Minio
from datetime import timedelta

class VideoStreamService:
    def __init__(self):
        self.minio_client = Minio(
            endpoint=settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE
        )

    def get_presigned_url(self, storage_key: str, expires: int = 3600) -> str:
        """
        取得預簽名 URL

        Args:
            storage_key: MinIO 物件鍵
            expires: 過期時間 (秒)

        Returns:
            預簽名 URL (透過 Nginx 代理)
        """
        url = self.minio_client.presigned_get_object(
            bucket_name=settings.MINIO_BUCKET,
            object_name=storage_key,
            expires=timedelta(seconds=expires)
        )

        # 轉換為 Nginx 代理路徑
        return url.replace(
            settings.MINIO_ENDPOINT,
            f"{settings.APP_URL}/media"
        )
```

---

## 第 7 部分：SEO 架構設計 (SEO Architecture)

### 7.1 SEO 策略總覽

| 策略 | 實作方式 | 說明 |
| --- | --- | --- |
| **伺服器端渲染 (SSR)** | Next.js App Router | 關鍵頁面 SSR 確保爬蟲可索引 |
| **靜態生成 (SSG)** | Next.js generateStaticParams | 課程頁面預先生成 |
| **Meta Tags** | next/head + Metadata API | 動態 title, description, OG tags |
| **Sitemap** | next-sitemap | 自動生成 sitemap.xml |
| **Robots.txt** | public/robots.txt | 控制爬蟲行為 |
| **結構化資料** | JSON-LD | 課程、評價 Schema.org 標記 |
| **Canonical URL** | Metadata API | 避免重複內容 |

### 7.2 頁面渲染策略

| 頁面 | 渲染方式 | 理由 |
| --- | --- | --- |
| 首頁 `/` | SSG + ISR (1hr) | 內容相對靜態，需快速載入 |
| 課程列表 `/courses` | SSR | 需即時篩選、搜尋 |
| 課程詳情 `/courses/[id]` | SSG + ISR (5min) | SEO 重點頁面，需預先生成 |
| 課程播放 `/learn/[id]` | CSR | 登入後內容，無 SEO 需求 |
| 用戶頁面 `/dashboard/*` | CSR | 私人頁面，無 SEO 需求 |
| 管理後台 `/admin/*` | CSR | 管理頁面，無 SEO 需求 |

### 7.3 Meta Tags 實作

```tsx
// frontend/src/app/courses/[id]/page.tsx
import { Metadata } from 'next'
import { getCourse } from '@/services/course'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse(params.id)

  return {
    title: `${course.title} | 線上學習平台`,
    description: course.description.slice(0, 160),
    keywords: [course.category, '線上課程', '程式教學'],

    openGraph: {
      title: course.title,
      description: course.description.slice(0, 160),
      images: [course.coverImage],
      type: 'website',
      url: `https://example.com/courses/${course.id}`,
    },

    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.description.slice(0, 160),
      images: [course.coverImage],
    },

    alternates: {
      canonical: `https://example.com/courses/${course.id}`,
    },
  }
}

export default async function CoursePage({ params }: Props) {
  const course = await getCourse(params.id)

  return (
    <>
      {/* JSON-LD 結構化資料 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: course.title,
            description: course.description,
            provider: {
              '@type': 'Organization',
              name: '線上學習平台',
            },
            offers: {
              '@type': 'Offer',
              price: course.price,
              priceCurrency: 'TWD',
            },
          }),
        }}
      />

      {/* 頁面內容 */}
    </>
  )
}
```

### 7.4 Sitemap 設定

```jsx
// frontend/next-sitemap.config.js
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
  exclude: ['/dashboard/*', '/admin/*', '/learn/*'],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/learn/', '/api/'],
      },
    ],
    additionalSitemaps: [
      'https://example.com/sitemap-courses.xml',
    ],
  },

  // 動態生成課程 sitemap
  additionalPaths: async (config) => {
    const courses = await fetch(`${process.env.API_URL}/api/v1/courses?status=PUBLISHED`)
      .then(res => res.json())

    return courses.data.map(course => ({
      loc: `/courses/${course.id}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: course.updatedAt,
    }))
  },
}
```

### 7.5 效能優化 (Core Web Vitals)

```tsx
// frontend/next.config.js
module.exports = {
  images: {
    domains: ['localhost', 'minio.example.com'],
    formats: ['image/avif', 'image/webp'],
  },

  experimental: {
    optimizeCss: true,
  },

  // 壓縮
  compress: true,

  // 快取標頭
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

---

## 第 8 部分：穩定性設計 (Stability Design)

### 8.1 Nginx 反向代理配置

```
# nginx/nginx.conf
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 日誌格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct="$upstream_connect_time" '
                    'uht="$upstream_header_time" urt="$upstream_response_time"';

    access_log /var/log/nginx/access.log main;

    # 效能優化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip 壓縮
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript
               application/xml application/xml+rss text/javascript;

    # 速率限制
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

    # MinIO 快取
    proxy_cache_path /var/cache/nginx/minio levels=1:2 keys_zone=minio_cache:100m
                     max_size=10g inactive=60m use_temp_path=off;

    # 上游伺服器
    upstream frontend {
        server frontend:3000;
        keepalive 32;
    }

    upstream backend {
        server backend:8000;
        keepalive 32;
    }

    upstream minio {
        server minio:9000;
        keepalive 16;
    }

    server {
        listen 80;
        server_name localhost;

        # 安全標頭
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # 健康檢查
        location /health {
            access_log off;
            return 200 "OK";
            add_header Content-Type text/plain;
        }

        # API 請求
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            limit_conn conn_limit 10;

            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Connection "";

            # 超時設定
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # 認證 API (更嚴格的速率限制)
        location /api/v1/auth/ {
            limit_req zone=auth_limit burst=5 nodelay;

            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # MinIO 影片串流 (帶快取)
        location /media/ {
            # 快取設定
            proxy_cache minio_cache;
            proxy_cache_valid 200 60m;
            proxy_cache_valid 404 1m;
            proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
            proxy_cache_lock on;
            add_header X-Cache-Status $upstream_cache_status;

            # 代理到 MinIO
            rewrite ^/media/(.*)$ /$1 break;
            proxy_pass http://minio;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            # 支援 Range 請求 (影片拖曳)
            proxy_set_header Range $http_range;
            proxy_set_header If-Range $http_if_range;

            # 大檔案超時
            proxy_connect_timeout 300s;
            proxy_send_timeout 300s;
            proxy_read_timeout 300s;

            # 緩衝設定
            proxy_buffering on;
            proxy_buffer_size 128k;
            proxy_buffers 4 256k;
            proxy_busy_buffers_size 256k;
        }

        # 前端頁面
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        # 靜態資源快取
        location /_next/static/ {
            proxy_pass http://frontend;
            proxy_cache_valid 200 365d;
            add_header Cache-Control "public, max-age=31536000, immutable";
        }
    }
}
```

### 8.2 FastAPI 穩定性設定

```python
# backend/app/core/config.py
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # 應用程式
    APP_NAME: str = "線上學習平台 API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # 資料庫
    DATABASE_URL: str
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 1800  # 30 分鐘

    # Redis
    REDIS_URL: str
    REDIS_MAX_CONNECTIONS: int = 50

    # MinIO
    MINIO_ENDPOINT: str
    MINIO_ACCESS_KEY: str
    MINIO_SECRET_KEY: str
    MINIO_BUCKET: str = "videos"
    MINIO_SECURE: bool = False

    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # Celery
    CELERY_BROKER_URL: str
    CELERY_RESULT_BACKEND: str

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
```

```python
# backend/app/core/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings

# 建立資料庫引擎 (連線池設定)
engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_timeout=settings.DB_POOL_TIMEOUT,
    pool_recycle=settings.DB_POOL_RECYCLE,
    pool_pre_ping=True,  # 連線前檢查
    echo=settings.DEBUG,
)

# Session 工廠
async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_db() -> AsyncSession:
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

```python
# backend/app/core/redis.py
import redis.asyncio as redis
from app.core.config import settings

# Redis 連線池
redis_pool = redis.ConnectionPool.from_url(
    settings.REDIS_URL,
    max_connections=settings.REDIS_MAX_CONNECTIONS,
    decode_responses=True,
)

async def get_redis() -> redis.Redis:
    return redis.Redis(connection_pool=redis_pool)
```

```python
# backend/app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging
import time

from app.core.config import settings
from app.core.database import engine
from app.api.v1 import router as api_router

# 日誌設定
logging.basicConfig(
    level=logging.INFO,
    format='{"time": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s"}',
)
logger = logging.getLogger(__name__)

# Rate Limiter
limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """應用程式生命週期管理"""
    logger.info("Application starting up...")
    yield
    logger.info("Application shutting down...")
    await engine.dispose()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
)

# Rate Limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 生產環境需更新
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 請求日誌 Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time

    logger.info(
        f"{request.method}{request.url.path} "
        f"status={response.status_code} "
        f"duration={process_time:.3f}s"
    )

    response.headers["X-Process-Time"] = str(process_time)
    return response

# 全域例外處理
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception:{exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "伺服器內部錯誤",
            }
        }
    )

# 健康檢查
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": settings.APP_VERSION}

@app.get("/health/ready")
async def readiness_check():
    """檢查所有依賴服務是否就緒"""
    # 可加入資料庫、Redis 連線檢查
    return {"status": "ready"}

# 註冊路由
app.include_router(api_router, prefix="/api/v1")
```

### 8.3 Celery Worker 穩定性設定

```python
# worker/celery_app.py
from celery import Celery
from kombu import Exchange, Queue

app = Celery('worker')

app.conf.update(
    # Broker 設定
    broker_url='redis://redis:6379/0',
    result_backend='redis://redis:6379/1',

    # 序列化
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',

    # 時區
    timezone='Asia/Taipei',
    enable_utc=True,

    # 任務設定
    task_acks_late=True,  # 任務完成後才確認
    task_reject_on_worker_lost=True,  # Worker 掛掉時拒絕任務
    task_time_limit=3600,  # 任務最長執行時間 (1 小時)
    task_soft_time_limit=3300,  # 軟限制 (55 分鐘)

    # 重試設定
    task_default_retry_delay=60,  # 預設重試延遲
    task_max_retries=3,  # 最大重試次數

    # Worker 設定
    worker_prefetch_multiplier=1,  # 一次只取一個任務
    worker_concurrency=4,  # 並行數
    worker_max_tasks_per_child=100,  # 每個 Worker 處理 100 個任務後重啟

    # 佇列設定
    task_queues=(
        Queue('default', Exchange('default'), routing_key='default'),
        Queue('video', Exchange('video'), routing_key='video.#'),
        Queue('email', Exchange('email'), routing_key='email.#'),
    ),

    task_default_queue='default',

    task_routes={
        'worker.tasks.video_processing.*': {'queue': 'video'},
        'worker.tasks.email.*': {'queue': 'email'},
    },

    # 死信佇列 (DLQ)
    task_reject_on_worker_lost=True,
)

# 定時任務
app.conf.beat_schedule = {
    'cleanup-expired-tokens': {
        'task': 'worker.tasks.cleanup.cleanup_expired_tokens',
        'schedule': 3600,  # 每小時
    },
    'generate-sitemap': {
        'task': 'worker.tasks.seo.generate_sitemap',
        'schedule': 86400,  # 每天
    },
}
```

```python
# worker/tasks/video_processing.py
from celery import shared_task
from celery.exceptions import MaxRetriesExceededError, SoftTimeLimitExceeded
import logging

logger = logging.getLogger(__name__)

@shared_task(
    bind=True,
    name='worker.tasks.video_processing.process_video',
    max_retries=3,
    default_retry_delay=120,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_backoff_max=600,
    retry_jitter=True,
    acks_late=True,
    reject_on_worker_lost=True,
    time_limit=3600,
    soft_time_limit=3300,
)
def process_video(self, video_id: str, options: dict = None):
    """
    影片處理任務

    包含重試機制、超時處理、錯誤記錄
    """
    logger.info(f"Processing video:{video_id}")

    try:
        # 影片處理邏輯
        pass

    except SoftTimeLimitExceeded:
        logger.error(f"Video processing timeout:{video_id}")
        # 更新狀態為失敗
        raise

    except MaxRetriesExceededError:
        logger.error(f"Max retries exceeded for video:{video_id}")
        # 通知管理員
        raise

    except Exception as e:
        logger.error(f"Video processing error:{video_id},{e}")
        raise self.retry(exc=e)
```

### 8.4 MinIO 備份策略

```bash
#!/bin/bash
# scripts/backup_minio.sh
# MinIO 備份腳本

set -e

BACKUP_DIR="/backup/minio"
DATE=$(date +%Y%m%d_%H%M%S)
MINIO_ALIAS="myminio"
BUCKET="videos"

# 建立備份目錄
mkdir -p ${BACKUP_DIR}

# 使用 mc mirror 備份
mc mirror ${MINIO_ALIAS}/${BUCKET} ${BACKUP_DIR}/${DATE}/

# 保留最近 7 天的備份
find ${BACKUP_DIR} -type d -mtime +7 -exec rm -rf {} +

# 記錄備份結果
echo "[$(date)] Backup completed:${BACKUP_DIR}/${DATE}" >> /var/log/minio_backup.log
```

```yaml
# 加入 docker-compose.yml 的備份服務
minio-backup:
image: minio/mc
depends_on:
- minio
volumes:
- ./scripts:/scripts
- minio_backup:/backup
    entrypoint:>
      /bin/sh -c "
      mc alias set myminio http://minio:9000 minioadmin minioadmin;
      while true; do
        /scripts/backup_minio.sh;
        sleep 86400;
      done
      "
```

---

## 第 9 部分：部署與基礎設施 (Deployment & Infrastructure)

### 9.1 Docker Compose 開發環境

```yaml
# docker-compose.yml
version:'3.8'

services:
  # Nginx 反向代理
nginx:
image: nginx:1.24-alpine
ports:
-"80:80"
volumes:
- ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
- nginx_cache:/var/cache/nginx
depends_on:
- frontend
- backend
restart: unless-stopped
healthcheck:
test:["CMD","nginx","-t"]
interval: 30s
timeout: 10s
retries:3

  # Next.js 前端
frontend:
build:
context: ./frontend
dockerfile: ../docker/Dockerfile.frontend
environment:
- NEXT_PUBLIC_API_URL=http://localhost/api
- NEXT_PUBLIC_SITE_URL=http://localhost
volumes:
- ./frontend:/app
- /app/node_modules
- /app/.next
restart: unless-stopped

  # FastAPI 後端
backend:
build:
context: ./backend
dockerfile: ../docker/Dockerfile.backend
environment:
- DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/learning_platform
- REDIS_URL=redis://redis:6379/0
- MINIO_ENDPOINT=minio:9000
- MINIO_ACCESS_KEY=minioadmin
- MINIO_SECRET_KEY=minioadmin
- MINIO_BUCKET=videos
- JWT_SECRET_KEY=your-secret-key-change-in-production
- CELERY_BROKER_URL=redis://redis:6379/0
- CELERY_RESULT_BACKEND=redis://redis:6379/1
volumes:
- ./backend:/app
depends_on:
postgres:
condition: service_healthy
redis:
condition: service_healthy
minio:
condition: service_healthy
restart: unless-stopped

  # Celery Worker
celery-worker:
build:
context: ./backend
dockerfile: ../docker/Dockerfile.backend
command: celery -A worker.celery_app worker --loglevel=info --concurrency=4
environment:
- DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/learning_platform
- REDIS_URL=redis://redis:6379/0
- MINIO_ENDPOINT=minio:9000
- MINIO_ACCESS_KEY=minioadmin
- MINIO_SECRET_KEY=minioadmin
- CELERY_BROKER_URL=redis://redis:6379/0
- CELERY_RESULT_BACKEND=redis://redis:6379/1
volumes:
- ./backend:/app
depends_on:
- backend
- redis
restart: unless-stopped

  # Celery Beat (定時任務)
celery-beat:
build:
context: ./backend
dockerfile: ../docker/Dockerfile.backend
command: celery -A worker.celery_app beat --loglevel=info
environment:
- CELERY_BROKER_URL=redis://redis:6379/0
- CELERY_RESULT_BACKEND=redis://redis:6379/1
depends_on:
- redis
restart: unless-stopped

  # PostgreSQL
postgres:
image: postgres:15-alpine
environment:
- POSTGRES_USER=postgres
- POSTGRES_PASSWORD=postgres
- POSTGRES_DB=learning_platform
volumes:
- postgres_data:/var/lib/postgresql/data
ports:
-"5432:5432"
healthcheck:
test:["CMD-SHELL","pg_isready -U postgres"]
interval: 10s
timeout: 5s
retries:5
restart: unless-stopped

  # Redis
redis:
image: redis:7-alpine
command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
volumes:
- redis_data:/data
ports:
-"6379:6379"
healthcheck:
test:["CMD","redis-cli","ping"]
interval: 10s
timeout: 5s
retries:5
restart: unless-stopped

  # MinIO
minio:
image: minio/minio:latest
command: server /data --console-address ":9001"
environment:
- MINIO_ROOT_USER=minioadmin
- MINIO_ROOT_PASSWORD=minioadmin
volumes:
- minio_data:/data
ports:
-"9000:9000"   # API
-"9001:9001"   # Console
healthcheck:
test:["CMD","curl","-f","http://localhost:9000/minio/health/live"]
interval: 30s
timeout: 20s
retries:3
restart: unless-stopped

  # MinIO 初始化 (建立 bucket)
minio-init:
image: minio/mc
depends_on:
minio:
condition: service_healthy
    entrypoint:>
      /bin/sh -c "
      mc alias set myminio http://minio:9000 minioadmin minioadmin;
      mc mb myminio/videos --ignore-existing;
      mc anonymous set download myminio/videos;
      exit 0;
      "

volumes:
postgres_data:
redis_data:
minio_data:
nginx_cache:
```

### 9.2 Dockerfile

```docker
# docker/Dockerfile.frontend
FROM node:20-alpine AS base

# 安裝依賴
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 開發環境
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# 建置
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 生產環境
FROM base AS production
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

```docker
# docker/Dockerfile.backend
FROM python:3.11-slim AS base

# 安裝系統依賴 (FFmpeg)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 安裝 Python 依賴
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 複製程式碼
COPY . .

# 開發環境
FROM base AS dev
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# 生產環境
FROM base AS production
CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

### 9.3 環境變數範例

```bash
# .env.example

# ===================
# 應用程式設定
# ===================
APP_NAME="線上學習平台"
APP_ENV=development
DEBUG=true
SECRET_KEY=your-super-secret-key-change-in-production

# ===================
# 資料庫設定
# ===================
DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/learning_platform
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=10

# ===================
# Redis 設定
# ===================
REDIS_URL=redis://redis:6379/0

# ===================
# MinIO 設定
# ===================
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=videos
MINIO_SECURE=false

# ===================
# JWT 設定
# ===================
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# ===================
# OAuth 設定
# ===================
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# ===================
# ECPay 設定
# ===================
ECPAY_MERCHANT_ID=your-merchant-id
ECPAY_HASH_KEY=your-hash-key
ECPAY_HASH_IV=your-hash-iv
ECPAY_PAYMENT_URL=https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5

# ===================
# SendGrid 設定
# ===================
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@example.com

# ===================
# AI 審核設定
# ===================
OPENAI_API_KEY=your-openai-api-key

# ===================
# Celery 設定
# ===================
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/1

# ===================
# 前端設定
# ===================
NEXT_PUBLIC_API_URL=http://localhost/api
NEXT_PUBLIC_SITE_URL=http://localhost
```

---

## 第 10 部分：安全性與跨領域考量 (Security & Cross-Cutting Concerns)

### 10.1 安全性設計

| 層面 | 措施 | 說明 |
| --- | --- | --- |
| **傳輸安全** | HTTPS | 生產環境強制 HTTPS (Let’s Encrypt) |
| **密碼安全** | bcrypt | 密碼雜湊，cost factor = 12 |
| **認證安全** | JWT + Refresh Token | 短期 Access Token (15分鐘) + 長期 Refresh Token (7天) |
| **API 安全** | Rate Limiting | 防止暴力破解與濫用 |
| **輸入驗證** | Pydantic | 嚴格型別驗證 |
| **SQL 注入** | SQLAlchemy ORM | 參數化查詢 |
| **XSS** | React 自動轉義 | 內容自動轉義 |
| **CSRF** | SameSite Cookie | Cookie 安全設定 |
| **影片保護** | Presigned URL | 限時存取連結 |

### 10.2 錯誤處理策略

```python
# backend/app/core/exceptions.py
from fastapi import HTTPException, status

class AppException(HTTPException):
    """應用程式基礎例外"""
    def __init__(self, code: str, message: str, status_code: int = 400, details: list = None):
        self.code = code
        self.message = message
        self.details = details or []
        super().__init__(status_code=status_code, detail=message)

class ValidationError(AppException):
    def __init__(self, message: str, details: list = None):
        super().__init__("VALIDATION_ERROR", message, 400, details)

class UnauthorizedError(AppException):
    def __init__(self, message: str = "請先登入"):
        super().__init__("UNAUTHORIZED", message, 401)

class ForbiddenError(AppException):
    def __init__(self, message: str = "權限不足"):
        super().__init__("FORBIDDEN", message, 403)

class NotFoundError(AppException):
    def __init__(self, resource: str = "資源"):
        super().__init__("NOT_FOUND", f"{resource}不存在", 404)

class ConflictError(AppException):
    def __init__(self, message: str):
        super().__init__("CONFLICT", message, 409)
```

---

## 第 11 部分：監控與可觀測性 (Monitoring & Observability)

### 11.1 監控架構預留

> 注意: MVP 階段暫不實作完整監控，但預留以下接口便於未來擴展。
> 

```python
# backend/app/core/metrics.py
"""
Prometheus Metrics 接口預留

未來可透過 prometheus_fastapi_instrumentator 快速啟用:

    from prometheus_fastapi_instrumentator import Instrumentator

    Instrumentator().instrument(app).expose(app)
"""

# 預留 metrics 端點
async def get_metrics():
    """
    預留 Prometheus metrics 端點

    未來將回傳:
    - HTTP 請求計數
    - 請求延遲分布
    - 活躍連線數
    - 資料庫連線池狀態
    - Redis 連線狀態
    - Celery 任務狀態
    """
    return {"status": "metrics_not_implemented"}
```

### 11.2 結構化日誌

```python
# backend/app/core/logging.py
import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    """JSON 格式日誌，便於日誌收集系統解析"""

    def format(self, record):
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        if hasattr(record, 'request_id'):
            log_data['request_id'] = record.request_id

        if record.exc_info:
            log_data['exception'] = self.formatException(record.exc_info)

        return json.dumps(log_data, ensure_ascii=False)

def setup_logging():
    """設定日誌"""
    handler = logging.StreamHandler()
    handler.setFormatter(JSONFormatter())

    logging.root.handlers = [handler]
    logging.root.setLevel(logging.INFO)
```

### 11.3 Sentry 整合預留

```python
# backend/app/core/sentry.py
"""
Sentry 錯誤追蹤整合預留

啟用方式:
    1. 安裝: pip install sentry-sdk[fastapi]
    2. 設定環境變數: SENTRY_DSN=your-sentry-dsn
    3. 在 main.py 中呼叫 init_sentry()
"""
import os

def init_sentry():
    sentry_dsn = os.getenv("SENTRY_DSN")

    if not sentry_dsn:
        return

    # import sentry_sdk
    # from sentry_sdk.integrations.fastapi import FastApiIntegration
    # from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
    # from sentry_sdk.integrations.celery import CeleryIntegration
    #
    # sentry_sdk.init(
    #     dsn=sentry_dsn,
    #     integrations=[
    #         FastApiIntegration(),
    #         SqlalchemyIntegration(),
    #         CeleryIntegration(),
    #     ],
    #     traces_sample_rate=0.1,
    #     environment=os.getenv("APP_ENV", "development"),
    # )
    pass
```

### 11.4 未來監控擴展路線圖

| 階段 | 工具 | 用途 |
| --- | --- | --- |
| **MVP** | 結構化日誌 + Sentry | 基本錯誤追蹤 |
| **Phase 2** | Prometheus + Grafana | 系統監控儀表板 |
| **Phase 3** | ELK Stack | 日誌收集與分析 |
| **Phase 4** | Jaeger | 分散式追蹤 |

---

## 附錄 A：快速啟動指南

```bash
# 1. 複製環境變數
cp .env.example .env

# 2. 啟動所有服務
docker-compose up -d

# 3. 執行資料庫遷移
docker-compose exec backend alembic upgrade head

# 4. 存取服務
# - 前端: http://localhost
# - API 文件: http://localhost/api/docs
# - MinIO Console: http://localhost:9001

# 5. 查看日誌
docker-compose logs -f backend
docker-compose logs -f celery-worker
```

---

## 附錄 B：開發規範

### 分支策略

| 分支 | 用途 |
| --- | --- |
| `main` | 生產環境 |
| `develop` | 開發整合 |
| `feature/*` | 功能開發 |
| `hotfix/*` | 緊急修復 |

### Commit 訊息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type**: feat, fix, docs, style, refactor, test, chore

---

**文件結束**