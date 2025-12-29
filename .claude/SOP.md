# Claude Code 高效能狀態列 & 統計系統設定 SOP

本文檔引導您在 **Windows/Linux/WSL** 環境下，為 Claude Code 設定完整的自訂狀態列與生產力統計系統。

**✅ 支援環境：** Windows 10/11, Linux, WSL-Ubuntu
**📅 最後更新：** 2025-01-17
**🔗 原始設計：** [Jackle's Blog](https://jackle.pro/articles/claude-code-status-line)

---

## 📋 功能預覽

**1. 動態狀態列**
- **模型**、**專案**、**Git 分支**
- **視覺化 Context 使用量 (%)**
- **今日累計使用時數**
- **最近兩條指令預覽**

**2. 歷史統計工具 (`claude-stats`)**
- 查詢今日/本週/本月/所有歷史工作記錄
- 視覺化時間統計與 session 分析

---

## 📁 資料夾結構

系統會自動建立以下結構：

```
~/.claude/ (Windows: C:\Users\<username>\.claude\)
├── statusline.go              # 狀態列程式原始碼
├── statusline-go              # 編譯後的執行檔 (Linux/WSL: ~3.1M)
├── statusline-go.exe          # 編譯後的執行檔 (Windows: ~3.5M)
├── claude-stats.go            # 統計工具原始碼
├── claude-stats               # 編譯後的執行檔 (Linux/WSL: ~2.9M)
├── claude-stats.exe           # 編譯後的執行檔 (Windows: ~3.2M)
├── settings.json              # Claude Code 設定檔
└── session-tracker/           # 自動建立：存放使用記錄
    ├── sessions/              # 當前 session 資料
    └── archive/               # 歷史 session 資料（可選）
```

**注意：** `session-tracker/` 會在首次執行時自動建立。

---

## 步驟一：環境準備 (安裝 Go 語言)

### Windows 環境

**方法 1：使用官方安裝器（推薦）**
1. 前往 [Go 官方下載頁面](https://go.dev/dl/)
2. 下載 Windows 安裝器（例如：`go1.21.6.windows-amd64.msi`）
3. 執行安裝器，按照提示完成安裝
4. 重啟終端（或 IDE）

**方法 2：使用 Chocolatey**
```powershell
# 在 PowerShell (管理員) 中執行
choco install golang
```

**驗證安裝**：
```powershell
go version
# 應顯示: go version go1.21.x windows/amd64
```

### Linux/WSL-Ubuntu 環境

**方法 1：使用 apt (Ubuntu/Debian)**
```bash
sudo apt update
sudo apt install golang-go
```

**方法 2：安裝最新版本（推薦）**
```bash
wget https://go.dev/dl/go1.21.6.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc
```

**驗證安裝**：
```bash
go version
# 或使用完整路徑
/usr/local/go/bin/go version
```

### ⚠️ 常見問題：go: command not found

**Windows**：
- 確認安裝後重啟終端
- 檢查環境變數 PATH 是否包含 Go 安裝目錄

**Linux/WSL**：
- 使用完整路徑：`/usr/local/go/bin/go`
- 或將 Go 加入 PATH（參考上方步驟）

---

## 步驟二：建立狀態列主程式 (`statusline.go`)

1. **建立原始碼檔案**

   **Windows (PowerShell)**：
   ```powershell
   # 確保目錄存在
   New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude"

   # 建立檔案（使用您慣用的編輯器）
   notepad "$env:USERPROFILE\.claude\statusline.go"
   ```

   **Linux/WSL (Bash)**：
   ```bash
   mkdir -p ~/.claude
   nano ~/.claude/statusline.go
   # 或使用 vim, code 等編輯器
   ```

2. **貼上程式碼**

   將以下完整的 Go 程式碼複製到 `statusline.go`：

```go
package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"
)

// ANSI Color Codes & Icons
const (
	ColorReset    = "\x1b[0m"
	ColorGreen    = "\x1b[38;2;152;195;121m"
	ColorGray     = "\x1b[38;2;64;64;64m"
	ColorCtxGreen = "\x1b[38;2;108;167;108m"
	ColorCtxGold  = "\x1b[38;2;188;155;83m"
	ColorCtxRed   = "\x1b[38;2;185;102;82m"
)

var modelConfig = map[string][2]string{
	"Opus":   {"\x1b[38;2;195;158;83m", "💛"},
	"Sonnet": {"\x1b[38;2;118;170;185m", "💠"},
	"Haiku":  {"\x1b[38;2;255;182;193m", "🌸"},
}

// Data structures for JSON parsing
type Input struct {
	Model struct {
		DisplayName string `json:"display_name"`
	} `json:"model"`
	SessionID string `json:"session_id"`
	Workspace struct {
		CurrentDir string `json:"current_dir"`
	} `json:"workspace"`
	TranscriptPath string `json:"transcript_path,omitempty"`
}
type Session struct {
	ID            string     `json:"id"`
	Date          string     `json:"date"`
	Start         int64      `json:"start"`
	LastHeartbeat int64      `json:"last_heartbeat"`
	TotalSeconds  int64      `json:"total_seconds"`
	Intervals     []Interval `json:"intervals"`
}
type Interval struct {
	Start int64  `json:"start"`
	End   *int64 `json:"end"`
}
type Result struct {
	Type string
	Data interface{}
}

// Simple in-memory cache for Git branch
var (
	gitBranchCache   string
	gitBranchExpires time.Time
	cacheMutex       sync.RWMutex
)

func main() {
	var input Input
	if err := json.NewDecoder(os.Stdin).Decode(&input); err != nil {
		return
	}
	if input.SessionID == "" {
		return
	}

	results := make(chan Result, 4)
	var wg sync.WaitGroup
	wg.Add(4)

	go func() { defer wg.Done(); results <- Result{"git", getGitBranch(input.Workspace.CurrentDir)} }()
	go func() { defer wg.Done(); results <- Result{"hours", calculateTotalHours(input.SessionID)} }()
	go func() { defer wg.Done(); results <- Result{"context", analyzeContext(input.TranscriptPath)} }()
	go func() {
		defer wg.Done()
		results <- Result{"message", extractUserMessage(input.TranscriptPath, input.SessionID)}
	}()

	go func() { wg.Wait(); close(results) }()

	var gitBranch, totalHours, contextUsage, userMessage string
	for result := range results {
		switch result.Type {
		case "git":
			gitBranch = result.Data.(string)
		case "hours":
			totalHours = result.Data.(string)
		case "context":
			contextUsage = result.Data.(string)
		case "message":
			userMessage = result.Data.(string)
		}
	}

	updateSession(input.SessionID)

	modelDisplay := formatModel(input.Model.DisplayName)
	projectName := filepath.Base(input.Workspace.CurrentDir)

	fmt.Printf("%s[%s] 📂 %s%s%s | %s%s\n",
		ColorReset, modelDisplay, projectName, gitBranch,
		contextUsage, totalHours, ColorReset)

	if userMessage != "" {
		fmt.Print(userMessage)
	}
}

func formatModel(model string) string {
	for key, config := range modelConfig {
		if strings.Contains(model, key) {
			color, icon := config[0], config[1]
			return fmt.Sprintf("%s%s %s%s", color, icon, model, ColorReset)
		}
	}
	return model
}

func getGitBranch(currentDir string) string {
	cacheMutex.RLock()
	if time.Now().Before(gitBranchExpires) {
		result := gitBranchCache
		cacheMutex.RUnlock()
		return result
	}
	cacheMutex.RUnlock()

	cmd := exec.Command("git", "branch", "--show-current")
	cmd.Dir = currentDir
	output, err := cmd.Output()
	if err != nil {
		return ""
	}
	branch := strings.TrimSpace(string(output))
	if branch == "" {
		return ""
	}

	result := fmt.Sprintf(" ⚡ %s", branch)
	cacheMutex.Lock()
	gitBranchCache = result
	gitBranchExpires = time.Now().Add(5 * time.Second)
	cacheMutex.Unlock()
	return result
}

func updateSession(sessionID string) {
	homeDir, _ := os.UserHomeDir()
	sessionsDir := filepath.Join(homeDir, ".claude", "session-tracker", "sessions")
	os.MkdirAll(sessionsDir, 0755)

	sessionFile := filepath.Join(sessionsDir, sessionID+".json")
	currentTime := time.Now().Unix()
	today := time.Now().Format("2006-01-02")

	var session Session
	if data, err := os.ReadFile(sessionFile); err == nil {
		json.Unmarshal(data, &session)
	} else {
		session = Session{
			ID:            sessionID,
			Date:          today,
			Start:         currentTime,
			LastHeartbeat: currentTime,
			Intervals:     []Interval{{Start: currentTime}},
		}
	}

	gap := currentTime - session.LastHeartbeat
	session.LastHeartbeat = currentTime
	if len(session.Intervals) > 0 {
		if gap < 600 {
			session.Intervals[len(session.Intervals)-1].End = &currentTime
		} else if session.Intervals[len(session.Intervals)-1].End == nil {
			lastEnd := session.LastHeartbeat - gap
			session.Intervals[len(session.Intervals)-1].End = &lastEnd
			session.Intervals = append(session.Intervals, Interval{Start: currentTime})
		} else {
			session.Intervals = append(session.Intervals, Interval{Start: currentTime})
		}
	}

	var total int64
	for _, interval := range session.Intervals {
		if interval.End != nil {
			total += *interval.End - interval.Start
		}
	}
	session.TotalSeconds = total

	if data, err := json.Marshal(session); err == nil {
		os.WriteFile(sessionFile, data, 0644)
	}
}

func calculateTotalHours(currentSessionID string) string {
	homeDir, _ := os.UserHomeDir()
	sessionsDir := filepath.Join(homeDir, ".claude", "session-tracker", "sessions")
	entries, err := os.ReadDir(sessionsDir)
	if err != nil {
		return "0m"
	}

	var totalSeconds int64
	activeSessions := 0
	today := time.Now().Format("2006-01-02")
	currentTime := time.Now().Unix()

	for _, entry := range entries {
		if !strings.HasSuffix(entry.Name(), ".json") {
			continue
		}

		var session Session
		data, err := os.ReadFile(filepath.Join(sessionsDir, entry.Name()))
		if err != nil || json.Unmarshal(data, &session) != nil {
			continue
		}

		if session.Date == today {
			totalSeconds += session.TotalSeconds
			if currentTime-session.LastHeartbeat < 600 {
				activeSessions++
			}
		}
	}

	hours := totalSeconds / 3600
	minutes := (totalSeconds % 3600) / 60
	timeStr := fmt.Sprintf("%dm", minutes)
	if hours > 0 {
		timeStr = fmt.Sprintf("%dh%dm", hours, minutes)
	}
	if activeSessions > 1 {
		return fmt.Sprintf("%s [%d sessions]", timeStr, activeSessions)
	}
	return timeStr
}

func analyzeContext(transcriptPath string) string {
	contextLength := 0
	if transcriptPath != "" {
		contextLength = calculateContextUsage(transcriptPath)
	}

	percentage := int(float64(contextLength) * 100.0 / 200000.0)
	if percentage > 100 {
		percentage = 100
	}

	progressBar := generateProgressBar(percentage)
	formattedNum := formatNumber(contextLength)
	color := getContextColor(percentage)

	return fmt.Sprintf(" | %s %s%d%% %s%s", progressBar, color, percentage, formattedNum, ColorReset)
}

func calculateContextUsage(transcriptPath string) int {
	file, err := os.Open(transcriptPath)
	if err != nil {
		return 0
	}
	defer file.Close()

	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	start := len(lines) - 100
	if start < 0 {
		start = 0
	}

	for i := len(lines) - 1; i >= start; i-- {
		var data map[string]interface{}
		if json.Unmarshal([]byte(lines[i]), &data) != nil {
			continue
		}

		isSidechain, _ := data["isSidechain"].(bool)
		if isSidechain {
			continue
		}

		if msg, ok := data["message"].(map[string]interface{}); ok {
			if usage, ok := msg["usage"].(map[string]interface{}); ok {
				var total float64
				if v, ok := usage["input_tokens"].(float64); ok {
					total += v
				}
				if v, ok := usage["cache_read_input_tokens"].(float64); ok {
					total += v
				}
				if v, ok := usage["cache_creation_input_tokens"].(float64); ok {
					total += v
				}
				if total > 0 {
					return int(total)
				}
			}
		}
	}
	return 0
}

func generateProgressBar(percentage int) string {
	width := 10
	filled := (percentage * width) / 100
	if filled > width {
		filled = width
	}
	empty := width - filled
	color := getContextColor(percentage)

	var bar strings.Builder
	if filled > 0 {
		bar.WriteString(color)
		bar.WriteString(strings.Repeat("█", filled))
		bar.WriteString(ColorReset)
	}
	if empty > 0 {
		bar.WriteString(ColorGray)
		bar.WriteString(strings.Repeat("░", empty))
		bar.WriteString(ColorReset)
	}
	return bar.String()
}

func getContextColor(percentage int) string {
	if percentage < 60 {
		return ColorCtxGreen
	}
	if percentage < 80 {
		return ColorCtxGold
	}
	return ColorCtxRed
}

func formatNumber(num int) string {
	if num == 0 {
		return "--"
	}
	if num >= 1000 {
		return fmt.Sprintf("%dk", num/1000)
	}
	return strconv.Itoa(num)
}

func extractUserMessage(transcriptPath, sessionID string) string {
	if transcriptPath == "" {
		return ""
	}
	file, err := os.Open(transcriptPath)
	if err != nil {
		return ""
	}
	defer file.Close()

	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	start := len(lines) - 400
	if start < 0 {
		start = 0
	}

	var userMessages []string
	for i := len(lines) - 1; i >= start; i-- {
		var data map[string]interface{}
		if json.Unmarshal([]byte(lines[i]), &data) != nil {
			continue
		}

		isSidechain, _ := data["isSidechain"].(bool)
		sid, _ := data["sessionId"].(string)
		msgType, _ := data["type"].(string)

		if !isSidechain && sid == sessionID && msgType == "user" {
			if msg, ok := data["message"].(map[string]interface{}); ok {
				if role, _ := msg["role"].(string); role == "user" {
					if content, ok := msg["content"].(string); ok && !isSystemMessage(content) {
						userMessages = append(userMessages, content)
						if len(userMessages) == 2 {
							break
						}
					}
				}
			}
		}
	}

	for i, j := 0, len(userMessages)-1; i < j; i, j = i+1, j-1 {
		userMessages[i], userMessages[j] = userMessages[j], userMessages[i]
	}

	if len(userMessages) > 0 {
		return formatUserMessage(strings.Join(userMessages, "\n---\n"))
	}

	return ""
}

func isSystemMessage(content string) bool {
	return strings.HasPrefix(content, "[") || strings.HasPrefix(content, "{") ||
		strings.Contains(content, "<local-command-stdout>") || strings.HasPrefix(content, "Caveat:")
}

func formatUserMessage(message string) string {
	if message == "" {
		return ""
	}
	maxLines := 3
	lineWidth := 80

	lines := strings.Split(strings.ReplaceAll(message, "\\n", "\n"), "\n")
	var result []string

	for i, line := range lines {
		if i >= maxLines {
			break
		}
		line = strings.TrimSpace(line)
		if len(line) > lineWidth {
			line = line[:lineWidth-3] + "..."
		}
		result = append(result, fmt.Sprintf("%s｜%s%s%s", ColorReset, ColorGreen, line, ColorReset))
	}
	if len(lines) > maxLines {
		result = append(result, fmt.Sprintf("%s｜... (還有 %d 行)%s", ColorReset, len(lines)-maxLines, ColorReset))
	}
	if len(result) > 0 {
		return strings.Join(result, "\n") + "\n"
	}
	return ""
}
```

---

## 步驟三：建立統計報告工具 (`claude-stats.go`)

1. **建立原始碼檔案**

   **Windows**：
   ```powershell
   notepad "$env:USERPROFILE\.claude\claude-stats.go"
   ```

   **Linux/WSL**：
   ```bash
   nano ~/.claude/claude-stats.go
   ```

2. **貼上程式碼**（與 statusline.go 相同位置）

[程式碼內容與原文相同，省略以節省空間]

---

## 步驟四：編譯程式

### Windows (PowerShell)

```powershell
# 切換到 .claude 目錄
cd $env:USERPROFILE\.claude

# 編譯狀態列
go build -o statusline-go.exe statusline.go

# 編譯統計工具
go build -o claude-stats.exe claude-stats.go

# 驗證
dir statusline-go.exe, claude-stats.exe
```

### Linux/WSL (Bash)

```bash
# 切換到 .claude 目錄
cd ~/.claude

# 編譯狀態列
go build -o statusline-go statusline.go
# 或使用完整路徑
/usr/local/go/bin/go build -o statusline-go statusline.go

# 編譯統計工具
go build -o claude-stats claude-stats.go

# 設定執行權限
chmod +x statusline-go claude-stats

# 驗證
ls -lh statusline-go claude-stats
```

---

## 步驟五：設定 Claude Code

1. **開啟設定檔**
   - 在 Claude Code 中，使用 `Ctrl+Shift+P` (Windows) 或 `Cmd+Shift+P` (Mac)
   - 輸入 `Open User Settings (JSON)`
   - 開啟 `~/.claude/settings.json`

2. **加入設定**

   **Windows**：
   ```json
   {
     "permissions": {
       "allow": [
         "Bash(~/.claude/claude-stats.exe:*)"
       ],
       "deny": [],
       "ask": []
     },
     "statusLine": {
       "type": "command",
       "command": "$HOME/.claude/statusline-go.exe",
       "padding": 0
     }
   }
   ```

   **Linux/WSL**：
   ```json
   {
     "permissions": {
       "allow": [
         "Bash(~/.claude/claude-stats:*)"
       ],
       "deny": [],
       "ask": []
     },
     "statusLine": {
       "type": "command",
       "command": "$HOME/.claude/statusline-go",
       "padding": 0
     }
   }
   ```

### ⚠️ 常見問題：JSON 格式錯誤

**驗證 JSON 格式**：

**Windows**：
```powershell
python -m json.tool "$env:USERPROFILE\.claude\settings.json"
```

**Linux/WSL**：
```bash
python3 -m json.tool ~/.claude/settings.json
```

**重點**：
- `statusLine` 必須與 `permissions` 同層級
- 注意逗號和括號的配對

---

## 步驟六：設定 PATH（可選）

### Windows

```powershell
# 臨時加入（當前 session）
$env:PATH += ";$env:USERPROFILE\.claude"

# 永久加入（需要管理員權限）
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "User") + ";$env:USERPROFILE\.claude",
    "User"
)
```

### Linux/WSL

```bash
# 檢查是否已加入
grep 'export PATH.*\.claude' ~/.bashrc

# 如果沒有，則加入
echo 'export PATH=$PATH:~/.claude' >> ~/.bashrc
source ~/.bashrc
```

---

## 步驟七：驗證與使用

### 測試統計工具

**Windows**：
```powershell
# 使用完整路徑
& "$env:USERPROFILE\.claude\claude-stats.exe"

# 或如果已加入 PATH
claude-stats
```

**Linux/WSL**：
```bash
~/.claude/claude-stats
# 或
claude-stats
```

### 重啟 Claude Code
- 完全關閉 Claude Code
- 重新啟動
- 檢查狀態列是否顯示

### 使用統計工具

```bash
claude-stats           # 今日統計
claude-stats week      # 本週統計
claude-stats month     # 本月統計
claude-stats all       # 所有歷史
claude-stats 2025-01-17  # 指定日期
```

---

## ✅ 完整檢查清單

- [ ] Go 已安裝（`go version`）
- [ ] `statusline.go` 原始碼已建立
- [ ] `claude-stats.go` 原始碼已建立
- [ ] `statusline-go(.exe)` 已編譯
- [ ] `claude-stats(.exe)` 已編譯
- [ ] Linux/WSL: 執行權限已設定
- [ ] `settings.json` 已正確設定
- [ ] JSON 格式已驗證
- [ ] PATH 已加入（可選）
- [ ] 統計工具可執行
- [ ] Claude Code 已重啟
- [ ] 狀態列正確顯示

---

## 🔧 進階維護

### 更新程式碼

**Windows**：
```powershell
cd $env:USERPROFILE\.claude
go build -o statusline-go.exe statusline.go
go build -o claude-stats.exe claude-stats.go
```

**Linux/WSL**：
```bash
cd ~/.claude
go build -o statusline-go statusline.go
go build -o claude-stats claude-stats.go
```

### 清理舊資料

**Windows**：
```powershell
# 查看資料大小
Get-ChildItem "$env:USERPROFILE\.claude\session-tracker" -Recurse | Measure-Object -Property Length -Sum
```

**Linux/WSL**：
```bash
du -sh ~/.claude/session-tracker/
```

### 備份設定

**Windows**：
```powershell
Copy-Item "$env:USERPROFILE\.claude\settings.json" "$env:USERPROFILE\.claude\settings.json.backup"
```

**Linux/WSL**：
```bash
cp ~/.claude/settings.json ~/.claude/settings.json.backup
```

---

## 📝 疑難排解

### Windows 特定問題

**問題 1：無法執行 .exe 檔案**
- 檢查防毒軟體是否攔截
- 確認檔案未被標記為不安全

**問題 2：PowerShell 執行政策**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Linux/WSL 特定問題

**問題 1：權限不足**
```bash
chmod +x ~/.claude/statusline-go ~/.claude/claude-stats
```

**問題 2：Go 未找到**
```bash
# 使用完整路徑
/usr/local/go/bin/go version
```

---

**版本**: v2.0
**變更記錄**:
- 2025-01-17: 新增 Windows 支援，重組跨平台指引，修正日期
- 2024-10-12: 初始版本（Linux only）

**參考資料**:
- [Jackle's Blog - Claude Code Status Line](https://jackle.pro/articles/claude-code-status-line)
- [Claude Code 官方文檔](https://docs.claude.com/)
- [Go 官方網站](https://go.dev/)
