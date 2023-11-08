<template>
  <el-dialog v-model="props.visible" title="更多" width="50%" v-bind="$attrs">
    <div class="children" v-for="(child, index) in moreList" :key="index">
      <div class="par-left">
        <div class="img-box">
          <img v-if="child.tj_user == 1" src="../../../assets/huLogo1.jpg" />
          <img v-else src="../../../assets/huLogo.jpg" />
        </div>
      </div>
      <div class="par-right">
        <div class="first">
          <div style="display: flex; align-items: center">
            <span class="name">
              {{
                child.tj_user == 1
                  ? child.zhubo_username
                  : child.youxizuozhe_username
              }}
            </span>
            <span style="margin: 0 10px"
              ><el-tag type="info">回复</el-tag></span
            >
            <span class="reply-name">
              {{
                child.tj_user == 2
                  ? child.zhubo_username
                  : child.youxizuozhe_username
              }}
            </span>
            <span class="reply-content"> {{ child.pid_content }}</span>
          </div>
        </div>
        <div class="second">
          {{ child.content }}
        </div>
        <div class="third">
          <div class="time" style="color: #999">
            {{ formatTime(child.ctime) }}
          </div>
          <div
            class="reply"
            style="display: flex; align-items: center"
            @click="replyChild(child.game_feedback_id)"
            v-if="child.tj_user == 2"
          >
            <el-icon style="margin-right: 5px"><ChatRound /></el-icon>回复
          </div>
        </div>
        <div
          style="display: flex"
          v-if="replyStatesChild[child.game_feedback_id]"
        >
          <el-input
            style="width: 70%; margin-right: 20px"
            placeholder="请输入回复内容"
            type="text"
            v-model="childContent"
            @keyup.enter="replyChildConfirm(child.game_feedback_id)"
          />
          <el-button
            type="primary"
            @click="replyChildConfirm(child.game_feedback_id)"
            >回复</el-button
          >
        </div>
      </div>
    </div>
    <el-divider />
    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="currentPage"
        :total="total"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <!-- <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="closeDialog"> Confirm </el-button>
      </span>
    </template> -->
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getFeedMoreList, submitFeedback } from '../../../api/feedback'
import { ChatRound } from '@element-plus/icons-vue'
import moment from 'moment'
import { ElMessage } from 'element-plus'
const props = defineProps<{
  visible: boolean
  game_id: any
  first_id: any
}>()
const emit = defineEmits()
// function closeDialog() {
//   emit('close')
// }
// 列表
const moreList = ref<any>()
const childContent = ref<string>('') // 子级回复内容
const replyStatesChild = ref<any>({}) // 子级
const childNum = ref<number>(0)

// 分页
const currentPage = ref<number>(1)
const total = ref<number>()
// 换页
function handleCurrentChange(newPage: number) {
  currentPage.value = newPage
  query()
}
// 回复子级-打开input
function replyChild(id: any) {
  childNum.value++
  childContent.value = ''
  replyStatesChild.value = {} // 清空所有回复状态
  if (childNum.value % 2 != 0) {
    replyStatesChild.value[id] = true
  } else {
    replyStatesChild.value[id] = false
  }
}
// 回复子级
async function replyChildConfirm(id: any) {
  console.log(childContent.value)
  const res: any = await submitFeedback({
    content: childContent.value,
    game_feedback_id: id
  })
  if (res.code === 200) {
    ElMessage.success('回复成功')
  } else {
    ElMessage.error(res.msg)
  }
  childContent.value = ''
  replyStatesChild.value = {}
  query()
}
// 查询
async function query() {
  try {
    const res = await getFeedMoreList({
      page: currentPage.value,
      game_id: props.game_id,
      first_id: props.first_id
    })
    moreList.value = res.data?.list
    total.value = res.data?.count
  } catch (error) {
    console.error('Error fetching data: ', error)
  }
}
onMounted(() => {
  query()
})
// 时间格式化
function formatTime(time: number) {
  return time ? moment(time * 1000).format('YYYY-MM-DD') : '-'
}
</script>

<style lang="less" scoped>
.par-left {
  width: 60px;
  height: 100%;
  // background-color: purple;
  .img-box {
    width: 40px;
    height: 40px;
    margin: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.par-right {
  flex: 1;
  // background: skyblue;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  .first {
    height: 35px;
    // background: orange;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .name,
    .reply-name {
      font-weight: 900;
    }
    .reply-content {
      margin-left: 10px;
      display: block;
      width: 100px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      border-radius: 5px;
      text-indent: 2px;
      background-color: #9fb6d1d5;
    }
  }
  .second {
    flex: 1;
  }
  .third {
    height: 30px;
    // background: red;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .reply {
      color: rgb(193, 200, 211);
    }
    .reply:hover {
      cursor: pointer; // 小手
      color: #75869a;
    }
  }
}

.children {
  margin-left: 60px;
  // width: 100%;
  // height: 50px;
  // background: red;
  display: flex;
}
</style>
