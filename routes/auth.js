const express = require('express');
const router = express.Router();
const db = require('../dataBase/db');
const bcrypt = require('bcrypt');
// 注册
router.post('/register', async (req, res) => {
	const { username, password, email } = req.body;
	if(!username || !password || !email)
		return res.status(400).json({
			message : '用户名、邮箱和密码不能为空！'
		})
	try {
		const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
		// 不要用格式化字符串

		if(rows.length)
			return res.status(400).json({
				message : '用户名已存在'
			})
		
		const saltRounds = 10
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		await db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
										[username, hashedPassword, email]);
		res.json({
			message : '注册成功!'
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			message : '服务器错误'
		})
	}
});

// 登录
router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	if(!username || !password)
		return res.status(400).json({
			message : "用户名和密码不能为空！"
		})
	try {
		const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
		if(!rows.length)
			return res.status(400).json({
				message : "用户名不存在！"
			})
		const user = rows[0];
		console.log(user);
		const match = await bcrypt.compare(password, user.password);
		if(!match)
			return res.status(400).json({
				message : "密码错误！"
			})
		res.json({
			message : "登录成功"
		})
	} catch (e) {
		console.log(e);
		res.status(500).json({
			message : "服务器错误"
		})
	}
});

module.exports = router;
