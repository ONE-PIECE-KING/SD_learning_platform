import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, BookOpen } from 'lucide-react';
import './HeroSection.css';

/**
 * Hero Section — 品牌主視覺
 * 深色科技感漸層 + 網格裝飾 + SearchBar + 雙 CTA
 */
export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <section className="hero" id="hero">
            {/* 背景裝飾 */}
            <div className="hero-grid-bg" aria-hidden="true" />
            <div className="hero-glow" aria-hidden="true" />
            <div className="hero-glow-2" aria-hidden="true" />

            <div className="hero-content">
                <h1 className="hero-title">
                    掌握 Python & AI，<br />開啟你的資料科學職涯。
                </h1>
                <p className="hero-subtitle">
                    從零基礎到實戰，由業界專家帶你進入數據的殿堂。
                </p>

                {/* 搜尋列 */}
                <form className="hero-searchbar" onSubmit={handleSearch}>
                    <span className="hero-searchbar-icon">
                        <Search size={20} />
                    </span>
                    <input
                        type="text"
                        placeholder="搜尋課程，例如：Python、機器學習..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="搜尋課程"
                    />
                    <button type="submit" className="hero-searchbar-btn">
                        搜尋
                    </button>
                </form>

                {/* CTA 按鈕組 */}
                <div className="hero-cta-group">
                    <button className="hero-cta-primary" onClick={() => { }}>
                        <BookOpen size={20} />
                        免費領取轉職戰略手冊
                    </button>
                    <button className="hero-cta-secondary" onClick={() => navigate('/courses')}>
                        瀏覽課程
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}
