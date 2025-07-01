import { useState, useCallback, KeyboardEvent } from 'react';
import { Button } from '../ui/Button';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, isLoading, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = useCallback(() => {
    if (message.trim() && !isLoading && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  }, [message, isLoading, disabled, onSend]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className="relative">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入消息..."
        disabled={isLoading || disabled}
        className="w-full resize-none rounded-lg border border-gray-200 bg-white p-4 pr-12 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
        rows={1}
        style={{
          minHeight: '44px',
          maxHeight: '200px'
        }}
      />
      
      <Button
        onClick={handleSubmit}
        disabled={!message.trim() || isLoading || disabled}
        className="absolute bottom-2 right-2"
        size="sm"
      >
        发送
      </Button>
    </div>
  );
};