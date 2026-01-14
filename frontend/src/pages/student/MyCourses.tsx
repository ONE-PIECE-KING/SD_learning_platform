import { CourseCard } from "@/components/student/CourseCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Grid, List } from "lucide-react";
import { useState } from "react";

// Mock data
const mockCourses = [
  {
    id: "1",
    title: "Python 資料科學入門",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop",
    description: "從零開始學習 Python，掌握資料處理與分析的核心技能",
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
  },
  {
    id: "2",
    title: "機器學習實戰班",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop",
    description: "深入了解機器學習演算法，實作預測模型與分類器",
    progress: 30,
    totalLessons: 32,
    completedLessons: 10,
  },
  {
    id: "3",
    title: "資料視覺化大師班",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
    description: "使用 Matplotlib、Seaborn 製作專業圖表與互動儀表板",
    progress: 100,
    totalLessons: 18,
    completedLessons: 18,
  },
  {
    id: "4",
    title: "SQL 資料庫管理",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop",
    description: "學習 SQL 查詢語法與資料庫設計的最佳實踐",
    progress: 45,
    totalLessons: 20,
    completedLessons: 9,
  },
  {
    id: "5",
    title: "深度學習與神經網路",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop",
    description: "使用 TensorFlow 與 PyTorch 建立深度學習模型",
    progress: 10,
    totalLessons: 40,
    completedLessons: 4,
  },
  {
    id: "6",
    title: "商業數據分析",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
    description: "將數據轉化為商業洞察，支援決策制定",
    progress: 0,
    totalLessons: 16,
    completedLessons: 0,
  },
];

export default function MyCourses() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">我的課程</h1>
          <p className="text-muted-foreground mt-1">共 {mockCourses.length} 門課程</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground">進行中</p>
          <p className="text-2xl font-bold text-foreground mt-1">4</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground">已完成</p>
          <p className="text-2xl font-bold text-success mt-1">1</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground">尚未開始</p>
          <p className="text-2xl font-bold text-muted-foreground mt-1">1</p>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCourses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <Button variant="outline" size="icon" disabled>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="default" size="icon">1</Button>
        <Button variant="outline" size="icon">2</Button>
        <Button variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
