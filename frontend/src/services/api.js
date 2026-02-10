import axios from 'axios';
import { useAuthStore } from '../store/store';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors - auto logout when token is invalid (but NOT for login/register)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || '';
      const url = error.config?.url || '';
      
      // Don't auto-logout for login/register endpoints (these have their own error handling)
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
      
      // Only auto-logout for token validation errors, not login failures
      if (!isAuthEndpoint && (message.includes('Token is not valid') || message.includes('No token'))) {
        console.log('Token invalid - logging out user');
        useAuthStore.getState().logout();
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// CV API
export const cvAPI = {
  create: (data) => api.post('/cv', data),
  getAll: () => api.get('/cv'),
  getById: (id) => api.get(`/cv/${id}`),
  update: (id, data) => api.put(`/cv/${id}`, data),
  delete: (id) => api.delete(`/cv/${id}`),
  getTemplates: () => api.get('/cv/templates/list'),
};

// Wallpapers API
export const wallpapersAPI = {
  getAll: (params) => api.get('/wallpapers', { params }),
  getById: (id) => api.get(`/wallpapers/${id}`),
  getCategories: () => api.get('/wallpapers/categories'),
  trackDownload: (id) => api.post(`/wallpapers/${id}/download`),
  like: (id) => api.post(`/wallpapers/${id}/like`),
  seed: () => api.post('/wallpapers/seed'),
};

// Photos API
export const photosAPI = {
  getAll: (params) => api.get('/photos', { params }),
  getById: (id) => api.get(`/photos/${id}`),
  getCategories: () => api.get('/photos/categories'),
  trackDownload: (id) => api.post(`/photos/${id}/download`),
  like: (id) => api.post(`/photos/${id}/like`),
  seed: () => api.post('/photos/seed'),
};

export default api;
