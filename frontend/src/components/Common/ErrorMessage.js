import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined">error</span>
        <p className="flex-1">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
          >
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;