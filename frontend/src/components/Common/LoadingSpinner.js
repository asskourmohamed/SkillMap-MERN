import React from 'react';

const LoadingSpinner = ({ size = 'medium', fullPage = false }) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-4',
    large: 'h-16 w-16 border-4'
  };

  if (fullPage) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size]}`}></div>
      </div>
    );
  }

  return (
    <div className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size]}`}></div>
  );
};

export default LoadingSpinner;