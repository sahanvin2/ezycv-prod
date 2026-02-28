import axios from 'axios';
import { useAuthStore } from './store';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on invalid token (skip login/register endpoints)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const msg = error.response?.data?.message || '';
      const url = error.config?.url || '';
      const isAuth = url.includes('/auth/login') || url.includes('/auth/register');
      if (!isAuth && (msg.includes('Token is not valid') || msg.includes('No token'))) {
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

/* ── Auth ──────────────────────────────────────────── */
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  firebaseLogin: (idToken: string) =>
    api.post('/auth/firebase-login', { idToken }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: Record<string, unknown>) =>
    api.put('/auth/profile', data),
};

/* ── CV ────────────────────────────────────────────── */
export const cvAPI = {
  create: (data: Record<string, unknown>) => api.post('/cv', data),
  getAll: () => api.get('/cv'),
  getById: (id: string) => api.get(`/cv/${id}`),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/cv/${id}`, data),
  delete: (id: string) => api.delete(`/cv/${id}`),
  getTemplates: () => api.get('/cv/templates/list'),
  getLiveStats: () => api.get('/cv/stats/live'),
  backupToCloud: (cvData: unknown, sessionId: string) =>
    api.post('/cv/backup', { cvData, sessionId }),
};

/* ── Wallpapers ────────────────────────────────────── */
export const wallpapersAPI = {
  getAll: (params?: Record<string, unknown>) =>
    api.get('/wallpapers', { params }),
  getById: (id: string) => api.get(`/wallpapers/${id}`),
  getCategories: () => api.get('/wallpapers/categories'),
  trackDownload: (id: string) => api.post(`/wallpapers/${id}/download`),
  like: (id: string) => api.post(`/wallpapers/${id}/like`),
  seed: () => api.post('/wallpapers/seed'),
};

/* ── Photos ────────────────────────────────────────── */
export const photosAPI = {
  getAll: (params?: Record<string, unknown>) =>
    api.get('/photos', { params }),
  getById: (id: string) => api.get(`/photos/${id}`),
  getCategories: () => api.get('/photos/categories'),
  trackDownload: (id: string) => api.post(`/photos/${id}/download`),
  like: (id: string) => api.post(`/photos/${id}/like`),
  seed: () => api.post('/photos/seed'),
};

export default api;
