import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/Layout/AppHeader';
import { authService, skillService, projectService, experienceService } from '../services/api';

const SettingsPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('profile');
  
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
      setError('Erreur lors du chargement du profil');
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

  // ========== GESTION DES COMPÉTENCES ==========
  const handleAddSkill = async () => {
    if (!newSkill.name) {
      setError('Le nom de la compétence est requis');
      return;
    }

    try {
      setSaving(true);
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
      setSuccess('Compétence ajoutée avec succès !');
    } catch (error) {
      console.error('Erreur ajout compétence:', error);
      setError(error.response?.data?.error || 'Erreur lors de l\'ajout de la compétence');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Supprimer cette compétence ?')) return;

    try {
      setSaving(true);
      await skillService.deleteSkill(profile._id, skillId);
      fetchProfile();
      setSuccess('Compétence supprimée avec succès !');
    } catch (error) {
      console.error('Erreur suppression compétence:', error);
      setError(error.response?.data?.error || 'Erreur lors de la suppression');
    } finally {
      setSaving(false);
    }
  };

  // ========== GESTION DES PROJETS ==========
  const handleAddProject = async () => {
    if (!newProject.title) {
      setError('Le titre du projet est requis');
      return;
    }

    try {
      setSaving(true);
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
      setSuccess('Projet ajouté avec succès !');
    } catch (error) {
      console.error('Erreur ajout projet:', error);
      setError(error.response?.data?.error || 'Erreur lors de l\'ajout du projet');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Supprimer ce projet ?')) return;

    try {
      setSaving(true);
      await projectService.deleteProject(profile._id, projectId);
      fetchProfile();
      setSuccess('Projet supprimé avec succès !');
    } catch (error) {
      console.error('Erreur suppression projet:', error);
      setError(error.response?.data?.error || 'Erreur lors de la suppression');
    } finally {
      setSaving(false);
    }
  };

  // ========== GESTION DES EXPÉRIENCES ==========
  const handleAddExperience = async () => {
    if (!newExperience.title || !newExperience.company) {
      setError('Le titre et l\'entreprise sont requis');
      return;
    }

    try {
      setSaving(true);
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
      setSuccess('Expérience ajoutée avec succès !');
    } catch (error) {
      console.error('Erreur ajout expérience:', error);
      setError(error.response?.data?.error || 'Erreur lors de l\'ajout de l\'expérience');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExperience = async (expId) => {
    if (!window.confirm('Supprimer cette expérience ?')) return;

    try {
      setSaving(true);
      await experienceService.deleteExperience(profile._id, expId);
      fetchProfile();
      setSuccess('Expérience supprimée avec succès !');
    } catch (error) {
      console.error('Erreur suppression expérience:', error);
      setError(error.response?.data?.error || 'Erreur lors de la suppression');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.updateProfile(formData);
      setProfile(response.data.data);
      setSuccess('Profil mis à jour avec succès !');
      
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
      setError(error.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccess('Mot de passe modifié avec succès !');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      setError(error.response?.data?.error || 'Erreur lors du changement de mot de passe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <AppHeader user={profile} />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const departments = ['Développement', 'Design', 'Marketing', 'Commercial', 'RH', 'Data', 'DevOps', 'Product'];
  const skillLevels = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];

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
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">person</span>
            Profile Info
          </button>
          
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-3 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'skills'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">verified</span>
            Skills
          </button>
          
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'projects'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">work</span>
            Projects
          </button>
          
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-6 py-3 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'experience'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">business_center</span>
            Experience
          </button>
          
          <button
            onClick={() => setActiveTab('password')}
            className={`px-6 py-3 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'password'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">lock</span>
            Password
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
            {success}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Profile Information</h2>
            
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Photo de profil */}
                <div className="md:col-span-2 flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 overflow-hidden border border-primary/30">
                    <img 
                      src={formData.profilePicture || "https://lh3.googleusercontent.com/aida-public/AB6AXuD050YU9gFVp7RLrMz66Ea84hjGCtiuOA2XBNzDe6Wj_ew6M8Aq8o1D2Dw2GT7IPq1CTc3JSGihS55VOzIXxZreUy4ABv2uD4YV1KySw6ayJ36um8P7G24bRZ8LHFuoeRD67Q1vgqh-Zt1m2wcEjc29nrBILEMXSKDCGOGrwqEwfMhyyrPcrwuMuQDdhrgFsGuALJ1olnyYODNGjCnhhX1VoMub0LEV6dMOri2siuaLrbVsBZJPL6hgVSUv5YCtBwSzlYXfw-HfbRdY"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Profile Picture URL</p>
                    <input
                      type="url"
                      name="profilePicture"
                      value={formData.profilePicture || ''}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
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
                  <p className="text-xs text-slate-500">Email cannot be changed</p>
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
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
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
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            {/* Liste des compétences */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
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
                          {skill.yearsOfExperience || 0} years experience • {skill.endorsements?.length || 0} endorsements
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteSkill(skill._id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        disabled={saving}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No skills added yet</p>
              )}
            </div>

            {/* Ajouter une compétence */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
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
                    {skillLevels.map(level => (
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
              
              <button
                onClick={handleAddSkill}
                disabled={saving}
                className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Skill
              </button>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Liste des projets */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Your Projects</h2>
              
              {profile.projects && profile.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.projects.map((project, index) => (
                    <div key={index} className="group relative bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700">
                      {project.imageUrl && (
                        <div className="h-40 w-full">
                          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-900 dark:text-white">{project.title}</h3>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="p-1 text-red-500 hover:bg-red-100 rounded"
                            disabled={saving}
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
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
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No projects added yet</p>
              )}
            </div>

            {/* Ajouter un projet */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
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
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                    placeholder="React, Node.js, MongoDB"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                  />
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
              
              <button
                onClick={handleAddProject}
                disabled={saving}
                className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Project
              </button>
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            {/* Liste des expériences */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
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
                      <button
                        onClick={() => handleDeleteExperience(exp._id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        disabled={saving}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No experience added yet</p>
              )}
            </div>

            {/* Ajouter une expérience */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
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
              
              <button
                onClick={handleAddExperience}
                disabled={saving}
                className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Experience
              </button>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
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
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default SettingsPage;