import { useState, useRef, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import NotificationItem from './NotificationItem';
import './NotificationDropdown.css';

export default function NotificationDropdown() {
    const {
        notifications, unreadCount, isOpen, toggleDropdown, closeDropdown, markAllAsRead
    } = useNotification();
    const dropdownRef = useRef(null);
    const [filter, setFilter] = useState('all');

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
    }, [isOpen, closeDropdown]);

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        return n.type === filter;
    });

    return (
        <div className="notification-wrapper" ref={dropdownRef}>
            <button
                className="notification-trigger"
                onClick={toggleDropdown}
                aria-label={`通知 (${unreadCount} 未讀)`}
            >
                <Bell size={20} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
            </button>

            <div className={`notification-dropdown ${isOpen ? 'open' : ''}`}>
                <div className="dropdown-header">
                    <h3>通知</h3>
                    <button className="mark-read-btn" onClick={markAllAsRead}>
                        <Check size={14} />
                        全部標為已讀
                    </button>
                </div>

                <div className="dropdown-tabs">
                    {['all', 'course', 'order', 'consult', 'system'].map(type => (
                        <button
                            key={type}
                            className={`tab-btn ${filter === type ? 'active' : ''}`}
                            onClick={() => setFilter(type)}
                        >
                            {type === 'all' ? '全部' :
                                type === 'course' ? '課程' :
                                    type === 'order' ? '訂單' :
                                        type === 'consult' ? '諮詢' : '系統'}
                        </button>
                    ))}
                </div>

                <div className="dropdown-list">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map(n => (
                            <NotificationItem key={n.id} notification={n} />
                        ))
                    ) : (
                        <div className="empty-notification">
                            <Bell size={32} className="empty-icon" />
                            <p>目前沒有通知</p>
                        </div>
                    )}
                </div>

                <div className="dropdown-footer">
                    <button className="view-all-link" onClick={closeDropdown}>
                        查看全部通知
                    </button>
                </div>
            </div>
        </div>
    );
}
