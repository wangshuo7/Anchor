<template>
  <div class="bread">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
        <router-link :to="item.to" @click="handleBreadcrumbClick(item.to)">{{
          $t(item.text)
        }}</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const breadcrumbItems = ref<any>([])

const updateBreadcrumb = () => {
  breadcrumbItems.value = generateBreadcrumb(router.currentRoute.value.path)
}

const generateBreadcrumb = (path: any) => {
  const segments = path.split('/').filter((segment: any) => segment !== '')
  return segments.map((segment: any, index: any) => ({
    text: segment,
    to: `/${segments.slice(0, index + 1).join('/')}`
  }))
}

const handleBreadcrumbClick = (to: string) => {
  // 使用 router.push() 来进行导航，但不刷新页面
  router.push(to).catch((error) => {
    if (error.name !== 'NavigationDuplicated') {
      throw error
    }
  })
}

onMounted(() => {
  updateBreadcrumb()

  // 监听路由变化并更新面包屑
  router.afterEach(() => {
    updateBreadcrumb()
  })
})
</script>

<style lang="less" scoped>
.bread {
  height: 50px;
  padding-left: 10px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid skyblue;
}
.el-breadcrumb {
  font-size: 18px;
}
</style>
