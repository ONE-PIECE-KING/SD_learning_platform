import { Link } from 'react-router-dom';
import {
    BookOpen, Clock, CheckCircle, PlayCircle, Search,
    Calendar, Award, ArrowRight, Upload, BarChart2,
    MessageCircle, DollarSign, Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from '../../components/dashboard/StatsCard';
import './DashboardHome.css';

export default function DashboardHome() {
    const { user } = useAuth();
    const isTeacher = user?.role === 'teacher';

    // 根據時間決定問候語
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return '早安';
        if (hour < 18) return '午安';
        return '晚安';
    };

    // Student Mock Data
    const studentStats = [
        { title: '已購課程', value: 3, icon: BookOpen },
        { title: '累計學習時數', value: '12.5h', icon: Clock },
        { title: '已完課', value: 1, icon: CheckCircle },
    ];

    const studentQuickAccess = [
        { label: '繼續學習', to: '/dashboard/my-courses', icon: PlayCircle },
        { label: '瀏覽課程', to: '/courses', icon: Search },
        { label: '預約諮詢', to: '/dashboard/consult', icon: Calendar },
        { label: '我的證書', to: '/dashboard/profile', icon: Award },
    ];

    // Teacher Mock Data
    const teacherStats = [
        { title: '上架課程數', value: 5, icon: Upload },
        { title: '總學生數', value: 128, icon: Users },
        { title: '本月收入', value: 'NT$ 45,000', icon: DollarSign },
    ];

    const teacherQuickAccess = [
        { label: '上架新課程', to: '/dashboard/course-upload', icon: Upload },
        { label: '查看統計', to: '/dashboard/statistics', icon: BarChart2 },
        { label: '管理諮詢', to: '/dashboard/consult', icon: Calendar },
        { label: '學生互動', to: '/dashboard/contact', icon: MessageCircle },
    ];

    const stats = isTeacher ? teacherStats : studentStats;
    const quickAccess = isTeacher ? teacherQuickAccess : studentQuickAccess;

    const recentActivities = [
        {
            id: 1,
            title: isTeacher ? '新學生購買《Python 基礎》' : '完成《Python 資料科學入門》第 2 章',
            time: '2 小時前',
            type: isTeacher ? 'order' : 'course',
            icon: isTeacher ? DollarSign : BookOpen
        },
        {
            id: 2,
            title: isTeacher ? '收到一筆預約諮詢' : '預約了下週二的職涯諮詢',
            time: '1 天前',
            type: 'consult',
            icon: Calendar
        },
        {
            id: 3,
            title: isTeacher ? '課程《機器學習》通過審核' : '購買了《機器學習實戰》',
            time: '3 天前',
            type: isTeacher ? 'system' : 'order',
            icon: CheckCircle
        },
    ];

    return (
        <div className="dashboard-home">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-avatar">
                    {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="welcome-text">
                    <h1>{getGreeting()}，{user?.name}</h1>
                    <span className={`role-badge ${isTeacher ? 'teacher' : 'student'}`}>
                        {isTeacher ? '老師' : '學生'}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        variant={isTeacher ? 'accent' : 'primary'}
                    />
                ))}
            </div>

            <div className="dashboard-columns">
                {/* Recent Activity */}
                <div className="dashboard-col-main">
                    <div className="section-header">
                        <h2>近期活動</h2>
                    </div>
                    <div className="activity-list">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="activity-item">
                                <div className={`activity-icon type-${activity.type}`}>
                                    <activity.icon size={18} />
                                </div>
                                <div className="activity-content">
                                    <div className="activity-title">{activity.title}</div>
                                    <div className="activity-time">{activity.time}</div>
                                </div>
                            </div>
                        ))}
                        <Link to="/dashboard/history" className="view-all-btn">
                            查看全部
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Quick Access */}
                <div className="dashboard-col-side">
                    <div className="section-header">
                        <h2>快速入口</h2>
                    </div>
                    <div className="quick-access-grid">
                        {quickAccess.map((item, index) => (
                            <Link key={index} to={item.to} className="quick-access-card">
                                <item.icon size={24} className="qa-icon" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
