<template>
  <div class="query">
    <el-form :form="queryForm" label-width="80px" @submit.prevent inline>
      <el-form-item label="游戏名称">
        <el-input
          @keyup.enter="query"
          v-model="queryForm.title"
          clearable
          placeholder="请输入游戏名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="margin: 0 20px" type="primary" @click="query">{{
          $t('button.query')
        }}</el-button>
        <el-button @click="onClear">{{ $t('button.clear') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
  <HModel>
    <template #head>
      <span style="font-weight: bolder">{{ $t('game') }}</span>
    </template>
    <template #body>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%; height: 800px"
        border
      >
        <el-table-column label="ID">
          <template #default="{ row }">{{ row.game_id }}</template>
        </el-table-column>
        <el-table-column label="游戏名称" min-width="100">
          <template #default="{ row }">{{ row.title }}</template>
        </el-table-column>
        <el-table-column label="游戏语言">
          <template #default="{ row }">{{
            getLanguageTitle(row.game_lang_id)
          }}</template>
        </el-table-column>
        <el-table-column label="游戏分类">
          <template #default="{ row }">{{
            getCategoriesTitle(row.game_cate_id)
          }}</template>
        </el-table-column>
        <el-table-column label="游戏平台">
          <template #default="{ row }">{{
            getPlatformsTitle(row.game_pingtai_id)
          }}</template>
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
          min-width="185"
        >
          <template #default="{ row }">
            <el-button type="primary" @click="onBuyGame(row)">购买</el-button>
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
  <el-dialog v-model="dialogVisible" title="购买" width="30%">
    <div>
      <el-form :model="form" label-width="150px">
        <el-form-item label="天数">
          <el-input v-model="form.tdays" placeholder="请输入天数"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.tprice" placeholder="请输入价格"></el-input>
        </el-form-item>
        <el-form-item label="折扣券或免费激活码">
          <el-input
            v-model="form.code"
            placeholder="请输入折扣券或免费激活码"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="onComputed">计算</el-button>
      <div>
        <div>
          <span>天数：</span><span>{{ jisuanData?.days }}</span>
        </div>
        <div>
          <span>价格：</span><span>{{ jisuanData?.price }}</span>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{
          $t('button.cancel')
        }}</el-button>
        <el-button type="primary" @click="confirm">{{
          $t('button.confirm')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { buyGame, getGameList } from '../../api/game'
import Moment from 'moment'
import HModel from '../../components/HModel/index.vue'
import { ElMessage } from 'element-plus'
import { useGlobalStore } from '../../store/globalStore'
import router from '../../router'
const globalStore = useGlobalStore()
const platforms = ref<any>([]) // 获取平台
const languages = ref<any>([]) // 获取语言
const categories = ref<any>([]) // 获取分类
const getLanguageTitle = (game_lang_id: any) => {
  const ids = game_lang_id.split(',').map(Number)
  const titles = ids.map((id: any) => {
    const language = languages.value.find((item: any) => item.id === id)
    return language ? language.title : '未知'
  })
  return titles.join(',')
}
const getCategoriesTitle = (game_cate_id: any) => {
  const ids = game_cate_id.split(',').map(Number)
  const titles = ids.map((id: any) => {
    const category = categories.value.find((item: any) => item.id === id)
    return category ? category.title : '未知'
  })
  return titles.join(',')
}
const getPlatformsTitle = (game_pingtai_id: any) => {
  const ids = game_pingtai_id.split(',').map(Number)
  const titles = ids.map((id: any) => {
    const platform = platforms.value.find((item: any) => item.id === id)
    return platform ? platform.title : '未知'
  })
  return titles.join(',')
}
const queryForm = ref<any>({
  title: ''
})
const tableData = ref<any>()
const dialogVisible = ref<boolean>()
const buyID = ref<number>() // 购买时所用id
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
function onBuyGame(row: any) {
  dialogVisible.value = true
  buyID.value = row.game_id
}
// 弹出框确定
async function confirm() {
  const res: any = await buyGame({
    game_id: buyID.value,
    tdays: form.value.tdays,
    tprice: form.value.tprice,
    code: form.value.code
  })
  if (res.code === 200) {
    ElMessage.success('购买成功')
    dialogVisible.value = false
    query()
  }
}
// 反馈列表
function goFeedback(row: any) {
  router.push({
    name: 'GameFeedback',
    query: {
      id: row.game_id,
      name: row.title
    }
  })
}
// 计算
const jisuanData = ref<any>()
async function onComputed() {
  const res: any = await buyGame({
    game_id: buyID.value,
    tdays: form.value.tdays,
    tprice: form.value.tprice,
    code: form.value.code,
    is_jisuan: 1
  })
  jisuanData.value = res.data
  if (res.code === 200) {
    ElMessage.success('计算成功')
  }
}
// 查询
async function query() {
  try {
    loading.value = true
    const response = await getGameList({
      page: currentPage.value,
      page_size: pageSize.value,
      title: queryForm.value.title,
      orderby: ''
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
onMounted(async () => {
  await globalStore.setLanguage()
  await globalStore.setCategory()
  await globalStore.setPlatform()
  languages.value = globalStore.language
  categories.value = globalStore.category
  platforms.value = globalStore.platform
  console.log(languages.value)
  console.log(categories.value)
  console.log(platforms.value)

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
.query {
  margin-top: 20px;
  .el-input {
    width: 250px;
  }
}
</style>
