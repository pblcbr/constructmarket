import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5005/api',
});

// Add token to all requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
};

// Materials API
export const materialsAPI = {
  getAll: (params) => api.get('/materials', { params }),
  getById: (id) => api.get(`/materials/${id}`),
  create: (materialData) => api.post('/materials', materialData),
  update: (id, materialData) => api.put(`/materials/${id}`, materialData),
  updateStatus: (id, status) => api.patch(`/materials/${id}/status`, { status }),
  delete: (id) => api.delete(`/materials/${id}`),
  getBySeller: (sellerId) => api.get(`/materials/seller/${sellerId}`),
};

// Transactions API
export const transactionsAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (transactionData) => api.post('/transactions', transactionData),
  updateStatus: (id, status, notes) => api.patch(`/transactions/${id}/status`, { status, notes }),
  accept: (id) => api.post(`/transactions/${id}/accept`),
  reject: (id) => api.post(`/transactions/${id}/reject`),
  complete: (id) => api.post(`/transactions/${id}/complete`),
  getStats: () => api.get('/transactions/stats/user'),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  updatePassword: (passwordData) => api.put('/users/password', passwordData),
  getById: (id) => api.get(`/users/${id}`),
};

export default api;

