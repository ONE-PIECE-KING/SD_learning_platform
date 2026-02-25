/**
 * Mock 課程詳細資料（開發用）
 * 實際上線後會由 API /api/v1/courses/:id 取得
 */

const MOCK_COURSE_DETAILS = {
    1: {
        subtitle: '系統化學習 Python 程式設計基礎，從零打造資料科學實力',
        learningGoals: [
            '掌握 Python 基礎語法與資料結構',
            '使用 NumPy 進行數值運算',
            '使用 Pandas 進行資料清洗與處理',
            '建立完整的資料分析流程',
            '實作 5 個資料科學專案',
            '學會使用 Jupyter Notebook',
        ],
        targetAudience: '程式設計初學者、想轉職進入資料科學領域的工作者',
        prerequisites: 'Windows / macOS 電腦，穩定的網路連線',
        curriculum: [
            {
                title: '第一章：Python 基礎入門',
                lessons: [
                    { title: '環境設定與 Python 安裝', duration: '12:30', type: 'video', preview: true },
                    { title: '變數與資料型態', duration: '18:45', type: 'video', preview: true },
                    { title: '流程控制：條件判斷與迴圈', duration: '22:10', type: 'video', preview: false },
                    { title: '第一章隨堂測驗', duration: '10 題', type: 'quiz', preview: false },
                ],
            },
            {
                title: '第二章：資料結構與函式',
                lessons: [
                    { title: 'List 與 Tuple 操作', duration: '20:15', type: 'video', preview: false },
                    { title: 'Dictionary 與 Set', duration: '17:30', type: 'video', preview: false },
                    { title: '函式定義與使用', duration: '24:00', type: 'video', preview: false },
                    { title: '物件導向程式設計入門', duration: '28:00', type: 'video', preview: false },
                ],
            },
            {
                title: '第三章：NumPy 數值運算',
                lessons: [
                    { title: 'NumPy Array 基礎', duration: '16:20', type: 'video', preview: false },
                    { title: '陣列運算與廣播', duration: '20:45', type: 'video', preview: false },
                    { title: '線性代數運算', duration: '22:30', type: 'video', preview: false },
                    { title: '練習：資料生成與操作', duration: '15:00', type: 'document', preview: false },
                ],
            },
            {
                title: '第四章：Pandas 資料處理',
                lessons: [
                    { title: 'DataFrame 與 Series', duration: '25:00', type: 'video', preview: false },
                    { title: '資料清洗技巧', duration: '30:15', type: 'video', preview: false },
                    { title: '資料合併與分組', duration: '28:30', type: 'video', preview: false },
                    { title: '期末專案：資料分析實戰', duration: '45:00', type: 'document', preview: false },
                ],
            },
        ],
        instructorBio: '桑尼擁有超過 8 年的資料科學與機器學習實戰經驗，曾任職於多家知名科技公司，擔任資深資料科學家。專精於 Python 資料分析、機器學習模型開發與 AI 應用落地。目前全心投入線上教育，致力於用最直觀的方式，幫助學員從零開始踏入資料科學的世界。',
        instructorCourseCount: 12,
        instructorTotalStudents: 25000,
        reviews: [
            { name: '王小明', avatar: null, rating: 5, date: '2026-01-15', content: '課程內容非常充實，講解清晰易懂，每個概念都有搭配實作範例。從一個完全不懂 Python 的新手，到現在能獨立完成資料分析專案，非常推薦！' },
            { name: '李大華', avatar: null, rating: 5, date: '2026-01-10', content: '老師講解的節奏很好，不會太快也不會太慢。練習檔案也很實用，可以反覆練習鞏固觀念。' },
            { name: '張美玲', avatar: null, rating: 4, date: '2025-12-28', content: '整體來說很棒，特別是 Pandas 那一章節幫了我很大的忙。建議可以再加入更多進階的資料視覺化內容。' },
            { name: '陳建志', avatar: null, rating: 5, date: '2025-12-20', content: '身為一個轉職者，這門課程讓我建立了紮實的 Python 基礎。現在已經順利進入資料分析相關的工作崗位了！' },
            { name: '林雅琪', avatar: null, rating: 4, date: '2025-12-15', content: '課程架構完整，從基礎到實戰都有涵蓋。希望未來能出進階課程！' },
        ],
        ratingDistribution: { 5: 68, 4: 22, 3: 7, 2: 2, 1: 1 },
    },
};

/**
 * 取得課程詳細資料（模擬 API 呼叫）
 * 會合併來自 mockCourses.js 的基本資料
 */
export function getCourseDetail(courseId) {
    // 若有該課程的詳細資料就用，否則產生預設資料
    return MOCK_COURSE_DETAILS[courseId] || generateDefaultDetails(courseId);
}

/**
 * 為沒有手動建立詳細資料的課程，自動產生預設結構
 */
function generateDefaultDetails(courseId) {
    return {
        subtitle: '深入學習核心概念，掌握實戰技能，提升職場競爭力',
        learningGoals: [
            '掌握核心理論與實務技巧',
            '獨立完成實戰專案',
            '建立完整的知識體系',
            '提升工作效率與解決方能力',
        ],
        targetAudience: '對此領域有興趣的初中階學習者',
        prerequisites: '基礎電腦操作能力',
        curriculum: [
            {
                title: '第一章：基礎概念',
                lessons: [
                    { title: '課程介紹與環境準備', duration: '15:00', type: 'video', preview: true },
                    { title: '核心概念講解', duration: '25:00', type: 'video', preview: true },
                    { title: '基礎實作練習', duration: '20:00', type: 'video', preview: false },
                ],
            },
            {
                title: '第二章：進階技巧',
                lessons: [
                    { title: '進階功能介紹', duration: '22:00', type: 'video', preview: false },
                    { title: '實戰案例分析', duration: '30:00', type: 'video', preview: false },
                    { title: '隨堂測驗', duration: '10 題', type: 'quiz', preview: false },
                ],
            },
            {
                title: '第三章：專案實作',
                lessons: [
                    { title: '專案需求分析', duration: '18:00', type: 'video', preview: false },
                    { title: '逐步實作指導', duration: '40:00', type: 'video', preview: false },
                    { title: '專案檔案下載', duration: '—', type: 'document', preview: false },
                ],
            },
        ],
        instructorBio: '桑尼擁有超過 8 年的資料科學與機器學習實戰經驗，曾任職於多家知名科技公司，擔任資深資料科學家。專精於 Python 資料分析、機器學習模型開發與 AI 應用落地。',
        instructorCourseCount: 12,
        instructorTotalStudents: 25000,
        reviews: [
            { name: '王小明', avatar: null, rating: 5, date: '2026-01-15', content: '課程內容非常充實，講解清晰，值得推薦給想學習的朋友！' },
            { name: '李大華', avatar: null, rating: 4, date: '2026-01-10', content: '老師教學認真，內容扎實，跟著課程操作收穫很多。' },
            { name: '張美玲', avatar: null, rating: 5, date: '2025-12-28', content: '很棒的課程體驗！實作專案讓理論更容易理解。' },
        ],
        ratingDistribution: { 5: 60, 4: 25, 3: 10, 2: 3, 1: 2 },
    };
}

export default MOCK_COURSE_DETAILS;
