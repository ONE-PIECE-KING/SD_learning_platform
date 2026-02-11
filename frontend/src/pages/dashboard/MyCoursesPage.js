import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlayCircle, CheckCircle } from 'lucide-react';
import MOCK_COURSES from '../../data/mockCourses';
import './MyCoursesPage.css';

export default function MyCoursesPage() {
    const [filter, setFilter] = useState('all'); // all, in-progress, completed
    const [searchQuery, setSearchQuery] = useState('');

    // 模擬已購課程 (取 MOCK_COURSES 前 5 筆)
    // 增加 progress 屬性模擬進度
    const myCourses = MOCK_COURSES.slice(0, 5).map((course, index) => ({
        ...course,
        progress: index === 0 ? 100 : index === 1 ? 60 : index === 2 ? 30 : 0,
        lastViewed: index === 1 ? '2 小時前' : null
    }));

    const filteredCourses = myCourses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            filter === 'all' ? true :
                filter === 'completed' ? course.progress === 100 :
                    filter === 'in-progress' ? course.progress > 0 && course.progress < 100 :
                        course.progress === 0; // not started

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="my-courses-page">
            <div className="page-header">
                <h1>我的課程</h1>
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="搜尋課程..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="course-tabs">
                <button
                    className={`tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    全部
                </button>
                <button
                    className={`tab ${filter === 'in-progress' ? 'active' : ''}`}
                    onClick={() => setFilter('in-progress')}
                >
                    進行中
                </button>
                <button
                    className={`tab ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    已完成
                </button>
            </div>

            {/* Course Grid */}
            {filteredCourses.length > 0 ? (
                <div className="my-courses-grid">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="my-course-card">
                            <div className="course-thumb">
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} />
                                ) : (
                                    <div className="placeholder-thumb" />
                                )}
                                {course.progress > 0 && course.progress < 100 && (
                                    <div className="resume-overlay">
                                        <Link to={`/courses/${course.id}`} className="resume-btn">
                                            <PlayCircle size={48} />
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="course-info">
                                <h3 className="course-title">
                                    <Link to={`/courses/${course.id}`}>{course.title}</Link>
                                </h3>

                                <div className="progress-section">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                    <div className="progress-text">
                                        <span>{course.progress}% 完成</span>
                                        {course.progress === 100 && (
                                            <CheckCircle size={16} className="completed-icon" />
                                        )}
                                    </div>
                                </div>

                                <Link to={`/courses/${course.id}`} className="continue-btn">
                                    {course.progress === 0 ? '開始上課' :
                                        course.progress === 100 ? '複習課程' : '繼續學習'}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>沒有找到相關課程</p>
                </div>
            )}
        </div>
    );
}
