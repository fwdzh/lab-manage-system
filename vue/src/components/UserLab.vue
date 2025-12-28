<template>
  <div>
    <h2>实验室列表</h2>
    <el-table :data="data" style="width: 100%">
      <el-table-column label="id" prop="id" />
      <el-table-column label="名称" prop="name" />
      <el-table-column label="负责人" prop="leader" />
      <el-table-column label="电话" prop="phone" />
      <el-table-column label="邮箱" prop="email" />
      <el-table-column label="位置" prop="location" />
      <el-table-column label="描述" prop="description" />
      <el-table-column label="状态" prop="status" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button
            type="primary"
            v-if="scope.row.status"
            @click="
              () => {
                newItem.lab_id = scope.row.id
                dialog1 = true
              }
            "
            >预约</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增预约" v-model="dialog1">
      <el-form ref="form1" status-icon :model="newItem" :rules="rules" label-width="auto">
        <el-form-item label="开始时间" prop="start_time">
          <el-date-picker
            v-model="newItem.start_time"
            type="datetime"
            placeholder="选择开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker
            v-model="newItem.end_time"
            type="datetime"
            placeholder="选择结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="备注" prop="note">
          <el-input v-model="newItem.note" placeholder="请输入备注" />
        </el-form-item>

        <el-form-item>
          <el-button
            @click="
              () => {
                form1.resetFields()
              }
            "
            >重置</el-button
          >
          <el-button type="primary" @click="addItem(form1)">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { prefix } from '@/config'
import router from '@/router'
const data = ref([])
const userId = localStorage.getItem('userId')
onMounted(() => {
  initData()
})
async function initData() {
  try {
    const result = await axios.get(`${prefix}/api/lab/all`)
    data.value = result.data.labList
    console.log(data.value)
  } catch (e) {
    console.log(e)
  }
}
const dialog1 = ref(false)
const form1 = ref()
const newItem = ref({
  user_id: '',
  lab_id: '',
  status: '',
  start_time: '',
  end_time: '',
  note: '',
  create_time: '',
})
const rules = ref({
  start_time: [
    {
      validator: (rule, value, callback) => {
        if (value === '') callback(new Error('请选择开始时间'))
        else {
          const x = newItem.value.start_time
          const y = newItem.value.end_time
          if (x && y && x > y) {
            newItem.value.end_time = x
            newItem.value.start_time = y
          }
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  end_time: [
    {
      validator: (rule, value, callback) => {
        if (value === '') callback(new Error('请选择结束时间'))
        else {
          const x = newItem.value.start_time
          const y = newItem.value.end_time
          if (x && y && x > y) {
            newItem.value.end_time = x
            newItem.value.start_time = y
          }
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})
async function addItem(formEl) {
  if (!formEl) return
  let Invalid = false
  await formEl.validate((valid) => {
    if (!valid) {
      Invalid = true
    }
  })
  if (Invalid) return
  try {
    const res = await axios.post(`${prefix}/api/lab_reservation/add`, {
      user_id: userId,
      lab_id: newItem.value.lab_id,
      start_time: newItem.value.start_time,
      end_time: newItem.value.end_time,
      note: newItem.value.note,
    })
    if (res.status === 200) {
      router.push('/reserve_records')

      dialog1.value = false
      ElMessage.success('添加成功！')
      form1.value.resetFields()
    } else {
      ElMessage.error('添加失败～')
    }
  } catch (error) {
    console.log(error)
    let strMsg = '添加失败！'
    if (error.response) strMsg += error.response.data.message
    ElMessage.error(strMsg)
  }
}
</script>
