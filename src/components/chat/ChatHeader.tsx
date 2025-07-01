import { useState, useCallback } from 'react';
import { Session } from '../../services/sessionService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ChatHeaderProps {
  session: Session;
  onDelete: () => void;
  onUpdateTitle: (title: string) => void;
}

export const ChatHeader = ({ session, onDelete, onUpdateTitle }: ChatHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(session.title);

  const handleTitleSubmit = useCallback(() => {
    if (title.trim() && title !== session.title) {
      onUpdateTitle(title);
    } else {
      setTitle(session.title);
    }
    setIsEditing(false);
  }, [title, session.title, onUpdateTitle]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTitle(session.title);
    }
  }, [handleTitleSubmit, session.title]);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
              className="w-full"
              autoFocus
            />
          ) : (
            <h1 
              className="text-lg font-semibold text-gray-900 dark:text-white truncate cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              {session.title}
            </h1>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            重命名
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:text-red-600"
          >
            删除
          </Button>
        </div>
      </div>
    </div>
  );
};