import api from './api';

const skillService = {
  // Récupérer toutes les compétences
  getAllSkills: async () => {
    try {
      const response = await api.get('/skills');
      return response;
    } catch (error) {
      console.error('Erreur getAllSkills:', error);
      throw error;
    }
  },

  // Récupérer les compétences d'un utilisateur
  getUserSkills: async (userId) => {
    try {
      const response = await api.get(`/skills/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Erreur getUserSkills:', error);
      throw error;
    }
  },

  // Créer une compétence
  createSkill: async (skillData) => {
    try {
      const response = await api.post('/skills', skillData);
      return response;
    } catch (error) {
      console.error('Erreur createSkill:', error);
      throw error;
    }
  },

  // Mettre à jour une compétence
  updateSkill: async (id, skillData) => {
    try {
      const response = await api.put(`/skills/${id}`, skillData);
      return response;
    } catch (error) {
      console.error('Erreur updateSkill:', error);
      throw error;
    }
  },

  // Supprimer une compétence
  deleteSkill: async (id) => {
    try {
      const response = await api.delete(`/skills/${id}`);
      return response;
    } catch (error) {
      console.error('Erreur deleteSkill:', error);
      throw error;
    }
  },

  // Rechercher des compétences
  searchSkills: async (keyword) => {
    try {
      const response = await api.get(`/skills/search/${keyword}`);
      return response;
    } catch (error) {
      console.error('Erreur searchSkills:', error);
      throw error;
    }
  }
};

export default skillService;