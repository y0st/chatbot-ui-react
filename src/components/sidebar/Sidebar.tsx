// src/components/sidebar/Sidebar.tsx

import React, { useState, useEffect, FC } from 'react';
import { Bars3Icon, PlusIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import SidebarContent from './SidebarContent';
import SidebarCreateButtons from './SidebarCreateButtons';
import type { Chat, Preset } from '../../types';

interface SidebarProps {
  workspaceId: string;
  sessions: Chat[]; // 使用 Chat 类型代替原来的模拟数据
  currentSessionId: string | null;
  onCreateSession: (title: string) => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

const Sidebar: FC<SidebarProps> = ({
  workspaceId,
  sessions,
  currentSessionId,
  onCreateSession,
  onSelectSession,
  onDeleteSession
}) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'presets'>('sessions');
  const [presets, setPresets] = useState<Preset[]>([]);

  // 保留预设数据获取逻辑
  useEffect(() => {
    const mockPresets: Preset[] = [
      { id: 'p1', title: '代码生成器', content: '{"model": "gpt-4", "temperature": 0.3}' },
      { id: 'p2', title: '创意写作', content: '{"model": "gpt-3.5", "temperature": 1.2}' },
      { id: 'p3', title: '问题解答', content: '{"model": "gpt-4", "temperature": 0.7}' },
    ];

    setPresets(mockPresets);
  }, []);

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-50 text-gray-800 shadow-lg overflow-y-auto`}
    >
      {/* 侧边栏头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <Bars3Icon className="h-6 w-6 text-gray-600" />
          <h2 className="text-xl font-bold text-gray-800">数据分析</h2>
        </div>
      </div>

      {/* 新建按钮区域 */}
      <SidebarCreateButtons 
        onCreateChat={(title) => onCreateSession(title)}
        onCreatePreset={() => console.log('新建预设')}
      />

      {/* 标签页切换 */}
      <Tabs 
        selectedIndex={activeTab === 'sessions' ? 0 : 1}
        onSelect={(index) => setActiveTab(index === 0 ? 'sessions' : 'presets')}
      >
        <TabList className="flex border-b border-gray-200 bg-white">
          <Tab 
            className={`flex-1 py-2 text-center ${activeTab === 'sessions' ? 'bg-gray-100 text-gray-800' : 'hover:bg-gray-100/50 text-gray-600'} transition-colors`}
          >
            会话
          </Tab>
          <Tab 
            className={`flex-1 py-2 text-center ${activeTab === 'presets' ? 'bg-gray-100 text-gray-800' : 'hover:bg-gray-100/50 text-gray-600'} transition-colors`}
          >
            案例
          </Tab>
        </TabList>

        {/* 会话内容区域 */}
        <TabPanel>
          <SidebarContent 
            items={sessions}
            activeId={currentSessionId}
            onItemClick={onSelectSession}
            itemType="sessions"
            onDeleteItem={onDeleteSession}
          />
        </TabPanel>

        {/* 预设内容区域 */}
        <TabPanel>
          <SidebarContent 
            items={presets}
            activeId={null}
            onItemClick={(id) => console.log('选择预设:', id)}
            itemType="presets"
            onDeleteItem={(id) => setPresets(presets.filter(preset => preset.id !== id))}
          />
        </TabPanel>
      </Tabs>

      {/* 底部设置 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <button 
          className="w-full flex items-center justify-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-700"
        >
          <Cog6ToothIcon className="h-5 w-5 text-gray-500" />
          <span>设置</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;