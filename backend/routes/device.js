const db = require('../dataBase/db')
const express = require('express')

const router = express.Router()

router.post('/add', async(req, res) => {
    const { name, model, lab_id, status, location,
          purchase_time, price, description } = req.body;
    if(!name){
        return res.status(400).json({ message : "设备名不能为空！" })
    }
    const data = {
        name, model, lab_id, status, location,
        purchase_time, price, description }
    const keys = []
    const placeholders = []
    const values = []
    

    for(const key in data){
        if(data[key] !== undefined && data[key]){
            keys.push(key)
            placeholders.push('?')
            values.push(data[key])
        }
    }

    try {
        await db.query(`INSERT INTO devices (${keys.join(',')}) VALUES (${placeholders.join(',')})`, values)
        res.json({ message : "添加成功" })
    } catch(e) {
        console.log(e)
        res.status(500).json({ message : "添加失败！" })
    }
})

router.patch('/update/:id', async(req, res) => {
    const deviceId = req.params.id
    const { name, model, lab_id, status, location,
          purchase_time, price, description } = req.body;
    const data = {
        name, model, lab_id, status, location,
        purchase_time, price, description }
    const place = []
    const values = []
    

    for(const key in data){
        if(data[key] !== undefined && data[key]){
            place.push(key + " = ?")
            values.push(data[key])
        }
    }

    if(values.length === 0){
        return res.status(400).json({ message : "没有需要修改的信息" })
    }

    values.push(deviceId)

    try {
        await db.query(`UPDATE devices SET ${place} WHERE id = ?`, values)
        res.json({ message : "修改成功！" })
    } catch(e) {
        console.log(e)
        res.status(500).json({ message : "修改失败！" })
    }
})

router.get('/all', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM devices')
        res.json({ deviceList : result })
    } catch(e) {
        console.log(e)
        res.status(500).json({ message : "获取失败！" })
    }
})

router.delete('/delete/:id', async(req, res) => {
    const deviceId = req.params.id
    try {
        const [rows] = await db.query('SELECT * FROM devices WHERE id = ?', [deviceId])
        if(!rows.length)
            return res.status(400).json({ message : "要删除的设备不存在" })
        await db.query('DELETE FROM devices WHERE id = ?', [deviceId])
        res.json({ message : "删除成功！" })
    } catch(e) {
        console.log(e)
        res.status(500).json({ message : "删除失败" })
    }
})

module.exports = router