import React from 'react';

const SkillGapsTable = ({ skillGaps }) => {
  // Ensure we always work with an
  const skillsArray = Array.isArray(skillGaps)
    ? skillGaps
    : Array.isArray(skillGaps?.data)
    ? skillGaps.data
    : [];

  if (skillsArray.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
          Compétences des utilisateurs
        </h3>
        <p className="text-slate-500 text-center py-8">
          Aucune compétence trouvée
        </p>
      </div>
    );
  }

  // Grouper les
  const skillMap = new Map();

  skillsArray.forEach(skill => {
    const key = skill.title;
    if (!skillMap.has(key)) {
      skillMap.set(key, {
        title: key,
        level: skill.level,
        count: 0,
        users: []
      });
    }
    const entry = skillMap.get(key);
    entry.count++;
    if (skill.owner?.name) entry.users.push(skill.owner.name);
  });

  const skillsList = Array.from(skillMap.values()).sort((a, b) => b.count - a.count);

  const getLevelBadge = (level) => {
    const colors = {
      'Débutant': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Intermédiaire': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Avancé': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'Expert': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    };
    return colors[level] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Compétences des utilisateurs
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {skillsArray.length} compétences partagées • {skillsList.length} types différents
        </p>
      </div>

      <div className="p-4">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {skillsList.map((skill, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {skill.title}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelBadge(skill.level)}`}>
                    {skill.level}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {skill.count} utilisateur(s)
                  {skill.users.length > 0 && ` • ${skill.users.slice(0, 3).join(', ')}`}
                  {skill.users.length > 3 && ` et ${skill.users.length - 3} autres`}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-primary">
                  {skill.count}
                </span>
                <p className="text-xs text-slate-500">membres</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillGapsTable;