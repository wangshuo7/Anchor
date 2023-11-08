import request from '../utils/request'

// 游戏列表
export const getMyGameList = (data: any) => {
  return request.post('/zhuboduan/buygame/mygame', data)
}
// 开播记录
export const getLiveRecording = (data: any) => {
  return request.post('/zhuboduan/buygame/kblog', data)
}
