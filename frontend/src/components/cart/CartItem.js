import { Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import './CartItem.css';

export default function CartItem({ course }) {
    const { removeFromCart } = useCart();

    const isFree = course.price === 0;

    return (
        <div className="cart-item">
            {/* 縮圖 */}
            <div className="cart-item-thumb">
                {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} />
                ) : (
                    <div className="cart-item-placeholder" />
                )}
            </div>

            {/* 內容 */}
            <div className="cart-item-content">
                <h3 className="cart-item-title">{course.title}</h3>
                <div className="cart-item-instructor">
                    {course.instructor} 老師
                </div>
            </div>

            {/* 價格 & 操作 */}
            <div className="cart-item-actions">
                <div className="cart-item-price">
                    {isFree ? (
                        <span className="free">免費</span>
                    ) : (
                        <span>NT$ {course.price.toLocaleString()}</span>
                    )}
                </div>
                <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(course.id)}
                    aria-label="移除課程"
                >
                    <Trash2 size={18} />
                    移除
                </button>
            </div>
        </div>
    );
}
