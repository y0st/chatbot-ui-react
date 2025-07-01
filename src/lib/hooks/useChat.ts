// src/lib/hooks/useChat.tsx

import { useCallback, useMemo, useState } from 'react';
import { useChatContext } from '../../context/chat-context';
import { ChatMessage } from '../../types/chat';
import { sendMessageToAI, streamMessageFromAI } from '../api/ChatApi';

export const useChat = () => {
  const {
    sessions,
    currentSessionId,
    addMessage,
    createSession,
    deleteSession,
    setCurrentSession
  } = useChatContext();

  // 获取当前会话
  const currentSession = useMemo(() => {
    return currentSessionId
      ? sessions.find(session => session.id === currentSessionId)
      : null;
  }, [sessions, currentSessionId]);

  // 获取当前会话的消息
  const messages = useMemo(() => {
    return currentSession?.messages || [];
  }, [currentSession]);

  // 发送消息状态
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 发送消息
  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentSessionId || !content.trim()) return;

      // 添加用户消息
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        role: 'user',
        createdAt: new Date()
      };
      
      addMessage(currentSessionId, userMessage);
      setIsLoading(true);
      setError(null);

      let controller: AbortController | null = null;
      let timeoutId: NodeJS.Timeout | null = null;

      try {
        // 创建 AbortController 用于取消请求
        controller = new AbortController();
        
        // 添加超时处理 (30秒)
        timeoutId = setTimeout(() => {
          controller?.abort();
          throw new Error('Request timed out');
        }, 30000);

        // 使用 AbortController 信号
        const response = await sendMessageToAI(content, currentSessionId);
        console.log('API 响应:', response); // 检查响应内容
        
        // 添加AI回复
        addMessage(currentSessionId, {
          ...response,
          id: crypto.randomUUID(), // 确保每个消息有唯一ID
          createdAt: new Date()
        });
      } catch (error: any) {
        console.error('Error sending message:', error);
        
        // 处理不同类型的错误
        let errorMessage = 'Failed to send message';
        if (error.name === 'AbortError') {
          errorMessage = 'Request was aborted';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        // 添加错误消息
        const errorMessageObj: ChatMessage = {
          id: crypto.randomUUID(),
          content: `Error: ${errorMessage}`,
          role: 'system',
          createdAt: new Date(),
          error: errorMessage
        };
        
        addMessage(currentSessionId, errorMessageObj);
        setError(errorMessage);
      } finally {
        // 清理资源
        if (timeoutId) clearTimeout(timeoutId);
        setIsLoading(false);
      }
    },
    [currentSessionId, addMessage]
  );

  // 重新生成回复
  const regenerateResponse = useCallback(() => {
    if (!currentSessionId || messages.length === 0) return;
    
    // 获取最后一条用户消息
    const lastUserMessage = messages
      .filter(msg => msg.role === 'user')
      .pop();
      
    if (lastUserMessage) {
      // 删除最后一条AI消息
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        console.log('Regenerating response for:', lastUserMessage.content);
        
        // 实际项目中需要从状态中删除这条消息
        // 这里我们只是重新发送用户消息，让API生成新的回复
        
        // 临时实现：移除最后一条消息（实际项目需要在上下文中实现删除功能）
        // 例如：removeLastMessage(currentSessionId);
        
        // 重新发送用户消息
        sendMessage(lastUserMessage.content);
      }
    }
  }, [currentSessionId, messages, sendMessage]);

  return {
    sessions,
    currentSession,
    messages,
    sendMessage,
    createSession,
    deleteSession,
    setCurrentSession,
    regenerateResponse,
    isLoading,
    error
  };
};