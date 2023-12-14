<template>
  <session>
    <div>欢迎</div>
  </session>
</template>

<script lang="ts">
export default {
  name: 'Home'
}
</script>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { getPersonalInfo } from '../../api/wallet'
async function query() {
  await getPersonalInfo()
}
onMounted(() => {
  query()
})
</script>

<style lang="less" scoped></style>
