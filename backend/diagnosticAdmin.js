const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

const diagnosticComplet = async () => {
  console.log('🔍 DIAGNOSTIC COMPLET DU COMPTE ADMIN\n');
  
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillshare');
    console.log('✅ Connecté à MongoDB\n');

    // 1. Récupérer l'admin et un user normal
    const admin = await User.findOne({ email: 'admin@skillshare.com' });
    const normalUser = await User.findOne({ role: 'user' });

    console.log('='.repeat(60));
    console.log('📊 COMPARAISON ADMIN VS USER NORMAL');
    console.log('='.repeat(60));

    // 2. ANALYSE DE L'ADMIN
    console.log('\n👤 ADMIN:');
    if (!admin) {
      console.log('❌ Admin non trouvé dans la base !');
    } else {
      console.log(`  - ID: ${admin._id}`);
      console.log(`  - Email: ${admin.email}`);
      console.log(`  - Rôle: ${admin.role}`);
      console.log(`  - Nom: ${admin.name}`);
      console.log(`  - Département: ${admin.department}`);
      console.log(`  - Password hash: ${admin.password ? admin.password.substring(0, 30) + '...' : 'MANQUANT'}`);
      console.log(`  - Longueur hash: ${admin.password?.length || 0} caractères`);
      console.log(`  - Format bcrypt valide: ${admin.password ? /^\$2[abxy]\$\d+\$/.test(admin.password) : 'NON'}`);
      
      // Test du mot de passe admin
      try {
        const testAdmin = await bcrypt.compare('Admin123!', admin.password);
        console.log(`  - Test mot de passe 'Admin123!': ${testAdmin ? '✅ OK' : '❌ ÉCHEC'}`);
      } catch (e) {
        console.log(`  - Erreur test mot de passe: ${e.message}`);
      }
    }

    // 3. ANALYSE D'UN USER NORMAL
    console.log('\n👤 USER NORMAL:');
    if (!normalUser) {
      console.log('❌ Aucun user normal trouvé dans la base !');
    } else {
      console.log(`  - ID: ${normalUser._id}`);
      console.log(`  - Email: ${normalUser.email}`);
      console.log(`  - Rôle: ${normalUser.role}`);
      console.log(`  - Password hash: ${normalUser.password.substring(0, 30)}...`);
      console.log(`  - Longueur hash: ${normalUser.password.length} caractères`);
      console.log(`  - Format bcrypt valide: ${/^\$2[abxy]\$\d+\$/.test(normalUser.password)}`);
      
      // Demander le mot de passe du user normal (à adapter)
      console.log(`  - ⚠️ Impossible de tester sans connaître son mot de passe`);
    }

    // 4. VÉRIFICATION DU MIDDLEWARE
    console.log('\n🔧 VÉRIFICATION DU MIDDLEWARE PRE-SAVE:');
    
    // Créer un utilisateur temporaire pour tester
    const testEmail = `test${Date.now()}@test.com`;
    const testUser = new User({
      name: 'Test User',
      email: testEmail,
      password: 'Test123!',
      department: 'Test',
      role: 'user'
    });
    
    console.log('  - Création d\'un user test avec new User()...');
    await testUser.save();
    console.log(`  - User test créé avec email: ${testEmail}`);
    
    const savedTest = await User.findOne({ email: testEmail });
    console.log(`  - Password hashé: ${savedTest.password.substring(0, 30)}...`);
    console.log(`  - Longueur hash: ${savedTest.password.length} caractères`);
    console.log(`  - Format bcrypt valide: ${/^\$2[abxy]\$\d+\$/.test(savedTest.password)}`);
    
    // Tester le mot de passe
    const testValid = await bcrypt.compare('Test123!', savedTest.password);
    console.log(`  - Test mot de passe 'Test123!': ${testValid ? '✅ OK' : '❌ ÉCHEC'}`);
    
    // Nettoyer
    await User.deleteOne({ email: testEmail });
    console.log('  - User test supprimé');

    // 5. CONCLUSION
    console.log('\n🔍 CONCLUSION:');
    if (!admin) {
      console.log('❌ Le compte admin n\'existe pas !');
    } else if (!/^\$2[abxy]\$\d+\$/.test(admin.password)) {
      console.log('❌ Le mot de passe admin n\'est PAS au format bcrypt valide !');
      console.log('   Cause probable: modification avec updateOne() ou findByIdAndUpdate()');
    } else if (admin.password.length !== normalUser?.password.length) {
      console.log('⚠️ La longueur du hash admin est différente de celle du user normal');
    } else {
      console.log('✅ Le format du hash admin semble correct');
    }

  } catch (error) {
    console.error('❌ Erreur diagnostic:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Déconnexion MongoDB');
  }
};

diagnosticComplet();