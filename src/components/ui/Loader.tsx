// src/components/ui/Loader.tsx

import React from 'react';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Loader = ({ 
  message = 'Loading...',
  size = 'md',
  color = 'blue-500' 
}: LoaderProps) => {
  // 根据尺寸设置动画大小
  const spinnerSize = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100px]">
      <div className={`${spinnerSize[size]} border-gray-200 border-t-${color} rounded-full animate-spin mb-4`} />
      <p className={`text-gray-500 dark:text-gray-400 text-sm ${size === 'lg' ? 'text-base' : ''}`}>{message}</p>
    </div>
  );
};

export default Loader;