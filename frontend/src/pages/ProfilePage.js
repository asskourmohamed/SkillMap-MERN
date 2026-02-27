import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/Layout/AppHeader';
import { profileService, authService } from '../services/api';

const ProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer l'utilisateur connecté depuis localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.log('❌ Aucun utilisateur dans localStorage');
      navigate('/login');
      return;
    }

    const user = JSON.parse(userStr);
    setCurrentUser(user);
    console.log('👤 currentUser:', user.email);
    console.log('📍 URL:', window.location.pathname);
    console.log('🔍 ID:', id || 'pas d\'ID (my-profile)');
    
    // DÉCISION: quel profil charger ?
    if (!id) {
      // CAS 1: /app/my-profile → charger MON profil
      console.log('📡 CAS 1: Chargement de MON profil via authService.getMe()');
      fetchMyProfile();
    } else {
      // CAS 2: /app/profile/:id → charger le profil de quelqu'un d'autre
      console.log('📡 CAS 2: Chargement du profil ID:', id);
      fetchProfile(id);
    }
  }, [id]); // Dépend de id pour recharger si l'URL change

  const fetchMyProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📡 Appel à authService.getMe()...');
      const response = await authService.getMe();
      console.log('✅ Mon profil chargé:', response.data.data.email);
      setProfile(response.data.data);
    } catch (error) {
      console.error('❌ Erreur authService.getMe():', error);
      setError('Erreur de chargement de votre profil');
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (profileId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📡 Appel à profileService.getById() pour:', profileId);
      const response = await profileService.getById(profileId);
      console.log('✅ Profil chargé:', response.data.data.email);
      setProfile(response.data.data);
    } catch (error) {
      console.error('❌ Erreur profileService.getById():', error);
      setError('Profil non trouvé');
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si c'est notre propre profil
  const isOwnProfile = currentUser && profile && currentUser._id === profile._id;
  
  console.log('📊 isOwnProfile:', isOwnProfile);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <AppHeader user={currentUser} />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <AppHeader user={currentUser} />
        <div className="flex flex-col justify-center items-center h-64">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Profile Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400">{error || 'The profile you\'re looking for doesn\'t exist'}</p>
          <Link 
            to="/app/discovery" 
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to Discovery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <AppHeader user={currentUser} />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bouton retour */}
        <button 
          onClick={() => navigate('/app/discovery')}
          className="mb-4 flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Discovery
        </button>

        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
          <div className="h-48 w-full bg-gradient-to-r from-primary to-sky-600 relative">
            {profile.coverPicture && (
              <img src={profile.coverPicture} alt="Cover" className="w-full h-full object-cover" />
            )}
          </div>
          
          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row md:items-end -mt-16 gap-6">
              <div className="relative">
                <div className="h-32 w-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 overflow-hidden shadow-lg">
                  <img 
                    alt={profile.name} 
                    className="h-full w-full object-cover" 
                    src={profile.profilePicture || "https://lh3.googleusercontent.com/aida-public/AB6AXuATPvGJ8NLXfW2ZpfG6onwZx-RSG_oZg80XgZpZ8qEDgVZpSiR9XFRJgoSkaciqVwWfh4UbMAEW4LkdRy5Uvf2V6yqx5paSTTK7VA9Mr0WGUwykkQ3495cxVGvl03Re9qkZyCBhe010QrcP9yzDj3rm0KeAdwZAsoj4Mah_cuQ9z4Msd4JExvEfMmw5p4-VKE98oVweG30H9-g3Yr_0aCZzC9FwKdE2VoZ_VxCEVWKxNn5Wdj2huqEhN2xf9RKuCAvvzntCgXTs7Oif"}
                  />
                </div>
                {profile.openForWork && (
                  <span className="absolute bottom-2 right-2 h-5 w-5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                )}
              </div>
              
              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{profile.name}</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                  {profile.jobTitle || 'Professional'} {profile.company ? `at ${profile.company}` : ''}
                </p>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {profile.location || 'Location not set'}
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
              
              {/* Boutons d'action */}
              <div className="flex gap-3 pb-2">
                {isOwnProfile ? (
                  <Link 
                    to="/app/settings"
                    className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit Profile
                  </Link>
                ) : (
                  <>
                    <button className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">person_add</span>
                      Connect
                    </button>
                    <button className="px-6 py-2.5 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-all flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">chat</span>
                      Message
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar mb-8">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-6 py-3 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'about'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">person</span>
            About
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
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'about' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">About</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {profile.bio || 'No bio provided.'}
              </p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Department</p>
                  <p className="font-medium">{profile.department || 'Not specified'}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Member since</p>
                  <p className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Skills</h3>
              
              {profile.skills && profile.skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.skills.map((skill, index) => (
                    <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-900 dark:text-white">{skill.name}</h4>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                          {skill.level}
                        </span>
                      </div>
                      {skill.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">{skill.description}</p>
                      )}
                      <p className="text-xs text-slate-500 mt-2">
                        {skill.yearsOfExperience || 0} years experience
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No skills listed</p>
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Projects</h3>
              
              {profile.projects && profile.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.projects.map((project, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                      {project.imageUrl && (
                        <div className="h-40 w-full">
                          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="font-bold text-slate-900 dark:text-white">{project.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{project.description}</p>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
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
                <p className="text-slate-500 text-center py-8">No projects listed</p>
              )}
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Work Experience</h3>
              
              {profile.experiences && profile.experiences.length > 0 ? (
                <div className="space-y-6">
                  {profile.experiences.map((exp, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined">business_center</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white">{exp.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{exp.company}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {exp.startDate ? new Date(exp.startDate).getFullYear() : 'N/A'} - {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : 'N/A'}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No experience listed</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;