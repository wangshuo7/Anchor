<template>
  <div class="main">
    <div class="log-box">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="登录" name="login">
          <LogForm></LogForm>
        </el-tab-pane>
        <el-tab-pane label="注册" name="register">
          <RegisterForm></RegisterForm>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import LogForm from './components/LogForm.vue'
import RegisterForm from './components/RegisterForm.vue'

import type { TabsPaneContext } from 'element-plus'
const activeName = ref<string>('login')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .log-box {
    width: 600px;
    height: 500px;
  }
}
</style>
