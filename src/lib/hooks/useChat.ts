// src/lib/hooks/useChat.tsx

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './useAuth';
import { ChatMessage } from '../../types/chat';
import type { Session, Message } from '../../services/sessionService';

const STORAGE_KEY = 'chat-sessions';

// 将数据库消息转换为聊天消息
const convertDbMessageToChatMessage = (dbMessage: Message): ChatMessage => ({
  id: dbMessage.id,
  content: dbMessage.content,
  role: dbMessage.role,
  createdAt: new Date(dbMessage.createdAt)
});

// 从本地存储加载会话
const loadSessionsFromStorage = (): Session[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// 保存会话到本地存储
const saveSessionsToStorage = (sessions: Session[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

// 定义 useAuth hook 的返回类型
interface AuthUser {
  id: string;
  // 其他用户属性...
}

interface AuthContext {
  user: AuthUser | null;
  // 其他认证相关属性...
}

export const useChat = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取当前会话
  const currentSession = useMemo(() => {
    return currentSessionId
      ? sessions.find(session => session.id === currentSessionId)
      : null;
  }, [sessions, currentSessionId]);

  // 获取当前会话的消息
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 加载用户的所有会话
  const loadSessions = useCallback(async (workspaceId: string) => {
    if (!user?.id) return;
    
    try {
      const userSessions = loadSessionsFromStorage();
      setSessions(userSessions);
    } catch (err) {
      console.error('加载会话失败:', err);
      setError('加载会话失败');
    }
  }, [user?.id]);

  // 加载会话消息
  const loadSessionMessages = useCallback(async (sessionId: string) => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        const chatMessages = (session.messages || []).map(convertDbMessageToChatMessage);
        setMessages(chatMessages);
      }
    } catch (err) {
      console.error('加载消息失败:', err);
      setError('加载消息失败');
    }
  }, [sessions]);

  // 创建新会话
  const createSession = useCallback(async (workspaceId: string, title: string = '新会话') => {
    if (!user?.id) return null;
    
    try {
      const newSession: Session = {
        id: crypto.randomUUID(),
        title,
        workspaceId,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      };

      const updatedSessions = [newSession, ...sessions];
      setSessions(updatedSessions);
      saveSessionsToStorage(updatedSessions);
      setCurrentSessionId(newSession.id);
      setMessages([]);
      return newSession;
    } catch (err) {
      console.error('创建会话失败:', err);
      setError('创建会话失败');
      return null;
    }
  }, [user?.id, sessions]);

  // 添加消息到会话
  const addMessage = useCallback(async (sessionId: string, message: ChatMessage) => {
    try {
      const updatedSessions = sessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: [...(session.messages || []), {
              id: message.id,
              sessionId,
              role: message.role,
              content: message.content,
              createdAt: message.createdAt.toISOString()
            }],
            updatedAt: new Date().toISOString()
          };
        }
        return session;
      });

      setSessions(updatedSessions);
      saveSessionsToStorage(updatedSessions);
      setMessages(prev => [...prev, message]);
    } catch (err) {
      console.error('添加消息失败:', err);
      setError('添加消息失败');
    }
  }, [sessions]);

  // 删除会话
  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      const updatedSessions = sessions.filter(session => session.id !== sessionId);
      setSessions(updatedSessions);
      saveSessionsToStorage(updatedSessions);
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('删除会话失败:', err);
      setError('删除会话失败');
    }
  }, [sessions, currentSessionId]);

  // 更新会话标题
  const updateSessionTitle = useCallback(async (sessionId: string, title: string) => {
    try {
      const updatedSessions = sessions.map(session => {
        if (session.id === sessionId) {
          return { ...session, title, updatedAt: new Date().toISOString() };
        }
        return session;
      });

      setSessions(updatedSessions);
      saveSessionsToStorage(updatedSessions);
    } catch (err) {
      console.error('更新会话标题失败:', err);
      setError('更新会话标题失败');
    }
  }, [sessions]);

  // 初始化时加载会话
  useEffect(() => {
    const storedSessions = loadSessionsFromStorage();
    setSessions(storedSessions);
  }, []);

  // 当当前会话改变时加载消息
  useEffect(() => {
    if (currentSessionId) {
      loadSessionMessages(currentSessionId);
    } else {
      setMessages([]);
    }
  }, [currentSessionId, loadSessionMessages]);

  return {
    sessions,
    currentSession,
    currentSessionId,
    messages,
    isLoading,
    error,
    loadSessions,
    createSession,
    addMessage,
    deleteSession,
    setCurrentSession: setCurrentSessionId,
    updateSessionTitle
  };
};