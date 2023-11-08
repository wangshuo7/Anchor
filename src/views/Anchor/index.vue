<template>
  <div class="query">
    <el-form :form="queryForm" label-width="80px" @submit.prevent inline>
      <el-form-item label="用户名">
        <el-input
          @keyup.enter="query"
          v-model="queryForm.username"
          clearable
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input
          @keyup.enter="query"
          v-model="queryForm.mobile"
          clearable
          placeholder="请输入手机号"
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
      <span style="font-weight: bolder">{{ $t('menu.anchor') }}</span>
      <div>
        <el-button type="primary" @click="onAddAnchor">{{
          $t('button.add')
        }}</el-button>
      </div>
    </template>
    <template #body>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="ID">
          <template #default="{ row }">{{ row.uid }}</template>
        </el-table-column>
        <el-table-column label="用户名">
          <template #default="{ row }">{{ row.username }}</template>
        </el-table-column>
        <el-table-column label="手机号">
          <template #default="{ row }">{{ row.mobile }}</template>
        </el-table-column>
        <el-table-column label="抽成">
          <template #default="{ row }">{{ row.choucheng }}</template>
        </el-table-column>
        <el-table-column :label="$t('table.ctime')">
          <template #default="{ row }">{{ formatTime(row.ctime) }}</template>
        </el-table-column>
        <el-table-column label="当前云豆">
          <template #default="{ row }">{{ row.current_price }}</template>
        </el-table-column>
        <el-table-column label="历史总云豆">
          <template #default="{ row }">{{ row.history_all_price }}</template>
        </el-table-column>
        <el-table-column label="历史提现云豆">
          <template #default="{ row }">{{ row.history_tixian_price }}</template>
        </el-table-column>
        <el-table-column :label="$t('table.ctime')">
          <template #default="{ row }">{{ formatTime(row.ctime) }}</template>
        </el-table-column>
        <el-table-column :label="$t('table.utime')">
          <template #default="{ row }">{{ formatTime(row.uptime) }}</template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('table.operate')" width="160">
          <template #default="{ row }">
            <el-button @click="onEditAnchor(row)" type="success">{{
              $t('button.edit')
            }}</el-button>
            <el-button @click="delAnchors(row)" type="danger">{{
              $t('button.del')
            }}</el-button>
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
  <el-dialog
    v-model="dialogVisible"
    :title="operation === '添加' ? $t('button.add') : $t('button.edit')"
    width="30%"
  >
    <div>
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="抽成">
          <el-input v-model="form.choucheng"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{
          $t('button.cancel')
        }}</el-button>
        <el-button type="primary" @click="confirmLang">{{
          $t('button.confirm')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import {
  getAnchorList,
  addAnchor,
  editAnchor,
  delAnchor
} from '../../api/anchor'
import { langList } from '../../type/language'
import Moment from 'moment'
import HModel from '../../components/HModel/index.vue'
import { ElMessage } from 'element-plus'
const queryForm = ref<any>({
  title: ''
})
const tableData = ref<langList[]>()
const dialogVisible = ref<boolean>()
const operation = ref<string>('') // 操作 add \ edit
const editId = ref<number>() // 编辑时所用id
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
  username: string
  password: string
  mobile: string
  nickname: string
  choucheng: string
}>({
  username: '',
  password: '',
  mobile: '',
  nickname: '',
  choucheng: ''
})
// 添加
function onAddAnchor() {
  operation.value = '添加'
  dialogVisible.value = true
}
// 编辑
function onEditAnchor(row: any) {
  operation.value = '编辑'
  setTimeout(() => {
    form.value.username = row.username
    form.value.password = row.password
    form.value.mobile = row.mobile
    form.value.nickname = row.nickname
    form.value.choucheng = row.choucheng
  }, 50)
  dialogVisible.value = true
  editId.value = row.uid
  console.log(editId.value)
}
// 弹出框确定
async function confirmLang() {
  if (operation.value == '添加') {
    const res: any = await addAnchor({
      username: form.value.username,
      password: form.value.password,
      mobile: form.value.mobile,
      nickname: form.value.nickname,
      choucheng: form.value.choucheng
    })
    if (res.code === 200) {
      ElMessage.success('添加成功')
      dialogVisible.value = false
      currentPage.value = 1
      query()
    }
  } else {
    const res: any = await editAnchor({
      zhubo_uid: editId.value,
      username: form.value.username,
      password: form.value.password,
      mobile: form.value.mobile,
      nickname: form.value.nickname,
      choucheng: form.value.choucheng
    })
    if (res.code === 200) {
      ElMessage.success('编辑成功')
      dialogVisible.value = false
      query()
    }
  }
}
// 删除
async function delAnchors(row: any) {
  const res: any = await delAnchor({ ids: [row.uid] })
  if (res.code === 200) {
    ElMessage.success('删除成功')
    query()
  }
}
// 查询
async function query() {
  try {
    loading.value = true
    const response = await getAnchorList({
      page: currentPage.value,
      page_size: pageSize.value,
      username: queryForm.value.username,
      mobile: queryForm.value.mobile
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
    username: '',
    password: '',
    mobile: '',
    nickname: '',
    choucheng: ''
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
.query {
  margin-top: 40px;
  .el-input {
    width: 250px;
  }
}
</style>
