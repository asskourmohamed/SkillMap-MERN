const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const debugAuth = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/competences');
    console.log('✅ Connecté à MongoDB\n');

    const email = 'admin@skillshare.com';
    const testPassword = 'Admin123!';

    // 1. Récupérer l'admin
    const admin = await User.findOne({ email }).select('+password');
    
    if (!admin) {
      console.log('❌ Administrateur non trouvé');
      return;
    }

    console.log('📧 Email:', admin.email);
    console.log('🔐 Hash stocké:', admin.password);
    console.log('📦 Type du hash:', typeof admin.password);
    console.log('📏 Longueur du hash:', admin.password.length);

    // 2. Tester différentes méthodes de hashage
    console.log('\n🔬 Tests de comparaison:');
    
    // Méthode 1: bcrypt.compare direct
    const directCompare = await bcrypt.compare(testPassword, admin.password);
    console.log('   bcrypt.compare direct:', directCompare ? '✅' : '❌');

    // Méthode 2: avec la méthode du modèle
    if (typeof admin.comparePassword === 'function') {
      const modelCompare = await admin.comparePassword(testPassword);
      console.log('   comparePassword():', modelCompare ? '✅' : '❌');
    }

    // 3. Générer un nouveau hash pour tester
    console.log('\n🔧 Génération de nouveaux hash:');
    
    const saltRounds = [8, 10, 12, 14];
    
    for (const rounds of saltRounds) {
      const salt = await bcrypt.genSalt(rounds);
      const hash = await bcrypt.hash(testPassword, salt);
      const verify = await bcrypt.compare(testPassword, hash);
      
      console.log(`   Salt rounds ${rounds}:`);
      console.log(`      Hash: ${hash}`);
      console.log(`      Vérification: ${verify ? '✅' : '❌'}`);
      
      // Tester si ce hash correspond à celui stocké
      if (hash === admin.password) {
        console.log(`      ⚠️  Correspond au hash stocké avec rounds=${rounds}`);
      }
    }

    // 4. Créer un admin de test avec différentes méthodes
    console.log('\n🧪 Création d\'un admin de test...');
    
    const testAdminData = {
      name: 'Test Admin',
      email: 'test@skillshare.com',
      password: testPassword,
      department: 'IT',
      role: 'admin'
    };

    // Méthode A: Laisser le middleware pré-save gérer le hash
    const testAdmin1 = new User(testAdminData);
    await testAdmin1.save();
    console.log('   Admin test créé (avec middleware)');
    
    const testAdmin1Check = await User.findOne({ email: 'test@skillshare.com' }).select('+password');
    const verify1 = await bcrypt.compare(testPassword, testAdmin1Check.password);
    console.log('   Vérification:', verify1 ? '✅' : '❌');

    // 5. Nettoyer
    await User.deleteOne({ email: 'test@skillshare.com' });
    console.log('\n🧹 Admin test supprimé');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    process.exit();
  }
};

debugAuth();