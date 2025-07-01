import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { ChatHeader } from './ChatHeader'
import { ChatSettings } from './ChatSettings'
import { useChat } from '@/lib/hooks/useChat'
import { useChatSettings } from '@/lib/hooks/useChatSettings'
import { useAuth } from '@/lib/hooks/useAuth'
import { useWorkspace } from '@/lib/hooks/useWorkspace'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Loader } from '@/components/ui/Loader'
import { ChatEmptyState } from './ChatEmptyState'
import { ChatSidebar } from './ChatSidebar'
import { useChatSocket } from '@/lib/hooks/useChatSocket'
import { useRouter } from 'next/navigation'

export const Chat = () => {
  const { 
    sessions,
    currentSession,
    messages, 
    isLoading, 
    error,
    sendMessage, 
    createSession,
    deleteSession,
    setCurrentSession,
    updateSessionTitle,
    loadSessions
  } = useChat()
  
  const { settings, updateSettings } = useChatSettings()
  const { user } = useAuth()
  const { currentWorkspace } = useWorkspace()
  const { isConnected } = useChatSocket()
  const router = useRouter()
  
  const isMobile = window.innerWidth < 768

  interface ChatProps {
    workspaceId: string;
  }
  
  // 加载工作区的会话
  useEffect(() => {
    if (currentWorkspace?.id && user?.id) {
      loadSessions(currentWorkspace.id);
    }
  }, [currentWorkspace?.id, user?.id, loadSessions]);

  // 处理发送消息
  const handleSend = useCallback(async (content: string) => {
    if (!currentSession?.id) {
      // 如果没有当前会话，创建一个新的
      if (currentWorkspace?.id && user?.id) {
        const newSession = await createSession(currentWorkspace.id, '新会话');
        if (newSession) {
          await sendMessage(content);
        }
      }
    } else {
      await sendMessage(content);
    }
  }, [currentSession, currentWorkspace, user, createSession, sendMessage]);

  // 处理创建新会话
  const handleNewChat = useCallback(async () => {
    if (currentWorkspace?.id && user?.id) {
      await createSession(currentWorkspace.id, '新会话');
    }
  }, [currentWorkspace, user, createSession]);

  // 处理删除会话
  const handleDeleteChat = useCallback(async (sessionId: string) => {
    await deleteSession(sessionId);
  }, [deleteSession]);

  // 处理更新会话标题
  const handleUpdateTitle = useCallback(async (sessionId: string, title: string) => {
    await updateSessionTitle(sessionId, title);
  }, [updateSessionTitle]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex flex-col h-full">
        {currentSession ? (
          <>
            <ChatHeader
              session={currentSession}
              onDelete={() => handleDeleteChat(currentSession.id)}
              onUpdateTitle={(title) => handleUpdateTitle(currentSession.id, title)}
            />
            
            <div className="flex-1 overflow-y-auto">
              <ChatMessages 
                messages={messages}
                isLoading={isLoading}
                error={error}
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 p-4 md:p-6 bg-white dark:bg-gray-800 transition-colors duration-300">
              <div className="max-w-4xl mx-auto">
                <ChatInput 
                  onSend={handleSend}
                  isLoading={isLoading}
                  disabled={!isConnected}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex justify-between items-center">
                  <div>
                    {!isConnected && (
                      <span className="text-red-500 flex items-center">
                        <i className="fa fa-exclamation-circle mr-1"></i> 未连接
                      </span>
                    )}
                    {error && (
                      <span className="text-red-500 flex items-center">
                        <i className="fa fa-exclamation-circle mr-1"></i> {error}
                      </span>
                    )}
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </>
        ) : (
          <ChatEmptyState onCreateChat={handleNewChat} />
        )}
      </div>
      
      {/* 聊天设置侧边栏 */}
      <ChatSettings />
    </div>
  )
}  