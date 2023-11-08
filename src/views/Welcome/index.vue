<template>
  <div>欢迎</div>
  <el-button type="primary" @click="toNext">下一个</el-button>
</template>

<script lang="ts" setup>
import router from '../../router'

function toNext() {
  router.push('/welcome/next')
}
</script>

<style lang="less" scoped></style>
