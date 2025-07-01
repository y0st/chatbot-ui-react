import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接
const dbPath = join(__dirname, '..', 'data', 'chatbot.db');
let db;

async function initDb() {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // 创建表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_message TEXT
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user_workspace ON sessions(user_id, workspace_id);
    CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);
  `);
}

// API 路由
// 创建会话
app.post('/api/sessions', async (req, res) => {
  try {
    const { title, workspaceId, userId } = req.body;
    const sessionId = uuidv4();
    
    await db.run(
      `INSERT INTO sessions (id, title, workspace_id, user_id) 
       VALUES (?, ?, ?, ?)`,
      [sessionId, title, workspaceId, userId]
    );

    const session = {
      id: sessionId,
      title,
      workspaceId,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.json(session);
  } catch (error) {
    console.error('创建会话失败:', error);
    res.status(500).json({ error: '创建会话失败' });
  }
});

// 获取用户的所有会话
app.get('/api/sessions', async (req, res) => {
  try {
    const { userId, workspaceId } = req.query;
    const sessions = await db.all(
      `SELECT * FROM sessions 
       WHERE user_id = ? AND workspace_id = ?
       ORDER BY updated_at DESC`,
      [userId, workspaceId]
    );
    res.json(sessions);
  } catch (error) {
    console.error('获取会话列表失败:', error);
    res.status(500).json({ error: '获取会话列表失败' });
  }
});

// 获取单个会话
app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await db.get(
      'SELECT * FROM sessions WHERE id = ?',
      [sessionId]
    );

    if (!session) {
      return res.status(404).json({ error: '会话不存在' });
    }

    const messages = await db.all(
      'SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC',
      [sessionId]
    );

    res.json({ session, messages });
  } catch (error) {
    console.error('获取会话详情失败:', error);
    res.status(500).json({ error: '获取会话详情失败' });
  }
});

// 添加消息
app.post('/api/sessions/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { role, content } = req.body;
    const messageId = uuidv4();

    await db.run(
      `INSERT INTO messages (id, session_id, role, content)
       VALUES (?, ?, ?, ?)`,
      [messageId, sessionId, role, content]
    );

    await db.run(
      `UPDATE sessions 
       SET updated_at = CURRENT_TIMESTAMP,
           last_message = ?
       WHERE id = ?`,
      [content, sessionId]
    );

    const message = {
      id: messageId,
      sessionId,
      role,
      content,
      createdAt: new Date().toISOString()
    };

    res.json(message);
  } catch (error) {
    console.error('添加消息失败:', error);
    res.status(500).json({ error: '添加消息失败' });
  }
});

// 删除会话
app.delete('/api/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await db.run('DELETE FROM sessions WHERE id = ?', [sessionId]);
    res.status(204).send();
  } catch (error) {
    console.error('删除会话失败:', error);
    res.status(500).json({ error: '删除会话失败' });
  }
});

// 更新会话标题
app.patch('/api/sessions/:sessionId/title', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;
    
    await db.run(
      `UPDATE sessions 
       SET title = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, sessionId]
    );

    res.status(200).json({ title });
  } catch (error) {
    console.error('更新会话标题失败:', error);
    res.status(500).json({ error: '更新会话标题失败' });
  }
});

// 启动服务器
initDb().then(() => {
  app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
  });
}).catch(error => {
  console.error('数据库初始化失败:', error);
  process.exit(1);
}); 