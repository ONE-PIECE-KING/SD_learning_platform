# 會員中心 框架規格書

## 頁面資訊

| 項目     | 說明                                                                   |
| -------- | ---------------------------------------------------------------------- |
| 路徑     | `/dashboard`（首頁）、`/dashboard/*`（子頁面）                         |
| 角色權限 | 需登入，學生與老師共用框架，依角色動態顯示側邊欄項目與內容             |
| 核心目的 | 統一定義 Dashboard Shell 佈局、角色路由邏輯、Auth Guard 與共用頁面規格 |

---

> **視覺規範：** 色彩、字級、間距、元件樣式統一依 [`UI_guideline.md`](UI_guideline.md) 定義，本文件不重複定義色值。
>
> **與現有 spec 的關係：**
> - 學生專屬子頁面詳見 [`09_student_center.md`](09_student_center.md)
> - 老師專屬子頁面詳見 [`10_teacher_center.md`](10_teacher_center.md)
> - 通知組件詳見 [`11_notification_component.md`](11_notification_component.md)
> - Auth 流程詳見 [`02_auth.md`](02_auth.md)

## 頁面結構

### Dashboard Shell 佈局

整個會員中心採用 Sidebar + Content Area 雙欄佈局，所有 `/dashboard/*` 子頁面共用此 Shell。

```
┌────────────────────────────────────────────────────────┐
│                    Header (64px)                       │
├──────────┬─────────────────────────────────────────────┤
│          │                                             │
│ Sidebar  │            Content Area                     │
│ (240px)  │                                             │
│          │   ┌─────────────────────────────────────┐   │
│ [Nav     │   │  Breadcrumb                         │   │
│  Items]  │   ├─────────────────────────────────────┤   │
│          │   │                                     │   │
│          │   │  Page Content                       │   │
│          │   │                                     │   │
│          │   └─────────────────────────────────────┘   │
│          │                                             │
└──────────┴─────────────────────────────────────────────┘
```

**Shell 佈局規格：**

| 屬性             | 規格                                           |
| ---------------- | ---------------------------------------------- |
| Header 高度      | 64px（Desktop）/ 56px（Mobile）                |
| Sidebar 寬度     | 240px（Desktop 展開）/ 64px（Laptop 收合）     |
| Content Area     | `calc(100% - Sidebar 寬度)`，內 padding `--space-lg` |
| Content 最大寬度 | 1280px，水平置中                               |

### Header（已登入狀態）

登入後 Header 保持全站一致樣式（詳見 `UI_guideline.md` Section 8），右側按鈕切換為已登入狀態：

| 元素         | 說明                                                       |
| ------------ | ---------------------------------------------------------- |
| Logo         | 點擊返回首頁 `/`                                           |
| 導航連結     | 課程總覽、一對一諮詢、資源分享                             |
| 通知鈴鐺     | 已登入時顯示，下拉面板（詳見 `11_notification_component.md`）|
| 購物車       | 圖示 + 數字徽章                                            |
| 用戶頭像     | 圓形頭像 32px，點擊展開下拉選單                            |

**用戶頭像下拉選單：**

| 項目       | 行為                 |
| ---------- | -------------------- |
| 會員中心   | 導向 `/dashboard`    |
| 個人簡介   | 導向 `/dashboard/profile` |
| 設定       | 導向 `/dashboard/settings` |
| 登出       | 清除 Token，導向 `/` |

### Sidebar Navigation（角色路由表）

Sidebar 根據使用者角色動態顯示導航項目。每個項目包含前置圖示（16px Lucide icon）+ 文字標籤。

**學生側邊欄：**

| 項目         | 路徑                     | 圖示           |
| ------------ | ------------------------ | -------------- |
| 總覽         | `/dashboard`             | `layout-dashboard` |
| 我的課程     | `/dashboard/my-courses`  | `book-open`    |
| 購課記錄     | `/dashboard/history`     | `receipt`      |
| 一對一諮詢   | `/dashboard/consult`     | `message-circle` |
| 個人簡介     | `/dashboard/profile`     | `user`         |
| 資源分享     | `/dashboard/resources`   | `share-2`      |
| 設定         | `/dashboard/settings`    | `settings`     |

**老師側邊欄：**

| 項目         | 路徑                       | 圖示           |
| ------------ | -------------------------- | -------------- |
| 總覽         | `/dashboard`               | `layout-dashboard` |
| 課程上架     | `/dashboard/course-upload` | `upload`       |
| 統計/分析    | `/dashboard/statistics`    | `bar-chart-2`  |
| 我的課程     | `/dashboard/my-courses`    | `book-open`    |
| 購課記錄     | `/dashboard/history`       | `receipt`      |
| 一對一諮詢   | `/dashboard/consult`       | `message-circle` |
| 老師聯絡簿   | `/dashboard/contact`       | `book-user`    |
| 個人簡介     | `/dashboard/profile`       | `user`         |
| 資源分享     | `/dashboard/resources`     | `share-2`      |
| 設定         | `/dashboard/settings`      | `settings`     |

> 側邊欄底部固定顯示「登出」按鈕（`log-out` 圖示）。

---

## 元件規格

### 3.1 Dashboard 首頁（`/dashboard`）

登入後的預設落地頁，提供摘要式總覽與快捷入口。

#### 3.1.1 歡迎區塊（WelcomeSection）

| 元素         | 規格                                                       |
| ------------ | ---------------------------------------------------------- |
| 用戶頭像     | 圓形 64px，右下角顯示角色徽章（學生/老師）                 |
| 問候語       | 依時段動態變化：早安/午安/晚安 + 用戶暱稱                 |
| 角色標示     | 文字徽章，學生為 `--primary-dim` 背景，老師為 `--accent-dim` 背景 |
| 佈局         | 水平排列：頭像 + 問候文字區塊                              |

**問候語時段規則：**

| 時段       | 問候語       |
| ---------- | ------------ |
| 05:00-11:59 | 早安         |
| 12:00-17:59 | 午安         |
| 18:00-04:59 | 晚安         |

**字級規格：**
- 問候語：H3 字級（Desktop 24-28px, Semi-bold）
- 角色標示：Small 字級（12px）

#### 3.1.2 快速統計卡片（StatsCardGrid）

依角色顯示不同統計數據，以 3 欄卡片網格呈現。

**學生統計卡片：**

| 卡片           | 圖示         | 數據來源                   |
| -------------- | ------------ | -------------------------- |
| 已購課程數     | `book-open`  | 已購買課程總數             |
| 累計學習時數   | `clock`      | 所有課程觀看時長加總       |
| 已完課數       | `check-circle-2` | 進度 100% 的課程數    |

**老師統計卡片：**

| 卡片           | 圖示         | 數據來源                   |
| -------------- | ------------ | -------------------------- |
| 上架課程數     | `upload`     | 已上架課程總數             |
| 總學生數       | `users`      | 所有課程購買學生去重加總   |
| 本月收入       | `dollar-sign`| 當月銷售收入               |

**單張統計卡片規格：**

| 屬性         | 規格                                           |
| ------------ | ---------------------------------------------- |
| 高度         | 自適應內容                                     |
| 內 Padding   | `--space-md`                                   |
| 圓角         | `--radius-lg`                                  |
| 圖示         | 40px 容器，`--primary-dim` 背景圓角 `--radius-sm`，圖示 20px `--primary` 色 |
| 數字         | H2 字級（Desktop 36-40px, Bold）               |
| 標籤         | Caption 字級（14px），`--text-secondary`        |
| 佈局         | 垂直排列：圖示 → 數字 → 標籤                  |

#### 3.1.3 近期活動列表（RecentActivityList）

顯示最近 5 筆活動紀錄，依時間倒序排列。

| 欄位         | 規格                                           |
| ------------ | ---------------------------------------------- |
| 活動圖示     | 依類型變色：課程 `--primary`、諮詢 `--accent`、訂單 `--success`、系統 `--info` |
| 活動標題     | Body 字級，最多 1 行，超出省略號               |
| 活動描述     | Caption 字級，`--text-secondary`，最多 1 行    |
| 時間戳       | Caption 字級，`--text-muted`，相對時間         |
| 點擊行為     | 導向對應詳情頁面                               |

**活動類型：**

| 類型         | 範例                                 | 導向                   |
| ------------ | ------------------------------------ | ---------------------- |
| 課程進度     | 「完成《Python 基礎》第 3 章」       | `/dashboard/my-courses`|
| 諮詢預約     | 「已預約 2/10 14:00 諮詢」           | `/dashboard/consult`   |
| 訂單通知     | 「課程購買成功」                     | `/dashboard/history`   |
| 系統通知     | 「平台功能更新」                     | 對應公告頁面           |

**列表容器規格：**

| 屬性         | 規格                                 |
| ------------ | ------------------------------------ |
| 內 Padding   | `--space-md`                         |
| 圓角         | `--radius-lg`                        |
| 各項間距     | `--space-sm`                         |
| Hover 效果   | 背景 `--hover-overlay`               |
| 底部連結     | 「查看全部」Ghost 按鈕，導向通知面板 |

#### 3.1.4 快捷入口（QuickAccessGrid）

依角色顯示常用功能捷徑，以 2x2 或 2x3 網格呈現。

**學生快捷入口：**

| 項目         | 圖示         | 導向                     |
| ------------ | ------------ | ------------------------ |
| 繼續學習     | `play-circle`| 最近觀看的課程上課頁     |
| 瀏覽課程     | `search`     | `/courses`               |
| 預約諮詢     | `calendar`   | `/dashboard/consult`     |
| 我的證書     | `award`      | `/dashboard/profile`     |

**老師快捷入口：**

| 項目         | 圖示         | 導向                       |
| ------------ | ------------ | -------------------------- |
| 上架新課程   | `plus-circle`| `/dashboard/course-upload` |
| 查看統計     | `bar-chart-2`| `/dashboard/statistics`    |
| 管理諮詢     | `calendar`   | `/dashboard/consult`       |
| 學生互動     | `message-circle` | `/dashboard/contact`   |

**單張快捷入口卡片規格：**

| 屬性         | 規格                                 |
| ------------ | ------------------------------------ |
| 高度         | 自適應，最小 80px                    |
| 內 Padding   | `--space-sm`                         |
| 圓角         | `--radius-md`                        |
| 圖示         | 24px，`--primary` 色                 |
| 標籤         | Body 字級，`--text-primary`          |
| Hover 效果   | 背景 `--hover-overlay`，邊框 `--border-hover` |
| 佈局         | 水平排列：圖示 + 標籤               |

---

### 3.2 個人簡介（`/dashboard/profile`）

學生與老師共用頁面，老師有額外欄位。

#### 共用欄位

| 欄位           | 類型       | 說明                                   |
| -------------- | ---------- | -------------------------------------- |
| 頭像           | File Upload| 圓形預覽，支援裁切，最大 2MB           |
| 暱稱           | Input      | 必填，2-30 字元                        |
| 自我介紹       | Textarea   | 選填，最多 500 字元                    |
| 我的證書       | 區塊       | 已取得電子證書列表，可下載             |
| 我的作品       | 區塊       | 作品連結或檔案上傳，附標題與描述       |

#### 老師額外欄位

| 欄位           | 類型       | 說明                                   |
| -------------- | ---------- | -------------------------------------- |
| 專業領域       | Tag Input  | 多選標籤，如「Python」「機器學習」     |
| 經歷           | Textarea   | 學經歷與專業背景                       |
| 社群連結       | Input Group| GitHub、LinkedIn、個人網站等           |
| 發布/預覽      | Button     | 公開個人簡介頁面                       |

> 欄位細節另見 `09_student_center.md` Section 2.5 與 `10_teacher_center.md` Section 2.5。

#### 角色差異摘要

| 面向         | 學生                         | 老師                                     |
| ------------ | ---------------------------- | ---------------------------------------- |
| 基本資訊     | 頭像、暱稱、自我介紹         | 頭像、暱稱、自我介紹 + 專業領域、經歷   |
| 社群連結     | 無                           | GitHub、LinkedIn、個人網站               |
| 證書展示     | 完課證書                     | 完課證書 + 專業證照                      |
| 作品展示     | 課程實作作品                 | 課程實作 + 專案連結                      |
| 公開頁面     | 無                           | 可發布公開講師頁面                       |

---

### 3.3 設定（`/dashboard/settings`）

學生與老師共用頁面，老師有額外設定項。

#### 共用設定

| 項目               | 說明                                         |
| ------------------ | -------------------------------------------- |
| 帳號安全           | 修改密碼、連結/解除第三方登入                |
| 通知偏好           | 選擇接收通知類型（Email/站內/全部關閉）      |
| 主題切換           | Light / Dark 主題切換開關                    |
| Nav 編輯           | （選配）自訂側邊導航項目順序或隱藏           |

#### 學生專屬設定

| 項目               | 說明                                         |
| ------------------ | -------------------------------------------- |
| 我要當老師         | CTA 區塊，引導老師申請流程                   |

#### 老師專屬設定

| 項目               | 說明                                         |
| ------------------ | -------------------------------------------- |
| 諮詢功能開關       | 開啟/關閉一對一諮詢接單                      |
| 收款帳戶設定       | 銀行帳號或第三方支付設定                     |

> 設定細節另見 `09_student_center.md` Section 2.4 與 `10_teacher_center.md` Section 2.7。

---

### 3.4 一對一諮詢（`/dashboard/consult`）

學生與老師共用頁面，依角色切換視角。

#### 角色差異摘要

| 面向         | 學生                               | 老師                               |
| ------------ | ---------------------------------- | ---------------------------------- |
| 行事曆       | 瀏覽可預約老師及時段，進行預約/取消| 設定可預約時段，管理預約排程       |
| 訪談室       | 加入視訊、對話、計費狀態           | 主持視訊、對話、計時器、計費管理   |
| 預約列表     | 查看自己的預約紀錄                 | 查看所有學生的預約紀錄             |

> 諮詢細節另見 `09_student_center.md` Section 2.3 與 `10_teacher_center.md` Section 2.8。

---

## 視覺規格

### Shell 佈局 Token 對照表

| 元素               | 屬性       | Light                    | Dark                                     |
| ------------------ | ---------- | ------------------------ | ---------------------------------------- |
| Shell 背景         | 背景       | `--bg-alt` (`#F9FAFB`)  | `--bg` (`#050505`)                       |
| Content Area 背景  | 背景       | `--bg-alt` (`#F9FAFB`)  | `--bg` (`#050505`)                       |
| Content 內容區     | 背景       | `--bg` (`#FFFFFF`)       | `--bg-card` (`rgba(15,15,15,0.8)`)       |
| Content 內容區     | 圓角       | `--radius-lg`            | `--radius-lg`                            |
| Content 內容區     | 邊框       | 無                       | `1px solid --border`                     |
| Content 內容區     | 陰影       | `--shadow-sm`            | 無                                       |

### Sidebar Token 對照表

| 元素               | 屬性       | Light                        | Dark                                     |
| ------------------ | ---------- | ---------------------------- | ---------------------------------------- |
| Sidebar 背景       | 背景       | `--bg` (`#FFFFFF`)           | `--bg-alt` (`#0F0F0F`)                  |
| Sidebar 右邊框     | 邊框       | `1px solid --border`         | `1px solid --border`                     |
| Nav Item 文字      | 文字色     | `--text-secondary`           | `--text-secondary`                       |
| Nav Item Hover     | 背景       | `--hover-overlay`            | `--hover-overlay`                        |
| Nav Item Active    | 背景       | `--primary-dim`              | `--primary-dim`                          |
| Nav Item Active    | 文字色     | `--primary`                  | `--primary`                              |
| Nav Item Active    | 左邊條     | `3px solid --primary`        | `3px solid --primary`                    |
| Nav Item 圖示      | 圖示色     | `--text-muted`               | `--text-muted`                           |
| Nav Item Active 圖示| 圖示色    | `--primary`                  | `--primary`                              |
| 登出按鈕           | 文字色     | `--text-muted`               | `--text-muted`                           |
| 登出按鈕 Hover     | 文字色     | `--error`                    | `--error`                                |

**Nav Item 尺寸：**

| 屬性         | 規格                                 |
| ------------ | ------------------------------------ |
| 高度         | 44px                                 |
| 左 Padding   | `--space-sm`                         |
| 圖示大小     | 16px                                 |
| 圖示-文字間距| `--space-xs`                         |
| 文字字級     | Body（16px），Active 為 Semi-bold    |
| 各項間距     | 4px                                  |

### Dashboard 首頁卡片 Token 對照表

| 元素               | 屬性       | Light                        | Dark                                     |
| ------------------ | ---------- | ---------------------------- | ---------------------------------------- |
| 統計卡片 背景      | 背景       | `--bg-card` (`#FFFFFF`)      | `--bg-card` + `backdrop-filter: blur(12px)` |
| 統計卡片 邊框      | 邊框       | 無                           | `1px solid --border`                     |
| 統計卡片 陰影      | 陰影       | `--shadow-sm`                | 無                                       |
| 統計數字           | 文字色     | `--text-primary`             | `--text-primary`                         |
| 統計標籤           | 文字色     | `--text-secondary`           | `--text-secondary`                       |
| 圖示容器 背景      | 背景       | `--primary-dim`              | `--primary-dim`                          |
| 圖示               | 圖示色     | `--primary`                  | `--primary`                              |
| 活動列表容器       | 背景       | `--bg-card`                  | `--bg-card` + `backdrop-filter: blur(12px)` |
| 活動列表容器       | 邊框       | 無                           | `1px solid --border`                     |
| 活動項目 Hover     | 背景       | `--hover-overlay`            | `--hover-overlay`                        |
| 快捷入口卡片       | 背景       | `--bg-card`                  | `--bg-glass`                             |
| 快捷入口卡片       | 邊框       | `1px solid --border`         | `1px solid --border`                     |
| 快捷入口卡片 Hover | 邊框       | `--border-hover`             | `--border-accent`                        |

---

## Auth Guard 與角色路由

### Auth Guard 行為

所有 `/dashboard/*` 路由需通過 Auth Guard 驗證：

| 情境                     | 行為                                               |
| ------------------------ | -------------------------------------------------- |
| Token 有效               | 正常進入目標頁面                                   |
| Token 過期               | 嘗試 Refresh Token（`POST /api/v1/auth/refresh`）；成功則繼續，失敗則導向登入 |
| 無 Token（未登入）       | 導向 `/auth/login?redirect={originalPath}`         |
| Token 刷新失敗（401）    | 清除本地 Token，導向 `/auth/login`，顯示「登入已過期，請重新登入」Toast |

### 角色路由控管

| 路由                       | 學生   | 老師   | 行為                                 |
| -------------------------- | ------ | ------ | ------------------------------------ |
| `/dashboard`               | O      | O      | 共用首頁，依角色顯示不同統計與快捷   |
| `/dashboard/my-courses`    | O      | O      | 共用頁面                             |
| `/dashboard/history`       | O      | O      | 共用頁面                             |
| `/dashboard/consult`       | O      | O      | 共用頁面，依角色切換視角             |
| `/dashboard/profile`       | O      | O      | 共用頁面，老師有額外欄位             |
| `/dashboard/settings`      | O      | O      | 共用頁面，老師有額外設定             |
| `/dashboard/resources`     | O      | O      | 共用頁面                             |
| `/dashboard/course-upload` | X      | O      | 無權限時導向 `/dashboard` + 403 Toast|
| `/dashboard/statistics`    | X      | O      | 無權限時導向 `/dashboard` + 403 Toast|
| `/dashboard/contact`       | X      | O      | 無權限時導向 `/dashboard` + 403 Toast|

> O = 可存取，X = 無權限

### 登入後導向邏輯

| 來源                 | 導向                                 |
| -------------------- | ------------------------------------ |
| 直接登入             | `/dashboard`                         |
| 從受保護頁面被踢     | 登入成功後導回 `redirect` 參數指定的原始頁面 |
| 註冊成功             | `/dashboard`（新用戶引導流程）       |

---

## 響應式行為

### 斷點與 Sidebar 行為

| 斷點     | 寬度範圍       | Sidebar 行為                               | Content Area              |
| -------- | -------------- | ------------------------------------------ | ------------------------- |
| Desktop  | >= 1200px      | 展開（240px），顯示圖示 + 文字             | `calc(100% - 240px)`     |
| Laptop   | 1024-1199px    | 收合（64px），僅顯示圖示，hover 展開 tooltip| `calc(100% - 64px)`      |
| Tablet   | 768-1023px     | 隱藏，透過漢堡選單觸發側滑 Overlay         | 100%                      |
| Mobile   | < 768px        | 隱藏，透過漢堡選單觸發全寬側滑 Overlay     | 100%                      |

### Sidebar 收合行為細節

| 狀態       | Desktop (>= 1200px) | Laptop (1024-1199px)    | Tablet/Mobile (< 1024px) |
| ---------- | -------------------- | ----------------------- | ------------------------ |
| 預設       | 展開                 | 收合（僅圖示）          | 隱藏                     |
| 展開方式   | 預設展開             | Hover 展開 tooltip 文字 | 漢堡選單點擊觸發         |
| 收合動畫   | —                    | 無動畫（固定 64px）     | Overlay 側滑 300ms ease  |
| 遮罩       | —                    | —                       | `--scrim`，點擊關閉      |

### Dashboard 首頁響應式

| 斷點     | StatsCardGrid     | QuickAccessGrid   | RecentActivityList |
| -------- | ----------------- | ----------------- | ------------------ |
| Desktop  | 3 欄              | 2x2 網格          | 右側並列           |
| Laptop   | 3 欄              | 2x2 網格          | 下方堆疊           |
| Tablet   | 2 欄 + 1 欄       | 2x2 網格          | 下方堆疊           |
| Mobile   | 單欄堆疊          | 單欄堆疊          | 下方堆疊           |

### Breadcrumb 響應式

| 斷點     | 行為                                     |
| -------- | ---------------------------------------- |
| Desktop  | 完整路徑：`會員中心 > 我的課程`          |
| Mobile   | 僅顯示上一層 + 當前頁：`< 我的課程`     |

---

## API 整合

### Dashboard 首頁

| 功能           | 端點                                 | 方法 | 說明                         |
| -------------- | ------------------------------------ | ---- | ---------------------------- |
| Dashboard 摘要 | `/api/v1/dashboard/summary`          | GET  | 統計卡片數據 + 近期活動列表 |
| 用戶基本資訊   | `/api/v1/user/me`                    | GET  | 暱稱、頭像、角色             |

**Dashboard 摘要回應結構：**

```json
{
  "stats": {
    "student": {
      "purchased_courses": "number",
      "total_study_hours": "number",
      "completed_courses": "number"
    },
    "teacher": {
      "published_courses": "number",
      "total_students": "number",
      "monthly_revenue": "number"
    }
  },
  "recent_activities": [
    {
      "id": "string",
      "type": "course | consult | order | system",
      "title": "string",
      "description": "string",
      "created_at": "ISO 8601",
      "action_url": "string"
    }
  ]
}
```

> 其餘子頁面 API 詳見 `09_student_center.md` 與 `10_teacher_center.md`。

### 共用 API

| 功能           | 端點                                 | 方法    | 說明                   |
| -------------- | ------------------------------------ | ------- | ---------------------- |
| 個人簡介       | `/api/v1/user/profile`               | GET/PUT | 統一端點，依角色回傳對應欄位 |
| 頭像上傳       | `/api/v1/user/avatar`                | POST    | FormData，max 2MB      |
| 帳號設定       | `/api/v1/user/settings`              | GET/PUT | 通知偏好、主題等       |
| 修改密碼       | `/api/v1/user/password`              | PUT     | 舊密碼 + 新密碼       |

---

## 狀態與錯誤處理

| 狀態                 | 處理方式                                             |
| -------------------- | ---------------------------------------------------- |
| Loading              | Dashboard 首頁使用 Skeleton Screen（卡片佔位 + 列表佔位） |
| 未授權（401）        | Auth Guard 導向登入頁面                              |
| 角色無權限（403）    | 導向 `/dashboard` + Error Toast「您無權存取此頁面」  |
| API 錯誤（500）      | 顯示錯誤 Alert + 重試按鈕                           |
| 無資料（空狀態）     | 依頁面顯示對應 Empty State（圖示 + 說明 + CTA）     |
| 網路中斷             | 全頁 Banner 提示「網路連線中斷」                    |

### Dashboard 首頁空狀態

| 區塊               | 空狀態內容                                   | CTA                        |
| ------------------ | -------------------------------------------- | -------------------------- |
| 統計卡片           | 數字顯示為 0                                 | —                          |
| 近期活動           | 插圖 + 「還沒有任何活動紀錄」                | 「瀏覽課程」按鈕           |
| 快捷入口           | 始終顯示，不會為空                           | —                          |

---

## 交互行為

| 行為               | 說明                                                 |
| ------------------ | ---------------------------------------------------- |
| Sidebar 導航       | 點擊項目切換頁面，當前項目高亮                       |
| Sidebar 收合       | Laptop 斷點自動收合，hover 時 tooltip 顯示項目名稱   |
| Mobile Sidebar     | 漢堡選單觸發側滑面板，點擊導航項後自動收合           |
| 頁面切換           | Content Area 使用 fade 動畫（200ms ease）切換         |
| Breadcrumb         | 點擊上層路徑可跳轉                                   |
| 統計卡片           | Hover 時 `transform: translateY(-2px)` + 陰影增強   |
| 快捷入口           | 點擊導向對應頁面                                     |
| 活動項目           | 點擊導向對應詳情頁，hover 顯示背景色變化             |
| 主題切換           | 設定頁面的主題開關即時切換，套用至全站               |
| 鍵盤導航           | Sidebar 項目支援 Tab 鍵聚焦與 Enter 鍵觸發           |
