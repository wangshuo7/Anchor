<template>
  <div class="main">
    <el-tag
      type="success"
      style="width: 100px; height: 30px; margin-bottom: 20px"
      >{{ gameName }}</el-tag
    >
    <div v-if="feedback?.length >= 1">
      <el-scrollbar class="feed">
        <div>
          <div class="box" v-for="(item, index) in feedback" :key="index">
            <div class="parent">
              <div class="par-left">
                <div class="img-box">
                  <img src="../../assets/huLogo1.jpg" />
                </div>
              </div>
              <div class="par-right">
                <div class="first">
                  <div class="name">
                    {{
                      item.tj_user == 1
                        ? item.zhubo_username
                        : item.youxizuozhe_username
                    }}
                  </div>
                </div>
                <div class="second">
                  {{ item.content }}
                </div>
                <div class="third">
                  <div class="time" style="color: #999">
                    {{ formatTime(item.ctime) }}
                  </div>
                  <!-- <div
                    class="reply"
                    style="display: flex; align-items: center"
                    @click="replyParent(index)"
                  >
                    <el-icon style="margin-right: 5px"><ChatRound /></el-icon
                    >回复
                  </div> -->
                </div>
                <div style="display: flex" v-if="replyStates[index]">
                  <el-input
                    style="width: 70%; margin-right: 20px"
                    placeholder="请输入回复内容"
                    type="text"
                    v-model="parentContent"
                    @keyup.enter="replyParentConfirm(item.game_feedback_id)"
                  />
                  <el-button
                    type="primary"
                    @click="replyParentConfirm(item.game_feedback_id)"
                    >回复</el-button
                  >
                </div>
              </div>
            </div>
            <div
              class="children"
              v-for="(child, index) in item.childrens"
              :key="index"
            >
              <div class="par-left">
                <div class="img-box">
                  <img
                    v-if="child.tj_user == 1"
                    src="../../assets/huLogo1.jpg"
                  />
                  <img v-else src="../../assets/huLogo.jpg" />
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
                    <el-icon style="margin-right: 5px"><ChatRound /></el-icon
                    >回复
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
            <div class="view-more">
              <el-button
                @click="openMoreFeedback(item.first_id)"
                type="info"
                v-if="item.childrens.length >= 10"
                >显示更多</el-button
              >
            </div>
            <el-divider />
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="feed" v-else><el-empty description="暂无内容" /></div>
    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="currentPage"
        :total="total"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
  <div>
    <MoreFeedback
      v-if="visible"
      :first_id="first_id"
      :visible="visible"
      :game_id="gameId"
      @close="closeMoreFeedback"
    ></MoreFeedback>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
// import HModel from '../../components/HModel/index.vue'
import { ChatRound } from '@element-plus/icons-vue'
import { getFeedbackList, submitFeedback } from '../../api/feedback'
import MoreFeedback from './component/MoreFeedback.vue'
import router from '../../router'
import Moment from 'moment'
import { ElMessage } from 'element-plus'
const gameId = ref<any>()
const gameName = ref<any>()
const feedback = ref<any>()
const replyStates = ref<any>({}) // 父级
const replyStatesChild = ref<any>({}) // 子级
// const num = ref<number>(0)
const childNum = ref<number>(0)
const parentContent = ref<string>('') // 父级回复内容
const childContent = ref<string>('') // 子级回复内容
const visible = ref<boolean>(false)
const first_id = ref<number>()
// 显示更多
function openMoreFeedback(id: any) {
  first_id.value = id
  visible.value = true
}
function closeMoreFeedback() {
  visible.value = false
}
// 分页
const currentPage = ref<number>(1)
const total = ref<number>()

function handleCurrentChange(newPage: number) {
  currentPage.value = newPage
  query()
}
// // 回复父级-打开input
// function replyParent(index: any) {
//   num.value++
//   replyStates.value = {} // 清空所有回复状态
//   if (num.value % 2 != 0) {
//     replyStates.value[index] = true
//   } else {
//     replyStates.value[index] = false
//     parentContent.value = ''
//   }
//   console.log(num.value)
// }
// 回复父级
async function replyParentConfirm(id: any) {
  console.log(parentContent.value)
  const res: any = await submitFeedback({
    content: parentContent.value,
    game_feedback_id: id
  })
  if (res.code === 200) {
    ElMessage.success('回复成功')
  } else {
    ElMessage.error(res.msg)
  }
  parentContent.value = ''
  replyStates.value = {}
  query()
}
// 回复子级-打开input
function replyChild(id: any) {
  childNum.value++
  replyStatesChild.value = {} // 清空所有回复状态
  if (childNum.value % 2 != 0) {
    replyStatesChild.value[id] = true
  } else {
    replyStatesChild.value[id] = false
    parentContent.value = ''
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
    const res = await getFeedbackList({
      page: currentPage.value,
      game_id: gameId.value
    })
    feedback.value = res.data?.list
    total.value = res.data.count
  } catch (error) {
    console.error('Error fetching data: ', error)
  }
}
onMounted(() => {
  gameId.value = router.currentRoute.value.query.id
  gameName.value = router.currentRoute.value.query.name
  query()
  // console.log(feedback.value)
})
// 时间格式化
function formatTime(time: number) {
  return time ? Moment(time * 1000).format('YYYY-MM-DD') : '-'
}
</script>

<style lang="less" scoped>
.feed {
  width: 60%;
  height: 1000px;
  overflow: auto;
  border: 1px solid skyblue;
  padding: 20px;
}
.pagination {
  margin-top: 10px;
}
.parent {
  display: flex;
}
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
// 显示更多
.view-more {
  display: flex;
  justify-content: center;
}
</style>
