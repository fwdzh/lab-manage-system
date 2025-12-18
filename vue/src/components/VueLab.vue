<template>
  <div>
      <h2>实验室列表</h2>
      <el-button type="primary" @click="() => dialog1=true" style="margin-bottom: 20px;">
        添加实验室
      </el-button>
      <el-table :data="data" style="width: 100%;">
        <el-table-column label="id" prop="id" />
        <el-table-column label="名称" prop="name" />
        <el-table-column label="负责人" prop="leader" />
        <el-table-column label="电话" prop="phone" />
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="位置" prop="location" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="状态" prop="status" />
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button @click="() => { curLab = {...scope.row}; dialog2 = true}" type="primary" size="small">编辑</el-button>
            <el-button @click="deleteLab(scope.row.id)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="新增实验室" v-model="dialog1">
        <el-form
          ref="formRef"
          status-icon
          :model="newLab"
          :rules="rules"
          label-width="auto"
        >
          <el-form-item label="name" prop="name">
            <el-input v-model="newLab.name" placeholder="请输入实验室名称"/>
          </el-form-item>
          <el-form-item label="leader" prop="leader">
            <el-input v-model="newLab.leader" placeholder="请输入负责人姓名"/>
          </el-form-item>
          <el-form-item label="phone" prop="phone">
            <el-input v-model="newLab.phone" placeholder="请输入联系电话"/>
          </el-form-item>
          <el-form-item label="email" prop="email">
            <el-input v-model="newLab.email" placeholder="请输入邮箱"/>
          </el-form-item>
          <el-form-item label="location" prop="location">
            <el-input v-model="newLab.location" placeholder="请输入实验室位置"/>
          </el-form-item>
          <el-form-item label="description" prop="description">
            <el-input v-model="newLab.description" placeholder="请输入描述"/>
          </el-form-item>

          <el-form-item>
            <el-button @click="() => formRef.resetFields()">虫豸</el-button>
            <el-button type="primary" @click="addLab(formRef)">添加</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog title="更新实验室信息" v-model="dialog2">
        <el-form
          ref="labInfo"
          status-icon
          :model="curLab"
          :rules="rules"
          label-width="auto"
        >
          <el-form-item label="name" prop="name">
            <el-input v-model="curLab.name" placeholder="请输入实验室名称"/>
          </el-form-item>
          <el-form-item label="leader" prop="leader">
            <el-input v-model="curLab.leader" placeholder="请输入负责人姓名"/>
          </el-form-item>
          <el-form-item label="phone" prop="phone">
            <el-input v-model="curLab.phone" placeholder="请输入联系电话"/>
          </el-form-item>
          <el-form-item label="email" prop="email">
            <el-input v-model="curLab.email" placeholder="请输入邮箱"/>
          </el-form-item>
          <el-form-item label="location" prop="location">
            <el-input v-model="curLab.location" placeholder="请输入实验室位置"/>
          </el-form-item>
          <el-form-item label="description" prop="description">
            <el-input v-model="curLab.description" placeholder="请输入描述"/>
          </el-form-item>

          <el-form-item>
            <el-button @click="() => labInfo.resetFields()">虫豸</el-button>
            <el-button type="primary" @click="updateLab(labInfo)">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
  </div>

</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import axios from 'axios';
  import { ElMessage } from 'element-plus';
  const data = ref([])
  const prefix = 'http://localhost:3000'
  const dialog1 = ref(false)
  const dialog2 = ref(false)
  const newLab = ref({
    name: '',
    leader: '',
    phone: '',
    email: '',
    location: '',
    description: '',
  })
  const curLab = ref({
    id: '',
    name: '',
    leader: '',
    phone: '',
    email: '',
    location: '',
    description: '',
  })
  const formRef = ref()
  const labInfo = ref()
  const rules = ref({
    name: [{
      validator: (rule, value, callback) => {
        if(value === '')
          callback(new Error("请输入实验室名称"))
        else
          callback()
      },
      trigger: 'blur'
    }],
    leader: [{ trigger: 'blur' }],
    phone: [{ trigger: 'blur' }],
    email: [{ trigger: 'blur' }],
    location: [{ trigger: 'blur' }],
    description: [{ trigger: 'blur' }],
    status: [{ trigger: 'blur' }]
  })
  onMounted(() => {
    initData()
  })
  async function initData() {
    try {
      const result = await axios.get(`${prefix}/api/lab/all`)
      data.value = result.data.labList
      console.log(data.value)
    } catch(e) {
      console.log(e)
    }
  }
  async function deleteLab(labId) {
    try {
      const res = await axios.delete(`${prefix}/api/lab/delete/${labId}`)
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
  async function addLab(formEl) {
    if(!formEl) return
    let Invalid = false
    await formEl.validate((valid) => {
      if(!valid){
        Invalid = true
      }
    })
    if(Invalid) return
    try {
      const res = await axios.post(`${prefix}/api/lab/add`, {
        name: newLab.value.name,
        leader: newLab.value.leader,
        phone: newLab.value.phone,
        email: newLab.value.email,
        location: newLab.value.location,
        des: newLab.value.description
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
  async function updateLab(formEl) {
    if(!formEl) return
    let Invalid = false
    await formEl.validate((valid) => {
      if(!valid){
        Invalid = true
      }
    })
    if(Invalid) return
    try {
      const res = await axios.patch(`${prefix}/api/lab/update/${curLab.value.id}`, {
        name: curLab.value.name,
        leader: curLab.value.leader,
        phone: curLab.value.phone,
        email: curLab.value.email,
        location: curLab.value.location,
        des: curLab.value.description
      })
      if(res.status === 200) {
        initData()
        dialog2.value = false
        ElMessage.success("修改成功！")
        labInfo.value.resetFields()
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
</script>
