<template>
  <div>
    <h2>用户列表</h2>
    <el-button type="primary" @click="() => dialogVisible=true" style="margin-bottom: 20px;">
      新增用户
    </el-button>
    <el-table :data="data" style="width: 100%;">
      <el-table-column label="id" prop="id" />
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="邮箱" prop="email" />
      <el-table-column label="创建时间" prop="create_time" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button @click="() => { curUser = {...scope.row}; dialog2 = true}" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteUser(scope.row.id)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增用户" v-model="dialogVisible">
      <el-form
        ref="formRef"
        status-icon
        :model="newUser"
        :rules="rules"
        label-width="auto"
      >
        <el-form-item label="username" prop="username">
          <el-input v-model="newUser.username" placeholder="请输入用户名" autocomplete="off" />
        </el-form-item>
        <el-form-item label="password" prop="password">
          <el-input
            v-model="newUser.password"
            placeholder="请输入密码"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="newUser.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm(formRef)">虫豸</el-button>
          <el-button type="primary" @click="submitForm(formRef)">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="修改用户信息" v-model="dialog2">
      <el-form
        ref="userInfo"
        status-icon
        :model="curUser"
        :rules="rules"
        label-width="auto"
        destroy-on-close
      >
        <el-form-item label="username" prop="username">
          <el-input v-model="curUser.username" placeholder="请输入设备名称" disabled/>
        </el-form-item>
        <!-- 不需要改用户名的，肯定不能改用户名 -->
        <el-form-item label="password" prop="password">
          <el-input v-model="curUser.password" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="curUser.email" placeholder="请输入邮箱"/>
        </el-form-item>

        <el-form-item>
          <!-- <el-button @click="() => userInfo.resetFields()">重置</el-button> -->
          <el-button type="primary" @click="updateUser(userInfo)">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
  import axios from 'axios'
import { ElMessage } from 'element-plus'
  import { onMounted, ref } from 'vue'
  import { prefix } from '@/config'
  const data = ref([])
  const dialogVisible = ref(false)
  const dialog2 = ref(false)

  const newUser = ref({
    username: '',
    password: '',
    email: ''
  })
  const curUser = ref({
    id: '',
    username: '',
    password: '',
    email: ''
  })
  const formRef = ref()
  const userInfo = ref()
  function validateUsername(rule, value, callback){
    if(value === ''){
      callback(new Error('请输入用户名'))
    }else{
      callback()
    }
  }
  function validateEmail(rule, value, callback){
    if(value === ''){
      callback(new Error('请输入邮箱'))
    }else{
      callback()
    }
  }
  function validatePassword(rule, value, callback){
    if(value === ''){
      callback(new Error('请输入密码'))
    }else{
      callback()
    }
  }

  const rules = ref({
    username: [{ validator: validateUsername, trigger: 'blur' }],
    password: [{ validator: validatePassword, trigger: 'blur' }],
    email: [{ validator: validateEmail, trigger: 'blur' }]
  })
  const f = async() => {
    const res = await axios.get(`${prefix}/api/user/all`)
    if(res.status === 200){
      data.value = res.data.userList
      console.log(data.value)
      data.value.forEach((item) => {
        item.create_time = formatDate(item.create_time)
      })
    }
  }
  onMounted(() => {
    f()
  })

  const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
  }
  async function submitForm(formEl){
    if(!formEl) return
    let Invalid = false
    await formEl.validate((valid) => {
      if(valid){
        console.log('submit!')
      }
      else{
        console.log('error submit!')
        Invalid = true
        // 这里 return 是没用的，只会结束回调函数，不会影响外部代码
      }
    })
    if(Invalid) return // 必须要把前面的 validate 加上 await，等待执行完成
    try{
      const res = await axios.post(`${prefix}/api/user/add`, {
                      username: newUser.value.username,
                      password: newUser.value.password,
                      email: newUser.value.email
      })
      if(res.status === 200){
        resetForm(formEl)
        dialogVisible.value = false
        f()
        ElMessage.success("添加成功")
      }else{
        ElMessage.error("添加失败")
      }
    } catch(e) {
      console.log(e)
      if(e.response){
        ElMessage.error(e.response.data.message)
      }else{
        ElMessage.error("添加失败！")
      }
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
  async function deleteUser(id) {
    try {
      const result = await axios.delete(`${prefix}/api/user/delete`, {
        data : { id }
      })
      if (result.status === 200){
        ElMessage("删除成功！")
        f()
      } else {
        ElMessage("删除失败" + result.data.message)
      }
    } catch(e) {
      console.log(e)
      if(e.response){
        ElMessage.error(e.response.data.message)
      }
    }
  }
  async function updateUser(formEl) {
    if(!formEl) return
    let Invalid = false
    await formEl.validate((valid) => {
      if(valid){
        console.log('submit!')
      }
      else{
        console.log('error submit!')
        Invalid = true
      }
    })
    if(Invalid) return // 必须要把前面的 validate 加上 await，等待执行完成
    try{
      const res = await axios.patch(`${prefix}/api/user/update/${curUser.value.id}`, {
                      password: curUser.value.password,
                      email: curUser.value.email
      })
      if(res.status === 200){
        resetForm(formEl)
        dialog2.value = false
        f()
        ElMessage.success("修改成功")
      }else{
        ElMessage.error("修改失败")
      }
    } catch(e) {
      console.log(e)
      if(e.response){
        ElMessage.error(e.response.data.message)
      }else{
        ElMessage.error("修改失败！")
      }
    }
  }
</script>
