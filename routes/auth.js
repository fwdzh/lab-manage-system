const express = require('express');
const router = express.Router();
const db = require('../dataBase/db');

// 注册
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: '用户名或密码不能为空' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) return res.status(400).json({ message: '用户名已存在' });

    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    res.json({ message: '注册成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: '用户名或密码不能为空' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (rows.length === 0) return res.status(400).json({ message: '用户名或密码错误' });

    res.json({ message: '登录成功', user: { id: rows[0].id, username: rows[0].username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
