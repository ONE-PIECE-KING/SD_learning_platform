import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BookOpen, Mail, Lock, Eye, EyeOff, User,
    AlertCircle, UserPlus,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthPage.css';

/**
 * 註冊頁面 — /auth/register
 * 使用 AuthContext 進行註冊
 */

/* 密碼強度計算 */
function getPasswordStrength(password) {
    if (!password) return { level: 0, label: '', className: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 1, label: '弱', className: 'weak' };
    if (score <= 3) return { level: 2, label: '中', className: 'fair' };
    return { level: 3, label: '強', className: 'strong' };
}

export default function RegisterPage() {
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const nameRef = useRef(null);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const passwordStrength = getPasswordStrength(form.password);

    // 已登入 → 導回首頁
    useEffect(() => {
        if (isAuthenticated) navigate('/', { replace: true });
    }, [isAuthenticated, navigate]);

    // 自動聚焦
    useEffect(() => { nameRef.current?.focus(); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
        if (serverError) setServerError('');
    };

    const validate = () => {
        const errs = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!form.name.trim()) errs.name = '請輸入姓名';
        if (!form.email) errs.email = '請輸入 Email';
        else if (!emailRegex.test(form.email)) errs.email = '請輸入有效的 Email 格式';
        if (!form.password) errs.password = '請輸入密碼';
        else if (!passRegex.test(form.password)) errs.password = '密碼至少 8 字元，需包含大小寫字母及數字';
        if (!form.passwordConfirm) errs.passwordConfirm = '請再次輸入密碼';
        else if (form.password !== form.passwordConfirm) errs.passwordConfirm = '兩次密碼不一致';
        if (!agreeTerms) errs.terms = '請先同意服務條款與隱私權政策';
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

        const result = await register(form.name, form.email);

        if (result.success) {
            // 註冊成功 → 自動登入 → 導回首頁
            navigate('/');
        } else {
            setServerError(result.error || '註冊失敗，請再試一次');
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

                <h1 className="auth-title">建立帳號</h1>
                <p className="auth-subtitle">開始你的資料科學學習旅程</p>

                {/* 伺服器錯誤 */}
                {serverError && (
                    <div className="auth-toast">
                        <AlertCircle size={16} />
                        {serverError}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {/* 姓名 */}
                    <div className="auth-input-group">
                        <label className="auth-label" htmlFor="reg-name">姓名</label>
                        <div className="auth-input-wrap">
                            <User size={18} className="auth-input-icon" />
                            <input
                                ref={nameRef}
                                id="reg-name"
                                className={`auth-input ${errors.name ? 'error' : ''}`}
                                type="text"
                                name="name"
                                placeholder="你的姓名"
                                value={form.name}
                                onChange={handleChange}
                                autoComplete="name"
                            />
                        </div>
                        {errors.name && (
                            <span className="auth-error"><AlertCircle size={13} />{errors.name}</span>
                        )}
                    </div>

                    {/* Email */}
                    <div className="auth-input-group">
                        <label className="auth-label" htmlFor="reg-email">Email</label>
                        <div className="auth-input-wrap">
                            <Mail size={18} className="auth-input-icon" />
                            <input
                                id="reg-email"
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
                        <label className="auth-label" htmlFor="reg-password">密碼</label>
                        <div className="auth-input-wrap">
                            <Lock size={18} className="auth-input-icon" />
                            <input
                                id="reg-password"
                                className={`auth-input ${errors.password ? 'error' : ''}`}
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="設定密碼（至少 8 字元）"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
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
                        {/* 密碼強度指示 */}
                        {form.password && (
                            <>
                                <div className="password-strength">
                                    {[1, 2, 3].map((n) => (
                                        <div
                                            key={n}
                                            className={`password-strength-bar ${n <= passwordStrength.level ? `active ${passwordStrength.className}` : ''}`}
                                        />
                                    ))}
                                </div>
                                <span className={`password-strength-text ${passwordStrength.className}`}>
                                    密碼強度：{passwordStrength.label}
                                </span>
                            </>
                        )}
                        {errors.password && (
                            <span className="auth-error"><AlertCircle size={13} />{errors.password}</span>
                        )}
                    </div>

                    {/* 確認密碼 */}
                    <div className="auth-input-group">
                        <label className="auth-label" htmlFor="reg-password-confirm">確認密碼</label>
                        <div className="auth-input-wrap">
                            <Lock size={18} className="auth-input-icon" />
                            <input
                                id="reg-password-confirm"
                                className={`auth-input ${errors.passwordConfirm ? 'error' : ''}`}
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="passwordConfirm"
                                placeholder="再次輸入密碼"
                                value={form.passwordConfirm}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? '隱藏密碼' : '顯示密碼'}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.passwordConfirm && (
                            <span className="auth-error"><AlertCircle size={13} />{errors.passwordConfirm}</span>
                        )}
                    </div>

                    {/* 服務條款 */}
                    <div className="auth-input-group">
                        <label className="auth-terms-label">
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => {
                                    setAgreeTerms(e.target.checked);
                                    if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }));
                                }}
                            />
                            <span>
                                我已閱讀並同意{' '}
                                <Link to="/legal/terms">服務條款</Link>{' '}與{' '}
                                <Link to="/legal/privacy">隱私權政策</Link>
                            </span>
                        </label>
                        {errors.terms && (
                            <span className="auth-error"><AlertCircle size={13} />{errors.terms}</span>
                        )}
                    </div>

                    {/* 註冊按鈕 */}
                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="auth-spinner" />
                        ) : (
                            <>
                                <UserPlus size={18} />
                                建立帳號
                            </>
                        )}
                    </button>
                </form>

                {/* 切換連結 */}
                <div className="auth-switch">
                    已有帳號？
                    <Link to="/auth/login">立即登入</Link>
                </div>
            </div>
        </div>
    );
}
