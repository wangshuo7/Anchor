import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'
const request = axios.create({
  baseURL: '/api',
  timeout: 5000, // 请求超时时间
  headers: {
    authToken: ''
    // 'content-type': 'application/x-www-form-urlencoded '
  }
})
// 请求拦截器
request.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    const authToken = localStorage.getItem('authtoken')
    if (authToken) {
      config.headers = {
        ...config.headers,
        authtoken: authToken
      }
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg, data } = response.data
    if (code === 205) {
      // 未登录
      ElMessage.error('未登录')
      router.push('/login')
    } else if (code === 200) {
      //请求成功
      if (data.t) {
        localStorage.setItem('authtoken', data.t)
        router.push('/')
      }
      return response.data
    } else if (code === 0) {
      // 请求失败
      ElMessage.error(msg)
      return Promise.reject(msg)
    }
  },
  (error) => {
    // 处理响应错误
    return Promise.reject(error)
  }
)
// 导出Axios实例
export default request
