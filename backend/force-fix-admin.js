const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const forceFixAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/competences');
    console.log('✅ Connecté à MongoDB\n');

    const email = 'admin@skillshare.com';
    const plainPassword = 'Admin123!';

    // Supprimer l'ancien admin
    await User.deleteOne({ email });
    console.log('🗑️  Ancien admin supprimé\n');

    // Générer un hash avec bcryptjs (méthode standard)
    console.log('🔐 Génération du hash...');
    const salt = await bcrypt.genSalt(12); // Utiliser rounds=12 pour être sûr
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    
    console.log('   Hash généré:', hashedPassword);
    
    // Vérifier le hash
    const verify = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('   Vérification du hash:', verify ? '✅ OK' : '❌ ÉCHEC');

    if (!verify) {
      throw new Error('Le hash généré ne fonctionne pas!');
    }

    // Créer le nouvel admin
    console.log('\n👤 Création du nouvel admin...');
    
    const adminData = {
      name: 'Super Administrateur',
      email: email,
      password: hashedPassword, // Utiliser le hash vérifié
      department: 'IT',
      role: 'admin',
      jobTitle: 'Administrateur Principal',
      bio: 'Administrateur de la plateforme SkillShare',
      skills: [],
      projects: [],
      experiences: [],
      profileViews: 0,
      openForWork: true
    };

    // Créer sans passer par le middleware (pour éviter double hashage)
    const admin = new User(adminData);
    // Marquer le mot de passe comme déjà hashé
    admin._doc.password = hashedPassword;
    await admin.save();

    console.log('✅ Admin créé avec succès\n');

    // Vérification finale
    const savedAdmin = await User.findOne({ email }).select('+password');
    const finalVerify = await bcrypt.compare(plainPassword, savedAdmin.password);
    
    console.log('🔍 Vérification finale:');
    console.log('   Email:', savedAdmin.email);
    console.log('   Hash stocké:', savedAdmin.password);
    console.log('   Test "Admin123!":', finalVerify ? '✅ OK' : '❌ ÉCHEC');

    if (finalVerify) {
      console.log('\n🎉 ADMINISTRATEUR PRÊT !');
      console.log('══════════════════════════');
      console.log('📧 Email: admin@skillshare.com');
      console.log('🔑 Mot de passe: Admin123!');
      console.log('══════════════════════════');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    process.exit();
  }
};

forceFixAdmin();