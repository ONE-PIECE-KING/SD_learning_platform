import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar, Clock, CheckCircle, Video, Phone,
    ChevronLeft, ChevronRight, Star, FileText, Upload,
    XCircle, Plus
} from 'lucide-react';
import './DashboardConsultPage.css';

/**
 * Dashboard 一對一諮詢頁面
 * 包含「我的預約」與「預約諮詢」兩大功能區
 */
export default function DashboardConsultPage() {
    const [activeTab, setActiveTab] = useState('appointments');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState('60min');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [formData, setFormData] = useState({ topic: '', goals: '' });

    // ========== Mock 資料 ==========

    const stats = [
        { title: '即將到來', value: 2, icon: Calendar, variant: 'primary' },
        { title: '已完成諮詢', value: 8, icon: CheckCircle, variant: 'success' },
        { title: '累計時數', value: '12h', icon: Clock, variant: 'accent' },
        { title: '平均評分', value: '4.9', icon: Star, variant: 'warning' },
    ];

    const appointments = [
        {
            id: 1,
            consultantName: 'Sunny 老師',
            date: '2026-03-05',
            time: '14:00 - 15:00',
            method: 'Google Meet',
            methodIcon: Video,
            topic: '資料科學轉職策略與履歷健檢',
            plan: '60 分鐘深度諮詢',
            price: 2500,
            status: 'upcoming',
        },
        {
            id: 2,
            consultantName: 'Sunny 老師',
            date: '2026-03-12',
            time: '10:00 - 10:30',
            method: '語音通話',
            methodIcon: Phone,
            topic: '模擬面試練習 — Python & SQL',
            plan: '30 分鐘快速諮詢',
            price: 1500,
            status: 'upcoming',
        },
        {
            id: 3,
            consultantName: 'Sunny 老師',
            date: '2026-02-20',
            time: '15:00 - 16:00',
            method: 'Google Meet',
            methodIcon: Video,
            topic: '職涯規劃：從分析師到資料工程師',
            plan: '60 分鐘深度諮詢',
            price: 2500,
            status: 'completed',
        },
        {
            id: 4,
            consultantName: 'Sunny 老師',
            date: '2026-02-10',
            time: '11:00 - 11:30',
            method: '語音通話',
            methodIcon: Phone,
            topic: '學習路線規劃諮詢',
            plan: '30 分鐘快速諮詢',
            price: 1500,
            status: 'completed',
        },
        {
            id: 5,
            consultantName: 'Sunny 老師',
            date: '2026-01-28',
            time: '14:00 - 15:00',
            method: 'Google Meet',
            methodIcon: Video,
            topic: '作品集審閱與改善建議',
            plan: '60 分鐘深度諮詢',
            price: 2500,
            status: 'cancelled',
        },
    ];

    const plans = [
        { id: '30min', name: '30 分鐘快速諮詢', desc: '單一問題聚焦討論', price: 1500 },
        { id: '60min', name: '60 分鐘深度諮詢', desc: '全面性問題診斷與規劃', price: 2500 },
    ];

    // 可預約時段（依日期對照）
    const availableSlots = {
        5: ['09:00', '10:00', '14:00', '15:00', '16:00'],
        6: ['10:00', '11:00', '14:00'],
        8: ['09:00', '10:00', '15:00', '16:00'],
        12: ['10:00', '14:00', '15:00'],
        13: ['09:00', '11:00', '14:00', '16:00'],
        15: ['10:00', '14:00'],
        19: ['09:00', '10:00', '14:00', '15:00'],
        20: ['11:00', '14:00', '16:00'],
        22: ['09:00', '10:00', '11:00'],
        26: ['14:00', '15:00', '16:00'],
        27: ['09:00', '10:00', '14:00', '15:00'],
    };

    // ========== 行事曆邏輯 ==========

    const calendarData = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        const days = [];

        // 前方空白
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: null, type: 'empty' });
        }

        // 日期格子
        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(year, month, d);
            const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isToday = dateObj.toDateString() === today.toDateString();
            const hasSlots = !!availableSlots[d];

            days.push({
                day: d,
                type: isPast ? 'disabled' : 'normal',
                isToday,
                hasSlots: !isPast && hasSlots,
            });
        }

        return days;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMonth]);

    const monthLabel = currentMonth.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
    });

    const navigateMonth = (direction) => {
        setCurrentMonth(prev => {
            const next = new Date(prev);
            next.setMonth(next.getMonth() + direction);
            return next;
        });
        setSelectedDate(null);
        setSelectedSlot(null);
    };

    const handleDateClick = (day) => {
        if (!day || day.type === 'disabled' || day.type === 'empty') return;
        setSelectedDate(day.day);
        setSelectedSlot(null);
    };

    // ========== 篩選預約 ==========

    const filteredAppointments = appointments.filter(apt => {
        if (statusFilter === 'all') return true;
        return apt.status === statusFilter;
    });

    // ========== 日期格式化 ==========

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return {
            month: d.toLocaleDateString('zh-TW', { month: 'short' }),
            day: d.getDate(),
            weekday: d.toLocaleDateString('zh-TW', { weekday: 'short' }),
        };
    };

    const selectedPlanData = plans.find(p => p.id === selectedPlan);

    // ========== Render ==========

    return (
        <div className="consult-page">
            {/* 頁面標頭 */}
            <div className="page-header">
                <h1>一對一諮詢</h1>
                <div className="page-header-actions">
                    <Link to="/consult" className="btn btn-primary btn-sm">
                        <Plus size={16} />
                        前往諮詢頁面
                    </Link>
                </div>
            </div>

            {/* 統計卡片 */}
            <div className="consult-stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="consult-stat-card">
                        <div className={`consult-stat-icon ${stat.variant}`}>
                            <stat.icon size={22} />
                        </div>
                        <div className="consult-stat-info">
                            <h3>{stat.title}</h3>
                            <div className="stat-value">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 分頁標籤 */}
            <div className="consult-tabs">
                <button
                    className={`consult-tab ${activeTab === 'appointments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('appointments')}
                >
                    <Calendar size={16} />
                    我的預約
                </button>
                <button
                    className={`consult-tab ${activeTab === 'booking' ? 'active' : ''}`}
                    onClick={() => setActiveTab('booking')}
                >
                    <Plus size={16} />
                    預約諮詢
                </button>
            </div>

            {/* ===== Tab: 我的預約 ===== */}
            {activeTab === 'appointments' && (
                <>
                    {/* 篩選 */}
                    <div className="consult-filter-bar">
                        {[
                            { key: 'all', label: '全部' },
                            { key: 'upcoming', label: '即將到來' },
                            { key: 'completed', label: '已完成' },
                            { key: 'cancelled', label: '已取消' },
                        ].map(f => (
                            <button
                                key={f.key}
                                className={`filter-chip ${statusFilter === f.key ? 'active' : ''}`}
                                onClick={() => setStatusFilter(f.key)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* 預約列表 */}
                    {filteredAppointments.length > 0 ? (
                        <div className="appointment-list">
                            {filteredAppointments.map(apt => {
                                const dateInfo = formatDate(apt.date);
                                return (
                                    <div key={apt.id} className="appointment-card">
                                        {/* 日期區塊 */}
                                        <div className={`appointment-date-block ${apt.status}`}>
                                            <span className="date-month">{dateInfo.month}</span>
                                            <span className="date-day">{dateInfo.day}</span>
                                            <span className="date-weekday">{dateInfo.weekday}</span>
                                        </div>

                                        {/* 內容 */}
                                        <div className="appointment-info">
                                            <h3>{apt.consultantName} — {apt.plan}</h3>
                                            <div className="appointment-meta">
                                                <span className="appointment-meta-item">
                                                    <Clock size={14} />
                                                    {apt.time}
                                                </span>
                                                <span className="appointment-meta-item">
                                                    <apt.methodIcon size={14} />
                                                    {apt.method}
                                                </span>
                                            </div>
                                            <div className="appointment-topic">
                                                <FileText size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                                {apt.topic}
                                            </div>
                                        </div>

                                        {/* 狀態與操作 */}
                                        <div className="appointment-status">
                                            <span className={`status-tag ${apt.status}`}>
                                                {apt.status === 'upcoming' && '即將到來'}
                                                {apt.status === 'completed' && '已完成'}
                                                {apt.status === 'cancelled' && '已取消'}
                                            </span>
                                            <div className="appointment-actions">
                                                {apt.status === 'upcoming' && (
                                                    <>
                                                        <button className="btn btn-primary btn-sm">
                                                            <Video size={14} />
                                                            加入會議
                                                        </button>
                                                        <button className="btn btn-outline-danger btn-sm">
                                                            <XCircle size={14} />
                                                            取消
                                                        </button>
                                                    </>
                                                )}
                                                {apt.status === 'completed' && (
                                                    <button className="btn btn-secondary btn-sm">
                                                        <Star size={14} />
                                                        評價
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <Calendar size={36} />
                            </div>
                            <h3>尚無諮詢紀錄</h3>
                            <p>預約一場諮詢，與導師一對一探討你的學習與職涯規劃</p>
                            <button
                                className="btn btn-primary btn-md"
                                onClick={() => setActiveTab('booking')}
                            >
                                <Plus size={16} />
                                立即預約
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* ===== Tab: 預約諮詢 ===== */}
            {activeTab === 'booking' && (
                <div className="booking-layout">
                    {/* 左側：行事曆 + 時段 */}
                    <div className="booking-calendar-section">
                        {/* 行事曆標頭 */}
                        <div className="calendar-header">
                            <h3>選擇日期</h3>
                            <div className="calendar-nav">
                                <button onClick={() => navigateMonth(-1)} aria-label="上個月">
                                    <ChevronLeft size={18} />
                                </button>
                                <span>{monthLabel}</span>
                                <button onClick={() => navigateMonth(1)} aria-label="下個月">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        {/* 星期標題 */}
                        <div className="calendar-grid">
                            {['日', '一', '二', '三', '四', '五', '六'].map(w => (
                                <div key={w} className="calendar-weekday">{w}</div>
                            ))}

                            {/* 日期格 */}
                            {calendarData.map((d, i) => (
                                <div
                                    key={i}
                                    className={[
                                        'calendar-day',
                                        d.type === 'empty' ? 'empty' : '',
                                        d.type === 'disabled' ? 'disabled' : '',
                                        d.isToday ? 'today' : '',
                                        d.hasSlots ? 'has-slots' : '',
                                        selectedDate === d.day ? 'selected' : '',
                                    ].filter(Boolean).join(' ')}
                                    onClick={() => handleDateClick(d)}
                                >
                                    {d.day}
                                </div>
                            ))}
                        </div>

                        {/* 時段選擇 */}
                        <div className="time-slots-section">
                            <h4>
                                {selectedDate
                                    ? `${currentMonth.getMonth() + 1} 月 ${selectedDate} 日可預約時段`
                                    : '請先選擇日期'
                                }
                            </h4>
                            {selectedDate && availableSlots[selectedDate] ? (
                                <div className="time-slots-grid">
                                    {availableSlots[selectedDate].map(slot => (
                                        <button
                                            key={slot}
                                            className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
                                            onClick={() => setSelectedSlot(slot)}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            ) : selectedDate ? (
                                <div className="no-slots-message">
                                    該日期暫無可預約時段，請選擇其他日期
                                </div>
                            ) : (
                                <div className="no-slots-message">
                                    點擊日曆上有標記的日期查看可預約時段
                                </div>
                            )}
                        </div>

                        {/* 諮詢需求表單 */}
                        <div className="consult-form-section">
                            <h4>諮詢需求</h4>
                            <div className="form-group">
                                <label>
                                    諮詢主題 <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="例：資料科學轉職規劃、Python 學習路線諮詢"
                                    value={formData.topic}
                                    onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>預期目標</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="您希望透過這次諮詢達成什麼？"
                                    value={formData.goals}
                                    onChange={e => setFormData({ ...formData, goals: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="form-group">
                                <label>附件上傳</label>
                                <button className="btn btn-secondary btn-sm">
                                    <Upload size={14} />
                                    上傳履歷 / 作品集
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 右側：預約摘要 */}
                    <div className="booking-summary-sidebar">
                        <div className="booking-summary-card">
                            <h3>預約摘要</h3>

                            {/* 導師資訊 */}
                            <div className="consultant-mini-card">
                                <div className="consultant-avatar">S</div>
                                <div className="consultant-mini-info">
                                    <h4>Sunny 老師</h4>
                                    <p>資料科學 · 職涯規劃</p>
                                    <div className="consultant-rating">
                                        <Star size={12} fill="currentColor" />
                                        4.9 <span>(128 則評價)</span>
                                    </div>
                                </div>
                            </div>

                            {/* 方案選擇 */}
                            <div className="plan-options">
                                {plans.map(plan => (
                                    <button
                                        key={plan.id}
                                        className={`plan-option ${selectedPlan === plan.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedPlan(plan.id)}
                                    >
                                        <div className="plan-radio">
                                            <div className="plan-radio-inner" />
                                        </div>
                                        <div className="plan-details">
                                            <div className="plan-name">{plan.name}</div>
                                            <div className="plan-desc">{plan.desc}</div>
                                        </div>
                                        <div className="plan-price">NT$ {plan.price.toLocaleString()}</div>
                                    </button>
                                ))}
                            </div>

                            {/* 預約明細 */}
                            <div className="booking-details">
                                <div className="booking-detail-row">
                                    <span className="label">日期</span>
                                    <span className="value">
                                        {selectedDate
                                            ? `${currentMonth.getFullYear()}/${currentMonth.getMonth() + 1}/${selectedDate}`
                                            : '—'
                                        }
                                    </span>
                                </div>
                                <div className="booking-detail-row">
                                    <span className="label">時段</span>
                                    <span className="value">{selectedSlot || '—'}</span>
                                </div>
                                <div className="booking-detail-row">
                                    <span className="label">方案</span>
                                    <span className="value">{selectedPlanData?.name || '—'}</span>
                                </div>
                                <div className="booking-detail-row">
                                    <span className="label">諮詢方式</span>
                                    <span className="value">Google Meet 視訊</span>
                                </div>
                                <div className="booking-detail-row total">
                                    <span className="label">合計</span>
                                    <span className="value">
                                        NT$ {selectedPlanData?.price.toLocaleString() || '0'}
                                    </span>
                                </div>
                            </div>

                            {/* 送出按鈕 */}
                            <button
                                className="btn btn-primary btn-md booking-submit-btn"
                                disabled={!selectedDate || !selectedSlot || !formData.topic}
                            >
                                <Calendar size={16} />
                                確認預約
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
