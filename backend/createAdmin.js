const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

const fixAdminNow = async () => {
  console.log('🔧 CORRECTION IMMÉDIATE DU COMPTE ADMIN\n');
  
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillshare');
    console.log('✅ Connecté à MongoDB\n');

    // 1. Voir tous les admins actuels
    const allAdmins = await User.find({ role: 'admin' });
    console.log(`📊 ${allAdmins.length} admin(s) trouvé(s):`);
    allAdmins.forEach((admin, i) => {
      console.log(`  ${i+1}. ${admin.email} - password: ${admin.password ? 'OK' : 'MANQUANT'}`);
    });

    // 2. Supprimer l'admin problématique
    const result = await User.deleteOne({ email: 'admin@skillshare.com' });
    console.log(`\n🗑️ Admin supprimé: ${result.deletedCount > 0 ? 'OUI' : 'NON'}`);

    // 3. Créer le NOUVEL admin avec NEW et mot de passe en clair
    console.log('\n📝 Création du nouvel admin...');
    
    // Hasher le mot de passe manuellement pour être sûr
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin123!', salt);
    
    const nouvelAdmin = new User({
      name: 'Super Administrateur',
      email: 'admin@skillshare.com',
      password: hashedPassword,  // ← On met le hash directement
      department: 'Direction',
      role: 'admin',
      createdAt: new Date()
    });

    await nouvelAdmin.save();
    console.log('✅ Nouvel admin créé avec succès !');

    // 4. Vérification approfondie
    const verifyAdmin = await User.findOne({ email: 'admin@skillshare.com' });
    
    console.log('\n🔍 VÉRIFICATION:');
    console.log('  - ID:', verifyAdmin._id);
    console.log('  - Email:', verifyAdmin.email);
    console.log('  - Rôle:', verifyAdmin.role);
    console.log('  - Password hash:', verifyAdmin.password ? verifyAdmin.password.substring(0, 40) + '...' : 'MANQUANT');
    console.log('  - Longueur hash:', verifyAdmin.password?.length || 0);
    
    // Test du mot de passe
    const testPassword = await bcrypt.compare('Admin123!', verifyAdmin.password);
    console.log('  - Test mot de passe:', testPassword ? '✅ OK' : '❌ ÉCHEC');

    if (testPassword) {
      console.log('\n🎉 ADMIN FONCTIONNEL !');
      console.log('📧 Email: admin@skillshare.com');
      console.log('🔑 Mot de passe: Admin123!');
    } else {
      console.log('\n❌ ÉCHEC - Le mot de passe ne fonctionne pas');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Déconnexion');
  }
};

fixAdminNow();