// src/pages/ChatPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../lib/hooks/useChat';
import { useAuth } from '../lib/hooks/useAuth';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatMessages } from '../components/chat/ChatMessages';
import { ChatInput } from '../components/chat/ChatInput';
import Sidebar from '../components/sidebar/Sidebar';
import { Loader } from '../components/ui/Loader';
import { Session } from '../services/sessionService';
import { ChatMessage } from '../types/chat';

const ChatPage = () => {
  const initialized = useRef(false);
  const [sessionCreated, setSessionCreated] = useState(false);
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
    isLoading
  } = useChat();
  
  const [isInitializing, setIsInitializing] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  
  // 创建消息容器的引用
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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

  // 修改会话创建逻辑
  useEffect(() => { 
    if (!workspaceId || initialized.current) return;
    
    const sessionExists = sessions.some(s => s.id === workspaceId);
    if (!sessionExists && !sessionCreated) {
      createSession(workspaceId, `Chat in ${workspaceId}`);
      setCurrentSession(workspaceId);
      setSessionCreated(true);
    } else if (sessionExists && currentSession?.id !== workspaceId) {
      setCurrentSession(workspaceId);
    }
    
    initialized.current = true;
  }, [workspaceId, sessions, createSession, setCurrentSession, sessionCreated, currentSession]);

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
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  if (!currentSession) { 
    return ( 
      <div className="flex h-screen items-center justify-center"> 
        <div className="text-center p-6"> 
          <div className="text-red-500 mb-4"> 
            <i className="fa fa-exclamation-circle text-5xl" /> 
          </div> 
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">会话未找到</h2> 
          <p className="text-gray-500 dark:text-gray-400 max-w-md"> 
            无法加载工作区 {workspaceId} 的聊天会话
          </p> 
          <button 
            onClick={() => { 
              if (workspaceId && !sessions.some(s => s.id === workspaceId) && !sessionCreated) { 
                createSession(workspaceId, `Chat in ${workspaceId}`); 
                setCurrentSession(workspaceId);
                setSessionCreated(true);
              } 
            }}
            className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200" 
          > 
            创建新会话
          </button> 
        </div> 
      </div> 
    ); 
  }

  return (
    <div className="flex h-screen">
      <Sidebar 
        show={showSidebar}
        onToggle={() => setShowSidebar(!showSidebar)}
        sessions={sessions}
        currentSessionId={currentSession.id}
        onSessionSelect={setCurrentSession}
        onCreateSession={() => workspaceId && createSession(workspaceId, '新会话')}
        onDeleteSession={deleteSession}
      />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader
          session={currentSession}
          onDelete={() => deleteSession(currentSession.id)}
          onUpdateTitle={(title: string) => {
            // 更新会话标题的逻辑
          }}
        />
        
        <div className="flex-1 overflow-y-auto">
          <ChatMessages 
            messages={messages}
            isLoading={isLoading}
            error={null}
          />
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <ChatInput 
            onSend={sendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
