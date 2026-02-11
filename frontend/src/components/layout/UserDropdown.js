import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './UserDropdown.css';

export default function UserDropdown() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = () => {
        closeDropdown();
        logout();
        navigate('/');
    };

    return (
        <div className="user-dropdown-wrapper" ref={dropdownRef}>
            <button
                className={`user-trigger ${isOpen ? 'active' : ''}`}
                onClick={toggleDropdown}
                aria-label="使用者選單"
                aria-expanded={isOpen}
            >
                <div className="user-avatar">
                    {user?.name ? user.name.charAt(0) : <User size={16} />}
                </div>
            </button>

            <div className={`user-dropdown-menu ${isOpen ? 'open' : ''}`}>
                <div className="dropdown-user-info">
                    <p className="user-name">{user?.name}</p>
                    <p className="user-email">{user?.email}</p>
                    <span className="user-role-badge">{user?.role === 'teacher' ? '老師' : '學生'}</span>
                </div>

                <div className="dropdown-divider" />

                <nav className="dropdown-nav">
                    <Link to="/dashboard" className="dropdown-item" onClick={closeDropdown}>
                        <LayoutDashboard size={16} />
                        會員中心
                    </Link>
                    <Link to="/dashboard/profile" className="dropdown-item" onClick={closeDropdown}>
                        <UserCircle size={16} />
                        個人簡介
                    </Link>
                    <Link to="/dashboard/settings" className="dropdown-item" onClick={closeDropdown}>
                        <Settings size={16} />
                        設定
                    </Link>
                </nav>

                <div className="dropdown-divider" />

                <button className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    登出
                </button>
            </div>
        </div>
    );
}
