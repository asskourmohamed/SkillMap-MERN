const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Générer le token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { name, email, password, department, jobTitle, company } = req.body;

    // Validation basique
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Hasher le mot de passe manuellement
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer le nouvel utilisateur avec mot de passe hashé
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // Mot de passe déjà hashé
      department,
      jobTitle,
      company
    });

    // Générer le token
    const token = generateToken(user);

    // Retourner les infos (sans le mot de passe)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      token,
      data: userResponse
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email et mot de passe requis'
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    // Générer le token
    const token = generateToken(user);

    // Retourner les infos (sans le mot de passe)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      token,
      data: userResponse
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Obtenir le profil de l'utilisateur connecté
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
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

// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'jobTitle', 'company', 'location', 'bio', 'profilePicture', 'department'];
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

// Changer le mot de passe
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Mot de passe actuel incorrect'
      });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Déconnexion
exports.logout = (req, res) => {
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
};