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
            <template #default="{ row }">{{ row.liushui_log_id }}</template>
          </el-table-column>
          <el-table-column label="内容">
            <template #default="{ row }">{{ row.content }}</template>
          </el-table-column>
          <el-table-column label="充值云豆">
            <template #default="{ row }">{{ row.price }}</template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template #default="{ row }">{{ formatTime(row.ctime) }}</template>
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
import { getRecharge } from '../../api/wallet'
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
    const response = await getRecharge({
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
