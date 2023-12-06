<template>
  <session>
    <div class="card">
      <el-card shadow="never">
        <template #header>
          <span>{{ $t('info') }}</span>
        </template>
        <div class="img">
          <div class="img-box">
            <img
              src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
              alt="头像"
            />
            <!-- <img :src="infos.header_img" alt=""> -->
          </div>
        </div>
        <el-divider></el-divider>
        <div class="info-item">
          <span>{{ $t('table.nickname') }}</span>
          <span>{{ infos?.nickname }}</span>
        </div>
        <el-divider></el-divider>
        <div class="info-item">
          <span>{{ $t('table.price') }}</span>
          <span>{{ infos?.current_price }}</span>
        </div>
        <el-divider></el-divider>
        <div class="info-item">
          <span>uid</span>
          <span>{{ infos?.uid }}</span>
        </div>
        <el-divider></el-divider>
      </el-card>
    </div>
  </session>
</template>

<script lang="ts">
export default {
  name: 'Info'
}
</script>
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

<style lang="less" scoped>
.card {
  width: 300px;
  .img {
    height: 150px;
    margin-bottom: 20px;
    .img-box {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin: 0 auto;
      overflow: hidden;
      img {
        width: 150px;
        height: 150px;
      }
    }
  }
}
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
