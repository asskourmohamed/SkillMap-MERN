const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const testRegister = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Hasher le mot de passe manuellement
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Tester la création d'un utilisateur
    const testUser = {
      name: "Test User",
      email: "test@test.com",
      password: hashedPassword, // Mot de passe déjà hashé
      department: "Développement",
      jobTitle: "Testeur",
      company: "Test Corp"
    };

    const user = await User.create(testUser);
    console.log('✅ Utilisateur créé avec succès:', user.email);
    
    // Vérifier que le mot de passe est hashé
    console.log('Password hashé:', user.password.substring(0, 30) + '...');

    // Tester la comparaison
    const isMatch = await bcrypt.compare('password123', user.password);
    console.log('Comparaison password123:', isMatch ? '✅ OK' : '❌ Échec');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
};

testRegister();