const User = require('../models/User');
const { uploadCV, cloudinary } = require('../config/cloudinary');
const PDFDocument = require('pdfkit');

// Upload de CV
exports.uploadCV = (req, res) => {
  uploadCV(req, res, async (err) => {
    if (err) {
      console.error('❌ Erreur upload CV:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'Erreur lors de l\'upload du CV'
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
      
      // Supprimer l'ancien CV si existant
      if (user.cv && user.cv.url && user.cv.url.includes('cloudinary')) {
        const publicId = user.cv.url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`cvs/${publicId}`, { resource_type: 'raw' });
      }

      // Mettre à jour l'utilisateur avec les infos du CV
      user.cv = {
        url: req.file.path,
        filename: req.file.filename,
        originalName: req.file.originalname,
        uploadDate: new Date(),
        fileSize: req.file.size,
        fileType: req.file.mimetype
      };
      await user.save();

      res.json({
        success: true,
        data: user.cv
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

// Supprimer CV
exports.deleteCV = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.cv || !user.cv.url) {
      return res.status(404).json({
        success: false,
        error: 'Aucun CV trouvé'
      });
    }

    // Supprimer de Cloudinary
    if (user.cv.url.includes('cloudinary')) {
      const publicId = user.cv.url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`cvs/${publicId}`, { resource_type: 'raw' });
    }

    // Supprimer du user
    user.cv = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'CV supprimé avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur suppression CV:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression du CV'
    });
  }
};

// Générer PDF à partir du profil
exports.generateProfilePDF = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Créer un document PDF
    const doc = new PDFDocument({ margin: 50 });
    
    // Définir les headers pour le téléchargement
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${user.name.replace(/\s/g, '_')}_CV.pdf`);
    
    // Pipe le PDF vers la réponse
    doc.pipe(res);

    // Ajouter le contenu
    doc.fontSize(25).text('Curriculum Vitae', { align: 'center' });
    doc.moveDown();
    
    // Informations personnelles
    doc.fontSize(16).text('Informations personnelles', { underline: true });
    doc.fontSize(12);
    doc.text(`Nom: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Localisation: ${user.location || 'Non spécifié'}`);
    if (user.jobTitle) doc.text(`Poste: ${user.jobTitle}`);
    if (user.company) doc.text(`Entreprise: ${user.company}`);
    doc.moveDown();

    // Bio
    if (user.bio) {
      doc.fontSize(16).text('À propos', { underline: true });
      doc.fontSize(12).text(user.bio);
      doc.moveDown();
    }

    // Compétences
    if (user.skills && user.skills.length > 0) {
      doc.fontSize(16).text('Compétences', { underline: true });
      doc.fontSize(12);
      user.skills.forEach(skill => {
        doc.text(`• ${skill.name} - ${skill.level} (${skill.yearsOfExperience || 0} ans)`);
      });
      doc.moveDown();
    }

    // Expériences
    if (user.experiences && user.experiences.length > 0) {
      doc.fontSize(16).text('Expériences professionnelles', { underline: true });
      doc.fontSize(12);
      user.experiences.forEach(exp => {
        doc.text(`• ${exp.title} chez ${exp.company}`);
        doc.text(`  ${new Date(exp.startDate).toLocaleDateString()} - ${exp.isCurrent ? 'Présent' : new Date(exp.endDate).toLocaleDateString()}`);
        if (exp.description) doc.text(`  ${exp.description}`);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Projets
    if (user.projects && user.projects.length > 0) {
      doc.fontSize(16).text('Projets', { underline: true });
      doc.fontSize(12);
      user.projects.forEach(project => {
        doc.text(`• ${project.title}`);
        if (project.description) doc.text(`  ${project.description}`);
        if (project.technologies && project.technologies.length > 0) {
          doc.text(`  Technologies: ${project.technologies.join(', ')}`);
        }
        doc.moveDown(0.5);
      });
    }

    // Finaliser le PDF
    doc.end();

  } catch (error) {
    console.error('❌ Erreur génération PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la génération du PDF'
    });
  }
};