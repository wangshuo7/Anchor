<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <Menu class="menu"></Menu>
      </el-aside>
      <el-container>
        <el-header>
          <Header></Header>
        </el-header>
        <el-main>
          <Content></Content>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import Menu from './components/Menu.vue'
import Content from './components/Content.vue'
import Header from './components/Header.vue'
</script>

<style lang="less" scoped>
:deep(.el-header) {
  padding: 0;
}
:deep(.el-main) {
  position: relative;
  top: 60px;
}
</style>
