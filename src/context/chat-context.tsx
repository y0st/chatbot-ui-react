// src/context/chat-context.ts

import { createContext, useContext, useState, useCallback } from 'react';
import { ChatMessage, ChatSession } from '@/types/chat';
import axios from 'axios';

interface ChatContextType {
  sessions: Chat[];
  currentSessionId: string | null;
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
  const addMessage = useCallback(async (sessionId: string, message: ChatMessage) => {
    try {
      // 修正：传递完整消息对象（包含id、role、createdAt等字段）
      await axios.post('http://localhost:3001/api/chat/messages', {
        sessionId,
        message: {
          id: message.id,
          content: message.content,
          role: message.role,
          createdAt: message.createdAt.toISOString() // 转换为ISO格式时间戳
        }
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
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
    } catch (error) {
      console.error('Failed to add message:', error);
    }
  }, []);

  // 创建新会话
  const createSession = useCallback(
    (id: string, title?: string) => { 
      // 优化：使用sessionId前8位作为默认标题（避免重复）
      const defaultTitle = title || `Chat-${id.slice(0, 8)}`;
      const newSession = {
        id,
        title: defaultTitle,
        messages: []
      };
      setSessions(prev => [...prev, newSession]);
      setCurrentSessionId(id);
      return newSession;
    },
    [setSessions, setCurrentSessionId]
  );
  
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

const initialState = {
  sessions: [],
  currentSessionId: null,
  addMessage: (sessionId: string, message: ChatMessage) => {},
  createSession: (title?: string) => {},
  deleteSession: (sessionId: string) => {},
  setCurrentSession: (sessionId: string | null) => {}
};