// src/components/chat/AssistantMessage.tsx

import React from 'react';
import { formatMessageTime } from '../../utils/formatters';

interface AssistantMessageProps {
  message: {
    content: string;
    createdAt?: Date | string;
    error?: string;
  };
  isLoading?: boolean;
  onRegenerate?: () => void;
}

export const AssistantMessage = ({ message, isLoading, onRegenerate }: AssistantMessageProps) => {
  console.log('Rendering AssistantMessage:', message); // 调试日志
  
  const createdDate = message.createdAt 
    ? typeof message.createdAt === 'string' 
      ? new Date(message.createdAt) 
      : message.createdAt 
    : new Date();

  const formattedTime = formatMessageTime(createdDate);
  const isError = !!message.error;

  return (
    <div className="flex mb-6">
      {/* <div className="flex-shrink-0 mr-3">
        <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
          <i className="fa fa-robot text-blue-500" />
        </div>
      </div> */}
      
      <div className="flex-1">
        <div className={`rounded-lg p-4 ${isError ? 'bg-red-50 border border-red-100' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500">{formattedTime}</div>
          </div>
          
          {isError ? (
            <div className="text-red-600">
              <p>Error: {message.error}</p>
              {onRegenerate && (
                <button className="mt-2 text-blue-500 hover:text-blue-700 text-sm">
                  Try again
                </button>
              )}
            </div>
          ) : (
            <div className="prose max-w-none text-gray-800 text-left">
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="mt-2 text-xs text-gray-500">
            <span className="inline-block animate-pulse mr-1">•</span>
            <span className="inline-block animate-pulse mx-1">•</span>
            <span className="inline-block animate-pulse ml-1">•</span>
          </div>
        ) : onRegenerate && !isError ? (
          <div className="mt-2">
            <button
              className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
              onClick={onRegenerate}
            >
              <i className="fa fa-refresh mr-1" /> Regenerate response
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
