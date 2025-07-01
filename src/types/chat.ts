// src/types/chat.ts

export interface ChatMessage {
  id: string;             // 消息唯一标识
  content: string;        // 消息内容
  role: 'user' | 'assistant' | 'system'; // 消息发送者角色
  createdAt: Date;        // 消息创建时间
  isStreaming?: boolean;  // 是否正在流式接收
  error?: string;         // 错误信息（如果有）
}

export interface ChatSession {
  id: string;             // 会话ID
  title: string;          // 会话标题
  messages: ChatMessage[]; // 会话消息列表
  createdAt: Date;        // 会话创建时间
  updatedAt: Date;        // 会话更新时间
}