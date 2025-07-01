import { ChatMessage } from '../../types/chat';
import { cn } from '../../lib/utils';

interface MessageProps {
  message: ChatMessage;
}

export const Message = ({ message }: MessageProps) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2',
          isUser
            ? 'bg-blue-600 text-white'
            : isSystem
            ? 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'
            : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
        )}
      >
        {message.error ? (
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <span>{message.error}</span>
          </div>
        ) : (
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        )}
        
        {message.isStreaming && (
          <div className="mt-1 text-xs opacity-50">
            正在输入...
          </div>
        )}
      </div>
    </div>
  );
}; 