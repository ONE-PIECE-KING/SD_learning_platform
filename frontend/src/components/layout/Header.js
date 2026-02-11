import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, X, Sun, Moon, BookOpen, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import NotificationDropdown from '../notification/NotificationDropdown';
import UserDropdown from './UserDropdown';
import './Header.css';

/**
 * 全站 Header 導覽列 (Refactored for Pro Max UI)
 */
export default function Header() {
    const { isAuthenticated } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    // Theme effect
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const navLinks = [
        { label: '課程總覽', to: '/courses' },
        { label: '一對一諮詢', to: '/consult', isCta: true },
        { label: '資源分享', to: '/resources' },
    ];

    return (
        <>
            <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="header-inner">
                    {/* Left: Logo */}
                    <Link to="/" className="header-logo" aria-label="回到首頁">
                        <div className="logo-icon-wrapper">
                            <BookOpen size={24} strokeWidth={2.5} />
                        </div>
                        <span className="logo-text">桑尼資料科學</span>
                    </Link>

                    {/* Center: Desktop Nav */}
                    <nav className="header-nav" aria-label="主要導航">
                        {navLinks.map(({ label, to, isCta }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`header-nav-link ${isCta ? 'cta-link' : ''} ${location.pathname === to ? 'active' : ''}`}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right: Actions */}
                    <div className="header-actions">
                        {/* 1. Theme Toggle */}
                        <button
                            className="action-btn theme-toggle"
                            onClick={toggleTheme}
                            aria-label={`切換至${theme === 'light' ? '深色' : '淺色'}模式`}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        {/* 2. Authenticated Actions */}
                        {isAuthenticated ? (
                            <>
                                <NotificationDropdown />

                                <Link to="/cart" className="action-btn cart-btn" aria-label="購物車">
                                    <ShoppingCart size={20} />
                                    {totalItems > 0 && <span className="badge-count">{totalItems}</span>}
                                </Link>

                                <div className="divider-vertical" />

                                <UserDropdown />
                            </>
                        ) : (
                            /* 3. Guest Actions */
                            <div className="guest-actions">
                                <Link to="/cart" className="action-btn cart-btn" aria-label="購物車">
                                    <ShoppingCart size={20} />
                                    {totalItems > 0 && <span className="badge-count">{totalItems}</span>}
                                </Link>
                                <Link to="/auth/login" className="btn btn-primary btn-login">
                                    登入 / 註冊
                                </Link>
                            </div>
                        )}

                        {/* 4. Mobile Menu Toggle */}
                        <button
                            className={`mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="開啟選單"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Overlay */}
            <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />

            {/* Mobile Navigation Panel */}
            <div className={`mobile-nav-panel ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-nav-header">
                    <span className="mobile-nav-title">選單</span>
                    <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="mobile-nav-content">
                    {navLinks.map(({ label, to }) => (
                        <Link key={to} to={to} className={`mobile-nav-item ${location.pathname === to ? 'active' : ''}`}>
                            {label}
                        </Link>
                    ))}

                    <div className="mobile-divider" />

                    {!isAuthenticated && (
                        <Link to="/auth/login" className="mobile-nav-item highlight">
                            登入 / 註冊
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
