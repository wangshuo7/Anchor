import request from '../utils/request'

// 反馈列表
export const getFeedbackList = (data: any) => {
  return request.post('/zhuboduan/feedback/index', data)
}
// 提交反馈
export const submitFeedback = (data: any) => {
  return request.post('/zhuboduan/feedback/add', data)
}

// 反馈列表二级
export const getFeedMoreList = (data: any) => {
  return request.post('/zhuboduan/feedback/index_child', data)
}
