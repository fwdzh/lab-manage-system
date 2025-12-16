<template>
    <el-card style="width: 350px;">
    <div
        style="display: flex;flex-direction: column ;gap:12px;align-items: center;"
    >
        <h2>注册</h2>
        <el-input
            v-model="username"
            placeholder="请输入用户名"
            type="text"
        />
        <el-input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            show-password
        />
        <el-input
            v-model="confirmPass"
            type="password"
            placeholder="请再次输入密码"
            show-password
        />
        <el-input
            v-model="email"
            type="email"
            placeholder="请输入邮箱"
        />
        <div style="font-size: 14px;">
            已有账号？
            <router-link to="/login">去登录</router-link>
        </div>
        <el-button type="primary" @click="register" style="width: 100%;">
            注册
        </el-button>
    </div>
  </el-card>
</template>

<script setup>
    import { ElMessage } from 'element-plus'
    import { ElMessageBox } from 'element-plus'
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import axios from 'axios'
    const username = ref('')
    const password = ref('')
    const confirmPass = ref('')
    const email = ref('')
    const prefix = 'http://localhost:3000'
    const router = useRouter()

    async function register() {
        if(!username.value || !password.value || !confirmPass.value)
            return
        if(password.value !== confirmPass.value){
            ElMessage.error("两次输入密码不一致！")
        }
        try{
            const res = await axios.post(`${prefix}/api/auth/register`, {
                    username : username.value,
                    password : password.value,
                    email: email.value
                })
            if(res.status === 200){
                ElMessage.success("注册成功！")
                router.push('/login')
            }else{
                ElMessage.error(res.data.message)
            }
        } catch(e) {
            ElMessageBox.alert(e.response.data.message, '错误', {
                confirmButtonText: '我知道了'
            })

            console.log("error : ", e.response.data.message)
        }
    }
</script>
