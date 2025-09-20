import React from 'react';

const LoadingSkeleton = ({ 
  type = 'text', 
  lines = 1, 
  className = '',
  width = 'w-full',
  height = 'h-4'
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`}></div>
        );
      
      case 'avatar':
        return (
          <div className={`w-10 h-10 bg-gray-200 rounded-full animate-pulse ${className}`}></div>
        );
      
      case 'card':
        return (
          <div className={`${width} bg-white rounded-lg shadow-sm border p-4 animate-pulse ${className}`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        );
      
      case 'post':
        return (
          <div className={`${width} bg-white rounded-lg shadow-sm border p-4 animate-pulse ${className}`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded w-3/5"></div>
            </div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        );
      
      case 'list':
        return (
          <div className={`${width} space-y-3 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3 p-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`}></div>
        );
    }
  };

  return renderSkeleton();
};

export default LoadingSkeleton;
