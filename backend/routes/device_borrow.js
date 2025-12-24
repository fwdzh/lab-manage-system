const db = require('../dataBase/db');
const express = require('express');

const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM device_borrow_records');
        res.json({ result: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '获取失败！' });
    }
});

router.post('/add', async (req, res) => {
    try {
        const {
            device_id,
            user_id,
            borrow_time,
            return_time = null,
            status = 0,
            remark,
        } = req.body;
        if (!device_id || !user_id || !borrow_time) {
            return res
                .status(400)
                .json({ message: '设备id、用户id和借出时间不能为空！' });
        }
        const [result] = await db.query(
            'INSERT INTO device_borrow_records (device_id, user_id, borrow_time, return_time, status, remark) VALUES (?, ?, ?, ?, ?, ?)',
            [device_id, user_id, borrow_time, return_time, status, remark]
        );
        if (result.affectedRows) {
            res.json({ message: '添加成功！' });
        } else {
            res.status(400).json({ message: '添加失败～' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '添加失败' });
    }
});

router.patch('/update/:id', async (req, res) => {
    try {
        const idx = req.params.id;
        const {
            device_id,
            user_id,
            borrow_time,
            return_time = null,
            status = 0,
            remark,
        } = req.body;
        if (!device_id || !user_id || !borrow_time) {
            return res
                .status(400)
                .json({ message: '设备id、用户id和借出时间不能为空！' });
        }
        const [result] = await db.query(
            'UPDATE device_borrow_records SET device_id = ?, user_id = ?, borrow_time = ?, return_time = ?, status = ?, remark = ? WHERE id = ?',
            [device_id, user_id, borrow_time, return_time, status, remark, idx]
        );
        if (result.affectedRows) {
            res.json({ message: '修改成功！' });
        } else {
            res.status(400).json({ message: '修改失败～' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '修改失败' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const idx = req.params.id;
        const [result] = await db.query(
            'DELETE FROM device_borrow_records WHERE id = ?',
            [idx]
        );
        if (result.affectedRows) {
            res.json({ message: '删除成功' });
        } else {
            res.status(400).json({ message: '删除失败' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '删除失败' });
    }
});

module.exports = router;
