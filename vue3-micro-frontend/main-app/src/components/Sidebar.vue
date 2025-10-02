<!-- main-app/src/components/Sidebar.vue -->
<template>
  <aside class="sidebar">
    <nav>
      <ul class="menu-list">
        <li v-for="item in menuItems" :key="item.path" class="menu-item">
          <a 
            :href="item.path" 
            :class="{ active: isActive(item.path) }"
            @click="handleMenuClick($event, item)"
          >
            {{ item.name }}
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  menuItems: {
    type: Array,
    required: true
  }
});

// 检查当前路径是否激活
function isActive(path) {
  return window.location.pathname.startsWith(path);
}

// 处理菜单点击
function handleMenuClick(event, item) {
  event.preventDefault();
  
  // 更新URL
  window.history.pushState(null, '', item.path);
  
  // 触发路由变化事件
  window.dispatchEvent(new PopStateEvent('popstate'));
}
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: #34495e;
  color: white;
  padding: 20px 0;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin-bottom: 5px;
}

.menu-item a {
  display: block;
  padding: 12px 20px;
  color: #ecf0f1;
  text-decoration: none;
  transition: background-color 0.3s;
}

.menu-item a:hover {
  background: #2c3e50;
}

.menu-item a.active {
  background: #3498db;
}
</style>