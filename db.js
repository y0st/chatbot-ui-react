import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join as pathJoin } from 'path';

// 获取当前模块的文件路径
const __filename = fileURLToPath(import.meta.url);
// 获取当前模块所在的目录
const __dirname = dirname(__filename);

// 数据库文件路径
const dbPath = pathJoin(__dirname, 'chatbot.db');

// 初始化数据库
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // 创建会话表
    db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        workspace_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_message TEXT
      )
    `);

    // 创建消息表
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
      )
    `);

    // 创建索引
    db.run('CREATE INDEX IF NOT EXISTS idx_sessions_user_workspace ON sessions(user_id, workspace_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id)');
  }
});

// ES 模块默认导出
export default db;