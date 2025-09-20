import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  text = '', 
  className = '',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    purple: 'border-purple-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`}></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          {spinner}
          {text && <p className="mt-4 text-gray-600 animate-pulse">{text}</p>}
        </div>
      </div>
    );
  }

  if (text) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        {spinner}
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
