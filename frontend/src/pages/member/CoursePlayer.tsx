import { useState } from "react";
import { Play, ChevronRight, MessageSquare, FileText, Book, Sparkles, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock data
const chapters = [
  {
    id: 1,
    title: "第一章：Python 基礎",
    lessons: [
      { id: 1, title: "1.1 環境安裝", duration: "10:30", completed: true },
      { id: 2, title: "1.2 變數與型別", duration: "15:45", completed: true },
      { id: 3, title: "1.3 運算子", duration: "12:20", completed: false, current: true },
      { id: 4, title: "1.4 條件判斷", duration: "18:10", completed: false },
    ],
  },
  {
    id: 2,
    title: "第二章：資料結構",
    lessons: [
      { id: 5, title: "2.1 串列 List", duration: "20:00", completed: false },
      { id: 6, title: "2.2 字典 Dictionary", duration: "22:30", completed: false },
    ],
  },
];

const discussions = [
  { id: 1, user: "王小明", time: "05:32", content: "請問這邊為什麼要用 int 而不是 float？", replies: 2 },
  { id: 2, user: "李小華", time: "12:45", content: "老師請問這個概念在實務上怎麼應用？", replies: 1 },
];

export default function MemberCoursePlayer() {
  const [selectedLesson, setSelectedLesson] = useState(chapters[0].lessons[2]);

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Left: Chapter List */}
      <div className="w-72 flex-shrink-0 bg-card border border-border rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">課程章節</h2>
          <Progress value={25} className="mt-2 h-2" />
          <p className="text-xs text-muted-foreground mt-1">已完成 25%</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {chapters.map((chapter) => (
            <div key={chapter.id}>
              <h3 className="text-sm font-medium text-foreground px-2 py-1">{chapter.title}</h3>
              <div className="space-y-1">
                {chapter.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                      lesson.current
                        ? "bg-primary text-primary-foreground"
                        : lesson.completed
                        ? "text-muted-foreground hover:bg-muted"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {lesson.completed ? (
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <Play className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="flex-1 truncate">{lesson.title}</span>
                    <span className="text-xs opacity-70">{lesson.duration}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center: Video Player */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Video Area */}
        <div className="bg-secondary rounded-lg aspect-video flex items-center justify-center mb-4">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Play className="h-10 w-10 text-primary" />
            </div>
            <p className="text-foreground font-medium">{selectedLesson.title}</p>
            <p className="text-muted-foreground text-sm">{selectedLesson.duration}</p>
          </div>
        </div>

        {/* Video Discussion */}
        <Card className="flex-1 overflow-hidden flex flex-col">
          <CardHeader className="py-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              影片討論串
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-3">
            {discussions.map((disc) => (
              <div key={disc.id} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{disc.user}</span>
                  <span className="text-xs text-muted-foreground">@ {disc.time}</span>
                </div>
                <p className="text-sm text-foreground">{disc.content}</p>
                <Button variant="ghost" size="sm" className="mt-1 text-xs">
                  查看 {disc.replies} 則回覆 <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CardContent>
          <div className="p-3 border-t border-border flex gap-2">
            <Textarea placeholder="在此時間點提問..." rows={1} className="resize-none" />
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Right: Notes & Contact */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-4">
        <Tabs defaultValue="notes" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notes" className="gap-1">
              <FileText className="h-4 w-4" />
              筆記
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-1">
              <Book className="h-4 w-4" />
              聯絡簿
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="flex-1 mt-4">
            <Card className="h-full flex flex-col">
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">個人筆記</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Sparkles className="h-4 w-4" />
                    AI 摘要
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <Textarea 
                  placeholder="在這裡記錄你的學習筆記..." 
                  className="h-full resize-none"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="flex-1 mt-4">
            <Card className="h-full">
              <CardContent className="p-4 space-y-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">作業</p>
                  <p className="text-xs text-muted-foreground">尚無指派作業</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">老師訊息</p>
                  <p className="text-xs text-muted-foreground">暫無新訊息</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">測驗</p>
                  <p className="text-xs text-muted-foreground">尚無測驗</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
