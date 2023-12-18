<template>
  <session style="min-width: 1100px">
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
  <session style="min-width: 1100px">
    <HModel style="min-width: 1050px">
      <template #head>
        <div style="font-weight: bolder">
          <span>{{ $t('game') }}</span>
          <span style="font-size: 12px; color: #7e7e7e"
            >（点击图片查看详情）</span
          >
        </div>
      </template>
      <template #body>
        <div class="game-box">
          <div
            class="game-item"
            v-for="(item, index) in tableData"
            :key="index"
            @click="onViewDetails(item)"
            style="
              background-image: url('/danzhu-card.jpg');
              background-size: 100%;
            "
          >
            <div class="game-item-top">
              <!-- <img src="/danzhu-card.jpg" style="width: 100%; height: auto" /> -->
            </div>
            <div class="game-item-bottom">
              <!-- <img src="/danzhu-card.jpg" style="width: 100%; height: auto" /> -->
              <span class="bottom-title">{{ item.title }}</span>
              <span class="bottom-subtitle">{{ item.jianjie }}</span>
            </div>
          </div>
        </div>
      </template>
      <template #foot>
        <div class="pagination">
          <el-pagination
            background
            layout="total,prev, pager, next, sizes"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :page-sizes="[9, 18, 27, 36]"
            :total="totalItems"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </template>
    </HModel>
  </session>

  <!-- 购买 -->
  <!-- <el-dialog v-model="dialogVisible" width="30%">
    <template #header>
      <div>
        <span style="margin-right: 20px">购买</span>
        <el-tag size="large">{{ game_name }}</el-tag>
      </div>
    </template>
    <div>
      <el-form ref="ruleFormRef" :model="form" label-width="100px">
        <el-form-item label="套餐">
          <el-select
            v-model="thePackage"
            placeholder="请选择套餐"
            @change="selectPackage"
          >
            <el-option label="自定义" :value="0"></el-option>
            <el-option
              v-for="(item, index) in packages"
              :key="item.id"
              :label="`套餐${index + 1}(${item.tdays}天，${item.tprice}云豆)`"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="天数"
          prop="tdays"
          :rules="[
            {
              required: true,
              message: '请填写天数',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="form.tdays"
            type="number"
            :disabled="thePackage !== 0"
            placeholder="请输入天数"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="价格"
          prop="tprice"
          :rules="[
            {
              required: true,
              message: '请填写价格',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="form.tprice"
            type="number"
            :disabled="thePackage !== 0"
            placeholder="请输入价格"
          ></el-input>
        </el-form-item>
        <el-form-item label="折扣券或免费激活码">
          <el-input
            v-model="form.code"
            placeholder="请输入折扣券或免费激活码"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{
          $t('button.cancel')
        }}</el-button>
        <el-button type="primary" @click="confirmOrder">{{
          $t('button.confirmOrder')
        }}</el-button>
      </span>
    </template>
  </el-dialog> -->
  <!-- 确认购买 -->
  <!-- <el-dialog
    v-model="secondVisible"
    :title="$t('button.confirmOrder')"
    width="30%"
  >
    <div>
      <span>天数：</span><span>{{ jisuanData?.days }}</span>
    </div>
    <div>
      <span>价格：</span><span>{{ jisuanData?.price }}</span>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="secondVisible = false">{{
          $t('button.cancel')
        }}</el-button>
        <el-button type="primary" @click="confirm">购买</el-button>
      </span>
    </template>
  </el-dialog> -->
  <!-- 详情 -->
  <el-dialog v-model="detailVisible" :title="game_name" width="945">
    <div class="detail">
      <div
        class="detail-head"
        style="
          background-image: linear-gradient(
              to right,
              rgba(51, 54, 58, 1) 0%,
              rgba(51, 54, 58, 1) 40%,
              rgba(51, 54, 58, 0) 70%
            ),
            url('/danzhu-card.jpg');
          background-repeat: no-repeat;
          background-position: right;
        "
      >
        <div class="head-left">
          <div class="head-title">{{ game_detail.title }}</div>
          <div class="info">{{ game_detail.jianjie }}</div>
          <div class="price" v-if="game_detail.cuxiao_price">
            ￥{{ game_detail.price }}
          </div>
          <div class="cuxiao-price">
            ￥{{
              game_detail.cuxiao_price
                ? game_detail.cuxiao_price
                : game_detail.price
            }}
          </div>
          <div class="btns">
            <!-- <el-button type="danger" size="large" @click="onBuyGame"
              >购买游戏</el-button
            > -->
            <el-button type="success" size="large" @click="recordVisible = true"
              >开播记录</el-button
            >
            <el-button type="warning" size="large" :disabled="!game_detail.kefu"
              >客服</el-button
            >
          </div>
        </div>
      </div>
      <!-- 套餐 -->
      <div class="detail-info package">
        <h3>套餐</h3>
        <div class="package-content">
          <div
            class="package-card"
            v-for="(item, index) in game_detail.taocan"
            :key="index"
          >
            <div class="card-left">套餐{{ index + 1 }}</div>
            <div class="card-right">
              <div>
                <span>天数：</span><span>{{ item.tdays }}</span>
              </div>
              <div>
                <span>价格：</span><span>{{ item.tprice }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 详细信息 -->
      <div class="detail-info">
        <h3>详细信息</h3>
        <div class="info-item">
          <div>
            <span>开播余额:</span><span>{{ game_detail.min_price }}</span>
          </div>
          <div>
            <span>分成比例:</span><span>{{ game_detail.divide }}</span>
          </div>
          <div>
            <span>更新时间:</span
            ><span>{{ formatTime(game_detail.uptime) }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
  <el-dialog v-model="recordVisible" :title="game_name">
    <Record :gameId="game_detail.mg_id"></Record>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: 'Game'
}
</script>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { getMyGameList } from '../../api/mine'
import Moment from 'moment'
import HModel from '../../components/HModel/index.vue'
import { FormInstance } from 'element-plus'
// import { useGlobalStore } from '../../store/globalStore'
// import router from '../../router'
import { useWindowSizeStore } from '../../store/windowStore'
import { useToast } from 'vue-toastification'
import Record from './component/record.vue'

const Toast = useToast()
const detailVisible = ref<boolean>(false) // 详情
const recordVisible = ref<boolean>(false) // 开播记录
const windowSize = useWindowSizeStore()
window.addEventListener('resize', () => {
  windowSize.updateWindowSize()
})
const buyID = ref<number>() // 购买时所用id
const game_name = ref<string>() // 购买游戏名称
const game_detail = ref<any>() // 游戏详情
// const my_game = ref<any>() // 我的游戏
const loading = ref<boolean>(false)
// 套餐
const thePackage = ref<number>(0)
// const packages = computed(() => {
//   const item =
//     tableData.value.find((game: any) => game.game_id === buyID.value) || {}
//   return item.taocan.map((i: any, index: number) => {
//     return Object.assign({}, i, { id: index + 1 })
//   })
// })

// const globalStore = useGlobalStore()
// const platforms = ref<any>([]) // 获取平台
// const languages = ref<any>([]) // 获取语言
// const categories = ref<any>([]) // 获取分类
// const getLanguageTitle = (game_lang_id: any) => {
//   const ids = game_lang_id.split(',').map(Number)
//   const titles = ids.map((id: any) => {
//     const language = languages.value.find((item: any) => item.id === id)
//     return language ? language.title : '未知'
//   })
//   return titles.join(',')
// }
// const getCategoriesTitle = (game_cate_id: any) => {
//   const ids = game_cate_id.split(',').map(Number)
//   const titles = ids.map((id: any) => {
//     const category = categories.value.find((item: any) => item.id === id)
//     return category ? category.title : '未知'
//   })
//   return titles.join(',')
// }
// const getPlatformsTitle = (game_pingtai_id: any) => {
//   const ids = game_pingtai_id.split(',').map(Number)
//   const titles = ids.map((id: any) => {
//     const platform = platforms.value.find((item: any) => item.id === id)
//     return platform ? platform.title : '未知'
//   })
//   return titles.join(',')
// }
const queryForm = ref<any>({
  title: '',
  sort: ''
})
const tableData = ref<any>()
const dialogVisible = ref<boolean>()
// const secondVisible = ref<boolean>()
const ruleFormRef = ref<FormInstance>()
// 分页相关
const currentPage = ref<number>(1) // 当前页
const pageSize = ref<number>(18) // 每页显示条数
const totalItems = ref<number>(0) // 总数据条数
// function selectPackage() {
//   if (thePackage.value === 0) {
//     ruleFormRef.value?.resetFields()
//     return
//   }
//   ruleFormRef.value?.clearValidate(['tprice', 'tdays'])
//   const selectedPackageItem = packages.value.find(
//     (item: any) => item.id === thePackage.value
//   )
//   // 检查选中的套餐对象是否存在
//   if (selectedPackageItem) {
//     const { tdays, tprice } = selectedPackageItem
//     form.value.tdays = tdays
//     form.value.tprice = tprice
//   }
// }
// function confirmOrder() {
//   ruleFormRef.value?.validate((valid, filed) => {
//     if (valid) {
//       // secondVisible.value = true
//       onComputed()
//     } else {
//       // 表单验证未通过
//       console.log('filed', filed)
//     }
//   })
// }

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
// function onBuyGame() {
//   dialogVisible.value = true
// }
// 详情
function onViewDetails(row: any) {
  detailVisible.value = true
  buyID.value = row.game_id
  game_name.value = row.title
  game_detail.value = row
  // console.log('detail', game_detail.value)
  row.gonggao &&
    Toast.info(`公告: ${row.gonggao}`, <any>{
      position: 'top-center',
      timeout: 4000
    })
}
// 详情弹出框消失时，公告消失
watch(
  () => detailVisible.value,
  (newVal) => {
    if (!newVal) Toast.clear()
  }
)
// 弹出框确定
// async function confirm() {
//   const res: any = await buyGame({
//     game_id: buyID.value,
//     tdays: form.value.tdays,
//     tprice: form.value.tprice,
//     code: form.value.code
//   })
//   if (res.code === 200) {
//     ElMessage.success('购买成功')
//     dialogVisible.value = false
//     secondVisible.value = false
//     updateMyGame()
//     query()
//   }
// }
/**
 * 详情
 */
// 反馈列表
// function goFeedback(row: any) {
//   router.push({
//     name: 'GameFeedback',
//     query: {
//       id: row.game_id,
//       name: row.title
//     }
//   })
// }
// 计算
// const jisuanData = ref<any>()
// async function onComputed() {
//   const res: any = await buyGame({
//     game_id: buyID.value,
//     tdays: form.value.tdays,
//     tprice: form.value.tprice,
//     code: form.value.code,
//     is_jisuan: 1
//   })
//   jisuanData.value = res.data
//   if (res.code === 200) {
//     secondVisible.value = true
//   }
// }
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
  thePackage.value = 0
  ruleFormRef.value?.resetFields()
  form.value = {
    tdays: '',
    tprice: '',
    code: ''
  }
})
// 获取列表
onMounted(async () => {
  // await globalStore.setLanguage()
  // await globalStore.setCategory()
  // await globalStore.setPlatform()
  // languages.value = globalStore.language
  // categories.value = globalStore.category
  // platforms.value = globalStore.platform
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

.game-box {
  width: 100%;
  // display: flex;
  // justify-content: flex-start;
  // align-items: center;
  // flex-wrap: wrap;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(206px, 1fr));
  gap: 20px;
  padding: 0 50px;
  .game-item {
    width: 206px;
    height: 156px;
    background: #ccc;
    border-radius: 10px;
    // margin: 0 50px 50px 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .game-item-top {
      height: 96px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .game-item-bottom {
      padding-top: 10px;
      height: 60px;
      // background-color: #000;
      backdrop-filter: blur(20px);
      border-radius: 0 0 10px 10px;
      overflow: hidden;
      position: relative;
      .bottom-title {
        color: #fff;
        padding-left: 10px;
        margin-bottom: 5px;
      }
      .bottom-subtitle {
        color: #9e9597;
        padding-left: 10px;
        width: 100%;
        text-wrap: nowrap;
        // line-height: 36px;
        overflow: hidden;
      }
    }
  }
}
// 详情-弹出框
.detail {
  .detail-head {
    width: 900px;
    height: 260px;
    position: relative;
    border-radius: 15px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    .head-left {
      flex: 1;
      color: #fff;
      .head-title {
        font-size: 20px;
        margin-bottom: 20px;
      }
      .info {
        height: 20px;
        margin-bottom: 20px;
      }
      .price {
        text-decoration: line-through;
        height: 18px;
        color: #f5f5f599;
      }
      .cuxiao-price {
        font-size: 18px;
        height: 18px;
        margin-bottom: 50px;
        color: #f5f5f5;
      }
      .btns {
        .el-button {
          width: 100px;
        }
      }
    }
  }
  .detail-info {
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    h3 {
      color: #000;
      height: 40px;
    }
    .info-item {
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      span:first-child {
        margin-right: 20px;
      }
    }
  }
  .package {
    margin-bottom: 20px;
    width: 100%;
    .package-content {
      display: flex;
      flex-wrap: wrap;
      .package-card {
        width: 170px;
        height: 80px;
        margin: 0 20px 20px 0;
        border: 2px solid #caa3a3;
        border-radius: 10px;
        display: flex;
        background: #ff9f79;
        // background: #f56c6c;
        .card-left {
          width: 50px;
          height: 100%;
          border-right: 2px solid #caa3a3;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .card-right {
          padding: 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          // align-items: center;
        }
      }
    }
  }
}
</style>
