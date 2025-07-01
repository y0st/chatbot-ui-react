// src/components/chat/FunctionCallMessage.tsx
import React from 'react';

interface FunctionCallMessageProps {
  message: {
    content: string;
    name: string;
    createdAt: Date;
  };
}

export const FunctionCallMessage = ({ message }: FunctionCallMessageProps) => {
  return (
    <div className="flex items-start mb-6 max-w-[90%] md:max-w-[80%]">
      <div className="mr-3">
        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400">
          <i className="fa fa-code text-sm"></i>
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <span className="text-green-700 dark:text-green-400 font-medium mr-2">Function call:</span>
            <span className="text-gray-700 dark:text-gray-300 font-mono">{message.name}</span>
          </div>
          <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md text-sm text-gray-800 dark:text-gray-300 overflow-x-auto">
            {JSON.stringify(JSON.parse(message.content), null, 2)}
          </pre>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {message.createdAt.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};