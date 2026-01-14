# Git 與 GitHub 工作流程指南

> Learning Platform 團隊協作的版本控制規範

## 目錄

- [分支策略](#分支策略)
- [分支命名規則](#分支命名規則)
- [Commit 訊息規範](#commit-訊息規範)
- [Pull Request 規範](#pull-request-規範)
- [程式碼審查流程](#程式碼審查流程)
- [常用 Git 指令](#常用-git-指令)
- [衝突處理](#衝突處理)
- [禁止事項](#禁止事項)

---

## 分支策略

本專案採用 **Git Flow** 分支策略：

```
main (production)
  │
  └── develop (integration)
        │
        ├── feature/<owner>-<module>-<feature>
        ├── hotfix/<issue-id>-<description>
        └── release/<version>
```

### 分支說明

| 分支類型 | 用途 | 來源 | 合併目標 |
|---------|------|------|---------|
| `main` | 生產環境程式碼 | - | - |
| `develop` | 整合開發分支 | main | main |
| `feature/*` | 新功能開發 | develop | develop |
| `hotfix/*` | 緊急修復 | main | main + develop |
| `release/*` | 版本發布準備 | develop | main + develop |

---

## 分支命名規則

### Feature 分支

```
feature/<owner>-<module>-<feature>
```

**格式說明：**
- `<owner>`: 開發者名稱 (小寫英文)
- `<module>`: 模組名稱
- `<feature>`: 功能描述 (使用 kebab-case)

**範例：**
```
feature/celia-auth-google-oauth
feature/gugu-frontend-course-list
feature/ziko-courses-search-api
feature/kuanwei-videos-upload-handler
```

### Hotfix 分支

```
hotfix/<issue-id>-<description>
```

**範例：**
```
hotfix/123-fix-login-redirect
hotfix/456-video-playback-error
```

### Release 分支

```
release/<version>
```

**範例：**
```
release/1.0.0
release/1.1.0-beta
```

---

## Commit 訊息規範

### 格式

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Type 類型

| Type | 說明 | 範例 |
|------|------|------|
| `feat` | 新增功能 | feat(auth): add Google OAuth login |
| `fix` | 修復錯誤 | fix(video): resolve playback stutter |
| `docs` | 文件變更 | docs(readme): update setup instructions |
| `style` | 格式調整 (不影響程式邏輯) | style(api): format code with black |
| `refactor` | 程式碼重構 | refactor(courses): simplify query logic |
| `test` | 測試相關 | test(auth): add JWT validation tests |
| `chore` | 建置/工具變更 | chore(deps): upgrade fastapi to 0.110 |
| `perf` | 效能優化 | perf(db): add index for course search |
| `ci` | CI/CD 相關 | ci(github): add deploy workflow |

### Scope 範圍

根據模組定義：

| Scope | 說明 |
|-------|------|
| `auth` | 認證授權模組 |
| `courses` | 課程模組 |
| `videos` | 影片模組 |
| `orders` | 訂單模組 |
| `users` | 使用者模組 |
| `frontend` | 前端相關 |
| `api` | API 路由 |
| `db` | 資料庫相關 |
| `deps` | 依賴套件 |
| `docker` | 容器相關 |
| `ci` | CI/CD |

### 撰寫原則

1. **Subject 使用英文**，動詞開頭，現在式
2. **首字母小寫**，結尾不加句號
3. **限制 50 字元**以內
4. **Body 說明 why**，不只是 what

### 範例

**簡單變更：**
```
feat(auth): add JWT refresh token endpoint
```

**複雜變更：**
```
fix(video): resolve HLS streaming timeout issue

The video player was timing out on slow connections because
the segment fetch timeout was too short.

- Increased timeout from 5s to 15s
- Added retry logic for failed segments
- Updated error handling to show user-friendly message

Closes #234
```

---

## Pull Request 規範

### PR 標題格式

```
<type>(<scope>): <description>
```

與 Commit 訊息格式相同。

### PR 描述模板

```markdown
## Summary
<!-- 用 1-3 個重點說明這個 PR 做了什麼 -->

-
-

## Changes
<!-- 列出主要變更 -->

-
-

## Test Plan
<!-- 如何測試這些變更 -->

- [ ] 單元測試通過
- [ ] 整合測試通過
- [ ] 手動測試項目...

## Screenshots (if applicable)
<!-- 如有 UI 變更，附上截圖 -->

## Related Issues
<!-- 關聯的 Issue -->

Closes #xxx
```

### PR 檢查清單

提交 PR 前確認：

- [ ] 程式碼符合專案規範
- [ ] 通過所有現有測試
- [ ] 新功能有對應測試
- [ ] 無 console.log / print 除錯程式碼
- [ ] 已更新相關文件
- [ ] Commit 訊息符合規範
- [ ] 已指定 Reviewer

---

## 程式碼審查流程

### 審查流程

```
1. 開發者提交 PR
       ↓
2. 自動化檢查 (CI)
       ↓
3. 指定 Reviewer (模組 Owner 或 Backup)
       ↓
4. Reviewer 審查
       ↓
5. 修改 / 討論
       ↓
6. Approve
       ↓
7. Merge (Squash and Merge)
```

### Reviewer 指派

根據模組所有權指派：

| 模組 | Primary Reviewer | Backup |
|------|-----------------|--------|
| backend/core | 冠瑋 | TL |
| backend/auth | Celia | 冠瑋 |
| backend/courses | 子科 | 冠瑋 |
| backend/videos | 冠瑋 | Celia |
| frontend/* | 古古 / Jane | TL |

### 審查重點

- **功能正確性**：邏輯是否正確
- **程式碼品質**：可讀性、維護性
- **效能考量**：是否有效能問題
- **安全性**：是否有安全漏洞
- **測試覆蓋**：是否有足夠測試

---

## 常用 Git 指令

### 日常開發

```bash
# 建立 feature 分支
git checkout develop
git pull origin develop
git checkout -b feature/kuanwei-auth-logout

# 提交變更
git add .
git commit -m "feat(auth): add logout endpoint"

# 推送到遠端
git push -u origin feature/kuanwei-auth-logout

# 更新分支 (rebase from develop)
git fetch origin
git rebase origin/develop
```

### 同步與更新

```bash
# 拉取最新程式碼
git pull origin develop

# 同步 fork (如適用)
git fetch upstream
git merge upstream/develop
```

### 分支管理

```bash
# 查看所有分支
git branch -a

# 刪除本地分支
git branch -d feature/xxx

# 刪除遠端分支
git push origin --delete feature/xxx

# 切換分支
git checkout develop
```

### 暫存變更

```bash
# 暫存目前變更
git stash

# 恢復暫存
git stash pop

# 查看暫存列表
git stash list
```

### 查看歷史

```bash
# 查看提交歷史
git log --oneline -20

# 查看特定檔案歷史
git log --oneline -- path/to/file

# 查看分支圖
git log --oneline --graph --all
```

---

## 衝突處理

### 處理流程

```bash
# 1. 更新 develop
git checkout develop
git pull origin develop

# 2. 切回 feature 分支
git checkout feature/xxx

# 3. Rebase (推薦) 或 Merge
git rebase develop

# 4. 解決衝突
# 編輯衝突檔案，移除衝突標記
# <<<<<<<, =======, >>>>>>>

# 5. 標記已解決
git add <conflicted-file>

# 6. 繼續 rebase
git rebase --continue

# 7. 強制推送 (rebase 後需要)
git push --force-with-lease
```

### 衝突標記說明

```
<<<<<<< HEAD
你的變更
=======
他人的變更
>>>>>>> develop
```

---

## 禁止事項

### 絕對禁止

| 禁止行為 | 原因 | 正確做法 |
|---------|------|---------|
| 直接 push 到 `main` | 繞過審查流程 | 透過 PR 合併 |
| 直接 push 到 `develop` | 繞過審查流程 | 透過 PR 合併 |
| `git push --force` | 可能覆蓋他人工作 | 使用 `--force-with-lease` |
| 在 PR 未通過 CI 時 merge | 可能引入錯誤 | 等待 CI 通過 |
| 修改他人模組未通知 | 違反模組所有權 | 先聯繫 Owner |
| 提交含密碼/金鑰的程式碼 | 安全風險 | 使用環境變數 |

### 需要注意

- **不要**提交 `.env` 檔案
- **不要**提交 `node_modules/` 或 `.venv/`
- **不要**提交編譯產物 (`dist/`, `build/`)
- **不要**提交 IDE 設定 (`.idea/`, `.vscode/` 除特定共享設定)

---

## 檔案命名規範

### Python (Backend)

```
snake_case.py

models/user.py
models/course_enrollment.py
services/video_processor.py
```

### TypeScript/React (Frontend)

```
元件: PascalCase.tsx
工具: camelCase.ts
樣式: kebab-case.css

components/CourseCard.tsx
components/VideoPlayer.tsx
hooks/useAuth.ts
lib/api-client.ts
styles/course-list.css
```

### 資料夾命名

```
全部使用 kebab-case 或 snake_case (保持一致)

backend/
  app/
    api/
    core/
    models/
    services/

frontend/
  src/
    components/
    hooks/
    lib/
    pages/
```

---

## 版本號規範

採用 **Semantic Versioning (SemVer)**：

```
MAJOR.MINOR.PATCH

1.0.0 → 1.0.1 (patch: bug fix)
1.0.1 → 1.1.0 (minor: new feature)
1.1.0 → 2.0.0 (major: breaking change)
```

### 版本標籤

```bash
# 建立標籤
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送標籤
git push origin v1.0.0

# 推送所有標籤
git push origin --tags
```

---

## 相關文件

- [CLAUDE.md](../CLAUDE.md) - 專案規範總覽
- [資料庫遷移指南](./Database_Migration_Guide.md)
- [契約使用說明書](./契約使用說明書.md)
