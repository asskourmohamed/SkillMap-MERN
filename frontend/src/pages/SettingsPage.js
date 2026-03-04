import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/Layout/AppHeader';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ConfirmationDialog from '../components/Common/ConfirmationDialog';
import SettingsTabs from '../components/Settings/SettingsTabs';
import ProfileInfoTab from '../components/Settings/ProfileInfoTab';
import SkillsManager from '../components/Settings/SkillsManager';
import ProjectsManager from '../components/Settings/ProjectsManager';
import ExperienceManager from '../components/Settings/ExperienceManager';
import PasswordTab from '../components/Settings/PasswordTab';
import { authService, skillService, projectService, experienceService } from '../services/api';
import { uploadService } from '../services/uploadService';
import { cvService } from '../services/cvService';
import { useToast } from '../context/ToastContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
const SettingsPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('profile');
  const [uploading, setUploading] = useState({ profile: false, cover: false });
  const [uploadingCV, setUploadingCV] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  
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

  const toast = useToast();
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

  // Uploads
  const handleProfilePictureUpload = async (file) => {
    setUploading(prev => ({ ...prev, profile: true }));
    try {
      const response = await uploadService.uploadProfilePicture(file);
      setFormData(prev => ({ ...prev, profilePicture: response.data.data.profilePicture }));
      toast.success('Photo de profil mise à jour avec succès !');
      
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

  // Skills
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
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression');
    } finally {
      setSaving(false);
      setDeleteTarget(null);
      setDeleteType(null);
    }
  };

  // Projects
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

  // Experiences
  const handleAddExperience = async () => {
    if (!newExperience.title || !newExperience.company) {
      toast.error('Le titre et l\'entreprise sont requis');
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

  // CV
  const handleCVUpload = async (file) => {
    if (!file) return;

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

  // Profile
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

  // Password
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

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <AppHeader user={profile} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your account settings and profile information</p>
        </div>

        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'profile' && (
          <ProfileInfoTab
            formData={formData}
            onInputChange={handleInputChange}
            onSave={handleSaveProfile}
            onUploadProfile={handleProfilePictureUpload}
            onUploadCover={handleCoverPictureUpload}
            uploading={uploading}
            saving={saving}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsManager
            skills={profile.skills || []}
            newSkill={newSkill}
            onNewSkillChange={setNewSkill}
            onAddSkill={handleAddSkill}
            onDeleteSkill={confirmDeleteSkill}
            saving={saving}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsManager
            projects={profile.projects || []}
            newProject={newProject}
            onNewProjectChange={setNewProject}
            onAddProject={handleAddProject}
            onDeleteProject={confirmDeleteProject}
            saving={saving}
          />
        )}

        {activeTab === 'experience' && (
          <ExperienceManager
            experiences={profile.experiences || []}
            newExperience={newExperience}
            onNewExperienceChange={setNewExperience}
            onAddExperience={handleAddExperience}
            onDeleteExperience={confirmDeleteExperience}
            saving={saving}
          />
        )}

        {activeTab === 'cv' && (
          <Card>
            <h2 className="text-xl font-bold mb-6">CV & Documents</h2>
            
            <div className="space-y-6">
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

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-4 text-slate-500">OU</span>
                </div>
              </div>

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

        {activeTab === 'password' && (
          <PasswordTab
            passwordData={passwordData}
            onPasswordChange={handlePasswordChange}
            onSubmit={handleChangePassword}
            saving={saving}
          />
        )}

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