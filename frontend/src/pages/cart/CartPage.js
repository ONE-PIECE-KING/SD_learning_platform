import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import CartItem from '../../components/cart/CartItem';
import OrderSummary from '../../components/cart/OrderSummary';
import './CartPage.css';

export default function CartPage() {
    const { cartDetails, totalItems } = useCart();

    return (
        <div className="cart-page">
            <Header />

            <main className="cart-content">
                <div className="cart-container">
                    <h1 className="cart-title">
                        購物車
                        {totalItems > 0 && <span className="cart-count">({totalItems})</span>}
                    </h1>

                    {totalItems === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty-icon">
                                <ShoppingCart size={64} />
                            </div>
                            <h2>你的購物車是空的</h2>
                            <p>看來你還沒有加入任何課程，快去探索吧！</p>
                            <Link to="/courses" className="btn-explore">
                                瀏覽課程
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    ) : (
                        <div className="cart-grid">
                            {/* 左側清單 */}
                            <div className="cart-list">
                                {cartDetails.map((course) => (
                                    <CartItem key={course.id} course={course} />
                                ))}
                            </div>

                            {/* 右側摘要 */}
                            <div className="cart-sidebar">
                                <OrderSummary />
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
