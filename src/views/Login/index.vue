<template>
  <div class="main">
    <div class="login">
      <div class="login-logo">
        <el-image src="hooyoo.gif" class="logo-img"></el-image>
      </div>
      <div class="login-title">登录</div>
      <LogForm></LogForm>
    </div>
    <!-- <div class="log-box">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="登录" name="login">
          <LogForm></LogForm>
        </el-tab-pane>
        <el-tab-pane label="注册" name="register">
          <RegisterForm></RegisterForm>
        </el-tab-pane>
      </el-tabs>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
// import { ref } from 'vue'
import LogForm from './components/LogForm.vue'
// import RegisterForm from './components/RegisterForm.vue'

// import type { TabsPaneContext } from 'element-plus'
// const activeName = ref<string>('login')
// const handleClick = (tab: TabsPaneContext, event: Event) => {
//   console.log(tab, event)
// }
</script>

<style lang="less" scoped>
.main {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #202020;
  // .log-box {
  //   width: 600px;
  //   height: 500px;
  // }
  .login {
    width: 470px;
    height: 600px;
    background: #000;
    border-radius: 4px;
    padding: 50px 55px 60px;
    .login-logo {
      width: 100%;
      height: 50px;
      margin-bottom: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      .logo-img {
        height: 120%;
        width: auto;
      }
    }
    .login-title {
      margin-bottom: 20px;
      width: 100%;
      height: 25px;
      color: #fff;
      text-align: center;
      font-size: 1.125rem;
      font-family: 'Brutal, sans-serif';
      font-weight: 700;
      line-height: 1.5625rem;
      letter-spacing: -0.2px;
    }
  }
}
</style>
