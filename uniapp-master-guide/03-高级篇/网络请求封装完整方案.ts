// ========== UniApp 网络请求封装完整方案 ==========

// types/request.d.ts - 类型定义
export interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  params?: Record<string, any>
  header?: Record<string, any>
  timeout?: number
  showLoading?: boolean
  loadingText?: string
  showError?: boolean
  needToken?: boolean
  customBaseURL?: string
}

export interface Response<T = any> {
  code: number
  data: T
  message: string
  timestamp?: number
}

export interface RequestInterceptor {
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
  onRequestError?: (error: any) => any
  onResponse?: (response: Response) => Response | Promise<Response>
  onResponseError?: (error: any) => any
}

// ========== utils/request.ts - 核心请求类 ==========
class Request {
  private baseURL: string
  private timeout: number
  private header: Record<string, any>
  private interceptors: RequestInterceptor[]
  private requestQueue: Set<string>

  constructor() {
    // 根据环境配置不同的 baseURL
    // #ifdef H5
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
    // #endif
    
    // #ifdef MP-WEIXIN
    this.baseURL = 'https://api.example.com'
    // #endif
    
    // #ifdef APP-PLUS
    this.baseURL = 'https://api.example.com'
    // #endif
    
    this.timeout = 30000
    this.header = {
      'Content-Type': 'application/json'
    }
    this.interceptors = []
    this.requestQueue = new Set()
  }

  /**
   * 添加拦截器
   */
  use(interceptor: RequestInterceptor) {
    this.interceptors.push(interceptor)
  }

  /**
   * 请求拦截
   */
  private async beforeRequest(config: RequestConfig): Promise<RequestConfig> {
    for (const interceptor of this.interceptors) {
      if (interceptor.onRequest) {
        config = await interceptor.onRequest(config)
      }
    }
    return config
  }

  /**
   * 响应拦截
   */
  private async afterResponse(response: Response): Promise<Response> {
    for (const interceptor of this.interceptors) {
      if (interceptor.onResponse) {
        response = await interceptor.onResponse(response)
      }
    }
    return response
  }

  /**
   * 错误处理
   */
  private async handleError(error: any) {
    for (const interceptor of this.interceptors) {
      if (interceptor.onResponseError) {
        await interceptor.onResponseError(error)
      }
    }
    return Promise.reject(error)
  }

  /**
   * 处理 URL 参数
   */
  private handleParams(url: string, params?: Record<string, any>): string {
    if (!params) return url
    
    const queryString = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
    
    return queryString ? `${url}?${queryString}` : url
  }

  /**
   * 生成请求唯一标识
   */
  private getRequestKey(config: RequestConfig): string {
    const { url, method, data, params } = config
    return `${method}_${url}_${JSON.stringify(data || {})}_${JSON.stringify(params || {})}`
  }

  /**
   * 防止重复请求
   */
  private checkDuplicateRequest(key: string): boolean {
    if (this.requestQueue.has(key)) {
      return true
    }
    this.requestQueue.add(key)
    return false
  }

  /**
   * 核心请求方法
   */
  async request<T = any>(config: RequestConfig): Promise<T> {
    try {
      // 执行请求拦截器
      config = await this.beforeRequest(config)
      
      const {
        url,
        method = 'GET',
        data,
        params,
        header = {},
        timeout = this.timeout,
        showLoading = false,
        loadingText = '加载中...',
        showError = true,
        customBaseURL
      } = config

      // 生成请求标识
      const requestKey = this.getRequestKey(config)
      
      // 检查重复请求
      if (this.checkDuplicateRequest(requestKey)) {
        console.warn('重复请求已拦截：', url)
        return Promise.reject({ message: '重复请求' })
      }

      // 显示加载提示
      if (showLoading) {
        uni.showLoading({
          title: loadingText,
          mask: true
        })
      }

      // 构建完整 URL
      const baseURL = customBaseURL || this.baseURL
      const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`
      const requestUrl = this.handleParams(fullUrl, params)

      // 发起请求
      const response = await new Promise<Response<T>>((resolve, reject) => {
        uni.request({
          url: requestUrl,
          method,
          data,
          header: {
            ...this.header,
            ...header
          },
          timeout,
          success: (res: any) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(res.data)
            } else {
              reject({
                code: res.statusCode,
                message: res.data?.message || '请求失败',
                data: res.data
              })
            }
          },
          fail: (err) => {
            reject({
              code: -1,
              message: err.errMsg || '网络请求失败',
              data: null
            })
          },
          complete: () => {
            // 移除请求标识
            this.requestQueue.delete(requestKey)
            
            // 隐藏加载提示
            if (showLoading) {
              uni.hideLoading()
            }
          }
        })
      })

      // 执行响应拦截器
      const processedResponse = await this.afterResponse(response)

      // 返回数据
      return processedResponse.data
    } catch (error: any) {
      // 错误处理
      if (config.showError) {
        uni.showToast({
          title: error.message || '请求失败',
          icon: 'none',
          duration: 2000
        })
      }
      
      return this.handleError(error)
    }
  }

  // 快捷方法
  get<T = any>(url: string, params?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'params'>) {
    return this.request<T>({ ...config, url, method: 'GET', params })
  }

  post<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>) {
    return this.request<T>({ ...config, url, method: 'POST', data })
  }

  put<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>) {
    return this.request<T>({ ...config, url, method: 'PUT', data })
  }

  delete<T = any>(url: string, params?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'params'>) {
    return this.request<T>({ ...config, url, method: 'DELETE', params })
  }

  /**
   * 上传文件
   */
  upload(
    url: string,
    filePath: string,
    name: string = 'file',
    formData?: Record<string, any>
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const token = uni.getStorageSync('token')
      
      uni.uploadFile({
        url: url.startsWith('http') ? url : `${this.baseURL}${url}`,
        filePath,
        name,
        formData,
        header: {
          ...this.header,
          Authorization: token ? `Bearer ${token}` : ''
        },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const data = JSON.parse(res.data)
            resolve(data)
          } else {
            reject(new Error('上传失败'))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }

  /**
   * 下载文件
   */
  download(url: string, config?: { header?: Record<string, any> }): Promise<string> {
    return new Promise((resolve, reject) => {
      uni.downloadFile({
        url: url.startsWith('http') ? url : `${this.baseURL}${url}`,
        header: {
          ...this.header,
          ...config?.header
        },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.tempFilePath)
          } else {
            reject(new Error('下载失败'))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
}

// 创建实例
const request = new Request()

// ========== 配置拦截器 ==========

// 请求拦截器
request.use({
  onRequest: (config) => {
    // 添加 token
    if (config.needToken !== false) {
      const token = uni.getStorageSync('token')
      if (token) {
        config.header = {
          ...config.header,
          Authorization: `Bearer ${token}`
        }
      }
    }
    
    // 打印请求日志
    console.log('📤 Request:', config.method, config.url, config.data || config.params)
    
    return config
  },
  
  onRequestError: (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
})

// 响应拦截器
request.use({
  onResponse: (response) => {
    console.log('📥 Response:', response)
    
    // 统一处理业务状态码
    if (response.code !== 200 && response.code !== 0) {
      // 根据不同的状态码处理
      switch (response.code) {
        case 401:
          // 未登录或 token 过期
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          uni.reLaunch({
            url: '/pages/login/login'
          })
          break
        
        case 403:
          // 无权限
          uni.showToast({
            title: '暂无权限',
            icon: 'none'
          })
          break
        
        case 404:
          // 资源不存在
          uni.showToast({
            title: '请求的资源不存在',
            icon: 'none'
          })
          break
        
        case 500:
          // 服务器错误
          uni.showToast({
            title: '服务器错误',
            icon: 'none'
          })
          break
        
        default:
          // 其他错误
          uni.showToast({
            title: response.message || '请求失败',
            icon: 'none'
          })
      }
      
      return Promise.reject(response)
    }
    
    return response
  },
  
  onResponseError: (error) => {
    console.error('❌ Response Error:', error)
    
    // 网络错误处理
    if (error.code === -1) {
      uni.showToast({
        title: '网络连接失败，请检查网络',
        icon: 'none',
        duration: 2000
      })
    }
    
    return Promise.reject(error)
  }
})

export default request

// ========== API 模块示例 ==========

// api/user.ts
export interface LoginParams {
  username: string
  password: string
}

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
}

export const userApi = {
  // 登录
  login: (data: LoginParams) => {
    return request.post<{ token: string; userInfo: UserInfo }>('/user/login', data, {
      showLoading: true,
      loadingText: '登录中...'
    })
  },
  
  // 获取用户信息
  getUserInfo: () => {
    return request.get<UserInfo>('/user/info')
  },
  
  // 更新用户信息
  updateUserInfo: (data: Partial<UserInfo>) => {
    return request.put<UserInfo>('/user/info', data, {
      showLoading: true
    })
  },
  
  // 上传头像
  uploadAvatar: (filePath: string) => {
    return request.upload('/user/avatar', filePath, 'avatar')
  }
}

// api/product.ts
export interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
}

export interface ProductListParams {
  page: number
  pageSize: number
  keyword?: string
  categoryId?: number
}

export const productApi = {
  // 获取商品列表
  getProductList: (params: ProductListParams) => {
    return request.get<{ list: Product[]; total: number }>('/product/list', params)
  },
  
  // 获取商品详情
  getProductDetail: (id: number) => {
    return request.get<Product>(`/product/${id}`)
  },
  
  // 搜索商品
  searchProduct: (keyword: string) => {
    return request.get<Product[]>('/product/search', { keyword }, {
      showLoading: true,
      loadingText: '搜索中...'
    })
  }
}

// ========== 使用示例 ==========

/*
// pages/login/login.vue
<script setup lang="ts">
import { ref } from 'vue'
import { userApi } from '@/api/user'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const username = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    const res = await userApi.login({
      username: username.value,
      password: password.value
    })
    
    // 保存 token 和用户信息
    uni.setStorageSync('token', res.token)
    userStore.setUserInfo(res.userInfo)
    
    // 跳转到首页
    uni.switchTab({
      url: '/pages/index/index'
    })
  } catch (error) {
    // 错误已在拦截器中处理
    console.error('登录失败：', error)
  }
}
</script>
*/

/*
// pages/product/list.vue
<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { productApi } from '@/api/product'

const productList = ref<Product[]>([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

onLoad(() => {
  loadProductList()
})

const loadProductList = async () => {
  try {
    const res = await productApi.getProductList({
      page: page.value,
      pageSize: pageSize.value
    })
    
    productList.value = [...productList.value, ...res.list]
    total.value = res.total
  } catch (error) {
    console.error('加载商品列表失败：', error)
  }
}

// 上拉加载更多
onReachBottom(() => {
  if (productList.value.length < total.value) {
    page.value++
    loadProductList()
  }
})
</script>
*/
