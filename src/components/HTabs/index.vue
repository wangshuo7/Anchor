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
        :label="$t(`${tab.title.slice(1)}`)"
        :name="tab.route"
        closable
      />
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElTabs, ElTabPane } from 'element-plus'
import { usePageCacheStore } from '../../store/pageCache'
const activeTab = ref<any>('')
const tabs = ref<any>([])

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
  const index = tabs.value.findIndex((tab: any) => tab.route === name)
  tabs.value.splice(index, 1)

  if (tabs.value.length === 0) {
    router.push('/')
    pageCacheStore.removeCachedPage(name)
  } else if (activeTab.value === name) {
    // 判断是否关闭的是当前激活的标签
    // 设置 activeTab 为上一个标签的路由路径,当只剩一个标签时,跳转到最后剩下的路由即可
    const prevTab =
      tabs.value.length === 1 ? tabs.value[0] : tabs.value[index - 1]
    // console.log('prevtab',prevTab)
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
    if (newPath === '/' || path >= 2) return
    addTab(newPath, newPath)
  }
)

onBeforeUnmount(() => {
  // 在组件销毁时的清理工作
})
</script>

<style scoped>
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
</style>
