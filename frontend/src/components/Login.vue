<!-- /src/components/Login.vue -->
<script setup>
    import { ref } from 'vue';
    import axios from 'axios';

    const username = ref('')
    const password = ref('')
    const input = ref('')
    const prefix = 'http://localhost:3000'

    async function login() {
        console.log(username.value, password.value)
        try {
            const res = await axios.post(`${prefix}/api/auth/login`, {
                username : username.value,
                password : password.value
            })
            console.log(res)
            console.log(res.data.message)
            // alert(res.data.message)
        } catch (e) {
            console.error('请求失败：', e.message)
            console.error('请求失败：', e.status)
            console.error('请求失败：', e.response.data.message)
        }

    }
</script>

<template>
  <el-card style="max-width: 360px;">
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
            <a href="#">去注册</a>
            &nbsp;
            <a href="#">忘记密码</a>
        </div>
        <el-button type="primary" @click=login >
            登录
        </el-button>
    </div>
  </el-card>
</template>
