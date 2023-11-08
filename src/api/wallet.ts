import request from '../utils/request'

// 个人信息
export const getPersonalInfo = () => {
  return request.post('/gonghui/my/memberinfo')
}
// 充值记录
export const getRecharge = (data: any) => {
  return request.post('/gonghui/my/czlog', data)
}
// 消费记录
export const getExpend = (data: any) => {
  return request.post('/gonghui/my/xflog', data)
}
// 转账
export const transferAccounts = (data: any) => {
  return request.post('/gonghui/my/zhuanzhang', data)
}
// 充值卡
export const rechargeCard = (data: any) => {
  return request.post('/gonghui/paymiyao/miyao', data)
}
// 提现申请
export const withdrawalApply = (data: any) => {
  return request.post('/gonghui/tixian/tixian_shenqing', data)
}
