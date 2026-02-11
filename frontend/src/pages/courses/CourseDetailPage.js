import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Star, Play, Clock, Users, BookOpen, Award, Monitor,
    Download, ChevronDown, Lock, FileText, HelpCircle,
    ShoppingCart, CheckCircle,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import MOCK_COURSES, { LEVEL_MAP } from '../../data/mockCourses';
import { getCourseDetail } from '../../data/mockCourseDetails';
import { useCart } from '../../contexts/CartContext';
import './CourseDetailPage.css';

/* ─── 分頁名稱 ─── */
const TABS = [
    { key: 'about', label: '課程簡介' },
    { key: 'curriculum', label: '課程大綱' },
    { key: 'instructor', label: '講師簡介' },
    { key: 'reviews', label: '學員評價' },
];

/* ─── 星星元件 ─── */
function Stars({ rating, size = 16 }) {
    return (
        <span style={{ display: 'inline-flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    size={size}
                    fill={n <= Math.round(rating) ? 'currentColor' : 'none'}
                    strokeWidth={n <= Math.round(rating) ? 0 : 1.5}
                />
            ))}
        </span>
    );
}

/* ─── 單元圖標 ─── */
function LessonIcon({ type }) {
    switch (type) {
        case 'video': return <Play size={14} />;
        case 'quiz': return <HelpCircle size={14} />;
        case 'document': return <FileText size={14} />;
        default: return <Play size={14} />;
    }
}

/* ========================================
   CourseDetailPage 主元件
   ======================================== */
export default function CourseDetailPage() {
    const { id } = useParams();
    const courseId = parseInt(id, 10);
    const { addToCart, isInCart } = useCart();
    const added = isInCart(courseId);

    /* 進入頁面時自動捲到頂部 */
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [courseId]);

    /* 取得課程基本資料 */
    const course = useMemo(
        () => MOCK_COURSES.find((c) => c.id === courseId),
        [courseId]
    );

    /* 取得課程詳細資料 */
    const detail = useMemo(() => getCourseDetail(courseId), [courseId]);

    /* 分頁狀態 */
    const [activeTab, setActiveTab] = useState('about');

    /* 手風琴展開狀態（預設展開第一章） */
    const [openSections, setOpenSections] = useState([0]);

    const toggleSection = (index) => {
        setOpenSections((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    /* 衍生資料 */
    const isFree = course?.price === 0;
    const hasDiscount = course && course.originalPrice > course.price && course.price > 0;
    const discountPct = hasDiscount
        ? Math.round((1 - course.price / course.originalPrice) * 100)
        : 0;

    const totalLessons = detail.curriculum.reduce(
        (sum, sec) => sum + sec.lessons.length, 0
    );

    /* 404 處理 */
    if (!course) {
        return (
            <div className="course-detail-page">
                <Header />
                <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
                    <h2 style={{ color: 'var(--text-primary)' }}>此課程目前已關閉</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>請查看其他相關課程</p>
                    <Link to="/courses" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}>
                        瀏覽所有課程
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    /* 漸層佔位背景 */
    const bgColors = [
        'linear-gradient(135deg, #1a2332 0%, #2d3748 100%)',
        'linear-gradient(135deg, #1e2a3a 0%, #2a3f55 100%)',
        'linear-gradient(135deg, #1a1f2e 0%, #2d3346 100%)',
        'linear-gradient(135deg, #1c2333 0%, #2b3a4d 100%)',
        'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
        'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
    ];

    return (
        <div className="course-detail-page">
            <Header />
            <main>
                {/* ═══════ Hero Section ═══════ */}
                <section className="cd-hero">
                    <div className="cd-hero-inner">
                        {/* 麵包屑 */}
                        <nav className="cd-breadcrumb" aria-label="breadcrumb">
                            <Link to="/">首頁</Link>
                            <span className="cd-breadcrumb-sep">&gt;</span>
                            <Link to="/courses">課程總覽</Link>
                            <span className="cd-breadcrumb-sep">&gt;</span>
                            <Link to={`/courses?category=${encodeURIComponent(course.category)}`}>{course.category}</Link>
                            <span className="cd-breadcrumb-sep">&gt;</span>
                            <span className="cd-breadcrumb-current">{course.title}</span>
                        </nav>

                        <div className="cd-hero-content">
                            {/* 左側資訊 */}
                            <div className="cd-hero-info">
                                <span className="cd-category-badge">{course.category}</span>
                                <h1 className="cd-title">{course.title}</h1>
                                <p className="cd-subtitle">{detail.subtitle}</p>

                                {/* 評分 & Meta */}
                                <div className="cd-meta">
                                    <span className="cd-rating">
                                        <span>{course.rating}</span>
                                        <span className="cd-rating-stars">
                                            <Stars rating={course.rating} />
                                        </span>
                                        <span className="cd-rating-count">({course.ratingCount} 則評價)</span>
                                    </span>
                                    <span className="cd-meta-item">
                                        <Users size={15} />
                                        {course.students.toLocaleString()} 位學生
                                    </span>
                                    <span className="cd-meta-item">
                                        <Clock size={15} />
                                        {course.hours || 12} 小時
                                    </span>
                                </div>

                                {/* 講師 */}
                                <div className="cd-instructor-link">
                                    <div className="cd-instructor-avatar">{course.instructor.charAt(0)}</div>
                                    {course.instructor} 老師
                                </div>
                            </div>

                            {/* 右側預覽窗 */}
                            <div className="cd-preview">
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div className="cd-preview-bg" style={{ background: bgColors[course.id % bgColors.length] }} />
                                )}
                                <div className="cd-preview-play">
                                    <div className="cd-preview-play-icon">
                                        <Play size={28} fill="currentColor" strokeWidth={0} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════ 主要內容 ═══════ */}
                <div className="cd-body">
                    {/* 左側分頁內容 */}
                    <div className="cd-content">
                        {/* Tab 切換 */}
                        <div className="cd-tabs" role="tablist">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    className={`cd-tab ${activeTab === tab.key ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.key)}
                                    role="tab"
                                    aria-selected={activeTab === tab.key}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* —— 課程簡介 —— */}
                        {activeTab === 'about' && (
                            <div className="cd-about">
                                <h3>課程說明</h3>
                                <p>{course.description}</p>

                                <h3>學習目標</h3>
                                <div className="cd-goals">
                                    {detail.learningGoals.map((goal, i) => (
                                        <div className="cd-goal-item" key={i}>
                                            <CheckCircle size={16} className="cd-goal-icon" />
                                            <span>{goal}</span>
                                        </div>
                                    ))}
                                </div>

                                <h3>適用對象</h3>
                                <p>{detail.targetAudience}</p>

                                <h3>軟硬體需求</h3>
                                <p>{detail.prerequisites}</p>
                            </div>
                        )}

                        {/* —— 課程大綱 —— */}
                        {activeTab === 'curriculum' && (
                            <div className="cd-curriculum">
                                <div className="cd-curriculum-header">
                                    <h3>課程大綱</h3>
                                    <span className="cd-curriculum-stats">
                                        {detail.curriculum.length} 個章節・{totalLessons} 堂課
                                    </span>
                                </div>

                                {detail.curriculum.map((section, sIdx) => (
                                    <div className="cd-section" key={sIdx}>
                                        <div
                                            className="cd-section-header"
                                            onClick={() => toggleSection(sIdx)}
                                        >
                                            <span className="cd-section-title">
                                                <ChevronDown
                                                    size={16}
                                                    className={`cd-section-chevron ${openSections.includes(sIdx) ? 'open' : ''}`}
                                                />
                                                {section.title}
                                            </span>
                                            <span className="cd-section-meta">
                                                {section.lessons.length} 堂
                                            </span>
                                        </div>

                                        {openSections.includes(sIdx) && (
                                            <div className="cd-section-lessons">
                                                {section.lessons.map((lesson, lIdx) => (
                                                    <div className="cd-lesson" key={lIdx}>
                                                        <span className="cd-lesson-icon">
                                                            <LessonIcon type={lesson.type} />
                                                        </span>
                                                        <span className="cd-lesson-title">{lesson.title}</span>
                                                        <span className="cd-lesson-duration">{lesson.duration}</span>
                                                        {lesson.preview ? (
                                                            <span className="cd-lesson-preview">預覽</span>
                                                        ) : (
                                                            <Lock size={14} className="cd-lesson-lock" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* —— 講師簡介 —— */}
                        {activeTab === 'instructor' && (
                            <div>
                                <div className="cd-instructor">
                                    <div className="cd-instructor-photo">
                                        {course.instructor.charAt(0)}
                                    </div>
                                    <div className="cd-instructor-detail">
                                        <h3>{course.instructor} 老師</h3>
                                        <div className="cd-instructor-stats">
                                            <span className="cd-instructor-stat">
                                                <BookOpen size={14} />
                                                {detail.instructorCourseCount} 門課程
                                            </span>
                                            <span className="cd-instructor-stat">
                                                <Users size={14} />
                                                {detail.instructorTotalStudents.toLocaleString()} 位學員
                                            </span>
                                            <span className="cd-instructor-stat">
                                                <Award size={14} />
                                                {course.rating} 平均評分
                                            </span>
                                        </div>
                                        <p className="cd-instructor-bio">{detail.instructorBio}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* —— 學員評價 —— */}
                        {activeTab === 'reviews' && (
                            <div className="cd-reviews">
                                {/* 總評分 + 分佈 */}
                                <div className="cd-reviews-header">
                                    <div className="cd-reviews-overall">
                                        <div className="cd-reviews-overall-score">{course.rating}</div>
                                        <div className="cd-reviews-overall-stars">
                                            <Stars rating={course.rating} size={18} />
                                        </div>
                                        <div className="cd-reviews-overall-count">{course.ratingCount} 則評價</div>
                                    </div>
                                    <div className="cd-reviews-bars">
                                        {[5, 4, 3, 2, 1].map((n) => {
                                            const pct = detail.ratingDistribution[n] || 0;
                                            return (
                                                <div className="cd-reviews-bar-row" key={n}>
                                                    <span className="cd-reviews-bar-label">{n} 顆星</span>
                                                    <div className="cd-reviews-bar-track">
                                                        <div className="cd-reviews-bar-fill" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="cd-reviews-bar-pct">{pct}%</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 評論列表 */}
                                <div className="cd-review-list">
                                    {detail.reviews.map((review, i) => (
                                        <div className="cd-review-item" key={i}>
                                            <div className="cd-review-top">
                                                <div className="cd-review-avatar">
                                                    {review.name.charAt(0)}
                                                </div>
                                                <span className="cd-review-name">{review.name}</span>
                                                <span className="cd-review-date">{review.date}</span>
                                            </div>
                                            <div className="cd-review-stars">
                                                <Stars rating={review.rating} size={14} />
                                            </div>
                                            <p className="cd-review-text">{review.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══════ 側邊購買欄 ═══════ */}
                    <aside>
                        <div className="cd-purchase-card">
                            {/* 價格 */}
                            <div className="cd-purchase-price">
                                {isFree ? (
                                    <span className="cd-purchase-free">免費</span>
                                ) : (
                                    <>
                                        <span className="cd-purchase-current">
                                            NT$ {course.price.toLocaleString()}
                                        </span>
                                        {hasDiscount && (
                                            <>
                                                <span className="cd-purchase-original">
                                                    NT$ {course.originalPrice.toLocaleString()}
                                                </span>
                                                <span className="cd-purchase-discount">
                                                    -{discountPct}%
                                                </span>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* CTA */}
                            <button className="cd-btn-primary">
                                {isFree ? '免費開始學習' : '立即購買'}
                            </button>
                            {!isFree && (
                                <button
                                    className={`cd-btn-secondary ${added ? 'added' : ''}`}
                                    onClick={() => !added && addToCart(course.id)}
                                    disabled={added}
                                >
                                    <ShoppingCart size={18} />
                                    {added ? '已加入購物車' : '加入購物車'}
                                </button>
                            )}

                            {/* 課程特點 */}
                            <div className="cd-features">
                                <span className="cd-features-title">課程包含</span>
                                <div className="cd-feature-item">
                                    <Clock size={16} className="cd-feature-icon" />
                                    {course.hours || 12} 小時影片課程
                                </div>
                                <div className="cd-feature-item">
                                    <Download size={16} className="cd-feature-icon" />
                                    可下載練習檔案
                                </div>
                                <div className="cd-feature-item">
                                    <Award size={16} className="cd-feature-icon" />
                                    永久觀看權限
                                </div>
                                <div className="cd-feature-item">
                                    <Monitor size={16} className="cd-feature-icon" />
                                    支援行動裝置
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* ═══════ Mobile 底部購買列 ═══════ */}
                <div className="cd-mobile-purchase">
                    <div className="cd-mobile-price">
                        {isFree ? (
                            <span className="cd-mobile-current" style={{ color: 'var(--success)' }}>免費</span>
                        ) : (
                            <>
                                <span className="cd-mobile-current">NT$ {course.price.toLocaleString()}</span>
                                {hasDiscount && (
                                    <span className="cd-mobile-original">NT$ {course.originalPrice.toLocaleString()}</span>
                                )}
                            </>
                        )}
                    </div>
                    <button className="cd-mobile-buy">
                        {isFree ? '免費開始' : '立即購買'}
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
}
