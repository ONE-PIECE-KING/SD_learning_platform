import './StatsCard.css';

export default function StatsCard({ icon: Icon, title, value, variant = 'primary' }) {
    return (
        <div className={`stats-card ${variant}`}>
            <div className="stats-icon-wrapper">
                <Icon size={24} className="stats-icon" />
            </div>
            <div className="stats-content">
                <div className="stats-value">{value}</div>
                <div className="stats-title">{title}</div>
            </div>
        </div>
    );
}
