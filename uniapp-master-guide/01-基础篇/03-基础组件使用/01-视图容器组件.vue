<template>
  <view class="page">
    <view class="section">
      <text class="title">1. view 组件（类似 div）</text>
      <view class="demo-box">
        <view class="box box1">普通视图容器</view>
        <view class="box box2" hover-class="box-hover">
          可点击的容器（hover 效果）
        </view>
      </view>
    </view>

    <view class="section">
      <text class="title">2. scroll-view 滚动容器</text>
      
      <!-- 横向滚动 -->
      <text class="subtitle">横向滚动：</text>
      <scroll-view 
        class="scroll-horizontal" 
        scroll-x 
        @scroll="onScroll"
        @scrolltoupper="onScrollToUpper"
        @scrolltolower="onScrollToLower"
      >
        <view class="scroll-item" v-for="item in 10" :key="item">
          {{ item }}
        </view>
      </scroll-view>

      <!-- 纵向滚动 -->
      <text class="subtitle">纵向滚动：</text>
      <scroll-view 
        class="scroll-vertical" 
        scroll-y
        :scroll-into-view="scrollIntoView"
        :show-scrollbar="true"
      >
        <view 
          class="scroll-row" 
          v-for="item in 20" 
          :key="item"
          :id="'item' + item"
        >
          第 {{ item }} 行
        </view>
      </scroll-view>
      
      <button @click="scrollTo">滚动到第 10 行</button>
    </view>

    <view class="section">
      <text class="title">3. swiper 轮播组件</text>
      <swiper 
        class="swiper-box"
        :indicator-dots="indicatorDots"
        :autoplay="autoplay"
        :interval="interval"
        :duration="duration"
        :circular="circular"
        @change="onSwiperChange"
      >
        <swiper-item v-for="item in swiperList" :key="item.id">
          <view class="swiper-item" :style="{ backgroundColor: item.color }">
            <text>{{ item.text }}</text>
          </view>
        </swiper-item>
      </swiper>
      
      <view class="swiper-controls">
        <button @click="toggleIndicatorDots">
          指示点: {{ indicatorDots ? '显示' : '隐藏' }}
        </button>
        <button @click="toggleAutoplay">
          自动播放: {{ autoplay ? '开启' : '关闭' }}
        </button>
      </view>
    </view>

    <view class="section">
      <text class="title">4. movable-area 可移动区域</text>
      <movable-area class="movable-area">
        <movable-view 
          class="movable-view"
          :x="x" 
          :y="y"
          direction="all"
          @change="onMovableChange"
          :inertia="true"
          :out-of-bounds="false"
        >
          拖动我
        </movable-view>
      </movable-area>
      <text class="info">位置: x={{ x }}, y={{ y }}</text>
    </view>

    <view class="section">
      <text class="title">5. cover-view 覆盖原生组件</text>
      <view class="cover-demo">
        <!-- video、map 等原生组件 -->
        <view class="native-component">原生组件区域</view>
        
        <!-- cover-view 可以覆盖在原生组件上 -->
        <cover-view class="cover-view">
          <cover-view class="cover-text">覆盖层文字</cover-view>
          <cover-image 
            class="cover-image" 
            src="/static/logo.png"
          />
        </cover-view>
      </view>
      <text class="tips">
        Tips: cover-view 用于覆盖 video、map、canvas 等原生组件
      </text>
    </view>

    <view class="section">
      <text class="title">6. page-meta 页面属性配置</text>
      <page-meta 
        :page-style="pageStyle"
        :root-font-size="rootFontSize"
      />
      <button @click="changePageStyle">切换页面背景色</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onReady } from '@dcloudio/uni-app'

// ========== scroll-view ==========
const scrollIntoView = ref('')

const onScroll = (e: any) => {
  console.log('滚动事件', e.detail)
}

const onScrollToUpper = () => {
  uni.showToast({ title: '到达顶部', icon: 'none' })
}

const onScrollToLower = () => {
  uni.showToast({ title: '到达底部', icon: 'none' })
}

const scrollTo = () => {
  scrollIntoView.value = 'item10'
  setTimeout(() => {
    scrollIntoView.value = ''
  }, 1000)
}

// ========== swiper ==========
interface SwiperItem {
  id: number
  text: string
  color: string
}

const indicatorDots = ref(true)
const autoplay = ref(true)
const interval = ref(3000)
const duration = ref(500)
const circular = ref(true)

const swiperList = ref<SwiperItem[]>([
  { id: 1, text: '轮播图 1', color: '#3498db' },
  { id: 2, text: '轮播图 2', color: '#2ecc71' },
  { id: 3, text: '轮播图 3', color: '#e74c3c' },
  { id: 4, text: '轮播图 4', color: '#f39c12' }
])

const onSwiperChange = (e: any) => {
  console.log('当前轮播索引：', e.detail.current)
}

const toggleIndicatorDots = () => {
  indicatorDots.value = !indicatorDots.value
}

const toggleAutoplay = () => {
  autoplay.value = !autoplay.value
}

// ========== movable-view ==========
const x = ref(0)
const y = ref(0)

const onMovableChange = (e: any) => {
  x.value = e.detail.x
  y.value = e.detail.y
}

// ========== page-meta ==========
const isDark = ref(false)
const pageStyle = ref('background-color: #ffffff;')
const rootFontSize = ref('16px')

const changePageStyle = () => {
  isDark.value = !isDark.value
  pageStyle.value = isDark.value 
    ? 'background-color: #1a1a1a; color: #ffffff;' 
    : 'background-color: #ffffff; color: #000000;'
}

onReady(() => {
  console.log('页面渲染完成')
})
</script>

<style lang="scss" scoped>
.page {
  padding: 20rpx;
  background-color: #f5f5f5;
}

.section {
  margin-bottom: 40rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: block;
  color: #333;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
  margin: 10rpx 0;
  display: block;
}

/* ========== view 组件 ========== */
.demo-box {
  display: flex;
  gap: 20rpx;
}

.box {
  flex: 1;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  color: #fff;
  font-size: 28rpx;
}

.box1 {
  background-color: #3498db;
}

.box2 {
  background-color: #2ecc71;
}

.box-hover {
  opacity: 0.7;
  transform: scale(0.95);
}

/* ========== scroll-view ========== */
.scroll-horizontal {
  white-space: nowrap;
  height: 150rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  margin: 20rpx 0;
}

.scroll-item {
  display: inline-block;
  width: 200rpx;
  height: 150rpx;
  background-color: #3498db;
  color: #fff;
  text-align: center;
  line-height: 150rpx;
  margin-right: 20rpx;
  border-radius: 8rpx;
}

.scroll-vertical {
  height: 400rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  margin: 20rpx 0;
}

.scroll-row {
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  border-bottom: 1rpx solid #e5e5e5;
}

/* ========== swiper ========== */
.swiper-box {
  height: 300rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.swiper-item {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
}

.swiper-controls {
  margin-top: 20rpx;
  display: flex;
  gap: 20rpx;
  
  button {
    flex: 1;
    font-size: 24rpx;
  }
}

/* ========== movable-view ========== */
.movable-area {
  height: 400rpx;
  background-color: #f0f0f0;
  border-radius: 8rpx;
  overflow: hidden;
  position: relative;
}

.movable-view {
  width: 100rpx;
  height: 100rpx;
  background-color: #e74c3c;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 24rpx;
}

.info {
  display: block;
  margin-top: 20rpx;
  color: #666;
  font-size: 24rpx;
}

/* ========== cover-view ========== */
.cover-demo {
  position: relative;
  height: 300rpx;
  background-color: #ecf0f1;
  border-radius: 8rpx;
  overflow: hidden;
}

.native-component {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  font-size: 28rpx;
}

.cover-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cover-text {
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.cover-image {
  width: 80rpx;
  height: 80rpx;
}

.tips {
  display: block;
  margin-top: 20rpx;
  color: #f39c12;
  font-size: 24rpx;
}

/* ========== 按钮样式 ========== */
button {
  margin-top: 20rpx;
  border-radius: 8rpx;
}
</style>
