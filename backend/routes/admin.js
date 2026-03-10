const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Skill = require('../models/Skill');
const Mentorship = require('../models/Mentorship');

// Importer les middlewares depuis auth.js
const { protect, adminMiddleware } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', protect, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const totalMentorships = await Mentorship.countDocuments();
    
    const activeMentorships = await Mentorship.countDocuments({ status: 'active' });
    const pendingMentorships = await Mentorship.countDocuments({ status: 'pending' });
    
    // Utilisateurs par département
    const usersByDepartment = await User.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          byDepartment: usersByDepartment
        },
        skills: {
          total: totalSkills
        },
        mentorships: {
          total: totalMentorships,
          active: activeMentorships,
          pending: pendingMentorships
        }
      }
    });
  } catch (error) {
    console.error('Erreur stats admin:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/admin/users
router.get('/users', protect, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Erreur liste users:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/admin/skill-gaps
router.get('/skill-gaps', protect, adminMiddleware, async (req, res) => {
  try {
    const skills = await Skill.find();
    
    // Simuler des données de demande (à remplacer par des données réelles)
    const skillGaps = await Promise.all(
      allSkills.map(async skill => ({
        skill: skill.title,
        category: skill.category,
        supply: await Skill.countDocuments({ title: skill.title }),
        demand: Math.floor(Math.random() * 50) + 20,
        level: skill.level
      }))
    );

    
    // Calculer le gap
    const processedGaps = skillGaps.map(gap => ({
      ...gap,
      gap: gap.demand - gap.supply,
      status: gap.demand > gap.supply * 1.5 ? 'critical' : 
               gap.demand > gap.supply * 1.2 ? 'high' : 
               gap.demand < gap.supply * 0.5 ? 'surplus' : 'stable'
    }));
    
    res.json({
      success: true,
      data: processedGaps.sort((a, b) => b.gap - a.gap)
    });
  } catch (error) {
    console.error('Erreur skill gaps:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/admin/users/:id
router.get('/users/:id', protect, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'Utilisateur non trouvé' 
      });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Erreur get user:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', protect, adminMiddleware, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Rôle invalide. Utilisez "user" ou "admin"' 
      });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'Utilisateur non trouvé' 
      });
    }
    
    // Empêcher de se retirer le rôle admin à soi-même
    if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ 
        success: false, 
        error: 'Vous ne pouvez pas retirer votre propre rôle admin' 
      });
    }
    
    user.role = role;
    await user.save();
    
    res.json({
      success: true,
      message: `Rôle changé pour ${user.name}`,
      data: { role: user.role }
    });
  } catch (error) {
    console.error('Erreur change role:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', protect, adminMiddleware, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Vous ne pouvez pas supprimer votre propre compte' 
      });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'Utilisateur non trouvé' 
      });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: `Utilisateur ${user.name} supprimé avec succès`
    });
  } catch (error) {
    console.error('Erreur delete user:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
// ============================================
// GESTION DES UTILISATEURS PAR L'ADMIN
// ============================================

/**
 * POST /api/admin/users
 * Créer un nouvel utilisateur (par l'admin)
 */
router.post('/users', protect, adminMiddleware, async (req, res) => {
  try {
    const { name, email, password, department, role, jobTitle, bio } = req.body;

    // Validation des champs requis
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Nom, email et mot de passe sont requis'
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Validation du rôle (si fourni)
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Rôle invalide. Utilisez "user" ou "admin"'
      });
    }

    // Créer le nouvel utilisateur
    const userData = {
      name,
      email,
      password, // Sera hashé par le middleware pre('save')
      department: department || 'Non spécifié',
      role: role || 'user',
      jobTitle: jobTitle || '',
      bio: bio || '',
      stats: {
        hoursMentored: 0,
        colleaguesHelped: 0,
        activeMentorships: 0,
        responseRate: 100,
        rank: 'Débutant',
        xp: 0
      }
    };

    const user = new User(userData);
    await user.save();

    // Ne pas retourner le mot de passe
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: userResponse
    });

  } catch (error) {
    console.error('Erreur création utilisateur par admin:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/admin/users/bulk
 * Créer plusieurs utilisateurs en lot
 */
router.post('/users/bulk', protect, adminMiddleware, async (req, res) => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Le tableau users est requis et ne peut pas être vide'
      });
    }

    const results = {
      created: [],
      errors: []
    };

    for (const userData of users) {
      try {
        // Validation de base
        if (!userData.name || !userData.email || !userData.password) {
          results.errors.push({
            email: userData.email,
            error: 'Nom, email et mot de passe requis'
          });
          continue;
        }

        // Vérifier si l'email existe
        const existing = await User.findOne({ email: userData.email });
        if (existing) {
          results.errors.push({
            email: userData.email,
            error: 'Email déjà utilisé'
          });
          continue;
        }

        // Créer l'utilisateur
        const user = new User({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          department: userData.department || 'Non spécifié',
          role: userData.role || 'user',
          jobTitle: userData.jobTitle || '',
          bio: userData.bio || ''
        });

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;
        results.created.push(userResponse);

      } catch (err) {
        results.errors.push({
          email: userData.email,
          error: err.message
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `${results.created.length} utilisateurs créés, ${results.errors.length} erreurs`,
      data: results
    });

  } catch (error) {
    console.error('Erreur création multiple:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/users/:id
 * Modifier un utilisateur existant
 */
router.put('/users/:id', protect, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Champs autorisés à être modifiés
    const allowedUpdates = [
      'name', 'email', 'department', 'role', 'jobTitle', 
      'bio', 'location', 'profileImage', 'stats'
    ];

    // Filtrer pour ne garder que les champs autorisés
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // Validation spéciale pour le rôle
    if (filteredUpdates.role && !['user', 'admin'].includes(filteredUpdates.role)) {
      return res.status(400).json({
        success: false,
        error: 'Rôle invalide. Utilisez "user" ou "admin"'
      });
    }

    // Vérifier si l'email est déjà pris (si modifié)
    if (filteredUpdates.email) {
      const existingUser = await User.findOne({ 
        email: filteredUpdates.email,
        _id: { $ne: id }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Cet email est déjà utilisé par un autre utilisateur'
        });
      }
    }

    // Empêcher l'admin de se modifier lui-même pour certaines choses
    if (id === req.user._id.toString()) {
      if (filteredUpdates.role && filteredUpdates.role !== 'admin') {
        return res.status(400).json({
          success: false,
          error: 'Vous ne pouvez pas retirer votre propre rôle admin'
        });
      }
    }

    // Mettre à jour l'utilisateur
    const user = await User.findByIdAndUpdate(
      id,
      filteredUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: user
    });

  } catch (error) {
    console.error('Erreur modification utilisateur:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PATCH /api/admin/users/:id/password
 * Réinitialiser le mot de passe d'un utilisateur
 */
router.patch('/users/:id/password', protect, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Le hash se fera automatiquement via le middleware pre('save')
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });

  } catch (error) {
    console.error('Erreur réinitialisation mot de passe:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/admin/users/export/csv
 * Exporter tous les utilisateurs en CSV
 */
router.get('/users/export/csv', protect, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();

    // Définir les colonnes du CSV
    const fields = [
      'name',
      'email',
      'department',
      'role',
      'jobTitle',
      'createdAt',
      'stats.hoursMentored',
      'stats.colleaguesHelped',
      'stats.activeMentorships',
      'stats.responseRate',
      'stats.rank',
      'stats.xp'
    ];

    // Créer l'en-tête du CSV
    const csvRows = [];
    csvRows.push(fields.join(','));

    // Ajouter les données de chaque utilisateur
    for (const user of users) {
      const row = fields.map(field => {
        // Gérer les champs imbriqués (stats.hoursMentored)
        const value = field.includes('.') 
          ? field.split('.').reduce((obj, key) => obj?.[key], user) 
          : user[field];
        
        // Échapper les virgules et guillemets
        const escaped = String(value || '').replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',');
      csvRows.push(row);
    }

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=skillshare_users.csv');
    res.send(csv);

  } catch (error) {
    console.error('Erreur export CSV:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
module.exports = router;