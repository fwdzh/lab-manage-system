const db = require('../dataBase/db')
const express = require('express')

const router = express.Router()
/*
添加
修改
删除
获取列表
*/
router.post('/add', async(req, res) => {
    const { name, leader, phone, email, des } = req.body
    if(!name)
        return res.status(400).json({ message : "实验室名称不能为空！" })
    try {
        const [rows] = await db.query('SELECT * FROM labs WHERE name = ?', [name])
        if(rows.length)
            return res.status(400).json({ message : "实验室名称重复！" })
        await db.query('INSERT INTO labs (name, leader, phone, email, description) VALUES (?, ?, ?, ?, ?)',[
            name,
            leader ?? null,
            phone ?? null,
            email ?? null,
            des ?? null
        ])
        res.json({ message : "添加成功！" })
    } catch(e) {
        console.log(e)
        res.status(500).json({ message : "修改失败！" })
    }
})

router.patch('/update/:id', async (req, res) => {
    const { name, leader, phone, email, des } = req.body
    const labId = req.params.id;
    try {
        if(!name && !leader && !phone && !email && !des)
            return res.status(400).json({ message : "没有需要修改的内容" })
        if(name){
            const [rows] = await db.query('SELECT * FROM labs WHERE name = ?', [name])
            if(rows.length)
                return res.status(400).json({ message : "实验室名称重复！" })
            await db.query("UPDATE labs SET name = ? WHERE id = ?", [name, labId])
        }
        if(leader){
            await db.query("UPDATE labs SET leader = ? WHERE id = ?", [leader, labId])
        }
        if(phone){
            await db.query("UPDATE labs SET phone = ? WHERE id = ?", [phone, labId])
        }
        if(email){
            await db.query("UPDATE labs SET email = ? WHERE id = ?", [email, labId])
        }
        if(des){
            await db.query("UPDATE labs SET description = ? WHERE id = ?", [des, labId])
        }
        res.json({ message : "修改成功" })
    } catch(e) {
        console.log(e);
        res.status(500).json({ message : "修改失败" })
    }
});

router.get('/all', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM labs')
        res.json({ labList : result })
    } catch(e) {
        console.log(e)
    }
})

router.delete('/delete/:id', async(req, res) => {
    const labId = req.params.id
    try {
        const [rows] = await db.query('SELECT * FROM labs WHERE id = ?', [labId])
        if(!rows.length)
            return res.status(400).json({ message : "要删除的实验室不存在" })
        await db.query('DELETE FROM labs WHERE id = ?', [labId])
        res.json({ message : "删除成功！" })
    } catch(e) {
        console.log(e)
        res.status(500).json({ message : "删除失败" })
    }
})

module.exports = router