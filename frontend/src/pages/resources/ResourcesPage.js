import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, Eye, Calendar, BookOpen, FileText,
    ChevronLeft, ChevronRight,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import MOCK_ARTICLES, {
    ARTICLE_CATEGORIES,
    CATEGORY_COLORS,
    CATEGORY_CLASS,
} from '../../data/mockArticles';
import './ResourcesPage.css';

const ARTICLES_PER_PAGE = 9;

/* ========================================
   ResourcesPage 主元件
   ======================================== */
export default function ResourcesPage() {
    /* 自動捲頂 */
    useEffect(() => { window.scrollTo(0, 0); }, []);

    /* 搜尋、分類、排序 */
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('全部');
    const [sortOrder, setSortOrder] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);

    /* 重設分頁：搜尋/分類/排序改變時回第一頁 */
    useEffect(() => { setCurrentPage(1); }, [searchQuery, activeCategory, sortOrder]);

    /* 篩選 */
    const filteredArticles = useMemo(() => {
        let result = [...MOCK_ARTICLES];

        // 搜尋
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (a) =>
                    a.title.toLowerCase().includes(q) ||
                    a.excerpt.toLowerCase().includes(q) ||
                    a.tags.some((t) => t.toLowerCase().includes(q))
            );
        }

        // 分類
        if (activeCategory !== '全部') {
            result = result.filter((a) => a.category === activeCategory);
        }

        // 排序
        switch (sortOrder) {
            case 'newest':
                result.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'views':
                result.sort((a, b) => b.views - a.views);
                break;
            default:
                break;
        }

        return result;
    }, [searchQuery, activeCategory, sortOrder]);

    /* 分頁 */
    const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
    const paginatedArticles = useMemo(() => {
        const start = (currentPage - 1) * ARTICLES_PER_PAGE;
        return filteredArticles.slice(start, start + ARTICLES_PER_PAGE);
    }, [filteredArticles, currentPage]);

    return (
        <div className="resources-page">
            <Header />
            <main>
                {/* ═══ Hero ═══ */}
                <section className="res-hero">
                    <div className="res-hero-inner">
                        <span className="res-hero-badge">
                            <BookOpen size={14} />
                            免費學習資源
                        </span>
                        <h1>資源分享</h1>
                        <p className="res-hero-sub">
                            精選技術文章、學習筆記與轉職心得，幫你掌握資料科學最新動態與實戰技巧。
                        </p>
                    </div>
                </section>

                {/* ═══ 搜尋 + 分類 + 排序 ═══ */}
                <div className="res-toolbar">
                    <div className="res-search-row">
                        <div className="res-search-wrap">
                            <Search size={18} className="res-search-icon" />
                            <input
                                type="text"
                                className="res-search-input"
                                placeholder="搜尋文章標題、關鍵字或標籤..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="res-sort-select"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="newest">最新發布</option>
                            <option value="views">最多瀏覽</option>
                        </select>
                    </div>

                    <div className="res-categories">
                        {ARTICLE_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                className={`res-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ═══ 文章列表 ═══ */}
                <div className="res-grid-section">
                    <p className="res-count">
                        共 {filteredArticles.length} 篇文章
                    </p>

                    <div className="res-grid">
                        {paginatedArticles.length > 0 ? (
                            paginatedArticles.map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))
                        ) : (
                            <div className="res-empty">
                                <FileText size={48} className="res-empty-icon" />
                                <h3>目前尚無相關文章</h3>
                                <p>試試其他關鍵字或分類吧！</p>
                            </div>
                        )}
                    </div>

                    {/* 分頁 */}
                    {totalPages > 1 && (
                        <div className="res-pagination">
                            <button
                                className="res-page-btn"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`res-page-btn ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className="res-page-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

/* ═══════════════════════════════════════
   ArticleCard 文章卡片元件
   ═══════════════════════════════════════ */
function ArticleCard({ article }) {
    const bgColor = CATEGORY_COLORS[article.category] || CATEGORY_COLORS['技術新訊'];
    const catClass = CATEGORY_CLASS[article.category] || 'tech';

    return (
        <article className="res-card">
            {/* 封面 */}
            <div className="res-card-cover">
                {article.cover ? (
                    <img src={article.cover} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div className="res-card-cover-bg" style={{ background: bgColor }}>
                        <FileText size={40} color="rgba(255,255,255,0.15)" />
                    </div>
                )}
                <span className={`res-card-category ${catClass}`}>{article.category}</span>
            </div>

            {/* 內容 */}
            <div className="res-card-body">
                <h3 className="res-card-title">{article.title}</h3>
                <p className="res-card-excerpt">{article.excerpt}</p>
                <div className="res-card-tags">
                    {article.tags.map((tag) => (
                        <span className="res-card-tag" key={tag}>#{tag}</span>
                    ))}
                </div>
            </div>

            {/* 底部 */}
            <div className="res-card-footer">
                <div className="res-card-author-avatar">
                    {article.author.charAt(0)}
                </div>
                <span className="res-card-author-name">{article.author}</span>
                <div className="res-card-meta">
                    <span className="res-card-meta-item">
                        <Calendar size={13} />
                        {article.date}
                    </span>
                    <span className="res-card-meta-item">
                        <Eye size={13} />
                        {article.views.toLocaleString()}
                    </span>
                </div>
            </div>
        </article>
    );
}
