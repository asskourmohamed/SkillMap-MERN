import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
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
    return Promise.resolve({ success: true });
  }
};

// Service pour les profils (remplace employeeService)
export const profileService = {
  getAll: (params) => API.get('/profiles', { params }),
  getById: (id) => API.get(`/profiles/${id}`),
  search: (query) => API.get(`/profiles/search/${query}`)
};

// Service pour les compétences
export const skillService = {
  addSkill: (userId, skillData) => API.post(`/profiles/${userId}/skills`, skillData),
  deleteSkill: (userId, skillId) => API.delete(`/profiles/${userId}/skills/${skillId}`)
};

// Service pour les projets
export const projectService = {
  addProject: (userId, projectData) => API.post(`/profiles/${userId}/projects`, projectData),
  deleteProject: (userId, projectId) => API.delete(`/profiles/${userId}/projects/${projectId}`)
};

// Service pour les expériences
export const experienceService = {
  addExperience: (userId, expData) => API.post(`/profiles/${userId}/experiences`, expData),
  deleteExperience: (userId, expId) => API.delete(`/profiles/${userId}/experiences/${expId}`)
};

export default API;