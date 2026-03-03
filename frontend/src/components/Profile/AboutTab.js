import React from 'react';
import Card from '../UI/Card';

const AboutTab = ({ profile }) => {
  return (
    <Card>
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
    </Card>
  );
};

export default AboutTab;  // ← Important : export default