import React from 'react';

const SuccessMessage = ({ message }) => {
  return (
    <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined">check_circle</span>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SuccessMessage;