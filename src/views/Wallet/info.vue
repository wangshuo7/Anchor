<template>
  <div>
    <div>头像:{{ infos?.header_img }}</div>
    <div>公会名称:{{ infos?.gzs_title }}</div>
    <div>公会简介:{{ infos?.gzs_desc }}</div>
    <div>手机号:{{ infos?.mobile }}</div>
    <div>云豆:{{ infos?.current_price }}</div>
    <div>提现账号:{{ infos?.tx_card }}</div>
    <div>uid:{{ infos?.uid }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getPersonalInfo } from '../../api/wallet'
import { infoList } from '../../type/wallet'
const infos = ref<infoList>()

async function query() {
  const res = await getPersonalInfo()
  infos.value = res?.data?.one
}
onMounted(() => {
  query()
})
</script>

<style lang="less" scoped></style>
