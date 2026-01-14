import { BookOpen, Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { CourseCard } from "@/components/student/CourseCard";

// Mock data
const courses = [
  {
    id: "1",
    title: "Python 資料分析入門",
    description: "從零開始學習 Python 資料分析，掌握 Pandas、NumPy 等核心工具",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop",
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
  },
  {
    id: "2",
    title: "機器學習實戰",
    description: "深入了解機器學習演算法，實作預測模型",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop",
    progress: 30,
    totalLessons: 32,
    completedLessons: 10,
  },
  {
    id: "3",
    title: "SQL 資料庫精通",
    description: "從基礎到進階的 SQL 查詢技巧",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop",
    progress: 100,
    totalLessons: 18,
    completedLessons: 18,
  },
];

export default function MemberMyCourses() {
  const totalCourses = courses.length;
  const completedCourses = courses.filter((c) => c.progress === 100).length;
  const totalHours = 48;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">我的課程</h1>
        <p className="text-muted-foreground mt-1">繼續你的學習旅程</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalCourses}</p>
            <p className="text-sm text-muted-foreground">已購課程</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
            <Award className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{completedCourses}</p>
            <p className="text-sm text-muted-foreground">已完成課程</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-cta/10 flex items-center justify-center">
            <Clock className="h-6 w-6 text-cta" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalHours}h</p>
            <p className="text-sm text-muted-foreground">總學習時數</p>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  );
}
