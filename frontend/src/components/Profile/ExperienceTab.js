import React from 'react';
import Card from '../UI/Card';

const ExperienceTab = ({ profile, isOwnProfile }) => {
  return (
    <Card>
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
    </Card>
  );
};

export default ExperienceTab;  // ← Important : export default