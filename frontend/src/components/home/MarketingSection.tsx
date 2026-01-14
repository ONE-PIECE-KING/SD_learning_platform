import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  TrendingDown, 
  Clock, 
  HelpCircle, 
  CheckCircle2,
  Quote,
  ArrowRight,
  Sparkles,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";

const painPoints = [
  {
    icon: TrendingDown,
    title: "薪水停滯不前",
    description: "傳統產業薪資天花板明顯，想突破卻不知從何開始？",
  },
  {
    icon: Clock,
    title: "自學效率低落",
    description: "網路資源多如牛毛，但缺乏系統性學習，總是半途而廢？",
  },
  {
    icon: HelpCircle,
    title: "轉職方向迷茫",
    description: "想進入資料科學領域，但不知道該學什麼、怎麼準備？",
  },
];

const solutions = [
  "系統化的學習路徑，從入門到進階一步到位",
  "業界講師親授，學習最實用的技能",
  "實戰專案練習，累積作品集",
  "社群支持 + 一對一諮詢，不再孤軍奮戰",
];

const testimonials = [
  {
    id: 1,
    name: "王小明",
    role: "前：行政助理 → 現：資料分析師",
    company: "知名電商公司",
    content: "從完全不會寫程式到成功轉職，只花了 6 個月！桑尼老師的課程讓我找到了職涯新方向。",
    achievement: "薪水成長 50%",
  },
  {
    id: 2,
    name: "李雅婷",
    role: "前：業務專員 → 現：機器學習工程師",
    company: "AI 新創公司",
    content: "一對一諮詢讓我快速了解產業需求，精準準備面試，順利拿到理想 offer！",
    achievement: "成功進入 AI 產業",
  },
  {
    id: 3,
    name: "張志豪",
    role: "前：製造業工程師 → 現：資深數據科學家",
    company: "國際科技大廠",
    content: "課程內容非常紮實，專案作業幫我累積了豐富的作品集，面試時大大加分。",
    achievement: "年薪破百萬",
  },
];

const MarketingSection = () => {
  return (
    <section className="bg-background">
      {/* Pain Points */}
      <div className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-cta/30 text-cta">
              <Target className="mr-2 h-3 w-3" />
              你也有這些困擾嗎？
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              我們理解你的焦慮
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {painPoints.map((point, index) => (
              <Card
                key={index}
                className="border-border/50 bg-card transition-all duration-300 hover:border-destructive/30"
              >
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <point.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-card-foreground">
                      {point.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {point.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Solutions */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <Badge className="mb-4 bg-success/10 text-success hover:bg-success/20">
                  <Sparkles className="mr-2 h-3 w-3" />
                  解決方案
                </Badge>
                <h3 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
                  桑尼資料科學，你的轉職最佳夥伴
                </h3>
                <ul className="space-y-4">
                  {solutions.map((solution, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                      <span className="text-muted-foreground">{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="h-64 w-64 rounded-full bg-gradient-to-br from-accent/20 to-success/20 blur-3xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-2xl bg-card p-8 shadow-xl">
                      <p className="text-center text-4xl font-bold text-accent">95%</p>
                      <p className="mt-2 text-center text-sm text-muted-foreground">
                        學員滿意度
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonial-gradient py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">
              學長姐真心話
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              他們都成功轉職了
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              超過 10,000+ 學員的成功見證，你也可以是下一個
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className="relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 card-shadow hover:card-shadow-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <Quote className="mb-4 h-8 w-8 text-accent/30" />
                  <p className="mb-6 text-muted-foreground">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="mb-4 border-t border-border/50 pt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-lg font-bold text-secondary-foreground">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-card-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mb-3 text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                  
                  <Badge className="bg-success/10 text-success hover:bg-success/20">
                    🎉 {testimonial.achievement}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="hero-gradient py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl">
              準備好開始你的資料科學之旅了嗎？
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/80">
              加入超過 10,000+ 學員的行列，讓我們一起實現職涯夢想
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/courses">
                <Button variant="hero" size="xl" className="w-full gap-2 sm:w-auto">
                  立即開始學習
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                預約免費諮詢
              </Button>
            </div>

            {/* Newsletter */}
            <div className="rounded-2xl bg-primary-foreground/10 p-6 backdrop-blur-sm md:p-8">
              <div className="mb-4 flex items-center justify-center gap-2">
                <Mail className="h-5 w-5 text-primary-foreground" />
                <h3 className="text-lg font-semibold text-primary-foreground">
                  訂閱電子報
                </h3>
              </div>
              <p className="mb-6 text-sm text-primary-foreground/70">
                獲取最新課程優惠、技術文章、職涯資訊，每週精選直送信箱
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Input
                  type="email"
                  placeholder="輸入你的 Email"
                  className="h-12 w-full border-0 bg-background/95 text-foreground placeholder:text-muted-foreground sm:max-w-xs"
                />
                <Button variant="cta" size="lg">
                  免費訂閱
                </Button>
              </div>
              <p className="mt-4 text-xs text-primary-foreground/50">
                我們尊重你的隱私，隨時可以取消訂閱
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingSection;
