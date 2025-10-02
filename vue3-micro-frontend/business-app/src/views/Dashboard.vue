<!-- business-app/src/views/Dashboard.vue -->
<template>
  <div class="dashboard">
    <h2>仪表板</h2>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>总用户数</h3>
        <p class="stat-number">{{ stats.totalUsers }}</p>
      </div>
      
      <div class="stat-card">
        <h3>今日访问</h3>
        <p class="stat-number">{{ stats.todayVisits }}</p>
      </div>
      
      <div class="stat-card">
        <h3>订单数量</h3>
        <p class="stat-number">{{ stats.orders }}</p>
      </div>
      
      <div class="stat-card">
        <h3>收入金额</h3>
        <p class="stat-number">¥{{ stats.revenue }}</p>
      </div>
    </div>
    
    <div class="chart-section">
      <h3>访问趋势</h3>
      <div class="chart-placeholder">
        <p>这里可以集成图表组件</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const stats = ref({
  totalUsers: 0,
  todayVisits: 0,
  orders: 0,
  revenue: 0
});

onMounted(async () => {
  // 模拟加载数据
  await loadDashboardData();
});

async function loadDashboardData() {
  try {
    // 模拟API调用
    const response = await fetch('/api/dashboard/stats');
    const data = await response.json();
    stats.value = data;
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    // 使用模拟数据
    stats.value = {
      totalUsers: 1234,
      todayVisits: 567,
      orders: 89,
      revenue: 45678
    };
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard h2 {
  margin-bottom: 30px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #3498db;
  margin: 0;
}

.chart-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chart-section h3 {
  margin-top: 0;
  color: #333;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 4px;
  color: #666;
}
</style>