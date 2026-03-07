const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');

// Charger les variables d'environnement
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Importer le modèle User (chemin correct depuis le dossier scripts)
const User = require('./models/User');

const createAdmin = async () => {
  try {
    // Connexion à MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/skillshare';
    console.log('📡 Connexion à MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB');

    const adminData = {
      name: 'Administrateur',
      email: 'admin@skillshare.com',
      password: 'Admin123!',
      department: 'IT',
      role: 'admin',
      jobTitle: 'Administrateur système',
      bio: 'Administrateur de la plateforme SkillShare',
      stats: {
        hoursMentored: 0,
        colleaguesHelped: 0,
        activeMentorships: 0,
        rank: 'Expert',
        xp: 1000
      }
    };

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('📝 Administrateur existant trouvé:');
      console.log('Email:', existingAdmin.email);
      console.log('Rôle actuel:', existingAdmin.role);
      
      // Mettre à jour le rôle si nécessaire
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Rôle mis à jour vers "admin"');
      } else {
        console.log('✅ Le rôle est déjà "admin"');
      }
      
      console.log('📧 Email:', existingAdmin.email);
      process.exit(0);
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Administrateur créé avec succès !');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Mot de passe:', 'Admin123!');
    console.log('📋 Rôle:', admin.role);
    console.log('⚠️  Changez ce mot de passe après la première connexion !');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
    process.exit(1);
  }
};

createAdmin();