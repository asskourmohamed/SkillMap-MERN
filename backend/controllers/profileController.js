const User = require('../models/User');

// Obtenir tous les profils (pour Discovery)
exports.getAllProfiles = async (req, res) => {
  try {
    const { search, department, skill } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (department) {
      query.department = department;
    }
    if (skill) {
      query['skills.name'] = { $regex: skill, $options: 'i' };
    }

    const users = await User.find(query).select('-password -connections');
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Obtenir un profil par ID
exports.getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -connections');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Profil non trouvé'
      });
    }

    // Incrémenter les vues
    await User.findByIdAndUpdate(req.params.id, { $inc: { profileViews: 1 } });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ========== SKILLS ==========
exports.addSkill = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    user.skills.push({
      ...req.body,
      endorsements: []
    });
    await user.save();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    user.skills.id(req.params.skillId).deleteOne();
    await user.save();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ========== PROJECTS ==========
exports.addProject = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    user.projects.push(req.body);
    await user.save();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    user.projects.id(req.params.projectId).deleteOne();
    await user.save();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ========== EXPERIENCES ==========
exports.addExperience = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    user.experiences.push(req.body);
    await user.save();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    user.experiences.id(req.params.expId).deleteOne();
    await user.save();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};