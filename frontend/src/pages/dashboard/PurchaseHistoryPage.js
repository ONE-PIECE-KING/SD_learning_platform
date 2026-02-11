import { CheckCircle, AlertCircle, Search } from 'lucide-react';
import './PurchaseHistoryPage.css';

export default function PurchaseHistoryPage() {
    const history = [
        {
            id: 'ORD-20231024-001',
            date: '2023/10/24',
            items: ['Python 資料科學實戰', '機器學習基礎'],
            amount: 4500,
            status: 'success'
        },
        {
            id: 'ORD-20230915-023',
            date: '2023/09/15',
            items: ['網頁前端全攻略'],
            amount: 2300,
            status: 'success'
        },
        {
            id: 'ORD-20230801-102',
            date: '2023/08/01',
            items: ['UI/UX 設計入門'],
            amount: 1800,
            status: 'refunded'
        },
    ];

    return (
        <div className="history-page">
            <div className="page-header">
                <h1>購課記錄</h1>
                <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="搜尋訂單編號" />
                </div>
            </div>

            <div className="table-container">
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>訂單編號</th>
                            <th>購買日期</th>
                            <th>內容</th>
                            <th>金額</th>
                            <th>狀態</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(record => (
                            <tr key={record.id}>
                                <td className="font-mono">{record.id}</td>
                                <td>{record.date}</td>
                                <td>
                                    <div className="order-items">
                                        {record.items.map((item, i) => (
                                            <div key={i}>{item}</div>
                                        ))}
                                    </div>
                                </td>
                                <td>NT$ {record.amount.toLocaleString()}</td>
                                <td>
                                    <span className={`status-badge ${record.status}`}>
                                        {record.status === 'success' ? '購買成功' : '已退款'}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-link">檢視明細</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
