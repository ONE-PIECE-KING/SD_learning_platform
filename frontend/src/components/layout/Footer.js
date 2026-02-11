import { Link } from 'react-router-dom';
import { BookOpen, Youtube, Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import './Footer.css';

/**
 * 全站 Footer 頁腳
 * - 品牌簡介 + 社群連結
 * - 快速連結、服務、法律資訊
 * - 版權宣告
 */
export default function Footer() {
    const socialLinks = [
        { icon: Youtube, label: 'YouTube' },
        { icon: Facebook, label: 'Facebook' },
        { icon: Instagram, label: 'Instagram' },
        { icon: Linkedin, label: 'LinkedIn' },
        { icon: MessageCircle, label: 'Discord' },
    ];

    return (
        <footer className="footer">
            <div className="footer-inner">
                {/* 品牌區 */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <BookOpen size={28} strokeWidth={2} />
                        <span>桑尼資料科學</span>
                    </div>
                    <p className="footer-desc">
                        從零基礎到實戰，由業界專家帶你掌握 Python & AI，開啟資料科學職涯。
                    </p>
                    <div className="footer-social">
                        {socialLinks.map(({ icon: Icon, label }) => (
                            <button
                                key={label}
                                className="footer-social-link"
                                aria-label={label}
                                onClick={() => { }}
                            >
                                <Icon size={18} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* 快速連結 */}
                <div>
                    <h4 className="footer-section-title">快速連結</h4>
                    <Link to="/courses" className="footer-link">課程總覽</Link>
                    <Link to="/resources" className="footer-link">資源分享</Link>
                    <Link to="/consult" className="footer-link">一對一諮詢</Link>
                </div>

                {/* 服務 */}
                <div>
                    <h4 className="footer-section-title">服務</h4>
                    <Link to="/consult" className="footer-link">轉職戰略諮詢</Link>
                    <Link to="/consult" className="footer-link">模擬面試</Link>
                    <button className="footer-link" onClick={() => { }}>Discord 社群</button>
                </div>

                {/* 法律資訊 */}
                <div>
                    <h4 className="footer-section-title">法律資訊</h4>
                    <Link to="/legal/privacy" className="footer-link">隱私權政策</Link>
                    <Link to="/legal/refund" className="footer-link">退費政策</Link>
                    <Link to="/legal/terms" className="footer-link">服務條款</Link>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="footer-copyright">
                    © 2025 桑尼資料科學 All rights reserved.
                </p>
            </div>
        </footer>
    );
}
