import { createContext, useContext, useState, useCallback } from 'react';

/**
 * AuthContext — 全域認證狀態
 * 提供 user、isAuthenticated、login、logout
 */
const AuthContext = createContext(null);

/* ─── 測試帳號（開發用）─── */
const TEST_ACCOUNT = {
    email: 'test@example.com',
    password: 'Test1234',
    name: '測試使用者',
};

const TEACHER_ACCOUNT = {
    email: 'teacher@example.com',
    password: 'Teacher1234',
    name: '測試老師',
    role: 'teacher'
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    /**
     * 模擬登入
     * @returns {{ success: boolean, error?: string }}
     */
    const login = useCallback(async (email, password) => {
        // 模擬 API 延遲
        await new Promise((r) => setTimeout(r, 1000));

        if (email === TEST_ACCOUNT.email && password === TEST_ACCOUNT.password) {
            setUser({ name: TEST_ACCOUNT.name, email: TEST_ACCOUNT.email, role: 'student' });
            return { success: true };
        }

        if (email === TEACHER_ACCOUNT.email && password === TEACHER_ACCOUNT.password) {
            setUser({ name: TEACHER_ACCOUNT.name, email: TEACHER_ACCOUNT.email, role: 'teacher' });
            return { success: true };
        }
        return { success: false, error: '帳號或密碼錯誤，請再試一次' };
    }, []);

    /**
     * 模擬註冊
     */
    const register = useCallback(async (name, email) => {
        await new Promise((r) => setTimeout(r, 1000));
        // 模擬成功：自動登入 (預設為學生)
        setUser({ name, email, role: 'student' });
        return { success: true };
    }, []);

    /** 登出 */
    const logout = useCallback(() => {
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            register,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

/** 取得認證狀態的 Hook */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth 必須在 AuthProvider 內使用');
    return ctx;
}
