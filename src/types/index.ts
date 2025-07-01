export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  // 聊天消息内容可以在这里扩展
}

export interface Preset {
  id: string;
  title: string;
  content: string; // 可以是JSON字符串或其他格式
}  