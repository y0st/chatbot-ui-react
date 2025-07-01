// src/lib/api/mockChatApi.ts

import { ChatMessage } from '@/types/chat';

// 模拟API延迟（毫秒）
const API_DELAY = 800;

// 模拟API调用，返回固定回复"Hi"
export const sendMessageToAI = async (
  message: string,
  sessionId?: string
): Promise<ChatMessage> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, API_DELAY));
  
  // 默认回复
  let responseContent = "Hi! I'm an **AI assistant**. How can I help you today?";

  // 返回固定回复
  return {
    id: crypto.randomUUID(),
    content: responseContent,
    role: 'assistant',
    createdAt: new Date(),
    isStreaming: false
  };
};

// 模拟流式API调用
export const streamMessageFromAI = async function* (
  message: string,
  sessionId?: string
): AsyncGenerator<string, void, unknown> {
  // 模拟打字效果，逐个字符返回"Hi"
  const response = "Hi";
  for (let i = 0; i < response.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 100));
    yield response[i];
  }
};