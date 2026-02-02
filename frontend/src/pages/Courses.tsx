import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    Search,
    Filter,
    BookOpen,
    Star,
    Users,
    Clock,
    Loader2,
    ChevronRight,
    LayoutGrid,
    List,
    Sparkles
} from "lucide-react";

interface Course {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    price: number;
    thumbnail_url?: string;
    category: string;
    average_rating: number | null;
    total_enrollments: number;
    total_duration: number;
    total_videos: number;
}

const CATEGORIES = [
    { id: "ALL", label: "全部課程" },
    { id: "SOFTWARE_DEV", label: "軟體開發" },
    { id: "DATA_SCIENCE", label: "資料科學" },
    { id: "DESIGN", label: "設計" },
    { id: "MARKETING", label: "行銷" },
    { id: "BUSINESS", label: "商業" },
    { id: "OTHER", label: "其他" },
];

const Courses = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "ALL";
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [localSearch, setLocalSearch] = useState(search);

    // Sync local search with URL param
    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    const { data, isLoading } = useQuery({
        queryKey: ["courses", search, category],
        queryFn: async () => {
            let url = `http://localhost:8000/api/v1/courses?limit=20`;
            if (search) url += `&search=${encodeURIComponent(search)}`;
            if (category && category !== "ALL") url += `&category=${encodeURIComponent(category)}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch courses");
            return response.json();
        },
    });

    const courses: Course[] = data?.items || [];

    const handleCategoryChange = (catId: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (catId === "ALL") {
            newParams.delete("category");
        } else {
            newParams.set("category", catId);
        }
        setSearchParams(newParams);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newParams = new URLSearchParams(searchParams);
        if (localSearch.trim()) {
            newParams.set("search", localSearch.trim());
        } else {
            newParams.delete("search");
        }
        setSearchParams(newParams);
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        return hours > 0 ? `${hours} 小時` : `${Math.floor(seconds / 60)} 分鐘`;
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Page Header / Search Banner */}
                <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
                    {/* Decorative Elements */}
                    <div className="absolute left-1/4 top-1/4 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
                    <div className="absolute right-1/4 bottom-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/5 blur-[120px]" />

                    <div className="container relative z-10">
                        <div className="flex flex-col items-center gap-6 text-center">
                            <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm font-medium">
                                <Sparkles className="h-3.5 w-3.5 text-primary" />
                                探索優質課程
                            </Badge>

                            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                                {search ? (
                                    <>搜尋：<span className="text-primary">"{search}"</span></>
                                ) : (
                                    "搜羅全球頂尖教育資源"
                                )}
                            </h1>

                            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
                                精選資料科學、人工智慧與商業分析課程，助你在數位時代脫穎而出。
                            </p>

                            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-2xl mt-8">
                                <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    className="h-16 w-full rounded-full border-none bg-background pl-14 pr-36 text-lg shadow-2xl focus-visible:ring-2 focus-visible:ring-primary/20"
                                    placeholder="搜尋感興趣的課程..."
                                    value={localSearch}
                                    onChange={(e) => setLocalSearch(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="absolute right-2 top-2 h-12 rounded-full px-8 bg-primary hover:bg-primary/90 transition-all hover:shadow-lg"
                                >
                                    搜尋
                                </Button>
                            </form>
                        </div>
                    </div>
                </section>

                <section className="container py-12">
                    <div className="flex flex-col gap-10 md:flex-row">
                        {/* Sidebar Filters */}
                        <aside className="w-full shrink-0 md:w-72">
                            <div className="sticky top-24 space-y-8">
                                <div>
                                    <h3 className="mb-5 flex items-center gap-2 text-lg font-bold">
                                        <Filter className="h-5 w-5 text-primary" />
                                        課程分類
                                    </h3>
                                    <div className="flex flex-col gap-1.5">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleCategoryChange(cat.id)}
                                                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all ${category === cat.id
                                                    ? "bg-primary text-primary-foreground shadow-md font-semibold"
                                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                                    }`}
                                            >
                                                {cat.label}
                                                {category === cat.id && <ChevronRight className="h-4 w-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 p-6">
                                    <div className="relative z-10">
                                        <h4 className="mb-2 font-bold text-primary">需要學習建議？</h4>
                                        <p className="mb-5 text-sm text-primary/70 leading-relaxed">
                                            找不到適合你的課程？聯絡我們的課程顧問，我們將為你量身打造學習路徑。
                                        </p>
                                        <Button variant="cta" size="sm" className="w-full shadow-sm">
                                            聯絡顧問
                                        </Button>
                                    </div>
                                    <Sparkles className="absolute -bottom-4 -right-4 h-24 w-24 text-primary/5" />
                                </div>
                            </div>
                        </aside>

                        {/* Course Grid / Results */}
                        <div className="flex-1">
                            {/* Toolbar */}
                            <div className="mb-8 flex items-center justify-between border-b border-border/50 pb-6">
                                <div>
                                    <h2 className="text-xl font-bold">課程列表</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        為您找到 <span className="font-semibold text-foreground">{courses.length}</span> 個相關課程
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-lg">
                                    <Button
                                        variant={viewMode === "grid" ? "background" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                        className={`h-9 w-9 p-0 ${viewMode === "grid" ? "bg-background shadow-sm" : ""}`}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "background" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                        className={`h-9 w-9 p-0 ${viewMode === "list" ? "bg-background shadow-sm" : ""}`}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex min-h-[500px] flex-col items-center justify-center gap-4">
                                    <div className="relative">
                                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                        </div>
                                    </div>
                                    <p className="font-medium text-muted-foreground">搜羅優質課程中...</p>
                                </div>
                            ) : courses.length > 0 ? (
                                <div className={viewMode === "grid"
                                    ? "grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                                    : "flex flex-col gap-6"
                                }>
                                    {courses.map((course) => (
                                        <Card
                                            key={course.id}
                                            className={`group overflow-hidden border-border/40 bg-card transition-all duration-300 hover:shadow-2xl hover:border-primary/20 ${viewMode === "list" ? "flex flex-col sm:flex-row sm:h-64" : "flex flex-col h-full"
                                                }`}
                                        >
                                            <Link
                                                to={`/member/course/${course.id}`}
                                                className={`relative overflow-hidden bg-secondary/20 ${viewMode === "list" ? "w-full sm:w-80 shrink-0 h-48 sm:h-full" : "aspect-[16/10]"
                                                    }`}
                                            >
                                                {course.thumbnail_url ? (
                                                    <img
                                                        src={course.thumbnail_url}
                                                        alt={course.title}
                                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted">
                                                        <BookOpen className="h-12 w-12 text-primary/20" />
                                                    </div>
                                                )}
                                                <Badge className="absolute left-4 top-4 bg-background/90 text-foreground backdrop-blur-md shadow-sm border-none font-medium">
                                                    {CATEGORIES.find(c => c.id === course.category)?.label || "其他"}
                                                </Badge>
                                            </Link>

                                            <div className="flex flex-1 flex-col p-6">
                                                <div className="flex-1">
                                                    <Link to={`/member/course/${course.id}`}>
                                                        <h3 className="line-clamp-2 text-xl font-bold group-hover:text-primary transition-colors leading-tight mb-2">
                                                            {course.title}
                                                        </h3>
                                                    </Link>
                                                    {course.subtitle && (
                                                        <p className="mb-4 line-clamp-1 text-sm text-muted-foreground leading-relaxed">
                                                            {course.subtitle}
                                                        </p>
                                                    )}

                                                    <div className="mb-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
                                                        <div className="flex items-center gap-1.5">
                                                            <Star className={`h-4 w-4 ${course.average_rating ? "fill-cta text-cta" : "text-muted-foreground"}`} />
                                                            <span className={course.average_rating ? "text-foreground" : ""}>
                                                                {course.average_rating ? course.average_rating.toFixed(1) : "全新上架"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Users className="h-4 w-4" />
                                                            <span>{course.total_enrollments.toLocaleString()} 位學員</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{formatDuration(course.total_duration)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end pt-4 border-t border-border/50">
                                                    <Link to={`/member/course/${course.id}`}>
                                                        <Button className="rounded-full px-6 font-bold shadow-sm hover:shadow-md transition-all active:scale-95">
                                                            立即探索
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex min-h-[450px] flex-col items-center justify-center gap-8 rounded-3xl border-2 border-dashed border-border/60 bg-secondary/5 p-12 text-center">
                                    <div className="relative">
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground animate-pulse">
                                            <Search className="h-12 w-12" />
                                        </div>
                                        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-sm">
                                            <Sparkles className="h-4 w-4 text-primary" />
                                        </div>
                                    </div>
                                    <div className="space-y-3 max-w-sm">
                                        <h3 className="text-2xl font-bold">未找到匹配課程</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            抱歉，我們目前沒有與 <span className="font-semibold text-foreground">"{search}"</span> 相關的課程。試著簡化關鍵字或探索其他熱門分類。
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="rounded-full px-8" onClick={() => {
                                            setLocalSearch("");
                                        }}>
                                            重設搜尋
                                        </Button>
                                        <Button className="rounded-full px-8" onClick={() => {
                                            setSearchParams({});
                                            setLocalSearch("");
                                            handleCategoryChange("ALL");
                                        }}>
                                            查看全部課程
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Courses;
