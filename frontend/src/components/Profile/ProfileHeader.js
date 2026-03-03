import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import ImageUploader from '../Common/ImageUploader';
import Card from '../UI/Card';
const ProfileHeader = ({ profile, isOwnProfile, onUploadProfile, onUploadCover, uploading }) => {
  return (
    <Card padding="none" className="overflow-hidden mb-8">
      {/* Cover Image */}
      <div className="h-48 w-full bg-gradient-to-r from-primary to-sky-600 relative">
        {profile.coverPicture && (
          <img src={profile.coverPicture} alt="Cover" className="w-full h-full object-cover" />
        )}
      </div>
      
      <div className="px-8 pb-8">
        <div className="relative flex flex-col md:flex-row md:items-end -mt-8 gap-6">
          {/* Profile Image */}
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
          
          <div className="flex gap-3 pb-2">
            {isOwnProfile ? (
              <Link to="/app/settings">
                <Button icon="edit">Edit Profile</Button>
              </Link>
            ) : (
              <>
                <Button icon="person_add">Connect</Button>
                <Button variant="secondary" icon="chat">Message</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;