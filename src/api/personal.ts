import request from '../utils/request'
// 个人中心信息
export const getInfo = (data: any) => {
  return request.post('/zhuboduan/my/memberinfo', data)
}
