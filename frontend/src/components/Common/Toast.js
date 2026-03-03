import React, { useEffect, useState } from 'react';

const Toast = ({ 
  message, 
  type = 'success', 
  duration = 3000, 
  size = 'medium',
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info'
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="w-80 h-30 pointer-events-auto animate-fadeIn">
        <div className={`${colors[type]} border-2 rounded-lg shadow-lg w-full h-full flex flex-col items-center justify-center p-6`}>
          <div className="flex items-start gap-3">
            <span className={`material-symbols-outlined ${iconColors[type]}`}>
              {icons[type]}
            </span>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button 
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 200);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;