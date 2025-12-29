# CI/CD 與 GitHub Actions 完整指南

> **專案**：SD Learning Platform
> **版本**：1.0
> **最後更新**：2025-12-29

---

## 目錄

1. [什麼是 CI/CD](#1-什麼是-cicd)
2. [CI 持續整合](#2-ci-持續整合)
3. [CD 持續交付/部署](#3-cd-持續交付部署)
4. [GitHub Actions 介紹](#4-github-actions-介紹)
5. [GitHub Actions 設定教學](#5-github-actions-設定教學)
6. [建立 CI/CD Pipeline](#6-建立-cicd-pipeline)
7. [實際操作範例](#7-實際操作範例)
8. [最佳實踐](#8-最佳實踐)
9. [疑難排解](#9-疑難排解)

---

## 1. 什麼是 CI/CD

### 1.1 基本概念

CI/CD 是現代軟體開發的核心實踐，讓程式碼從開發到上線的過程**自動化**。

```
傳統開發流程：
開發 → 手動測試 → 手動打包 → 手動部署 → 祈禱不要出錯 🙏

CI/CD 流程：
開發 → 自動測試 → 自動打包 → 自動部署 → 安心睡覺 😴
```

### 1.2 為什麼需要 CI/CD？

| 問題 | 沒有 CI/CD | 有 CI/CD |
|------|-----------|---------|
| 程式碼品質 | 容易遺漏測試 | 每次推送都自動測試 |
| 部署速度 | 手動部署耗時數小時 | 自動部署只需幾分鐘 |
| 人為錯誤 | 容易漏步驟、打錯指令 | 流程標準化、可重複 |
| 團隊協作 | 整合衝突難以發現 | 即時發現整合問題 |
| 回滾能力 | 手動回滾複雜危險 | 一鍵回滾到任意版本 |

### 1.3 CI/CD 流程總覽

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CI/CD Pipeline                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   開發者        CI (持續整合)              CD (持續部署)              │
│     │                │                          │                    │
│     │  git push      │                          │                    │
│     ├───────────────►│                          │                    │
│     │                │                          │                    │
│     │         ┌──────┴──────┐                   │                    │
│     │         │  1. 拉取代碼  │                   │                    │
│     │         │  2. 安裝依賴  │                   │                    │
│     │         │  3. 程式碼檢查 │                   │                    │
│     │         │  4. 執行測試  │                   │                    │
│     │         │  5. 建置打包  │                   │                    │
│     │         └──────┬──────┘                   │                    │
│     │                │                          │                    │
│     │                │  ✅ 全部通過              │                    │
│     │                ├─────────────────────────►│                    │
│     │                │                   ┌──────┴──────┐             │
│     │                │                   │  1. 部署測試環境 │             │
│     │                │                   │  2. 部署正式環境 │             │
│     │                │                   │  3. 健康檢查    │             │
│     │                │                   └──────┬──────┘             │
│     │                │                          │                    │
│     │◄───────────────┴──────────────────────────┤                    │
│     │         通知結果 (成功/失敗)                 │                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. CI 持續整合

### 2.1 什麼是 CI (Continuous Integration)

**持續整合**是指開發者頻繁地將程式碼合併到主分支，每次合併都會觸發自動化的建置和測試。

```
CI = 持續 + 整合
     │       │
     │       └── 將程式碼合併到共享分支
     │
     └── 頻繁地（每天多次）
```

### 2.2 CI 的核心操作

```
┌─────────────────────────────────────────────────────────┐
│                    CI 執行流程                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Source (取得原始碼)                                   │
│     └── git clone / git pull                             │
│                                                          │
│  2. Install (安裝依賴)                                    │
│     └── npm install / pip install                        │
│                                                          │
│  3. Lint (程式碼檢查)                                     │
│     └── eslint / ruff / flake8                          │
│                                                          │
│  4. Test (執行測試)                                       │
│     └── pytest / jest / unittest                        │
│                                                          │
│  5. Build (建置打包)                                      │
│     └── npm build / docker build                        │
│                                                          │
│  6. Report (產生報告)                                     │
│     └── 測試覆蓋率、程式碼品質報告                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 2.3 CI 實際範例

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      # 1. 取得原始碼
      - name: Checkout
        uses: actions/checkout@v4

      # 2. 安裝依賴
      - name: Install dependencies
        run: pip install -r requirements.txt

      # 3. 程式碼檢查
      - name: Lint
        run: ruff check .

      # 4. 執行測試
      - name: Test
        run: pytest tests/ --cov=app

      # 5. 建置
      - name: Build
        run: docker build -t myapp .
```

### 2.4 CI 的好處

| 好處 | 說明 |
|------|------|
| **快速發現問題** | 程式碼推送後幾分鐘內就知道是否有問題 |
| **減少整合衝突** | 頻繁整合讓衝突更小、更容易解決 |
| **提高程式碼品質** | 自動化測試確保每次提交都符合標準 |
| **加速開發速度** | 開發者不用等待手動測試 |
| **建立信心** | 知道主分支永遠是可運作的 |

---

## 3. CD 持續交付/部署

### 3.1 CD 的兩種意思

```
CD 可以是：

1. Continuous Delivery (持續交付)
   ├── 程式碼隨時可以部署
   └── 但需要人工批准才部署

2. Continuous Deployment (持續部署)
   ├── 程式碼自動部署到生產環境
   └── 完全自動化，無需人工介入
```

### 3.2 比較圖

```
┌────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Continuous Integration (CI)                                    │
│  ├── 自動測試                                                    │
│  └── 自動建置                                                    │
│                    │                                            │
│                    ▼                                            │
│  Continuous Delivery (持續交付)                                  │
│  ├── 自動部署到測試/預備環境                                      │
│  └── 需要手動批准才部署到生產環境  ◄── 人工審核點                  │
│                    │                                            │
│                    ▼                                            │
│  Continuous Deployment (持續部署)                                │
│  └── 自動部署到生產環境 (無需人工)                                │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### 3.3 CD 的核心操作

```
┌─────────────────────────────────────────────────────────┐
│                    CD 執行流程                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Build Artifact (建置產出物)                           │
│     └── Docker Image / 編譯後的程式                       │
│                                                          │
│  2. Push to Registry (推送到倉庫)                         │
│     └── Docker Hub / ECR / GCR                          │
│                                                          │
│  3. Deploy to Staging (部署到測試環境)                    │
│     └── 驗證功能正常                                      │
│                                                          │
│  4. Run E2E Tests (端對端測試)                            │
│     └── 模擬真實使用情境                                  │
│                                                          │
│  5. Deploy to Production (部署到生產環境)                 │
│     └── 藍綠部署 / 滾動更新                               │
│                                                          │
│  6. Health Check (健康檢查)                               │
│     └── 確認服務正常運作                                  │
│                                                          │
│  7. Notify (通知)                                         │
│     └── Slack / Email / Discord                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 3.4 部署策略

```
1. 滾動更新 (Rolling Update)
   ┌─────────────────────────────────────┐
   │ v1 │ v1 │ v1 │ v1 │  ← 開始        │
   │ v2 │ v1 │ v1 │ v1 │  ← 更新第一個   │
   │ v2 │ v2 │ v1 │ v1 │  ← 更新第二個   │
   │ v2 │ v2 │ v2 │ v1 │  ← 更新第三個   │
   │ v2 │ v2 │ v2 │ v2 │  ← 完成        │
   └─────────────────────────────────────┘
   優點：零停機、資源效率高
   缺點：新舊版本同時存在

2. 藍綠部署 (Blue-Green)
   ┌─────────────────────────────────────┐
   │ Blue (v1)  ◄── 線上流量             │
   │ Green (v2)     準備中               │
   │                                     │
   │ 切換後：                            │
   │ Blue (v1)      待機                 │
   │ Green (v2) ◄── 線上流量             │
   └─────────────────────────────────────┘
   優點：快速回滾、乾淨切換
   缺點：需要雙倍資源

3. 金絲雀部署 (Canary)
   ┌─────────────────────────────────────┐
   │ v1 (90%) ◄── 大部分流量             │
   │ v2 (10%) ◄── 少部分流量 (測試)       │
   │                                     │
   │ 逐步增加 v2 比例直到 100%            │
   └─────────────────────────────────────┘
   優點：風險最低、可觀察效果
   缺點：較複雜、需要流量控制
```

---

## 4. GitHub Actions 介紹

### 4.1 什麼是 GitHub Actions

GitHub Actions 是 GitHub 內建的 CI/CD 平台，可以在 GitHub 倉庫中直接設定自動化工作流程。

```
GitHub Actions = GitHub 內建的自動化引擎

特點：
✅ 免費額度充足 (每月 2000 分鐘)
✅ 與 GitHub 深度整合
✅ 豐富的官方和社群 Actions
✅ 支援各種程式語言和平台
✅ 可自訂觸發條件
```

### 4.2 核心概念

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Actions 架構                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Workflow (工作流程)                                              │
│  └── 定義在 .github/workflows/*.yml                              │
│      │                                                           │
│      ├── Event (觸發事件)                                         │
│      │   └── push, pull_request, schedule, workflow_dispatch    │
│      │                                                           │
│      └── Jobs (工作)                                              │
│          ├── Job 1: build                                        │
│          │   ├── runs-on: ubuntu-latest (Runner)                │
│          │   └── Steps (步驟)                                    │
│          │       ├── Step 1: Checkout                           │
│          │       ├── Step 2: Setup Node                         │
│          │       └── Step 3: Run tests                          │
│          │                                                       │
│          └── Job 2: deploy                                       │
│              ├── needs: build (依賴 Job 1)                       │
│              └── Steps...                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 術語解釋

| 術語 | 說明 | 範例 |
|------|------|------|
| **Workflow** | 完整的自動化流程定義 | `ci.yml` 檔案 |
| **Event** | 觸發工作流程的事件 | `push`, `pull_request` |
| **Job** | 一組在同一 Runner 上執行的步驟 | `build`, `test`, `deploy` |
| **Step** | Job 中的單一任務 | `checkout`, `npm install` |
| **Action** | 可重用的動作模組 | `actions/checkout@v4` |
| **Runner** | 執行 Job 的虛擬機器 | `ubuntu-latest`, `windows-latest` |
| **Artifact** | Job 產生的檔案 | 建置產物、測試報告 |
| **Secret** | 加密的環境變數 | API 金鑰、密碼 |

---

## 5. GitHub Actions 設定教學

### 5.1 建立第一個 Workflow

**步驟 1：建立目錄結構**

```
your-repo/
└── .github/
    └── workflows/
        └── my-first-workflow.yml
```

**步驟 2：撰寫 YAML 檔案**

```yaml
# .github/workflows/my-first-workflow.yml

# 工作流程名稱 (顯示在 GitHub Actions 頁面)
name: My First CI

# 觸發條件
on:
  push:
    branches: [main]         # 推送到 main 分支時觸發
  pull_request:
    branches: [main]         # PR 到 main 分支時觸發
  workflow_dispatch:         # 允許手動觸發

# 工作定義
jobs:
  # Job 名稱
  hello-world:
    # 執行環境
    runs-on: ubuntu-latest

    # 執行步驟
    steps:
      # 步驟 1: 印出 Hello World
      - name: Say Hello
        run: echo "Hello, GitHub Actions!"

      # 步驟 2: 顯示系統資訊
      - name: Show System Info
        run: |
          echo "OS: $(uname -a)"
          echo "Date: $(date)"
          echo "User: $(whoami)"
```

**步驟 3：推送到 GitHub**

```bash
git add .github/workflows/my-first-workflow.yml
git commit -m "ci: add first workflow"
git push origin main
```

**步驟 4：查看結果**

前往 GitHub → 你的 Repo → Actions 標籤

### 5.2 YAML 語法詳解

```yaml
# ===== 1. 觸發條件 (on) =====

# 基本觸發
on: push                    # 任何推送都觸發

# 多事件觸發
on: [push, pull_request]    # 推送或 PR 都觸發

# 詳細設定
on:
  push:
    branches:
      - main                # 只在 main 分支
      - 'release/**'        # release 開頭的分支
    paths:
      - 'src/**'            # 只有 src 目錄變更時
      - '!src/**.md'        # 排除 markdown 檔案
    tags:
      - 'v*'                # 標籤以 v 開頭時

  pull_request:
    types: [opened, synchronize, reopened]

  schedule:
    - cron: '0 0 * * *'     # 每天午夜執行 (UTC)

  workflow_dispatch:         # 手動觸發
    inputs:
      environment:
        description: '部署環境'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production


# ===== 2. 環境變數 =====

# 全域環境變數
env:
  NODE_ENV: production
  API_URL: https://api.example.com

jobs:
  build:
    runs-on: ubuntu-latest

    # Job 層級環境變數
    env:
      DATABASE_URL: postgresql://localhost/test

    steps:
      - name: Use env
        # Step 層級環境變數
        env:
          SECRET_KEY: ${{ secrets.SECRET_KEY }}
        run: echo $SECRET_KEY


# ===== 3. Jobs 設定 =====

jobs:
  # Job 1
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.value }}
    steps:
      - id: version
        run: echo "value=1.0.0" >> $GITHUB_OUTPUT

  # Job 2 (依賴 Job 1)
  deploy:
    needs: build                        # 等待 build 完成
    if: success()                       # 且 build 成功
    runs-on: ubuntu-latest
    steps:
      - name: Use output
        run: echo "Version: ${{ needs.build.outputs.version }}"


# ===== 4. 矩陣策略 (Matrix) =====

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [16, 18, 20]
        exclude:
          - os: windows-latest
            node: 16
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}


# ===== 5. 服務容器 (Services) =====

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7
        ports:
          - 6379:6379
```

### 5.3 設定 Secrets

**用途**：儲存敏感資訊（API 金鑰、密碼、SSH 金鑰）

**設定步驟**：

```
1. 前往 GitHub Repo
2. Settings → Secrets and variables → Actions
3. New repository secret
4. 輸入名稱和值
```

**在 Workflow 中使用**：

```yaml
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}
      SSH_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
    run: |
      echo "Using API Key..."
      # 注意：不要直接 echo 密鑰！
```

**常用 Secrets**：

| Secret 名稱 | 用途 |
|------------|------|
| `DOCKER_USERNAME` | Docker Hub 帳號 |
| `DOCKER_PASSWORD` | Docker Hub 密碼 |
| `SSH_PRIVATE_KEY` | 伺服器 SSH 金鑰 |
| `AWS_ACCESS_KEY_ID` | AWS 存取金鑰 |
| `GOOGLE_CREDENTIALS` | GCP 服務帳戶 JSON |

---

## 6. 建立 CI/CD Pipeline

### 6.1 完整 Pipeline 範例

以下是 SD Learning Platform 的完整 CI/CD Pipeline：

```yaml
# .github/workflows/complete-pipeline.yml
name: Complete CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # =========================================
  # 階段 1: 程式碼品質檢查
  # =========================================
  lint:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install linters
        run: pip install ruff mypy

      - name: Run Ruff (Python linter)
        run: ruff check backend/

      - name: Run MyPy (Type checker)
        run: mypy backend/ --ignore-missing-imports
        continue-on-error: true

  # =========================================
  # 階段 2: 單元測試
  # =========================================
  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: lint

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Install uv
        uses: astral-sh/setup-uv@v4

      - name: Setup Python
        run: uv python install 3.12

      - name: Install dependencies
        working-directory: ./backend
        run: |
          uv venv
          uv pip install -r requirements.txt
          uv pip install pytest pytest-asyncio pytest-cov httpx

      - name: Run tests with coverage
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql+asyncpg://postgres:postgres@localhost:5432/test_db
        run: |
          uv run pytest tests/ -v --cov=app --cov-report=xml

      - name: Upload coverage report
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage.xml
          fail_ci_if_error: false

  # =========================================
  # 階段 3: 建置 Docker 映像
  # =========================================
  build:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'push'

    outputs:
      image_tag: ${{ steps.meta.outputs.tags }}

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix=

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./docker/Dockerfile.backend
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # =========================================
  # 階段 4: 部署到 Staging
  # =========================================
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.your-domain.com

    steps:
      - name: Deploy to staging server
        run: |
          echo "Deploying to staging..."
          # SSH 部署指令
          # ssh user@staging-server "docker pull $IMAGE && docker-compose up -d"

  # =========================================
  # 階段 5: 部署到 Production
  # =========================================
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://your-domain.com

    steps:
      - name: Deploy to production server
        run: |
          echo "Deploying to production..."
          # 正式環境部署指令

  # =========================================
  # 階段 6: 通知
  # =========================================
  notify:
    name: Send Notification
    runs-on: ubuntu-latest
    needs: [deploy-staging, deploy-production]
    if: always()

    steps:
      - name: Notify on success
        if: success()
        run: echo "Deployment successful!"
        # 可整合 Slack/Discord 通知

      - name: Notify on failure
        if: failure()
        run: echo "Deployment failed!"
```

### 6.2 Pipeline 視覺化

```
┌─────────────────────────────────────────────────────────────────┐
│                        CI/CD Pipeline                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐                                                    │
│  │   Lint   │  程式碼品質檢查                                     │
│  └────┬─────┘                                                    │
│       │                                                          │
│       ▼                                                          │
│  ┌──────────┐                                                    │
│  │   Test   │  單元測試 + 覆蓋率                                  │
│  └────┬─────┘                                                    │
│       │                                                          │
│       ▼                                                          │
│  ┌──────────┐                                                    │
│  │  Build   │  建置 Docker 映像                                   │
│  └────┬─────┘                                                    │
│       │                                                          │
│       ├──────────────────────┐                                   │
│       ▼                      ▼                                   │
│  ┌──────────┐          ┌──────────┐                              │
│  │ Staging  │          │Production│                              │
│  │ (develop)│          │  (main)  │                              │
│  └────┬─────┘          └────┬─────┘                              │
│       │                      │                                   │
│       └──────────┬───────────┘                                   │
│                  ▼                                               │
│             ┌──────────┐                                         │
│             │  Notify  │  發送通知                                │
│             └──────────┘                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. 實際操作範例

### 7.1 查看 CI/CD 執行狀態

**方法 1：GitHub 網頁**

```
1. 前往你的 GitHub Repo
2. 點擊 "Actions" 標籤
3. 選擇要查看的 Workflow Run
4. 點擊 Job 查看詳細日誌
```

**方法 2：使用 GitHub CLI**

```bash
# 安裝 GitHub CLI
# Windows: winget install GitHub.cli
# macOS: brew install gh

# 登入
gh auth login

# 查看 Workflow 列表
gh run list

# 查看特定 Run 的詳細資訊
gh run view <run-id>

# 查看日誌
gh run view <run-id> --log

# 手動觸發 Workflow
gh workflow run <workflow-name>

# 重新執行失敗的 Workflow
gh run rerun <run-id>
```

### 7.2 手動觸發 Workflow

**在 YAML 中啟用**：

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: '選擇部署環境'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

      debug:
        description: '啟用除錯模式'
        required: false
        type: boolean
        default: false
```

**在 GitHub 頁面觸發**：

```
Actions → 選擇 Workflow → Run workflow → 填寫參數 → Run
```

### 7.3 在本地測試 Workflow

使用 [act](https://github.com/nektos/act) 在本地執行 GitHub Actions：

```bash
# 安裝 act
# Windows: choco install act-cli
# macOS: brew install act

# 列出所有 Workflow
act -l

# 執行指定的 Job
act -j build

# 模擬 push 事件
act push

# 使用特定的 secrets
act -s MY_SECRET=value
```

### 7.4 Debug 技巧

**啟用 Debug 日誌**：

在 Repo Settings → Secrets 中新增：
- `ACTIONS_RUNNER_DEBUG` = `true`
- `ACTIONS_STEP_DEBUG` = `true`

**在 Step 中印出變數**：

```yaml
steps:
  - name: Debug info
    run: |
      echo "Event: ${{ github.event_name }}"
      echo "Branch: ${{ github.ref }}"
      echo "SHA: ${{ github.sha }}"
      echo "Actor: ${{ github.actor }}"

  - name: Dump context
    env:
      GITHUB_CONTEXT: ${{ toJson(github) }}
    run: echo "$GITHUB_CONTEXT"
```

---

## 8. 最佳實踐

### 8.1 Workflow 最佳實踐

```yaml
# ✅ 好的做法

# 1. 使用固定版本的 Actions
- uses: actions/checkout@v4      # 指定版本
- uses: actions/setup-node@v4

# 2. 快取依賴加速執行
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

# 3. 使用矩陣測試多版本
strategy:
  matrix:
    node: [18, 20]
    os: [ubuntu-latest, windows-latest]

# 4. 設定合理的超時時間
timeout-minutes: 15

# 5. 只在必要時觸發
on:
  push:
    paths:
      - 'src/**'
      - '!src/**.md'

# 6. 使用 environment 保護正式環境
deploy:
  environment:
    name: production
    url: https://example.com
```

### 8.2 安全最佳實踐

```yaml
# ✅ 安全做法

# 1. 永遠使用 secrets
env:
  API_KEY: ${{ secrets.API_KEY }}  # 正確

# ❌ 不要這樣做
env:
  API_KEY: "sk-1234567890"         # 錯誤！

# 2. 限制 GITHUB_TOKEN 權限
permissions:
  contents: read
  packages: write

# 3. 審核第三方 Actions
- uses: some-org/some-action@v1   # 檢查來源是否可信

# 4. 使用 SHA 固定版本 (更安全)
- uses: actions/checkout@8ade135a41bc03ea155e62e844d188df1ea18608
```

### 8.3 效能最佳實踐

```yaml
# 1. 並行執行無依賴的 Jobs
jobs:
  lint:
    runs-on: ubuntu-latest
  test:
    runs-on: ubuntu-latest    # lint 和 test 同時執行
  build:
    needs: [lint, test]       # build 等待兩者完成

# 2. 使用快取
- uses: actions/cache@v4
  with:
    path: |
      ~/.cache/pip
      ~/.npm
    key: ${{ runner.os }}-deps-${{ hashFiles('**/requirements.txt', '**/package-lock.json') }}

# 3. 只建置變更的部分
- uses: dorny/paths-filter@v2
  id: changes
  with:
    filters: |
      backend:
        - 'backend/**'
      frontend:
        - 'frontend/**'

- name: Build backend
  if: steps.changes.outputs.backend == 'true'
```

---

## 9. 疑難排解

### 9.1 常見錯誤

#### 錯誤 1: Permission denied

```
Error: EACCES: permission denied
```

**解決**：

```yaml
permissions:
  contents: write
  packages: write
```

#### 錯誤 2: Secret 未定義

```
Error: Input required and not supplied: token
```

**解決**：
1. 確認 Secret 名稱正確
2. 確認 Secret 已在 Repo Settings 中設定
3. 檢查拼寫 `${{ secrets.MY_SECRET }}`

#### 錯誤 3: 超時

```
Error: The operation was canceled.
```

**解決**：

```yaml
jobs:
  build:
    timeout-minutes: 30    # 增加超時時間
```

#### 錯誤 4: 快取未命中

```
Cache not found
```

**解決**：
- 檢查 `key` 是否正確
- 確認檔案路徑存在
- 第一次執行沒有快取是正常的

### 9.2 Debug 檢查清單

```
□ 檢查 YAML 語法是否正確
□ 檢查縮排是否正確 (使用空格，不是 Tab)
□ 檢查 Secrets 是否已設定
□ 檢查分支名稱是否正確
□ 檢查路徑 filter 是否符合預期
□ 檢查 needs 依賴是否正確
□ 啟用 debug 日誌查看詳細資訊
```

### 9.3 有用的資源

| 資源 | 連結 |
|------|------|
| 官方文件 | https://docs.github.com/en/actions |
| Actions 市集 | https://github.com/marketplace?type=actions |
| Workflow 語法 | https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions |
| act (本地測試) | https://github.com/nektos/act |

---

## 快速參考卡

```yaml
# ===== 常用觸發事件 =====
on:
  push:                    # git push
  pull_request:            # 開 PR
  workflow_dispatch:       # 手動觸發
  schedule:                # 定時觸發
    - cron: '0 0 * * *'

# ===== 常用 Actions =====
actions/checkout@v4        # 拉取程式碼
actions/setup-node@v4      # 安裝 Node.js
actions/setup-python@v5    # 安裝 Python
actions/cache@v4           # 快取依賴
docker/build-push-action@v5 # 建置 Docker

# ===== 常用指令 =====
gh run list                # 列出執行記錄
gh run view <id>           # 查看詳情
gh run view <id> --log     # 查看日誌
gh workflow run <name>     # 手動觸發
gh run rerun <id>          # 重新執行

# ===== 常用變數 =====
${{ github.event_name }}   # 事件類型
${{ github.ref }}          # 分支/標籤
${{ github.sha }}          # Commit SHA
${{ github.actor }}        # 觸發者
${{ secrets.XXX }}         # 密鑰
${{ env.XXX }}             # 環境變數
```

---

**維護者**：SD Learning Platform 開發團隊
