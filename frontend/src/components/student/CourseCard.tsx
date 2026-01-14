import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  id: string;
  title: string;
  image: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

export function CourseCard({
  id,
  title,
  image,
  description,
  progress,
  totalLessons,
  completedLessons,
}: CourseCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button variant="hero" size="lg" className="gap-2" asChild>
            <Link to={`/member/course/${id}`}>
              <Play className="h-5 w-5" />
              繼續學習
            </Link>
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">學習進度</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            已完成 {completedLessons} / {totalLessons} 單元
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
