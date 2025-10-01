<template>
  <view class="page">
    <!-- 表单示例 -->
    <form @submit="onSubmit" @reset="onReset">
      
      <!-- 1. input 输入框 -->
      <view class="section">
        <text class="title">1. input 输入框</text>
        
        <view class="form-item">
          <text class="label">文本输入：</text>
          <input 
            v-model="formData.username" 
            placeholder="请输入用户名"
            placeholder-style="color: #999;"
          />
        </view>
        
        <view class="form-item">
          <text class="label">密码输入：</text>
          <input 
            v-model="formData.password" 
            type="password"
            placeholder="请输入密码"
          />
        </view>
        
        <view class="form-item">
          <text class="label">数字输入：</text>
          <input 
            v-model="formData.phone" 
            type="number"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </view>
        
        <view class="form-item">
          <text class="label">身份证：</text>
          <input 
            v-model="formData.idcard" 
            type="idcard"
            placeholder="请输入身份证号"
          />
        </view>
      </view>

      <!-- 2. textarea 多行输入 -->
      <view class="section">
        <text class="title">2. textarea 多行输入</text>
        
        <textarea 
          v-model="formData.description"
          placeholder="请输入描述信息"
          :maxlength="200"
          :show-confirm-bar="true"
          :auto-height="true"
          @focus="onTextareaFocus"
          @blur="onTextareaBlur"
          @input="onTextareaInput"
        />
        <text class="char-count">{{ formData.description.length }}/200</text>
      </view>

      <!-- 3. radio 单选框 -->
      <view class="section">
        <text class="title">3. radio 单选框</text>
        
        <radio-group @change="onRadioChange">
          <label class="radio-item" v-for="item in genderOptions" :key="item.value">
            <radio :value="item.value" :checked="formData.gender === item.value" />
            <text>{{ item.label }}</text>
          </label>
        </radio-group>
      </view>

      <!-- 4. checkbox 多选框 -->
      <view class="section">
        <text class="title">4. checkbox 多选框</text>
        
        <checkbox-group @change="onCheckboxChange">
          <label class="checkbox-item" v-for="item in hobbyOptions" :key="item.value">
            <checkbox :value="item.value" :checked="formData.hobbies.includes(item.value)" />
            <text>{{ item.label }}</text>
          </label>
        </checkbox-group>
      </view>

      <!-- 5. switch 开关 -->
      <view class="section">
        <text class="title">5. switch 开关</text>
        
        <view class="switch-item">
          <text>接收通知</text>
          <switch 
            :checked="formData.notification" 
            @change="onSwitchChange('notification', $event)"
            color="#2ecc71"
          />
        </view>
        
        <view class="switch-item">
          <text>自动登录</text>
          <switch 
            :checked="formData.autoLogin" 
            @change="onSwitchChange('autoLogin', $event)"
          />
        </view>
      </view>

      <!-- 6. slider 滑块 -->
      <view class="section">
        <text class="title">6. slider 滑块</text>
        
        <view class="slider-item">
          <text>音量：{{ formData.volume }}</text>
          <slider 
            :value="formData.volume"
            :min="0"
            :max="100"
            :step="1"
            show-value
            @change="onSliderChange"
            activeColor="#3498db"
          />
        </view>
      </view>

      <!-- 7. picker 选择器 -->
      <view class="section">
        <text class="title">7. picker 选择器</text>
        
        <!-- 普通选择器 -->
        <view class="picker-item" @click="showCityPicker">
          <text class="label">城市：</text>
          <text class="value">{{ formData.city || '请选择' }}</text>
          <text class="arrow">></text>
        </view>
        <picker 
          v-if="cityPickerShow"
          mode="selector"
          :range="cityOptions"
          @change="onCityChange"
          @cancel="cityPickerShow = false"
        >
          <view></view>
        </picker>
        
        <!-- 日期选择器 -->
        <view class="picker-item">
          <text class="label">日期：</text>
          <picker 
            mode="date"
            :value="formData.birthday"
            :start="'1900-01-01'"
            :end="currentDate"
            @change="onDateChange"
          >
            <text class="value">{{ formData.birthday || '请选择' }}</text>
          </picker>
          <text class="arrow">></text>
        </view>
        
        <!-- 时间选择器 -->
        <view class="picker-item">
          <text class="label">时间：</text>
          <picker 
            mode="time"
            :value="formData.time"
            @change="onTimeChange"
          >
            <text class="value">{{ formData.time || '请选择' }}</text>
          </picker>
          <text class="arrow">></text>
        </view>

        <!-- 多列选择器 -->
        <view class="picker-item">
          <text class="label">地区：</text>
          <picker 
            mode="multiSelector"
            :range="regionOptions"
            :value="regionValue"
            @change="onRegionChange"
            @columnchange="onRegionColumnChange"
          >
            <text class="value">{{ selectedRegion || '请选择' }}</text>
          </picker>
          <text class="arrow">></text>
        </view>
      </view>

      <!-- 8. button 按钮 -->
      <view class="section">
        <text class="title">8. button 按钮</text>
        
        <view class="button-group">
          <button type="primary" formType="submit">提交表单</button>
          <button type="default" formType="reset">重置表单</button>
          <button type="warn" @click="showFormData">查看数据</button>
        </view>
        
        <view class="button-styles">
          <button size="mini">迷你按钮</button>
          <button size="mini" type="primary">主要按钮</button>
          <button size="mini" type="warn">警告按钮</button>
        </view>
        
        <button plain>镂空按钮</button>
        <button disabled>禁用按钮</button>
        <button loading>加载中...</button>
      </view>
    </form>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 表单数据
const formData = ref({
  username: '',
  password: '',
  phone: '',
  idcard: '',
  description: '',
  gender: 'male',
  hobbies: [] as string[],
  notification: true,
  autoLogin: false,
  volume: 50,
  city: '',
  birthday: '',
  time: '',
  region: []
})

// 单选选项
const genderOptions = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' }
]

// 多选选项
const hobbyOptions = [
  { label: '读书', value: 'reading' },
  { label: '运动', value: 'sports' },
  { label: '音乐', value: 'music' },
  { label: '旅游', value: 'travel' }
]

// 城市选项
const cityOptions = ['北京', '上海', '广州', '深圳', '杭州', '成都']
const cityPickerShow = ref(false)

// 当前日期
const currentDate = computed(() => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
})

// 地区选择
const regionOptions = [
  ['广东省', '湖南省', '浙江省'],
  ['广州市', '深圳市', '珠海市'],
  ['天河区', '越秀区', '海珠区']
]
const regionValue = ref([0, 0, 0])
const selectedRegion = computed(() => {
  if (formData.value.region.length === 0) return ''
  return formData.value.region.join(' ')
})

// ========== 事件处理 ==========

// textarea
const onTextareaFocus = () => {
  console.log('输入框获得焦点')
}

const onTextareaBlur = () => {
  console.log('输入框失去焦点')
}

const onTextareaInput = (e: any) => {
  formData.value.description = e.detail.value
}

// radio
const onRadioChange = (e: any) => {
  formData.value.gender = e.detail.value
}

// checkbox
const onCheckboxChange = (e: any) => {
  formData.value.hobbies = e.detail.value
}

// switch
const onSwitchChange = (key: string, e: any) => {
  formData.value[key] = e.detail.value
}

// slider
const onSliderChange = (e: any) => {
  formData.value.volume = e.detail.value
}

// picker
const showCityPicker = () => {
  cityPickerShow.value = true
}

const onCityChange = (e: any) => {
  formData.value.city = cityOptions[e.detail.value]
  cityPickerShow.value = false
}

const onDateChange = (e: any) => {
  formData.value.birthday = e.detail.value
}

const onTimeChange = (e: any) => {
  formData.value.time = e.detail.value
}

const onRegionChange = (e: any) => {
  regionValue.value = e.detail.value
  formData.value.region = e.detail.value.map((index: number, column: number) => {
    return regionOptions[column][index]
  })
}

const onRegionColumnChange = (e: any) => {
  console.log('列变化：', e.detail)
}

// 表单提交
const onSubmit = (e: any) => {
  console.log('表单提交：', e.detail.value)
  uni.showModal({
    title: '提交成功',
    content: JSON.stringify(formData.value, null, 2),
    showCancel: false
  })
}

// 表单重置
const onReset = () => {
  formData.value = {
    username: '',
    password: '',
    phone: '',
    idcard: '',
    description: '',
    gender: 'male',
    hobbies: [],
    notification: true,
    autoLogin: false,
    volume: 50,
    city: '',
    birthday: '',
    time: '',
    region: []
  }
  uni.showToast({
    title: '表单已重置',
    icon: 'success'
  })
}

// 查看表单数据
const showFormData = () => {
  console.log('当前表单数据：', formData.value)
  uni.showModal({
    title: '表单数据',
    content: JSON.stringify(formData.value, null, 2),
    showCancel: false
  })
}
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

/* input */
.form-item {
  margin-bottom: 30rpx;
  
  .label {
    display: block;
    margin-bottom: 10rpx;
    color: #333;
    font-size: 28rpx;
  }
  
  input {
    width: 100%;
    height: 80rpx;
    padding: 0 20rpx;
    border: 2rpx solid #e5e5e5;
    border-radius: 8rpx;
    font-size: 28rpx;
  }
}

/* textarea */
textarea {
  width: 100%;
  min-height: 200rpx;
  padding: 20rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.char-count {
  display: block;
  text-align: right;
  margin-top: 10rpx;
  color: #999;
  font-size: 24rpx;
}

/* radio */
.radio-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  
  radio {
    margin-right: 10rpx;
  }
  
  text {
    font-size: 28rpx;
  }
}

/* checkbox */
.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  
  checkbox {
    margin-right: 10rpx;
  }
  
  text {
    font-size: 28rpx;
  }
}

/* switch */
.switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  
  text {
    font-size: 28rpx;
  }
}

/* slider */
.slider-item {
  text {
    display: block;
    margin-bottom: 20rpx;
    font-size: 28rpx;
  }
}

/* picker */
.picker-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #e5e5e5;
  
  &:last-child {
    border-bottom: none;
  }
  
  .label {
    flex-shrink: 0;
    width: 120rpx;
    font-size: 28rpx;
    color: #333;
  }
  
  .value {
    flex: 1;
    font-size: 28rpx;
    color: #666;
  }
  
  .arrow {
    flex-shrink: 0;
    color: #999;
    font-size: 28rpx;
  }
}

/* button */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.button-styles {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

button {
  margin-bottom: 20rpx;
  border-radius: 8rpx;
}
</style>
