<template>
  <div class="box">
    <el-card v-bind="$attrs">
      <template #header>
        <slot name="head"></slot>
      </template>
      <slot name="body"></slot>
      <slot name="foot"></slot>
    </el-card>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.box {
  margin-top: 30px;
  padding: 30px;
}
:deep(.el-card__header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
