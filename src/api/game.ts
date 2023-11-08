import request from '../utils/request'

// 游戏列表
export const getGameList = (data: any) => {
  return request.post('/zhuboduan/game/index', data)
}
// 单条信息
export const gameInfo = (data: any) => {
  return request.post('/zhuboduan/game/info', data)
}
// 购买游戏
export const buyGame = (data: any) => {
  return request.post('/zhuboduan/buygame/buygame', data)
}
