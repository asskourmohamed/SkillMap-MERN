const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

// Chemin CORRECT pour importer le modèle User
const User = require('./models/User');

const createAdmin = async () => {
  try {
    // Connexion à MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillshare';
    console.log('📡 Connexion à MongoDB...');
    console.log('URI:', mongoURI);
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connecté à MongoDB');

    const adminData = {
      name: 'Super Administrateur',
      email: 'admin@skillshare.com',
      password: 'Admin123!',
      department: 'IT',
      role: 'admin',
      jobTitle: 'Administrateur Principal',
      bio: 'Administrateur de la plateforme SkillShare avec tous les droits',
      stats: {
        hoursMentored: 0,
        colleaguesHelped: 0,
        activeMentorships: 0,
        rank: 'Expert',
        xp: 9999
      }
    };

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('\n⚠️  Un administrateur existe déjà avec cet email');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Nom:', existingAdmin.name);
      console.log('🆔 ID:', existingAdmin._id);
      console.log('🔑 Utilisez le mot de passe existant ou supprimez-le d\'abord');
      
      // Option pour supprimer l'ancien admin
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readline.question('\nVoulez-vous supprimer l\'ancien admin et en créer un nouveau? (oui/non): ', async (answer) => {
        if (answer.toLowerCase() === 'oui') {
          await User.deleteOne({ email: adminData.email });
          console.log('✅ Ancien admin supprimé');
          
          // Créer le nouveau
          const salt = await bcrypt.genSalt(10);
          adminData.password = await bcrypt.hash(adminData.password, salt);
          const admin = new User(adminData);
          await admin.save();
          
          console.log('\n✅ Nouvel administrateur créé avec succès !');
          console.log('📧 Email:', adminData.email);
          console.log('🔑 Mot de passe: Admin123!');
        } else {
          console.log('Opération annulée');
        }
        readline.close();
        process.exit(0);
      });
      
      return;
    }

    // Hasher le mot de passe
    console.log('🔐 Hachage du mot de passe...');
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    // Créer l'admin
    console.log('👤 Création de l\'administrateur...');
    const admin = new User(adminData);
    await admin.save();

    console.log('\n✅ Administrateur créé avec succès !');
    console.log('=================================');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Mot de passe: Admin123!');
    console.log('👤 Rôle: Administrateur');
    console.log('=================================');
    console.log('⚠️  IMPORTANT: Changez ce mot de passe après la première connexion !');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur lors de la création:', error);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Vérifie que MongoDB est bien lancé (mongod)');
    }
    process.exit(1);
  }
};

createAdmin();