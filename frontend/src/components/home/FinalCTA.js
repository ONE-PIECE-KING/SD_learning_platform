import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import './FinalCTA.css';

/**
 * Final CTA — 最終行動呼籲
 * 品牌漸層背景 + 雙 CTA
 */
export default function FinalCTA() {
    const ref = useScrollAnimation();
    const navigate = useNavigate();

    return (
        <section className="final-cta" id="final-cta">
            <div className="final-cta-glow" aria-hidden="true" />

            <div className="final-cta-content container animate-on-scroll" ref={ref}>
                <h2 className="final-cta-title">
                    準備好開始你的<br />資料科學之旅了嗎？
                </h2>
                <p className="final-cta-subtitle">
                    加入我們，一起實現職涯夢想
                </p>

                <div className="final-cta-buttons">
                    <button className="final-cta-primary" onClick={() => { }}>
                        <BookOpen size={20} />
                        免費領取轉職手冊
                    </button>
                    <button className="final-cta-secondary" onClick={() => navigate('/courses')}>
                        瀏覽所有課程
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}
