import express from 'express';
import db from './db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// 验证 JWT 中间件
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// 添加消息
router.post('/messages', authenticate, (req, res) => {
  try {
    const { sessionId, message } = req.body;
    db.run(
      'INSERT INTO messages (user_id, session_id, content) VALUES (?, ?, ?)',
      [req.userId, sessionId, message],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).send();
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取会话消息
router.get('/messages/:sessionId', authenticate, (req, res) => {
  try {
    db.all(
      'SELECT * FROM messages WHERE user_id = ? AND session_id = ?',
      [req.userId, req.params.sessionId],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(rows);
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;