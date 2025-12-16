<template>
  <div>
    <el-button type="primary" @click="addButton">
      新增用户
    </el-button>
    <el-table :data="data" style="width: 100%;">
      <el-table-column label="id" prop="id" />
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="邮箱" prop="email" />
      <el-table-column label="创建时间" prop="create_time" />
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
  </div>
</template>

<script setup>
  import axios from 'axios'
import { ElMessage } from 'element-plus'
  import { onMounted, ref } from 'vue'

  const prefix = 'http://localhost:3000'
  const data = ref([])
  const dialogVisible = ref(false)
  const newUser = ref({
    username: '',
    password: '',
    email: ''
  })
  const formRef = ref()
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
    }
  }
  onMounted(() => {
    f()
  })
  async function addButton() {
    dialogVisible.value = true
  }

  const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
  }
  async function submitForm(formEl){
    if(!formEl) return
    formEl.validate((valid) => {
      if(valid){
        console.log('submit!')
      }
      else{
        // 不合法 => 直接 return
        console.log('error submit!')
        return
      }
    })
    try{
      const res = await axios.post(`${prefix}/api/user/add`, {
                      username : newUser.value.username,
                      password : newUser.value.password,
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
      ElMessage.error(e.response.data.message)
    }
  }
</script>
