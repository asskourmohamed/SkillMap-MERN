import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/Layout/AppHeader';
import API, { authService, skillService, projectService, experienceService } from '../services/api';

const MyProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
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
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const fetchMyProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer l'utilisateur depuis localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        return;
      }
      
      // Récupérer le profil complet depuis l'API
      const response = await authService.getMe();
      setProfile(response.data.data);
      setFormData(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      setError(error.response?.data?.error || 'Erreur de chargement du profil');
      
      // Si token invalide, rediriger vers login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
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

  const handleSaveProfile = async () => {
    try {
      const response = await authService.updateProfile(formData);
      setProfile(response.data.data);
      setEditMode(false);
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert(error.response?.data?.error || 'Erreur lors de la mise à jour');
    }
  };

  const handleAddSkill = async () => {
    try {
      if (!newSkill.name) {
        alert('Le nom de la compétence est requis');
        return;
      }

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
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la compétence:', error);
      alert(error.response?.data?.error || 'Erreur lors de l\'ajout de la compétence');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm('Supprimer cette compétence ?')) {
      try {
        await skillService.deleteSkill(profile._id, skillId);
        fetchMyProfile();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert(error.response?.data?.error || 'Erreur lors de la suppression');
      }
    }
  };

  const handleAddProject = async () => {
    try {
      if (!newProject.title) {
        alert('Le titre du projet est requis');
        return;
      }

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
    } catch (error) {
      console.error('Erreur lors de l\'ajout du projet:', error);
      alert(error.response?.data?.error || 'Erreur lors de l\'ajout du projet');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Supprimer ce projet ?')) {
      try {
        await projectService.deleteProject(profile._id, projectId);
        fetchMyProfile();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert(error.response?.data?.error || 'Erreur lors de la suppression');
      }
    }
  };

  const handleAddExperience = async () => {
    try {
      if (!newExperience.title || !newExperience.company) {
        alert('Le titre et l\'entreprise sont requis');
        return;
      }

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
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'expérience:', error);
      alert(error.response?.data?.error || 'Erreur lors de l\'ajout de l\'expérience');
    }
  };

  const handleDeleteExperience = async (expId) => {
    if (window.confirm('Supprimer cette expérience ?')) {
      try {
        await experienceService.deleteExperience(profile._id, expId);
        fetchMyProfile();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert(error.response?.data?.error || 'Erreur lors de la suppression');
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
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

  if (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <AppHeader user={profile} />
        <div className="flex flex-col justify-center items-center h-64">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Erreur</h2>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={fetchMyProfile}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Réessayer
            </button>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <AppHeader />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Profil non trouvé</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Veuillez vous reconnecter.</p>
          <button 
            onClick={handleLogout}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <AppHeader user={profile} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
          <div className="h-48 w-full bg-gradient-to-r from-primary to-sky-600 relative">
            {profile.coverPicture && (
              <img src={profile.coverPicture} alt="Cover" className="w-full h-full object-cover" />
            )}
          </div>
          
          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row md:items-end -mt-16 gap-6">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 overflow-hidden shadow-lg">
                  <img 
                    alt={profile.name} 
                    className="h-full w-full object-cover" 
                    src={profile.profilePicture || "https://lh3.googleusercontent.com/aida-public/AB6AXuATPvGJ8NLXfW2ZpfG6onwZx-RSG_oZg80XgZpZ8qEDgVZpSiR9XFRJgoSkaciqVwWfh4UbMAEW4LkdRy5Uvf2V6yqx5paSTTK7VA9Mr0WGUwykkQ3495cxVGvl03Re9qkZyCBhe010QrcP9yzDj3rm0KeAdwZAsoj4Mah_cuQ9z4Msd4JExvEfMmw5p4-VKE98oVweG30H9-g3Yr_0aCZzC9FwKdE2VoZ_VxCEVWKxNn5Wdj2huqEhN2xf9RKuCAvvzntCgXTs7Oif"}
                  />
                </div>
                <button className="absolute bottom-2 right-2 bg-white dark:bg-slate-800 p-2 rounded-full shadow-md border border-slate-100 dark:border-slate-700 text-primary hover:text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-xl">photo_camera</span>
                </button>
              </div>
              
              <div className="flex-1 pb-2">
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="text-3xl font-bold bg-transparent border-b border-primary focus:outline-none w-full dark:text-white"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{profile.name}</h1>
                )}
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                  {profile.jobTitle || 'Professionnel'} {profile.company ? `at ${profile.company}` : ''}
                </p>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {profile.location || 'Location non définie'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">mail</span>
                    {profile.email}
                  </span>
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary font-semibold hover:underline">
                      <span className="material-symbols-outlined text-sm">link</span>
                      {profile.website.replace('https://', '')}
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 pb-2">
                {editMode ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setFormData(profile);
                      }}
                      className="px-6 py-2.5 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-all"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar mb-8">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-6 py-3 border-b-2 font-bold text-sm flex items-center gap-2 ${
              activeTab === 'personal'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">person</span>
            Personal Info
          </button>
          
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-3 border-b-2 font-bold text-sm flex items-center gap-2 ${
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
            className={`px-6 py-3 border-b-2 font-bold text-sm flex items-center gap-2 ${
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
            className={`px-6 py-3 border-b-2 font-bold text-sm flex items-center gap-2 ${
              activeTab === 'experience'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">business_center</span>
            Experience
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    rows="4"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    placeholder="https://"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Department</label>
                  <select
                    name="department"
                    value={formData.department || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-slate-50 disabled:text-slate-500"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Développement">Développement</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Commercial">Commercial</option>
                    <option value="RH">RH</option>
                    <option value="Data">Data</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              {/* Liste des compétences */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">My Skills</h3>
                
                <div className="space-y-4">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white">{skill.name}</h4>
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
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-8">No skills added yet</p>
                  )}
                </div>
              </div>

              {/* Ajouter une compétence */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Add New Skill</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Skill Name</label>
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
                      <option value="Débutant">Débutant</option>
                      <option value="Intermédiaire">Intermédiaire</option>
                      <option value="Avancé">Avancé</option>
                      <option value="Expert">Expert</option>
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
                  className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2"
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
                <h3 className="text-lg font-bold mb-4">My Projects</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.projects && profile.projects.length > 0 ? (
                    profile.projects.map((project, index) => (
                      <div key={index} className="group relative bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                        {project.imageUrl && (
                          <div className="h-40 relative">
                            <img 
                              src={project.imageUrl} 
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="font-bold text-slate-900 dark:text-white">{project.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.technologies?.map((tech, i) => (
                              <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{tech}</span>
                            ))}
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-xs text-slate-500">
                              {project.startDate ? new Date(project.startDate).getFullYear() : 'N/A'} - {project.isCurrent ? 'Present' : project.endDate ? new Date(project.endDate).getFullYear() : 'N/A'}
                            </span>
                            <button
                              onClick={() => handleDeleteProject(project._id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-8 col-span-2">No projects added yet</p>
                  )}
                </div>
              </div>

              {/* Ajouter un projet */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Add New Project</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Project Title</label>
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
                  className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2"
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
                <h3 className="text-lg font-bold mb-4">Work Experience</h3>
                
                <div className="space-y-4">
                  {profile.experiences && profile.experiences.length > 0 ? (
                    profile.experiences.map((exp, index) => (
                      <div key={index} className="flex justify-between items-start p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{exp.title}</h4>
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
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-8">No experience added yet</p>
                  )}
                </div>
              </div>

              {/* Ajouter une expérience */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Add Work Experience</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Job Title</label>
                    <input
                      type="text"
                      value={newExperience.title}
                      onChange={(e) => setNewExperience({...newExperience, title: e.target.value})}
                      placeholder="Senior Developer"
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company</label>
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
                  className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Experience
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyProfilePage;