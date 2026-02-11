import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './OrderSummary.css';

export default function OrderSummary() {
    const { totalAmount, totalItems, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!isAuthenticated) {
            alert('請先登入會員');
            navigate('/auth/login', { state: { from: '/cart' } });
            return;
        }

        if (totalItems === 0) return;

        // 模擬結帳流程
        if (window.confirm(`確認結帳？總金額：NT$ ${totalAmount.toLocaleString()}`)) {
            alert('結帳成功！感謝您的購買。');
            clearCart();
            navigate('/dashboard');
        }
    };

    return (
        <div className="order-summary">
            <h3 className="summary-title">訂單摘要</h3>

            <div className="summary-row">
                <span>項目小計 ({totalItems} 堂)</span>
                <span>NT$ {totalAmount.toLocaleString()}</span>
            </div>

            <div className="summary-row discount">
                <span>折扣</span>
                <span>- NT$ 0</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total">
                <span>應付總額</span>
                <span className="total-price">NT$ {totalAmount.toLocaleString()}</span>
            </div>

            <button
                className="btn-checkout"
                disabled={totalItems === 0}
                onClick={handleCheckout}
            >
                前往結帳
            </button>

            <p className="summary-note">
                完成購買即表示您同意我們的服務條款與退費政策。
            </p>
        </div>
    );
}
