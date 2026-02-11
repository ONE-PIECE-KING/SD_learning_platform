import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BookOpen, Mail, Lock, Eye, EyeOff,
    AlertCircle, LogIn,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthPage.css';

/**
 * 登入頁面 — /auth/login
 * 使用 AuthContext 進行登入驗證
 */

/* Google / Facebook SVG icon */
function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#1877F2" d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z" />
            <path fill="#fff" d="M26.572 25.5h3.056l.48-3.5h-3.536v-1.917c0-1.467.478-2.77 1.853-2.77H30.2V14.14c-.392-.053-1.22-.17-2.79-.17-3.279 0-5.21 1.734-5.21 5.685V22h-3.2v3.5H22.2V36h4.372V25.5z" />
        </svg>
    );
}

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const emailRef = useRef(null);

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    // 已登入 → 導回首頁
    useEffect(() => {
        if (isAuthenticated) navigate('/', { replace: true });
    }, [isAuthenticated, navigate]);

    // 自動聚焦
    useEffect(() => { emailRef.current?.focus(); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
        if (serverError) setServerError('');
    };

    const validate = () => {
        const errs = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email) errs.email = '請輸入 Email';
        else if (!emailRegex.test(form.email)) errs.email = '請輸入有效的 Email 格式';
        if (!form.password) errs.password = '請輸入密碼';
        else if (form.password.length < 8) errs.password = '密碼至少需要 8 個字元';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setIsLoading(true);
        setServerError('');

        const result = await login(form.email, form.password);

        if (result.success) {
            navigate('/');
        } else {
            setServerError(result.error);
        }

        setIsLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-glow auth-bg-glow--1" aria-hidden="true" />
            <div className="auth-bg-glow auth-bg-glow--2" aria-hidden="true" />

            <div className="auth-card">
                {/* Logo */}
                <Link to="/" className="auth-logo">
                    <BookOpen size={28} strokeWidth={2} />
                    <span>桑尼資料科學</span>
                </Link>

                <h1 className="auth-title">歡迎回來</h1>
                <p className="auth-subtitle">登入你的帳號以繼續學習</p>

                {/* 伺服器錯誤 */}
                {serverError && (
                    <div className="auth-toast">
                        <AlertCircle size={16} />
                        {serverError}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {/* Email */}
                    <div className="auth-input-group">
                        <label className="auth-label" htmlFor="login-email">Email</label>
                        <div className="auth-input-wrap">
                            <Mail size={18} className="auth-input-icon" />
                            <input
                                ref={emailRef}
                                id="login-email"
                                className={`auth-input ${errors.email ? 'error' : ''}`}
                                type="email"
                                name="email"
                                placeholder="你的電子郵件"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </div>
                        {errors.email && (
                            <span className="auth-error"><AlertCircle size={13} />{errors.email}</span>
                        )}
                    </div>

                    {/* 密碼 */}
                    <div className="auth-input-group">
                        <label className="auth-label" htmlFor="login-password">密碼</label>
                        <div className="auth-input-wrap">
                            <Lock size={18} className="auth-input-icon" />
                            <input
                                id="login-password"
                                className={`auth-input ${errors.password ? 'error' : ''}`}
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="輸入密碼"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="auth-error"><AlertCircle size={13} />{errors.password}</span>
                        )}
                    </div>

                    {/* 記住我 & 忘記密碼 */}
                    <div className="auth-options">
                        <label className="auth-checkbox-label">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            記住我
                        </label>
                        <Link to="/auth/forgot-password" className="auth-forgot-link">
                            忘記密碼？
                        </Link>
                    </div>

                    {/* 登入按鈕 */}
                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="auth-spinner" />
                        ) : (
                            <>
                                <LogIn size={18} />
                                登入
                            </>
                        )}
                    </button>
                </form>

                {/* 分隔線 */}
                <div className="auth-divider">或使用以下方式登入</div>

                {/* 第三方登入 */}
                <div className="auth-oauth-group">
                    <button className="auth-oauth-btn" type="button">
                        <GoogleIcon />
                        使用 Google 帳號登入
                    </button>
                    <button className="auth-oauth-btn" type="button">
                        <FacebookIcon />
                        使用 Facebook 帳號登入
                    </button>
                </div>

                {/* 測試帳號提示 */}
                <div style={{
                    marginTop: 'var(--space-sm)',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(44, 145, 140, 0.1)',
                    border: '1px solid rgba(44, 145, 140, 0.3)',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                }}>
                    <strong style={{ color: 'var(--primary)' }}>🧪 測試帳號</strong><br />
                    Email: <code>test@example.com</code><br />
                    密碼: <code>Test1234</code>
                </div>

                {/* 切換連結 */}
                <div className="auth-switch">
                    還沒有帳號？
                    <Link to="/auth/register">立即註冊</Link>
                </div>
            </div>
        </div>
    );
}
