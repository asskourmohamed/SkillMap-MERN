const express = require('express');
const router = express.Router();
const { protect, adminMiddleware } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');


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

// ============================================
// DASHBOARD & STATISTIQUES
// ============================================
router.get('/stats', protect, adminMiddleware, adminController.getStats);
router.get('/dashboard', protect, adminMiddleware, adminController.getDashboardStats);
router.get('/skill-gaps', protect, adminMiddleware, adminController.getSkillGaps);

// ============================================
// GESTION DES UTILISATEURS
// ============================================
router.get('/users', protect, adminMiddleware, adminController.getUsers);
router.get('/users/export/csv', protect, adminMiddleware, adminController.exportUsersCSV);
router.get('/users/:id', protect, adminMiddleware, adminController.getUserById);

router.post('/users', protect, adminMiddleware, adminController.createUser);
router.post('/users/bulk', protect, adminMiddleware, adminController.createUsersBulk);

router.put('/users/:id', protect, adminMiddleware, adminController.updateUser);
router.put('/users/:id/role', protect, adminMiddleware, adminController.changeUserRole);
router.patch('/users/:id/password', protect, adminMiddleware, adminController.resetUserPassword);

router.delete('/users/:id', protect, adminMiddleware, adminController.deleteUser);

module.exports = router;