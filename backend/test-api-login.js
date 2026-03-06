const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('./models/User');

const testApiLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/competences');
    console.log('✅ Connecté à MongoDB\n');

    const email = 'admin@skillshare.com';
    const password = 'Admin123!';

    // Simuler exactement ce que fait la route /login
    console.log('🔍 Simulation de la route /api/auth/login\n');

    // 1. Chercher l'utilisateur avec le mot de passe
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ Étape 1: Utilisateur non trouvé');
      return;
    }
    console.log('✅ Étape 1: Utilisateur trouvé');

    // 2. Vérifier le mot de passe
    console.log('   Hash stocké:', user.password);
    
    const isValid = await bcrypt.compare(password, user.password);
    console.log(`✅ Étape 2: bcrypt.compare("${password}") = ${isValid}`);

    if (!isValid) {
      console.log('\n❌ ÉCHEC: Mot de passe incorrect');
      
      // Diagnostic supplémentaire
      console.log('\n🔧 Diagnostic:');
      console.log('   1. Vérifie que le mot de passe est bien "Admin123!"');
      console.log('   2. Vérifie que le hash n\'a pas été modifié par un middleware');
      console.log('   3. Vérifie que bcrypt.compare utilise la même version');
      
      // Tester avec le hash fraîchement généré
      const testHash = await bcrypt.hash(password, 10);
      const testCompare = await bcrypt.compare(password, testHash);
      console.log(`   4. Test avec nouveau hash: ${testCompare ? '✅' : '❌'}`);
      
      return;
    }

    // 3. Générer le token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Étape 3: Token JWT généré');

    // 4. Résultat final
    console.log('\n🎉 SIMULATION RÉUSSIE !');
    console.log('═══════════════════════');
    console.log('📧 Email:', email);
    console.log('🔑 Token:', token.substring(0, 50) + '...');
    console.log('═══════════════════════');
    console.log('\n✅ La route /api/auth/login devrait fonctionner !');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    process.exit();
  }
};

testApiLogin();