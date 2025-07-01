// src/pages/ChatPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../lib/hooks/useChat';
import { useAuth } from '../lib/hooks/useAuth';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatMessages } from '../components/chat/ChatMessages';
import { ChatInput } from '../components/chat/ChatInput';
import Sidebar from '../components/sidebar/Sidebar';
import Loader from '../components/ui/Loader';

const ChatPage = () => {
  const { workspaceId } = useParams();
  const { user } = useAuth();
  const { 
    sessions,
    currentSession,
    messages,
    sendMessage,
    createSession,
    deleteSession,
    setCurrentSession,
    regenerateResponse,
    isLoading
  } = useChat();
  
  const [isInitializing, setIsInitializing] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  
  // 创建消息容器的引用
  const messagesEndRef = useRef(null);
  
  // 每次消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // 滚动到消息底部的函数
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 如果指定 workspaceId 的会话不存在，创建它
  useEffect(() => {
    if (workspaceId && !sessions.some(s => s.id === workspaceId)) {
      createSession(workspaceId, `Chat in ${workspaceId}`);
      setCurrentSession(workspaceId);
    } else if (workspaceId && currentSession?.id !== workspaceId) {
      setCurrentSession(workspaceId);
    }
  }, [workspaceId, sessions, createSession, setCurrentSession, currentSession]);

  // 初始化加载状态
  useEffect(() => {
    if (workspaceId && (
      !currentSession || 
      (currentSession.id === workspaceId && sessions.some(s => s.id === workspaceId))
    )) {
      setIsInitializing(false);
    }
  }, [workspaceId, currentSession, sessions]);

  if (isInitializing) {
    return <Loader message="Loading chat session..." />;
  }

  if (!currentSession) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-6">
          <div className="text-red-500 mb-4">
            <i className="fa fa-exclamation-circle text-5xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Session not found</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Could not load chat session for {workspaceId}
          </p>
          <button
            onClick={() => {
              if (workspaceId) {
                createSession(workspaceId, `Chat in ${workspaceId}`);
                setCurrentSession(workspaceId);
              }
            }}
            className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
          >
            Create New Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* 聊天侧边栏 */}
      <Sidebar 
        workspaceId={workspaceId}
        sessions={sessions}
        currentSessionId={currentSession?.id || null}
        onCreateSession={(title) => createSession(workspaceId, title)}
        onSelectSession={setCurrentSession}
        onDeleteSession={deleteSession}
      />
      
      {/* 主聊天区域 */}
      <div className="fixed inset-y-0 right-0 left-64 flex flex-col overflow-hidden border-l border-gray-200 dark:border-gray-700">
    
        {/* 聊天头部 */}
        <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">

          <ChatHeader 
            chat={currentSession}
            onTitleChange={(title) => {
              console.log('Update title to:', title);
            }}
          />
        </div>
        
        {/* 聊天内容容器 - 添加最大宽度和居中 */}
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full pt-[64px]">
          {/* 可滚动的消息区域 - 使用 flex-1 占满剩余空间 */}
          <div className="flex-1 overflow-y-auto bg-white p-4 md:p-6 lg:p-8">
            {messages.length > 0 ? (
              <ChatMessages 
                messages={messages}
                isLoading={isLoading}
                onRegenerate={regenerateResponse}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6 mx-auto">
                    <i className="fa fa-comment text-3xl text-blue-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Start a conversation</h2>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Type a message below to start chatting with the AI
                  </p>
                </div>
              </div>
            )}
            
            {/* 添加滚动标记元素 */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* 固定的输入区域 - 使用固定高度，不参与滚动 */}
          <div className="border-t  p-4 md:p-6 bg-white dark:bg-gray-800">
            <ChatInput 
              onSend={sendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;