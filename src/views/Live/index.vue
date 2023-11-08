<template>
  <div>
    <HModel>
      <template #body>
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          border
        >
          <el-table-column label="ID">
            <template #default="{ row }">{{ row.zhibo_log_id }}</template>
          </el-table-column>
          <el-table-column label="直播名称">
            <template #default="{ row }">{{ row.zhibo_name }}</template>
          </el-table-column>
          <el-table-column label="头像">
            <template #default="{ row }">{{ row.header_img }}</template>
          </el-table-column>
          <el-table-column label="直播开始时间">
            <template #default="{ row }">{{ formatTime(row.kbtime) }}</template>
          </el-table-column>
          <el-table-column label="直播结束时间">
            <template #default="{ row }">{{ formatTime(row.xbtime) }}</template>
          </el-table-column>
          <el-table-column label="直播总时间">
            <template #default="{ row }">{{
              formatTime(row.kb_time_long)
            }}</template>
          </el-table-column>
          <el-table-column label="礼物总数量">
            <template #default="{ row }">{{ row.lw_num }}</template>
          </el-table-column>
          <el-table-column label="礼物总价值">
            <template #default="{ row }">{{ row.lw_price }}</template>
          </el-table-column>
          <el-table-column label="礼物总收益">
            <template #default="{ row }">{{ row.lw_shouyi }}</template>
          </el-table-column>
          <el-table-column label="平台收益">
            <template #default="{ row }">{{ row.pt_shouyi }}</template>
          </el-table-column>
          <el-table-column label="游戏收益">
            <template #default="{ row }">{{ row.game_shouyi }}</template>
          </el-table-column>
          <el-table-column label="公会收益">
            <template #default="{ row }">{{ row.gonghui_shouyi }}</template>
          </el-table-column>
          <el-table-column label="主播收益">
            <template #default="{ row }">{{ row.zhubo_shouyi }}</template>
          </el-table-column>
          <el-table-column label="周期扣费">
            <template #default="{ row }">{{ row.del_dou }}</template>
          </el-table-column>
          <el-table-column label="最终收益">
            <template #default="{ row }">{{ row.last_shouyi }}</template>
          </el-table-column>
        </el-table>
      </template>
      <template #foot>
        <div class="pagination">
          <el-pagination
            background
            layout="total,prev, pager, next"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30]"
            :total="totalItems"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </template>
    </HModel>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getLiveRecording } from '../../api/live'
import HModel from '../../components/HModel/index.vue'
import Moment from 'moment'

const loading = ref<boolean>(false)
const tableData = ref<any>()
const currentPage = ref<any>()
const totalItems = ref<any>()
// 当页码发生变化时触发
function handleCurrentChange(newPage: number) {
  currentPage.value = newPage
  query()
}
async function query() {
  try {
    loading.value = true
    const response = await getLiveRecording({
      page: currentPage.value
    })
    tableData.value = response?.data?.list
    totalItems.value = response?.data?.count
    loading.value = false
  } catch (error) {
    console.error('Error fetching data: ', error)
  }
}
onMounted(() => {
  query()
})
// 时间格式化
function formatTime(time: number) {
  return time ? Moment(time * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
}
</script>

<style lang="less" scoped>
.pagination {
  margin-top: 20px;
  margin-right: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
