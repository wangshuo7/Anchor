<template>
  <div class="left" :class="{ active: isCollapse }">
    <div class="logo">
      <img class="logo-img" src="/hooyoo.gif" alt="" />
      <div class="logo-title" v-if="!isCollapse">Hooyoo</div>
    </div>
    <div>
      <el-scrollbar>
        <el-menu
          text-color="#fff"
          :default-active="getActiveMenu(route.path)"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          router
          :default-openeds="['/wallet']"
        >
          <el-menu-item index="/home">
            <el-icon><Monitor /></el-icon>
            <template #title>{{ $t('home') }}</template>
          </el-menu-item>
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
          <el-sub-menu index="/wallet" popper-class="sub-menu">
            <template #title>
              <el-icon><Postcard /></el-icon>
              <span>{{ $t('wallet') }}</span>
            </template>
            <el-menu-item index="/info">{{ $t('info') }}</el-menu-item>
            <el-menu-item index="/recharge">{{ $t('recharge') }}</el-menu-item>
            <el-menu-item index="/expend">{{ $t('expend') }}</el-menu-item>
            <el-menu-item index="/card">{{ $t('card') }}</el-menu-item>
            <el-menu-item index="/withdrawal">{{
              $t('withdrawal')
            }}</el-menu-item>
            <el-menu-item index="/transfer">{{ $t('transfer') }}</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  Orange,
  VideoCamera,
  Postcard,
  SwitchFilled,
  Monitor
} from '@element-plus/icons-vue'
import { computed } from 'vue'

// import router from '../../../router'
import { useRoute } from 'vue-router'
import { useCollapseStore } from '../../../store/collapse'
const collapseStore = useCollapseStore()

const route = useRoute()
const getActiveMenu = (path: string) => {
  // 检查路径是否以某个标识符开头，例如 '/game'
  if (path.startsWith('/game')) {
    return '/game'
  } else if (path.startsWith('/mine')) {
    return '/mine'
  }
  return path
}
const isCollapse = computed(() => collapseStore.collapse)
</script>
<style lang="less" scoped>
.el-menu {
  background-color: #191a23 !important;
  border: none !important;
  .el-menu-item:hover {
    background-color: #1c2f55;
  }
  :deep(.el-sub-menu) .el-sub-menu__title:hover {
    background-color: #1c2f55 !important;
  }
  .el-menu-item {
    background-color: #191a23;
  }
}
.left {
  width: 100%;
  height: 100%;
  // border-right: 2px solid #dcdfe6;
  background-color: #191a23 !important;
  display: flex;
  flex-direction: column;
  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    justify-content: center;
    // border-bottom: 1px solid skyblue;
    .logo-img {
      display: block;
      height: 60%;
      border-radius: 50%;
    }
    .logo-title {
      color: #fff;
      font-size: 20px;
      margin-left: 10px;
    }
  }
}

:deep(.el-menu) {
  border: none;
}
.el-menu-item.is-active {
  background: #1c2f55;
  // border-radius: 10px;
  // margin: 0px 10px;
}
</style>
