const User = require('../models/User');
const { uploadProfilePicture, uploadCoverPicture, cloudinary } = require('../config/cloudinary');

// Upload photo de profil
exports.uploadProfilePicture = (req, res) => {
  uploadProfilePicture(req, res, async (err) => {
    if (err) {
      console.error('❌ Erreur upload:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'Erreur lors de l\'upload'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Aucun fichier sélectionné'
      });
    }

    try {
      // Récupérer l'ancienne photo pour la supprimer de Cloudinary
      const user = await User.findById(req.user.id);
      
      if (user.profilePicture && user.profilePicture.includes('cloudinary')) {
        // Extraire l'ID public de l'ancienne image
        const publicId = user.profilePicture.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`profile-pictures/${publicId}`);
      }

      // Mettre à jour l'utilisateur avec la nouvelle URL
      user.profilePicture = req.file.path;
      await user.save();

      res.json({
        success: true,
        data: {
          profilePicture: req.file.path
        }
      });
    } catch (error) {
      console.error('❌ Erreur mise à jour:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la mise à jour du profil'
      });
    }
  });
};

// Upload photo de couverture
exports.uploadCoverPicture = (req, res) => {
  uploadCoverPicture(req, res, async (err) => {
    if (err) {
      console.error('❌ Erreur upload:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'Erreur lors de l\'upload'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Aucun fichier sélectionné'
      });
    }

    try {
      const user = await User.findById(req.user.id);
      
      // Supprimer l'ancienne photo de couverture
      if (user.coverPicture && user.coverPicture.includes('cloudinary')) {
        const publicId = user.coverPicture.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`cover-pictures/${publicId}`);
      }

      user.coverPicture = req.file.path;
      await user.save();

      res.json({
        success: true,
        data: {
          coverPicture: req.file.path
        }
      });
    } catch (error) {
      console.error('❌ Erreur mise à jour:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la mise à jour du profil'
      });
    }
  });
};