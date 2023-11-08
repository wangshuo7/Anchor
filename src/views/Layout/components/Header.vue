<template>
  <div class="header">
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
  <HBreadcrumbs></HBreadcrumbs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import i18n from '../../../utils/i18n'
import { useLanguageStore } from '../../../store/languageStore'
import router from '../../../router/index'
import HBreadcrumbs from '../../../components/HBreadcrumbs/index.vue'

// test

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
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  height: 70px;
  background-color: orange;
  border-bottom: 1px solid skyblue;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 40px;
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
