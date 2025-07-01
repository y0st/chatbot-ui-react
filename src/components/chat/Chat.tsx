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
    messages, 
    isLoading, 
    currentChat, 
    sendMessage, 
    regenerateResponse,
    setCurrentChat,
    newChat,
    deleteChat,
    updateChatTitle,
    isChatEmpty
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
  
  const handleSend = useCallback(
    (message: string) => {
      if (!message.trim()) return
      sendMessage(message)
    },
    [sendMessage]
  )
  
  const handleRegenerate = useCallback(() => {
    regenerateResponse()
  }, [regenerateResponse])
  
  const handleNewChat = useCallback(() => {
    newChat()
    if (isMobile) {
      document.body.classList.remove('overflow-hidden')
    }
  }, [newChat, isMobile])
  
  const handleDeleteChat = useCallback(() => {
    if (currentChat?.id) {
      deleteChat(currentChat.id)
      if (isMobile) {
        document.body.classList.remove('overflow-hidden')
      }
    }
  }, [deleteChat, currentChat, isMobile])
  
  const handleTitleChange = useCallback(
    (title: string) => {
      if (currentChat?.id) {
        updateChatTitle(currentChat.id, title)
      }
    },
    [currentChat, updateChatTitle]
  )
  
  useEffect(() => {
    if (!currentChat && !isChatEmpty) {
      router.push(`/${currentWorkspace?.slug}/chat`)
    }
  }, [currentChat, isChatEmpty, router, currentWorkspace])
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 聊天侧边栏 */}
      <ChatSidebar 
        onNewChat={handleNewChat}
        isMobile={isMobile}
      />
      
      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentChat ? (
          <>
            {/* 聊天头部 */}
            <ChatHeader 
              chat={currentChat}
              onTitleChange={handleTitleChange}
              onDeleteChat={handleDeleteChat}
              isMobile={isMobile}
            />
            
            {/* 聊天消息区域 */}
            <Scrollbars
              className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 transition-colors duration-300"
              autoHide
              style={{ width: '100%' }}
            >
              <div className="p-4 md:p-6 max-w-4xl mx-auto">
                <ChatMessages 
                  messages={messages}
                  isLoading={isLoading}
                  onRegenerate={handleRegenerate}
                />
              </div>
            </Scrollbars>
            
            {/* 聊天输入区域 */}
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
                        <i className="fa fa-exclamation-circle mr-1"></i> Not connected
                      </span>
                    )}
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </>
        ) : (
          // 空聊天状态
          <ChatEmptyState onCreateChat={handleNewChat} />
        )}
      </div>
      
      {/* 聊天设置侧边栏 */}
      <ChatSettings />
    </div>
  )
}  