package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

const (
	trackerDir  = ".claude/session-tracker"
	sessionsDir = "sessions"
	archiveDir  = "archive"
)

type Session struct {
	Date         string `json:"date"`
	TotalSeconds int64  `json:"total_seconds"`
}

type DailyStat struct {
	Date         time.Time
	TotalSeconds int64
	SessionCount int
}

var chineseWeekdays = map[time.Weekday]string{
	time.Sunday:    "日",
	time.Monday:    "一",
	time.Tuesday:   "二",
	time.Wednesday: "三",
	time.Thursday:  "四",
	time.Friday:    "五",
	time.Saturday:  "六",
}

func main() {
	arg := "today"
	if len(os.Args) > 1 {
		arg = os.Args[1]
	}

	stats, err := loadAllStats()
	if err != nil {
		fmt.Printf("Error loading stats: %v\n", err)
		os.Exit(1)
	}

	if len(stats) == 0 {
		fmt.Println("No session data found.")
		return
	}

	switch arg {
	case "today":
		printRangeStats("今日統計", time.Now(), time.Now(), stats)
	case "week":
		today := time.Now()
		startOfWeek := today.AddDate(0, 0, -int(today.Weekday())+1) // Assuming Monday is the start of the week
		if today.Weekday() == time.Sunday {
			startOfWeek = today.AddDate(0, 0, -6)
		}
		printRangeStats("本週統計", startOfWeek, today, stats)
	case "month":
		today := time.Now()
		startOfMonth := time.Date(today.Year(), today.Month(), 1, 0, 0, 0, 0, today.Location())
		printRangeStats("本月統計", startOfMonth, today, stats)
	case "all":
		printRangeStats("所有歷史統計", stats[0].Date, stats[len(stats)-1].Date, stats)
	default:
		if t, err := time.Parse("2006-01-02", arg); err == nil {
			printRangeStats(fmt.Sprintf("指定日期 %s 統計", arg), t, t, stats)
		} else {
			fmt.Println("Usage: claude-stats [today|week|month|all|YYYY-MM-DD]")
		}
	}
}

func loadAllStats() ([]*DailyStat, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return nil, err
	}
	basePath := filepath.Join(homeDir, trackerDir)

	statsMap := make(map[string]*DailyStat)

	processDir := func(dir string) error {
		files, err := os.ReadDir(dir)
		if err != nil {
			if os.IsNotExist(err) {
				return nil
			}
			return err
		}
		for _, file := range files {
			if !strings.HasSuffix(file.Name(), ".json") {
				continue
			}
			filePath := filepath.Join(dir, file.Name())
			data, err := os.ReadFile(filePath)
			if err != nil {
				continue
			}

			var s Session
			if err := json.Unmarshal(data, &s); err != nil || s.Date == "" {
				continue
			}

			if stat, ok := statsMap[s.Date]; ok {
				stat.TotalSeconds += s.TotalSeconds
				stat.SessionCount++
			} else {
				date, err := time.Parse("2006-01-02", s.Date)
				if err != nil {
					continue
				}
				statsMap[s.Date] = &DailyStat{
					Date:         date,
					TotalSeconds: s.TotalSeconds,
					SessionCount: 1,
				}
			}
		}
		return nil
	}

	if err := processDir(filepath.Join(basePath, sessionsDir)); err != nil {
		return nil, err
	}

	archiveBasePath := filepath.Join(basePath, archiveDir)
	dateDirs, _ := os.ReadDir(archiveBasePath)
	for _, dateDir := range dateDirs {
		if dateDir.IsDir() {
			if err := processDir(filepath.Join(archiveBasePath, dateDir.Name())); err != nil {
				return nil, err
			}
		}
	}

	var statsSlice []*DailyStat
	for _, v := range statsMap {
		statsSlice = append(statsSlice, v)
	}

	sort.Slice(statsSlice, func(i, j int) bool {
		return statsSlice[i].Date.Before(statsSlice[j].Date)
	})

	return statsSlice, nil
}

func printRangeStats(title string, start, end time.Time, allStats []*DailyStat) {
	fmt.Printf("=== %s ===\n", title)
	fmt.Printf("統計範圍: %s 至 %s\n", start.Format("2006-01-02"), end.Format("2006-01-02"))
	fmt.Println("----------------------------------------")

	var grandTotalSec, grandTotalSessions int64

	for _, stat := range allStats {
		if (stat.Date.After(start) || stat.Date.Equal(start)) && (stat.Date.Before(end) || stat.Date.Equal(end)) {
			hours := stat.TotalSeconds / 3600
			minutes := (stat.TotalSeconds % 3600) / 60
			weekday := chineseWeekdays[stat.Date.Weekday()]

			fmt.Printf("%s (%s): %2dh %2dm (%d sessions)\n",
				stat.Date.Format("2006-01-02"),
				weekday,
				hours,
				minutes,
				stat.SessionCount,
			)
			grandTotalSec += stat.TotalSeconds
			grandTotalSessions += int64(stat.SessionCount)
		}
	}

	fmt.Println("----------------------------------------")
	totalHours := grandTotalSec / 3600
	totalMinutes := (grandTotalSec % 3600) / 60
	fmt.Printf("總計: %dh %dm (%d sessions)\n", totalHours, totalMinutes, grandTotalSessions)
}
