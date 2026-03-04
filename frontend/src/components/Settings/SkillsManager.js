import React from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { SKILL_LEVELS } from '../../utils/constants';

const SkillsManager = ({
  skills = [],
  newSkill,
  onNewSkillChange,
  onAddSkill,
  onDeleteSkill,
  saving
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-6">Your Skills</h2>
        
        {skills.length > 0 ? (
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">{skill.name}</h3>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      {skill.level}
                    </span>
                  </div>
                  {skill.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{skill.description}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    {skill.yearsOfExperience || 0} years experience
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  icon="delete"
                  onClick={() => onDeleteSkill(skill._id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No skills added yet</p>
        )}
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-6">Add New Skill</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Skill Name *</label>
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => onNewSkillChange({ ...newSkill, name: e.target.value })}
              placeholder="e.g., React, Python, Figma"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Level</label>
            <select
              value={newSkill.level}
              onChange={(e) => onNewSkillChange({ ...newSkill, level: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            >
              {SKILL_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Years Experience</label>
            <input
              type="number"
              value={newSkill.yearsOfExperience}
              onChange={(e) => onNewSkillChange({ ...newSkill, yearsOfExperience: e.target.value })}
              placeholder="5"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description (optional)</label>
            <input
              type="text"
              value={newSkill.description}
              onChange={(e) => onNewSkillChange({ ...newSkill, description: e.target.value })}
              placeholder="Brief description of your expertise"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button
            onClick={onAddSkill}
            variant="primary"
            icon="add"
            loading={saving}
          >
            Add Skill
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SkillsManager;