<template>
  <div>
      <h2>预约列表</h2>
      <el-button type="primary" @click="() => dialog1=true" style="margin-bottom: 20px;">
        新建预约
      </el-button>
      <el-table :data="data" style="width: 100%;">
        <el-table-column label="id" prop="id" />
        <el-table-column label="用户" prop="user_id" />
        <el-table-column label="实验室" prop="lab_id" />
        <el-table-column label="状态" prop="status" />
        <el-table-column label="开始时间" prop="start_time" />
        <el-table-column label="结束时间" prop="end_time" />
        <el-table-column label="备注" prop="note" />
        <el-table-column label="创建时间" prop="create_time" />
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button @click="() => { curItem = {...scope.row}; dialog2 = true}" type="primary" size="small">编辑</el-button>
            <el-button @click="deleteItem(scope.row.id)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="新增预约" v-model="dialog1">
        <p>
          实际肯定是得可以自己选择，输入名字筛选啥的，之后再写吧。再苦一苦用户，骂名我来担。
        </p>
        <el-form
          ref="formRef"
          status-icon
          :model="newReservation"
          :rules="rules"
          label-width="auto"
        >
          <el-form-item label="用户" prop="user_id">
            <el-input v-model="newReservation.user_id" placeholder="请输入用户id"/>
          </el-form-item>
          <el-form-item label="实验室" prop="lab_id">
            <el-input v-model="newReservation.lab_id" placeholder="请输入实验室id"/>
          </el-form-item>
          <el-form-item label="开始时间" prop="start_time">
            <el-date-picker
              v-model="newReservation.start_time"
              type="datetime"
              placeholder="选择开始时间"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>

          <el-form-item label="结束时间" prop="end_time">
            <el-date-picker
              v-model="newReservation.end_time"
              type="datetime"
              placeholder="选择结束时间"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>

          <el-form-item label="备注" prop="note">
            <el-input v-model="newReservation.note" placeholder="请输入备注"/>
          </el-form-item>


          <el-form-item>
            <el-button @click="() => {formRef.resetFields()}">重置</el-button>
            <el-button type="primary" @click="addItem(formRef)">添加</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog title="修改设备信息" v-model="dialog2">
        <el-form
          ref="itemInfo"
          status-icon
          :model="curDevice"
          :rules="rules"
          label-width="auto"
          destroy-on-close
        >
          <el-form-item label="用户" prop="user_id">
            <el-input v-model="curItem.user_id" placeholder="请输入用户id"/>
          </el-form-item>
          <el-form-item label="实验室" prop="lab_id">
            <el-input v-model="curItem.lab_id" placeholder="请输入实验室id"/>
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
            <el-input v-model="curItem.note" placeholder="请输入备注"/>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="curItem.status" placeholder="选择状态">
              <el-option label="审核" value="pending" />
              <el-option label="拒绝" value="rejected" />
              <el-option label="通过" value="accepted" />
              <el-option label="完成" value="finish" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updateItem(itemInfo)">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
  </div>

</template>

<script setup>

  import { onMounted, ref } from 'vue';
  import axios from 'axios';
  import { ElMessage } from 'element-plus';
  import { prefix } from '@/config';
  const data = ref([])
  const dialog1 = ref(false)
  const dialog2 = ref(false)
  const newReservation = ref({
    user_id: '',
    lab_id: '',
    status: '',
    start_time: '',
    end_time: '',
    note: '',
    create_time: ''
  })
  const curItem = ref({
    id: '',
    user_id: '',
    lab_id: '',
    status: 'pending',
    start_time: '',
    end_time: '',
    note: '',
    create_time: ''
  })
  const formRef = ref()
  const itemInfo = ref()

  const rules = ref({
    user_id: [{
      validator: (rule, value, callback) => {
        if(value === '')
          callback(new Error("请输入用户id"))
        else
          callback()
      },
      trigger: 'blur'
    }],
    lab_id: [{
      validator: (rule, value, callback) => {
        if(value === '')
          callback(new Error("请输入实验室id"))
        else
          callback()
      },
      trigger: 'blur'
    }],
    start_time: [{
      validator: (rule, value, callback) => {
        if(value === '')
          callback(new Error("请选择开始时间"))
        else{
          const x = newReservation.value.start_time
          const y = newReservation.value.end_time
          if(x && y && x > y){
            newReservation.value.end_time = x
            newReservation.value.start_time = y
          }
          callback()
        }
      },
      trigger: 'blur'
    }],
    end_time: [{
      validator: (rule, value, callback) => {
        if(value === '')
          callback(new Error("请选择结束时间"))
        else{
          const x = newReservation.value.start_time
          const y = newReservation.value.end_time
          if(x && y && x > y){
            newReservation.value.end_time = x
            newReservation.value.start_time = y
          }
          callback()
        }
      },
      trigger: 'blur'
    }],

  })
  onMounted(() => {
    initData()
  })
  async function initData() {
    try {
      const result = await axios.get(`${prefix}/api/lab_reservation/all`)
      data.value = result.data.reservationList
      data.value.forEach((i) => {
        // 如果没有时间，这玩意会把时间设置为 1970-01-01 08:00:00
        // 这个时间插入数据库会报错，，，所以设置为一个其他的默认值比较好
        i.start_time = formatDate(i.start_time)
        i.end_time = formatDate(i.end_time)
        i.create_time = formatDate(i.create_time)
      })
      console.log(data.value)
    } catch(e) {
      console.log(e)
    }
  }
  async function deleteItem(itemId) {
    try {
      const res = await axios.delete(`${prefix}/api/lab_reservation/delete/${itemId}`)
      if(res.status === 200) {
        ElMessage.success("删除成功！")
        initData()
      } else {
        ElMessage.error("删除失败！")
      }
    } catch (error) {
      console.log(error)
      let strRes = '删除失败！'
      if(error.response) {
        console.log(error.response.data.message)
        strRes += error.response.data.message
      }
      ElMessage.error(strRes)
      initData()
    }
  }
  async function addItem(formEl) {
    if(!formEl) return
    let Invalid = false
    await formEl.validate((valid) => {
      if(!valid){
        Invalid = true
      }
    })
    if(Invalid) return
    try {
      const res = await axios.post(`${prefix}/api/lab_reservation/add`, {
        user_id: newReservation.value.user_id,
        lab_id: newReservation.value.lab_id,
        start_time: newReservation.value.start_time,
        end_time: newReservation.value.end_time,
        note: newReservation.value.note
      })
      if(res.status === 200) {
        initData()
        dialog1.value = false
        ElMessage.success("添加成功！")
        formRef.value.resetFields()
      } else{
        ElMessage.error("添加失败～")
      }
    } catch (error) {
      console.log(error)
      let strMsg = "添加失败！"
      if(error.response)
        strMsg += error.response.data.message
      ElMessage.error(strMsg)
    }
  }
  async function updateItem(formEl) {
    if(!formEl) return
    let Invalid = false
    await formEl.validate((valid) => {
      if(!valid){
        Invalid = true
      }
    })
    if(Invalid) return
    try {
      const res = await axios.patch(`${prefix}/api/lab_reservation/update/${curItem.value.id}`, {
        user_id: curItem.value.user_id,
        lab_id: curItem.value.lab_id,
        status: curItem.value.status,
        start_time: curItem.value.start_time,
        end_time: curItem.value.end_time,
        note: curItem.value.note
      })
      if(res.status === 200) {
        initData()
        dialog2.value = false
        ElMessage.success("修改成功！")
        itemInfo.value.resetFields()
      } else{
        ElMessage.error("修改失败～")
      }
    } catch (error) {
      console.log(error)
      let strMsg = "修改失败！"
      if(error.response)
        strMsg += error.response.data.message
      ElMessage.error(strMsg)
    }
  }

  function formatDate(date) {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')  // 月份从 0 开始，所以要加 1
    const day = d.getDate().toString().padStart(2, '0')
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')
    const seconds = d.getSeconds().toString().padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
</script>
