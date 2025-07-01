import { useCallback, useMemo } from 'react';
import { useChatContext } from '../../context/chat-context';
import { ChatMessage } from '../../types/chat';

export const useAuth = () => {
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

      try {
        // 模拟API调用，实际项目中应替换为真实API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content, sessionId: currentSessionId })
        });

        if (!response.ok) {
          throw new Error('Failed to get response from server');
        }

        const data = await response.json();
        
        // 添加AI回复
        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          content: data.response,
          role: 'assistant',
          createdAt: new Date()
        };
        addMessage(currentSessionId, assistantMessage);
      } catch (error: any) {
        console.error('Error sending message:', error);
        
        // 添加错误消息
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          content: `Error: ${error.message || 'Something went wrong'}`,
          role: 'system',
          createdAt: new Date(),
          error: error.message
        };
        addMessage(currentSessionId, errorMessage);
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
        // 实际项目中需要从状态中删除这条消息
        console.log('Regenerating response for:', lastUserMessage.content);
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
    regenerateResponse
  };
};