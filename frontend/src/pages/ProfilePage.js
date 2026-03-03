import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppHeader from '../components/Layout/AppHeader';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileTabs from '../components/Profile/ProfileTabs';
import AboutTab from '../components/Profile/AboutTab';
import SkillsTab from '../components/Profile/SkillsTab';
import ProjectsTab from '../components/Profile/ProjectsTab';
import ExperienceTab from '../components/Profile/ExperienceTab';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import { profileService, authService } from '../services/api';
import { uploadService } from '../services/uploadService';

const ProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [currentUser, setCurrentUser] = useState(null);
  const [uploading, setUploading] = useState({ profile: false, cover: false });
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    setCurrentUser(JSON.parse(userStr));
    
    if (!id) {
      fetchMyProfile();
    } else {
      fetchProfile(id);
    }
  }, [id]);

  const fetchMyProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getMe();
      setProfile(response.data.data);
    } catch (error) {
      setError('Erreur de chargement de votre profil');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (profileId) => {
    try {
      setLoading(true);
      const response = await profileService.getById(profileId);
      setProfile(response.data.data);
    } catch (error) {
      setError('Profil non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProfile = async (file) => {
    setUploading(prev => ({ ...prev, profile: true }));
    try {
      const response = await uploadService.uploadProfilePicture(file);
      setProfile(prev => ({ ...prev, profilePicture: response.data.data.profilePicture }));
      
      // Mettre à jour localStorage si c'est notre profil
      if (currentUser?._id === profile?._id) {
        const user = JSON.parse(localStorage.getItem('user'));
        user.profilePicture = response.data.data.profilePicture;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Erreur upload:', error);
    } finally {
      setUploading(prev => ({ ...prev, profile: false }));
    }
  };

  const handleUploadCover = async (file) => {
    setUploading(prev => ({ ...prev, cover: true }));
    try {
      const response = await uploadService.uploadCoverPicture(file);
      setProfile(prev => ({ ...prev, coverPicture: response.data.data.coverPicture }));
    } catch (error) {
      console.error('Erreur upload:', error);
    } finally {
      setUploading(prev => ({ ...prev, cover: false }));
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <AppHeader user={currentUser} />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <ErrorMessage message={error || 'Profil non trouvé'} onRetry={() => navigate('/app/discovery')} />
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === profile._id;

  const renderTab = () => {
    switch (activeTab) {
      case 'about': return <AboutTab profile={profile} />;
      case 'skills': return <SkillsTab profile={profile} isOwnProfile={isOwnProfile} />;
      case 'projects': return <ProjectsTab profile={profile} isOwnProfile={isOwnProfile} />;
      case 'experience': return <ExperienceTab profile={profile} isOwnProfile={isOwnProfile} />;
      default: return <AboutTab profile={profile} />;
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <AppHeader user={currentUser} />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => navigate('/app/discovery')}
          className="mb-4 flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Discovery
        </button>

        <ProfileHeader 
          profile={profile}
          isOwnProfile={isOwnProfile}
          onUploadProfile={handleUploadProfile}
          onUploadCover={handleUploadCover}
          uploading={uploading}
        />

        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-8">
          {renderTab()}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;