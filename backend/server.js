const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan'); // IMPORTANT: ajouter cette ligne
require('dotenv').config();

const app = express();

// Middleware de base
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Morgan pour les logs HTTP - version simple qui fonctionne
app.use(morgan('dev')); // Format: :method :url :status :response-time ms - :res[content-length]

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.log('❌ Erreur MongoDB:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API fonctionne !' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur port ${PORT}`));