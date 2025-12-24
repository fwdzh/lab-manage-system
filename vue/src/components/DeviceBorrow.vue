<template>
  <div>
    <h2>借用记录</h2>
    <el-button type="primary" @click="() => (dialog1 = true)"> 新增记录 </el-button>
    <el-table :data="data" style="width: 100%">
      <el-table-column label="id" prop="id" />
      <el-table-column label="设备id" prop="device_id" />
      <el-table-column label="用户id" prop="user_id" />
      <el-table-column label="借出时间" prop="borrow_time" />
      <el-table-column label="归还时间" prop="return_time" />
      <el-table-column label="创建时间" prop="created_at" />
      <el-table-column label="更新时间" prop="updated_at" />
      <el-table-column label="状态" prop="status" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button
            @click="
              () => {
                curItem = { ...scope.row }
                dialog2 = true
              }
            "
            type="primary"
            size="small"
            >编辑</el-button
          >
          <el-button @click="deleteItem(scope.row.id)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增借用记录" v-model="dialog1">
      <el-form ref="form1" status-icon :model="newItem" :rules="rules" label-width="auto">
        <el-form-item label="设备id" prop="device_id">
          <el-input v-model="newItem.device_id" placeholder="请输入设备id" />
        </el-form-item>
        <el-form-item label="用户id" prop="user_id">
          <el-input v-model="newItem.user_id" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="借出时间" prop="borrow_time">
          <el-date-picker
            v-model="newItem.borrow_time"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="MMM DD, YYYY"
            time-format="HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择借出时间"
          />
        </el-form-item>
        <el-form-item label="归还时间" prop="return_time">
          <el-date-picker
            v-model="newItem.return_time"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="MMM DD, YYYY"
            time-format="HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择归还时间"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="newItem.status" placeholder="请选择状态">
            <el-option label="借用" value="0" />
            <el-option label="归还" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="newItem.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item>
          <el-button
            @click="
              () => {
                form1.resetFields()
              }
            "
          >
            重置
          </el-button>
          <el-button type="primary" @click="addItem(form1)">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改借用记录" v-model="dialog2">
      <el-form ref="form2" status-icon :model="curItem" :rules="rules" label-width="auto">
        <el-form-item label="设备id" prop="device_id">
          <el-input v-model="curItem.device_id" placeholder="请输入设备id" />
        </el-form-item>
        <el-form-item label="用户id" prop="user_id">
          <el-input v-model="curItem.user_id" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="借出时间" prop="borrow_time">
          <el-date-picker
            v-model="curItem.borrow_time"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="MMM DD, YYYY"
            time-format="HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择借出时间"
          />
        </el-form-item>
        <el-form-item label="归还时间" prop="return_time">
          <el-date-picker
            v-model="curItem.return_time"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="MMM DD, YYYY"
            time-format="HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择归还时间"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="curItem.status" placeholder="请选择状态">
            <el-option label="借用" value="0" />
            <el-option label="归还" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="curItem.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateItem(form2)">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { formatDateTime } from '@/utils/time'
import { ElForm, ElMessage } from 'element-plus'
import { prefix } from '@/config'
const dialog1 = ref(false)
const dialog2 = ref(false)
const data = ref([])
const form1 = ref()
const form2 = ref()
const curItem = ref({
  id: '',
  device_id: '',
  user_id: '',
  borrow_time: '',
  return_time: null,
  status: '',
  remark: '',
  created_at: '',
  updated_at: '',
})
const newItem = ref({
  id: '',
  device_id: '',
  user_id: '',
  borrow_time: '',
  return_time: null,
  status: '',
  remark: '',
  created_at: '',
  updated_at: '',
})
async function initData() {
  try {
    const result = await axios.get(`${prefix}/api/borrow_device/all`)
    if (result.status === 200) {
      data.value = result.data.result
      data.value.forEach((i) => {
        if (i.return_time) i.return_time = formatDateTime(i.return_time)
        i.borrow_time = formatDateTime(i.borrow_time)
        i.updated_at = formatDateTime(i.updated_at)
        i.created_at = formatDateTime(i.created_at)
      })
    }
    // console.log(data.value)
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  initData()
})
const rules = ref({
  device_id: [
    {
      validator: (rule, value, callback) => {
        if (value === '') callback('请输入设备id')
        else callback()
      },
      trigger: 'blur',
    },
  ],
  user_id: [
    {
      validator: (rule, value, callback) => {
        if (value === '') callback('请输入用户id')
        else callback()
      },
      trigger: 'blur',
    },
  ],
  borrow_time: [
    {
      validator: (rule, value, callback) => {
        if (value === '') callback('请选择借出时间')
        else callback()
      },
      trigger: 'blur',
    },
  ],
  status: [
    {
      validator: (rule, value, callback) => {
        if (value === '') callback('请选择状态')
        else callback()
      },
      trigger: 'blur',
    },
  ],
})
async function addItem(formEl) {
  if (!formEl) return
  let Invalid = false
  await formEl.validate((valid) => {
    if (!valid) Invalid = true
  })
  if (Invalid) return
  try {
    const result = await axios.post(`${prefix}/api/borrow_device/add`, {
      device_id: newItem.value.device_id,
      user_id: newItem.value.user_id,
      borrow_time: newItem.value.borrow_time,
      return_time: newItem.value.return_time,
      status: newItem.value.status,
      remark: newItem.value.remark,
    })
    if (result.status === 200) {
      initData()
      ElMessage.success('添加成功!')
      dialog1.value = false
      formEl.resetFields()
    } else {
      ElMessage.error('添加失败~')
    }
  } catch (error) {
    let msg = '添加失败!'
    if (error.response) msg += error.response.data.mesaage
    ElMessage.error(msg)
  }
}
async function deleteItem(itemId) {
  try {
    const result = await axios.delete(`${prefix}/api/borrow_device/delete/${itemId}`)
    if (result.status === 200) {
      initData()
      ElMessage.success('删除成功!')
    } else ElMessage.error('删除失败~')
  } catch (error) {
    let msg = '删除失败!'
    if (error.response) msg += error.response.data.mesaage
    ElMessage.error(msg)
  }
}
async function updateItem(formEl) {
  if (!formEl) return
  let Invalid = false
  await formEl.validate((valid) => {
    if (!valid) Invalid = true
  })
  if (Invalid) return
  try {
    const result = await axios.patch(`${prefix}/api/borrow_device/update/${curItem.value.id}`, {
      device_id: curItem.value.device_id,
      user_id: curItem.value.user_id,
      borrow_time: curItem.value.borrow_time,
      return_time: curItem.value.return_time,
      status: curItem.value.status,
      remark: curItem.value.remark,
    })
    if (result.status === 200){
      initData()
      dialog2.value = false
      ElMessage.success('修改成功!')
    }
    else ElMessage.error('修改失败~')
  } catch (error) {
    let msg = '修改失败!'
    if (error.response) msg += error.response.data.mesaage
    ElMessage.error(msg)
  }
}
</script>
