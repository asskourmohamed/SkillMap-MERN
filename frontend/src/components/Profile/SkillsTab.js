import React from 'react';
import Card from '../UI/Card';

const SkillsTab = ({ profile, isOwnProfile }) => {
  return (
    <Card>
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
    </Card>
  );
};

export default SkillsTab;  // ← Important : export default