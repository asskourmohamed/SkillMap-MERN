import React from 'react';

const Card = ({ children, className = '', padding = 'medium', onClick }) => {
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  return (
    <div 
      className={`
        bg-white dark:bg-slate-900 
        rounded-xl shadow-sm 
        border border-slate-200 dark:border-slate-800
        ${paddingClasses[padding]}
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card; 