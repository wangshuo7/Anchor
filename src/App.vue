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
// const globalStore = useGlobalStore()
// onBeforeMount(async () => {
//   const language = await getLanguage({})
//   const category = await getCategory({})
//   const platform = await getPlatform({})

//   console.log('language', language)
//   console.log('platform', platform)
//   console.log('category', category)

//   // 存入Pinia store
//   globalStore.setLanguage(language.data.list)
//   globalStore.setCategory(category.data.list)
//   globalStore.setPlatform(platform.data.list)
// })
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
