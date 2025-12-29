# Claude Code 專案初始化模板

這是一個可直接使用的 Claude Code 專案配置模板，包含自定義狀態列、統計工具和專案設定。

## 📁 目錄結構

```
.claude/
├── agents/                          # 自定義 Agent 定義（8 個專業 Agents）
│   ├── code-quality-specialist.md
│   ├── deployment-expert.md
│   ├── documentation-specialist.md
│   ├── e2e-validation-specialist.md
│   ├── general-purpose.md
│   ├── security-infrastructure-auditor.md
│   ├── test-automation-engineer.md
│   └── workflow-template-manager.md
├── commands/                        # 自定義 Slash Commands（8 個命令）
│   ├── check-quality.md             # 代碼品質檢查
│   ├── hub-delegate.md              # Hub 委派管理
│   ├── review-code.md               # 代碼審查
│   ├── suggest-mode.md              # 建議模式
│   ├── task-init.md                 # TaskMaster 初始化
│   ├── task-next.md                 # 下一個任務
│   ├── task-status.md               # 任務狀態查詢
│   └── template-check.md            # 模板檢查
├── context/                         # 結構化上下文管理
│   ├── README.md
│   ├── decisions/                   # 技術決策記錄
│   ├── deployment/                  # 部署相關上下文
│   ├── docs/                        # 文檔上下文
│   ├── e2e/                         # E2E 測試上下文
│   ├── quality/                     # 代碼品質上下文
│   ├── security/                    # 安全審計上下文
│   ├── testing/                     # 測試相關上下文
│   └── workflow/                    # 工作流程上下文
├── coordination/                    # Agent 協調機制
│   ├── README.md
│   └── human_ai_collaboration_config.md
├── hooks/                           # 生命週期 Hooks
│   ├── README.md
│   ├── hook-utils.sh                # Hook 工具函數
│   ├── post-write.sh                # 寫入後執行
│   ├── pre-tool-use.sh              # 工具使用前執行
│   ├── session-start.sh             # Session 開始時執行
│   └── user-prompt-submit.sh        # 用戶提示提交時執行
├── output-styles/                   # 輸出樣式模板（14 個模板）
│   ├── README.md
│   ├── 01-prd-product-spec.md       # PRD 產品規格
│   ├── 02-bdd-scenario-spec.md      # BDD 場景規格
│   ├── 03-architecture-design-doc.md # 架構設計文檔
│   ├── 04-ddd-aggregate-spec.md     # DDD 聚合規格
│   ├── 05-api-contract-spec.md      # API 契約規格
│   ├── 06-tdd-unit-spec.md          # TDD 單元測試規格
│   ├── 07-code-review-checklist.md  # 代碼審查檢查清單
│   ├── 08-security-checklist.md     # 安全檢查清單
│   ├── 09-database-schema-spec.md   # 資料庫 Schema 規格
│   ├── 10-backend-python-impl.md    # 後端 Python 實作
│   ├── 11-frontend-component-bdd.md # 前端組件 BDD
│   ├── 12-integration-contract-suite.md # 整合契約測試套件
│   ├── 13-data-contract-evolution.md # 數據契約演進
│   └── 14-ci-quality-gates.md       # CI 品質閘門
├── plugins/
│   └── config.json                  # Plugin 配置
├── settings.json                    # Claude Code 主設定
├── settings.local.json              # 本地設定
├── package.json                     # Node.js 設定
├── statusline.go                    # 狀態列源碼
├── statusline-go                    # 狀態列執行檔（Linux）
├── statusline-go.exe                # 狀態列執行檔（Windows）
├── claude-stats.go                  # 統計工具源碼
├── claude-stats                     # 統計工具執行檔（Linux）
├── claude-stats.exe                 # 統計工具執行檔（Windows）
├── count_tokens.js                  # Token 計數工具
├── SOP.md                           # 狀態列安裝指南
└── ubuntu_development_setup.md      # Ubuntu 開發環境設定指南
```

## 🚀 快速開始

### 1. 複製配置到你的專案

```bash
# 複製整個 .claude 目錄到你的專案根目錄
cp -r /path/to/template/.claude /your/project/

# 或者建立符號連結（推薦）
ln -s /path/to/template/.claude /your/project/.claude
```

### 2. 配置 API Keys（如果需要 MCP 服務）

編輯專案根目錄的 `.mcp.json`（如果沒有則創建）：

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "YOUR_BRAVE_API_KEY_HERE"
      }
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "YOUR_CONTEXT7_API_KEY_HERE"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

**取得 API Keys：**
- **Brave Search**: https://brave.com/search/api/
- **Context7**: https://context7.ai/
- **GitHub**: https://github.com/settings/tokens

### 3. 設定路徑（Linux/WSL）

確保 `settings.json` 中的路徑正確指向你的專案：

```json
{
  "statusLine": {
    "type": "command",
    "command": "/your/project/.claude/statusline-go",
    "padding": 0
  }
}
```

**Windows 用戶**：將 `statusline-go` 改為 `statusline-go.exe`

### 4. 設定執行權限（Linux/WSL）

```bash
chmod +x .claude/statusline-go .claude/claude-stats
```

### 5. 重啟 Claude Code

完全關閉並重新啟動 Claude Code，狀態列應該會顯示。

## 📊 使用統計工具

```bash
# Linux/WSL
~/.claude/claude-stats           # 今日統計
~/.claude/claude-stats week      # 本週統計
~/.claude/claude-stats month     # 本月統計
~/.claude/claude-stats all       # 所有歷史

# Windows
%USERPROFILE%\.claude\claude-stats.exe
```

## 🔧 自定義配置

### 修改狀態列顯示

編輯 `statusline.go` 後重新編譯：

```bash
# Linux/WSL
cd .claude
go build -o statusline-go statusline.go

# Windows
cd .claude
go build -o statusline-go.exe statusline.go
```

### 啟用/停用 MCP 服務

編輯 `settings.local.json`：

```json
{
  "enabledMcpjsonServers": [
    "brave-search",
    "context7",
    "github",
    "playwright"
  ]
}
```

### 新增自定義 Slash Command

在 `commands/` 目錄新增 Markdown 文件：

```markdown
---
description: 命令描述
argument-hint: [參數提示]
allowed-tools: Read(*), Write(*), Bash(*)
---

# 命令標題

命令的詳細說明和執行邏輯...
```

### 新增輸出樣式模板

在 `output-styles/` 目錄新增模板文件，格式參考現有模板。

### 配置生命週期 Hooks

編輯 `hooks/` 目錄下的 Shell 腳本：
- 所有 Hooks 支援跨平台（Windows Git Bash, WSL, Linux, macOS）
- 使用 `hook-utils.sh` 中的共用函數
- 確保執行權限：`chmod +x hooks/*.sh`

## 📝 包含的功能

### ✅ 自定義狀態列
- 顯示當前模型（Opus/Sonnet/Haiku）
- 專案名稱和 Git 分支
- Context 使用量（視覺化進度條）
- 今日累計使用時數
- 最近兩條用戶指令預覽

### ✅ 專案級權限設定
預先配置常用指令的自動允許權限，包括：
- 檔案操作（Read, Write, Edit, Glob, Grep）
- Git 操作
- 開發工具（npm, docker, python, go 等）

### ✅ 8 個專業 Agents
- **general-purpose**: 通用任務處理
- **code-quality-specialist**: 代碼品質審查
- **documentation-specialist**: 技術文檔撰寫
- **e2e-validation-specialist**: 端到端測試驗證
- **security-infrastructure-auditor**: 安全審計
- **deployment-expert**: 部署運維
- **test-automation-engineer**: 測試自動化
- **workflow-template-manager**: 工作流程模板管理

### ✅ 8 個自定義 Slash Commands
- **/task-init**: TaskMaster 專案初始化
- **/task-next**: 獲取下一個任務
- **/task-status**: 查詢任務狀態
- **/check-quality**: 代碼品質檢查
- **/review-code**: 執行代碼審查
- **/hub-delegate**: Hub 委派管理
- **/suggest-mode**: 建議模式切換
- **/template-check**: 模板合規性檢查

### ✅ 5 個生命週期 Hooks
- **session-start.sh**: Session 啟動時自動執行（支援 TaskMaster 自動檢測）
- **user-prompt-submit.sh**: 用戶提示提交時執行
- **pre-tool-use.sh**: 工具使用前驗證和預處理
- **post-write.sh**: 文件寫入後的後處理
- **hook-utils.sh**: 共用工具函數（跨平台支援）

### ✅ 14 個輸出樣式模板
涵蓋完整的軟體開發生命週期：

**需求與設計階段：**
- PRD 產品規格
- BDD 場景規格
- 架構設計文檔
- DDD 聚合規格

**開發階段：**
- API 契約規格
- TDD 單元測試規格
- 後端 Python 實作規範
- 前端組件 BDD 規範

**品質保證階段：**
- 代碼審查檢查清單
- 安全檢查清單
- 整合契約測試套件

**部署與維護階段：**
- 資料庫 Schema 規格
- 數據契約演進管理
- CI 品質閘門配置

### ✅ 結構化上下文管理
8 個專用上下文目錄，用於儲存和組織不同類型的專案上下文：
- **decisions/**: 技術決策記錄（ADR）
- **deployment/**: 部署配置和記錄
- **docs/**: 文檔和知識庫
- **e2e/**: 端到端測試相關
- **quality/**: 代碼品質報告
- **security/**: 安全審計記錄
- **testing/**: 測試策略和記錄
- **workflow/**: 工作流程和流程圖

### ✅ Agent 協調機制
- **handoffs/**: Agent 間任務交接記錄
- **conflicts/**: 衝突解決與決策記錄
- **human_ai_collaboration_config.md**: 人機協作配置指南

### ✅ 生產力統計
- Session 追蹤
- 時間統計
- Token 使用量監控

## 🐞 疑難排解

### 狀態列無法顯示

**Linux/WSL:**
```bash
# 檢查執行檔是否存在
ls -l .claude/statusline-go

# 測試執行
echo '{"session_id":"test","model":{"display_name":"Sonnet"},"workspace":{"current_dir":"'$(pwd)'"}}' | .claude/statusline-go
```

**Windows:**
```powershell
# 檢查執行檔
dir .claude\statusline-go.exe

# 確認路徑設定
type .claude\settings.json | findstr statusLine
```

### Go 未安裝

參考 `SOP.md` 中的安裝指南。

### 權限錯誤（Linux）

```bash
chmod +x .claude/statusline-go .claude/claude-stats
```

## 📚 相關文檔

- `SOP.md` - 完整的狀態列安裝和配置指南
- `ubuntu_development_setup.md` - Ubuntu 開發環境設定
- `/home/bheadwei/.claude/CLAUDE.md` - Claude Code 全域設定與 Linus 式開發哲學

## 🔗 參考資源

- [Claude Code 官方文檔](https://docs.claude.com/claude-code)
- [Jackle's Blog - Status Line 設計](https://jackle.pro/articles/claude-code-status-line)
- [Go 官方網站](https://go.dev/)

## 📄 授權

此模板可自由使用和修改。

---

**統計資訊**:
- 總大小: 13MB
- 文件數: 62 個
- 包含: 8 Agents + 8 Commands + 14 Output Styles + 5 Hooks

**最後更新**: 2025-10-29
**版本**: v2.0
