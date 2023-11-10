<template>
  <div>
    <router-view v-slot="{ Component }">
      <keep-alive :include="getCachedPages">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { usePageCacheStore } from '../../../store/pageCache'; // 调整路径为实际路径
import { computed } from 'vue';

const store = usePageCacheStore();

const getCachedPages = computed(() => store.getCachedPages);
</script>

<style lang="less" scoped></style>
