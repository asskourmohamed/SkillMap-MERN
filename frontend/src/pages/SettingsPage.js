import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/Layout/AppHeader';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import SuccessMessage from '../components/Common/SuccessMessage';
import ImageUploader from '../components/Common/ImageUploader';
import ConfirmationDialog from '../components/Common/ConfirmationDialog';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { authService, skillService, projectService, experienceService } from '../services/api';
import { uploadService } from '../services/uploadService';
import { DEPARTMENTS, SKILL_LEVELS } from '../utils/constants';
import { useToast } from '../context/ToastContext';
import { cvService } from '../services/cvService';
const SettingsPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('profile');
  const [uploading, setUploading] = useState({ profile: false, cover: false });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const toast = useToast();
  const [cvFile, setCvFile] = useState(null);
  const [uploadingCV, setUploadingCV] = useState(false);
  // États pour les nouveaux éléments
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 'Intermédiaire',
    description: '',
    yearsOfExperience: ''
  });
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    imageUrl: '',
    projectUrl: '',
    githubUrl: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    role: ''
  });
  
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getMe();
      setProfile(response.data.data);
      setFormData(response.data.data);
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      toast.error(error.response?.data?.error || 'Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  // ========== GESTION DES UPLOADS ==========
  const handleProfilePictureUpload = async (file) => {
    setUploading(prev => ({ ...prev, profile: true }));
    
    try {
      const response = await uploadService.uploadProfilePicture(file);
      setFormData(prev => ({ ...prev, profilePicture: response.data.data.profilePicture }));
      toast.success('Photo de profil mise à jour avec succès !');
      // Mettre à jour localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.profilePicture = response.data.data.profilePicture;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de l\'upload');
    } finally {
      setUploading(prev => ({ ...prev, profile: false }));
    }
  };

  const handleCoverPictureUpload = async (file) => {
    setUploading(prev => ({ ...prev, cover: true }));
    
    try {
      const response = await uploadService.uploadCoverPicture(file);
      setFormData(prev => ({ ...prev, coverPicture: response.data.data.coverPicture }));
    } catch (error) {
      console.error('Erreur upload:', error);
    } finally {
      setUploading(prev => ({ ...prev, cover: false }));
    }
  };

  // ========== GESTION DES COMPÉTENCES ==========
  const handleAddSkill = async () => {
    if (!newSkill.name) {
      toast.error('Le nom de la compétence est requis');
      return;
    }

    setSaving(true);
    
    try {
      const skillData = {
        ...newSkill,
        yearsOfExperience: parseInt(newSkill.yearsOfExperience) || 0
      };
      
      const response = await skillService.addSkill(profile._id, skillData);
      setProfile(response.data.data);
      setNewSkill({
        name: '',
        level: 'Intermédiaire',
        description: '',
        yearsOfExperience: ''
      });
      toast.success('Compétence ajoutée avec succès !');
    } catch (error) {
      console.error('Erreur ajout compétence:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de l\'ajout de la compétence');
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteSkill = (skillId) => {
    setDeleteTarget(skillId);
    setDeleteType('skill');
    setShowDeleteDialog(true);
  };

  const handleDeleteSkill = async () => {
    setSaving(true);
    
    try {
      await skillService.deleteSkill(profile._id, deleteTarget);
      await fetchProfile();
      toast.success('Compétence supprimée avec succès !');
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Erreur suppression compétence:', error);
      toast.success('Compétence supprimée avec succès !');
    } finally {
      setSaving(false);
      setDeleteTarget(null);
      setDeleteType(null);
    }
  };

  // ========== GESTION DES PROJETS ==========
  const handleAddProject = async () => {
    if (!newProject.title) {
      toast.error('Le titre du projet est requis');
      return;
    }

    setSaving(true);
    
    try {
      const projectData = {
        ...newProject,
        technologies: newProject.technologies ? newProject.technologies.split(',').map(t => t.trim()) : [],
        startDate: newProject.startDate ? new Date(newProject.startDate) : null,
        endDate: newProject.endDate && !newProject.isCurrent ? new Date(newProject.endDate) : null
      };
      
      const response = await projectService.addProject(profile._id, projectData);
      setProfile(response.data.data);
      setNewProject({
        title: '',
        description: '',
        technologies: '',
        imageUrl: '',
        projectUrl: '',
        githubUrl: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        role: ''
      });
      toast.success('Projet ajouté avec succès !');
    } catch (error) {
      console.error('Erreur ajout projet:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de l\'ajout du projet');
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteProject = (projectId) => {
    setDeleteTarget(projectId);
    setDeleteType('project');
    setShowDeleteDialog(true);
  };

  const handleDeleteProject = async () => {
    setSaving(true);
    
    try {
      await projectService.deleteProject(profile._id, deleteTarget);
      await fetchProfile();
      toast.success('Projet supprimé avec succès !');
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Erreur suppression projet:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression');
    } finally {
      setSaving(false);
      setDeleteTarget(null);
      setDeleteType(null);
    }
  };

  // ========== GESTION DES EXPÉRIENCES ==========
  const handleAddExperience = async () => {
    if (!newExperience.title || !newExperience.company) {
      toast.error('Le titre et l\'entreprise sont requis pour l\'expérience');
      return;
    }

    setSaving(true);
    
    try {
      const expData = {
        ...newExperience,
        startDate: newExperience.startDate ? new Date(newExperience.startDate) : null,
        endDate: newExperience.endDate && !newExperience.isCurrent ? new Date(newExperience.endDate) : null
      };
      
      const response = await experienceService.addExperience(profile._id, expData);
      setProfile(response.data.data);
      setNewExperience({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: ''
      });
      toast.success('Expérience ajoutée avec succès !');
    } catch (error) {
      console.error('Erreur ajout expérience:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de l\'ajout de l\'expérience');
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteExperience = (expId) => {
    setDeleteTarget(expId);
    setDeleteType('experience');
    setShowDeleteDialog(true);
  };

  const handleDeleteExperience = async () => {
    setSaving(true);
    
    try {
      await experienceService.deleteExperience(profile._id, deleteTarget);
      await fetchProfile();
      toast.success('Expérience supprimée avec succès !');
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Erreur suppression expérience:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression');
    } finally {
      setSaving(false);
      setDeleteTarget(null);
      setDeleteType(null);
    }
  };
  // ========== GESTION DU CV ==========
  const handleCVUpload = async (file) => {
  if (!file) return;

  // Validation
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.type)) {
    toast.error('Format non supporté. Utilisez PDF, DOC ou DOCX');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    toast.error('Le fichier ne doit pas dépasser 10MB');
    return;
  }

  setUploadingCV(true);

  try {
    const response = await cvService.uploadCV(file);
    setProfile(prev => ({ ...prev, cv: response.data.data }));
    toast.success('CV uploadé avec succès !');
  } catch (error) {
    console.error('Erreur upload CV:', error);
    toast.error(error.response?.data?.error || 'Erreur lors de l\'upload');
  } finally {
    setUploadingCV(false);
  }
};

  const handleDeleteCV = async () => {
  if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre CV ?')) return;

  try {
    await cvService.deleteCV();
    setProfile(prev => {
      const newProfile = { ...prev };
      delete newProfile.cv;
      return newProfile;
    });
    toast.success('CV supprimé avec succès');
  } catch (error) {
    console.error('Erreur suppression CV:', error);
    toast.error(error.response?.data?.error || 'Erreur lors de la suppression');
  }
};

  const handleDownloadPDF = () => {
  cvService.downloadPDF(profile._id);
};
  // ========== GESTION DU PROFIL ==========
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await authService.updateProfile(formData);
      setProfile(response.data.data);
      toast.success('Profil mis à jour avec succès !');
      
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        localStorage.setItem('user', JSON.stringify({
          ...user,
          ...response.data.data
        }));
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setSaving(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('Mot de passe changé avec succès !');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      toast.error(error.response?.data?.error || 'Erreur lors du changement de mot de passe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <AppHeader user={profile} />
        <LoadingSpinner fullPage text="Chargement de vos paramètres..." />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: 'person' },
    { id: 'skills', label: 'Skills', icon: 'verified' },
    { id: 'projects', label: 'Projects', icon: 'work' },
    { id: 'experience', label: 'Experience', icon: 'business_center' },
    { id: 'cv', label: 'CV & Documents', icon: 'description' },
    { id: 'password', label: 'Password', icon: 'lock' }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <AppHeader user={profile} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your account settings and profile information</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card>
            <h2 className="text-xl font-bold mb-6">Profile Information</h2>
            
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Uploads */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                      Profile Picture
                    </label>
                    <ImageUploader
                      currentImage={formData.profilePicture}
                      onUpload={handleProfilePictureUpload}
                      type="profile"
                      isUploading={uploading.profile}
                      maxSize={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                      Cover Picture
                    </label>
                    <ImageUploader
                      currentImage={formData.coverPicture}
                      onUpload={handleCoverPictureUpload}
                      type="cover"
                      isUploading={uploading.cover}
                      maxSize={5}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Department</label>
                  <select
                    name="department"
                    value={formData.department || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-bold mb-6">Your Skills</h2>
              
              {profile.skills && profile.skills.length > 0 ? (
                <div className="space-y-4">
                  {profile.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white">{skill.name}</h3>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                            {skill.level}
                          </span>
                        </div>
                        {skill.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{skill.description}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                          {skill.yearsOfExperience || 0} years experience
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="small"
                        icon="delete"
                        onClick={() => confirmDeleteSkill(skill._id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No skills added yet</p>
              )}
            </Card>

            <Card>
              <h2 className="text-xl font-bold mb-6">Add New Skill</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Skill Name *</label>
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                    placeholder="e.g., React, Python, Figma"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Level</label>
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  >
                    {SKILL_LEVELS.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Years Experience</label>
                  <input
                    type="number"
                    value={newSkill.yearsOfExperience}
                    onChange={(e) => setNewSkill({...newSkill, yearsOfExperience: e.target.value})}
                    placeholder="5"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description (optional)</label>
                  <input
                    type="text"
                    value={newSkill.description}
                    onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                    placeholder="Brief description of your expertise"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleAddSkill}
                  variant="primary"
                  icon="add"
                  loading={saving}
                >
                  Add Skill
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-bold mb-6">Your Projects</h2>
              
              {profile.projects && profile.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.projects.map((project, index) => (
                    <Card key={index} padding="none" className="overflow-hidden">
                      {project.imageUrl && (
                        <div className="h-40 w-full">
                          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-900 dark:text-white">{project.title}</h3>
                          <Button
                            variant="ghost"
                            size="small"
                            icon="delete"
                            onClick={() => confirmDeleteProject(project._id)}
                          />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{project.description}</p>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.technologies.map((tech, i) => (
                              <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No projects added yet</p>
              )}
            </Card>

            <Card>
              <h2 className="text-xl font-bold mb-6">Add New Project</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Project Title *</label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Technologies</label>
                  <input
                    type="text"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                    placeholder="React, Node.js, MongoDB"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                  <p className="text-xs text-slate-500">Séparées par des virgules</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Role</label>
                  <input
                    type="text"
                    value={newProject.role}
                    onChange={(e) => setNewProject({...newProject, role: e.target.value})}
                    placeholder="Lead Developer"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Image URL</label>
                  <input
                    type="url"
                    value={newProject.imageUrl}
                    onChange={(e) => setNewProject({...newProject, imageUrl: e.target.value})}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Project URL</label>
                  <input
                    type="url"
                    value={newProject.projectUrl}
                    onChange={(e) => setNewProject({...newProject, projectUrl: e.target.value})}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start Date</label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">End Date</label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                    disabled={newProject.isCurrent}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm disabled:bg-slate-50"
                  />
                </div>
                
                <div className="flex items-center gap-2 md:col-span-2">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    checked={newProject.isCurrent}
                    onChange={(e) => setNewProject({...newProject, isCurrent: e.target.checked, endDate: ''})}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isCurrent" className="text-sm text-slate-700 dark:text-slate-300">
                    This is a current project
                  </label>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleAddProject}
                  variant="primary"
                  icon="add"
                  loading={saving}
                >
                  Add Project
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-bold mb-6">Work Experience</h2>
              
              {profile.experiences && profile.experiences.length > 0 ? (
                <div className="space-y-4">
                  {profile.experiences.map((exp, index) => (
                    <div key={index} className="flex justify-between items-start p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{exp.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'N/A'} - {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'N/A'}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{exp.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="small"
                        icon="delete"
                        onClick={() => confirmDeleteExperience(exp._id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No experience added yet</p>
              )}
            </Card>

            <Card>
              <h2 className="text-xl font-bold mb-6">Add Work Experience</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Job Title *</label>
                  <input
                    type="text"
                    value={newExperience.title}
                    onChange={(e) => setNewExperience({...newExperience, title: e.target.value})}
                    placeholder="Senior Developer"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company *</label>
                  <input
                    type="text"
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                    placeholder="TechFlow Systems"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Location</label>
                  <input
                    type="text"
                    value={newExperience.location}
                    onChange={(e) => setNewExperience({...newExperience, location: e.target.value})}
                    placeholder="Paris, France"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start Date</label>
                  <input
                    type="date"
                    value={newExperience.startDate}
                    onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">End Date</label>
                  <input
                    type="date"
                    value={newExperience.endDate}
                    onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})}
                    disabled={newExperience.isCurrent}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm disabled:bg-slate-50"
                  />
                </div>
                
                <div className="flex items-center gap-2 md:col-span-2">
                  <input
                    type="checkbox"
                    id="expCurrent"
                    checked={newExperience.isCurrent}
                    onChange={(e) => setNewExperience({...newExperience, isCurrent: e.target.checked, endDate: ''})}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="expCurrent" className="text-sm text-slate-700 dark:text-slate-300">
                    I currently work here
                  </label>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                  <textarea
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                    rows="3"
                    placeholder="Describe your responsibilities and achievements..."
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleAddExperience}
                  variant="primary"
                  icon="add"
                  loading={saving}
                >
                  Add Experience
                </Button>
              </div>
            </Card>
          </div>
        )}
        {/* CV Tab */}
        {activeTab === 'cv' && (
          <Card>
            <h2 className="text-xl font-bold mb-6">CV & Documents</h2>
            
            <div className="space-y-6">
              {/* CV actuel */}
              {profile.cv ? (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">description</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 dark:text-white">{profile.cv.originalName}</h3>
                      <p className="text-xs text-slate-500">
                        Uploadé le {new Date(profile.cv.uploadDate).toLocaleDateString()} 
                        ({Math.round(profile.cv.fileSize / 1024)} KB)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={profile.cv.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </a>
                      <button
                        onClick={handleDeleteCV}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">upload_file</span>
                  <p className="text-slate-500">Aucun CV uploadé</p>
                </div>
              )}

              {/* Upload nouveau CV */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Uploader un nouveau CV
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleCVUpload(e.target.files[0])}
                      className="hidden"
                      disabled={uploadingCV}
                    />
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center hover:border-primary transition-colors">
                      <span className="material-symbols-outlined text-2xl text-slate-400 mb-1">cloud_upload</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {uploadingCV ? 'Upload en cours...' : 'Cliquez pour sélectionner un fichier'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX (max 10MB)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Séparateur */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-4 text-slate-500">OU</span>
                </div>
              </div>

              {/* Génération PDF */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Générer un CV depuis votre profil</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Créez un CV PDF automatiquement à partir des informations de votre profil.
                </p>
                <Button
                  onClick={handleDownloadPDF}
                  variant="primary"
                  icon="download"
                >
                  Télécharger mon CV (PDF)
                </Button>
              </div>
            </div>
          </Card>
        )}
        {/* Password Tab */}
        {activeTab === 'password' && (
          <Card>
            <h2 className="text-xl font-bold mb-6">Change Password</h2>
            
            <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                />
                <p className="text-xs text-slate-500">Minimum 6 characters</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Confirmation Dialog pour les suppressions */}
        <ConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setDeleteTarget(null);
            setDeleteType(null);
          }}
          onConfirm={() => {
            if (deleteType === 'skill') handleDeleteSkill();
            else if (deleteType === 'project') handleDeleteProject();
            else if (deleteType === 'experience') handleDeleteExperience();
          }}
          title={`Supprimer ${deleteType === 'skill' ? 'cette compétence' : deleteType === 'project' ? 'ce projet' : 'cette expérience'}`}
          message={`Êtes-vous sûr de vouloir supprimer ${deleteType === 'skill' ? 'cette compétence' : deleteType === 'project' ? 'ce projet' : 'cette expérience'} ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
          variant="danger"
          loading={saving}
        />
      </main>
    </div>
  );
};

export default SettingsPage;