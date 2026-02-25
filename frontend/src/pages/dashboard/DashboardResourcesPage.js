import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    FileText, BookOpen, Eye, Heart, Search,
    Plus, Edit3, Trash2, Share2, Lock, Globe, Calendar,
    Clock, PenTool
} from 'lucide-react';
import './DashboardResourcesPage.css';

/**
 * Dashboard 資源分享頁面
 * 包含「我的筆記」（筆記分享管理）與「文章撰寫」兩大功能區
 */
export default function DashboardResourcesPage() {
    const [activeTab, setActiveTab] = useState('notes');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    // ========== Mock 資料 ==========

    const stats = [
        { title: '我的筆記', value: 12, icon: FileText, variant: 'primary' },
        { title: '公開分享', value: 5, icon: Globe, variant: 'success' },
        { title: '累計被閱讀', value: '2.4k', icon: Eye, variant: 'accent' },
    ];

    const notes = [
        {
            id: 1,
            title: 'Python Pandas 資料清洗完整筆記',
            course: 'Python 資料科學實戰',
            excerpt: '涵蓋 DataFrame 操作、缺失值處理、資料型態轉換、合併與分組統計等核心知識，搭配實戰範例整理。',
            tags: ['Python', 'Pandas', '資料清洗'],
            category: 'python',
            visibility: 'public',
            views: 856,
            likes: 42,
            updatedAt: '2026-02-23',
        },
        {
            id: 2,
            title: '機器學習模型選擇指南',
            course: '機器學習基礎',
            excerpt: '整理常見 ML 模型（線性迴歸、決策樹、SVM、RF、XGBoost）的適用場景、優缺點比較與超參數調整要點。',
            tags: ['ML', '模型選擇', 'Scikit-learn'],
            category: 'ml',
            visibility: 'public',
            views: 632,
            likes: 38,
            updatedAt: '2026-02-18',
        },
        {
            id: 3,
            title: 'SQL Window Function 進階用法',
            course: 'Python 資料科學實戰',
            excerpt: 'ROW_NUMBER、RANK、DENSE_RANK、LAG/LEAD、NTILE 等窗口函數的語法與實際應用案例整理。',
            tags: ['SQL', '窗口函數', '資料庫'],
            category: 'data',
            visibility: 'public',
            views: 445,
            likes: 21,
            updatedAt: '2026-02-12',
        },
        {
            id: 4,
            title: 'ChatGPT Prompt 優化技巧筆記',
            course: null,
            excerpt: '記錄 Chain-of-Thought、Few-shot、Role Playing 等 Prompt 策略的實測效果與最佳實踐。',
            tags: ['Prompt', 'ChatGPT', 'AI'],
            category: 'prompt',
            visibility: 'private',
            views: 0,
            likes: 0,
            updatedAt: '2026-02-08',
        },
        {
            id: 5,
            title: '資料科學面試準備清單',
            course: null,
            excerpt: '統計觀念、SQL 題型、Python Coding、Case Study 與行為面試的備考重點總整理。',
            tags: ['面試', '轉職', '職涯'],
            category: 'career',
            visibility: 'public',
            views: 1203,
            likes: 89,
            updatedAt: '2026-01-30',
        },
        {
            id: 6,
            title: 'Matplotlib & Seaborn 視覺化速查',
            course: 'Python 資料科學實戰',
            excerpt: '常用圖表類型（長條圖、散佈圖、熱力圖、箱型圖）的範例程式碼與客製化參數筆記。',
            tags: ['Python', '視覺化', 'Matplotlib'],
            category: 'python',
            visibility: 'private',
            views: 0,
            likes: 0,
            updatedAt: '2026-01-25',
        },
    ];

    const articles = [
        {
            id: 1,
            title: '從零開始的資料科學轉職之路 — 我的 6 個月心得',
            excerpt: '分享從非本科系轉職資料科學的完整歷程，包含學習路線、面試準備與心態調適。',
            category: '轉職案例',
            status: 'published',
            publishedAt: '2026-02-15',
            views: 1456,
            gradient: 'gradient-1',
        },
        {
            id: 2,
            title: '用 Python 自動化你的日常工作：5 個實用 Script 分享',
            excerpt: '自動寄信、批次重新命名檔案、PDF 合併、Excel 報表生成、網頁爬蟲排程的入門教學。',
            category: '知識分享',
            status: 'review',
            publishedAt: null,
            views: 0,
            gradient: 'gradient-2',
        },
        {
            id: 3,
            title: 'Prompt Engineering 實戰：讓 GPT 產出符合需求的 SQL 查詢',
            excerpt: '透過 few-shot 與 schema description 技巧，引導 LLM 生成正確且效能優化的 SQL 語法。',
            category: '提示詞工程',
            status: 'draft',
            publishedAt: null,
            views: 0,
            gradient: 'gradient-3',
        },
    ];

    // ========== 篩選邏輯 ==========

    const getCategoryClass = (category) => {
        const map = {
            python: 'cat-python',
            ml: 'cat-ml',
            data: 'cat-data',
            prompt: 'cat-prompt',
            career: 'cat-career',
        };
        return map[category] || 'cat-default';
    };

    const filteredNotes = useMemo(() => {
        let result = [...notes];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                n =>
                    n.title.toLowerCase().includes(q) ||
                    n.excerpt.toLowerCase().includes(q) ||
                    n.tags.some(t => t.toLowerCase().includes(q))
            );
        }

        switch (sortOrder) {
            case 'newest':
                result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                break;
            case 'views':
                result.sort((a, b) => b.views - a.views);
                break;
            case 'likes':
                result.sort((a, b) => b.likes - a.likes);
                break;
            default:
                break;
        }

        return result;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, sortOrder]);

    const filteredArticles = useMemo(() => {
        let result = [...articles];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                a =>
                    a.title.toLowerCase().includes(q) ||
                    a.excerpt.toLowerCase().includes(q)
            );
        }

        return result;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    // ========== Render ==========

    return (
        <div className="dashboard-resources">
            {/* 頁面標頭 */}
            <div className="page-header">
                <h1>資源分享</h1>
                <div className="page-header-actions">
                    <button className="btn btn-secondary btn-sm">
                        <Share2 size={16} />
                        管理分享
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Plus size={16} />
                        新增筆記
                    </button>
                </div>
            </div>

            {/* 統計卡片 */}
            <div className="resources-stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="resources-stat-card">
                        <div className={`resources-stat-icon ${stat.variant}`}>
                            <stat.icon size={22} />
                        </div>
                        <div className="resources-stat-info">
                            <h3>{stat.title}</h3>
                            <div className="stat-value">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 分頁標籤 */}
            <div className="resources-tabs">
                <button
                    className={`resources-tab ${activeTab === 'notes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notes')}
                >
                    <FileText size={16} />
                    我的筆記
                </button>
                <button
                    className={`resources-tab ${activeTab === 'articles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('articles')}
                >
                    <PenTool size={16} />
                    文章撰寫
                </button>
            </div>

            {/* 搜尋與排序工具列 */}
            <div className="resources-toolbar">
                <div className="resources-search-wrap">
                    <Search size={16} />
                    <input
                        type="text"
                        className="resources-search-input"
                        placeholder={activeTab === 'notes' ? '搜尋筆記標題、內容或標籤...' : '搜尋文章標題...'}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                {activeTab === 'notes' && (
                    <select
                        className="resources-sort-select"
                        value={sortOrder}
                        onChange={e => setSortOrder(e.target.value)}
                    >
                        <option value="newest">最近更新</option>
                        <option value="views">最多瀏覽</option>
                        <option value="likes">最多收藏</option>
                    </select>
                )}
            </div>

            {/* ===== Tab: 我的筆記 ===== */}
            {activeTab === 'notes' && (
                <>
                    {filteredNotes.length > 0 ? (
                        <div className="notes-grid">
                            {filteredNotes.map(note => (
                                <div key={note.id} className="note-card">
                                    {/* 頂部色帶 */}
                                    <div className={`note-card-accent ${getCategoryClass(note.category)}`} />

                                    {/* 內容 */}
                                    <div className="note-card-body">
                                        <div className="note-card-header">
                                            <h3 className="note-card-title">{note.title}</h3>
                                            <span className={`note-visibility-badge ${note.visibility}`}>
                                                {note.visibility === 'public' ? (
                                                    <><Globe size={10} /> 公開</>
                                                ) : (
                                                    <><Lock size={10} /> 私人</>
                                                )}
                                            </span>
                                        </div>

                                        {note.course && (
                                            <div className="note-card-course">
                                                <BookOpen size={13} />
                                                {note.course}
                                            </div>
                                        )}

                                        <p className="note-card-excerpt">{note.excerpt}</p>

                                        <div className="note-card-tags">
                                            {note.tags.map(tag => (
                                                <span key={tag} className="note-tag">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 底部 */}
                                    <div className="note-card-footer">
                                        <div className="note-card-meta">
                                            <span className="note-meta-item">
                                                <Eye size={13} />
                                                {note.views.toLocaleString()}
                                            </span>
                                            <span className="note-meta-item">
                                                <Heart size={13} />
                                                {note.likes}
                                            </span>
                                            <span className="note-meta-item">
                                                <Clock size={13} />
                                                {note.updatedAt}
                                            </span>
                                        </div>
                                        <div className="note-card-actions">
                                            <button className="note-action-btn" title="編輯">
                                                <Edit3 size={14} />
                                            </button>
                                            <button className="note-action-btn" title="分享">
                                                <Share2 size={14} />
                                            </button>
                                            <button className="note-action-btn danger" title="刪除">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <FileText size={36} />
                            </div>
                            <h3>尚無筆記</h3>
                            <p>開始記錄你的學習心得，與同學們分享知識吧</p>
                            <button className="btn btn-primary btn-md">
                                <Plus size={16} />
                                建立第一份筆記
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* ===== Tab: 文章撰寫 ===== */}
            {activeTab === 'articles' && (
                <>
                    {filteredArticles.length > 0 ? (
                        <div className="articles-section">
                            {filteredArticles.map(article => (
                                <div key={article.id} className="article-draft-card">
                                    {/* 封面佔位 */}
                                    <div className={`article-cover-placeholder ${article.gradient}`}>
                                        <FileText size={28} color="rgba(255,255,255,0.3)" />
                                    </div>

                                    {/* 文章資訊 */}
                                    <div className="article-draft-info">
                                        <h3>{article.title}</h3>
                                        <div className="article-draft-meta">
                                            <span className="article-draft-meta-item">
                                                <BookOpen size={13} />
                                                {article.category}
                                            </span>
                                            {article.publishedAt && (
                                                <span className="article-draft-meta-item">
                                                    <Calendar size={13} />
                                                    {article.publishedAt}
                                                </span>
                                            )}
                                            {article.views > 0 && (
                                                <span className="article-draft-meta-item">
                                                    <Eye size={13} />
                                                    {article.views.toLocaleString()} 瀏覽
                                                </span>
                                            )}
                                        </div>
                                        <p className="article-draft-excerpt">{article.excerpt}</p>
                                    </div>

                                    {/* 狀態與操作 */}
                                    <div className="article-draft-status">
                                        <span className={`article-status-tag ${article.status}`}>
                                            {article.status === 'published' && '已發布'}
                                            {article.status === 'review' && '審核中'}
                                            {article.status === 'draft' && '草稿'}
                                        </span>
                                        <div className="article-draft-actions">
                                            <button className="btn btn-secondary btn-sm">
                                                <Edit3 size={14} />
                                                編輯
                                            </button>
                                            {article.status === 'published' && (
                                                <Link to="/resources" className="btn btn-primary btn-sm">
                                                    <Eye size={14} />
                                                    查看
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <PenTool size={36} />
                            </div>
                            <h3>尚未撰寫文章</h3>
                            <p>分享你的專業知識與經驗，幫助更多同學成長</p>
                            <button className="btn btn-primary btn-md">
                                <Plus size={16} />
                                撰寫第一篇文章
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
