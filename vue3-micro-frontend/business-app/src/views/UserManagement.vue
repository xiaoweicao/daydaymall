<!-- business-app/src/views/UserManagement.vue -->
<template>
  <div class="user-management">
    <div class="page-header">
      <h2>用户管理</h2>
      <button @click="showAddUser = true" class="add-btn">添加用户</button>
    </div>
    
    <div class="search-bar">
      <input 
        v-model="searchKeyword" 
        type="text" 
        placeholder="搜索用户..."
        @input="handleSearch"
      />
    </div>
    
    <div class="user-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['status', user.status]">
                {{ user.status === 'active' ? '活跃' : '禁用' }}
              </span>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <button @click="editUser(user)" class="edit-btn">编辑</button>
              <button @click="deleteUser(user.id)" class="delete-btn">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 添加用户模态框 -->
    <div v-if="showAddUser" class="modal-overlay" @click="showAddUser = false">
      <div class="modal" @click.stop>
        <h3>添加用户</h3>
        <form @submit.prevent="handleAddUser">
          <div class="form-group">
            <label>用户名</label>
            <input v-model="newUser.username" type="text" required />
          </div>
          <div class="form-group">
            <label>邮箱</label>
            <input v-model="newUser.email" type="email" required />
          </div>
          <div class="form-group">
            <label>密码</label>
            <input v-model="newUser.password" type="password" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="save-btn">保存</button>
            <button type="button" @click="showAddUser = false" class="cancel-btn">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const users = ref([]);
const searchKeyword = ref('');
const showAddUser = ref(false);
const newUser = ref({
  username: '',
  email: '',
  password: ''
});

// 过滤后的用户列表
const filteredUsers = computed(() => {
  if (!searchKeyword.value) return users.value;
  
  return users.value.filter(user => 
    user.username.includes(searchKeyword.value) ||
    user.email.includes(searchKeyword.value)
  );
});

onMounted(() => {
  loadUsers();
});

// 加载用户列表
async function loadUsers() {
  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    users.value = data;
  } catch (error) {
    console.error('Failed to load users:', error);
    // 使用模拟数据
    users.value = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        status: 'active',
        createdAt: '2024-01-01'
      },
      {
        id: 2,
        username: 'user1',
        email: 'user1@example.com',
        status: 'active',
        createdAt: '2024-01-02'
      }
    ];
  }
}

// 搜索处理
function handleSearch() {
  // 搜索逻辑已在computed中处理
}

// 编辑用户
function editUser(user) {
  console.log('Edit user:', user);
  // 实现编辑逻辑
}

// 删除用户
async function deleteUser(userId) {
  if (confirm('确定要删除这个用户吗？')) {
    try {
      await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      users.value = users.value.filter(user => user.id !== userId);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  }
}

// 添加用户
async function handleAddUser() {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser.value)
    });
    
    const result = await response.json();
    if (result.success) {
      users.value.push(result.user);
      showAddUser.value = false;
      newUser.value = { username: '', email: '', password: '' };
    }
  } catch (error) {
    console.error('Failed to add user:', error);
  }
}

// 格式化日期
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.add-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 300px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.user-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-table table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.user-table th {
  background: #f8f9fa;
  font-weight: 600;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.status.inactive {
  background: #f8d7da;
  color: #721c24;
}

.edit-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
}

.delete-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
}

.modal h3 {
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
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.save-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background: #95a5a6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
</style>