// src/components/chat/UserMessage.tsx
import React from 'react';

interface UserMessageProps {
  message: {
    content: string;
    createdAt: Date;
  };
}

export const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <div className="flex items-start mb-6 ml-auto max-w-[90%] md:max-w-[60%]">
      {/* <div className="hidden md:flex -ml-1 mr-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300">
          <span className="font-bold">U</span>
        </div>
      </div> */}
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-gray-800 whitespace-pre-wrap text-left">
            {message.content}
          </p>
        </div>
        <div className="text-xs text-gray-500 mt-1 text-right">
          {message.createdAt.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};