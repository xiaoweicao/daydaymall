<!-- main-app/src/App.vue -->
<template>
  <div id="app">
    <!-- 共享的顶部导航栏 -->
    <Header :user="user" @logout="handleLogout" />
    
    <div class="app-container">
      <!-- 共享的侧边栏 -->
      <Sidebar :menu-items="menuItems" />
      
      <!-- 子应用容器 -->
      <main class="main-content">
        <div id="subapp-container"></div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import { useMainStore } from './store';

const mainStore = useMainStore();
const user = ref(null);
const menuItems = ref([
  { name: '仪表板', path: '/dashboard', app: 'business' },
  { name: '用户管理', path: '/users', app: 'business' },
  { name: '系统设置', path: '/settings', app: 'settings' }
]);

// 微前端加载器
let microFrontendLoader = null;

onMounted(async () => {
  // 初始化微前端加载器
  microFrontendLoader = new VueMicroFrontendLoader();
  
  // 注册子应用
  await registerMicroApps();
  
  // 处理路由
  handleRoute(window.location.pathname);
  
  // 监听路由变化
  window.addEventListener('popstate', () => {
    handleRoute(window.location.pathname);
  });
});

// 注册微应用
async function registerMicroApps() {
  // 从API获取应用配置
  const appsConfig = await fetch('/api/micro-apps/config').then(r => r.json());
  
  Object.entries(appsConfig).forEach(([name, config]) => {
    microFrontendLoader.registerApp(name, config);
  });
}

// 处理路由
function handleRoute(path) {
  const targetApp = findAppByPath(path);
  
  if (targetApp) {
    microFrontendLoader.mountApp(targetApp, document.getElementById('subapp-container'));
  }
}

// 根据路径找到对应的应用
function findAppByPath(path) {
  if (path.startsWith('/login') || path.startsWith('/register')) {
    return 'auth';
  } else if (path.startsWith('/dashboard') || path.startsWith('/users')) {
    return 'business';
  } else if (path.startsWith('/settings')) {
    return 'settings';
  }
  return null;
}

// 处理登出
function handleLogout() {
  mainStore.logout();
  window.location.href = '/login';
}
</script>

<style scoped>
.app-container {
  display: flex;
  height: calc(100vh - 60px);
}

.main-content {
  flex: 1;
  padding: 20px;
  background: #f5f5f5;
}

#subapp-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  min-height: 400px;
}
</style>