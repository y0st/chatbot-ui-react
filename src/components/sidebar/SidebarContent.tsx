// src/components/sidebar/SidebarContent.tsx

import React from 'react';
import { TrashIcon, ChatBubbleLeftRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';

interface Item {
  id: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
  content?: string;
}

interface SidebarContentProps {
  items?: Item[]; // 标记为可选参数
  activeId: string | null;
  onItemClick: (id: string) => void;
  itemType: 'sessions' | 'presets';
  onDeleteItem: (id: string) => void;
}

const SidebarContent = ({
  items = [], // 设置默认值为空数组
  activeId,
  onItemClick,
  itemType,
  onDeleteItem
}: SidebarContentProps) => {
  return (
    <div className="py-2">
      {items.length > 0 ? ( // 安全检查
        items.map((item) => {
          const isActive = activeId === item.id;
          const bgColor = isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100';
          const iconColor = isActive ? 'text-blue-500' : 'text-gray-400';
          
          return (
            <div 
              key={item.id}
              className={`flex items-center justify-between p-2 rounded-md ${bgColor} transition-colors duration-150 cursor-pointer`}
              onClick={() => onItemClick(item.id)}
            >
              <div className="flex items-center space-x-3 truncate">
                {/* 根据 itemType 显示不同的图标 */}
                {/* <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  itemType === 'sessions' ? ChatBubbleLeftRightIcon : 'bg-green-100'
                }`}>
                  <i className={`fa ${itemType === 'sessions' ? 'fa-comments' : 'fa-lightbulb'} ${iconColor}`} />
                </div> */}
                <div className="flex items-center space-x-3"> {/* 添加间距 */}
                {/* 根据类型显示不同图标 */}
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
                  {itemType === 'sessions' && item.updatedAt && (
                    <p className="text-xs text-gray-500">{formatDate(item.updatedAt)}</p>
                  )}
                </div>
              </div>

              

              {/* <button
                className="p-1 rounded-full hover:bg-gray-200 text-gray-400 transition-colors opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation(); // 阻止事件冒泡到父元素
                  onDeleteItem(item.id);
                }}
              >
                <TrashIcon className="h-4 w-4" />
              </button> */}

              <button 
                className="p-1 text-gray-400 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.id);
                }}
              >
                <TrashIcon className="h-4 w-4" /> {/* 使用 Heroicons 垃圾桶图标 */}
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

// 辅助函数：格式化日期
const formatDate = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 如果是今天
  if (diff < 24 * 60 * 60 * 1000) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  
  // 如果是昨天
  if (diff < 48 * 60 * 60 * 1000 && date.getDate() === now.getDate() - 1) {
    return '昨天';
  }
  
  // 否则返回日期
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
};

export default SidebarContent;