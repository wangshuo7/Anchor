import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import Login from '@/views/Login/index.vue'
const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Layout,
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: () => import('@/views/Welcome/index.vue')
      },
      // test
      {
        path: '/welcome/next',
        name: 'next',
        component: () => import('@/views/Welcome/next.vue')
      },
      // 主播
      {
        path: '/anchor',
        name: 'Anchor',
        component: () => import('@/views/Anchor/index.vue')
      },
      // 直播记录
      {
        path: '/live',
        name: 'Live',
        component: () => import('@/views/Live/index.vue')
      },
      // 个人信息
      {
        path: '/info',
        name: 'Info',
        component: () => import('@/views/Wallet/info.vue')
      },
      // 充值记录
      {
        path: '/recharge',
        name: 'Recharge',
        component: () => import('@/views/Wallet/recharge.vue')
      },
      // 消费记录
      {
        path: '/expend',
        name: 'Expend',
        component: () => import('@/views/Wallet/expend.vue')
      },
      // 充值卡
      {
        path: '/card',
        name: 'Card',
        component: () => import('@/views/Wallet/card.vue')
      },
      // 提现申请
      {
        path: '/withdrawal',
        name: 'Withdrawal',
        component: () => import('@/views/Wallet/withdrawal.vue')
      },
      // 转账
      {
        path: '/transfer',
        name: 'Transfer',
        component: () => import('@/views/Wallet/transfer.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export function useRouter() {
  return router
}

export function useRoute() {
  return router.currentRoute
}

export default router
