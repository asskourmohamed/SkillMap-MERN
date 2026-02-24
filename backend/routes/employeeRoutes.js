const express = require('express');
const router = express.Router();
const controller = require('../controllers/employeeController');

// Routes CRUD de base
router.post('/', controller.createEmployee);
router.get('/', controller.getEmployees);
router.get('/:id', controller.getEmployeeById);
router.put('/:id', controller.updateEmployee);
router.delete('/:id', controller.deleteEmployee);

// Routes pour les éléments imbriqués
router.post('/:id/skills', controller.addSkill);
router.put('/:id/skills/:skillId', controller.updateSkill);
router.delete('/:id/skills/:skillId', controller.deleteSkill);
router.post('/:id/skills/:skillId/endorse', controller.endorseSkill);

router.post('/:id/projects', controller.addProject);
router.put('/:id/projects/:projectId', controller.updateProject);
router.delete('/:id/projects/:projectId', controller.deleteProject);

router.post('/:id/experiences', controller.addExperience);
router.put('/:id/experiences/:expId', controller.updateExperience);
router.delete('/:id/experiences/:expId', controller.deleteExperience);

router.post('/:id/education', controller.addEducation);
router.put('/:id/education/:eduId', controller.updateEducation);
router.delete('/:id/education/:eduId', controller.deleteEducation);

router.post('/:id/certifications', controller.addCertification);
router.put('/:id/certifications/:certId', controller.updateCertification);
router.delete('/:id/certifications/:certId', controller.deleteCertification);

// Routes pour les connexions sociales
router.post('/:id/connect/:targetId', controller.sendConnectionRequest);
router.put('/:id/connect/:targetId/accept', controller.acceptConnectionRequest);
router.put('/:id/connect/:targetId/reject', controller.rejectConnectionRequest);
router.delete('/:id/connect/:targetId', controller.removeConnection);
router.get('/:id/connections', controller.getConnections);

// Routes pour les statistiques
router.post('/:id/view', controller.incrementProfileView);

// Recherche avancée
router.get('/search/:query', controller.searchEmployees);

module.exports = router;