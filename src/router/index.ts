import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import Login from '@/views/Login/index.vue'
const routes = [
  {
    path: '/',
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
      // 游戏管理
      {
        path: '/game',
        name: 'Game',
        component: () => import('@/views/Game/index.vue')
      },
      // 游戏反馈
      {
        path: '/game/feedback',
        name: 'GameFeedback',
        component: () => import('@/views/Feedback/index.vue')
      },
      // 我的游戏
      {
        path: '/mine',
        name: 'Mine',
        component: () => import('@/views/Mine/index.vue')
      },
      {
        path: '/mine/feedback',
        name: 'MineFeedback',
        component: () => import('@/views/Feedback/index.vue')
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
  // {
  //   path: '/',
  //   redirect: '/login'
  // }
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
