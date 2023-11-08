<template>
  <el-form :model="form" label-width="100px" :rules="rules" ref="ruleFormRef">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { login } from '../../../api/login'
import { login_type } from '../../../type/login'

const ruleFormRef = ref<FormInstance>()

const form = reactive<login_type>({
  login_type: '1',
  username: 'wangshuo123',
  password: '122333Ws'
})
const rules = reactive<FormRules<login_type>>({
  username: [
    {
      required: true,
      message: '用户名不能为空'
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空'
    }
  ]
})
async function onSubmit() {
  const send_data = {
    login_type: form.login_type,
    username: form.username,
    password: form.password
  }
  ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      const res: any = await login(send_data)
      if (res?.code === 200) {
        ElMessage.success('登录成功')
      }
    } else {
      // 表单验证未通过
    }
  })
}
</script>

<style lang="less" scoped></style>
