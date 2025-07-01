// src/context/chat-context.ts

import { createContext, useContext, useState, useCallback } from 'react';
import { ChatMessage, ChatSession } from '@/types/chat';

interface ChatContextValue {
  sessions: ChatSession[];        // 所有聊天会话
  currentSessionId: string | null; // 当前选中的会话ID
  addMessage: (sessionId: string, message: ChatMessage) => void;
  createSession: (title?: string) => void;
  deleteSession: (sessionId: string) => void;
  setCurrentSession: (sessionId: string | null) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // 添加消息到会话
  const addMessage = useCallback((sessionId: string, message: ChatMessage) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? {
              ...session,
              messages: [...session.messages, message],
              updatedAt: new Date()
            }
          : session
      )
    );
  }, []);

  // 创建新会话
  const createSession = (id: string, title: string) => {
    const newSession = {
      id, // 使用传入的 id 作为会话ID
      title,
      messages: []
    };
    
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(id);
    return newSession;
  };
  
  // 删除会话
  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  }, [currentSessionId]);

  // 设置当前会话
  const setCurrentSession = useCallback((sessionId: string | null) => {
    setCurrentSessionId(sessionId);
  }, []);

  const value = {
    sessions,
    currentSessionId,
    addMessage,
    createSession,
    deleteSession,
    setCurrentSession
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};