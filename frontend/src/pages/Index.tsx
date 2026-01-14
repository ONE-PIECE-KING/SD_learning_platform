import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import MainCourseSection from "@/components/home/MainCourseSection";
import MainServicesSection from "@/components/home/MainServicesSection";
import MarketingSection from "@/components/home/MarketingSection";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <MainCourseSection />
        <MainServicesSection />
        <MarketingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
