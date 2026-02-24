const Employee = require('../models/Employee');

// Créer un employé
exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Récupérer tous les employés
exports.getEmployees = async (req, res) => {
  try {
    const { name, skill, department, skillLevel, project } = req.query;
    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (department) {
      filter.department = department;
    }
    if (skill) {
      filter['skills.name'] = { $regex: skill, $options: 'i' };
    }
    if (skillLevel) {
      filter['skills.level'] = skillLevel;
    }
    if (project) {
      filter['projects.title'] = { $regex: project, $options: 'i' };
    }

    const employees = await Employee.find(filter).select('-password');
    
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Récupérer un employé par ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-password');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour un employé
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Supprimer un employé
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Employé supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ========== SKILLS ==========

// Ajouter une compétence
exports.addSkill = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    employee.skills.push({
      ...req.body,
      endorsements: []
    });
    await employee.save();
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour une compétence
exports.updateSkill = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    const skill = employee.skills.id(req.params.skillId);
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Compétence non trouvée'
      });
    }
    
    Object.assign(skill, req.body);
    await employee.save();
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Supprimer une compétence
exports.deleteSkill = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    employee.skills.id(req.params.skillId).deleteOne();
    await employee.save();
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Endorser une compétence
exports.endorseSkill = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    const endorser = await Employee.findById(req.body.endorserId);
    
    if (!employee || !endorser) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    const skill = employee.skills.id(req.params.skillId);
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Compétence non trouvée'
      });
    }
    
    // Vérifier si déjà endorsé
    const alreadyEndorsed = skill.endorsements.some(
      e => e.endorsedBy && e.endorsedBy.toString() === req.body.endorserId
    );
    
    if (alreadyEndorsed) {
      return res.status(400).json({
        success: false,
        error: 'Vous avez déjà endorsé cette compétence'
      });
    }
    
    skill.endorsements.push({
      endorsedBy: req.body.endorserId,
      endorsedAt: new Date()
    });
    
    await employee.save();
    
    res.json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ========== PROJECTS ==========

// Ajouter un projet
exports.addProject = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    employee.projects.push(req.body);
    await employee.save();
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour un projet
exports.updateProject = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    const project = employee.projects.id(req.params.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Projet non trouvé'
      });
    }
    
    Object.assign(project, req.body);
    await employee.save();
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Supprimer un projet
exports.deleteProject = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    employee.projects.id(req.params.projectId).deleteOne();
    await employee.save();
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ========== EXPERIENCES ==========

// Ajouter une expérience
exports.addExperience = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    employee.experiences.push(req.body);
    await employee.save();
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour une expérience
exports.updateExperience = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    const experience = employee.experiences.id(req.params.expId);
    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Expérience non trouvée'
      });
    }
    
    Object.assign(experience, req.body);
    await employee.save();
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Supprimer une expérience
exports.deleteExperience = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    employee.experiences.id(req.params.expId).deleteOne();
    await employee.save();
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ========== EDUCATION ==========

// Ajouter une formation
exports.addEducation = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    employee.education.push(req.body);
    await employee.save();
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour une formation
exports.updateEducation = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    const education = employee.education.id(req.params.eduId);
    if (!education) {
      return res.status(404).json({
        success: false,
        error: 'Formation non trouvée'
      });
    }
    
    Object.assign(education, req.body);
    await employee.save();
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Supprimer une formation
exports.deleteEducation = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    employee.education.id(req.params.eduId).deleteOne();
    await employee.save();
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ========== CERTIFICATIONS ==========

// Ajouter une certification
exports.addCertification = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    employee.certifications.push(req.body);
    await employee.save();
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour une certification
exports.updateCertification = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    const certification = employee.certifications.id(req.params.certId);
    if (!certification) {
      return res.status(404).json({
        success: false,
        error: 'Certification non trouvée'
      });
    }
    
    Object.assign(certification, req.body);
    await employee.save();
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Supprimer une certification
exports.deleteCertification = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    employee.certifications.id(req.params.certId).deleteOne();
    await employee.save();
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ========== CONNECTIONS ==========

// Envoyer une demande de connexion
exports.sendConnectionRequest = async (req, res) => {
  try {
    const user = await Employee.findById(req.params.id);
    const target = await Employee.findById(req.params.targetId);
    
    if (!user || !target) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }
    
    // Vérifier si déjà connecté
    const existingConnection = user.connections.find(
      c => c.user && c.user.toString() === req.params.targetId
    );
    
    if (existingConnection) {
      return res.status(400).json({
        success: false,
        error: 'Demande déjà envoyée ou connexion existante'
      });
    }
    
    // Ajouter la demande
    user.connections.push({
      user: target._id,
      status: 'pending',
      requestedAt: new Date()
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Demande de connexion envoyée'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Accepter une demande de connexion
exports.acceptConnectionRequest = async (req, res) => {
  try {
    const user = await Employee.findById(req.params.id);
    const requester = await Employee.findById(req.params.targetId);
    
    if (!user || !requester) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }
    
    // Mettre à jour la connexion chez l'utilisateur
    const userConnection = user.connections.find(
      c => c.user && c.user.toString() === req.params.targetId
    );
    
    if (userConnection) {
      userConnection.status = 'accepted';
      userConnection.connectedAt = new Date();
    }
    
    // Ajouter la connexion chez le demandeur
    requester.connections.push({
      user: user._id,
      status: 'accepted',
      connectedAt: new Date()
    });
    
    await user.save();
    await requester.save();
    
    res.json({
      success: true,
      message: 'Connexion acceptée'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Rejeter une demande de connexion
exports.rejectConnectionRequest = async (req, res) => {
  try {
    const user = await Employee.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }
    
    // Supprimer la connexion
    user.connections = user.connections.filter(
      c => !c.user || c.user.toString() !== req.params.targetId
    );
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Demande rejetée'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Supprimer une connexion
exports.removeConnection = async (req, res) => {
  try {
    const user = await Employee.findById(req.params.id);
    const target = await Employee.findById(req.params.targetId);
    
    if (!user || !target) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }
    
    // Supprimer des deux côtés
    user.connections = user.connections.filter(
      c => !c.user || c.user.toString() !== req.params.targetId
    );
    
    target.connections = target.connections.filter(
      c => !c.user || c.user.toString() !== req.params.id
    );
    
    await user.save();
    await target.save();
    
    res.json({
      success: true,
      message: 'Connexion supprimée'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Obtenir les connexions
exports.getConnections = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('connections.user', 'name profilePicture jobTitle department location');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }
    
    // Filtrer pour ne garder que les connexions acceptées
    const acceptedConnections = employee.connections.filter(
      c => c.status === 'accepted' && c.user
    );
    
    res.json({
      success: true,
      count: acceptedConnections.length,
      data: acceptedConnections
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ========== RECHERCHE ==========

// Recherche avancée
exports.searchEmployees = async (req, res) => {
  try {
    const { query } = req.params;
    const { department, skill, location } = req.query;
    
    let searchQuery = {};
    
    // Recherche textuelle
    if (query && query !== 'undefined') {
      searchQuery.$text = { $search: query };
    }
    
    // Filtres supplémentaires
    if (department && department !== 'undefined') {
      searchQuery.department = department;
    }
    
    if (skill && skill !== 'undefined') {
      searchQuery['skills.name'] = { $regex: skill, $options: 'i' };
    }
    
    if (location && location !== 'undefined') {
      searchQuery.location = { $regex: location, $options: 'i' };
    }
    
    const employees = await Employee.find(searchQuery)
      .select('-password -connections')
      .limit(20);
    
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// ========== STATISTIQUES ==========

// Incrémenter les vues de profil
exports.incrementProfileView = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $inc: { profileViews: 1 } },
      { new: true }
    ).select('-password');
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};