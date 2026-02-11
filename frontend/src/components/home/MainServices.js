import { Link } from 'react-router-dom';
import { Users, Mic, ArrowRight } from 'lucide-react';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import './MainServices.css';

/**
 * 主要服務 — 一對一諮詢 + 模擬面試
 */

const SERVICES = [
    {
        icon: Users,
        title: '轉職戰略諮詢',
        description: '60 分鐘深度對談，畫出你的 90 天轉職藍圖。由業界資深導師一對一陪你分析現況、規劃學習路徑與求職策略。',
        link: '/consult',
    },
    {
        icon: Mic,
        title: '資料職缺模擬面試',
        description: '實戰演練，提前熟悉面試流程與常見問題。從技術題到行為題，全方位模擬，讓你面試不再緊張。',
        link: '/consult',
    },
];

export default function MainServices() {
    const ref = useScrollAnimation();

    return (
        <section className="main-services section" id="main-services">
            <div className="container">
                <div className="section-header animate-on-scroll" ref={ref}>
                    <h2 className="section-title">不只是課程，更是你的學習夥伴</h2>
                    <p className="section-subtitle">
                        除了優質課程內容，我們還提供一對一的專業服務，讓你的學習之路不再孤單
                    </p>
                </div>

                <div className="services-grid">
                    {SERVICES.map(({ icon: Icon, title, description, link }) => (
                        <div key={title} className="service-card">
                            <div className="service-card-icon">
                                <Icon size={28} />
                            </div>
                            <h3 className="service-card-title">{title}</h3>
                            <p className="service-card-desc">{description}</p>
                            <Link to={link} className="service-card-link">
                                了解更多
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="services-cta">
                    <Link to="/consult" className="btn btn-md btn-primary">
                        立即預約諮詢
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
