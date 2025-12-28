<template>
    <div>
        <div style="height: 60px; background-color: #aaaaaa; display: flex; align-items: center;">
          <h2 style="margin-left: 20px;"><router-link to="/admin">实验室管理系统</router-link></h2>


          <el-button @click="logout()" style="margin-left: auto; margin-right: 20px;" type="primary">
            退出登录
          </el-button>
        </div>

        <div style="display: flex;">
            <div style="height: calc(100vh - 60px);">
                <el-menu router>
                    <el-menu-item index="/admin/user">用户</el-menu-item>
                    <el-menu-item index="/admin/lab">实验室</el-menu-item>
                    <el-menu-item index="/admin/device">设备</el-menu-item>
                    <el-menu-item index="/admin/reservation">预约</el-menu-item>
                    <el-menu-item index="/admin/borrow_device">借用记录</el-menu-item>
                </el-menu>
            </div>
            <div style="flex: 1">
              <RouterView />
            </div>
        </div>

    </div>

</template>

<script setup>
import { RouterView } from 'vue-router';


const logout = () => {
    localStorage.clear()
    location.reload()
}

</script>
