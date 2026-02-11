import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import TrustBadgeBar from '../components/home/TrustBadgeBar';
import FeaturedCourses from '../components/home/FeaturedCourses';
import MainServices from '../components/home/MainServices';
import PainPointsSolutions from '../components/home/PainPointsSolutions';
import Testimonials from '../components/home/Testimonials';
import FinalCTA from '../components/home/FinalCTA';
import './HomePage.css';

/**
 * 首頁 — 組合所有區塊
 * Hero → 信任徽章 → 主推課程 → 主要服務 → 痛點解方 → 社會證明 → Final CTA
 */
export default function HomePage() {
    return (
        <div className="homepage">
            <Header />

            <main>
                <HeroSection />
                <TrustBadgeBar />
                <FeaturedCourses />
                <MainServices />
                <PainPointsSolutions />
                <Testimonials />
                <FinalCTA />
            </main>

            <Footer />
        </div>
    );
}
