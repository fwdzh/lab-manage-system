<template>
    <div>
        <div style="height: 60px; background-color: #aaaaaa; display: flex;">
          <h2><router-link to="/">实验室管理系统</router-link></h2>


          <el-button @click="logout()" style="margin-right: auto 0;" type="primary">
            退出登录
          </el-button>
        </div>

        <div style="display: flex;">
            <div style="height: calc(100vh - 60px);">
                <el-menu router>
                    <el-menu-item index="/user">
                      用户
                    </el-menu-item>
                    <el-menu-item index="/">实验室</el-menu-item>
                    <el-menu-item index="/">设备</el-menu-item>
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
