const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// ============================================
// ROUTES D'AUTHENTIFICATION
// ============================================

// POST /api/auth/register - Inscription
router.post('/register', authController.register);

// POST /api/auth/login - Connexion
router.post('/login', authController.login);

// GET /api/auth/me - Récupérer le profil connecté (protégé)
router.get('/me', protect, authController.getMe);

// PUT /api/auth/update - Mettre à jour le profil (protégé)
router.put('/update', protect, authController.updateProfile);

// PUT /api/auth/change-password - Changer le mot de passe (protégé)
router.put('/change-password', protect, authController.changePassword);

// POST /api/auth/logout - Déconnexion
router.post('/logout', authController.logout);

module.exports = router;