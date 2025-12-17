// ./routes/user.js
const express = require('express');
const db = require('../dataBase/db');
const bcrypt = require('bcrypt')
const router = express.Router();

router.post('/add', async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email)
        return res.status(400).json({
            message: '用户名、邮箱和密码不能为空！'
        });
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        // 不要用格式化字符串

        if (rows.length)
            return res.status(400).json({
                message: '用户名已存在'
            });

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email]);
        res.json({
            message: '添加成功!'
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: '服务器错误'
        });
    }
}); // 这里要做的事情，其实和注册是完全相同的，先暂时直接贴过来吧～

router.delete('/delete', async (req, res) => {
    const { id } = req.body;
    try {
        const [result] =  await db.query('DELETE FROM users WHERE id IN (?)', [id])
        if(result.affectedRows){
            res.json({
                message: "成功删除！"
            });
        }else{
            res.status(400).json({ message: "删除失败！" })
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "删除失败"
        });
    }
});

router.patch('/update/:id', async (req, res) => {
    const { username, email, password } = req.body;
    const userId = req.params.id;
    try {
        if ('username' in req.body)
            return res.status(400).json({
                message: "不可以修改用户名"
            })
        if (!email && !password)
            return res.status(400).json({
                message: "没有需要修改的内容"
            })
        if (email)
            await db.query('UPDATE users SET email = ? WHERE id = ?', [email, userId]);
        if (password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
        }
        res.json({
            message: "修改成功"
        })
    } catch (e) {
        console.log(e);
        res.status(400).json({
            message: "修改失败"
        })
    }
});

router.get('/all', async (req, res) => {
    try {
        const [result] = await db.query('SELECT id, username, email, create_time FROM users');
        console.log(result);
        res.json({
            userList: result
        })
    } catch (e) {
        res.status(500).json({
            message: "请求数据失败"
        })
    }
});

module.exports = router;