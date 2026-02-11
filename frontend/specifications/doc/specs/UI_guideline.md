# 桑尼資料科學 UI Guideline

統一視覺規範，適用於全站所有頁面。

---

## 1. 色彩系統

本設計系統採用 **語義化 Design Token** + **雙主題（Light / Dark）** 架構。
所有色彩透過 CSS Custom Properties 引用，確保主題切換一致性。

- **色值格式**：不透明色使用 HEX（`#2C918C`），需透明度的效果色使用 RGBA（`rgba(44,145,140,0.13)`）
- **主題切換**：透過 `data-theme="light|dark"` 屬性或 CSS class 切換

### 1.1 主題架構

| 屬性       | Light Theme          | Dark Theme (DataSphere)       |
| ---------- | -------------------- | ----------------------------- |
| 背景基調   | 白色 / 淺灰          | 深黑 / 玻璃質感               |
| 品牌強調   | Teal 實色            | Teal + 光暈發光效果           |
| 卡片風格   | 白底 + 淺陰影        | 半透明毛玻璃 + 微光邊框       |
| 文字對比   | 深色文字 / 白底      | 白色文字 / 深底               |

### 1.2 品牌色彩（跨主題一致）

| Token           | 用途         | 色值        | CSS Variable        |
| --------------- | ------------ | ----------- | -------------------- |
| Primary         | 品牌主色/CTA | `#2C918C`   | `--primary`          |
| Primary Hover   | 懸停狀態     | `#237A75`   | `--primary-hover`    |
| Primary Light   | 標籤、輕強調 | `#A5F3FC`   | `--primary-light`    |
| Primary Dim     | 低調背景     | `rgba(44,145,140,0.13)` | `--primary-dim` |
| Accent          | 輔助強調     | `#A855F7`   | `--accent`           |

### 1.3 背景色

| Token          | Light             | Dark                       | CSS Variable   |
| -------------- | ----------------- | -------------------------- | -------------- |
| Background     | `#FFFFFF`         | `#050505`                  | `--bg`         |
| Background Alt | `#F9FAFB`         | `#0F0F0F`                  | `--bg-alt`     |
| Surface (Card) | `#FFFFFF`         | `rgba(15,15,15,0.8)`       | `--bg-card`    |
| Glass          | `rgba(0,0,0,0.02)`| `rgba(255,255,255,0.05)`   | `--bg-glass`   |

### 1.4 文字色

| Token          | Light      | Dark       | CSS Variable        |
| -------------- | ---------- | ---------- | -------------------- |
| Text Primary   | `#111827`  | `#FFFFFF`  | `--text-primary`     |
| Text Secondary | `#4B5563`  | `#90A1B9`  | `--text-secondary`   |
| Text Muted     | `#6B7280`  | `#62748E`  | `--text-muted`       |
| Text Highlight | `#111827`  | `#CAD5E2`  | `--text-highlight`   |

### 1.5 邊框色

| Token          | Light                       | Dark                        | CSS Variable       |
| -------------- | --------------------------- | --------------------------- | ------------------- |
| Border         | `#E5E7EB`                   | `rgba(255,255,255,0.1)`     | `--border`          |
| Border Hover   | `#D1D5DB`                   | `rgba(255,255,255,0.2)`     | `--border-hover`    |
| Border Accent  | `rgba(44,145,140,0.3)`      | `rgba(44,145,140,0.25)`     | `--border-accent`   |

### 1.6 狀態色（跨主題一致）

| Token   | 色值      | 用途       | CSS Variable   |
| ------- | --------- | ---------- | -------------- |
| Success | `#10B981` | 成功提示   | `--success`    |
| Error   | `#EF4444` | 錯誤提示   | `--error`      |
| Warning | `#F59E0B` | 警告提示   | `--warning`    |
| Info    | `#3B82F6` | 資訊提示   | `--info`       |

### 1.7 Dark Theme 專屬效果

| Token            | 值                                                    | 用途              |
| ---------------- | ----------------------------------------------------- | ----------------- |
| Gradient Primary | `linear-gradient(135deg, #2C918C 0%, #1A5C59 100%)`   | CTA 按鈕、Hero    |
| Gradient Glow    | `radial-gradient(circle, rgba(44,145,140,0.15), transparent 70%)` | 氛圍光暈 |
| Glow Primary     | `0 0 20px rgba(44,145,140,0.3)`                       | 按鈕光暈          |
| Glow Text        | `0 0 20px rgba(44,145,140,0.5)`                       | 標題光暈          |
| Backdrop Blur    | `blur(12px)`                                          | 玻璃質感卡片      |

---

## 2. 字體系統

### 字體家族

- **中文：** Noto Sans TC
- **英文/數字：** Urbanist
- **程式碼：** Fira Code / JetBrains Mono
- **Fallback：** system-ui, -apple-system, sans-serif

### 字級與字重

| 層級    | Desktop          | Mobile           | 字重       | 行高  |
| ------- | ---------------- | ---------------- | ---------- | ----- |
| H1      | 56-72px          | 32-40px          | Bold (700) | 1.1   |
| H2      | 36-40px          | 28-32px          | Bold (700) | 1.3   |
| H3      | 24-28px          | 20-24px          | Semi-bold (600) | 1.4 |
| Subtitle| 18-20px          | 16-18px          | Regular (400) | 1.5 |
| Body    | 16px             | 16px             | Regular (400) | 1.6 |
| Caption | 14px             | 14px             | Regular (400) | 1.5 |
| Small   | 12px             | 12px             | Regular (400) | 1.5 |

---

## 3. 間距系統（8px 網格）

| Token | 數值     | 用途                 |
| ----- | -------- | -------------------- |
| xs    | 8px      | 元素內 padding       |
| sm    | 16px     | 相關元素間距         |
| md    | 24px     | 區塊內元素間距       |
| lg    | 32px     | 區塊間距（小）       |
| xl    | 48px     | 區塊間距（中）       |
| 2xl   | 64px     | 區塊間距（大）       |
| 3xl   | 80-100px | 主要區塊間距         |

---

## 4. 響應式斷點

| 名稱    | 寬度範圍       | 典型佈局             |
| ------- | -------------- | -------------------- |
| Desktop | >= 1200px      | 3-4 欄，側邊欄展開   |
| Laptop  | 1024-1199px    | 2-3 欄，側邊欄收窄   |
| Tablet  | 768-1023px     | 2 欄，側邊欄隱藏     |
| Mobile  | < 768px        | 單欄堆疊，底部導航   |

### 容器最大寬度

| 類型       | 最大寬度 |
| ---------- | -------- |
| 主容器     | 1280px   |
| 內文容器   | 800px    |

---

## 5. 按鈕規格

### 類型

| 類型      | 用途       | Light 樣式                          | Dark 樣式                                |
| --------- | ---------- | ----------------------------------- | ---------------------------------------- |
| Primary   | 主要行動   | 實心填色 `--primary`                | 實心填色 `--primary` + `--glow-primary`  |
| Secondary | 次要行動   | `--border` 邊框，`--text-secondary` | `--border` 邊框，hover 時 `--primary`    |
| Ghost     | 輔助行動   | 純文字 `--primary` + 底線           | 純文字 `--text-secondary` + hover 亮起   |

### 尺寸

| Size   | 高度 | 字級 | 水平 Padding |
| ------ | ---- | ---- | ------------ |
| Large  | 56px | 18px | 32px         |
| Medium | 48px | 16px | 24px         |
| Small  | 40px | 14px | 16px         |

### 狀態

| 狀態     | 變化                 |
| -------- | -------------------- |
| Default  | 基礎樣式             |
| Hover    | 亮度 +10%            |
| Active   | 亮度 -10%            |
| Disabled | 透明度 50%，游標禁止 |
| Loading  | Spinner 動畫 + 禁用  |

### 圓角

- 預設：`14px`（`--radius-md`，對齊 Figma Design System）
- 小型元件：`8px`（`--radius-sm`）
- 全圓角（Pill）：`9999px`（用於標籤按鈕）

---

## 6. 卡片元件

### 通用卡片結構

```
┌──────────────────────┐
│ [媒體區域]            │  ← 圖片/影片，固定比例
├──────────────────────┤
│ [標題]                │  ← H3 字級
│ [描述]                │  ← Body 字級，1-2 行
│ [Meta 資訊]           │  ← Caption 字級
│ [Action 按鈕]         │  ← Primary/Ghost
└──────────────────────┘
```

**通用樣式：**

| 屬性         | Light                              | Dark                                  |
| ------------ | ---------------------------------- | ------------------------------------- |
| 圓角         | `16px`（`--radius-lg`）            | `16px`（`--radius-lg`）               |
| 背景         | `--bg-card`（白色）                | `--bg-card`（半透明毛玻璃）            |
| 邊框         | 無                                 | `1px solid --border`（微光邊框）       |
| 陰影         | `0 1px 3px rgba(0,0,0,0.1)`       | 無（以邊框取代）                       |
| Hover 陰影   | `0 4px 12px rgba(0,0,0,0.15)`     | `--border-hover` + 微放大             |
| 模糊效果     | 無                                 | `backdrop-filter: blur(12px)`          |
| 內 Padding   | `sm (16px)`                        | `sm (16px)`                            |

### 課程卡片

| 欄位       | 規格                               |
| ---------- | ---------------------------------- |
| 縮圖       | 16:9 比例                          |
| 標題       | 最多 2 行，超出省略號              |
| 簡介       | 最多 50 字元                       |
| 講師       | Caption 字級                       |
| 評分       | 星星圖標 + 數字                    |
| 價格       | 優惠價（粗體）+ 原價（刪除線）    |
| 按鈕       | 「查看詳情」/「加入購物車」        |

### 見證卡片

| 欄位       | 規格                               |
| ---------- | ---------------------------------- |
| 學員照片   | 圓形 80px                          |
| 姓名       | Body 字級                          |
| 原職業     | Caption 字級                       |
| 星等       | 1-5 星                             |
| 見證內容   | 80-120 字元                        |
| 成果標籤   | 背景色標籤                         |

### 資源卡片

| 欄位       | 規格                               |
| ---------- | ---------------------------------- |
| 檔案圖示   | 依副檔名變色（PDF 紅、ZIP 黃等）  |
| 標題       | 點擊預覽或開啟詳情                 |
| 標籤       | 技術標籤（#React, #Tailwind 等）   |
| 檔案大小   | Caption 字級                       |
| 下載次數   | Caption 字級                       |
| 按鈕組     | 預覽 / 下載 / 收藏                 |

---

## 7. 表單元件

### Input

| 屬性     | Light                                | Dark                                  |
| -------- | ------------------------------------ | ------------------------------------- |
| 高度     | 48px（Medium）/ 40px（Small）       | 48px（Medium）/ 40px（Small）        |
| 圓角     | `14px`（`--radius-md`）             | `14px`（`--radius-md`）              |
| 背景     | `--bg`（白色）                       | `--bg-glass`                          |
| 邊框     | `1px solid --border`                | `1px solid --border`                  |
| Focus    | 邊框 `--primary`，`box-shadow: 0 0 0 4px --primary-dim` | 邊框 `--primary`，`box-shadow: 0 0 0 4px --primary-dim` |
| Error    | 邊框變為 `--error`                  | 邊框變為 `--error`                   |
| Disabled | 背景 `--bg-alt`，游標禁止           | 背景 `--bg-alt`，游標禁止            |

### Label

- 字級：14px，Semi-bold
- 與 Input 間距：`xs (8px)`
- 必填標記：`*` 紅色

### Error Message

- 字級：12px，Error 色
- 與 Input 間距：`4px`

### Select（下拉選單）

- 樣式同 Input
- 右側展開箭頭圖示

### Checkbox / Radio

- 大小：20px x 20px
- 選中色：Primary
- Label 間距：`xs (8px)`

### Textarea

- 最小高度：120px
- 可拖拽調整高度
- 其餘同 Input

---

## 8. 全局元件

### Header

| 元素       | Light                                          | Dark                                           |
| ---------- | ---------------------------------------------- | ---------------------------------------------- |
| 高度       | 64px（Desktop）/ 56px（Mobile）               | 64px（Desktop）/ 56px（Mobile）               |
| 背景       | `--bg`，底部 `1px solid --border`              | `--bg-card` + `backdrop-filter: blur(12px)`    |
| Logo       | 點擊回首頁 `/`                                | 點擊回首頁 `/`，`--primary-light` 色          |
| 導航連結   | 課程總覽、一對一諮詢、資源分享                 | 課程總覽、一對一諮詢、資源分享                 |
| 連結色     | `--text-primary`，hover `--primary`            | `--text-secondary`，hover `--text-primary`     |
| 右側按鈕   | 註冊/登入（未登入）、會員中心（已登入）、購物車| 同左                                           |
| 購物車     | 圖示 + 數字徽章                                | 圖示 + 數字徽章                                |
| Mobile     | 漢堡選單，點擊展開側滑導航                     | 漢堡選單，點擊展開側滑導航                     |
| Sticky     | 捲動時固定於頂部                               | 捲動時固定於頂部                               |

### Footer

| 元素       | 規格                                           |
| ---------- | ---------------------------------------------- |
| 背景       | 深色或品牌深色系                               |
| 聯絡資訊   | Email、LINE 官方帳號                           |
| 社群連結   | YouTube、Facebook、Instagram、LinkedIn、Discord |
| 法律連結   | 隱私權政策、退費政策、服務條款                 |
| 版權宣告   | `(c) 2025 桑尼資料科學 All rights reserved.`   |

### Sidebar Navigation（會員中心）

| 屬性       | Light                                  | Dark                                   |
| ---------- | -------------------------------------- | -------------------------------------- |
| 寬度       | 240px（Desktop）/ 全螢幕側滑（Mobile）| 240px（Desktop）/ 全螢幕側滑（Mobile）|
| 背景       | `--bg`                                 | `--bg-alt`                             |
| 當前項目   | `--primary` 左側邊條 + `--primary-dim` 背景 | `--primary` 左側邊條 + `--primary-dim` 背景 |
| 圖示       | 每個項目前置圖示，16px                 | 每個項目前置圖示，16px                 |
| 角色控管   | 根據學生/老師身份動態顯示項目         | 根據學生/老師身份動態顯示項目         |

---

## 9. 回饋元件

### Toast

| 屬性     | 規格                                   |
| -------- | -------------------------------------- |
| 位置     | 右上角                                 |
| 寬度     | 320-400px                              |
| 自動消失 | 3-5 秒                                |
| 類型     | Success / Error / Warning / Info       |
| 結構     | 圖示 + 文字 + 關閉按鈕               |

### Alert（內嵌警告）

| 屬性     | 規格                                   |
| -------- | -------------------------------------- |
| 寬度     | 100%（容器寬度）                       |
| 圓角     | 8px                                    |
| 結構     | 左側色條 + 圖示 + 標題 + 描述         |
| 類型     | Success / Error / Warning / Info       |

### Modal（彈窗）

| 屬性     | 規格                                   |
| -------- | -------------------------------------- |
| 最大寬度 | 480px（Small）/ 640px（Medium）        |
| 遮罩     | 黑色 50% 透明度                        |
| 結構     | 標題 + 內容 + Action 按鈕列           |
| 動畫     | Fade in + Scale up                     |
| 關閉     | 點擊遮罩 / ESC 鍵 / 關閉按鈕         |

### Loading 狀態

| 類型       | 用途                                   |
| ---------- | -------------------------------------- |
| Spinner    | 按鈕 Loading、局部載入                 |
| Skeleton   | 頁面初始載入，模擬內容佔位             |
| Progress   | 檔案上傳、長時間操作進度條             |

### Skeleton Screen

| 屬性     | Light          | Dark                        |
| -------- | -------------- | --------------------------- |
| 背景色   | `#E5E7EB`      | `rgba(255,255,255,0.08)`    |
| 動畫     | 左到右漸層閃爍 | 左到右漸層閃爍              |
| 形狀     | 模擬實際元件佈局（文字行、圖片框、按鈕） | 同左 |

### Empty State

| 結構     | 說明                           |
| -------- | ------------------------------ |
| 圖示     | 大型插圖或 Icon（120-160px）  |
| 標題     | H3 字級，說明當前狀態          |
| 描述     | Body 字級，引導下一步          |
| CTA      | Primary 按鈕導向相關頁面      |

---

## 10. 導航與搜尋元件

### SearchBar（搜尋列）

| 屬性     | 規格                                   |
| -------- | -------------------------------------- |
| 高度     | 48px（與 Input Medium 一致）           |
| 圓角     | 8px                                    |
| 圖示     | 左側搜尋圖標（magnifying glass）       |
| Placeholder | 灰色提示文字，Body 字級             |
| 清除按鈕 | 輸入內容後右側顯示 X 清除按鈕         |
| 邊框     | `1px solid --border`，Focus 時 `--primary` |
| 行為     | 輸入時 Debounce 300ms 觸發搜尋        |

### Pagination（分頁器）

| 屬性       | 規格                                   |
| ---------- | -------------------------------------- |
| 結構       | 上一頁 + 頁碼按鈕 + 下一頁            |
| 頁碼按鈕   | 40px x 40px，圓角 8px                 |
| 當前頁     | Primary 色背景，白色文字               |
| 非當前頁   | `--bg` 背景，`--text-primary` 文字    |
| Hover      | 背景 `--bg-alt`                        |
| Disabled   | 透明度 50%（首頁無上一頁、末頁無下一頁）|
| 省略號     | 頁數過多時顯示 `...` 省略             |
| 字級       | Caption (14px)                         |

### Breadcrumb（麵包屑）

| 屬性     | 規格                                   |
| -------- | -------------------------------------- |
| 分隔符   | `>` 或 `/`，Text Secondary 色         |
| 字級     | Caption (14px)                         |
| 當前頁   | Text Primary 色，不可點擊             |
| 上層頁   | Primary 色，可點擊跳轉               |
| 間距     | 各層級間 `xs (8px)`                    |

### Tab（頁籤切換）

| 屬性       | 規格                                   |
| ---------- | -------------------------------------- |
| 結構       | 水平排列標籤 + 底部指示線              |
| Active 標籤| Primary 色文字 + 2px 底部指示線       |
| Inactive   | Text Secondary 色                      |
| Hover      | Text Primary 色                        |
| 字級       | Body (16px)，Semi-bold (Active)        |
| 高度       | 48px                                   |
| 間距       | 標籤間 `md (24px)`                     |

---

## 11. 資料展示元件

### Accordion（手風琴）

| 屬性       | 規格                                   |
| ---------- | -------------------------------------- |
| 結構       | 標題行 + 展開/收合箭頭 + 內容區       |
| 標題       | Body 字級，Semi-bold                   |
| 箭頭       | 右側 chevron，展開時旋轉 180 度       |
| 內容區     | Body 字級，padding `sm (16px)`        |
| 邊框       | 各項之間 `1px solid --border`         |
| 動畫       | 展開/收合 200ms ease-in-out           |
| 預設狀態   | 第一項展開，其餘收合                   |

### Table（表格）

| 屬性       | 規格                                   |
| ---------- | -------------------------------------- |
| 表頭       | 背景 `--bg-alt`，Caption 字級，Semi-bold|
| 表身       | 背景 `--bg`，Body 字級                 |
| 行高       | 48-56px                                |
| 邊框       | 行間 `1px solid --border`              |
| Hover 行   | 背景 `--bg-alt`                        |
| 響應式     | Mobile 下轉為卡片式堆疊佈局           |
| 排序       | 可排序欄位標題右側顯示排序箭頭         |

### Star Rating（星等評分）

| 屬性       | 規格                                   |
| ---------- | -------------------------------------- |
| 圖示       | 五角星，填滿為 `#F59E0B`（`--warning`）|
| 大小       | 16px（inline）/ 24px（詳情頁）        |
| 半星       | 支援 0.5 星顯示                        |
| 數字顯示   | 星星右側顯示數字（如 4.5），Caption 字級|
| 互動模式   | 評價時可點擊選星，hover 時預覽星數     |

### Progress Bar（進度條）

| 屬性       | 規格                                   |
| ---------- | -------------------------------------- |
| 高度       | 8px（預設）/ 4px（緊湊）              |
| 圓角       | `radius-full (9999px)`                 |
| 背景軌道   | `--border`（Light `#E5E7EB` / Dark `rgba(255,255,255,0.1)`）|
| 填充色     | `--primary`（學習進度）/ `--success`（完成）|
| 百分比文字 | 右側或上方顯示，Caption 字級           |
| 動畫       | 寬度變化 300ms ease                    |

---

## 12. 互動元件

### Calendar / Date Picker（日曆選取器）

| 屬性       | 規格                                   |
| ---------- | -------------------------------------- |
| 結構       | 月份導航 + 星期標頭 + 日期網格        |
| 日期格子   | 40px x 40px，圓角 `radius-full`       |
| 選中日期   | Primary 色背景，白色文字               |
| 今日       | Primary 色邊框                         |
| 不可選     | Text Secondary 色，透明度 50%         |
| Hover      | 背景 `--primary-dim`                  |
| 月份切換   | 左右箭頭，點擊切換上/下月             |
| 字級       | 日期 Caption (14px)，月份 Body (16px) Semi-bold |

### Time Slot Picker（時段選取器）

| 屬性       | 規格                                   |
| ---------- | -------------------------------------- |
| 結構       | 網格排列的時段按鈕                     |
| 時段按鈕   | 寬度自適應，高度 40px，圓角 8px       |
| 可選       | 白色背景，Primary 色邊框               |
| 選中       | Primary 色背景，白色文字               |
| 不可選     | 背景 `--bg-alt`，文字 `--text-muted`，游標禁止 |
| 字級       | Caption (14px)                         |
| 時區       | 底部顯示當前時區，可手動切換           |

### File Upload（檔案上傳）

| 屬性       | 規格                                   |
| ---------- | -------------------------------------- |
| 結構       | 虛線邊框區域 + 上傳圖示 + 提示文字    |
| 邊框       | `2px dashed --border`                  |
| 背景       | `--bg-alt`                             |
| 圓角       | `12px`                                 |
| Hover/拖拽 | 邊框變為 `--primary`，背景 `--primary-dim` |
| 進度條     | 上傳中顯示檔名 + Progress Bar + 取消按鈕 |
| 限制提示   | 底部 Caption 字級顯示允許格式與大小限制 |

### Bottom Sheet（底部彈出面板）

| 屬性       | 規格                                   |
| ---------- | -------------------------------------- |
| 適用       | Mobile 裝置                            |
| 遮罩       | 黑色 50% 透明度（同 Modal）           |
| 面板       | `--bg` 背景，頂部圓角 16px            |
| 拖曳指示   | 頂部 40px x 4px 灰色圓條             |
| 最大高度   | 螢幕高度 90%                           |
| 動畫       | 由下方滑入 300ms ease                  |
| 關閉方式   | 向下拖拽 / 點擊遮罩                   |

---

## 13. 內容編輯元件

### Video Player（影片播放器）

| 屬性       | 規格                                   |
| ---------- | -------------------------------------- |
| 比例       | 16:9                                   |
| 圓角       | 12px                                   |
| 控制列     | 播放/暫停、進度條、音量、倍速、畫質、全螢幕 |
| 倍速選項   | 0.5x / 1x / 1.25x / 1.5x / 2x        |
| 陰影       | `shadow-md`                            |
| 載入中     | Skeleton + 中央 Spinner                |

### Rich Text Editor（富文本編輯器）

| 屬性       | 規格                                   |
| ---------- | -------------------------------------- |
| 工具列     | 粗體、斜體、標題層級、列表、連結、圖片、程式碼區塊 |
| 最小高度   | 300px                                  |
| 邊框       | `1px solid --border`，圓角 `--radius-sm (8px)` |
| Focus      | 邊框變為 Primary 色                    |
| 預覽模式   | 支援編輯/預覽切換                      |

---

## 14. 圖標與標籤

### 檔案類型圖標

| 類型     | 圖標色   | 說明         |
| -------- | -------- | ------------ |
| PDF      | `#EF4444`| 紅色文件圖示 |
| ZIP      | `#F59E0B`| 黃色壓縮圖示 |
| Video    | `#3B82F6`| 藍色播放圖示 |
| Image    | `#10B981`| 綠色圖片圖示 |
| Link     | `#8B5CF6`| 紫色連結圖示 |
| Code     | `#6B7280`| 灰色程式圖示 |

### 狀態標籤

**Light Theme：**

| 狀態       | 背景色                 | 文字色     |
| ---------- | ---------------------- | ---------- |
| 開放       | `#D1FAE5`（淺綠）     | `#065F46`  |
| 學員限定   | `#DBEAFE`（淺藍）     | `#1E40AF`  |
| 積分兌換   | `#FEF3C7`（淺黃）     | `#92400E`  |
| 審核中     | `#F3F4F6`（淺灰）     | `#374151`  |
| 已完成     | `#D1FAE5`（淺綠）     | `#065F46`  |
| 已取消     | `#FEE2E2`（淺紅）     | `#991B1B`  |

**Dark Theme：** 使用同色系但降低飽和度 + 提高透明度

| 狀態       | 背景色                            | 文字色     |
| ---------- | --------------------------------- | ---------- |
| 開放       | `rgba(16,185,129,0.15)`          | `#6EE7B7`  |
| 學員限定   | `rgba(44,145,140,0.15)`          | `--primary-light` |
| 積分兌換   | `rgba(245,158,11,0.15)`          | `#FCD34D`  |
| 審核中     | `rgba(255,255,255,0.08)`         | `--text-muted` |
| 已完成     | `rgba(16,185,129,0.15)`          | `#6EE7B7`  |
| 已取消     | `rgba(239,68,68,0.15)`           | `#FCA5A5`  |

### 徽章系統

| 類型       | 用途                           | 樣式                 |
| ---------- | ------------------------------ | -------------------- |
| 數字徽章   | 購物車數量、未讀通知           | 圓形紅底白字，16px   |
| 文字徽章   | 課程難度、資源類型             | 圓角矩形，Caption    |
| 信任徽章   | 首頁信任條                     | 圖示 + 文字水平排列  |

---

## 附錄：設計 Token 速查表

### Light Theme

```css
:root[data-theme="light"] {
  /* Brand */
  --primary: #2C918C;
  --primary-hover: #237A75;
  --primary-light: #A5F3FC;
  --primary-dim: rgba(44, 145, 140, 0.13);
  --accent: #A855F7;

  /* Background */
  --bg: #FFFFFF;
  --bg-alt: #F9FAFB;
  --bg-card: #FFFFFF;
  --bg-glass: rgba(0, 0, 0, 0.02);

  /* Text */
  --text-primary: #111827;
  --text-secondary: #4B5563;
  --text-muted: #6B7280;
  --text-highlight: #111827;

  /* Border */
  --border: #E5E7EB;
  --border-hover: #D1D5DB;
  --border-accent: rgba(44, 145, 140, 0.3);

  /* Status */
  --success: #10B981;
  --error: #EF4444;
  --warning: #F59E0B;
  --info: #3B82F6;
}
```

### Dark Theme (DataSphere)

```css
:root[data-theme="dark"] {
  /* Brand */
  --primary: #2C918C;
  --primary-hover: #237A75;
  --primary-light: #A5F3FC;
  --primary-dim: rgba(44, 145, 140, 0.13);
  --accent: #A855F7;

  /* Background */
  --bg: #050505;
  --bg-alt: #0F0F0F;
  --bg-card: rgba(15, 15, 15, 0.8);
  --bg-glass: rgba(255, 255, 255, 0.05);

  /* Text */
  --text-primary: #FFFFFF;
  --text-secondary: #90A1B9;
  --text-muted: #62748E;
  --text-highlight: #CAD5E2;

  /* Border */
  --border: rgba(255, 255, 255, 0.1);
  --border-hover: rgba(255, 255, 255, 0.2);
  --border-accent: rgba(44, 145, 140, 0.25);

  /* Status */
  --success: #10B981;
  --error: #EF4444;
  --warning: #F59E0B;
  --info: #3B82F6;

  /* Dark-only Effects */
  --gradient-primary: linear-gradient(135deg, #2C918C 0%, #1A5C59 100%);
  --gradient-glow: radial-gradient(circle, rgba(44, 145, 140, 0.15) 0%, transparent 70%);
  --glow-primary: 0 0 20px rgba(44, 145, 140, 0.3);
  --glow-text: 0 0 20px rgba(44, 145, 140, 0.5);
}
```

### Shared Tokens

```css
:root {
  /* Spacing (8px grid) */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  --space-2xl: 64px;
  --space-3xl: 80px;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Shadow (Light theme only; Dark theme uses border + glow) */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.15);

  /* Typography */
  --font-primary: 'Noto Sans TC', 'Microsoft JhengHei', sans-serif;
  --font-secondary: 'Urbanist', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Breakpoints */
  --bp-mobile: 768px;
  --bp-tablet: 1024px;
  --bp-laptop: 1200px;
}
```
