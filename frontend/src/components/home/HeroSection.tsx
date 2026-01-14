import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Play, TrendingUp, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="hero-gradient relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cta/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-60 w-60 rounded-full bg-primary-foreground/5 blur-2xl" />
      </div>

      <div className="container relative py-20 md:py-28 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground/90">
              <TrendingUp className="h-4 w-4" />
              <span>2024 最受歡迎的資料科學課程平台</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-black leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
              掌握 Python & AI
              <br />
              <span className="text-gradient">開啟資料科學職涯</span>
            </h1>
            
            <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
              從零基礎到實戰，由業界專家帶你進入數據的殿堂。
              <br className="hidden md:block" />
              超過 10,000+ 學員成功轉職，你也可以！
            </p>

            {/* Search Bar */}
            <div className="mb-8 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="搜尋課程，例如：Python、機器學習、資料視覺化..."
                  className="h-14 rounded-xl border-0 bg-background/95 pl-12 text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
              <Button variant="hero" size="xl" className="gap-2">
                <Search className="h-5 w-5" />
                搜尋
              </Button>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button variant="hero" size="xl" className="gap-2">
                <Play className="h-5 w-5" />
                免費試看課程
              </Button>
              <Button variant="heroOutline" size="xl">
                訂閱電子報
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap justify-center gap-8 lg:justify-start">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-foreground">50+</div>
                <div className="text-sm text-primary-foreground/60">專業課程</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-foreground">10,000+</div>
                <div className="text-sm text-primary-foreground/60">學員人數</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-foreground">95%</div>
                <div className="text-sm text-primary-foreground/60">滿意度</div>
              </div>
            </div>
          </div>

          {/* Hero Illustration Placeholder */}
          <div className="hidden lg:flex lg:justify-end">
            <div className="relative animate-float">
              <div className="h-[400px] w-[400px] rounded-3xl bg-gradient-to-br from-accent/20 to-cta/20 p-8 backdrop-blur-sm">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm">
                  <Users className="mb-4 h-20 w-20 text-primary-foreground/60" />
                  <p className="text-center text-primary-foreground/80">
                    Hero 區域插圖
                    <br />
                    <span className="text-sm text-primary-foreground/60">可放置學習情境圖</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
