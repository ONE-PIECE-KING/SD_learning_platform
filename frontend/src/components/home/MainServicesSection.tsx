import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, Video, UserCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    id: "consult",
    icon: MessageCircle,
    title: "一對一諮詢",
    description: "與資料科學專家深度對談，解決學習盲點、職涯規劃、專案卡關等問題。",
    features: ["客製化指導", "即時問答", "專業建議"],
    href: "/consult",
    color: "from-accent/20 to-accent/5",
    iconBg: "bg-accent/10 text-accent",
  },
  {
    id: "mock-interview",
    icon: Video,
    title: "模擬面試",
    description: "模擬真實面試情境，由業界前輩提供專業回饋，大幅提升面試成功率。",
    features: ["實戰演練", "即時回饋", "面試技巧"],
    href: "/consult",
    color: "from-cta/20 to-cta/5",
    iconBg: "bg-cta/10 text-cta",
  },
  {
    id: "career-coaching",
    icon: UserCheck,
    title: "職涯教練",
    description: "從履歷健檢到 offer 談判，全方位陪伴你的轉職之路。",
    features: ["履歷優化", "職涯規劃", "薪資談判"],
    href: "/consult",
    color: "from-success/20 to-success/5",
    iconBg: "bg-success/10 text-success",
  },
];

const MainServicesSection = () => {
  return (
    <section className="bg-secondary/30 py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
            專業服務
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            不只是課程，更是你的學習夥伴
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            除了優質課程內容，我們還提供一對一的專業服務，
            <br className="hidden md:block" />
            讓你的學習之路不再孤單
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <Card
              key={service.id}
              className="group relative overflow-hidden border-0 bg-card transition-all duration-300 hover:-translate-y-2 card-shadow hover:card-shadow-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              
              <CardHeader className="relative pb-4">
                <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl ${service.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground">
                  {service.title}
                </h3>
              </CardHeader>

              <CardContent className="relative">
                <p className="mb-6 text-muted-foreground">
                  {service.description}
                </p>

                <ul className="mb-6 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link to={service.href}>
                  <Button variant="outline" className="w-full gap-2 group-hover:border-accent group-hover:text-accent">
                    了解更多
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-muted-foreground">
            想要了解更多服務內容？
          </p>
          <Link to="/consult">
            <Button variant="cta" size="lg" className="gap-2">
              立即預約諮詢
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MainServicesSection;
