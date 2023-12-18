<template>
  <el-container class="layout-container-demo" style="height: 100vh">
    <el-aside class="aside" :class="{ active: isCollapse }">
      <Menu class="menu"></Menu>
    </el-aside>
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-main>
        <el-scrollbar>
          <Content :key="contentKey"></Content>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Menu from './components/Menu.vue'
import Content from './components/Content.vue'
import Header from './components/Header.vue'
// import { useRoute } from 'vue-router'
import { useCollapseStore } from '../../store/collapse'
import { computed } from 'vue'

const collapseStore = useCollapseStore()
const isCollapse = computed(() => collapseStore.collapse)

// const route = useRoute()
import { useReloadStore } from '../../store/reload'
const reloadStore = useReloadStore()
const contentKey = computed(() => reloadStore.contentKey)
</script>

<style lang="less" scoped>
.layout-container-demo .el-header {
  position: relative;
  // background-color: var(--el-color-primary-light-7);
  // color: var(--el-text-color-primary);
  padding: 0;
  height: 100px;
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  // background: var(--el-color-primary-light-8);
  // width: 220px;
}
.aside {
  width: 220px;
  transition: width 0.3s linear;
}
.aside.active {
  width: 70px;
}
.layout-container-demo .el-menu {
  border-right: none;
}
body[dark-mode='true'] .el-main {
  background-color: var(--background-color-dark);
}
.layout-container-demo .el-main {
  padding: 0;
  background-color: #f5f5f5;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
