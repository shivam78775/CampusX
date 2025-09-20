import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingOverlay = ({ 
  isVisible, 
  text = 'Loading...', 
  backdrop = true,
  className = ''
}) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
      {backdrop && (
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      )}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-sm w-full">
        <div className="text-center">
          <LoadingSpinner size="lg" color="blue" />
          <p className="mt-4 text-gray-700 font-medium animate-pulse">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
