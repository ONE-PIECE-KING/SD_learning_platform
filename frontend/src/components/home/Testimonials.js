import { Star } from 'lucide-react';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import './Testimonials.css';

/**
 * 社會證明 — 學員見證
 * 3 張見證卡片並排
 */

const TESTIMONIALS = [
    {
        id: 1,
        name: '王小明',
        initial: '王',
        previousRole: '前傳產業務',
        rating: 5,
        text: '原本對程式完全零基礎，透過桑尼的系統化課程，三個月內完成資料分析專案，成功拿到數據分析師的 offer。',
        achievement: '成功轉職 — 資料分析師',
    },
    {
        id: 2,
        name: '林佳慧',
        initial: '林',
        previousRole: '前行政人員',
        rating: 5,
        text: '一對一諮詢讓我釐清了轉職方向，模擬面試更是讓我面試時信心大增。推薦給所有想轉職的朋友！',
        achievement: '成功轉職 — ML 工程師',
    },
    {
        id: 3,
        name: '陳建宏',
        initial: '陳',
        previousRole: '前軟體工程師',
        rating: 5,
        text: '已經有程式基礎，但透過課程學到很多資料科學的實務技巧，加薪幅度超過 40%。課程物超所值！',
        achievement: '成功升遷 — 資深數據工程師',
    },
];

export default function Testimonials() {
    const ref = useScrollAnimation();

    return (
        <section className="testimonials section" id="testimonials">
            <div className="container">
                <div className="section-header animate-on-scroll" ref={ref}>
                    <h2 className="section-title">他們都成功轉職了</h2>
                    <p className="section-subtitle">學長姐真心話</p>
                </div>

                <div className="testimonials-grid">
                    {TESTIMONIALS.map(({ id, name, initial, previousRole, rating, text, achievement }) => (
                        <div key={id} className="testimonial-card">
                            <div className="testimonial-avatar">
                                {initial}
                            </div>
                            <h3 className="testimonial-name">{name}</h3>
                            <p className="testimonial-role">{previousRole}</p>
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        fill={i < rating ? '#F59E0B' : 'none'}
                                        strokeWidth={i < rating ? 0 : 1.5}
                                    />
                                ))}
                            </div>
                            <p className="testimonial-text">「{text}」</p>
                            <span className="testimonial-tag">{achievement}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
