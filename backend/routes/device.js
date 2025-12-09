const db = require('../dataBase/db')
const express = require('express')

const router = express.Router()

router.post('/add', async(req, res) => {
    
})

router.get('/all', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM devices')
        res.json({ deviceList : result })
    } catch(e) {
        console.log(e)
    }
})

router.delete('/delete/:id', async(req, res) => {
    const deviceId = req.params.id
    try {
        const [rows] = await db.query('SELECT * FROM devices WHERE id = ?', [deviceId])
        if(!rows.length)
            return res.status(400).json({ message : "要删除的设备不存在" })
        await db.query('DELETE FROM labs WHERE id = ?', [deviceId])
        res.json({ message : "删除成功！" })
    } catch(e) {
        console.log(e)
        res.status(500).json({ message : "删除失败" })
    }
})

module.exports = router