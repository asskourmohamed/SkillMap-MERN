const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

const fixAdminFinal = async () => {
  console.log('🔧 CORRECTION FINALE DU COMPTE ADMIN\n');
  
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillshare');
    console.log('✅ Connecté à MongoDB\n');

    // 1. Supprimer tous les admins existants avec cet email
    await User.deleteMany({ email: 'admin@skillshare.com' });
    console.log('🗑️ Anciens admins supprimés\n');

    // 2. Hasher le mot de passe MANUELLEMENT
    const plainPassword = 'Admin1234567890!';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    
    console.log('🔐 Mot de passe hashé manuellement:');
    console.log('  - Longueur:', hashedPassword.length);
    console.log('  - Début:', hashedPassword.substring(0, 30) + '...\n');

    // 3. Créer l'admin avec le hash DIRECTEMENT
    // Et désactiver la validation pour être sûr
    const nouvelAdmin = new User({
      name: 'Administrateur Système',
      email: 'admin@skillshare.com',
      password: hashedPassword,  // ← On met le hash directement
      department: 'IT',
      role: 'admin',
      createdAt: new Date()
    });

    // Sauvegarde avec validation désactivée
    await nouvelAdmin.save({ validateBeforeSave: false });
    console.log('✅ Admin créé avec validation désactivée\n');

    // 4. Vérifier que le mot de passe est bien sauvé
    const verifyAdmin = await User.findOne({ email: 'admin@skillshare.com' });
    
    console.log('🔍 VÉRIFICATION POST-CRÉATION:');
    console.log('  - ID:', verifyAdmin._id);
    console.log('  - Email:', verifyAdmin.email);
    console.log('  - Rôle:', verifyAdmin.role);
    console.log('  - Password présent:', verifyAdmin.password ? '✅ OUI' : '❌ NON');
    
    if (verifyAdmin.password) {
      console.log('  - Longueur hash:', verifyAdmin.password.length);
      console.log('  - Début hash:', verifyAdmin.password.substring(0, 30) + '...');
      
      // Test du mot de passe
      const testPassword = await bcrypt.compare(plainPassword, verifyAdmin.password);
      console.log('  - Test mot de passe:', testPassword ? '✅ OK' : '❌ ÉCHEC');
      
      if (testPassword) {
        console.log('\n🎉 ADMIN FONCTIONNEL !');
        console.log('📧 Email: admin@skillshare.com');
        console.log('🔑 Mot de passe: Admin123!');
      } else {
        console.log('\n❌ ÉCHEC - Le mot de passe ne correspond pas');
      }
    } else {
      console.log('\n❌ ÉCHEC - Le mot de passe n\'a pas été sauvé en base');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Déconnexion');
  }
};

fixAdminFinal();