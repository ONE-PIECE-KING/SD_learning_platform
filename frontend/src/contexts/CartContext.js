import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import MOCK_COURSES from '../data/mockCourses';

const CartContext = createContext(null);

const STORAGE_KEY = 'sunny_learning_cart';

export function CartProvider({ children }) {
    // 預設從 localStorage 讀取
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load cart from storage', e);
            return [];
        }
    });

    // 當 cartItems 變更時，同步寫入 localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
        } catch (e) {
            console.error('Failed to save cart to storage', e);
        }
    }, [cartItems]);

    // 加入購物車
    const addToCart = (courseId) => {
        setCartItems((prev) => {
            if (prev.includes(courseId)) return prev;
            return [...prev, courseId];
        });
    };

    // 移除項目
    const removeFromCart = (courseId) => {
        setCartItems((prev) => prev.filter((id) => id !== courseId));
    };

    // 清空購物車
    const clearCart = () => {
        setCartItems([]);
    };

    // 計算詳細資訊 (從 MOCK_COURSES 查找)
    const cartDetails = useMemo(() => {
        return cartItems
            .map((id) => MOCK_COURSES.find((c) => c.id === id))
            .filter(Boolean); // 過濾掉找不到的課程
    }, [cartItems]);

    // 計算總金額
    const totalAmount = useMemo(() => {
        return cartDetails.reduce((sum, item) => sum + item.price, 0);
    }, [cartDetails]);

    // 檢查是否在購物車內
    const isInCart = (courseId) => cartItems.includes(courseId);

    return (
        <CartContext.Provider value={{
            cartItems,
            cartDetails,
            totalItems: cartItems.length,
            totalAmount,
            addToCart,
            removeFromCart,
            clearCart,
            isInCart,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within a CartProvider');
    return ctx;
}
