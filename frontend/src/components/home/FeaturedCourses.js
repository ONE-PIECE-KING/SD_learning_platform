import { Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowRight, Code } from 'lucide-react';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import './FeaturedCourses.css';

/**
 * 主推課程 — Mock 資料展示精選課程卡片
 */

const MOCK_COURSES = [
    {
        id: '1',
        title: 'Python 資料科學入門 — 從零到實戰',
        description: '掌握 Python 核心語法、Pandas、NumPy，完成真實數據分析專案。',
        instructor: '桑尼老師',
        price: 2680,
        originalPrice: 4980,
        rating: 4.8,
        ratingCount: 126,
    },
    {
        id: '2',
        title: '機器學習實戰工作坊',
        description: '學會 Scikit-learn、XGBoost 等主流框架，建構預測模型。',
        instructor: '桑尼老師',
        price: 3980,
        originalPrice: 6800,
        rating: 4.9,
        ratingCount: 89,
    },
    {
        id: '3',
        title: 'SQL 資料分析完全指南',
        description: '從基礎查詢到進階 Window Function，成為資料分析即戰力。',
        instructor: '桑尼老師',
        price: 1980,
        originalPrice: 3600,
        rating: 4.7,
        ratingCount: 203,
    },
];

function StarRating({ rating, count }) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    return (
        <div className="course-card-rating">
            <div className="course-card-stars">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        fill={i < fullStars || (i === fullStars && hasHalf) ? '#F59E0B' : 'none'}
                        strokeWidth={i < fullStars ? 0 : 1.5}
                    />
                ))}
            </div>
            <span className="course-card-rating-num">{rating}</span>
            <span className="course-card-rating-count">({count})</span>
        </div>
    );
}

function CourseCard({ course }) {
    return (
        <div className="course-card">
            <div className="course-card-thumb">
                <div className="course-card-thumb-placeholder">
                    <Code size={48} strokeWidth={1} />
                </div>
            </div>
            <div className="course-card-body">
                <h3 className="course-card-title">{course.title}</h3>
                <p className="course-card-desc">{course.description}</p>
                <p className="course-card-instructor">{course.instructor}</p>
                <StarRating rating={course.rating} count={course.ratingCount} />
                <div className="course-card-price">
                    <span className="course-card-price-current">
                        NT$ {course.price.toLocaleString()}
                    </span>
                    {course.originalPrice && (
                        <span className="course-card-price-original">
                            NT$ {course.originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>
                <div className="course-card-actions">
                    <Link to={`/courses/${course.id}`} className="btn btn-sm btn-secondary">
                        查看詳情
                    </Link>
                    <button className="btn btn-sm btn-primary">
                        <ShoppingCart size={14} />
                        加入購物車
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function FeaturedCourses() {
    const ref = useScrollAnimation();

    return (
        <section className="featured-courses section" id="featured-courses">
            <div className="container">
                <div className="section-header animate-on-scroll" ref={ref}>
                    <h2 className="section-title">最受歡迎的課程</h2>
                    <p className="section-subtitle">
                        精選業界最實用的課程內容，由資深講師親授，幫助你快速掌握核心技能
                    </p>
                </div>

                <div className="courses-grid">
                    {MOCK_COURSES.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>

                <div className="courses-cta">
                    <Link to="/courses" className="btn btn-md btn-secondary">
                        查看更多課程
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
