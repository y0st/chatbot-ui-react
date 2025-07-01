// src/lib/api/mockChatApi.ts

import { ChatMessage } from '@/types/chat';

// 模拟API延迟（毫秒）
const API_DELAY = 800;

// 模拟API调用，返回固定回复"Hi"
// 导入类型（如果未导入）
import { OpenrouterMessage, OpenrouterResponse } from '@/types/chat';

// 替换模拟API为真实Openrouter调用
export const sendMessageToAI = async (
  message: string,
  sessionId?: string
): Promise<ChatMessage> => {
  try {
    // 构造Openrouter需要的消息列表（假设需要历史对话，这里简化为仅当前消息）
    const openrouterMessages: OpenrouterMessage[] = [{
      role: 'user',
      content: message
    }];

    // 调用Openrouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat:free',  // 可替换为其他模型
        messages: openrouterMessages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败：${response.statusText}`);
    }

    const data: OpenrouterResponse = await response.json();
    const aiContent = data.choices[0]?.message?.content || '无有效回复';

    // 返回符合ChatMessage类型的响应
    return {
      id: crypto.randomUUID(),
      content: aiContent,
      role: 'assistant',
      createdAt: new Date(),
      isStreaming: false
    };
  } catch (error: any) {
    console.error('调用Openrouter API失败:', error);
    return {
      id: crypto.randomUUID(),
      content: `错误：${error.message || '无法获取回复'}`,
      role: 'system',
      createdAt: new Date(),
      isStreaming: false,
      error: error.message
    };
  }
};

// 模拟流式API调用
export const streamMessageFromAI = async function* (
  message: string,
  sessionId?: string
): AsyncGenerator<string, void, unknown> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
        stream: true  // 启用流式响应
      })
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error('无法获取流式响应');

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // 处理流式数据（Openrouter返回的是SSE格式）
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        // 跳过注释行
        if (line.startsWith('data: [DONE]')) break;
        if (line.startsWith('data: ')) {
          const data = line.replace('data: ', '');
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              yield content;  // 逐个字符返回
            }
          } catch (e) {
            console.error('解析流式数据失败:', e);
          }
        }
      }
    }
  } catch (error: any) {
    console.error('流式API调用失败:', error);
    yield `错误：${error.message || '流式响应中断'}`;
  }
};