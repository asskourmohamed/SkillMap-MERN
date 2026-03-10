const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

const corrigerAdmin = async () => {
  console.log('🔧 CORRECTION DU COMPTE ADMIN\n');
  
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillshare');
    console.log('✅ Connecté à MongoDB\n');

    // 1. Supprimer l'ancien admin s'il existe
    const ancienAdmin = await User.findOne({ email: 'admin@skillshare.com' });
    if (ancienAdmin) {
      console.log(`🗑️ Ancien admin trouvé: ${ancienAdmin.email} (rôle: ${ancienAdmin.role})`);
      await User.deleteOne({ email: 'admin@skillshare.com' });
      console.log('✅ Ancien admin supprimé\n');
    }

    // 2. Créer le NOUVEL admin avec NEW (le middleware s'exécutera)
    console.log('📝 Création du nouvel admin avec NEW...');
    
    const nouvelAdmin = new User({
      name: 'Administrateur Principal',
      email: 'admin@skillshare.com',
      password: 'Admin123!',  // ← Mot de passe en clair, sera hashé par le middleware
      department: 'Direction Générale',
      role: 'admin',
      createdAt: new Date()
    });

    // Sauvegarde - le middleware pre('save') va hasher le mot de passe
    await nouvelAdmin.save();
    console.log('✅ Nouvel admin créé avec succès !\n');

    // 3. Vérification approfondie
    const adminVerifie = await User.findOne({ email: 'admin@skillshare.com' });
    
    console.log('🔍 VÉRIFICATION POST-CRÉATION:');
    console.log('  - ID:', adminVerifie._id);
    console.log('  - Email:', adminVerifie.email);
    console.log('  - Rôle:', adminVerifie.role);
    console.log('  - Nom:', adminVerifie.name);
    console.log('  - Département:', adminVerifie.department);
    console.log('  - Password hashé:', adminVerifie.password.substring(0, 40) + '...');
    console.log('  - Longueur hash:', adminVerifie.password.length);
    console.log('  - Format bcrypt valide:', /^\$2[abxy]\$\d+\$/.test(adminVerifie.password));

    // 4. Test du mot de passe avec bcrypt
    const testPassword = await bcrypt.compare('Admin123!', adminVerifie.password);
    console.log('  - Test mot de passe (bcrypt):', testPassword ? '✅ OK' : '❌ ÉCHEC');
    
    // 5. Test avec la méthode du modèle
    try {
      const testMethod = await adminVerifie.comparePassword('Admin123!');
      console.log('  - Test mot de passe (méthode):', testMethod ? '✅ OK' : '❌ ÉCHEC');
    } catch (e) {
      console.log('  - Erreur méthode:', e.message);
    }

    // 6. Résumé
    console.log('\n🎯 RÉSUMÉ:');
    if (testPassword) {
      console.log('✅ ADMIN CRÉÉ AVEC SUCCÈS !');
      console.log('📧 Email: admin@skillshare.com');
      console.log('🔑 Mot de passe: Admin123!');
      console.log('👤 Rôle: admin');
    } else {
      console.log('❌ ÉCHEC - Le mot de passe n\'est pas valide');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Déconnexion MongoDB');
  }
};

corrigerAdmin();