/**
 * 認證相關 API 服務
 */
import api from '@/lib/api';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export const authService = {
  /**
   * Google OAuth 登入
   */
  async googleLogin(): Promise<string> {
    const response = await api.get('/api/v1/auth/oauth/google');
    return response.data.auth_url;
  },

  /**
   * 處理 OAuth 回調
   */
  async handleOAuthCallback(code: string): Promise<LoginResponse> {
    const response = await api.post('/api/v1/auth/oauth/google/callback', { code });
    return response.data;
  },

  /**
   * 取得當前用戶資訊
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/api/v1/users/me');
    return response.data;
  },

  /**
   * 登出
   */
  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/';
  },
};

export default authService;
