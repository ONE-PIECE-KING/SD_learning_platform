import {
    BookOpen, CheckCircle, MessageCircle, Info, X
} from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import './NotificationItem.css';

export default function NotificationItem({ notification }) {
    const { markAsRead } = useNotification();
    const navigate = useNavigate();

    const icons = {
        course: <BookOpen size={16} />,
        order: <CheckCircle size={16} />,
        consult: <MessageCircle size={16} />,
        system: <Info size={16} />
    };

    const handleClick = () => {
        markAsRead(notification.id);
        if (notification.link && notification.link !== '#') {
            navigate(notification.link);
        }
    };

    return (
        <div
            className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
            onClick={handleClick}
        >
            <div className={`notification-icon type-${notification.type}`}>
                {icons[notification.type] || <Info size={16} />}
            </div>
            <div className="notification-content">
                <div className="notification-header">
                    <span className="notification-title">{notification.title}</span>
                    <span className="notification-time">{notification.time}</span>
                </div>
                <p className="notification-desc">{notification.description}</p>
            </div>
            {!notification.isRead && (
                <div className="unread-dot" />
            )}
        </div>
    );
}
