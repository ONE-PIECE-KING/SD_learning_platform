# Alembic 資料庫遷移使用指南

> **專案**：SD Learning Platform
> **版本**：1.0
> **最後更新**：2025-12-29

---

## 目錄

1. [什麼是 Alembic](#1-什麼是-alembic)
2. [專案配置說明](#2-專案配置說明)
3. [常用指令](#3-常用指令)
4. [工作流程](#4-工作流程)
5. [實際操作範例](#5-實際操作範例)
6. [疑難排解](#6-疑難排解)

---

## 1. 什麼是 Alembic

### 1.1 簡介

Alembic 是 SQLAlchemy 的**資料庫遷移工具**，用於：

- **版本控制**：追蹤資料庫 Schema 的變更歷史
- **自動偵測**：比對 SQLAlchemy Models 與實際資料庫的差異
- **團隊協作**：確保所有開發者的資料庫結構一致
- **安全部署**：可回滾錯誤的遷移

### 1.2 核心概念

| 術語 | 說明 |
|------|------|
| **Migration (遷移)** | 一次資料庫結構變更的腳本 |
| **Revision (版本)** | 每個遷移腳本的唯一識別碼 |
| **Head** | 最新的遷移版本 |
| **Base** | 初始狀態 (無任何遷移) |
| **Upgrade** | 向前遷移 (套用變更) |
| **Downgrade** | 向後遷移 (回滾變更) |

### 1.3 運作原理

```
SQLAlchemy Models (Python)     實際資料庫 (PostgreSQL)
        │                              │
        └──────────┬───────────────────┘
                   │
            Alembic 比對差異
                   │
                   ▼
         產生 Migration Script
                   │
                   ▼
           執行 upgrade/downgrade
```

---

## 2. 專案配置說明

### 2.1 目錄結構

```
backend/
├── alembic.ini              # Alembic 主配置檔
├── alembic/
│   ├── env.py               # 環境配置 (資料庫連線)
│   ├── script.py.mako       # 遷移腳本模板
│   └── versions/            # 遷移腳本存放目錄
│       ├── .gitkeep
│       └── a72f4d3cba46_initial_schema.py
└── app/
    └── models/              # SQLAlchemy Models
        ├── __init__.py
        ├── base.py
        ├── user.py
        └── ...
```

### 2.2 配置檔說明

#### alembic.ini

```ini
[alembic]
script_location = alembic           # 遷移腳本位置
sqlalchemy.url = driver://...       # 資料庫連線 (由 env.py 覆蓋)
```

#### alembic/env.py

```python
# 關鍵設定
from app.models import Base         # 導入所有 Models
from app.core.config import settings

# 資料庫連線 URL (從環境變數讀取)
sync_database_url = settings.DATABASE_URL.replace("+asyncpg", "+psycopg2")
config.set_main_option("sqlalchemy.url", sync_database_url)

# Metadata 用於 autogenerate
target_metadata = Base.metadata
```

### 2.3 環境需求

```bash
# 必要套件 (已在 requirements.txt)
alembic==1.13.1
psycopg2-binary==2.9.9  # Alembic 需要同步驅動
sqlalchemy==2.0.25
```

---

## 3. 常用指令

### 3.1 前置準備

```bash
# 進入 backend 目錄
cd backend

# 啟動虛擬環境 (Windows)
.venv\Scripts\activate

# 或使用 uv 直接執行
.venv/Scripts/python -m alembic <command>
```

### 3.2 指令一覽表

| 指令 | 說明 | 使用時機 |
|------|------|----------|
| `revision --autogenerate -m "msg"` | 自動產生遷移腳本 | 修改 Model 後 |
| `upgrade head` | 升級到最新版本 | 套用所有遷移 |
| `upgrade +1` | 升級一個版本 | 逐步套用 |
| `downgrade -1` | 回滾一個版本 | 撤銷最近變更 |
| `downgrade base` | 回滾到初始狀態 | 重置資料庫 |
| `current` | 顯示目前版本 | 檢查狀態 |
| `history` | 顯示遷移歷史 | 查看所有版本 |
| `heads` | 顯示最新版本 | 確認 head |
| `show <revision>` | 顯示特定版本內容 | 檢視遷移細節 |

### 3.3 完整指令範例

```bash
# 產生新遷移 (自動偵測 Model 變更)
.venv/Scripts/python -m alembic revision --autogenerate -m "add user phone column"

# 產生空白遷移 (手動撰寫)
.venv/Scripts/python -m alembic revision -m "add custom index"

# 升級到最新版本
.venv/Scripts/python -m alembic upgrade head

# 升級到特定版本
.venv/Scripts/python -m alembic upgrade a72f4d3cba46

# 回滾一個版本
.venv/Scripts/python -m alembic downgrade -1

# 回滾到特定版本
.venv/Scripts/python -m alembic downgrade a72f4d3cba46

# 查看目前版本
.venv/Scripts/python -m alembic current

# 查看遷移歷史
.venv/Scripts/python -m alembic history --verbose

# 顯示待執行的遷移
.venv/Scripts/python -m alembic history --indicate-current
```

---

## 4. 工作流程

### 4.1 新增/修改 Model 流程

```
┌─────────────────────────────────────────────────────────────┐
│  1. 修改 SQLAlchemy Model                                    │
│     例：在 User 中新增 phone 欄位                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  2. 產生遷移腳本                                              │
│     alembic revision --autogenerate -m "add user phone"      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  3. 檢查遷移腳本                                              │
│     確認 upgrade() 和 downgrade() 內容正確                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  4. 執行遷移                                                  │
│     alembic upgrade head                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  5. 提交變更                                                  │
│     git add . && git commit -m "feat: add user phone"        │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 團隊協作流程

```
開發者 A                              開發者 B
    │                                     │
    │  1. 修改 Model                       │
    │  2. 產生遷移                          │
    │  3. git push                         │
    │                                     │
    │ ─────────────────────────────────►  │
    │                                     │
    │                          4. git pull │
    │                          5. alembic upgrade head
    │                          6. 資料庫已同步 ✓
```

### 4.3 部署流程

```bash
# 1. 部署新程式碼
git pull origin main

# 2. 安裝依賴
pip install -r requirements.txt

# 3. 執行遷移
alembic upgrade head

# 4. 啟動服務
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 5. 實際操作範例

### 5.1 新增欄位

**步驟 1：修改 Model**

```python
# backend/app/models/user.py
class User(Base, TimestampMixin):
    __tablename__ = "users"

    # ... 現有欄位 ...

    # 新增欄位
    phone = Column(String(20), nullable=True)  # 新增這行
```

**步驟 2：產生遷移**

```bash
.venv/Scripts/python -m alembic revision --autogenerate -m "add user phone column"
```

**步驟 3：檢查產生的遷移腳本**

```python
# alembic/versions/xxxx_add_user_phone_column.py
def upgrade():
    op.add_column('users', sa.Column('phone', sa.String(20), nullable=True))

def downgrade():
    op.drop_column('users', 'phone')
```

**步驟 4：執行遷移**

```bash
.venv/Scripts/python -m alembic upgrade head
```

### 5.2 新增資料表

**步驟 1：建立新 Model**

```python
# backend/app/models/notification.py
from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from .base import Base, TimestampMixin

class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    message = Column(String(500), nullable=False)
    is_read = Column(Boolean, default=False)
```

**步驟 2：在 `__init__.py` 中導出**

```python
# backend/app/models/__init__.py
from .notification import Notification
```

**步驟 3：產生並執行遷移**

```bash
.venv/Scripts/python -m alembic revision --autogenerate -m "add notifications table"
.venv/Scripts/python -m alembic upgrade head
```

### 5.3 修改欄位類型

**注意**：某些變更需要手動編輯遷移腳本

```python
# 遷移腳本
def upgrade():
    # 修改欄位類型
    op.alter_column('users', 'name',
        existing_type=sa.String(100),
        type_=sa.String(200),
        existing_nullable=False
    )

def downgrade():
    op.alter_column('users', 'name',
        existing_type=sa.String(200),
        type_=sa.String(100),
        existing_nullable=False
    )
```

### 5.4 新增索引

```python
def upgrade():
    op.create_index('idx_courses_status', 'courses', ['status'])
    op.create_index('idx_orders_user_status', 'orders', ['user_id', 'status'])

def downgrade():
    op.drop_index('idx_orders_user_status', 'orders')
    op.drop_index('idx_courses_status', 'courses')
```

---

## 6. 疑難排解

### 6.1 常見錯誤

#### 錯誤 1：找不到 Model

```
FAILED: Can't locate revision identified by 'xxxx'
```

**解決**：確認 `alembic/env.py` 有正確導入 Models

```python
from app.models import Base  # 確認這行存在
```

#### 錯誤 2：資料庫連線失敗

```
sqlalchemy.exc.OperationalError: could not connect to server
```

**解決**：
1. 確認 PostgreSQL 容器正在運行：`docker ps`
2. 確認連線 URL 正確
3. 確認 `.env` 檔案存在且設定正確

#### 錯誤 3：遷移衝突

```
FAILED: Multiple heads are present
```

**解決**：

```bash
# 查看所有 heads
alembic heads

# 合併多個 heads
alembic merge -m "merge heads" head1 head2
```

#### 錯誤 4：Autogenerate 沒有偵測到變更

**可能原因**：
1. Model 沒有在 `__init__.py` 中導出
2. `target_metadata` 沒有正確設定

**解決**：確認 `alembic/env.py`

```python
from app.models import Base
target_metadata = Base.metadata
```

### 6.2 重置資料庫

```bash
# 方法 1：回滾所有遷移
.venv/Scripts/python -m alembic downgrade base

# 方法 2：刪除資料庫重建 (開發環境)
docker exec sd_learning_postgres psql -U postgres -c "DROP DATABASE sd_learning;"
docker exec sd_learning_postgres psql -U postgres -c "CREATE DATABASE sd_learning;"
.venv/Scripts/python -m alembic upgrade head
```

### 6.3 查看資料庫結構

```bash
# 列出所有資料表
docker exec sd_learning_postgres psql -U postgres -d sd_learning -c "\dt"

# 查看特定表結構
docker exec sd_learning_postgres psql -U postgres -d sd_learning -c "\d users"

# 查看目前 Alembic 版本
docker exec sd_learning_postgres psql -U postgres -d sd_learning -c "SELECT * FROM alembic_version;"
```

---

## 快速參考卡

```bash
# ===== 日常操作 =====

# 修改 Model 後產生遷移
.venv/Scripts/python -m alembic revision --autogenerate -m "描述"

# 套用遷移
.venv/Scripts/python -m alembic upgrade head

# 回滾遷移
.venv/Scripts/python -m alembic downgrade -1

# 查看狀態
.venv/Scripts/python -m alembic current
.venv/Scripts/python -m alembic history

# ===== 進階操作 =====

# 產生空白遷移 (手動撰寫)
.venv/Scripts/python -m alembic revision -m "custom migration"

# 升級到特定版本
.venv/Scripts/python -m alembic upgrade <revision_id>

# 顯示 SQL (不執行)
.venv/Scripts/python -m alembic upgrade head --sql
```

---

**維護者**：SD Learning Platform 開發團隊
