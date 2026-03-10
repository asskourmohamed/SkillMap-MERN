const path = require('path');
const fs = require('fs');

console.log('🔍 VÉRIFICATION DU MODÈLE USER\n');

// Chemin vers le modèle User
const modelPath = path.join(__dirname, '.', 'models', 'User.js');

if (!fs.existsSync(modelPath)) {
  console.log('❌ Fichier User.js non trouvé!');
  process.exit(1);
}

console.log(`📁 Fichier trouvé: ${modelPath}\n`);

// Lire le contenu
const content = fs.readFileSync(modelPath, 'utf8');

// Vérifier la présence du middleware pre('save')
const hasPreSave = content.includes('pre(') && content.includes('save');
const hasBcrypt = content.includes('bcrypt');
const hasComparePassword = content.includes('comparePassword');

console.log('📊 ANALYSE DU MODÈLE:');
console.log('  - Middleware pre(\'save\'):', hasPreSave ? '✅ Présent' : '❌ MANQUANT');
console.log('  - Import bcrypt:', hasBcrypt ? '✅ Présent' : '❌ MANQUANT');
console.log('  - Méthode comparePassword:', hasComparePassword ? '✅ Présente' : '❌ MANQUANTE');

if (hasPreSave) {
  // Extraire le middleware pour vérification
  const preSaveMatch = content.match(/pre\(['"]save['"],\s*async\s*function[^}]+}\s*}\)/s);
  if (preSaveMatch) {
    console.log('\n📝 MIDDLEWARE PRE-SAVE TROUVÉ:');
    console.log(preSaveMatch[0].substring(0, 200) + '...');
  }
}

// Recommandations
console.log('\n🎯 RECOMMANDATIONS:');
if (!hasPreSave) {
  console.log('❌ Le middleware pre(\'save\') est manquant !');
  console.log('   Ajoute ce code dans User.js:');
  console.log(`
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});`);
}