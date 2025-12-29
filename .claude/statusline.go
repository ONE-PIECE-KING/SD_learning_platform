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

	// Context usage colors (5-level gradation)
	ColorCtxSafe    = "\x1b[38;2;152;195;121m" // 0-40%: Bright green
	ColorCtxGood    = "\x1b[38;2;108;167;185m" // 40-60%: Blue
	ColorCtxCaution = "\x1b[38;2;229;192;123m" // 60-75%: Yellow
	ColorCtxWarning = "\x1b[38;2;224;139;71m"  // 75-90%: Orange
	ColorCtxDanger  = "\x1b[38;2;224;108;117m" // 90-100%: Red
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

// Reset time tracking
type ResetInfo struct {
	Date        string `json:"date"`
	FirstUse    int64  `json:"first_use"`    // First interaction of the day
	ResetWindow int64  `json:"reset_window"` // in seconds, default 18000 (5 hours)
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

	results := make(chan Result, 5)
	var wg sync.WaitGroup
	wg.Add(5)

	go func() { defer wg.Done(); results <- Result{"git", getGitBranch(input.Workspace.CurrentDir)} }()
	go func() { defer wg.Done(); results <- Result{"hours", calculateTotalHours(input.SessionID)} }()
	go func() { defer wg.Done(); results <- Result{"context", analyzeContext(input.TranscriptPath, input.Model.DisplayName)} }()
	go func() { defer wg.Done(); results <- Result{"reset", getResetTime()} }()
	go func() {
		defer wg.Done()
		results <- Result{"message", extractUserMessage(input.TranscriptPath, input.SessionID)}
	}()

	go func() { wg.Wait(); close(results) }()

	var gitBranch, totalHours, contextUsage, resetTime, userMessage string
	for result := range results {
		switch result.Type {
		case "git":
			gitBranch = result.Data.(string)
		case "hours":
			totalHours = result.Data.(string)
		case "context":
			contextUsage = result.Data.(string)
		case "reset":
			resetTime = result.Data.(string)
		case "message":
			userMessage = result.Data.(string)
		}
	}

	updateSession(input.SessionID)

	modelDisplay := formatModel(input.Model.DisplayName)
	projectName := filepath.Base(input.Workspace.CurrentDir)

	fmt.Printf("%s[%s] 📂 %s%s%s%s | %s%s\n",
		ColorReset, modelDisplay, projectName, gitBranch,
		contextUsage, resetTime, totalHours, ColorReset)

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
			LastHeartbeat: currentTime, // Initialize LastHeartbeat
			Intervals:     []Interval{{Start: currentTime}},
		}
	}

	gap := currentTime - session.LastHeartbeat
	session.LastHeartbeat = currentTime
	if len(session.Intervals) > 0 {
		if gap < 600 { // Less than 10 minutes is a continuous session
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

func getModelContextLimit(modelName string) float64 {
	modelLower := strings.ToLower(modelName)
	if strings.Contains(modelLower, "[1m]") || strings.Contains(modelLower, "1m") {
		return 1000000.0 // 1M context
	}
	if strings.Contains(modelLower, "[500k]") {
		return 500000.0 // 500k context
	}
	return 200000.0 // Default 200k context
}

func analyzeContext(transcriptPath string, modelName string) string {
	contextLength := 0
	if transcriptPath != "" {
		contextLength = calculateContextUsage(transcriptPath)
	}

	maxContext := getModelContextLimit(modelName)
	percentage := int(float64(contextLength) * 100.0 / maxContext)
	if percentage > 100 {
		percentage = 100
	}

	progressBar := generateProgressBar(percentage)
	formattedNum := formatNumber(contextLength)
	maxFormatted := formatNumber(int(maxContext))
	color := getContextColor(percentage)
	icon := getContextIcon(percentage)

	return fmt.Sprintf(" | %s %s %s%d%% %s/%s%s", icon, progressBar, color, percentage, formattedNum, maxFormatted, ColorReset)
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
	if percentage < 40 {
		return ColorCtxSafe // 0-40%: Safe (Green)
	}
	if percentage < 60 {
		return ColorCtxGood // 40-60%: Good (Blue)
	}
	if percentage < 75 {
		return ColorCtxCaution // 60-75%: Caution (Yellow)
	}
	if percentage < 90 {
		return ColorCtxWarning // 75-90%: Warning (Orange)
	}
	return ColorCtxDanger // 90-100%: Danger (Red)
}

func getContextIcon(percentage int) string {
	if percentage < 40 {
		return "💧" // Safe
	}
	if percentage < 60 {
		return "💦" // Good
	}
	if percentage < 75 {
		return "🌊" // Caution
	}
	if percentage < 90 {
		return "⚠️" // Warning
	}
	return "🔥" // Danger
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

	start := len(lines) - 400 // Look back a bit further to ensure we find two messages
	if start < 0 {
		start = 0
	}

	var userMessages []string
	// Iterate from the end of the file backwards
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
						// Stop once we have found two messages
						if len(userMessages) == 2 {
							break
						}
					}
				}
			}
		}
	}

	// Reverse the slice, as we found them in reverse order
	for i, j := 0, len(userMessages)-1; i < j; i, j = i+1, j-1 {
		userMessages[i], userMessages[j] = userMessages[j], userMessages[i]
	}

	// Join the messages with a separator for formatting
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

// Get reset time information (real-time, no message counting)
func getResetTime() string {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return ""
	}

	today := time.Now().Format("2006-01-02")
	resetFile := filepath.Join(homeDir, ".claude", "cache", fmt.Sprintf("reset-%s.json", today))

	var resetInfo ResetInfo
	currentTime := time.Now().Unix()

	// Try to load existing reset info
	if data, err := os.ReadFile(resetFile); err == nil {
		if json.Unmarshal(data, &resetInfo) == nil && resetInfo.Date == today {
			// Use existing first use time
			return formatResetDisplay(resetInfo.FirstUse, resetInfo.ResetWindow)
		}
	}

	// Initialize new reset info for today
	resetInfo = ResetInfo{
		Date:        today,
		FirstUse:    currentTime,
		ResetWindow: 18000, // 5 hours in seconds
	}

	// Save reset info
	os.MkdirAll(filepath.Join(homeDir, ".claude", "cache"), 0755)
	if data, err := json.Marshal(resetInfo); err == nil {
		os.WriteFile(resetFile, data, 0644)
	}

	return formatResetDisplay(resetInfo.FirstUse, resetInfo.ResetWindow)
}

func formatResetDisplay(firstUse int64, resetWindow int64) string {
	now := time.Now().Unix()
	nextReset := firstUse + resetWindow
	timeUntilReset := nextReset - now

	if timeUntilReset < 0 {
		timeUntilReset = 0
	}

	hours := timeUntilReset / 3600
	minutes := (timeUntilReset % 3600) / 60

	var resetStr string
	if hours > 0 {
		resetStr = fmt.Sprintf("%dh%dm", hours, minutes)
	} else if minutes > 0 {
		resetStr = fmt.Sprintf("%dm", minutes)
	} else {
		resetStr = "now"
	}

	return fmt.Sprintf(" | ↻ %s", resetStr)
}
