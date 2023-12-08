<!-- Tabs.vue -->
<template>
  <div>
    <el-tabs
      v-model="activeTab"
      @tab-click="handleTabClick"
      @tab-remove="closeTab"
      type="card"
    >
      <el-tab-pane
        v-for="(tab, index) in tabs"
        :key="index"
        :name="tab.route"
        :closable="closable"
        class="tab-pane"
      >
        <template #label>
          <div
            class="float"
            @contextmenu.prevent="openContextMenu($event, tab)"
          ></div>
          <div class="tab-content">
            <span
              class="round"
              :class="{ active: activeTab === tab.route }"
            ></span>
            <span class="label">{{ $t(`${tab.title.slice(1)}`) }}</span>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <ul
      v-show="contextMenuVisible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="reload" v-show="isReloadEnabled">
        <el-icon class="contentmenu-icon"><RefreshRight /></el-icon>
        <span>重新加载</span>
      </li>
      <li @click="closeCurrent">
        <el-icon class="contentmenu-icon"><Close /></el-icon>
        <span>关闭</span>
      </li>
      <li @click="closeOther">
        <el-icon class="contentmenu-icon"><Sort /></el-icon>
        <span>关闭其他</span>
      </li>
      <li @click="closeRight">
        <el-icon class="contentmenu-icon"><Right /></el-icon>
        <span>关闭右侧</span>
      </li>
      <li @click="closeLeft">
        <el-icon class="contentmenu-icon"><Back /></el-icon>
        <span>关闭左侧</span>
      </li>
      <li @click="closeAll">
        <el-icon class="contentmenu-icon"><Minus /></el-icon>
        <span>全部关闭</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElTabs, ElTabPane } from 'element-plus'
import { usePageCacheStore } from '../../store/pageCache'
import { useReloadStore } from '../../store/reload'
import {
  RefreshRight,
  Close,
  Minus,
  Right,
  Back,
  Sort
} from '@element-plus/icons-vue'
interface tabType {
  route: string
  title: string
}
const activeTab = ref<any>('')
const tabs = ref<tabType[]>([])

const route = useRoute()
const router = useRouter()
const pageCacheStore = usePageCacheStore()

function handleTabClick(tab: any) {
  const clickedTab = tabs.value[tab.index]
  if (clickedTab) {
    router.push(clickedTab.route)
  }
}

function closeTab(name: any) {
  const index = tabs.value.findIndex((tab: tabType) => tab.route === name)
  tabs.value.splice(index, 1)
  if (tabs.value.length === 0) {
    router.push('/home')
    pageCacheStore.removeCachedPage(name)
  } else if (activeTab.value === name) {
    // 判断是否关闭的是当前激活的标签
    // 设置 activeTab 为上一个标签的路由路径,当只剩一个标签时,跳转到最后剩下的路由即可
    const prevTab =
      tabs.value.length === 1 ? tabs.value[0] : tabs.value[index - 1]
    if (prevTab) {
      activeTab.value = prevTab.route
      router.push(prevTab.route)
      pageCacheStore.removeCachedPage(name)
    }
  }
  // 关闭的是未激活标签时
  pageCacheStore.removeCachedPage(name)
}

function addTab(title: any, route: any) {
  const existingTab = tabs.value.find((tab: any) => tab.route === route)
  if (!existingTab) {
    tabs.value.push({ title, route })
    activeTab.value = route // 切换到新增的标签页
    pageCacheStore.addCachedPage(route)
  } else {
    activeTab.value = route // 切换到已存在的标签页
    pageCacheStore.addCachedPage(route)
  }
}

// 右键菜单
const contextMenuVisible = ref<boolean>(false)
const left = ref<number>(0)
const top = ref<number>(0)
const currentTab = ref<any>()
function openContextMenu(e: MouseEvent, tab: tabType) {
  currentTab.value = tab
  if (tabs.value.length === 1 && activeTab.value === '/home') {
    return false
  }
  contextMenuVisible.value = true
  left.value = e.clientX - 210
  top.value = e.clientY + 10
}
watch(
  () => contextMenuVisible.value,
  () => {
    if (contextMenuVisible.value) {
      document.body.addEventListener('click', () => {
        contextMenuVisible.value = false
      })
    } else {
      document.body.removeEventListener('click', () => {
        contextMenuVisible.value = false
      })
    }
  }
)
// 关闭全部
function closeAll() {
  tabs.value = [{ route: '/home', title: '/home' }]
  router.push('/home')
}
// 关闭当前
function closeCurrent() {
  const theCloseTab = currentTab.value
  if (theCloseTab) {
    closeTab(theCloseTab.route)
    currentTab.value = null
  }
}
// 关闭右侧
function closeRight() {
  const theCloseTab = currentTab.value
  if (theCloseTab) {
    const index = tabs.value.findIndex(
      (tab: tabType) => tab.route === theCloseTab.route
    )
    const tabsToClose = tabs.value
      .slice(index + 1)
      .map((tab: tabType) => tab.route)
    tabsToClose.forEach((route: string) => {
      const tab = tabs.value.find((tab: tabType) => tab.route === route)
      if (tab) {
        closeTab(route)
      }
    })
  }
}
// 关闭左侧
function closeLeft() {
  const theCloseTab = currentTab.value
  if (theCloseTab) {
    const index = tabs.value.findIndex(
      (tab: tabType) => tab.route === theCloseTab.route
    )
    const tabsToClose = tabs.value.slice(0, index).map((tab) => tab.route)
    tabsToClose.forEach((route) => {
      const tab = tabs.value.find((tab: tabType) => tab.route === route)
      if (tab) {
        closeTab(route)
      }
    })
    // 当激活标签在左侧时，激活当前标签
    const indexActive = tabs.value.findIndex(
      (tab) => tab.route === activeTab.value
    )
    const indexCurrent = tabs.value.findIndex(
      (tab) => tab.route === theCloseTab.route
    )
    if (indexActive < indexCurrent) {
      router.push(theCloseTab.route)
    }
  }
}
// 关闭其他
function closeOther() {
  tabs.value = [currentTab.value]
  router.push(currentTab.value.route)
}
const isReloadEnabled = computed(() => {
  return currentTab.value && currentTab.value.route === activeTab.value
})
// 重新加载
const reloadStore = useReloadStore()
function reload() {
  reloadStore.incrementContentKey()
  console.log('111', reloadStore.contentKey)
}
onMounted(() => {
  // 页面加载时不再初始化标签页,保留当前路由的标签页
  if (route.path !== '/') {
    addTab(route.path, route.path)
  }
})

watch(
  () => route.path,
  (newPath) => {
    // 正则判断newPath有几个'/'
    let path = (newPath.match(/\//g) || []).length
    // 监听路由变化，根据路由添加标签页
    // if (newPath === '/' || path >= 2) return
    if (path >= 2) return
    addTab(newPath, newPath)
  }
)
const closable = ref<boolean>(true)
watch(
  () => tabs.value.length,
  (newLength) => {
    // 当标签数量为1且该标签是首页时，禁用关闭功能
    closable.value = !(newLength === 1 && tabs.value[0].route === '/home')
  }
)
onBeforeUnmount(() => {
  // 在组件销毁时的清理工作
})
</script>

<style lang="less" scoped>
.tab-header {
  display: flex;
  background-color: #f0f0f0;
}

.tab {
  padding: 8px 16px;
  cursor: pointer;
  user-select: none;
}

.tab.active {
  background-color: #e0e0e0;
}

.close {
  margin-left: 8px;
  cursor: pointer;
}
.tab-content {
  display: flex;
  align-items: center;
  .round {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ddd;
    margin-right: 8px;
  }
  .round.active {
    background: #4d70ff;
  }
}
:deep(.el-tabs__nav-scroll) {
  .el-tabs__nav {
    border-radius: 0 0 0 0 !important;
    transform: translateY(-2px) !important;
    .el-tabs__item {
      position: relative;
      // top: -4px;
      border-bottom: none;
    }
  }
}
:deep(.el-tabs__item) {
  position: relative;
  .float {
    position: absolute;
    background: rgba(0, 0, 0, 0);
    width: 100%;
    height: 100%;
  }
}

// 右键
.contextmenu {
  width: 110px;
  margin: 0;
  // border: 1px solid #ccc;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 3px;
  font-size: 14px;
  color: #333;
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.contextmenu li {
  height: 30px;
  margin-bottom: 5px;
  margin: 0 5px 0;
  border-radius: 3px;
  padding-left: 5px;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  .contentmenu-icon {
    width: 16px;
    font-size: 16px;
    margin-right: 5px;
  }
  span {
    flex: 1;
  }
}

.contextmenu li:hover {
  background: #f3f3f5;
  cursor: pointer;
}
.disabled {
  color: #9b9b9b;
  cursor: no-drop;
}
</style>
