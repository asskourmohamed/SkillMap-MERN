const express = require('express');
const router = express.Router();

const { protect, adminMiddleware } = require('../middleware/auth');

const adminController = require('../controllers/adminController');

// ============================================
// GESTION DES UTILISATEURS
// ============================================

// GET /api/admin/users - Liste tous les utilisateurs
router.get('/users', protect, adminMiddleware, adminController.getUsers);

// GET /api/admin/users/:id - Détails d'un utilisateur
router.get('/users/:id', protect, adminMiddleware, adminController.getUserById);

// POST /api/admin/users - Créer un utilisateur
router.post('/users', protect, adminMiddleware, adminController.createUser);

// PUT /api/admin/users/:id - Modifier un utilisateur
router.put('/users/:id', protect, adminMiddleware, adminController.updateUser);

// DELETE /api/admin/users/:id - Supprimer un utilisateur
router.delete('/users/:id', protect, adminMiddleware, adminController.deleteUser);

// ============================================
// GESTION DES COMPÉTENCES
// ============================================

// GET /api/admin/skills - Liste toutes les compétences
router.get('/skills', protect, adminMiddleware, adminController.getSkills);

module.exports = router;