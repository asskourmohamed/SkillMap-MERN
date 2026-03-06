const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const Skill = require('../models/Skill'); // Commenté pour le moment
// const Mentorship = require('../models/Mentorship'); // Commenté pour le moment
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Middleware d'authentification temporaire pour le développement
// À remplacer par le vrai middleware quand il sera prêt
const tempAuth = (req, res, next) => {
  req.user = { role: 'admin' }; // Simuler un admin pour le test
  next();
};

// Appliquer les middlewares
router.use(tempAuth); // Utilise tempAuth pour le moment
// router.use(authMiddleware);
// router.use(adminMiddleware);

// Route de test
router.get('/test', (req, res) => {
  res.json({ message: 'Route admin fonctionne !' });
});

// ============================================
// GESTION DES UTILISATEURS
// ============================================

// GET tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET un utilisateur spécifique
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST créer un utilisateur
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, department, role, jobTitle, bio } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const user = new User({
      name,
      email,
      password,
      department,
      role: role || 'user',
      jobTitle,
      bio
    });

    await user.save();

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT modifier un utilisateur
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, department, role, jobTitle, bio } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Mise à jour des champs
    if (name) user.name = name;
    if (email) user.email = email;
    if (department) user.department = department;
    if (role) user.role = role;
    if (jobTitle) user.jobTitle = jobTitle;
    if (bio) user.bio = bio;

    await user.save();

    res.json({
      message: 'Utilisateur mis à jour',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur modification utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    await user.deleteOne();

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ============================================
// STATISTIQUES SIMPLIFIÉES
// ============================================

// GET statistiques globales
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ role: 'admin' });
    const users = await User.countDocuments({ role: 'user' });

    res.json({
      overview: {
        totalUsers,
        admins,
        users
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;