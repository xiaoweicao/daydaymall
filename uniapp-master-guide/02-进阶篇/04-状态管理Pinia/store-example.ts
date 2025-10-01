// ========== Pinia 状态管理完整示例 ==========

// store/index.ts - Store 配置
import { createPinia } from 'pinia'
import type { App } from 'vue'

const pinia = createPinia()

export function setupStore(app: App) {
  app.use(pinia)
}

export { pinia }

// ========== User Store - 用户状态管理 ==========
// store/modules/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface UserInfo {
  id: number
  username: string
  avatar: string
  nickname: string
  phone: string
  email: string
}

export const useUserStore = defineStore('user', () => {
  // ===== State =====
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)
  const isLoggedIn = ref<boolean>(false)

  // ===== Getters =====
  const userId = computed(() => userInfo.value?.id || 0)
  const userName = computed(() => userInfo.value?.nickname || userInfo.value?.username || '游客')
  const userAvatar = computed(() => userInfo.value?.avatar || '/static/default-avatar.png')

  // ===== Actions =====
  
  /**
   * 登录
   */
  const login = async (username: string, password: string) => {
    try {
      // 模拟登录请求
      const res = await mockLoginApi(username, password)
      
      token.value = res.token
      userInfo.value = res.userInfo
      isLoggedIn.value = true
      
      // 持久化存储
      uni.setStorageSync('token', res.token)
      uni.setStorageSync('userInfo', res.userInfo)
      
      return { success: true }
    } catch (error) {
      console.error('登录失败：', error)
      return { success: false, message: '登录失败' }
    }
  }

  /**
   * 退出登录
   */
  const logout = () => {
    token.value = ''
    userInfo.value = null
    isLoggedIn.value = false
    
    // 清除存储
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
    
    // 跳转到登录页
    uni.reLaunch({
      url: '/pages/login/login'
    })
  }

  /**
   * 更新用户信息
   */
  const updateUserInfo = async (data: Partial<UserInfo>) => {
    try {
      // 模拟更新请求
      const res = await mockUpdateUserApi(data)
      
      userInfo.value = { ...userInfo.value, ...res }
      uni.setStorageSync('userInfo', userInfo.value)
      
      return { success: true }
    } catch (error) {
      return { success: false, message: '更新失败' }
    }
  }

  /**
   * 检查登录状态
   */
  const checkLoginStatus = () => {
    const storedToken = uni.getStorageSync('token')
    const storedUserInfo = uni.getStorageSync('userInfo')
    
    if (storedToken && storedUserInfo) {
      token.value = storedToken
      userInfo.value = storedUserInfo
      isLoggedIn.value = true
    }
  }

  /**
   * 获取用户详情
   */
  const getUserDetail = async () => {
    try {
      const res = await mockGetUserDetailApi()
      userInfo.value = res
      uni.setStorageSync('userInfo', res)
    } catch (error) {
      console.error('获取用户信息失败：', error)
    }
  }

  return {
    // state
    token,
    userInfo,
    isLoggedIn,
    // getters
    userId,
    userName,
    userAvatar,
    // actions
    login,
    logout,
    updateUserInfo,
    checkLoginStatus,
    getUserDetail
  }
})

// ========== Cart Store - 购物车状态管理 ==========
// store/modules/cart.ts
export interface CartItem {
  id: number
  productId: number
  name: string
  price: number
  image: string
  quantity: number
  selected: boolean
  stock: number
}

export const useCartStore = defineStore('cart', () => {
  // ===== State =====
  const cartList = ref<CartItem[]>([])

  // ===== Getters =====
  
  // 购物车商品数量
  const cartCount = computed(() => {
    return cartList.value.reduce((total, item) => total + item.quantity, 0)
  })

  // 选中的商品
  const selectedItems = computed(() => {
    return cartList.value.filter(item => item.selected)
  })

  // 选中商品数量
  const selectedCount = computed(() => {
    return selectedItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  // 选中商品总价
  const selectedTotalPrice = computed(() => {
    return selectedItems.value.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  })

  // 是否全选
  const isAllSelected = computed(() => {
    return cartList.value.length > 0 && cartList.value.every(item => item.selected)
  })

  // ===== Actions =====

  /**
   * 加载购物车
   */
  const loadCart = async () => {
    try {
      // 从本地存储或服务器加载
      const localCart = uni.getStorageSync('cartList')
      if (localCart) {
        cartList.value = localCart
      } else {
        // 从服务器加载
        const res = await mockGetCartApi()
        cartList.value = res
      }
    } catch (error) {
      console.error('加载购物车失败：', error)
    }
  }

  /**
   * 添加到购物车
   */
  const addToCart = (product: Omit<CartItem, 'quantity' | 'selected'>) => {
    const existItem = cartList.value.find(item => item.productId === product.productId)
    
    if (existItem) {
      // 已存在，增加数量
      if (existItem.quantity < existItem.stock) {
        existItem.quantity++
      } else {
        uni.showToast({
          title: '库存不足',
          icon: 'none'
        })
        return
      }
    } else {
      // 新增商品
      cartList.value.push({
        ...product,
        quantity: 1,
        selected: true
      })
    }
    
    // 保存到本地
    saveCart()
    
    uni.showToast({
      title: '已加入购物车',
      icon: 'success'
    })
  }

  /**
   * 更新商品数量
   */
  const updateQuantity = (id: number, quantity: number) => {
    const item = cartList.value.find(item => item.id === id)
    if (item) {
      if (quantity <= 0) {
        // 删除商品
        removeFromCart(id)
      } else if (quantity <= item.stock) {
        item.quantity = quantity
        saveCart()
      } else {
        uni.showToast({
          title: '库存不足',
          icon: 'none'
        })
      }
    }
  }

  /**
   * 切换选中状态
   */
  const toggleSelect = (id: number) => {
    const item = cartList.value.find(item => item.id === id)
    if (item) {
      item.selected = !item.selected
      saveCart()
    }
  }

  /**
   * 全选/取消全选
   */
  const toggleSelectAll = () => {
    const newSelectedState = !isAllSelected.value
    cartList.value.forEach(item => {
      item.selected = newSelectedState
    })
    saveCart()
  }

  /**
   * 从购物车移除
   */
  const removeFromCart = (id: number) => {
    const index = cartList.value.findIndex(item => item.id === id)
    if (index !== -1) {
      cartList.value.splice(index, 1)
      saveCart()
    }
  }

  /**
   * 删除选中的商品
   */
  const removeSelected = () => {
    cartList.value = cartList.value.filter(item => !item.selected)
    saveCart()
  }

  /**
   * 清空购物车
   */
  const clearCart = () => {
    cartList.value = []
    saveCart()
  }

  /**
   * 保存到本地存储
   */
  const saveCart = () => {
    uni.setStorageSync('cartList', cartList.value)
  }

  return {
    // state
    cartList,
    // getters
    cartCount,
    selectedItems,
    selectedCount,
    selectedTotalPrice,
    isAllSelected,
    // actions
    loadCart,
    addToCart,
    updateQuantity,
    toggleSelect,
    toggleSelectAll,
    removeFromCart,
    removeSelected,
    clearCart
  }
})

// ========== App Store - 应用全局状态 ==========
// store/modules/app.ts
export const useAppStore = defineStore('app', () => {
  // ===== State =====
  const systemInfo = ref<UniApp.GetSystemInfoResult | null>(null)
  const networkType = ref<string>('unknown')
  const statusBarHeight = ref<number>(0)
  const navBarHeight = ref<number>(0)
  const loading = ref<boolean>(false)

  // ===== Getters =====
  const platform = computed(() => systemInfo.value?.platform || 'unknown')
  const isIOS = computed(() => platform.value === 'ios')
  const isAndroid = computed(() => platform.value === 'android')
  const screenWidth = computed(() => systemInfo.value?.screenWidth || 375)
  const screenHeight = computed(() => systemInfo.value?.screenHeight || 667)

  // ===== Actions =====

  /**
   * 初始化应用信息
   */
  const initApp = () => {
    // 获取系统信息
    systemInfo.value = uni.getSystemInfoSync()
    statusBarHeight.value = systemInfo.value.statusBarHeight || 0
    
    // 计算导航栏高度
    // #ifdef MP-WEIXIN
    const menuButton = uni.getMenuButtonBoundingClientRect()
    navBarHeight.value = menuButton.top + menuButton.height + (menuButton.top - statusBarHeight.value)
    // #endif
    
    // #ifndef MP-WEIXIN
    navBarHeight.value = statusBarHeight.value + 44
    // #endif
    
    // 监听网络状态
    uni.getNetworkType({
      success: (res) => {
        networkType.value = res.networkType
      }
    })
    
    uni.onNetworkStatusChange((res) => {
      networkType.value = res.networkType
      
      if (!res.isConnected) {
        uni.showToast({
          title: '网络连接已断开',
          icon: 'none'
        })
      }
    })
  }

  /**
   * 显示加载
   */
  const showLoading = (title: string = '加载中...') => {
    loading.value = true
    uni.showLoading({ title })
  }

  /**
   * 隐藏加载
   */
  const hideLoading = () => {
    loading.value = false
    uni.hideLoading()
  }

  return {
    // state
    systemInfo,
    networkType,
    statusBarHeight,
    navBarHeight,
    loading,
    // getters
    platform,
    isIOS,
    isAndroid,
    screenWidth,
    screenHeight,
    // actions
    initApp,
    showLoading,
    hideLoading
  }
})

// ========== 组件中使用示例 ==========

/*
// pages/user/user.vue
<template>
  <view class="page">
    <view class="user-info">
      <image :src="userAvatar" />
      <text>{{ userName }}</text>
    </view>
    
    <button @click="handleLogout">退出登录</button>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

// 使用 storeToRefs 保持响应性
const { userName, userAvatar, isLoggedIn } = storeToRefs(userStore)

// 直接使用 actions
const handleLogout = () => {
  userStore.logout()
}
</script>
*/

/*
// pages/cart/cart.vue
<template>
  <view class="page">
    <view class="cart-list">
      <view 
        class="cart-item" 
        v-for="item in cartList" 
        :key="item.id"
      >
        <checkbox 
          :checked="item.selected" 
          @click="toggleSelect(item.id)"
        />
        <image :src="item.image" />
        <view class="info">
          <text class="name">{{ item.name }}</text>
          <text class="price">¥{{ item.price }}</text>
        </view>
        <view class="counter">
          <button @click="updateQuantity(item.id, item.quantity - 1)">-</button>
          <text>{{ item.quantity }}</text>
          <button @click="updateQuantity(item.id, item.quantity + 1)">+</button>
        </view>
      </view>
    </view>
    
    <view class="footer">
      <checkbox :checked="isAllSelected" @click="toggleSelectAll">全选</checkbox>
      <text>总计：¥{{ selectedTotalPrice.toFixed(2) }}</text>
      <button @click="handleCheckout">结算({{ selectedCount }})</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useCartStore } from '@/store/modules/cart'
import { storeToRefs } from 'pinia'
import { onLoad } from '@dcloudio/uni-app'

const cartStore = useCartStore()
const { 
  cartList, 
  selectedCount, 
  selectedTotalPrice, 
  isAllSelected 
} = storeToRefs(cartStore)

onLoad(() => {
  cartStore.loadCart()
})

const toggleSelect = (id: number) => {
  cartStore.toggleSelect(id)
}

const toggleSelectAll = () => {
  cartStore.toggleSelectAll()
}

const updateQuantity = (id: number, quantity: number) => {
  cartStore.updateQuantity(id, quantity)
}

const handleCheckout = () => {
  if (selectedCount.value === 0) {
    uni.showToast({
      title: '请选择商品',
      icon: 'none'
    })
    return
  }
  
  uni.navigateTo({
    url: '/pages/order/order'
  })
}
</script>
*/

// ========== Mock API ==========
const mockLoginApi = async (username: string, password: string) => {
  return new Promise<{ token: string; userInfo: UserInfo }>((resolve) => {
    setTimeout(() => {
      resolve({
        token: 'mock_token_' + Date.now(),
        userInfo: {
          id: 1,
          username: username,
          nickname: '测试用户',
          avatar: '/static/avatar.png',
          phone: '13800138000',
          email: 'test@example.com'
        }
      })
    }, 1000)
  })
}

const mockUpdateUserApi = async (data: Partial<UserInfo>) => {
  return new Promise<UserInfo>((resolve) => {
    setTimeout(() => {
      resolve(data as UserInfo)
    }, 500)
  })
}

const mockGetUserDetailApi = async () => {
  return new Promise<UserInfo>((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        username: 'testuser',
        nickname: '测试用户',
        avatar: '/static/avatar.png',
        phone: '13800138000',
        email: 'test@example.com'
      })
    }, 500)
  })
}

const mockGetCartApi = async () => {
  return new Promise<CartItem[]>((resolve) => {
    setTimeout(() => {
      resolve([])
    }, 500)
  })
}
