import React from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';

const CVTab = ({ profile, isOwnProfile }) => {
  const openCVInNewTab = () => {
    if (profile.cv?.url) {
      // Pour les PDF, on peut utiliser Google Docs Viewer
      if (profile.cv.url.includes('.pdf') || profile.cv.fileType?.includes('pdf')) {
        // Option 1: Google Docs Viewer (recommandé)
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(profile.cv.url)}&embedded=false`;
        window.open(viewerUrl, '_blank');
      } else {
        // Option 2: Ouvrir directement l'URL
        window.open(profile.cv.url, '_blank');
      }
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">CV </h3>
      
      {profile.cv ? (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">description</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 dark:text-white">{profile.cv.originalName}</h4>
                <p className="text-xs text-slate-500">
                  {Math.round(profile.cv.fileSize / 1024)} KB • 
                  Uploadé le {new Date(profile.cv.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={openCVInNewTab}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                Take a look
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">description</span>
          <p className="text-slate-500">Aucun CV disponible</p>
          {isOwnProfile && (
            <p className="text-sm text-slate-400 mt-2">
              Ajoutez votre CV dans les paramètres
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default CVTab;