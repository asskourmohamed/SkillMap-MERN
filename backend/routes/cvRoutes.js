const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const cvController = require('../controllers/cvController');

router.post('/upload', protect, cvController.uploadCV);
router.delete('/delete', protect, cvController.deleteCV);
router.get('/profile/:id/pdf', cvController.generateProfilePDF);

module.exports = router;