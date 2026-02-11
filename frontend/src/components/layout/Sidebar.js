import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, BookOpen, Receipt, MessageCircle,
    User, Share2, Settings, LogOut, Upload, BarChart2, BookUser
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const isTeacher = user?.role === 'teacher';

    const studentNavItems = [
        { label: '總覽', to: '/dashboard', icon: LayoutDashboard, exact: true },
        { label: '我的課程', to: '/dashboard/my-courses', icon: BookOpen },
        { label: '購課記錄', to: '/dashboard/history', icon: Receipt },
        { label: '一對一諮詢', to: '/dashboard/consult', icon: MessageCircle },
        { label: '個人簡介', to: '/dashboard/profile', icon: User },
        { label: '資源分享', to: '/dashboard/resources', icon: Share2 },
        { label: '設定', to: '/dashboard/settings', icon: Settings },
    ];

    const teacherNavItems = [
        { label: '總覽', to: '/dashboard', icon: LayoutDashboard, exact: true },
        { label: '課程上架', to: '/dashboard/course-upload', icon: Upload },
        { label: '統計/分析', to: '/dashboard/statistics', icon: BarChart2 },
        { label: '我的課程', to: '/dashboard/my-courses', icon: BookOpen }, // Shared
        { label: '購課記錄', to: '/dashboard/history', icon: Receipt },     // Shared
        { label: '一對一諮詢', to: '/dashboard/consult', icon: MessageCircle }, // Shared
        { label: '老師聯絡簿', to: '/dashboard/contact', icon: BookUser },
        { label: '個人簡介', to: '/dashboard/profile', icon: User },        // Shared
        { label: '資源分享', to: '/dashboard/resources', icon: Share2 },    // Shared
        { label: '設定', to: '/dashboard/settings', icon: Settings },       // Shared
    ];

    const navItems = isTeacher ? teacherNavItems : studentNavItems;

    const isActive = (path, exact) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`sidebar-item ${isActive(item.to, item.exact) ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <item.icon size={20} className="sidebar-icon" />
                            <span className="sidebar-label">{item.label}</span>
                            {isActive(item.to, item.exact) && (
                                <div className="active-indicator" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="sidebar-logout" onClick={logout}>
                        <LogOut size={20} />
                        <span>登出</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
