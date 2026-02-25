const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const profileController = require('../controllers/profileController');

// Routes publiques (protégées par authentification mais accessibles à tous les utilisateurs connectés)
router.get('/', protect, profileController.getAllProfiles);
router.get('/:id', protect, profileController.getProfileById);

// Routes pour les modifications (nécessitent que l'utilisateur soit le propriétaire)
router.post('/:id/skills', protect, profileController.addSkill);
router.delete('/:id/skills/:skillId', protect, profileController.deleteSkill);

router.post('/:id/projects', protect, profileController.addProject);
router.delete('/:id/projects/:projectId', protect, profileController.deleteProject);

router.post('/:id/experiences', protect, profileController.addExperience);
router.delete('/:id/experiences/:expId', protect, profileController.deleteExperience);

module.exports = router;