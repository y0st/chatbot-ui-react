import React, { FC } from 'react';
import { PlusIcon } from "@heroicons/react/24/solid"; // 导入 Heroicons 图标

interface SidebarCreateButtonsProps {
  onCreateChat: () => void;
}

const SidebarCreateButtons: FC<SidebarCreateButtonsProps> = ({ onCreateChat }) => {
  return (
    <div className="p-3 space-y-2 bg-white">
      <button
        className="w-full flex items-center justify-center space-x-2 p-2 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700" // 浅色按钮

        onClick={onCreateChat}
      >
        <PlusIcon className="h-4 w-4 text-gray-500" />
        <span>新建聊天</span>
      </button>
    </div>
  );
};

export default SidebarCreateButtons;