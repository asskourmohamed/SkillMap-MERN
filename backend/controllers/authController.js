const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Générer le token
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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Le mot de passe sera hashé par le middleware pre('save')
    const user = await User.create({
      name,
      email,
      password, // En clair ici, sera hashé automatiquement
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
    console.error('❌ Erreur register:', error);
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
    
    console.log('🔐 Tentative de connexion pour:', email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email et mot de passe requis'
      });
    }

    // Chercher l'utilisateur AVEC le mot de passe (select +password)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé:', email);
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }

    console.log('✅ Utilisateur trouvé:', user.email);
    console.log('🔑 Hash en DB:', user.password ? user.password.substring(0, 30) + '...' : '❌ PAS DE PASSWORD');

    // Vérifier que le password existe
    if (!user.password) {
      console.error('❌ Utilisateur sans mot de passe!');
      return res.status(500).json({
        success: false,
        error: 'Erreur de configuration du compte'
      });
    }

    // Comparer les mots de passe
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔐 Résultat comparaison:', isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Générer le token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Préparer la réponse sans le mot de passe
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log('✅ Connexion réussie pour:', user.email);

    res.json({
      success: true,
      token,
      data: userResponse
    });

  } catch (error) {
    console.error('❌ Erreur login:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
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
    const allowedFields = ['name', 'jobTitle', 'company', 'location', 'bio', 'profilePicture', 'coverPicture', 'website', 'department'];
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

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Mot de passe actuel incorrect'
      });
    }

    user.password = newPassword; // Sera hashé par le middleware
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
exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
};
