const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Importer le modèle sans utiliser le middleware
const User = require('./models/User');

const fixAdminFinal = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/competences');
    console.log('✅ Connecté à MongoDB\n');

    const email = 'admin@skillshare.com';
    const plainPassword = 'Admin123!';

    // Supprimer l'ancien admin
    await User.deleteOne({ email });
    console.log('🗑️  Ancien admin supprimé\n');

    // 1. Générer un hash qui fonctionne
    console.log('🔐 Génération du hash de référence...');
    const salt = await bcrypt.genSalt(12);
    const correctHash = await bcrypt.hash(plainPassword, salt);
    
    // Vérifier que ce hash fonctionne
    const verify = await bcrypt.compare(plainPassword, correctHash);
    console.log('   Hash généré:', correctHash);
    console.log('   Vérification:', verify ? '✅ OK' : '❌ ÉCHEC');

    if (!verify) {
      throw new Error('Le hash généré ne fonctionne pas!');
    }

    // 2. Créer l'admin en contournant le middleware
    console.log('\n👤 Création du nouvel admin (sans middleware)...');
    
    // Utiliser insertOne au lieu de save pour contourner les middlewares
    const result = await User.collection.insertOne({
      name: 'Super Administrateur',
      email: email,
      password: correctHash, // On force ce hash exact
      department: 'IT',
      role: 'admin',
      jobTitle: 'Administrateur Principal',
      bio: 'Administrateur de la plateforme SkillShare',
      skills: [],
      projects: [],
      experiences: [],
      profileViews: 0,
      openForWork: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Admin créé avec insertOne, ID:', result.insertedId);

    // 3. Vérification immédiate
    console.log('\n🔍 Vérification immédiate:');
    
    // Récupérer l'admin fraîchement créé
    const freshAdmin = await User.findOne({ email }).select('+password');
    
    console.log('   Email:', freshAdmin.email);
    console.log('   Hash stocké:', freshAdmin.password);
    
    // Test avec bcrypt.compare
    const testCompare = await bcrypt.compare(plainPassword, freshAdmin.password);
    console.log('   Test bcrypt.compare:', testCompare ? '✅ OK' : '❌ ÉCHEC');
    
    // Test avec la méthode du modèle (si elle existe)
    if (typeof freshAdmin.comparePassword === 'function') {
      const modelCompare = await freshAdmin.comparePassword(plainPassword);
      console.log('   Test comparePassword():', modelCompare ? '✅ OK' : '❌ ÉCHEC');
    }

    if (testCompare) {
      console.log('\n🎉 ADMINISTRATEUR PRÊT !');
      console.log('══════════════════════════');
      console.log('📧 Email: admin@skillshare.com');
      console.log('🔑 Mot de passe: Admin123!');
      console.log('══════════════════════════');
      
      // 4. Test final avec une simulation de login
      console.log('\n📝 Simulation de login API:');
      console.log('   POST /api/auth/login');
      console.log('   { "email": "admin@skillshare.com", "password": "Admin123!" }');
      console.log('   ✅ Devrait fonctionner maintenant !');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    process.exit();
  }
};

fixAdminFinal();