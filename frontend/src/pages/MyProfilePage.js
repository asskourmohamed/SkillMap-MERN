import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/Layout/AppHeader';
import { authService } from '../services/api';

const MyProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const fetchMyProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        return;
      }
      
      const response = await authService.getMe();
      setProfile(response.data.data);
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      setError(error.response?.data?.error || 'Erreur de chargement');
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
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

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <AppHeader />
        <div className="flex flex-col justify-center items-center h-64">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Error</h2>
          <p className="text-slate-600 dark:text-slate-400">{error || 'Profile not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <AppHeader user={profile} />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <span className="absolute bottom-2 right-2 h-5 w-5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar mb-8">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-6 py-3 border-b-2 font-bold text-sm flex items-center gap-2 ${
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
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">About</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {profile.bio || 'No bio provided yet.'}
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

          {/* Skills Tab */}
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
                <p className="text-slate-500 text-center py-8">No skills added yet</p>
              )}
            </div>
          )}

          {/* Projects Tab */}
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
                <p className="text-slate-500 text-center py-8">No projects added yet</p>
              )}
            </div>
          )}

          {/* Experience Tab */}
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
                <p className="text-slate-500 text-center py-8">No experience added yet</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyProfilePage;