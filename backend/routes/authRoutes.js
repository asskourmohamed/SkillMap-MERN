const express = require('express');
const router = express.Router();
const { protect, adminMiddleware } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

// ============================================
// ROUTES D'AUTHENTIFICATION
// ============================================
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.put('/update', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);
router.post('/logout', authController.logout);

// ============================================
// ROUTES ADMIN (Version simplifiée)
// ============================================

// Gestion des utilisateurs
router.get('/admin/users', protect, adminMiddleware, adminController.getUsers);
router.get('/admin/users/:id', protect, adminMiddleware, adminController.getUserById);
router.post('/admin/users', protect, adminMiddleware, adminController.createUser);
router.put('/admin/users/:id', protect, adminMiddleware, adminController.updateUser);
router.delete('/admin/users/:id', protect, adminMiddleware, adminController.deleteUser);
router.get('/admin/dashboard', protect, adminMiddleware, adminController.getDashboardStats);
// Gestion des compétences
router.get('/admin/skills', protect, adminMiddleware, adminController.getSkills);

module.exports = router;