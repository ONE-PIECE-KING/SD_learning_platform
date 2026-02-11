import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Search, SlidersHorizontal, Star, ArrowRight,
    ChevronLeft, ChevronRight, SearchX, X,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import MOCK_COURSES, { CATEGORIES, LEVEL_MAP } from '../../data/mockCourses';
import './CoursesPage.css';
import './CourseCard.css';

/**
 * 課程總覽頁面 — /courses
 * 搜尋 + 篩選（類別/難度/價格/評分）+ 排序 + 卡片網格 + 分頁
 */

const ITEMS_PER_PAGE = 9;

const SORT_OPTIONS = [
    { value: 'newest', label: '最新上架' },
    { value: 'popular', label: '熱門程度' },
    { value: 'price_asc', label: '價格由低到高' },
    { value: 'price_desc', label: '價格由高到低' },
    { value: 'rating', label: '最高評分' },
];

const PRICE_OPTIONS = [
    { value: 'all', label: '全部' },
    { value: 'free', label: '免費' },
    { value: 'paid', label: '付費' },
];

const RATING_OPTIONS = [
    { value: 0, label: '全部' },
    { value: 4, label: '4 顆星以上' },
    { value: 3, label: '3 顆星以上' },
];

/* ─── 課程卡片 ─── */
function CourseCard({ course }) {
    const isFree = course.price === 0;
    const hasDiscount = course.originalPrice > course.price && course.price > 0;

    // 產生佔位色彩背景
    const bgColors = [
        'linear-gradient(135deg, #1a2332 0%, #2d3748 100%)',
        'linear-gradient(135deg, #1e2a3a 0%, #2a3f55 100%)',
        'linear-gradient(135deg, #1a1f2e 0%, #2d3346 100%)',
        'linear-gradient(135deg, #1c2333 0%, #2b3a4d 100%)',
        'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
        'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
    ];
    const bgStyle = { background: bgColors[course.id % bgColors.length] };

    // 標籤類型
    const badgeClass = course.badge === '熱銷推薦' ? 'hot' : course.badge === '獨家課程' ? 'exclusive' : '';

    return (
        <article className="course-card">
            {/* 縮圖區 */}
            <Link to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                <div className="course-card-thumb">
                    {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} />
                    ) : (
                        <div className="course-card-thumb-bg" style={bgStyle} />
                    )}
                    {/* 右上角標籤 */}
                    {course.badge && (
                        <span className={`course-card-badge ${badgeClass}`}>
                            {course.badge === '熱銷推薦' && (
                                <span className="course-card-badge-icon">🔥</span>
                            )}
                            {course.badge === '獨家課程' && (
                                <span className="course-card-badge-icon">🎯</span>
                            )}
                            {course.badge}
                        </span>
                    )}
                </div>
            </Link>

            {/* 內容區 */}
            <div className="course-card-body">
                <h3 className="course-card-title">{course.title}</h3>
                <p className="course-card-desc">{course.description}</p>

                {/* 統計行：時數 / 人數 / 星等 */}
                <div className="course-card-stats">
                    <span className="course-card-stat">{course.hours || 12}H</span>
                    <span className="course-card-stat">{course.students.toLocaleString()} 人</span>
                    <span className="course-card-stat course-card-stat-rating">
                        <Star size={13} fill="currentColor" strokeWidth={0} className="star-icon" />
                        {course.rating}
                    </span>
                </div>
            </div>

            {/* 底部：價格 + 箭頭 */}
            <div className="course-card-footer">
                <div className="course-card-price">
                    {isFree ? (
                        <span className="course-card-price-free">免費</span>
                    ) : (
                        <>
                            <span className={`course-card-price-current ${hasDiscount ? 'has-discount' : ''}`}>
                                NT$ {course.price.toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <span className="course-card-price-original">
                                    NT$ {course.originalPrice.toLocaleString()}
                                </span>
                            )}
                        </>
                    )}
                </div>
                <Link to={`/courses/${course.id}`} className="course-card-arrow" aria-label="查看詳情">
                    <ArrowRight size={18} />
                </Link>
            </div>
        </article>
    );
}

/* ─── 主頁面 ─── */
export default function CoursesPage() {
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    const [ratingFilter, setRatingFilter] = useState(0);
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    // 篩選 + 搜尋
    const filteredCourses = useMemo(() => {
        let result = [...MOCK_COURSES];

        // 搜尋
        if (search.trim()) {
            const keyword = search.trim().toLowerCase();
            result = result.filter(
                (c) =>
                    c.title.toLowerCase().includes(keyword) ||
                    c.description.toLowerCase().includes(keyword) ||
                    c.category.toLowerCase().includes(keyword)
            );
        }

        // 類別
        if (selectedCategories.length > 0) {
            result = result.filter((c) => selectedCategories.includes(c.category));
        }

        // 難度
        if (selectedLevel) {
            result = result.filter((c) => c.level === selectedLevel);
        }

        // 價格
        if (priceFilter === 'free') result = result.filter((c) => c.price === 0);
        if (priceFilter === 'paid') result = result.filter((c) => c.price > 0);

        // 評分
        if (ratingFilter > 0) {
            result = result.filter((c) => c.rating >= ratingFilter);
        }

        // 排序
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'popular':
                result.sort((a, b) => b.students - a.students);
                break;
            case 'price_asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }

        return result;
    }, [search, selectedCategories, selectedLevel, priceFilter, ratingFilter, sortBy]);

    // 分頁
    const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));
    const pagedCourses = filteredCourses.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // 切換類別
    const toggleCategory = (cat) => {
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
        setCurrentPage(1);
    };

    // 清除所有篩選
    const clearFilters = () => {
        setSearch('');
        setSelectedCategories([]);
        setSelectedLevel('');
        setPriceFilter('all');
        setRatingFilter(0);
        setSortBy('newest');
        setCurrentPage(1);
    };

    const hasActiveFilters =
        search || selectedCategories.length > 0 || selectedLevel || priceFilter !== 'all' || ratingFilter > 0;

    /* ─── Sidebar 篩選元件 ─── */
    const FilterSidebar = () => (
        <>
            {/* 類別 */}
            <div className="filter-group">
                <h4 className="filter-group-title">類別</h4>
                {CATEGORIES.map((cat) => {
                    const count = MOCK_COURSES.filter((c) => c.category === cat).length;
                    return (
                        <label key={cat} className="filter-option">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(cat)}
                                onChange={() => toggleCategory(cat)}
                            />
                            {cat}
                            <span className="filter-count">{count}</span>
                        </label>
                    );
                })}
            </div>

            {/* 難度 */}
            <div className="filter-group">
                <h4 className="filter-group-title">難度</h4>
                <label className="filter-option">
                    <input
                        type="radio"
                        name="level"
                        checked={selectedLevel === ''}
                        onChange={() => { setSelectedLevel(''); setCurrentPage(1); }}
                    />
                    全部
                </label>
                {Object.entries(LEVEL_MAP).map(([key, label]) => (
                    <label key={key} className="filter-option">
                        <input
                            type="radio"
                            name="level"
                            checked={selectedLevel === key}
                            onChange={() => { setSelectedLevel(key); setCurrentPage(1); }}
                        />
                        {label}
                    </label>
                ))}
            </div>

            {/* 價格 */}
            <div className="filter-group">
                <h4 className="filter-group-title">價格</h4>
                {PRICE_OPTIONS.map((opt) => (
                    <label key={opt.value} className="filter-option">
                        <input
                            type="radio"
                            name="price"
                            checked={priceFilter === opt.value}
                            onChange={() => { setPriceFilter(opt.value); setCurrentPage(1); }}
                        />
                        {opt.label}
                    </label>
                ))}
            </div>

            {/* 評分 */}
            <div className="filter-group">
                <h4 className="filter-group-title">評分</h4>
                {RATING_OPTIONS.map((opt) => (
                    <label key={opt.value} className="filter-option">
                        <input
                            type="radio"
                            name="rating"
                            checked={ratingFilter === opt.value}
                            onChange={() => { setRatingFilter(opt.value); setCurrentPage(1); }}
                        />
                        {opt.label}
                    </label>
                ))}
            </div>

            {/* 清除按鈕 */}
            {hasActiveFilters && (
                <button className="filter-clear-btn" onClick={clearFilters}>
                    清除所有篩選條件
                </button>
            )}
        </>
    );

    return (
        <div className="courses-page">
            <Header />
            <main>
                {/* 搜尋區 */}
                <section className="courses-search-section">
                    <div className="courses-search-inner">
                        <h1 className="courses-search-title">探索所有課程</h1>
                        <p className="courses-search-subtitle">從 Python、機器學習到深度學習，找到適合你的學習路徑</p>
                        <div className="courses-search-bar">
                            <Search size={18} className="courses-search-icon" />
                            <input
                                type="text"
                                placeholder="搜尋課程名稱、分類或關鍵字..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                    </div>
                </section>

                {/* 主佈局 */}
                <div className="courses-layout">
                    {/* 側邊篩選欄 */}
                    <aside className={`courses-sidebar ${showMobileFilter ? 'open' : ''}`}>
                        <FilterSidebar />
                    </aside>

                    {/* 主要內容區 */}
                    <div className="courses-main">
                        {/* 工具列 */}
                        <div className="courses-toolbar">
                            <span className="courses-result-count">
                                共找到 <strong>{filteredCourses.length}</strong> 門課程
                            </span>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button
                                    className="courses-filter-toggle"
                                    onClick={() => setShowMobileFilter(!showMobileFilter)}
                                >
                                    {showMobileFilter ? <X size={16} /> : <SlidersHorizontal size={16} />}
                                    {showMobileFilter ? '關閉篩選' : '篩選'}
                                </button>
                                <div className="courses-sort">
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                        {SORT_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 課程網格 */}
                        {pagedCourses.length > 0 ? (
                            <div className="courses-grid">
                                {pagedCourses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        ) : (
                            <div className="courses-empty">
                                <SearchX size={48} className="courses-empty-icon" />
                                <h3>找不到符合條件的課程</h3>
                                <p>試試調整搜尋關鍵字或篩選條件</p>
                                <button className="filter-clear-btn" onClick={clearFilters} style={{ maxWidth: 200, margin: '0 auto' }}>
                                    清除所有篩選條件
                                </button>
                            </div>
                        )}

                        {/* 分頁 */}
                        {totalPages > 1 && (
                            <div className="courses-pagination">
                                <button
                                    className="page-btn"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                    aria-label="上一頁"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        className={`page-btn ${page === currentPage ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    className="page-btn"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                    aria-label="下一頁"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
