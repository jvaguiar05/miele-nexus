import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { User, LoginRequest, LoginResponse } from '@/types/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const response = await api.post<LoginResponse>('/auth/login/', credentials);
          const { access, refresh, user } = response.data;
          
          Cookies.set('access_token', access, { expires: 1 }); // 1 day
          Cookies.set('refresh_token', refresh, { expires: 7 }); // 7 days
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      refreshToken: async () => {
        const refreshToken = Cookies.get('refresh_token');
        if (!refreshToken) return;

        try {
          const response = await api.post('/auth/refresh/', {
            refresh: refreshToken
          });
          const { access } = response.data;
          Cookies.set('access_token', access, { expires: 1 });
        } catch (error) {
          get().logout();
        }
      },

      checkAuth: async () => {
        const token = Cookies.get('access_token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const response = await api.get('/auth/me/');
          set({ user: response.data, isAuthenticated: true });
        } catch (error) {
          get().logout();
        }
      },

      setUser: (user: User) => set({ user, isAuthenticated: true }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);