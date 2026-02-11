import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Printer, Mail, FileText, Shield, RefreshCw } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import './LegalPage.css';

/* ═══════════════════════════════════════
   法律頁面內容定義
   ═══════════════════════════════════════ */
const LEGAL_PAGES = {
    privacy: {
        title: '隱私權政策',
        updated: '2026 年 1 月 15 日',
        sections: [
            {
                id: 'scope',
                title: '一、資料收集範圍',
                content: (
                    <>
                        <p>為提供您最佳的學習服務體驗，我們可能會收集以下資訊：</p>
                        <ul>
                            <li><strong>註冊資訊：</strong>電子郵件、姓名、密碼（加密儲存）、手機號碼（選填）</li>
                            <li><strong>交易資訊：</strong>購課紀錄、付款方式（不儲存完整信用卡號，僅保留末四碼供識別）</li>
                            <li><strong>學習紀錄：</strong>觀看進度、測驗成績、學習時數統計</li>
                            <li><strong>裝置資訊：</strong>瀏覽器類型、作業系統、裝置語系（用於體驗優化）</li>
                        </ul>
                    </>
                ),
            },
            {
                id: 'usage',
                title: '二、資料使用目的',
                content: (
                    <>
                        <p>我們收集的資料僅用於以下目的：</p>
                        <ul>
                            <li><strong>提供服務：</strong>包含課程存取、學習進度追蹤、證書發放</li>
                            <li><strong>身分驗證：</strong>確保帳戶安全，防止未授權存取</li>
                            <li><strong>課程更新通知：</strong>通知您已購買課程的內容更新或新課程資訊</li>
                            <li><strong>行銷推廣：</strong>需經您明確同意後，才會發送優惠活動通知</li>
                            <li><strong>服務改善：</strong>分析使用模式以優化平台功能與使用者體驗</li>
                        </ul>
                    </>
                ),
            },
            {
                id: 'cookies',
                title: '三、Cookie 政策',
                content: (
                    <>
                        <p>本平台使用 Cookie 以提供更好的使用體驗：</p>
                        <ul>
                            <li><strong>必要性 Cookie：</strong>維持登入狀態、記錄購物車內容</li>
                            <li><strong>功能性 Cookie：</strong>記住您的語言偏好、深色/淺色模式設定</li>
                            <li><strong>分析性 Cookie：</strong>使用 Google Analytics 追蹤網站使用情況（匿名化處理）</li>
                        </ul>
                        <p>您可以透過瀏覽器設定隨時管理或刪除 Cookie，但部分功能可能因此受到影響。</p>
                    </>
                ),
            },
            {
                id: 'third-party',
                title: '四、第三方資料分享',
                content: (
                    <>
                        <p>我們不會出售您的個人資料。僅在以下情況與第三方共享：</p>
                        <ul>
                            <li><strong>金流服務商：</strong>綠界科技（ECPay）、藍新金流（Newebpay），用於處理線上付款</li>
                            <li><strong>數據分析工具：</strong>Google Analytics，用於匿名化的網站流量與使用行為分析</li>
                            <li><strong>法律要求：</strong>當政府機關依法要求提供時</li>
                        </ul>
                    </>
                ),
            },
            {
                id: 'security',
                title: '五、資料安全與您的權利',
                content: (
                    <>
                        <p>我們採用業界標準的安全措施保護您的資料：</p>
                        <ul>
                            <li>所有資料傳輸均使用 SSL/TLS 加密</li>
                            <li>密碼使用 bcrypt 演算法加密儲存</li>
                            <li>定期進行安全性檢測與弱點掃描</li>
                        </ul>
                        <p>您擁有以下權利：</p>
                        <ul>
                            <li><strong>查閱權：</strong>查看我們持有的您的個人資料</li>
                            <li><strong>修改權：</strong>更正不正確或過時的個人資料</li>
                            <li><strong>刪除權：</strong>要求刪除您的帳戶與個人資料</li>
                            <li><strong>撤回同意：</strong>隨時撤回行銷通知的同意</li>
                        </ul>
                        <p>如需行使上述權利，請透過客服信箱 <strong>privacy@sunnylearning.com</strong> 聯繫我們。</p>
                    </>
                ),
            },
        ],
    },
    refund: {
        title: '退費政策',
        updated: '2026 年 1 月 15 日',
        sections: [
            {
                id: 'standard',
                title: '一、標準退費條件',
                content: (
                    <>
                        <p>我們希望您對每一門課程都感到滿意。若您對課程不滿意，可依以下條件申請退費：</p>
                        <table className="legal-table">
                            <thead>
                                <tr>
                                    <th>條件</th>
                                    <th>退費方式</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>購買後 7 日內且完全未觀看</td>
                                    <td>全額退費</td>
                                </tr>
                                <tr>
                                    <td>觀看進度低於 20% 且購買 14 日內</td>
                                    <td>扣除已觀看比例後退費</td>
                                </tr>
                                <tr>
                                    <td>觀看進度超過 20% 或購買超過 14 日</td>
                                    <td>不予退費</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="legal-highlight">
                            <p>💡 免費課程不在退費政策範圍內。</p>
                        </div>
                    </>
                ),
            },
            {
                id: 'special',
                title: '二、特殊商品退費',
                content: (
                    <>
                        <h3>實體教材</h3>
                        <ul>
                            <li>尚未寄出：可申請全額退費</li>
                            <li>已寄出但未拆封：退回商品後全額退費（運費由學員負擔）</li>
                            <li>已拆封使用：扣除折舊費用後退費，折舊標準為定價之 30%</li>
                        </ul>
                        <h3>直播課程</h3>
                        <ul>
                            <li>課程尚未開始：可申請全額退費</li>
                            <li>課程已開始：不予退費，但可提供該期錄影回放</li>
                        </ul>
                    </>
                ),
            },
            {
                id: 'process',
                title: '三、退費流程',
                content: (
                    <>
                        <p>申請退費的流程如下：</p>
                        <ol>
                            <li><strong>提出申請：</strong>透過會員中心「我的訂單」頁面點選「申請退費」，或寄信至 <strong>refund@sunnylearning.com</strong></li>
                            <li><strong>審核處理：</strong>我們將於 <strong>7 個工作天</strong>內完成審核</li>
                            <li><strong>退款入帳：</strong>審核通過後，款項將於 <strong>5-10 個工作天</strong>退回原付款帳戶</li>
                        </ol>
                        <h3>退款方式</h3>
                        <ul>
                            <li>信用卡付款：原路退回信用卡（實際入帳時間依各銀行而異）</li>
                            <li>ATM / 超商付款：退至您指定的銀行帳戶，手續費 NT$ 30 由平台吸收</li>
                        </ul>
                    </>
                ),
            },
        ],
    },
    terms: {
        title: '服務條款',
        updated: '2026 年 1 月 15 日',
        sections: [
            {
                id: 'eligibility',
                title: '一、使用者資格',
                content: (
                    <>
                        <p>歡迎使用桑尼的學習平台（以下簡稱「本平台」）。使用本平台前，請詳閱以下條款：</p>
                        <ul>
                            <li>您必須年滿 18 歲，或經法定代理人同意後方可註冊使用</li>
                            <li>註冊時提供的資訊必須真實、正確且完整</li>
                            <li>您有義務維護帳戶資訊的正確性與安全性</li>
                        </ul>
                    </>
                ),
            },
            {
                id: 'account',
                title: '二、帳戶管理',
                content: (
                    <>
                        <ul>
                            <li>每位使用者僅能擁有一個帳戶，<strong>禁止帳戶轉讓或多人共用</strong></li>
                            <li>您應妥善保管帳戶密碼，因密碼外洩導致的損失由使用者自行負責</li>
                            <li>若發現帳戶遭未授權使用，請立即通知客服處理</li>
                            <li>本平台保留因違反條款而停權或刪除帳戶的權利</li>
                        </ul>
                    </>
                ),
            },
            {
                id: 'ip',
                title: '三、智慧財產權',
                content: (
                    <>
                        <div className="legal-highlight">
                            <p>⚠️ 所有課程影片、教材、文件之智慧財產權歸本平台或授課講師所有。</p>
                        </div>
                        <ul>
                            <li><strong>禁止行為：</strong>錄影、截圖散布、非法下載、轉售或轉載課程內容</li>
                            <li><strong>個人使用：</strong>購買的課程僅限購買者本人觀看學習</li>
                            <li><strong>違規處置：</strong>經查證違反者，本平台有權終止其帳戶並依法追訴</li>
                        </ul>
                    </>
                ),
            },
            {
                id: 'conduct',
                title: '四、行為準則',
                content: (
                    <>
                        <p>使用本平台時，您同意遵守以下行為準則：</p>
                        <ul>
                            <li>不得發表攻擊性、歧視性或騷擾性言論</li>
                            <li>不得發布廣告或垃圾訊息</li>
                            <li>不得從事任何違法行為或侵害他人權益的行為</li>
                            <li>不得干擾或破壞平台系統的正常運作</li>
                        </ul>
                    </>
                ),
            },
            {
                id: 'interruption',
                title: '五、服務中斷與補償',
                content: (
                    <>
                        <p>本平台致力提供穩定的服務，但以下情況可能造成服務中斷：</p>
                        <ul>
                            <li>系統維護（將提前通知）</li>
                            <li>不可抗力事件（天災、網路中斷等）</li>
                            <li>安全性緊急修復</li>
                        </ul>
                        <p>若因本平台原因導致服務中斷超過 24 小時，已付費使用者將獲得相應的使用期限延長。</p>
                    </>
                ),
            },
            {
                id: 'jurisdiction',
                title: '六、法律管轄',
                content: (
                    <>
                        <p>本服務條款之解釋與適用，以中華民國法律為準據法。</p>
                        <p>因本條款所生之爭議，雙方同意以<strong>臺灣臺北地方法院</strong>為第一審管轄法院。</p>
                    </>
                ),
            },
        ],
    },
};

const TAB_ORDER = ['privacy', 'refund', 'terms'];
const TAB_LABELS = { privacy: '隱私權政策', refund: '退費政策', terms: '服務條款' };

/* ========================================
   LegalPage 主元件
   ======================================== */
export default function LegalPage() {
    const { type } = useParams();
    const navigate = useNavigate();

    /* 自動捲頂 */
    useEffect(() => { window.scrollTo(0, 0); }, [type]);

    /* 預設轉向 privacy */
    useEffect(() => {
        if (!type || !LEGAL_PAGES[type]) {
            navigate('/legal/privacy', { replace: true });
        }
    }, [type, navigate]);

    const page = LEGAL_PAGES[type] || LEGAL_PAGES.privacy;

    const handlePrint = () => { window.print(); };

    const scrollToSection = (sectionId) => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="legal-page">
            <Header />
            <main>
                {/* ═══ Hero ═══ */}
                <section className="legal-hero">
                    <div className="legal-hero-inner">
                        <h1>{page.title}</h1>
                        <span className="legal-hero-updated">最後更新：{page.updated}</span>
                    </div>
                </section>

                {/* ═══ Tab 導覽 ═══ */}
                <nav className="legal-tabs">
                    {TAB_ORDER.map((key) => (
                        <Link
                            key={key}
                            to={`/legal/${key}`}
                            className={`legal-tab ${type === key ? 'active' : ''}`}
                        >
                            {TAB_LABELS[key]}
                        </Link>
                    ))}
                </nav>

                {/* ═══ 主體 ═══ */}
                <div className="legal-body">
                    {/* 左側內文 */}
                    <div className="legal-content">
                        <div className="legal-actions">
                            <button className="legal-print-btn" onClick={handlePrint}>
                                <Printer size={16} />
                                列印 / 存為 PDF
                            </button>
                        </div>

                        {page.sections.map((section) => (
                            <div key={section.id} id={section.id}>
                                <h2>{section.title}</h2>
                                {section.content}
                            </div>
                        ))}

                        {/* 底部聯絡 */}
                        <div className="legal-contact">
                            <h3>有任何疑問？</h3>
                            <p>若您對上述條款有任何問題，歡迎隨時聯繫我們的客服團隊。</p>
                            <a href="mailto:support@sunnylearning.com" className="legal-contact-link">
                                <Mail size={16} />
                                聯絡客服
                            </a>
                        </div>
                    </div>

                    {/* 右側 TOC */}
                    <aside className="legal-toc">
                        <h4 className="legal-toc-title">目錄</h4>
                        <ul className="legal-toc-list">
                            {page.sections.map((section) => (
                                <li key={section.id}>
                                    <a
                                        className="legal-toc-item"
                                        onClick={() => scrollToSection(section.id)}
                                    >
                                        {section.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
}
