/**
 * Mock 文章資料（開發用）
 * 實際上線後會由 API /api/v1/articles 取得
 */

const MOCK_ARTICLES = [
    {
        id: 1,
        title: '2026 資料科學趨勢：AI Agent 如何改變工作流程',
        excerpt: '深入探討 2026 年最值得關注的資料科學與 AI 趨勢，包含 AI Agent 自動化、多模態模型、以及企業級 RAG 系統的最新發展。',
        category: '技術新訊',
        tags: ['AI', 'Agent', '趨勢'],
        author: '桑尼',
        date: '2026-02-08',
        views: 3420,
        cover: null,
    },
    {
        id: 2,
        title: 'Python Pandas 資料清洗完全指南：10 個必學技巧',
        excerpt: '學會這 10 個 Pandas 資料清洗技巧，讓你的資料前處理效率提升 3 倍。從缺失值處理到資料型態轉換，一次搞定。',
        category: '知識分享',
        tags: ['Python', 'Pandas', '資料清洗'],
        author: '桑尼',
        date: '2026-02-05',
        views: 2890,
        cover: null,
    },
    {
        id: 3,
        title: 'ChatGPT Prompt 進階技巧：Chain of Thought 實戰教學',
        excerpt: '透過 Chain of Thought 提示策略，讓 ChatGPT 產出更精確的回答。本文以實際案例示範如何撰寫有效的多步驟提示詞。',
        category: '提示詞工程',
        tags: ['Prompt', 'ChatGPT', 'CoT'],
        author: '桑尼',
        date: '2026-02-02',
        views: 4120,
        cover: null,
    },
    {
        id: 4,
        title: '從行銷轉職資料分析師：我的 6 個月學習之路',
        excerpt: '一個非本科生的真實轉職故事。分享從零開始學習 Python、SQL、統計學，到成功拿到資料分析師 Offer 的完整歷程。',
        category: '轉職案例',
        tags: ['轉職', '資料分析', '心得'],
        author: '王小明',
        date: '2026-01-28',
        views: 5680,
        cover: null,
    },
    {
        id: 5,
        title: 'NumPy 陣列運算速度優化：你不知道的 5 個向量化技巧',
        excerpt: '為什麼你的 NumPy 程式還在用 for 迴圈？學會這 5 個向量化技巧，讓你的數值運算效能提升 10-100 倍。',
        category: '知識分享',
        tags: ['Python', 'NumPy', '優化'],
        author: '桑尼',
        date: '2026-01-25',
        views: 1950,
        cover: null,
    },
    {
        id: 6,
        title: 'RAG 系統架構全解析：從嵌入到檢索的完整流程',
        excerpt: '深入了解 Retrieval-Augmented Generation 的核心架構。透過圖解方式，帶你理解文件切割、向量嵌入、相似度搜尋與生成回答的完整流程。',
        category: '技術新訊',
        tags: ['RAG', 'LLM', 'AI'],
        author: '桑尼',
        date: '2026-01-22',
        views: 3250,
        cover: null,
    },
    {
        id: 7,
        title: 'Prompt Engineering 系統化框架：CRISP 方法論',
        excerpt: '介紹一套系統化的 Prompt Engineering 框架 — CRISP（Context, Role, Instruction, Specification, Pattern），幫助你每次都能寫出高品質的提示詞。',
        category: '提示詞工程',
        tags: ['Prompt', 'CRISP', '方法論'],
        author: '桑尼',
        date: '2026-01-18',
        views: 2780,
        cover: null,
    },
    {
        id: 8,
        title: '資料科學面試必備：20 個常見問題與最佳回答',
        excerpt: '整理了資料科學面試中最常被問到的 20 個問題，涵蓋統計學、機器學習、SQL、程式設計與商業分析五大領域。',
        category: '知識分享',
        tags: ['面試', '資料科學', 'SQL'],
        author: '桑尼',
        date: '2026-01-15',
        views: 6120,
        cover: null,
    },
    {
        id: 9,
        title: '從會計師到 ML Engineer：跨領域轉職的挑戰與收穫',
        excerpt: '一個擁有 5 年會計經驗的專業人士，如何在 8 個月內成功轉職成為機器學習工程師。分享學習策略、面試經驗與心態調適。',
        category: '轉職案例',
        tags: ['轉職', 'ML', '心得'],
        author: '李大華',
        date: '2026-01-12',
        views: 4350,
        cover: null,
    },
    {
        id: 10,
        title: 'LangChain 入門教學：用 Python 打造你的第一個 AI 應用',
        excerpt: '手把手教你使用 LangChain 框架，結合 OpenAI API，建立一個具有記憶功能的對話式 AI 應用。含完整程式碼與部署指南。',
        category: '技術新訊',
        tags: ['LangChain', 'Python', 'AI'],
        author: '桑尼',
        date: '2026-01-08',
        views: 3890,
        cover: null,
    },
    {
        id: 11,
        title: 'SQL 查詢效能調校：EXPLAIN 分析與索引優化實戰',
        excerpt: '你的 SQL 查詢太慢嗎？學會使用 EXPLAIN 分析查詢計畫，以及正確建立索引策略，讓查詢速度快 10 倍以上。',
        category: '知識分享',
        tags: ['SQL', '效能', '索引'],
        author: '桑尼',
        date: '2026-01-05',
        views: 2450,
        cover: null,
    },
    {
        id: 12,
        title: '用 GPT-4 自動生成資料分析報告：完整 Prompt 範例',
        excerpt: '提供 5 套實用的 GPT-4 資料分析 Prompt 模板，從資料描述、統計摘要到視覺化建議，一鍵生成專業的分析報告。',
        category: '提示詞工程',
        tags: ['GPT-4', 'Prompt', '資料分析'],
        author: '桑尼',
        date: '2026-01-02',
        views: 3670,
        cover: null,
    },
];

/* 分類清單 */
export const ARTICLE_CATEGORIES = ['全部', '技術新訊', '知識分享', '提示詞工程', '轉職案例'];

/* 分類對應的背景色（用於卡片封面佔位） */
export const CATEGORY_COLORS = {
    '技術新訊': 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
    '知識分享': 'linear-gradient(135deg, #2d1b69 0%, #8b5cf6 100%)',
    '提示詞工程': 'linear-gradient(135deg, #4a1942 0%, #ec4899 100%)',
    '轉職案例': 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)',
};

/* 分類對應的 CSS class */
export const CATEGORY_CLASS = {
    '技術新訊': 'tech',
    '知識分享': 'knowledge',
    '提示詞工程': 'prompt',
    '轉職案例': 'career',
};

export default MOCK_ARTICLES;
