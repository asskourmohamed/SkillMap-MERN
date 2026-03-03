import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
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

export const cvService = {
  uploadCV: (file) => {
    const formData = new FormData();
    formData.append('cv', file);
    return API.post('/cv/upload', formData);
  },
  
  deleteCV: () => API.delete('/cv/delete'),
  
  downloadPDF: (userId) => {
    window.open(`http://localhost:5000/api/cv/profile/${userId}/pdf`, '_blank');
  }
};