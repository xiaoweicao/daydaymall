<!-- settings-app/src/views/Settings.vue -->
<template>
  <div class="settings">
    <h2>系统设置</h2>
    
    <div class="settings-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>
    
    <div class="settings-content">
      <!-- 基本设置 -->
      <div v-if="activeTab === 'basic'" class="settings-section">
        <h3>基本设置</h3>
        <form @submit.prevent="saveBasicSettings">
          <div class="form-group">
            <label>系统名称</label>
            <input v-model="basicSettings.systemName" type="text" />
          </div>
          
          <div class="form-group">
            <label>系统描述</label>
            <textarea v-model="basicSettings.systemDescription" rows="3"></textarea>
          </div>
          
          <div class="form-group">
            <label>时区</label>
            <select v-model="basicSettings.timezone">
              <option value="Asia/Shanghai">Asia/Shanghai</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>
          
          <button type="submit" class="save-btn">保存设置</button>
        </form>
      </div>
      
      <!-- 安全设置 -->
      <div v-if="activeTab === 'security'" class="settings-section">
        <h3>安全设置</h3>
        <form @submit.prevent="saveSecuritySettings">
          <div class="form-group">
            <label>
              <input v-model="securitySettings.enableTwoFactor" type="checkbox" />
              启用双因素认证
            </label>
          </div>
          
          <div class="form-group">
            <label>
              <input v-model="securitySettings.sessionTimeout" type="checkbox" />
              启用会话超时
            </label>
          </div>
          
          <div class="form-group">
            <label>会话超时时间（分钟）</label>
            <input v-model="securitySettings.timeoutMinutes" type="number" min="5" max="1440" />
          </div>
          
          <button type="submit" class="save-btn">保存设置</button>
        </form>
      </div>
      
      <!-- 通知设置 -->
      <div v-if="activeTab === 'notifications'" class="settings-section">
        <h3>通知设置</h3>
        <form @submit.prevent="saveNotificationSettings">
          <div class="form-group">
            <label>
              <input v-model="notificationSettings.emailNotifications" type="checkbox" />
              邮件通知
            </label>
          </div>
          
          <div class="form-group">
            <label>
              <input v-model="notificationSettings.smsNotifications" type="checkbox" />
              短信通知
            </label>
          </div>
          
          <div class="form-group">
            <label>
              <input v-model="notificationSettings.pushNotifications" type="checkbox" />
              推送通知
            </label>
          </div>
          
          <button type="submit" class="save-btn">保存设置</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const activeTab = ref('basic');

const tabs = [
  { id: 'basic', name: '基本设置' },
  { id: 'security', name: '安全设置' },
  { id: 'notifications', name: '通知设置' }
];

const basicSettings = ref({
  systemName: '',
  systemDescription: '',
  timezone: 'Asia/Shanghai'
});

const securitySettings = ref({
  enableTwoFactor: false,
  sessionTimeout: false,
  timeoutMinutes: 30
});

const notificationSettings = ref({
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true
});

onMounted(() => {
  loadSettings();
});

// 加载设置
async function loadSettings() {
  try {
    const response = await fetch('/api/settings');
    const data = await response.json();
    
    basicSettings.value = data.basic || basicSettings.value;
    securitySettings.value = data.security || securitySettings.value;
    notificationSettings.value = data.notifications || notificationSettings.value;
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

// 保存基本设置
async function saveBasicSettings() {
  try {
    await fetch('/api/settings/basic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(basicSettings.value)
    });
    alert('基本设置保存成功');
  } catch (error) {
    console.error('Failed to save basic settings:', error);
    alert('保存失败，请重试');
  }
}

// 保存安全设置
async function saveSecuritySettings() {
  try {
    await fetch('/api/settings/security', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(securitySettings.value)
    });
    alert('安全设置保存成功');
  } catch (error) {
    console.error('Failed to save security settings:', error);
    alert('保存失败，请重试');
  }
}

// 保存通知设置
async function saveNotificationSettings() {
  try {
    await fetch('/api/settings/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationSettings.value)
    });
    alert('通知设置保存成功');
  } catch (error) {
    console.error('Failed to save notification settings:', error);
    alert('保存失败，请重试');
  }
}
</script>

<style scoped>
.settings {
  padding: 20px;
}

.settings h2 {
  margin-bottom: 30px;
  color: #333;
}

.settings-tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 30px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: #666;
}

.tab-btn:hover {
  color: #333;
}

.tab-btn.active {
  color: #3498db;
  border-bottom-color: #3498db;
}

.settings-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.settings-section h3 {
  margin-top: 0;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
}

.form-group input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.save-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.save-btn:hover {
  background: #2980b9;
}
</style>