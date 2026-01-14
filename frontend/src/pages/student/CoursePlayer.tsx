import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Play, Pause, Volume2, Maximize, Settings, 
  ChevronDown, ChevronUp, Check, MessageSquare, 
  FileText, BookOpen, ClipboardList, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Mock data
const chapters = [
  {
    id: "1",
    title: "第一章：Python 基礎入門",
    lessons: [
      { id: "1-1", title: "1-1 環境安裝與設定", duration: "15:30", completed: true },
      { id: "1-2", title: "1-2 變數與資料型態", duration: "22:45", completed: true },
      { id: "1-3", title: "1-3 運算子與表達式", duration: "18:20", completed: true },
      { id: "1-4", title: "1-4 條件判斷與迴圈", duration: "28:15", completed: false, current: true },
    ],
  },
  {
    id: "2",
    title: "第二章：資料結構",
    lessons: [
      { id: "2-1", title: "2-1 List 列表操作", duration: "25:00", completed: false },
      { id: "2-2", title: "2-2 Dictionary 字典", duration: "20:30", completed: false },
      { id: "2-3", title: "2-3 Tuple 與 Set", duration: "18:45", completed: false },
    ],
  },
  {
    id: "3",
    title: "第三章：函式與模組",
    lessons: [
      { id: "3-1", title: "3-1 函式定義與參數", duration: "24:00", completed: false },
      { id: "3-2", title: "3-2 Lambda 與內建函式", duration: "19:30", completed: false },
      { id: "3-3", title: "3-3 模組與套件管理", duration: "22:15", completed: false },
    ],
  },
];

const discussions = [
  { id: 1, user: "小明", time: "12:30", message: "請問這裡的 for 迴圈可以用 while 替代嗎？", replies: 3 },
  { id: 2, user: "阿華", time: "18:45", message: "老師講解得很清楚！終於理解 break 和 continue 的差別了", replies: 1 },
];

export default function CoursePlayer() {
  const [expandedChapters, setExpandedChapters] = useState<string[]>(["1"]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLesson] = useState("1-4");

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Left: Chapter List */}
      <div className="w-72 flex-shrink-0 bg-card rounded-lg border border-border overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">課程章節</h2>
          <Progress value={30} className="h-1.5 mt-2" />
          <p className="text-xs text-muted-foreground mt-1">已完成 3/10 單元</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="border-b border-border last:border-0">
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium text-foreground text-left">
                  {chapter.title}
                </span>
                {expandedChapters.includes(chapter.id) ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {expandedChapters.includes(chapter.id) && (
                <div className="pb-2">
                  {chapter.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-muted/50 transition-colors",
                        lesson.current && "bg-primary/10"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                        lesson.completed ? "bg-success text-white" : 
                        lesson.current ? "bg-primary text-white" : "bg-muted"
                      )}>
                        {lesson.completed ? (
                          <Check className="h-3 w-3" />
                        ) : lesson.current ? (
                          <Play className="h-3 w-3" />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm truncate",
                          lesson.current ? "text-primary font-medium" : "text-foreground"
                        )}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center: Video Player */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Video */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop"
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="xl"
              variant="hero"
              className="rounded-full w-16 h-16"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
            </Button>
          </div>
          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <Progress value={45} className="h-1 mb-3" />
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <span className="text-sm">12:30 / 28:15</span>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Volume2 className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  1x
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Settings className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="mt-4">
          <h1 className="text-xl font-bold text-foreground">1-4 條件判斷與迴圈</h1>
          <p className="text-muted-foreground mt-1">
            學習 if-else 條件判斷、for 迴圈、while 迴圈，以及 break、continue 的使用
          </p>
        </div>

        {/* Discussion */}
        <div className="mt-4 flex-1 bg-card rounded-lg border border-border p-4 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">影片討論</h3>
            <span className="text-sm text-muted-foreground">({discussions.length})</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {discussions.map((d) => (
              <div key={d.id} className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-foreground">{d.user}</span>
                  <span className="text-xs text-muted-foreground">@ {d.time}</span>
                </div>
                <p className="text-sm text-foreground">{d.message}</p>
                <button className="text-xs text-primary mt-2">{d.replies} 則回覆</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea placeholder="在此時間點提問..." className="resize-none h-10" />
            <Button variant="cta">發送</Button>
          </div>
        </div>
      </div>

      {/* Right: Notes & Contact Book */}
      <div className="w-80 flex-shrink-0 bg-card rounded-lg border border-border overflow-hidden">
        <Tabs defaultValue="notes" className="h-full flex flex-col">
          <TabsList className="w-full rounded-none border-b border-border h-12 bg-transparent">
            <TabsTrigger value="notes" className="flex-1 gap-2">
              <FileText className="h-4 w-4" />
              筆記
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex-1 gap-2">
              <BookOpen className="h-4 w-4" />
              聯絡簿
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="flex-1 p-4 mt-0 overflow-y-auto">
            <Tabs defaultValue="personal" className="h-full flex flex-col">
              <TabsList className="w-full h-9">
                <TabsTrigger value="personal" className="flex-1 text-xs">個人筆記</TabsTrigger>
                <TabsTrigger value="shared" className="flex-1 text-xs">共筆</TabsTrigger>
                <TabsTrigger value="ai" className="flex-1 text-xs">AI 摘要</TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="flex-1 mt-4">
                <Textarea 
                  placeholder="在這裡記錄你的學習心得..." 
                  className="h-full min-h-[300px] resize-none"
                />
              </TabsContent>
              <TabsContent value="shared" className="flex-1 mt-4">
                <div className="space-y-3">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">小華的筆記</span>
                      <span className="text-xs text-muted-foreground">3 天前</span>
                    </div>
                    <p className="text-sm text-muted-foreground">for 迴圈的 range() 函式有三個參數：start, stop, step...</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="ai" className="flex-1 mt-4">
                <Button variant="outline" className="w-full mb-4">
                  ✨ 生成 AI 摘要
                </Button>
                <div className="text-sm text-muted-foreground">
                  點擊上方按鈕，AI 將為您生成本單元的重點摘要
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="contact" className="flex-1 p-4 mt-0 overflow-y-auto space-y-4">
            {/* Homework */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">作業</span>
              </div>
              <p className="text-sm text-foreground mb-2">練習題：使用迴圈印出九九乘法表</p>
              <Button size="sm" variant="outline" className="w-full">上傳作業</Button>
            </div>

            {/* Teacher Message */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-cta" />
                <span className="font-medium text-sm">老師訊息</span>
                <span className="text-xs bg-cta text-cta-foreground px-1.5 py-0.5 rounded">新</span>
              </div>
              <p className="text-sm text-muted-foreground">
                下週將進行期中測驗，請同學們複習第一、二章的內容。
              </p>
            </div>

            {/* Quiz */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-success" />
                <span className="font-medium text-sm">單元測驗</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">完成測驗以解鎖下一單元</p>
              <Button size="sm" variant="cta" className="w-full">開始測驗</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
