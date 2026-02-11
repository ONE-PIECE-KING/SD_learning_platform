import { DollarSign, BookOpen, Compass, Clock, Check } from 'lucide-react';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import './PainPointsSolutions.css';

/**
 * 痛點與解決方案
 * 5.1 痛點呈現（2x2 網格）+ 5.2 解決方案
 */

const PAIN_POINTS = [
    {
        icon: DollarSign,
        title: '薪水停滯不前',
        desc: '傳統產業薪資天花板明顯，想突破卻不知從何開始？',
    },
    {
        icon: BookOpen,
        title: '自學效率低落',
        desc: '網路資源多如牛毛，但缺乏系統性學習，總是半途而廢？',
    },
    {
        icon: Compass,
        title: '轉職方向迷茫',
        desc: '想進入資料科學領域，但不知道該學什麼、怎麼準備？',
    },
    {
        icon: Clock,
        title: '時間不夠用',
        desc: '邊工作邊學習，找不到有效率的學習節奏？',
    },
];

const SOLUTIONS = [
    '系統化的學習路徑，從入門到進階一步到位',
    '業界講師親授，學習最實用的技能',
    '實戰專案練習，累積作品集',
    '社群支持 + 一對一諮詢，不再孤軍奮戰',
];

export default function PainPointsSolutions() {
    const painRef = useScrollAnimation();
    const solutionRef = useScrollAnimation();

    return (
        <section className="pain-solutions section" id="pain-solutions">
            <div className="container">
                {/* 痛點 */}
                <div className="pain-section">
                    <div className="section-header animate-on-scroll" ref={painRef}>
                        <h2 className="section-title">我們理解你的焦慮</h2>
                        <p className="section-subtitle">你也有這些困擾嗎？</p>
                    </div>

                    <div className="pain-grid">
                        {PAIN_POINTS.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="pain-card">
                                <div className="pain-card-icon">
                                    <Icon size={24} />
                                </div>
                                <div className="pain-card-content">
                                    <h3 className="pain-card-title">{title}</h3>
                                    <p className="pain-card-desc">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 解決方案 */}
                <div className="solution-section">
                    <div className="section-header animate-on-scroll" ref={solutionRef}>
                        <h2 className="section-title">桑尼資料科學，你的轉職最佳夥伴</h2>
                        <p className="section-subtitle">我們的解決方案</p>
                    </div>

                    <div className="solution-content">
                        <div className="solution-list">
                            {SOLUTIONS.map((sol) => (
                                <div key={sol} className="solution-item">
                                    <div className="solution-item-icon">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    <span>{sol}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
