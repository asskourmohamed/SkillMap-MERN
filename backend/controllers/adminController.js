const User = require('../models/User');
const Skill = require('../models/Skill');
const Mentorship = require('../models/Mentorship');
// ============================================
// GESTION DES UTILISATEURS
// ============================================

/**
 * GET /api/admin/users
 * Liste tous les utilisateurs
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('❌ Erreur liste users:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * GET /api/admin/users/:id
 * Détails d'un utilisateur avec ses compétences
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('skills', 'title category level');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'Utilisateur non trouvé' 
      });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('❌ Erreur get user:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * POST /api/admin/users
 * Créer un nouvel utilisateur
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;

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

    // Créer l'utilisateur
    const user = new User({
      name,
      email,
      password,
      department: department || 'Non spécifié',
      role: role || 'user'
    });

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
    console.error('❌ Erreur création utilisateur:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * PUT /api/admin/users/:id
 * Modifier un utilisateur
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, role } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si l'email est déjà pris (si modifié)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Cet email est déjà utilisé par un autre utilisateur'
        });
      }
    }

    // Mettre à jour les champs
    if (name) user.name = name;
    if (email) user.email = email;
    if (department) user.department = department;
    if (role && ['user', 'admin'].includes(role)) user.role = role;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: userResponse
    });

  } catch (error) {
    console.error('❌ Erreur modification utilisateur:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * DELETE /api/admin/users/:id
 * Supprimer un utilisateur
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Empêcher de supprimer son propre compte
    if (id === req.user._id.toString()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Vous ne pouvez pas supprimer votre propre compte' 
      });
    }
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'Utilisateur non trouvé' 
      });
    }
    
    await User.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: `Utilisateur ${user.name} supprimé avec succès`
    });
  } catch (error) {
    console.error('❌ Erreur delete user:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// ============================================
// GESTION DES COMPÉTENCES
// ============================================

/**
 * GET /api/admin/skills
 * Version simplifiée - retourne toutes les compétences des utilisateurs
 */
exports.getSkills = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs
    const users = await User.find().select('name email department skills');
    
    // Extraire toutes les compétences
    const allSkills = [];
    
    users.forEach(user => {
      if (user.skills && user.skills.length > 0) {
        user.skills.forEach(skill => {
          allSkills.push({
            _id: skill._id,
            name: skill.name || skill.title,
            level: skill.level,
            yearsOfExperience: skill.yearsOfExperience,
            owner: {
              _id: user._id,
              name: user.name,
              email: user.email,
              department: user.department
            }
          });
        });
      }
    });
    
    res.json({
      success: true,
      data: allSkills,
      summary: {
        totalUsers: users.length,
        totalSkills: allSkills.length
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
// backend/controllers/adminController.js

// backend/controllers/adminController.js

/**
 * GET /api/auth/admin/dashboard
 * Statistiques pour le dashboard admin
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const totalUsers = await User.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const totalMentorships = await Mentorship.countDocuments();
    const activeMentorships = await Mentorship.countDocuments({ status: 'active' });
    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const recentUsers = await User.find()
      .sort('-createdAt')
      .limit(5)
      .select('name email createdAt');

    // Calculer la croissance
    const previousMonthUsers = await User.countDocuments({
      createdAt: { $lt: thirtyDaysAgo }
    });
    const userGrowth = previousMonthUsers > 0 
      ? Math.round(((totalUsers - previousMonthUsers) / previousMonthUsers) * 100)
      : 0;

    // Taux d'engagement
    const engagementRate = totalUsers > 0 
      ? Math.round((activeMentorships / totalUsers) * 100) 
      : 0;

    // Top compétences (depuis les utilisateurs)
    const usersWithSkills = await User.find({ skills: { $exists: true, $ne: [] } })
      .select('skills');
    
    const skillCount = {};
    usersWithSkills.forEach(user => {
      if (user.skills) {
        user.skills.forEach(skill => {
          const name = skill.name || skill.title;
          if (name) {
            skillCount[name] = (skillCount[name] || 0) + 1;
          }
        });
      }
    });
    
    const topSkills = Object.entries(skillCount)
      .map(([name, count]) => ({ _id: name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        stats: {
          users: {
            total: totalUsers,
            new: newUsers,
            growth: userGrowth
          },
          skills: {
            total: totalSkills,
            topSkills: topSkills
          },
          mentorships: {
            total: totalMentorships,
            active: activeMentorships,
            engagementRate: engagementRate
          }
        },
        recentUsers: recentUsers || []
      }
    });

  } catch (error) {
    console.error('❌ Erreur dashboard:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};