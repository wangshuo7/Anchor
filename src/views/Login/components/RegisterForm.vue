<template>
  <el-form ref="ruleFormRef" :model="form" label-width="100px" :rules="rules">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="form.mobile"></el-input>
    </el-form-item>
    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="form.nickname"></el-input>
    </el-form-item>
    <el-form-item label="公会ID" prop="union_id">
      <el-input v-model="form.union_id"></el-input>
    </el-form-item>
    <el-form-item label="提现账户" prop="tx_card">
      <el-input v-model="form.tx_card"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit()">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { register_type } from '../../../type/login'
import { register } from '../../../api/login'
// import HUpload from '../../../components/HUpload/index.vue'
const ruleFormRef = ref<FormInstance>()
const form = reactive<register_type>({
  username: 'fdsGHGJKJHf111dsf1',
  password: 'fdsfdsf1',
  mobile: '15563875111',
  nickname: 'fdsfdsfdsf11',
  union_id: '11111111111111111',
  tx_card: ''
})
const rules = reactive<FormRules<register_type>>({
  username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  password: [
    {
      required: true,
      message: '密码不能为空'
    }
  ],
  mobile: [
    {
      required: true,
      message: '手机号不能为空'
      // trigger: 'change'
    },
    {
      pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
      message: '手机号格式不正确',
      trigger: 'blur'
    }
  ],
  nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
  union_id: [{ required: true, message: '公会ID不能为空', trigger: 'blur' }],
  tx_card: [{ required: true, message: '提现账号不能为空', trigger: 'blur' }]
})
function onSubmit() {
  const send_data = {
    username: form.username,
    password: form.password,
    mobile: form.mobile,
    nickname: form.nickname,
    union_id: form.union_id,
    tx_card: form.tx_card
  }
  ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      const res: any = await register(send_data)
      if (res.code === 200) {
        ElMessage.success('注册成功')
      }
    } else {
      // 表单验证未通过
    }
  })
}
</script>

<style lang="less" scoped></style>
