import request from '../utils/request'

// 直播记录
export const getLiveRecording = (data: any) => {
  return request.post('/zhuboduan/my/zblog', data)
}
