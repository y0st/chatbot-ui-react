import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/lib/hooks/useChat';
import { PaperAirplaneIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

export const ChatInput = ({ 
  onSend,
  isLoading,
  disabled = false
}: {
  onSend: (message: string) => void
  isLoading: boolean
  disabled?: boolean
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { settings } = useChat();
  
  // 处理提交
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    onSend(inputValue);
    setInputValue('');
  };
  
  // 处理按键
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!inputValue.trim() || isLoading) return;
      
      onSend(inputValue);
      setInputValue('');
    }
    
    // 动态调整高度
    if (textareaRef.current) {
      textareaRef.current.style.overflow = 'hidden'; // 禁用滚动条
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };
  
  // 自动调整高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.overflow = 'hidden'; // 禁用滚动条
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {/* 输入区域容器 */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type a message... (Press Enter to send, Shift+Enter for newline)"
          // className={`w-full border border-gray-300 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-200 bg-white text-gray-800 ${
          //   isFocused ? 'ring-2 ring-blue-400' : ''
          // } ${
          //   disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''
          // }`}
          className={`w-full border border-gray-300 rounded-lg p-3 pr-12 focus:outline-none resize-none transition-all duration-200 bg-white text-gray-800 ${
            disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={disabled || isLoading}
          rows={1}
        />
        
        <button
          type="submit"
          className={`absolute right-3 top-1/2 -translate-y-4/7 bg-transparent hover:bg-blue-50 text-blue-500 hover:text-blue-700 p-2 rounded-full transition-all duration-200 ${
            isLoading ? 'animate-pulse' : ''
          } ${
            disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={disabled || isLoading || !inputValue.trim()}
        >
          {isLoading ? (
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
          ) : (
            <PaperAirplaneIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {/* 快捷键提示
      <div className="text-xs text-gray-500 mt-2 flex justify-between">
        <div>
          {settings?.enterSend ? 'Press Enter to send' : 'Press Enter for newline'}
          {settings?.enterSend ? '' : ', Shift+Enter to send'}
        </div>
        {isLoading && (
          <div className="text-blue-500">
            <ArrowPathIcon className="inline h-4 w-4 mr-1 animate-pulse" /> Typing...
          </div>
        )}
      </div> */}
    </form>
  );
};