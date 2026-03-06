const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const checkAdmin = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillshare');
    console.log('✅ Connecté à MongoDB\n');

    // Chercher l'admin SANS le mot de passe caché
    const admin = await User.findOne({ email: 'admin@skillshare.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Aucun administrateur trouvé avec cet email');
      console.log('📧 Email recherché: admin@skillshare.com');
      return;
    }

    console.log('✅ Administrateur trouvé:');
    console.log('   Nom:', admin.name);
    console.log('   Email:', admin.email);
    console.log('   Rôle:', admin.role);
    console.log('   ID:', admin._id);
    console.log('   Mot de passe hashé:', admin.password);

    // Tester le mot de passe "Admin123!"
    const testPassword = 'Admin123!';
    const isValid = await bcrypt.compare(testPassword, admin.password);
    
    console.log('\n🔐 Test du mot de passe:');
    console.log('   Mot de passe testé:', testPassword);
    console.log('   Correspondance:', isValid ? '✅ OUI' : '❌ NON');

    if (!isValid) {
      console.log('\n⚠️  Le mot de passe ne correspond pas !');
      console.log('   Solutions:');
      console.log('   1. Recréer l\'admin avec le bon mot de passe');
      console.log('   2. Vérifier que bcrypt.compare utilise le même salt');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    process.exit();
  }
};

checkAdmin();