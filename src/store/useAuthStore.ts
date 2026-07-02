import { create } from 'zustand';
import { authService } from '@/services/auth.service';
import { UserPreferences } from '@/types/user';

interface User {
  id: string;
  full_name: string;
  email: string;
  auth_provider?: string;
  avatar_url?: string;
  city?: string;
  role: string;
  explorer_points: number;
  badge_type?: string;
  preferences?: UserPreferences;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchCurrentUser: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  fetchCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const response = await authService.getProfile();
      // Adjust depending on how backend wraps response (e.g., response.data or response directly)
      const userData = response.data || response;
      set({ user: userData, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      const { useSavedPlacesStore } = await import('@/store/useSavedPlacesStore');
      useSavedPlacesStore.getState().reset();
      set({ user: null, isAuthenticated: false });
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },
}));
