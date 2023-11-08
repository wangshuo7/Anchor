import request from '../utils/request'

// 语言
export const getLanguage = (data: any) => {
  return request.post('/commpublic/param/lang', data)
}
// 分类
export const getCategory = (data: any) => {
  return request.post('/commpublic/param/cate', data)
}
// 平台
export const getPlatform = (data: any) => {
  return request.post('/commpublic/param/pingtai', data)
}
