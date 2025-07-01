// src/components/sidebar/SidebarContent.tsx

import React, { FC } from 'react';
import { ChatBubbleLeftIcon, ChatBubbleLeftRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Session } from '../../services/sessionService';
import { Preset } from '../../types';
import { formatDate } from '../../lib/utils';

type Item = Session | Preset;

interface SidebarContentProps {
  items?: Item[];
  activeId: string | null;
  onItemClick: (id: string) => void;
  itemType: 'sessions' | 'presets';
  onDeleteItem: (id: string) => void;
}

const SidebarContent: FC<SidebarContentProps> = ({
  items = [],
  activeId,
  onItemClick,
  itemType,
  onDeleteItem
}) => {
  return (
    <div className="py-2">
      {items.length > 0 ? (
        items.map((item) => {
          const isActive = activeId === item.id;
          const bgColor = isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100';
          
          return (
            <div 
              key={item.id}
              className={`flex items-center justify-between p-2 rounded-md ${bgColor} transition-colors duration-150 cursor-pointer`}
              onClick={() => onItemClick(item.id)}
            >
              <div className="flex items-center space-x-3 truncate">
                <div className="flex items-center space-x-3">
                  {itemType === 'sessions' ? (
                    <span className="h-5 w-5 text-gray-400">
                      <ChatBubbleLeftRightIcon />
                    </span>
                  ) : (
                    <span className="h-5 w-5 text-gray-400">
                      <ChatBubbleLeftIcon />
                    </span>
                  )}
                </div>

                <div className="truncate">
                  <h3 className="text-sm font-medium truncate">{item.title}</h3>
                  {itemType === 'sessions' && 'updatedAt' in item && (
                    <p className="text-xs text-gray-500">{formatDate(item.updatedAt)}</p>
                  )}
                </div>
              </div>

              <button 
                className="p-1 text-gray-400 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.id);
                }}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          );
        })
      ) : (
        <div className="p-4 text-center text-gray-500 text-sm">
          {itemType === 'sessions' ? '暂无会话' : '暂无预设'}
        </div>
      )}
    </div>
  );
};

export default SidebarContent;
