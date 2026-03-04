import React from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';

const ExperienceManager = ({
  experiences = [],
  newExperience,
  onNewExperienceChange,
  onAddExperience,
  onDeleteExperience,
  saving
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-6">Work Experience</h2>
        
        {experiences.length > 0 ? (
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div key={index} className="flex justify-between items-start p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{exp.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'N/A'} - {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'N/A'}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{exp.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  icon="delete"
                  onClick={() => onDeleteExperience(exp._id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No experience added yet</p>
        )}
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-6">Add Work Experience</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Job Title *</label>
            <input
              type="text"
              value={newExperience.title}
              onChange={(e) => onNewExperienceChange({ ...newExperience, title: e.target.value })}
              placeholder="Senior Developer"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company *</label>
            <input
              type="text"
              value={newExperience.company}
              onChange={(e) => onNewExperienceChange({ ...newExperience, company: e.target.value })}
              placeholder="TechFlow Systems"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Location</label>
            <input
              type="text"
              value={newExperience.location}
              onChange={(e) => onNewExperienceChange({ ...newExperience, location: e.target.value })}
              placeholder="Paris, France"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start Date</label>
            <input
              type="date"
              value={newExperience.startDate}
              onChange={(e) => onNewExperienceChange({ ...newExperience, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">End Date</label>
            <input
              type="date"
              value={newExperience.endDate}
              onChange={(e) => onNewExperienceChange({ ...newExperience, endDate: e.target.value })}
              disabled={newExperience.isCurrent}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm disabled:bg-slate-50"
            />
          </div>
          
          <div className="flex items-center gap-2 md:col-span-2">
            <input
              type="checkbox"
              id="expCurrent"
              checked={newExperience.isCurrent}
              onChange={(e) => onNewExperienceChange({ ...newExperience, isCurrent: e.target.checked, endDate: '' })}
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
              onChange={(e) => onNewExperienceChange({ ...newExperience, description: e.target.value })}
              rows="3"
              placeholder="Describe your responsibilities and achievements..."
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button
            onClick={onAddExperience}
            variant="primary"
            icon="add"
            loading={saving}
          >
            Add Experience
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ExperienceManager;