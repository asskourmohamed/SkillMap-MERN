const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const verifyLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillshare');
    console.log('✅ Connecté à MongoDB\n');

    const email = 'admin@skillshare.com';
    const password = 'Admin123!';

    // Chercher l'admin avec le mot de passe
    const admin = await User.findOne({ email }).select('+password');
    
    if (!admin) {
      console.log('❌ Administrateur non trouvé');
      return;
    }

    console.log('📧 Email:', admin.email);
    console.log('🔐 Hash stocké:', admin.password);
    
    // Test avec bcrypt.compare direct
    const directCompare = await bcrypt.compare(password, admin.password);
    console.log('\n🔐 Test direct avec bcrypt.compare:');
    console.log(`   Mot de passe "${password}":`, directCompare ? '✅ OK' : '❌ Échec');

    // Test avec la méthode du modèle
    if (typeof admin.comparePassword === 'function') {
      const modelCompare = await admin.comparePassword(password);
      console.log('\n🔐 Test avec comparePassword():');
      console.log(`   Mot de passe "${password}":`, modelCompare ? '✅ OK' : '❌ Échec');
    }

    // Simuler une route de login
    console.log('\n📝 Simulation de connexion API:');
    if (directCompare) {
      console.log('   ✅ Connexion réussie!');
      console.log('   👤 Utilisateur:', admin.name);
      console.log('   👑 Rôle:', admin.role);
      
      // Générer un token JWT si la méthode existe
      if (typeof admin.generateAuthToken === 'function') {
        const token = admin.generateAuthToken();
        console.log('   🔑 Token JWT généré');
      }
    } else {
      console.log('   ❌ Échec de connexion');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    process.exit();
  }
};

verifyLogin();