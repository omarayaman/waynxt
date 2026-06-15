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
    return response.data;
  },

  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials);
    
    // Save tokens if they are returned directly here
    // The backend might return { token: "...", refresh_token: "..." }
    const { token, access_token, refresh_token } = response.data;
    const finalAccessToken = token || access_token;
    
    if (finalAccessToken) {
      Cookies.set('accessToken', finalAccessToken, { expires: 1 });
    }
    if (refresh_token) {
      Cookies.set('refreshToken', refresh_token, { expires: 7 });
    }
    
    return response.data;
  },

  async googleLogin(token: string) {
    const response = await api.post('/auth/google', { token });
    const { access_token, refresh_token } = response.data;
    
    if (access_token || response.data.token) {
      Cookies.set('accessToken', access_token || response.data.token, { expires: 1 });
    }
    if (refresh_token) {
      Cookies.set('refreshToken', refresh_token, { expires: 7 });
    }
    
    return response.data;
  },

  logout() {
    // Attempt backend logout, but don't wait for it to clear local state
    api.post('/auth/logout').catch(console.error);
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
