const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// ==============================
// Générer le token (JWT minimal)
// ==============================
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id }, // JWT minimal
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};


// ==============================
// Inscription
// ==============================
exports.register = async (req, res) => {
  try {
    const { name, email, password, department, jobTitle, company } = req.body;

    // Vérification champs obligatoires
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Nom, email et mot de passe sont requis"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Vérifier si l'utilisateur existe
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Un utilisateur avec cet email existe déjà"
      });
    }

    // Création utilisateur (hash via middleware pre('save'))
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      department,
      jobTitle,
      company,
      skills: [],
      projects: [],
      experiences: []
    });

    const token = generateToken(user);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      token,
      data: userResponse
    });

  } catch (error) {
    console.error("Erreur register:", error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};


// ==============================
// Connexion
// ==============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email et mot de passe requis"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Email ou mot de passe incorrect"
      });
    }

    if (!user.password) {
      return res.status(500).json({
        success: false,
        error: "Erreur de configuration du compte"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Email ou mot de passe incorrect"
      });
    }

    const token = generateToken(user);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      token,
      data: userResponse
    });

  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};


// ==============================
// Obtenir le profil
// ==============================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé"
      });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      data: userResponse
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};


// ==============================
// Mettre à jour le profil
// ==============================
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name',
      'jobTitle',
      'company',
      'location',
      'bio',
      'profilePicture',
      'coverPicture',
      'website',
      'department'
    ];

    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé"
      });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      data: userResponse
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};


// ==============================
// Changer le mot de passe
// ==============================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Mot de passe actuel et nouveau requis"
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé"
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Mot de passe actuel incorrect"
      });
    }

    user.password = newPassword; // Hash via middleware
    await user.save();

    res.json({
      success: true,
      message: "Mot de passe modifié avec succès"
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};


// ==============================
// Déconnexion
// ==============================
exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: "Déconnexion réussie"
  });
};
