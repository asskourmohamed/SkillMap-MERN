const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const uploadController = require('../controllers/uploadController');

router.post('/profile-picture', protect, uploadController.uploadProfilePicture);
router.post('/cover-picture', protect, uploadController.uploadCoverPicture);

module.exports = router;