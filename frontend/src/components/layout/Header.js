import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Sun, Moon, BookOpen, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

/**
 * 全站 Header 導覽列
 * - 固定頂部、捲動模糊效果
 * - 桌面版導航連結 + 行動版漢堡選單
 * - Light/Dark 主題切換
 * - 登入/登出狀態切換
 */
export default function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    // 初始化主題（從 localStorage 讀取）
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // 監聽捲動
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 主題切換
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // 關閉行動選單
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // 登出處理
    const handleLogout = () => {
        logout();
        navigate('/');
        closeMobileMenu();
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
                    {/* Logo */}
                    <Link to="/" className="header-logo" aria-label="回到首頁">
                        <BookOpen size={32} strokeWidth={2} />
                        <span>桑尼資料科學</span>
                    </Link>

                    {/* 桌面版導航 */}
                    <nav className="header-nav" aria-label="主要導航">
                        {navLinks.map(({ label, to, isCta }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`header-nav-link ${isCta ? 'cta-link' : ''}`}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* 右側功能區 */}
                    <div className="header-actions">
                        <button
                            className="theme-toggle"
                            onClick={toggleTheme}
                            aria-label={`切換至${theme === 'light' ? '深色' : '淺色'}模式`}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        <Link to="/cart" className="header-icon-btn" aria-label="購物車">
                            <ShoppingCart size={20} />
                            <span className="header-cart-badge">0</span>
                        </Link>

                        {isAuthenticated ? (
                            /* 已登入：顯示使用者名稱 + 登出 */
                            <div className="header-user-area">
                                <Link to="/dashboard" className="header-user-btn">
                                    <div className="header-avatar">
                                        <User size={16} />
                                    </div>
                                    <span className="header-user-name">{user.name}</span>
                                </Link>
                                <button
                                    className="header-logout-btn"
                                    onClick={handleLogout}
                                    aria-label="登出"
                                    title="登出"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            /* 未登入：登入 / 註冊按鈕 */
                            <Link to="/auth/login" className="btn btn-sm btn-primary">
                                登入 / 註冊
                            </Link>
                        )}

                        {/* 漢堡選單按鈕 */}
                        <button
                            className={`header-hamburger ${isMobileMenuOpen ? 'open' : ''}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="開啟選單"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile 側滑選單遮罩 */}
            <div
                className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}
                onClick={closeMobileMenu}
                aria-hidden="true"
            />

            {/* Mobile 側滑選單 */}
            <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`} aria-label="行動版導航">
                <button
                    onClick={closeMobileMenu}
                    style={{ position: 'absolute', top: 16, right: 16, color: 'var(--text-primary)' }}
                    aria-label="關閉選單"
                >
                    <X size={24} />
                </button>

                {navLinks.map(({ label, to }) => (
                    <Link key={to} to={to} className="mobile-nav-link" onClick={closeMobileMenu}>
                        {label}
                    </Link>
                ))}

                <div className="mobile-nav-actions">
                    {isAuthenticated ? (
                        <>
                            <div className="mobile-nav-user">
                                <div className="header-avatar">
                                    <User size={16} />
                                </div>
                                <span>{user.name}</span>
                            </div>
                            <button className="btn btn-md btn-secondary" onClick={handleLogout}>
                                <LogOut size={18} />
                                登出
                            </button>
                        </>
                    ) : (
                        <Link to="/auth/login" className="btn btn-md btn-primary" onClick={closeMobileMenu}>
                            登入 / 註冊
                        </Link>
                    )}
                </div>
            </nav>
        </>
    );
}
