import { useState } from 'react';
import { Moon, Sun, Bell, Shield, CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './SettingsPage.css';

export default function SettingsPage() {
    const { user } = useAuth();
    const isTeacher = user?.role === 'teacher';

    // Mock Settings State
    const [settings, setSettings] = useState({
        theme: localStorage.getItem('theme') || 'dark',
        emailNotif: true,
        siteNotif: true,
        consultOpen: true
    });

    const toggleSetting = (key) => {
        setSettings(prev => {
            const newVal = !prev[key];
            if (key === 'theme') {
                const newTheme = prev.theme === 'light' ? 'dark' : 'light';
                // Note: Header handles actual theme switching via its own state/effect, 
                // but conceptually this should be global context. 
                // For now, we update local state and localStorage.
                localStorage.setItem('theme', newTheme);
                // Force reload to apply theme change (simple workaround without global context)
                window.location.reload();
                return { ...prev, theme: newTheme };
            }
            return { ...prev, [key]: newVal };
        });
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>設定</h1>
            </div>

            <div className="settings-container">
                {/* General Settings */}
                <div className="settings-section">
                    <h3>一般設定</h3>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">
                                {settings.theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                                <span>深色模式</span>
                            </div>
                            <p className="setting-desc">切換應用程式的亮色/深色外觀</p>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={settings.theme === 'dark'}
                                onChange={() => toggleSetting('theme')}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="settings-section">
                    <h3>通知偏好</h3>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">
                                <Bell size={18} />
                                <span>Email 通知</span>
                            </div>
                            <p className="setting-desc">接收課程更新、訂單狀態的 Email</p>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={settings.emailNotif}
                                onChange={() => toggleSetting('emailNotif')}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">
                                <Bell size={18} />
                                <span>站內通知</span>
                            </div>
                            <p className="setting-desc">在網站內接收即時通知</p>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={settings.siteNotif}
                                onChange={() => toggleSetting('siteNotif')}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="settings-section">
                    <h3>帳號安全</h3>
                    <div className="setting-item action-item">
                        <div className="setting-info">
                            <div className="setting-label">
                                <Shield size={18} />
                                <span>修改密碼</span>
                            </div>
                            <p className="setting-desc">定期更換密碼以保護帳號安全</p>
                        </div>
                        <button className="btn btn-outline sm">修改</button>
                    </div>
                </div>

                {/* Teacher Specific Settings */}
                {isTeacher && (
                    <div className="settings-section">
                        <h3>講師設定</h3>

                        <div className="setting-item">
                            <div className="setting-info">
                                <div className="setting-label">
                                    <CreditCard size={18} />
                                    <span>諮詢功能</span>
                                </div>
                                <p className="setting-desc">開啟後學生可預約您的一對一諮詢時段</p>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.consultOpen}
                                    onChange={() => toggleSetting('consultOpen')}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
