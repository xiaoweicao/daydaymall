<template>
  <view class="page">
    <!-- 1. text 文本组件 -->
    <view class="section">
      <text class="title">1. text 文本组件</text>
      
      <text class="normal-text">普通文本</text>
      <text class="selectable-text" selectable>可选择的文本（长按可复制）</text>
      <text class="decode-text" decode>支持解码：&lt;、&gt;、&amp;、&nbsp;</text>
      
      <text class="rich-text">
        <text style="color: red;">红色</text>
        <text style="font-weight: bold;">加粗</text>
        <text style="text-decoration: underline;">下划线</text>
      </text>
    </view>

    <!-- 2. rich-text 富文本 -->
    <view class="section">
      <text class="title">2. rich-text 富文本</text>
      
      <rich-text :nodes="htmlContent"></rich-text>
      
      <button @click="changeContent">切换内容</button>
    </view>

    <!-- 3. progress 进度条 -->
    <view class="section">
      <text class="title">3. progress 进度条</text>
      
      <view class="progress-demo">
        <text>默认样式：</text>
        <progress :percent="percent" show-info />
      </view>
      
      <view class="progress-demo">
        <text>自定义颜色：</text>
        <progress 
          :percent="percent" 
          stroke-width="10" 
          activeColor="#e74c3c" 
          backgroundColor="#ecf0f1"
        />
      </view>
      
      <view class="progress-demo">
        <text>加载中动画：</text>
        <progress :percent="percent" active />
      </view>
      
      <view class="btn-group">
        <button @click="decreasePercent">减少</button>
        <button @click="increasePercent">增加</button>
      </view>
    </view>

    <!-- 4. icon 图标 -->
    <view class="section">
      <text class="title">4. icon 图标</text>
      
      <view class="icon-list">
        <view class="icon-item" v-for="item in iconTypes" :key="item">
          <icon :type="item" size="30" />
          <text>{{ item }}</text>
        </view>
      </view>
      
      <view class="icon-colors">
        <icon type="success" size="40" color="#2ecc71" />
        <icon type="info" size="40" color="#3498db" />
        <icon type="warn" size="40" color="#f39c12" />
        <icon type="waiting" size="40" color="#95a5a6" />
        <icon type="cancel" size="40" color="#e74c3c" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// rich-text
const contentIndex = ref(0)
const contents = [
  '<div style="color: #3498db; font-size: 16px;"><strong>HTML 内容</strong><br/><p style="color: #e74c3c;">支持基本的 HTML 标签</p></div>',
  '<div><ul><li>列表项 1</li><li>列表项 2</li><li>列表项 3</li></ul></div>',
  '<div style="text-align: center;"><img src="https://via.placeholder.com/200" style="width: 200px; height: 150px;" /></div>'
]
const htmlContent = ref(contents[0])

const changeContent = () => {
  contentIndex.value = (contentIndex.value + 1) % contents.length
  htmlContent.value = contents[contentIndex.value]
}

// progress
const percent = ref(50)

const increasePercent = () => {
  if (percent.value < 100) {
    percent.value += 10
  }
}

const decreasePercent = () => {
  if (percent.value > 0) {
    percent.value -= 10
  }
}

// icon
const iconTypes = [
  'success',
  'success_no_circle',
  'info',
  'warn',
  'waiting',
  'cancel',
  'download',
  'search',
  'clear'
]
</script>

<style lang="scss" scoped>
.page {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.section {
  margin-bottom: 40rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  display: block;
  color: #333;
}

/* text 组件 */
.normal-text,
.selectable-text,
.decode-text,
.rich-text {
  display: block;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  line-height: 1.6;
}

.selectable-text {
  color: #3498db;
  user-select: text;
}

.decode-text {
  color: #2ecc71;
}

/* progress */
.progress-demo {
  margin-bottom: 30rpx;
  
  text {
    display: block;
    margin-bottom: 10rpx;
    color: #666;
    font-size: 26rpx;
  }
}

.btn-group {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
  
  button {
    flex: 1;
  }
}

/* icon */
.icon-list {
  display: flex;
  flex-wrap: wrap;
  gap: 30rpx;
  margin-bottom: 40rpx;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  
  text {
    font-size: 22rpx;
    color: #666;
  }
}

.icon-colors {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
}
</style>
