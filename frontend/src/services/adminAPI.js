import api from './api';

const adminApi = {
  // Dashboard stats
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Users management
  getUsers: (page = 1, search = '') => 
    api.get(`/admin/users?page=${page}&search=${search}`),
  
  getUserById: (id) => api.get(`/admin/users/${id}`),
  
  createUser: (userData) => api.post('/admin/users', userData),
  
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  resetPassword: (id, newPassword) => 
    api.patch(`/admin/users/${id}/password`, { newPassword }),
  
  // Bulk operations
  bulkCreateUsers: (users) => api.post('/admin/users/bulk', { users }),
  
  exportUsers: () => api.get('/admin/users/export/csv', { responseType: 'blob' }),
  
  // Analytics
  getSkillGaps: () => api.get('/admin/skill-gaps'),
  
  getTrends: (period = 'month') => 
    api.get(`/admin/analytics/trends?period=${period}`),
};

export default adminApi;