import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
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

export const postService = {
  // Créer un post avec médias
  createPost: (formData) => API.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Récupérer le feed
  getFeed: (page = 1, limit = 10) => 
    API.get(`/posts/feed?page=${page}&limit=${limit}`),

  // Récupérer les posts d'un utilisateur
  getUserPosts: (userId, page = 1, limit = 10) => 
    API.get(`/posts/user/${userId}?page=${page}&limit=${limit}`),

  // Liker/Unliker
  toggleLike: (postId) => API.post(`/posts/${postId}/like`),

  // Commenter
  addComment: (postId, content) => 
    API.post(`/posts/${postId}/comment`, { content }),

  // Supprimer
  deletePost: (postId) => API.delete(`/posts/${postId}`)
};