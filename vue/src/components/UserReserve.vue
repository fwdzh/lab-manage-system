<template>
  <div>
    <h2>预约记录</h2>
    <el-table :data="data" style="width: 100%">
      <el-table-column label="实验室" prop="lab_id" />
      <el-table-column label="状态" prop="status" />
      <el-table-column label="开始时间" prop="start_time" />
      <el-table-column label="结束时间" prop="end_time" />
      <el-table-column label="备注" prop="note" />
      <el-table-column label="创建时间" prop="create_time" />
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
            v-if="scope.row.status === 'pending'"
            >编辑</el-button
          >
          <el-button
            v-if="scope.row.status === 'pending'"
            type="danger"
            @click="deleteItem(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改预约信息" v-model="dialog2">
      <el-form
        ref="itemInfo"
        status-icon
        :model="curItem"
        :rules="rules"
        label-width="auto"
        destroy-on-close
      >
        <el-form-item label="实验室" prop="lab_id">
          <el-input v-model="curItem.lab_id" placeholder="请输入实验室id" />
        </el-form-item>
        <el-form-item label="开始时间" prop="start_time">
          <el-date-picker
            v-model="curItem.start_time"
            type="datetime"
            placeholder="选择开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker
            v-model="curItem.end_time"
            type="datetime"
            placeholder="选择结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="备注" prop="note">
          <el-input v-model="curItem.note" placeholder="请输入备注" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateItem(itemInfo)">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { prefix } from '@/config'
import { formatDateTime } from '@/utils/time'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
const curItem = ref({
  id: '',
  user_id: '',
  lab_id: '',
  start_time: '',
  end_time: '',
  note: '',
})
const dialog2 = ref(false)
const data = ref([])
const userId = localStorage.getItem('userId')
const rules = ref({
  lab_id: [
    {
      validator: (rule, value, callback) => {
        if (value === '') callback(new Error('请输入实验室id'))
        else callback()
      },
      trigger: 'blur',
    },
  ],
  start_time: [
    {
      validator: (rule, value, callback) => {
        if (value === '') callback(new Error('请选择开始时间'))
        else {
          const x = curItem.value.start_time
          const y = curItem.value.end_time
          if (x && y && x > y) {
            curItem.value.end_time = x
            curItem.value.start_time = y
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
          const x = curItem.value.start_time
          const y = curItem.value.end_time
          if (x && y && x > y) {
            curItem.value.end_time = x
            curItem.value.start_time = y
          }
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})
const itemInfo = ref()
async function initData() {
  try {
    const res = await axios.get(`${prefix}/api/lab_reservation/user/${userId}`)
    if (res.status === 200) {
      data.value = res.data.userReservationList
      data.value.forEach((i) => {
        i.start_time = formatDateTime(i.start_time)
        i.end_time = formatDateTime(i.end_time)
        i.create_time = formatDateTime(i.create_time)
      })
    } else {
      ElMessage.error('获取失败')
    }
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  initData()
})
async function deleteItem(itemId) {
  try {
    const res = await axios.delete(`${prefix}/api/lab_reservation/delete/${itemId}`)
    if (res.status === 200) {
      ElMessage.success('删除成功！')
      initData()
    } else {
      ElMessage.error('删除失败！')
    }
  } catch (error) {
    console.log(error)
    let strRes = '删除失败！'
    if (error.response) {
      console.log(error.response.data.message)
      strRes += error.response.data.message
    }
    ElMessage.error(strRes)
    initData()
  }
}
async function updateItem(formEl) {
  if (!formEl) return
  let Invalid = false
  await formEl.validate((valid) => {
    if (!valid) {
      Invalid = true
    }
  })
  if (Invalid) return
  try {
    const res = await axios.patch(`${prefix}/api/lab_reservation/update/${curItem.value.id}`, {
      user_id: curItem.value.user_id,
      lab_id: curItem.value.lab_id,
      status: curItem.value.status,
      start_time: curItem.value.start_time,
      end_time: curItem.value.end_time,
      note: curItem.value.note,
    })
    if (res.status === 200) {
      initData()
      dialog2.value = false
      ElMessage.success('修改成功！')
      itemInfo.value.resetFields()
    } else {
      ElMessage.error('修改失败～')
    }
  } catch (error) {
    console.log(error)
    let strMsg = '修改失败！'
    if (error.response) strMsg += error.response.data.message
    ElMessage.error(strMsg)
  }
}
</script>
