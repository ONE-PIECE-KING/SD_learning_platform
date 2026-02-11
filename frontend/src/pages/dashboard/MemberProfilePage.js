import { useState } from 'react';
import { Camera, Save, User, Link as LinkIcon, Award, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './MemberProfilePage.css';

export default function MemberProfilePage() {
    const { user } = useAuth();
    const isTeacher = user?.role === 'teacher';

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nickname: user?.name || '',
        bio: '這傢伙很懶，什麼都沒留下。',
        expertise: ['Python', 'Data Science', 'Machine Learning'],
        socials: {
            github: 'https://github.com/example',
            linkedin: 'https://linkedin.com/in/example',
            website: 'https://sunny-data.com'
        }
    });

    const handleSave = () => {
        // Mock save
        setIsEditing(false);
    };

    return (
        <div className="profile-page">
            <div className="page-header">
                <h1>個人簡介</h1>
                <button
                    className={`btn ${isEditing ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                    {isEditing ? <><Save size={16} /> 儲存</> : '編輯資料'}
                </button>
            </div>

            <div className="profile-grid">
                {/* Left Column: Basic Info */}
                <div className="profile-card basic-info">
                    <div className="avatar-section">
                        <div className="avatar-wrapper">
                            <span className="avatar-placeholder">{formData.nickname.charAt(0)}</span>
                            {isEditing && (
                                <button className="avatar-upload-btn" aria-label="上傳頭像">
                                    <Camera size={16} />
                                </button>
                            )}
                        </div>
                        <div className="role-tag">{isTeacher ? '老師' : '學生'}</div>
                    </div>

                    <div className="info-form">
                        <div className="form-group">
                            <label>暱稱</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.nickname}
                                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                    className="form-input"
                                />
                            ) : (
                                <p className="info-value">{formData.nickname}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>自我介紹</label>
                            {isEditing ? (
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="form-textarea"
                                    rows={4}
                                />
                            ) : (
                                <p className="info-value">{formData.bio}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Role Specific */}
                <div className="profile-links-section">
                    {/* Teacher Specific: Expertise & Socials */}
                    {isTeacher && (
                        <div className="profile-card">
                            <div className="card-header">
                                <Briefcase size={20} />
                                <h2>專業資訊</h2>
                            </div>

                            <div className="form-group">
                                <label>專業領域</label>
                                <div className="tags-container">
                                    {formData.expertise.map((tag, i) => (
                                        <span key={i} className="expertise-tag">{tag}</span>
                                    ))}
                                    {isEditing && <button className="add-tag-btn">+ 新增</button>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>社群連結</label>
                                <div className="social-links-list">
                                    {Object.entries(formData.socials).map(([platform, url]) => (
                                        <div key={platform} className="social-link-item">
                                            <LinkIcon size={14} />
                                            {isEditing ? (
                                                <input
                                                    value={url}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        socials: { ...formData.socials, [platform]: e.target.value }
                                                    })}
                                                    className="form-input sm"
                                                />
                                            ) : (
                                                <a href={url} target="_blank" rel="noopener noreferrer" className="link-text">
                                                    {url}
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shared: Certificates (Mock) */}
                    <div className="profile-card">
                        <div className="card-header">
                            <Award size={20} />
                            <h2>我的證書</h2>
                        </div>
                        <div className="certificates-list">
                            <div className="certificate-item">
                                <div className="cert-icon">
                                    <Award size={24} />
                                </div>
                                <div className="cert-info">
                                    <h4>Python 資料科學實戰</h4>
                                    <span>2023/10/15 取得</span>
                                </div>
                            </div>
                            <div className="empty-cert-hint">
                                <p>持續學習，獲取更多證書！</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
