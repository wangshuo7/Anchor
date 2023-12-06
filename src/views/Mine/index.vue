<template>
  <session>
    <el-form :form="queryForm" label-width="80px" @submit.prevent inline>
      <el-form-item label="游戏名称">
        <el-input
          @keyup.enter="query"
          v-model="queryForm.title"
          clearable
          placeholder="请输入游戏名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-select v-model="queryForm.sort" clearable>
          <el-option value="2" label="创建时间正序" />
          <el-option value="1" label="创建时间倒序" />
          <el-option value="4" label="热度正序" />
          <el-option value="3" label="热度倒序" />
          <el-option value="6" label="banner正序" />
          <el-option value="5" label="banner倒序" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button style="margin: 0 20px" type="primary" @click="query">{{
          $t('button.query')
        }}</el-button>
        <el-button @click="onClear">{{ $t('button.clear') }}</el-button>
      </el-form-item>
    </el-form>
  </session>
  <session>
    <HModel>
      <template #head>
        <span style="font-weight: bolder">我的游戏</span>
      </template>
      <template #body>
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%; height: 750px"
          border
        >
          <el-table-column label="ID">
            <template #default="{ row }">{{ row.game_id }}</template>
          </el-table-column>
          <el-table-column label="游戏名称" min-width="100">
            <template #default="{ row }">{{ row.title }}</template>
          </el-table-column>
          <el-table-column label="游戏语言">
            <template #default="{ row }">{{ row.game_lang_id }}</template>
          </el-table-column>
          <el-table-column label="游戏分类">
            <template #default="{ row }">{{ row.game_cate_id }}</template>
          </el-table-column>
          <el-table-column label="系统要求">
            <template #default="{ row }">{{ row.xitong_yaoqiu }}</template>
          </el-table-column>
          <el-table-column label="最低开播余额">
            <template #default="{ row }">{{ row.min_price }}</template>
          </el-table-column>
          <el-table-column label="固定价格">
            <template #default="{ row }">{{ row.price }}</template>
          </el-table-column>
          <el-table-column label="促销价格">
            <template #default="{ row }">{{ row.cuxiao_price }}</template>
          </el-table-column>
          <el-table-column label="分成比例">
            <template #default="{ row }">{{ row.divide }}</template>
          </el-table-column>
          <el-table-column label="客服信息">
            <template #default="{ row }">{{ row.kefu }}</template>
          </el-table-column>
          <el-table-column label="使用激活码">
            <template #default="{ row }">{{
              row.is_user_jhm == 1 ? '否' : '是'
            }}</template>
          </el-table-column>
          <el-table-column label="是否线上">
            <template #default="{ row }">{{
              row.is_xianxia == 1 ? '是' : '否'
            }}</template>
          </el-table-column>
          <el-table-column label="是否冻结">
            <template #default="{ row }">{{
              row.is_xianxia == 1 ? '否' : '是'
            }}</template>
          </el-table-column>
          <el-table-column label="公告">
            <template #default="{ row }">{{ row.gonggao }}</template>
          </el-table-column>
          <el-table-column label="套餐">
            <template #default="{ row }">
              <div v-for="(item, index) in row.taocan" :key="index">
                <div>套餐{{ index + 1 }}</div>
                <div>
                  <span>天数：</span><span>{{ item.tdays }}</span>
                </div>
                <div>
                  <span>价格：</span><span>{{ item.tprice }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.ctime')">
            <template #default="{ row }">{{ formatTime(row.ctime) }}</template>
          </el-table-column>
          <el-table-column :label="$t('table.utime')">
            <template #default="{ row }">{{ formatTime(row.uptime) }}</template>
          </el-table-column>
          <el-table-column
            fixed="right"
            :label="$t('table.operate')"
            min-width="215"
          >
            <template #default="{ row }">
              <el-button type="primary" @click="onViewRecord(row)"
                >开播记录</el-button
              >
              <el-button @click="goFeedback(row)">反馈列表</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #foot>
        <div class="pagination">
          <el-pagination
            background
            layout="total,prev, pager, next, sizes"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :page-sizes="[10, 20, 30]"
            :total="totalItems"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </template>
    </HModel>
  </session>
  <el-dialog v-model="dialogVisible" title="购买" width="70%">
    <Record :gameId="gameId"></Record>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: 'Mine'
}
</script>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { getMyGameList } from '../../api/mine'
import Record from './component/record.vue'
import Moment from 'moment'
import HModel from '../../components/HModel/index.vue'
import router from '../../router'

const queryForm = ref<any>({
  title: '',
  sort: ''
})
const tableData = ref<any>()
const dialogVisible = ref<boolean>()
const gameId = ref<any>() // 购买时所用id
const loading = ref<boolean>(false)
// 分页相关
const currentPage = ref<number>(1) // 当前页
const pageSize = ref<number>(10) // 每页显示条数
const totalItems = ref<number>(0) // 总数据条数

// 当每页显示条数发生变化时触发
function handleSizeChange(newSize: number) {
  pageSize.value = newSize
  currentPage.value = 1 // 切换每页显示条数时，重置到第一页
  query()
}

// 当页码发生变化时触发
function handleCurrentChange(newPage: number) {
  currentPage.value = newPage
  query()
}

// 添加表单
const form = ref<{
  tdays: string
  tprice: string
  code: string
}>({
  tdays: '',
  tprice: '',
  code: ''
})
// 购买
function onViewRecord(row: any) {
  dialogVisible.value = true
  gameId.value = row.game_id
}
// 反馈列表
function goFeedback(row: any) {
  router.push({
    name: 'MineFeedback',
    query: {
      id: row.game_id,
      name: row.title
    }
  })
}
// 查询
async function query() {
  try {
    loading.value = true
    const response = await getMyGameList({
      page: currentPage.value,
      page_size: pageSize.value,
      title: queryForm.value.title,
      orderby: queryForm.value.sort
    })
    tableData.value = response?.data?.list
    totalItems.value = response?.data?.count
    loading.value = false
  } catch (error) {
    console.error('Error fetching data: ', error)
  }
}
// 清空
function onClear() {
  queryForm.value = {}
}
watch(dialogVisible, () => {
  form.value = {
    tdays: '',
    tprice: '',
    code: ''
  }
})
// 获取列表
onMounted(() => {
  query()
})

// 时间格式化
function formatTime(time: number) {
  return time ? Moment(time * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 500px;
  background-color: rgb(214, 211, 211);
  padding: 10px;
}
.pagination {
  margin-top: 20px;
  margin-right: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
session {
  .el-input {
    width: 250px;
  }
}
</style>
