import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

const STORAGE_KEY = 'sunny_learning_metrics'; // Reusing or new key? Let's use new
const NOTIFICATION_STORAGE_KEY = 'sunny_learning_notifications';

// Mock Data
const MOCK_NOTIFICATIONS = [
    {
        id: 'n1',
        type: 'course',
        title: '課程更新通知',
        description: '您購買的《Python 資料科學實戰》新增了第 8 章：深度學習導論。',
        time: '10 分鐘前',
        isRead: false,
        link: '/dashboard/my-courses'
    },
    {
        id: 'n2',
        type: 'order',
        title: '訂單完成',
        description: '您的訂單 #ORD-20231024-001 已付款成功，現在可以開始學習了。',
        time: '2 小時前',
        isRead: false,
        link: '/dashboard/history'
    },
    {
        id: 'n3',
        type: 'consult',
        title: '諮詢即將開始',
        description: '您預約的「職涯諮詢」將在 30 分鐘後開始，請準備好參與。',
        time: '30 分鐘前',
        isRead: false,
        link: '/dashboard/consult'
    },
    {
        id: 'n4',
        type: 'system',
        title: '平台維護公告',
        description: '系統將於本週日凌晨 02:00 進行例行維護，預計暫停服務 2 小時。',
        time: '1 天前',
        isRead: true,
        link: '#'
    },
    {
        id: 'n5',
        type: 'course',
        title: '作業批改完成',
        description: '老師已經批改了您的《機器學習基礎》期末作業，快來查看回饋吧！',
        time: '2 天前',
        isRead: true,
        link: '/dashboard/my-courses'
    }
];

export function NotificationProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // Initial load
    useEffect(() => {
        if (!isAuthenticated) {
            setNotifications([]);
            return;
        }

        // Try load from storage or use mock
        const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
        if (stored) {
            setNotifications(JSON.parse(stored));
        } else {
            setNotifications(MOCK_NOTIFICATIONS);
        }
    }, [isAuthenticated]);

    // Persist changes
    useEffect(() => {
        if (isAuthenticated && notifications.length > 0) {
            localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
        }
    }, [notifications, isAuthenticated]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = useCallback((id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        ));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }, []);

    const deleteNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const closeDropdown = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            isOpen,
            toggleDropdown,
            closeDropdown
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
    return ctx;
}
