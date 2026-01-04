import axios from 'axios';
import Cookies from 'js-cookie';

// Determine API URL based on environment
const getApiUrl = () => {
  // For production (Vercel)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // For development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  
  // For production without env var (same domain)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  return 'https://payroll-system-web.vercel.app';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  register: (username, password, email, role) =>
    api.post('/auth/register', { username, password, email, role }),
};

// Employee endpoints
export const employees = {
  getAll: () => api.get('/employees'),
  getOne: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

// Payroll endpoints
export const payroll = {
  getAll: (filters = {}) =>
    api.get('/payroll', { params: filters }),
  create: (data) => api.post('/payroll', data),
  update: (id, data) => api.put(`/payroll/${id}`, data),
  delete: (id) => api.delete(`/payroll/${id}`),
  getSummary: () => api.get('/payroll/summary'),
};

// Health check
export const health = () => api.get('/health');

export default api;
