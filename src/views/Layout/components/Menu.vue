<template>
  <div class="left">
    <div class="logo">
      <img class="logo-img" src="@/assets/huLogo1.jpg" alt="" />
    </div>
    <div>
      <el-menu
        :default-active="getActiveMenu(route.path)"
        class="el-menu-vertical-demo"
        router
      >
        <el-menu-item index="/game">
          <el-icon><SwitchFilled /></el-icon>
          <template #title>{{ $t('game') }}</template>
        </el-menu-item>
        <el-menu-item index="/mine">
          <el-icon><Orange /></el-icon>
          <template #title>{{ $t('mine') }}</template>
        </el-menu-item>
        <el-menu-item index="/live">
          <el-icon><VideoCamera /></el-icon>
          <template #title>{{ $t('live') }}</template>
        </el-menu-item>
        <el-sub-menu index="/wallet">
          <template #title>
            <el-icon><Postcard /></el-icon>
            <span>{{ $t('wallet') }}</span>
          </template>
          <el-menu-item index="/info">{{ $t('info') }}</el-menu-item>
          <el-menu-item index="/recharge">{{ $t('recharge') }}</el-menu-item>
          <el-menu-item index="/expend">{{ $t('expend') }}</el-menu-item>
          <el-menu-item index="/card">{{ $t('card') }}</el-menu-item>
          <el-menu-item index="/withdrawal">{{ $t('withdrawal') }}</el-menu-item>
          <el-menu-item index="/transfer">{{ $t('transfer') }}</el-menu-item>
        </el-sub-menu>
        <!-- <el-menu-item index="personal" @click="goPersonal">
          <el-icon><setting /></el-icon>
          <template #title>{{ $t('personal') }}</template>
        </el-menu-item> -->
      </el-menu>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  Orange,
  VideoCamera,
  Postcard,
  SwitchFilled
} from '@element-plus/icons-vue'

// import router from '../../../router'
import { useRoute } from 'vue-router'
const route = useRoute()
const getActiveMenu = (path: string) => {
  // 检查路径是否以某个标识符开头，例如 '/game'
  if (path.startsWith('/game')) {
    return '/game';
  } else if (path.startsWith('/mine')) {
    return '/mine';
  }
  return path;
};
// function goGame() {
//   router.push('/game')
// }
// function goMine() {
//   router.push('/mine')
// }
// function goLive() {
//   router.push('/live')
// }
// function onGoInfo() {
//   router.push('/info')
// }
// function onGoRecharge() {
//   router.push('/recharge')
// }
// function onGoExpend() {
//   router.push('/expend')
// }
// function onGoCard() {
//   router.push('/card')
// }
// function onGoWithdrawal() {
//   router.push('/withdrawal')
// }
// function onGoTransfer() {
//   router.push('/transfer')
// }
</script>
<style lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100%;
  height: 100%;
  border-right: 2px solid #dcdfe6;
}
.left {
  width: 100%;
  height: 100vh;
  border-right: 2px solid #dcdfe6;
  display: flex;
  flex-direction: column;
  .logo {
    height: 70px;
    background-color: orange;
    border-bottom: 1px solid skyblue;
    .logo-img {
      display: block;
      width: 35%;
      overflow: hidden;
      margin: 0 auto;
    }
  }
}
:deep(.el-menu) {
  border: none;
}
</style>

<!-- 

  <template>
  <div>
    <el-tabs v-model="activeTab" @tab-click="handleTabClick" type="card">
      <el-tab-pane
        v-for="(tab, index) in tabs"
        :key="index"
        :label="$t(`${tab.title.slice(1)}`)"
        :name="tab.route"
        closable
      />
    </el-tabs>

    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElTabs } from 'element-plus';

const activeTab = ref<any>('');
const tabs = ref<any>([]);

const route = useRoute();
const router = useRouter();

// 缓存对象
const tabCache = {};
// 存储需要被缓存的页面路径
const cachedPages = ['/recharge', '/expend', '/card']; // 根据实际需求添加路径

function handleTabClick(tab: any) {
  const clickedTab = tabs.value[tab.index];
  if (clickedTab) {
    router.push(clickedTab.route);
  }
}

function closeTab(name: any) {
  const index = tabs.value.findIndex((tab: any) => tab.route === name);
  tabs.value.splice(index, 1);

  // 移除缓存前检查是否需要保留缓存
  if (!cachedPages.includes(name)) {
    // 移除缓存
    delete tabCache[name];
  }

  if (tabs.value.length === 0) {
    router.push('/');
  } else if (activeTab.value === name) {
    const prevTab = tabs.value[index - 1];
    if (prevTab) {
      activeTab.value = prevTab.route;
      router.push(prevTab.route);
    }
  }
}

function addTab(title: any, route: any) {
  const existingTab = tabs.value.find((tab: any) => tab.route === route);

  if (!existingTab) {
    tabs.value.push({ title, route });
    activeTab.value = route;

    // 添加到缓存
    tabCache[route] = true;
  } else {
    activeTab.value = route;
  }
}

onMounted(() => {
  // 页面加载时不再初始化标签页
});

watch(() => route.path, (newPath) => {
  // 监听路由变化，根据路由添加标签页
  addTab(newPath, newPath);
});

onBeforeUnmount(() => {
  // 在组件销毁时的清理工作
});
</script>

<style scoped>
/* ... */
</style>

 -->