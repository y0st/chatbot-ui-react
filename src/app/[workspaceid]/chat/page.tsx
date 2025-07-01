// app/[workspaceid]/chat/page.tsx

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Chat } from '@/components/chat/Chat';
import { useWorkspace } from '@/lib/hooks/useWorkspace';
import { useAuth } from '@/lib/hooks/useAuth';

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get('workspaceId') || router.query.workspaceid as string;
  const { currentWorkspace, fetchWorkspace } = useWorkspace();
  const { user } = useAuth();

  // 加载工作区数据
  useEffect(() => {
    if (!user) {
      router.push('/login'); // 未登录用户重定向到登录页
    } else if (workspaceId && !currentWorkspace) {
      fetchWorkspace(workspaceId);
    }
  }, [user, workspaceId, currentWorkspace, router, fetchWorkspace]);

  // 如果工作区不存在，重定向到创建页面
  useEffect(() => {
    if (workspaceId && currentWorkspace === null) {
      router.push(`/${workspaceId}/settings`);
    }
  }, [workspaceId, currentWorkspace, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 顶部导航栏 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  ChatBot UI
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {/* 导航链接 */}
                <a 
                  href="#" 
                  className="border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium text-blue-500 dark:text-blue-400"
                >
                  Chat
                </a>
                <a 
                  href="#" 
                  className="border-transparent hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300 px-1 pt-1 border-b-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Settings
                </a>
              </div>
            </div>
            <div className="flex items-center">
              {/* 用户菜单 */}
              <div className="ml-3 relative">
                <div>
                  <button 
                    type="button" 
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <img 
                      className="h-8 w-8 rounded-full object-cover" 
                      src={user?.avatarUrl || 'https://picsum.photos/200'} 
                      alt="User profile" 
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex h-[calc(100vh-4rem)]">
        {/* 使用我们创建的Chat组件 */}
        <Chat />
      </main>
    </div>
  );
}