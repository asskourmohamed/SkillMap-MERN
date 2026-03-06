const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const updateAdminHash = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillshare');
    console.log('✅ Connecté à MongoDB\n');

    // Le nouveau hash qui fonctionne (généré par ton test)
    const newHash = '$2b$10$pFK0RYIwfRQ7ZpaYWo1qr.uiRxNi/5EiusmGzUjnaXTGsqf8HJeGW';
    const plainPassword = 'Admin123!';

    // Vérifier que le hash fonctionne
    const verification = await bcrypt.compare(plainPassword, newHash);
    console.log('🔐 Vérification du nouveau hash:', verification ? '✅ OK' : '❌ Échec');
    
    if (!verification) {
      throw new Error('Le hash ne fonctionne pas!');
    }

    // Trouver et mettre à jour l'admin
    const admin = await User.findOne({ email: 'admin@skillshare.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Administrateur non trouvé');
      return;
    }

    console.log('👤 Ancien admin trouvé:');
    console.log('   Nom:', admin.name);
    console.log('   Email:', admin.email);
    console.log('   Ancien hash:', admin.password);

    // Mettre à jour le hash
    admin.password = newHash;
    await admin.save();

    console.log('\n✅ Hash mis à jour avec succès!');
    console.log('   Nouveau hash:', admin.password);

    // Vérifier que la mise à jour a fonctionné
    const updatedAdmin = await User.findOne({ email: 'admin@skillshare.com' }).select('+password');
    const finalCheck = await bcrypt.compare(plainPassword, updatedAdmin.password);
    
    console.log('\n🔐 Vérification finale:');
    console.log('   Test avec "Admin123!":', finalCheck ? '✅ OK' : '❌ Échec');

    if (finalCheck) {
      console.log('\n🎉 ADMINISTRATEUR PRÊT !');
      console.log('══════════════════════════');
      console.log('📧 Email: admin@skillshare.com');
      console.log('🔑 Mot de passe: Admin123!');
      console.log('══════════════════════════');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    process.exit();
  }
};

updateAdminHash();