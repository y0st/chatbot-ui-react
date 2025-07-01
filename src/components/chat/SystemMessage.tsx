// src/components/chat/SystemMessage.tsx
import React from 'react';

interface SystemMessageProps {
  message: {
    content: string;
    createdAt: Date;
  };
}

export const SystemMessage = ({ message }: SystemMessageProps) => {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="bg-gray-100 dark:bg-gray-800/50 rounded-full px-4 py-1 text-xs text-gray-500 dark:text-gray-400">
        {message.content}
      </div>
    </div>
  );
};