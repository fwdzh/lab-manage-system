const db = require('../dataBase/db')
const express = require('express')

const router = express.Router()

router.get('/all', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM lab_reservations')
        res.json({
            message : "获取成功",
            reservationList : result
        })
    } catch(e) {
        console.log(e)
        res.status(500).json({ message : "获取失败" })
    }
})

router.get('/user/:id', async (req, res) => {
    const userId = req.params.id
    try {
        const [result] = await db.query('SELECT * FROM lab_reservations WHERE user_id = ?', [userId])
        res.json({
            userId : userId,
            message : "查询成功！",
            userReservationList: result
        })
    } catch(e) {
        console.log(e)
        res.status(500).json({ message : "查询失败！" })
    }
})

router.get('/lab/:id', async (req, res) => {
    const labId = req.params.id
    try {
        const [result] = await db.query('SELECT * FROM lab_reservations WHERE lab_id = ?', [labId])
        res.json({
            labId : labId,
            message : "查询成功！",
            labReservationList: result
        })
    } catch(e) {
        console.log(e)
        res.status(500).json({ message : "查询失败！" })
    }
})

router.post('/add', async (req, res) => {
    const { user_id, lab_id, status, start_time, end_time, note } = req.body

    if(!user_id || !lab_id){
        return res.status(400).json({ message : "用户 id 和实验室 id 不能为空！" })
    }

    try {
        const [result] = await db.query('SELECT id FROM labs WHERE id = ? and status = 1', [lab_id])
        if(!result.length){
            return res.status(400).json({ message : "实验室不存在或不可预约！" })
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({ message : "预约失败！" })
    }

    try {
        const [result] = await db.query('SELECT id FROM users WHERE id = ?', [user_id])
        if(!result.length){
            return res.status(400).json({ message : "用户不存在！" })
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({ message : "预约失败！" })
    }

    if(!start_time || !end_time){
        return res.status(400).json({ message : "开始结束时间不能为空！" })
    }

    const data = { user_id, lab_id, status, start_time, end_time, note }
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
    console.log(keys, placeholders, values)
    console.log(placeholders.join(','))
    try {
        await db.query(`INSERT INTO lab_reservations (${keys.join(',')}) VALUES (${placeholders.join(',')})`, values)
        res.json({ message : "预约成功！" })
    } catch(e) {
        console.log(e)
        res.status(500).json({ message : "预约失败！" })
    }

})

router.delete('/delete/:id', async (req, res) => {
    const reserveId = req.params.id

    try {
        const [result] = await db.query('DELETE FROM lab_reservations WHERE id = ?', [reserveId])
        if(result.affectedRows)
            res.json({ message : "删除成功！" })
        else
            res.json({ message : "删除失败！" })
    } catch(e) {
        console.log(e)
        res.status(400).json({ message : "删除失败！" })
    }
})

module.exports = router