<!-- main-app/src/components/Header.vue -->
<template>
  <header class="header">
    <div class="header-left">
      <h1>微前端系统</h1>
    </div>
    
    <div class="header-right">
      <span v-if="user" class="user-info">
        欢迎，{{ user.name }}
      </span>
      <button v-if="user" @click="$emit('logout')" class="logout-btn">
        退出登录
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    default: null
  }
});

defineEmits(['logout']);
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background: #2c3e50;
  color: white;
}

.header-left h1 {
  margin: 0;
  font-size: 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  font-size: 14px;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #c0392b;
}
</style>