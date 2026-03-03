import React from 'react';
import Card from '../UI/Card';

const ProjectsTab = ({ profile, isOwnProfile }) => {
  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Projects</h3>
      
      {profile.projects && profile.projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.projects.map((project, index) => (
            <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
              {project.imageUrl && (
                <div className="h-40 w-full">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <h4 className="font-bold text-slate-900 dark:text-white">{project.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-8">No projects listed</p>
      )}
    </Card>
  );
};

export default ProjectsTab;  // ← Important : export default