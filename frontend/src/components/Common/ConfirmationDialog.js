import React from 'react';
import Button from '../UI/Button';

const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmation',
  message = 'Êtes-vous sûr de vouloir continuer ?',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'danger',
  loading = false
}) => {
  if (!isOpen) return null;

  const variantClasses = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-green-600 hover:bg-green-700'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6 animate-slideUp">
          {/* Icon selon le variant */}
          <div className="flex justify-center mb-4">
            {variant === 'danger' && (
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">warning</span>
              </div>
            )}
            {variant === 'warning' && (
              <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-yellow-600 dark:text-yellow-400">error</span>
              </div>
            )}
            {variant === 'info' && (
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-blue-600 dark:text-blue-400">info</span>
              </div>
            )}
            {variant === 'success' && (
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">check_circle</span>
              </div>
            )}
          </div>

          {/* Titre */}
          <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
            {message}
          </p>

          {/* Boutons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              fullWidth
            >
              {cancelText}
            </Button>
            <Button
              variant={variant === 'danger' ? 'danger' : 'primary'}
              onClick={onConfirm}
              loading={loading}
              fullWidth
            >
              {confirmText}
            </Button>
          </div>

          {/* Bouton fermer (X) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;