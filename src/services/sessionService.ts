import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = 'http://localhost:3001/api';

export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface Session {
  id: string;
  title: string;
  workspaceId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  messages?: Message[];
}

class SessionService {
  // 创建新会话
  async createSession(title: string, workspaceId: string, userId: string): Promise<Session> {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, workspaceId, userId }),
    });

    if (!response.ok) {
      throw new Error('创建会话失败');
    }

    return response.json();
  }

  // 获取用户的所有会话
  async getSessions(userId: string, workspaceId: string): Promise<Session[]> {
    const response = await fetch(
      `${API_BASE_URL}/sessions?userId=${userId}&workspaceId=${workspaceId}`
    );

    if (!response.ok) {
      throw new Error('获取会话列表失败');
    }

    return response.json();
  }

  // 获取单个会话的详细信息（包括消息）
  async getSession(sessionId: string): Promise<{ session: Session; messages: Message[] } | null> {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('获取会话详情失败');
    }

    return response.json();
  }

  // 添加消息到会话
  async addMessage(sessionId: string, role: 'user' | 'assistant', content: string): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role, content }),
    });

    if (!response.ok) {
      throw new Error('添加消息失败');
    }

    return response.json();
  }

  // 删除会话
  async deleteSession(sessionId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('删除会话失败');
    }
  }

  // 更新会话标题
  async updateSessionTitle(sessionId: string, title: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/title`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error('更新会话标题失败');
    }
  }
}

export const sessionService = new SessionService();
export default sessionService; 