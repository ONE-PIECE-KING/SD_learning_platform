import { BarChart3, TrendingUp, Users, DollarSign, BookOpen, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock data for charts
const monthlyData = [
  { month: "1月", sales: 12 },
  { month: "2月", sales: 19 },
  { month: "3月", sales: 15 },
  { month: "4月", sales: 25 },
  { month: "5月", sales: 32 },
  { month: "6月", sales: 28 },
];

const courseStats = [
  { name: "Python 資料分析入門", students: 156, revenue: 312000, rating: 4.8 },
  { name: "機器學習實戰", students: 89, revenue: 267000, rating: 4.9 },
  { name: "SQL 資料庫精通", students: 234, revenue: 351000, rating: 4.7 },
];

export default function Statistics() {
  const totalStudents = courseStats.reduce((sum, c) => sum + c.students, 0);
  const totalRevenue = courseStats.reduce((sum, c) => sum + c.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">統計分析</h1>
          <p className="text-muted-foreground mt-1">查看你的課程銷售與學生數據</p>
        </div>
        <Button variant="cta" asChild>
          <Link to="/member/course-upload">
            上架新課程
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">總學生數</p>
                <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <ArrowUpRight className="h-4 w-4" />
              <span>+12% 較上月</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">總收入</p>
                <p className="text-2xl font-bold text-foreground">NT$ {(totalRevenue / 1000).toFixed(0)}K</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <ArrowUpRight className="h-4 w-4" />
              <span>+8% 較上月</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已上架課程</p>
                <p className="text-2xl font-bold text-foreground">{courseStats.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">本月銷售</p>
                <p className="text-2xl font-bold text-foreground">28</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-cta/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-cta" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            本月購課趨勢
          </CardTitle>
          <CardDescription>近 6 個月的課程銷售數量</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-primary/80 rounded-t-md transition-all hover:bg-primary"
                  style={{ height: `${(data.sales / 35) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">{data.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>已上架課程</CardTitle>
          <CardDescription>各課程的銷售與評價統計</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">課程名稱</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">學生數</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">總收入</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">評價</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {courseStats.map((course, idx) => (
                  <tr key={idx} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 font-medium">{course.name}</td>
                    <td className="py-3 px-4 text-right">{course.students}</td>
                    <td className="py-3 px-4 text-right">NT$ {course.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-cta">★ {course.rating}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm">更新課程</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
