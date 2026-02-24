import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  getMe: () => API.get('/auth/me'),
  updateProfile: (userData) => API.put('/auth/profile', userData),
  changePassword: (passwords) => API.put('/auth/change-password', passwords),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return API.post('/auth/logout');
  }
};

// Service pour les compétences
export const skillService = {
  addSkill: (userId, skillData) => API.post(`/employees/${userId}/skills`, skillData),
  updateSkill: (userId, skillId, skillData) => API.put(`/employees/${userId}/skills/${skillId}`, skillData),
  deleteSkill: (userId, skillId) => API.delete(`/employees/${userId}/skills/${skillId}`),
  endorseSkill: (userId, skillId, endorserId) => 
    API.post(`/employees/${userId}/skills/${skillId}/endorse`, { endorserId })
};

// Service pour les projets
export const projectService = {
  addProject: (userId, projectData) => API.post(`/employees/${userId}/projects`, projectData),
  updateProject: (userId, projectId, projectData) => 
    API.put(`/employees/${userId}/projects/${projectId}`, projectData),
  deleteProject: (userId, projectId) => API.delete(`/employees/${userId}/projects/${projectId}`)
};

// Service pour les expériences
export const experienceService = {
  addExperience: (userId, expData) => API.post(`/employees/${userId}/experiences`, expData),
  updateExperience: (userId, expId, expData) => 
    API.put(`/employees/${userId}/experiences/${expId}`, expData),
  deleteExperience: (userId, expId) => API.delete(`/employees/${userId}/experiences/${expId}`)
};

// Service pour les employés (profils publics)
export const employeeService = {
  getAll: (params) => API.get('/employees', { params }),
  getById: (id) => API.get(`/employees/${id}`),
  search: (query, filters) => {
    const params = new URLSearchParams(filters).toString();
    return API.get(`/employees/search/${query}?${params}`);
  }
};

export default API;