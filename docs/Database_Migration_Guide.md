# 資料庫遷移指南

> Learning Platform 的 Alembic 資料庫遷移操作手冊

## 前置條件

- Docker 容器已啟動 (PostgreSQL)
- Python 虛擬環境已啟用
- Backend 依賴已安裝

## 快速開始

```bash
cd backend

# 1. 安裝依賴 (首次)
pip install -r requirements.txt

# 2. 從 models 生成 migration
alembic revision --autogenerate -m "變更描述"

# 3. 執行 migration 到資料庫
alembic upgrade head
```

## 環境設定

### 資料庫連線

建立 `backend/.env`：

```env
DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/learning_platform?ssl=disable"
```

### 啟動資料庫容器

```bash
# 只啟動 PostgreSQL
docker-compose up -d postgres

# 或啟動所有基礎服務
docker-compose up -d postgres redis minio
```

## Alembic 指令參考

### 生成 Migration

```bash
# 自動偵測 model 變更並生成 migration
alembic revision --autogenerate -m "add_user_table"

# 建立空白 migration (手動編寫)
alembic revision -m "custom_migration"
```

### 執行 Migration (升級)

```bash
# 升級到最新版本
alembic upgrade head

# 升級到指定版本
alembic upgrade <revision_id>

# 升級一個版本
alembic upgrade +1
```

### 回滾 Migration (降級)

```bash
# 回滾一個版本
alembic downgrade -1

# 回滾到指定版本
alembic downgrade <revision_id>

# 回滾到初始狀態 (移除所有表)
alembic downgrade base
```

### 查看狀態

```bash
# 顯示目前版本
alembic current

# 顯示 migration 歷史
alembic history

# 顯示詳細歷史
alembic history --verbose
```

### 預覽 SQL

```bash
# 預覽升級 SQL (不實際執行)
alembic upgrade head --sql

# 預覽降級 SQL (不實際執行)
alembic downgrade -1 --sql
```

## Migration 工作流程

### 新增 Model

1. 在 `backend/app/models/` 建立 model 檔案
2. 在 `backend/app/models/__init__.py` 匯入 model
3. 生成 migration：
   ```bash
   alembic revision --autogenerate -m "add_new_model"
   ```
4. 檢查 `alembic/versions/` 中生成的 migration 檔案
5. 執行 migration：
   ```bash
   alembic upgrade head
   ```

### 修改現有 Model

1. 更新 `backend/app/models/` 中的 model
2. 生成 migration：
   ```bash
   alembic revision --autogenerate -m "modify_model_description"
   ```
3. 檢查生成的 migration (注意是否有資料遺失風險)
4. 執行 migration：
   ```bash
   alembic upgrade head
   ```

### 撤銷變更

```bash
# 回滾最後一次 migration
alembic downgrade -1

# 刪除 alembic/versions/ 中對應的 migration 檔案

# 修正你的 model

# 重新生成 migration
alembic revision --autogenerate -m "fixed_migration"

# 執行
alembic upgrade head
```

## 常見問題排除

### Windows 編碼錯誤

如果出現 `UnicodeDecodeError: 'cp950' codec can't decode`：

```bash
# 執行 alembic 前設定 UTF-8 模式
set PYTHONUTF8=1
alembic revision --autogenerate -m "migration_name"
```

或移除以下檔案中的中文字元：
- `alembic.ini`
- `alembic/env.py`
- `backend/.env`

### 連線被拒絕

```bash
# 確認 PostgreSQL 容器是否執行中
docker-compose ps

# 查看容器日誌
docker-compose logs postgres

# 重啟容器
docker-compose restart postgres
```

### SSL 錯誤

在 DATABASE_URL 加上 `?ssl=disable`：

```env
DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/learning_platform?ssl=disable"
```

### Migration 衝突

當多位開發者同時建立 migration 時：

```bash
# 合併 migration heads
alembic merge heads -m "merge_migrations"

# 然後升級
alembic upgrade head
```

## 驗證資料庫

### 連線到 PostgreSQL

```bash
# 透過 Docker
docker exec -it learning_platform_postgres psql -U postgres -d learning_platform

# 常用 psql 指令
\dt          # 列出所有表
\d+ users    # 查看 users 表結構
\q           # 離開
```

### 列出所有表

```bash
docker exec -it learning_platform_postgres psql -U postgres -d learning_platform -c "\dt"
```

## 專案資料表

執行初始 migration 後，會建立以下表：

| 表名 | 說明 |
|------|------|
| users | 使用者帳號 |
| oauth_accounts | OAuth 第三方登入連結 |
| courses | 課程資訊 |
| chapters | 課程章節 |
| videos | 影片內容 |
| enrollments | 使用者課程註冊 |
| video_progress | 影片觀看進度 |
| orders | 購買訂單 |
| payments | 付款紀錄 |
| course_reviews | 課程評價與評論 |
| audit_logs | 系統稽核日誌 |

## 檔案結構

```
backend/
├── alembic.ini              # Alembic 設定檔
├── alembic/
│   ├── env.py               # Migration 環境設定
│   ├── script.py.mako       # Migration 範本
│   └── versions/            # Migration 檔案目錄
│       └── 20260114_xxxx_initial_schema.py
└── app/
    └── models/              # SQLAlchemy Models
        ├── __init__.py
        ├── base.py
        ├── user.py
        ├── course.py
        └── ...
```
