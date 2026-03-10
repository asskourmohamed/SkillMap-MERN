const express = require('express');
const app = express();

try {
  const adminController = require('./controllers/adminController');
  console.log('✅ Controller chargé:', Object.keys(adminController));
  
  const adminRoutes = require('./routes/admin');
  console.log('✅ Routes chargées');
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
}