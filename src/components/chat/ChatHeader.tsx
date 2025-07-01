import { useState, useCallback } from 'react';
import { 
  ChevronLeftIcon, 
  EllipsisVerticalIcon, 
  PencilIcon, 
  TrashIcon,
  XMarkIcon 
} from '@heroicons/react/24/solid';

export const ChatHeader = ({ 
  chat, 
  onTitleChange,
  onDeleteChat,
  isMobile
}: {
  chat: { id: string; title: string };
  onTitleChange: (title: string) => void;
  onDeleteChat: () => void;
  isMobile: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(chat.title);
  const [showMenu, setShowMenu] = useState(false);
  
  const handleEditTitle = useCallback(() => {
    setIsEditing(true);
    setEditedTitle(chat.title);
  }, [chat.title]);
  
  const handleSaveTitle = useCallback(() => {
    if (editedTitle.trim() && editedTitle !== chat.title) {
      onTitleChange(editedTitle.trim());
    }
    setIsEditing(false);
  }, [editedTitle, chat.title, onTitleChange]);
  
  const handleCancelEdit = useCallback(() => {
    setEditedTitle(chat.title);
    setIsEditing(false);
  }, [chat.title]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  }, [handleSaveTitle, handleCancelEdit]);
  
  return (
    <div className="border-b border-gray-200 p-2 flex items-center justify-between bg-white transition-colors duration-300">
      <div className="flex items-center space-x-3">
        {isMobile && (
          <button 
            onClick={() => document.body.classList.remove('overflow-hidden')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        )}
        
        {isEditing ? (
          <div className="flex-grow">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <div className="flex space-x-2 mt-1">
              <button
                onClick={handleSaveTitle}
                className="text-xs text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded transition-colors duration-200"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            {/* <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
              <span className="font-bold">{chat.title.charAt(0).toUpperCase()}</span>
            </div> */}
            <h2 className="text-base font-medium text-gray-900 truncate max-w-xs md:max-w-none ml-4">
              {chat.title}
            </h2>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={handleEditTitle}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-500 dark:text-gray-400"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-500 dark:text-gray-400"
          >
            <EllipsisVerticalIcon className="h-5 w-5" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-10">
              <div className="py-1">
                <button
                  onClick={onDeleteChat}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center"
                >
                  <TrashIcon className="mr-2 h-4 w-4" /> Delete Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};