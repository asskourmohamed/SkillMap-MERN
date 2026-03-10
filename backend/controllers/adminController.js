// server/controllers/adminController.js
const User = require('../models/User');
const Skill = require('../models/Skill');
const Mentorship = require('../models/Mentorship');

// ==================== GESTION DES UTILISATEURS ====================

// GET tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('skills', 'title category level')
      .sort({ createdAt: -1 });

    res.json({
      total: users.length,
      users
    });
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET un utilisateur spécifique
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('skills', 'title category level');

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// PUT modifier un utilisateur
const updateUser = async (req, res) => {
  try {
    const { name, email, department, role } = req.body;
    
    // Empêcher de se modifier soi-même
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ 
        error: 'Utilisez la route /profile pour modifier votre propre compte' 
      });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Mise à jour des champs
    if (name) user.name = name;
    if (email) user.email = email;
    if (department) user.department = department;
    if (role && ['user', 'admin'].includes(role)) {
      user.role = role;
    }

    await user.save();

    res.json({
      message: 'Utilisateur mis à jour',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur modification utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// DELETE supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    // Empêcher de se supprimer soi-même
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ 
        error: 'Vous ne pouvez pas supprimer votre propre compte' 
      });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Supprimer l'utilisateur et ses données associées
    await user.deleteOne();
    await Skill.deleteMany({ owner: user._id });
    await Mentorship.deleteMany({
      $or: [{ mentor: user._id }, { mentee: user._id }]
    });

    res.json({ 
      message: 'Utilisateur et toutes ses données supprimés',
      deletedUser: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// POST créer un utilisateur
const createUser = async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;

    // Validation
    if (!name || !email || !password || !department) {
      return res.status(400).json({ 
        error: 'Nom, email, mot de passe et département requis' 
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    const user = new User({
      name,
      email,
      password,
      department,
      role: role || 'user'
    });

    await user.save();

    res.status(201).json({
      message: 'Utilisateur créé',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ==================== STATISTIQUES ====================

// GET statistiques globales
const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalSkills,
      totalMentorships,
      activeMentorships,
      pendingRequests
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      Skill.countDocuments(),
      Mentorship.countDocuments(),
      Mentorship.countDocuments({ status: 'active' }),
      Mentorship.countDocuments({ status: 'pending' })
    ]);

    // Compétences les plus populaires
    const popularSkills = await Skill.aggregate([
      {
        $group: {
          _id: '$title',
          count: { $sum: 1 },
          category: { $first: '$category' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Utilisateurs les plus actifs (mentors)
    const activeMentors = await Mentorship.aggregate([
      {
        $group: {
          _id: '$mentor',
          mentorshipCount: { $sum: 1 }
        }
      },
      { $sort: { mentorshipCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'mentorInfo'
        }
      },
      { $unwind: '$mentorInfo' },
      {
        $project: {
          name: '$mentorInfo.name',
          department: '$mentorInfo.department',
          mentorships: '$mentorshipCount'
        }
      }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalAdmins,
        totalSkills,
        totalMentorships,
        activeMentorships,
        pendingRequests,
        completionRate: totalMentorships > 0 
          ? Math.round((activeMentorships / totalMentorships) * 100) 
          : 0
      },
      popularSkills,
      activeMentors
    });
  } catch (error) {
    console.error('Erreur récupération statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET statistiques des compétences (gaps)
const getSkillGaps = async (req, res) => {
  try {
    const skillGaps = await Skill.aggregate([
      {
        $group: {
          _id: '$title',
          count: { $sum: 1 },
          level: { $first: '$level' },
          category: { $first: '$category' }
        }
      },
      { $sort: { count: 1 } }, // Les moins nombreuses d'abord
      { $limit: 10 },
      {
        $project: {
          skill: '$_id',
          count: 1,
          level: 1,
          category: 1,
          status: {
            $switch: {
              branches: [
                { case: { $lt: ['$count', 3] }, then: 'critical' },
                { case: { $lt: ['$count', 6] }, then: 'high' },
                { case: { $lt: ['$count', 10] }, then: 'medium' }
              ],
              default: 'stable'
            }
          }
        }
      }
    ]);

    res.json(skillGaps);
  } catch (error) {
    console.error('Erreur récupération skill gaps:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET activité mensuelle
const getMonthlyActivity = async (req, res) => {
  try {
    const year = parseInt(req.params.year) || new Date().getFullYear();
    
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const monthlyActivity = await Mentorship.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          mentorships: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id': 1 } },
      {
        $project: {
          month: '$_id',
          mentorships: 1,
          completed: 1,
          monthName: {
            $arrayElemAt: [
              ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
               'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
              { $subtract: ['$_id', 1] }
            ]
          }
        }
      }
    ]);

    // Compléter les mois manquants avec 0
    const allMonths = [];
    for (let i = 1; i <= 12; i++) {
      const existing = monthlyActivity.find(m => m.month === i);
      allMonths.push(existing || {
        month: i,
        mentorships: 0,
        completed: 0,
        monthName: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'][i-1]
      });
    }

    res.json(allMonths);
  } catch (error) {
    console.error('Erreur récupération activité:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ==================== EXPORTS ====================
module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  getStats,
  getSkillGaps,
  getMonthlyActivity
};