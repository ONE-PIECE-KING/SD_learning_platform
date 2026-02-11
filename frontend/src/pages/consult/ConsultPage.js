import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Star, Clock, Users, MessageSquare, Calendar, Video,
    ChevronLeft, ChevronRight, Upload, Send,
    CheckCircle, Award, Zap,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import './ConsultPage.css';

/* ═══════════════════════════════════════
   導師資料 & 諮詢方案（Mock Data）
   ═══════════════════════════════════════ */
const CONSULTANT = {
    name: '桑尼',
    title: '資深資料科學家 / 轉職教練',
    avatar: null,
    tags: ['職涯規劃', '資料科學', '面試技巧', '履歷健檢', 'AI 應用'],
    totalConsultations: 320,
    avgRating: 4.9,
    responseTime: '24 小時內',
    bio: '擁有超過 8 年的資料科學與機器學習實戰經驗，曾任職於多家知名科技公司。曾成功輔導超過 200 位學員順利轉職進入資料科學領域。專精於職涯規劃、技術面試準備、履歷優化，以及 AI 工具應用落地。不論你是初入職場的新人，還是想轉換跑道的資深工作者，都能提供最適合你的建議。',
};

const PLANS = [
    {
        id: 'quick',
        name: '快速諮詢',
        duration: '30 分鐘',
        price: 1200,
        method: 'Google Meet 視訊',
        popular: false,
    },
    {
        id: 'standard',
        name: '標準諮詢',
        duration: '60 分鐘',
        price: 2000,
        method: 'Google Meet 視訊',
        popular: true,
    },
    {
        id: 'deep',
        name: '深度諮詢',
        duration: '90 分鐘',
        price: 2800,
        method: 'Google Meet 視訊 + 書面報告',
        popular: false,
    },
];

/* 時段表（模擬 API） */
const AVAILABLE_SLOTS = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30', '19:00',
    '19:30', '20:00',
];

/* ═══ 日曆工具函式 ═══ */
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
    return new Date(year, month, 1).getDay();
}

function formatMonth(year, month) {
    const months = ['一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'];
    return `${year} 年 ${months[month]}`;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

/* ═══════════════════════════════════════
   ConsultPage 主元件
   ═══════════════════════════════════════ */
export default function ConsultPage() {
    const today = new Date();

    /* 方案 */
    const [selectedPlan, setSelectedPlan] = useState('standard');

    /* 日曆 */
    const [calYear, setCalYear] = useState(today.getFullYear());
    const [calMonth, setCalMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState(null);

    /* 時段 */
    const [selectedSlot, setSelectedSlot] = useState(null);

    /* 表單 */
    const [topic, setTopic] = useState('');
    const [goals, setGoals] = useState('');

    /* 自動捲頂 */
    useEffect(() => { window.scrollTo(0, 0); }, []);

    /* 日曆資料 */
    const calendarDays = useMemo(() => {
        const daysInMonth = getDaysInMonth(calYear, calMonth);
        const firstDay = getFirstDayOfWeek(calYear, calMonth);
        const prevMonth = calMonth === 0 ? 11 : calMonth - 1;
        const prevYear = calMonth === 0 ? calYear - 1 : calYear;
        const daysInPrev = getDaysInMonth(prevYear, prevMonth);

        const days = [];

        // 前一個月的尾巴
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({ day: daysInPrev - i, type: 'prev' });
        }

        // 當月
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(calYear, calMonth, d);
            const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isToday = d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
            // 模擬：週日不可預約
            const isUnavailable = date.getDay() === 0;
            days.push({
                day: d,
                type: 'current',
                isPast,
                isToday,
                isUnavailable,
                dateStr: `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
            });
        }

        // 補齊到 42 格（6×7）
        const remaining = 42 - days.length;
        for (let d = 1; d <= remaining; d++) {
            days.push({ day: d, type: 'next' });
        }

        return days;
    }, [calYear, calMonth, today]);

    /* 模擬部分時段已被預約 */
    const bookedSlots = useMemo(() => {
        if (!selectedDate) return [];
        // 隨機讓部分時段看起來已預約
        const seed = selectedDate.split('-').reduce((a, b) => a + parseInt(b), 0);
        return AVAILABLE_SLOTS.filter((_, i) => (seed + i) % 5 === 0);
    }, [selectedDate]);

    /* 切換月份 */
    const prevMonth = () => {
        if (calMonth === 0) { setCalYear(calYear - 1); setCalMonth(11); }
        else { setCalMonth(calMonth - 1); }
    };
    const nextMonth = () => {
        if (calMonth === 11) { setCalYear(calYear + 1); setCalMonth(0); }
        else { setCalMonth(calMonth + 1); }
    };

    /* 當前選取方案 */
    const currentPlan = PLANS.find((p) => p.id === selectedPlan);

    /* 是否可提交 */
    const canBook = selectedPlan && selectedDate && selectedSlot && topic.trim().length > 0;

    return (
        <div className="consult-page">
            <Header />
            <main>
                {/* ═══ Hero ═══ */}
                <section className="consult-hero">
                    <div className="consult-hero-inner">
                        <span className="consult-hero-badge">
                            <MessageSquare size={14} />
                            一對一專屬諮詢
                        </span>
                        <h1>與桑尼一對一諮詢</h1>
                        <p className="consult-hero-sub">
                            無論是職涯規劃、技術面試準備，還是資料科學學習方向，
                            桑尼將提供最專業且個人化的建議。
                        </p>
                    </div>
                </section>

                {/* ═══ 主要內容 ═══ */}
                <div className="consult-body">
                    {/* ─── 左側 ─── */}
                    <div className="consult-content">

                        {/* ── 導師檔案 ── */}
                        <div className="consult-profile">
                            <div className="consult-avatar">
                                {CONSULTANT.name.charAt(0)}
                            </div>
                            <div className="consult-profile-info">
                                <h2 className="consult-name">{CONSULTANT.name}</h2>
                                <p className="consult-title">{CONSULTANT.title}</p>
                                <div className="consult-tags">
                                    {CONSULTANT.tags.map((tag) => (
                                        <span className="consult-tag" key={tag}>{tag}</span>
                                    ))}
                                </div>
                                <div className="consult-stats">
                                    <span className="consult-stat">
                                        <MessageSquare size={14} />
                                        <strong>{CONSULTANT.totalConsultations}</strong> 次諮詢
                                    </span>
                                    <span className="consult-stat">
                                        <Star size={14} fill="currentColor" strokeWidth={0} style={{ color: 'var(--warning)' }} />
                                        <strong>{CONSULTANT.avgRating}</strong> 平均評分
                                    </span>
                                    <span className="consult-stat">
                                        <Zap size={14} />
                                        <strong>{CONSULTANT.responseTime}</strong> 回覆
                                    </span>
                                </div>
                                <p className="consult-bio">{CONSULTANT.bio}</p>
                            </div>
                        </div>

                        {/* ── 諮詢方案 ── */}
                        <div>
                            <h3 className="consult-section-title">
                                <Award size={20} className="consult-section-title-icon" />
                                選擇諮詢方案
                            </h3>
                            <div className="consult-plans">
                                {PLANS.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`consult-plan ${selectedPlan === plan.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedPlan(plan.id)}
                                    >
                                        {plan.popular && <span className="consult-plan-popular">最多人選</span>}
                                        <h4 className="consult-plan-name">{plan.name}</h4>
                                        <p className="consult-plan-duration">{plan.duration}</p>
                                        <div className="consult-plan-price">NT$ {plan.price.toLocaleString()}</div>
                                        <div className="consult-plan-method">
                                            <Video size={14} />
                                            {plan.method}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── 日曆 + 時段 ── */}
                        <div className="consult-calendar-section">
                            <h3 className="consult-section-title">
                                <Calendar size={20} className="consult-section-title-icon" />
                                選擇日期與時段
                            </h3>

                            <div className="consult-calendar">
                                {/* 月份導航 */}
                                <div className="consult-calendar-nav">
                                    <button className="consult-calendar-nav-btn" onClick={prevMonth}>
                                        <ChevronLeft size={18} />
                                    </button>
                                    <span className="consult-calendar-month">
                                        {formatMonth(calYear, calMonth)}
                                    </span>
                                    <button className="consult-calendar-nav-btn" onClick={nextMonth}>
                                        <ChevronRight size={18} />
                                    </button>
                                </div>

                                {/* 星期標頭 */}
                                <div className="consult-calendar-grid">
                                    {WEEKDAYS.map((w) => (
                                        <span className="consult-calendar-weekday" key={w}>{w}</span>
                                    ))}

                                    {/* 日期格 */}
                                    {calendarDays.map((d, i) => {
                                        if (d.type !== 'current') {
                                            return (
                                                <button key={i} className="consult-calendar-day other-month disabled" disabled>
                                                    {d.day}
                                                </button>
                                            );
                                        }
                                        const isDisabled = d.isPast || d.isUnavailable;
                                        const isSelected = selectedDate === d.dateStr;
                                        return (
                                            <button
                                                key={i}
                                                className={`consult-calendar-day ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''} ${d.isToday ? 'today' : ''}`}
                                                disabled={isDisabled}
                                                onClick={() => {
                                                    setSelectedDate(d.dateStr);
                                                    setSelectedSlot(null);
                                                }}
                                            >
                                                {d.day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 時段 */}
                            {selectedDate && (
                                <>
                                    <p className="consult-slots-title">
                                        {selectedDate.replace(/-/g, '/')} 可預約時段
                                    </p>
                                    <div className="consult-slots">
                                        {AVAILABLE_SLOTS.map((slot) => {
                                            const isBooked = bookedSlots.includes(slot);
                                            const isSelected = selectedSlot === slot;
                                            return (
                                                <button
                                                    key={slot}
                                                    className={`consult-slot ${isBooked ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
                                                    disabled={isBooked}
                                                    onClick={() => setSelectedSlot(slot)}
                                                >
                                                    {slot}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ── 需求表單 ── */}
                        <div>
                            <h3 className="consult-section-title">
                                <Send size={20} className="consult-section-title-icon" />
                                諮詢需求
                            </h3>
                            <div className="consult-form">
                                <div className="consult-form-group">
                                    <label className="consult-form-label">
                                        諮詢主題 <span className="required">*</span>
                                    </label>
                                    <textarea
                                        className="consult-form-textarea"
                                        placeholder="請描述你想諮詢的問題，例如：想轉職進入資料科學領域，目前是行銷背景..."
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                    />
                                </div>

                                <div className="consult-form-group">
                                    <label className="consult-form-label">附件上傳</label>
                                    <div className="consult-upload">
                                        <Upload size={24} className="consult-upload-icon" />
                                        <span className="consult-upload-text">點擊或拖拽上傳檔案</span>
                                        <span className="consult-upload-hint">支援 PDF、DOC、PPT，最大 10MB</span>
                                    </div>
                                </div>

                                <div className="consult-form-group">
                                    <label className="consult-form-label">預期目標</label>
                                    <textarea
                                        className="consult-form-textarea"
                                        placeholder="例如：希望能釐清轉職方向、獲得履歷修改建議..."
                                        style={{ minHeight: 80 }}
                                        value={goals}
                                        onChange={(e) => setGoals(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── 社群連結 ── */}
                        <div>
                            <h3 className="consult-section-title">
                                <MessageSquare size={20} className="consult-section-title-icon" />
                                即時聯繫
                            </h3>
                            <div className="consult-social">
                                <a href="https://line.me" target="_blank" rel="noopener noreferrer" className="consult-social-btn line">
                                    LINE 官方帳號
                                </a>
                                <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="consult-social-btn discord">
                                    Discord 社群
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ─── 右側 Sticky 預約摘要 ─── */}
                    <aside className="consult-sidebar">
                        <div className="consult-summary">
                            <h3 className="consult-summary-title">預約摘要</h3>

                            <div className="consult-summary-row">
                                <span>諮詢方案</span>
                                <span className="consult-summary-value">
                                    {currentPlan ? currentPlan.name : '—'}
                                </span>
                            </div>
                            <div className="consult-summary-row">
                                <span>時長</span>
                                <span className="consult-summary-value">
                                    {currentPlan ? currentPlan.duration : '—'}
                                </span>
                            </div>
                            <div className="consult-summary-row">
                                <span>日期</span>
                                <span className="consult-summary-value">
                                    {selectedDate ? selectedDate.replace(/-/g, '/') : '—'}
                                </span>
                            </div>
                            <div className="consult-summary-row">
                                <span>時段</span>
                                <span className="consult-summary-value">
                                    {selectedSlot || '—'}
                                </span>
                            </div>
                            <div className="consult-summary-row">
                                <span>方式</span>
                                <span className="consult-summary-value">
                                    {currentPlan ? 'Google Meet' : '—'}
                                </span>
                            </div>

                            <div className="consult-summary-total">
                                <span className="consult-summary-total-label">總金額</span>
                                <span className="consult-summary-total-price">
                                    NT$ {currentPlan ? currentPlan.price.toLocaleString() : '0'}
                                </span>
                            </div>

                            <button className="consult-book-btn" disabled={!canBook}>
                                <CheckCircle size={18} />
                                立即預約
                            </button>

                            <p className="consult-summary-note">
                                預約成功後系統將自動發送確認信與 Google Meet 連結。
                                諮詢前 24 小時可免費取消。
                            </p>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
}
