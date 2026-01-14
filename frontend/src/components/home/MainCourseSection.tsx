import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  duration: string;
  students: number;
  rating: number;
  level: "入門" | "進階" | "專業";
  category: string;
  image?: string;
}

const featuredCourses: Course[] = [
  {
    id: "python-intro",
    title: "Python 程式設計入門",
    description: "從零開始學習 Python，掌握程式設計基礎，為資料科學之路打下紮實基礎。",
    instructor: "桑尼老師",
    price: 1990,
    originalPrice: 2990,
    duration: "12 小時",
    students: 3240,
    rating: 4.9,
    level: "入門",
    category: "Python",
  },
  {
    id: "ml-practice",
    title: "機器學習實戰工作坊",
    description: "透過實際專案學習機器學習演算法，從理論到實作完整掌握 ML 核心技能。",
    instructor: "Dr. 資料王",
    price: 3990,
    originalPrice: 5990,
    duration: "24 小時",
    students: 1850,
    rating: 4.8,
    level: "進階",
    category: "機器學習",
  },
  {
    id: "data-viz",
    title: "資料視覺化大師班",
    description: "使用 Python 製作專業級圖表，讓數據說話，打造具有說服力的商業報告。",
    instructor: "Visual Chen",
    price: 2490,
    originalPrice: 3490,
    duration: "8 小時",
    students: 2100,
    rating: 4.7,
    level: "入門",
    category: "資料視覺化",
  },
  {
    id: "deep-learning",
    title: "深度學習與神經網路",
    description: "深入了解 CNN、RNN、Transformer 等深度學習架構，實作 AI 應用專案。",
    instructor: "AI 博士",
    price: 4990,
    duration: "30 小時",
    students: 980,
    rating: 4.9,
    level: "專業",
    category: "深度學習",
  },
];

const levelColors = {
  入門: "bg-success/10 text-success hover:bg-success/20",
  進階: "bg-accent/10 text-accent hover:bg-accent/20",
  專業: "bg-cta/10 text-cta hover:bg-cta/20",
};

const MainCourseSection = () => {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">
            主推課程
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            最受歡迎的資料科學課程
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            精選業界最實用的課程內容，由資深講師親授，幫助你快速掌握核心技能
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredCourses.map((course, index) => (
            <Card
              key={course.id}
              className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 card-shadow hover:card-shadow-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Course Image Placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-secondary to-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">課程封面圖</span>
                </div>
                <Badge className={`absolute left-3 top-3 ${levelColors[course.level]}`}>
                  {course.level}
                </Badge>
                {course.originalPrice && (
                  <Badge className="absolute right-3 top-3 bg-cta text-cta-foreground">
                    限時優惠
                  </Badge>
                )}
              </div>

              <CardHeader className="pb-2">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {course.category}
                  </Badge>
                </div>
                <h3 className="line-clamp-2 text-lg font-semibold text-card-foreground group-hover:text-accent transition-colors">
                  {course.title}
                </h3>
              </CardHeader>

              <CardContent className="pb-4">
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {course.description}
                </p>
                
                <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.students.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-cta text-cta" />
                    {course.rating}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  講師：{course.instructor}
                </p>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t border-border/50 pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">
                    NT$ {course.price.toLocaleString()}
                  </span>
                  {course.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      NT$ {course.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <Button variant="cta" size="sm">
                  查看課程
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-12 text-center">
          <Link to="/courses">
            <Button variant="outline" size="lg" className="gap-2">
              查看所有課程
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MainCourseSection;
