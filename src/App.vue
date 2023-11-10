<template>
  <div id="app">
    <el-config-provider :locale="locale">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import en from 'element-plus/es/locale/lang/en'
import { useLanguageStore } from './store/languageStore'
// import { useGlobalStore } from './store/globalStore'
// import { getLanguage, getCategory, getPlatform } from './api/golbal'
const languageStore = useLanguageStore()
const locale = computed(() =>
  languageStore.locale == 'zh' ? zhCn : languageStore.locale == 'en' ? en : zhTw
)
</script>

<style lang="less" scoped>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
