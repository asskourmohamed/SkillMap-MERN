const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware de protection (authentification)
const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est dans le header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Non autorisé - Token manquant'
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur
    const user = await User.findById(decoded.id || decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Non autorisé - Utilisateur non trouvé'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur auth:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Non autorisé - Token invalide'
    });
  }
};

// Middleware pour vérifier les rôles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Non autorisé - Utilisateur non connecté'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Rôle ${req.user.role} non autorisé. Rôles requis: ${roles.join(', ')}`
      });
    }
    next();
  };
};

// Middleware admin (version simplifiée)
const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      error: 'Authentification requise' 
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      error: 'Accès admin requis' 
    });
  }

  next();
};

// Exporter tout correctement
module.exports = {
  protect,
  authorize,
  adminMiddleware
};