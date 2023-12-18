<template>
  <div class="header">
    <div class="header-left">
      <div @click="onSetCollapse" style="display: flex; align-items: center">
        <el-icon v-if="isCollapse"><Fold /></el-icon>
        <el-icon v-else><Expand /></el-icon>
      </div>
      <HBreadcrumbs></HBreadcrumbs>
    </div>
    <div class="header-right">
      <el-dropdown trigger="click">
        <el-button type="primary" class="drop-button">
          {{
            lang === 'zh'
              ? '切换语言'
              : lang === 'en'
              ? 'Change Language'
              : '切換語言'
          }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu class="dropdown">
            <el-dropdown-item @click="changeCn">{{
              lang === 'zh' ? '中文' : lang === 'en' ? 'Chinese' : '中文'
            }}</el-dropdown-item>
            <el-dropdown-item @click="changeEn">{{
              lang === 'en' ? 'English' : lang === 'zh' ? '英文' : '英文'
            }}</el-dropdown-item>
            <el-dropdown-item @click="changeTw">{{
              lang === 'tw'
                ? '中文繁體'
                : lang === 'en'
                ? 'Traditional Chinese'
                : '中文繁体'
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-tooltip
        :content="isDark ? $t('tooltip.lightmode') : $t('tooltip.darkmode')"
        placement="bottom"
      >
        <el-button @click="toggleThemeMode" circle>
          <el-icon v-if="isDark"><Sunny /></el-icon>
          <el-icon v-else><Moon /></el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        :content="!is_full ? $t('tooltip.enterfull') : $t('tooltip.leavefull')"
        placement="bottom"
      >
        <el-button
          circle
          style="display: block; margin: 0 20px"
          @click="onFullScrene"
        >
          <el-icon id="full"><FullScreen /></el-icon>
        </el-button>
      </el-tooltip>
      <el-dropdown>
        <el-avatar
          :size="50"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        >
        </el-avatar>
        <template #dropdown>
          <el-dropdown-menu class="dropdown-t">
            <el-dropdown-item @click="logOut">{{
              $t('system.logout')
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <HTabs></HTabs>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  ArrowDown,
  Expand,
  Fold,
  FullScreen,
  Sunny,
  Moon
} from '@element-plus/icons-vue'
import i18n from '../../../utils/i18n'
import { useLanguageStore } from '../../../store/languageStore'
import router from '../../../router/index'
import HTabs from '../../../components/HTabs/index.vue'
import { useCollapseStore } from '../../../store/collapse'
import HBreadcrumbs from '../../../components/HBreadcrumbs/index.vue'
import { isDark, toggleDark } from '../../../utils/dark'
function toggleThemeMode() {
  toggleDark()
  if (isDark.value) {
    document.body.setAttribute('dark-mode', 'true')
  } else {
    document.body.removeAttribute('dark-mode')
  }
}
// 刷新浏览器时
onMounted(() => {
  isDark.value && document.body.setAttribute('dark-mode', 'true')
})
const collapseStore = useCollapseStore()
const lang = ref<string>('zh')
const languageStore = useLanguageStore() // 使用语言Store
function changeCn() {
  lang.value = 'zh'
  i18n.global.locale = 'zh' // 切换中文
  languageStore.setLocale('zh')
}
function changeEn() {
  lang.value = 'en'
  i18n.global.locale = 'en' // 切换英文
  languageStore.setLocale('en')
}
function changeTw() {
  lang.value = 'tw'
  i18n.global.locale = 'tw' // 切换繁体
  languageStore.setLocale('tw')
}
// 退出登录
function logOut() {
  router.push('/login')
  localStorage.setItem('authtoken', '')
}
const isCollapse = ref<boolean>(true)
function onSetCollapse() {
  collapseStore.collapse = isCollapse.value
  isCollapse.value = !isCollapse.value
}
// 全屏
const is_full = ref<boolean>(false)
function onFullScrene() {
  if (!is_full.value) {
    is_full.value = true
    return document.documentElement.requestFullscreen()
  }
  is_full.value = false
  document.exitFullscreen()
}
</script>

<style lang="less" scoped>
body[dark-mode='true'] .header {
  border-bottom: 1px solid #414243; // 272727 414243
}
.header {
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 40px;
  padding-left: 15px;
  .header-left {
    font-size: 24px;
    display: flex;
    align-items: center;
  }
  .header-right {
    display: flex;
    align-items: center;
  }
}
.main {
  flex: 1;
}

.drop-button {
  width: 150px;
  margin-right: 30px;
}
.dropdown {
  width: 150px;
  z-index: 999;
}
.dropdown-t {
  z-index: 999;
}
</style>
