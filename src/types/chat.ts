// src/types/chat.ts

export interface ChatMessage {
  id: string;             // 消息唯一标识
  content: string;        // 消息内容
  role: 'user' | 'assistant' | 'system'; // 消息发送者角色
  createdAt: Date;        // 消息创建时间
  isStreaming?: boolean;  // 是否正在流式接收
  error?: string;         // 错误信息（如果有）
}

// 添加 Openrouter API 需要的消息类型定义
export interface OpenrouterMessage {
  role: string; // 消息角色（如 'user', 'assistant' 等）
  content: string; // 消息内容
}

// 添加 Openrouter API 响应类型定义
export interface OpenrouterResponse {
  choices: Array<{
    message: {
      content: string; // AI 生成的回复内容
    };
  }>;
}

export interface ChatSession {
  id: string;             // 会话ID
  title: string;          // 会话标题
  messages: ChatMessage[]; // 会话消息列表
  createdAt: Date;        // 会话创建时间
  updatedAt: Date;        // 会话更新时间
}