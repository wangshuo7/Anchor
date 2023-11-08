import request from '../utils/request'

// 列表
export const getAnchorList = (data: any) => {
  return request.post('/gonghui/zhubo/index', data)
}
// 添加
export const addAnchor = (data: any) => {
  return request.post('/gonghui/zhubo/add', data)
}
// 编辑
export const editAnchor = (data: any) => {
  return request.post('/gonghui/zhubo/edit', data)
}
// 添加
export const delAnchor = (data: any) => {
  return request.post('/gonghui/zhubo/del', data)
}
