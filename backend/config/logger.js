const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Créer un stream d'écriture pour les logs
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' } // 'a' pour append
);

// Format personnalisé pour les fichiers
const customFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

// Configuration des différents formats
const logger = {
  // Pour la console (développement)
  console: morgan('dev'),
  
  // Pour les fichiers (production)
  file: morgan(customFormat, { stream: accessLogStream }),
  
  // Format court
  short: morgan('short'),
  
  // Format tiny
  tiny: morgan('tiny'),
  
  // Format combined (Apache style)
  combined: morgan('combined')
};

module.exports = logger;