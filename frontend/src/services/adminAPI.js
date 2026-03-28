import api from './api';

const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/auth/admin/dashboard'),
  
  // Users
  getUsers: (page = 1, search = '') => 
    api.get(`/admin/users?page=${page}&search=${search}`),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  changeUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),

  // Skills
  getSkills: () => api.get('/admin/skills'),
};

export default adminAPI;