<template>
  <div class="left">
    <div class="logo">
      <img class="logo-img" src="@/assets/huLogo1.jpg" alt="" />
    </div>
    <div>
      <el-menu
        :default-active="getActiveMenu(route.path)"
        class="el-menu-vertical-demo"
        router
      >
        <el-menu-item index="/game">
          <el-icon><SwitchFilled /></el-icon>
          <template #title>{{ $t('game') }}</template>
        </el-menu-item>
        <el-menu-item index="/mine">
          <el-icon><Orange /></el-icon>
          <template #title>{{ $t('mine') }}</template>
        </el-menu-item>
        <el-menu-item index="/live">
          <el-icon><VideoCamera /></el-icon>
          <template #title>{{ $t('live') }}</template>
        </el-menu-item>
        <el-sub-menu index="/wallet">
          <template #title>
            <el-icon><Postcard /></el-icon>
            <span>{{ $t('wallet') }}</span>
          </template>
          <el-menu-item index="/info">{{ $t('info') }}</el-menu-item>
          <el-menu-item index="/recharge">{{ $t('recharge') }}</el-menu-item>
          <el-menu-item index="/expend">{{ $t('expend') }}</el-menu-item>
          <el-menu-item index="/card">{{ $t('card') }}</el-menu-item>
          <el-menu-item index="/withdrawal">{{ $t('withdrawal') }}</el-menu-item>
          <el-menu-item index="/transfer">{{ $t('transfer') }}</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  Orange,
  VideoCamera,
  Postcard,
  SwitchFilled
} from '@element-plus/icons-vue'

// import router from '../../../router'
import { useRoute } from 'vue-router'
const route = useRoute()
const getActiveMenu = (path: string) => {
  // 检查路径是否以某个标识符开头，例如 '/game'
  if (path.startsWith('/game')) {
    return '/game';
  } else if (path.startsWith('/mine')) {
    return '/mine';
  }
  return path;
};
</script>
<style lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100%;
  height: 100%;
  border-right: 2px solid #dcdfe6;
}
.left {
  width: 100%;
  height: 100vh;
  border-right: 2px solid #dcdfe6;
  display: flex;
  flex-direction: column;
  .logo {
    height: 70px;
    background-color: orange;
    border-bottom: 1px solid skyblue;
    .logo-img {
      display: block;
      width: 35%;
      overflow: hidden;
      margin: 0 auto;
    }
  }
}
:deep(.el-menu) {
  border: none;
}
</style>