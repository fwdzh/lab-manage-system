<template>
    <h2>Home</h2>
    <el-button @click="logout">
        退出登录
    </el-button>
</template>

<script setup>

const logout = () => {
    localStorage.clear()
    location.reload()
}

</script>