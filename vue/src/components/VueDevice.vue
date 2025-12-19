<template>
  <div>
      <h2>设备列表</h2>
      <el-button type="primary" @click="() => dialog1=true" style="margin-bottom: 20px;">
        添加设备
      </el-button>
      <el-table :data="data" style="width: 100%;">
        <el-table-column label="id" prop="id" />
        <el-table-column label="名称" prop="name" />
        <el-table-column label="型号" prop="model" />
        <el-table-column label="实验室id" prop="lab_id" />
        <el-table-column label="状态" prop="status" />
        <el-table-column label="位置" prop="location" />
        <el-table-column label="购买时间" prop="purchase_time" />
        <el-table-column label="购买价格" prop="price" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button @click="() => { curDevice = {...scope.row}; dialog2 = true}" type="primary" size="small">编辑</el-button>
            <el-button @click="deleteDevice(scope.row.id)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="新增设备" v-model="dialog1">
        <el-form
          ref="formRef"
          status-icon
          :model="newDevice"
          :rules="rules"
          label-width="auto"
        >
          <el-form-item label="name" prop="name">
            <el-input v-model="newDevice.name" placeholder="请输入设备名称"/>
          </el-form-item>
          <el-form-item label="model" prop="model">
            <el-input v-model="newDevice.model" placeholder="请输入设备型号"/>
          </el-form-item>
          <el-form-item label="lab_id" prop="lab_id">
            <el-input v-model="newDevice.lab_id" placeholder="请输入所属实验室 id"/>
          </el-form-item>
          <el-form-item label="location" prop="location">
            <el-input v-model="newDevice.location" placeholder="请输入设备位置"/>
          </el-form-item>
          <el-form-item label="purchase_time" prop="purchase_time">
            <el-date-picker
              v-model="newDevice.purchase_time"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              date-format="MMM DD, YYYY"
              time-format="HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择购买时间"
            />
          </el-form-item>
          <el-form-item label="price" prop="price">
            <el-input v-model="newDevice.price" placeholder="请输入购买价格"/>
          </el-form-item>
          <el-form-item label="desciption" prop="description">
            <el-input v-model="newDevice.description" placeholder="请输入描述"/>
          </el-form-item>

          <el-form-item>
            <el-button @click="() => {formRef.resetFields()}">虫豸</el-button>
            <el-button type="primary" @click="addDevice(formRef)">添加</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog title="修改设备信息" v-model="dialog2">
        <el-form
          ref="deviceInfo"
          status-icon
          :model="curDevice"
          :rules="rules"
          label-width="auto"
          destroy-on-close
        >
          <el-form-item label="name" prop="name">
            <el-input v-model="curDevice.name" placeholder="请输入设备名称" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="model" prop="model">
            <el-input v-model="curDevice.model" placeholder="请输入设备型号"/>
          </el-form-item>
          <el-form-item label="lab_id" prop="lab_id">
            <el-input v-model="curDevice.lab_id" placeholder="请输入所属实验室 id"/>
          </el-form-item>
          <el-form-item label="status" prop="status">
            <!-- <el-input v-model="curDevice.status" placeholder="请输入状态"/> -->
            <el-select v-model="curDevice.status" placeholder="选择状态">
              <el-option label="可用" value="available" />
              <el-option label="借出" value="borrowed" />
              <el-option label="维护" value="maintenance" />
              <el-option label="卖掉了" value="discarded" />
            </el-select>
          </el-form-item>
          <el-form-item label="location" prop="location">
            <el-input v-model="curDevice.location" placeholder="请输入设备位置"/>
          </el-form-item>
          <el-form-item label="purchase_time" prop="purchase_time">
            <!-- <el-input v-model="curDevice.purchase_time" placeholder="请输入购买时间"/> -->
            <el-date-picker
              v-model="curDevice.purchase_time"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              date-format="MMM DD, YYYY"
              time-format="HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择购买时间"
            />
          </el-form-item>
          <el-form-item label="price" prop="price">
            <el-input v-model="curDevice.price" placeholder="请输入购买价格"/>
          </el-form-item>
          <el-form-item label="description" prop="description">
            <el-input v-model="curDevice.description" placeholder="请输入描述"/>
          </el-form-item>

          <el-form-item>
            <el-button @click="reset(deviceInfo)">重置</el-button>
            <!-- <el-button @click="() => deviceInfo.resetFields()">重置</el-button> -->
            <el-button type="primary" @click="updateDevice(deviceInfo)">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
  </div>

</template>

<script setup>

  import { onMounted, ref } from 'vue';
  import axios from 'axios';
  import { ElMessage } from 'element-plus';
  function reset(){
    curDevice.value = {
      id: curDevice.value.id,
      name: '',
      model: '',
      lab_id: '',
      location: '',
      status: 'available',
      purchase_time: '',
      price: '',
      description: ''
    }
  }
  const data = ref([])
  const prefix = 'http://localhost:3000'
  const dialog1 = ref(false)
  const dialog2 = ref(false)
  const newDevice = ref({
    name: '',
    model: '',
    lab_id: '',
    location: '',
    status: 'available',
    purchase_time: '',
    price: '',
    description: ''
  })
  const curDevice = ref({
    id: '',
    name: '',
    model: '',
    lab_id: '',
    location: '',
    status: 'available',
    purchase_time: '',
    price: '',
    description: ''
  })
  const formRef = ref()
  const deviceInfo = ref()
  const rules = ref({
    name: [{
      validator: (rule, value, callback) => {
        if(value === '')
          callback(new Error("请输入设备名称"))
        else
          callback()
      },
      trigger: 'blur'
    }],
    model: [{ trigger: 'blur' }],
    lab_id: [{ trigger: 'blur' }],
    location: [{ trigger: 'blur' }],
    status: [{ trigger: 'blur' }],
    purchase_time: [{ trigger: 'blur' }],
    price: [{ trigger: 'blur' }],
    description: [{ trigger: 'blur' }]
  })
  onMounted(() => {
    initData()
  })
  async function initData() {
    try {
      const result = await axios.get(`${prefix}/api/device/all`)
      data.value = result.data.deviceList
      data.value.forEach((i) => {
        // 如果没有时间，这玩意会把时间设置为 1970-01-01 08:00:00
        // 这个时间插入数据库会报错，，，所以设置为一个其他的默认值比较好
        if(!i.purchase_time) i.purchase_time = "2017"
        i.purchase_time = formatDate(i.purchase_time)
      })
      console.log(data.value)
    } catch(e) {
      console.log(e)
    }
  }
  async function deleteDevice(deviceId) {
    try {
      const res = await axios.delete(`${prefix}/api/device/delete/${deviceId}`)
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
  async function addDevice(formEl) {
    if(!formEl) return
    let Invalid = false
    await formEl.validate((valid) => {
      if(!valid){
        Invalid = true
      }
    })
    if(Invalid) return
    try {
      // 这里请求没有发 status，感觉没啥必要，设置了默认值，以及新增的肯定是可用状态吧
      // 其实主要是不想弄，修改里弄一个就行了
      const res = await axios.post(`${prefix}/api/device/add`, {
        name: newDevice.value.name,
        model: newDevice.value.model,
        lab_id: newDevice.value.lab_id,
        location: newDevice.value.location,
        purchase_time: newDevice.value.purchase_time,
        price: newDevice.value.price,
        description: newDevice.value.description
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
  async function updateDevice(formEl) {
    if(!formEl) return
    let Invalid = false
    await formEl.validate((valid) => {
      if(!valid){
        Invalid = true
      }
    })
    if(Invalid) return
    try {
      const res = await axios.patch(`${prefix}/api/device/update/${curDevice.value.id}`, {
        name: curDevice.value.name,
        model: curDevice.value.model,
        lab_id: curDevice.value.lab_id,
        status: curDevice.value.status,
        location: curDevice.value.location,
        purchase_time: curDevice.value.purchase_time,
        price: curDevice.value.price,
        description: curDevice.value.description
      })
      if(res.status === 200) {
        initData()
        dialog2.value = false
        ElMessage.success("修改成功！")
        deviceInfo.value.resetFields()
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
