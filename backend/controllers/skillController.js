// server/controllers/skillController.js
const Skill = require('../models/Skill');
const User = require('../models/User');

// @desc    Créer une nouvelle compétence
// @route   POST /api/skills
// @access  Privé
exports.createSkill = async (req, res) => {
  try {
    const { title, category, level, description, tags } = req.body;
    
    // Validation de base
    if (!title || !category) {
      return res.status(400).json({ 
        success: false,
        error: 'Le titre et la catégorie sont requis' 
      });
    }

    // Créer la compétence
    const skill = new Skill({
      title,
      category,
      level: level || 'Intermediate',
      description,
      tags: tags || [],
      owner: req.user._id,
      searchCount: 0
    });

    await skill.save();

    // Ajouter la compétence à l'utilisateur
    await User.findByIdAndUpdate(req.user._id, {
      $push: { skills: skill._id }
    });

    // Populer les infos du propriétaire
    await skill.populate('owner', 'name email department');

    res.status(201).json({
      success: true,
      message: 'Compétence créée avec succès',
      skill
    });

  } catch (error) {
    console.error('❌ Erreur création compétence:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur' 
    });
  }
};

// @desc    Récupérer toutes les compétences
// @route   GET /api/skills
// @access  Public
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find()
      .populate('owner', 'name email department')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: skills.length,
      skills
    });
  } catch (error) {
    console.error('❌ Erreur récupération compétences:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur' 
    });
  }
};

// @desc    Récupérer une compétence par ID
// @route   GET /api/skills/:id
// @access  Public
exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('owner', 'name email department');

    if (!skill) {
      return res.status(404).json({ 
        success: false,
        error: 'Compétence non trouvée' 
      });
    }

    // Incrémenter le compteur de recherche
    skill.searchCount += 1;
    await skill.save();

    res.json({
      success: true,
      skill
    });
  } catch (error) {
    console.error('❌ Erreur récupération compétence:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur' 
    });
  }
};

// @desc    Mettre à jour une compétence
// @route   PUT /api/skills/:id
// @access  Privé (propriétaire uniquement)
exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ 
        success: false,
        error: 'Compétence non trouvée' 
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (skill.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Non autorisé à modifier cette compétence' 
      });
    }

    // Mettre à jour les champs
    const { title, category, level, description, tags } = req.body;
    
    if (title) skill.title = title;
    if (category) skill.category = category;
    if (level) skill.level = level;
    if (description) skill.description = description;
    if (tags) skill.tags = tags;
    
    skill.updatedAt = Date.now();

    await skill.save();

    res.json({
      success: true,
      message: 'Compétence mise à jour',
      skill
    });
  } catch (error) {
    console.error('❌ Erreur mise à jour compétence:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur' 
    });
  }
};

// @desc    Supprimer une compétence
// @route   DELETE /api/skills/:id
// @access  Privé (propriétaire ou admin)
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ 
        success: false,
        error: 'Compétence non trouvée' 
      });
    }

    // Vérifier que l'utilisateur est le propriétaire ou admin
    if (skill.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Non autorisé à supprimer cette compétence' 
      });
    }

    // Supprimer la compétence des références de l'utilisateur
    await User.findByIdAndUpdate(skill.owner, {
      $pull: { skills: skill._id }
    });

    await skill.deleteOne();

    res.json({
      success: true,
      message: 'Compétence supprimée avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur suppression compétence:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur' 
    });
  }
};

// @desc    Récupérer les compétences d'un utilisateur spécifique
// @route   GET /api/skills/user/:userId
// @access  Public
exports.getUserSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ owner: req.params.userId })
      .populate('owner', 'name email department')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: skills.length,
      skills
    });
  } catch (error) {
    console.error('❌ Erreur récupération compétences utilisateur:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur' 
    });
  }
};

// @desc    Rechercher des compétences par mot-clé
// @route   GET /api/skills/search/:keyword
// @access  Public
exports.searchSkills = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    
    const skills = await Skill.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } }
      ]
    })
    .populate('owner', 'name email department')
    .sort({ searchCount: -1 });

    res.json({
      success: true,
      count: skills.length,
      skills
    });
  } catch (error) {
    console.error('❌ Erreur recherche compétences:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur' 
    });
  }
};