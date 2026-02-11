import { Award, Users, UserCheck, MessageCircle } from 'lucide-react';
import './TrustBadgeBar.css';

/**
 * 信任徽章條
 * 水平排列 4 個信任指標
 */
export default function TrustBadgeBar() {
    const badges = [
        { icon: Award, text: '資展國際 AI 應用工程講師' },
        { icon: Users, text: '100+ 位學員完課' },
        { icon: UserCheck, text: '小班制 6-10 人' },
        { icon: MessageCircle, text: 'Discord 社群支援' },
    ];

    return (
        <div className="trust-badge-bar">
            <div className="trust-badge-list">
                {badges.map(({ icon: Icon, text }) => (
                    <div key={text} className="trust-badge-item">
                        <Icon size={20} />
                        <span>{text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
