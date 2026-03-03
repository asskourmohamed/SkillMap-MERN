const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuration du stockage pour les images de profil
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile-pictures',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
    public_id: (req, file) => {
      const userId = req.user.id;
      const timestamp = Date.now();
      return `profile-${userId}-${timestamp}`;
    }
  }
});

// Configuration du stockage pour les images de couverture
const coverStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cover-pictures',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1500, height: 500, crop: 'limit' }],
    public_id: (req, file) => {
      const userId = req.user.id;
      const timestamp = Date.now();
      return `cover-${userId}-${timestamp}`;
    }
  }
});

// Configuration pour les CV
const cvStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cvs',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw',
    public_id: (req, file) => {
      const userId = req.user.id;
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
      return `cv-${userId}-${timestamp}-${originalName}`;
    }
  }
});

const uploadCV = multer({ 
  storage: cvStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
}).single('cv');

// Middleware d'upload
const uploadProfilePicture = multer({ storage: profileStorage }).single('profilePicture');
const uploadCoverPicture = multer({ storage: coverStorage }).single('coverPicture');

module.exports = {
  cloudinary,
  uploadProfilePicture,
  uploadCoverPicture,
  uploadCV
};