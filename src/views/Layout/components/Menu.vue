<template>
  <div class="left">
    <div class="logo">
      <img class="logo-img" src="@/assets/huLogo1.jpg" alt="" />
    </div>
    <div>
      <el-menu default-active="1" class="el-menu-vertical-demo">
        <el-menu-item index="anchor" @click="goAnchor">
          <el-icon><Orange /></el-icon>
          <template #title>{{ $t('anchor') }}</template>
        </el-menu-item>
        <el-menu-item index="live" @click="goLive">
          <el-icon><VideoCamera /></el-icon>
          <template #title>{{ $t('live') }}</template>
        </el-menu-item>
        <el-sub-menu index="wallet">
          <template #title>
            <el-icon><Postcard /></el-icon>
            <span>{{ $t('wallet') }}</span>
          </template>
          <el-menu-item index="wallet-1" @click="onGoInfo">{{
            $t('info')
          }}</el-menu-item>
          <el-menu-item index="wallet-2" @click="onGoRecharge">{{
            $t('recharge')
          }}</el-menu-item>
          <el-menu-item index="wallet-3" @click="onGoExpend">{{
            $t('expend')
          }}</el-menu-item>
          <el-menu-item index="wallet-4" @click="onGoCard">{{
            $t('card')
          }}</el-menu-item>
          <el-menu-item index="wallet-5" @click="onGoWithdrawal">{{
            $t('withdrawal')
          }}</el-menu-item>
          <el-menu-item index="wallet-6" @click="onGoTransfer">{{
            $t('transfer')
          }}</el-menu-item>
        </el-sub-menu>
        <!-- <el-menu-item index="personal" @click="goPersonal">
          <el-icon><setting /></el-icon>
          <template #title>{{ $t('menu.personal') }}</template>
        </el-menu-item> -->
      </el-menu>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Orange, VideoCamera, Postcard } from '@element-plus/icons-vue'

import router from '../../../router'
function goAnchor() {
  router.push('/anchor')
}
function goLive() {
  router.push('/live')
}
function onGoInfo() {
  router.push('/info')
}
function onGoRecharge() {
  router.push('/recharge')
}
function onGoExpend() {
  router.push('/expend')
}
function onGoCard() {
  router.push('/card')
}
function onGoWithdrawal() {
  router.push('/withdrawal')
}
function onGoTransfer() {
  router.push('/transfer')
}
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
