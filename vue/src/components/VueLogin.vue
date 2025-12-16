<!-- /src/components/Login.vue -->
<script setup>
    import { ref } from 'vue';
    import axios from 'axios';
    import { ElMessage } from 'element-plus';
    import { useRouter } from 'vue-router';

    const username = ref('')
    const password = ref('')
    const prefix = 'http://localhost:3000'
    const router = useRouter()

    async function login() {
        console.log(username.value, password.value)
        /*
        res.status : 返回的状态码，200 表示请求成功
        res.data.token : token
        失败
        e.response.data.message
        */
        try {
            const res = await axios.post(`${prefix}/api/auth/login`, {
                username : username.value,
                password : password.value
            })
            if(res.status === 200){
                ElMessage.success("登录成功！")
                console.log(res.data.token)
                localStorage.setItem('token', res.data.token)
                router.push('/')
            }else{
                ElMessage.error("登录失败！")
            }
        } catch (e) {
            console.error('请求失败：', e.message)
            console.error('请求失败：', e.status)
            console.error('请求失败：', e.response.data.message)
            ElMessage.error("登录失败！")
        }

    }
</script>

<template>
  <el-card style="width: 350px;">
    <div
        style="display: flex;flex-direction: column ;gap:12px;align-items: center;"
    >
        <h2>登录</h2>
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
        <div style="font-size: 14px;">
            <router-link to="/register">去注册</router-link>
            &nbsp;
            <a href="#">忘记密码</a>
        </div>
        <el-button type="primary" @click="login" style="width: 100%;">
            登录
        </el-button>
    </div>
  </el-card>
</template>
