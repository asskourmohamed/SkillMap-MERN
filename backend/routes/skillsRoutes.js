const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const skillController = require('../controllers/skillController');

// ==================== ROUTES PUBLIQUES (accessibles sans authentification) ====================
// GET toutes les compétences
router.get('/', skillController.getAllSkills);

// GET recherche de compétences
router.get('/search/:keyword', skillController.searchSkills);

// GET compétences d'un utilisateur spécifique
router.get('/user/:userId', skillController.getUserSkills);

// GET une compétence par ID
router.get('/:id', skillController.getSkillById);

// ==================== ROUTES PROTÉGÉES (nécessitent authentification) ====================
// POST créer une compétence (tout utilisateur connecté)
router.post('/', authMiddleware, skillController.createSkill);

// PUT modifier une compétence (seulement le propriétaire)
router.put('/:id', authMiddleware, skillController.updateSkill);

// DELETE supprimer une compétence (seulement le propriétaire)
router.delete('/:id', authMiddleware, skillController.deleteSkill);

module.exports = router;