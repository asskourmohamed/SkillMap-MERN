import React from 'react';

const SettingsTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: 'person' },
    { id: 'skills', label: 'Skills', icon: 'verified' },
    { id: 'projects', label: 'Projects', icon: 'work' },
    { id: 'experience', label: 'Experience', icon: 'business_center' },
    { id: 'cv', label: 'CV & Documents', icon: 'description' },
    { id: 'password', label: 'Password', icon: 'lock' }
  ];

  return (
    <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-lg">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SettingsTabs;