const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const testComplete = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillshare');
    console.log('✅ Connecté à MongoDB\n');

    // Récupérer tous les admins
    const admins = await User.find({ role: 'admin' }).select('+password');
    
    if (admins.length === 0) {
      console.log('❌ Aucun administrateur trouvé');
      return;
    }

    console.log(`📊 ${admins.length} administrateur(s) trouvé(s):\n`);

    for (const admin of admins) {
      console.log('═══════════════════════════════════');
      console.log('👤 Nom:', admin.name);
      console.log('📧 Email:', admin.email);
      console.log('🆔 ID:', admin._id);
      console.log('🔐 Hash:', admin.password);
      
      // Tester différents mots de passe
      const testPasswords = ['Admin123!', 'admin123!', 'Admin123', 'password', 'admin'];
      
      console.log('\n🔍 Tests de mots de passe:');
      
      for (const pwd of testPasswords) {
        // Test avec bcrypt direct
        const directCompare = await bcrypt.compare(pwd, admin.password);
        
        // Test avec la méthode du modèle si elle existe
        let modelCompare = false;
        if (typeof admin.comparePassword === 'function') {
          modelCompare = await admin.comparePassword(pwd);
        }
        
        const status = directCompare ? '✅' : '❌';
        console.log(`   "${pwd}": ${status} ${directCompare ? '(OK)' : ''}`);
        
        if (directCompare) {
          console.log(`   ✅ MOT DE PASSE CORRECT: "${pwd}"`);
          console.log(`   📝 Utilisez ce mot de passe pour vous connecter`);
        }
      }
      
      console.log(''); // Ligne vide
    }

    // Vérifier la méthode de hashage
    console.log('\n🔧 Test de génération de hash:');
    const testPassword = 'Admin123!';
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(testPassword, salt);
    console.log('   Nouveau hash généré:', newHash);
    console.log('   Test du nouveau hash:', await bcrypt.compare(testPassword, newHash) ? '✅ OK' : '❌ Échec');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    process.exit();
  }
};

testComplete();