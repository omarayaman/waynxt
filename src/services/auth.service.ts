import { api } from '@/lib/api';
import Cookies from 'js-cookie';

interface RegisterData {
  [key: string]: unknown;
}

interface LoginCredentials {
  email?: string;
  password?: string;
  [key: string]: unknown;
}

export const authService = {
  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    const respData = response.data.data || response.data;
    
    const token = respData.tokens?.access_token || respData.token || respData.access_token;
    const refreshToken = respData.tokens?.refresh_token || respData.refresh_token;

    if (token) Cookies.set('accessToken', token, { expires: 1 });
    if (refreshToken) Cookies.set('refreshToken', refreshToken, { expires: 7 });

    return response.data;
  },
  
  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials);
    const respData = response.data.data || response.data;

    const token = respData.tokens?.access_token || respData.token || respData.access_token;
    const refreshToken = respData.tokens?.refresh_token || respData.refresh_token;

    if (token) Cookies.set('accessToken', token, { expires: 1 });
    if (refreshToken) Cookies.set('refreshToken', refreshToken, { expires: 7 });

    return response.data;
  },

  async googleLogin(tokenStr: string) {
    const response = await api.post('/auth/google', { token: tokenStr });
    const respData = response.data.data || response.data;

    const token = respData.tokens?.access_token || respData.token || respData.access_token;
    const refreshToken = respData.tokens?.refresh_token || respData.refresh_token;

    if (token) Cookies.set('accessToken', token, { expires: 1 });
    if (refreshToken) Cookies.set('refreshToken', refreshToken, { expires: 7 });

    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  },

  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
