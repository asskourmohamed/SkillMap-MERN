import React from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';

const ProjectsManager = ({
  projects = [],
  newProject,
  onNewProjectChange,
  onAddProject,
  onDeleteProject,
  saving
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-6">Your Projects</h2>
        
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <Card key={index} padding="none" className="overflow-hidden">
                {project.imageUrl && (
                  <div className="h-40 w-full">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 dark:text-white">{project.title}</h3>
                    <Button
                      variant="ghost"
                      size="small"
                      icon="delete"
                      onClick={() => onDeleteProject(project._id)}
                    />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No projects added yet</p>
        )}
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-6">Add New Project</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Project Title *</label>
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => onNewProjectChange({ ...newProject, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              value={newProject.description}
              onChange={(e) => onNewProjectChange({ ...newProject, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Technologies</label>
            <input
              type="text"
              value={newProject.technologies}
              onChange={(e) => onNewProjectChange({ ...newProject, technologies: e.target.value })}
              placeholder="React, Node.js, MongoDB"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
            <p className="text-xs text-slate-500">Séparées par des virgules</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Role</label>
            <input
              type="text"
              value={newProject.role}
              onChange={(e) => onNewProjectChange({ ...newProject, role: e.target.value })}
              placeholder="Lead Developer"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Image URL</label>
            <input
              type="url"
              value={newProject.imageUrl}
              onChange={(e) => onNewProjectChange({ ...newProject, imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Project URL</label>
            <input
              type="url"
              value={newProject.projectUrl}
              onChange={(e) => onNewProjectChange({ ...newProject, projectUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start Date</label>
            <input
              type="date"
              value={newProject.startDate}
              onChange={(e) => onNewProjectChange({ ...newProject, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">End Date</label>
            <input
              type="date"
              value={newProject.endDate}
              onChange={(e) => onNewProjectChange({ ...newProject, endDate: e.target.value })}
              disabled={newProject.isCurrent}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm disabled:bg-slate-50"
            />
          </div>
          
          <div className="flex items-center gap-2 md:col-span-2">
            <input
              type="checkbox"
              id="isCurrent"
              checked={newProject.isCurrent}
              onChange={(e) => onNewProjectChange({ ...newProject, isCurrent: e.target.checked, endDate: '' })}
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isCurrent" className="text-sm text-slate-700 dark:text-slate-300">
              This is a current project
            </label>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button
            onClick={onAddProject}
            variant="primary"
            icon="add"
            loading={saving}
          >
            Add Project
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProjectsManager;