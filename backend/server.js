const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { metricsMiddleware, metricsHandler } = require('./middleware/metrics');

const app = express();
app.use(metricsMiddleware);
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Only connect if not already connected (prevents double-connect in tests)
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(' MongoDB connected'))
    .catch(err => console.log('MongoDB not connected', err));
}

app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profiles', require('./routes/profileRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/cv', require('./routes/cvRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

//prometheus
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.get('/metrics', metricsHandler);
//prometheus
app.get('/health', (req, res) => res.json({ status: 'ok' }));
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;