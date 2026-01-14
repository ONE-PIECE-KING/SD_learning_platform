import { useState } from "react";
import { MessageSquare, FileText, CheckCircle, Clock, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Mock data
const courses = [
  { id: 1, name: "Python 資料分析入門" },
  { id: 2, name: "機器學習實戰" },
  { id: 3, name: "SQL 資料庫精通" },
];

const submissions = [
  { id: 1, student: "王小明", assignment: "第一章作業", date: "2024-01-15", status: "pending" },
  { id: 2, student: "李小華", assignment: "第二章作業", date: "2024-01-14", status: "pending" },
  { id: 3, student: "張大偉", assignment: "第一章作業", date: "2024-01-13", status: "graded" },
];

const discussions = [
  { id: 1, student: "陳小美", question: "請問這段程式碼的邏輯是什麼？", video: "1.2 變數與型別", time: "05:32", date: "2024-01-15" },
  { id: 2, student: "林小強", question: "這邊的迴圈可以用其他方式嗎？", video: "2.1 迴圈控制", time: "12:45", date: "2024-01-14" },
];

export default function TeacherContact() {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">老師聯絡簿</h1>
        <p className="text-muted-foreground mt-1">批改作業、回覆學生問題</p>
      </div>

      {/* Course Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            選擇課程
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {courses.map((course) => (
              <Button
                key={course.id}
                variant={selectedCourse.id === course.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCourse(course)}
              >
                {course.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="assignments" className="w-full">
        <TabsList>
          <TabsTrigger value="assignments" className="gap-2">
            <FileText className="h-4 w-4" />
            作業批改
            <Badge variant="destructive" className="ml-1">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="discussions" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            影片討論
            <Badge variant="secondary" className="ml-1">2</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="mt-6 space-y-4">
          {submissions.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{sub.student}</span>
                      <Badge variant={sub.status === "pending" ? "secondary" : "outline"}>
                        {sub.status === "pending" ? (
                          <><Clock className="h-3 w-3 mr-1" />待批改</>
                        ) : (
                          <><CheckCircle className="h-3 w-3 mr-1" />已批改</>
                        )}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{sub.assignment}</p>
                    <p className="text-xs text-muted-foreground">提交於 {sub.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">查看作業</Button>
                    {sub.status === "pending" && (
                      <Button variant="cta" size="sm">批改</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Discussions Tab */}
        <TabsContent value="discussions" className="mt-6 space-y-4">
          {discussions.map((disc) => (
            <Card key={disc.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{disc.student}</span>
                      <Badge variant="outline" className="text-xs">
                        {disc.video} @ {disc.time}
                      </Badge>
                    </div>
                    <p className="text-sm">{disc.question}</p>
                    <p className="text-xs text-muted-foreground">{disc.date}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Textarea placeholder="輸入你的回覆..." rows={2} />
                  <div className="flex justify-end">
                    <Button size="sm">送出回覆</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
