<!-- auth-app/src/views/Register.vue -->
<template>
  <div class="register-container">
    <div class="register-form">
      <h2>用户注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>用户名</label>
          <input 
            v-model="registerForm.username" 
            type="text" 
            required 
            placeholder="请输入用户名"
          />
        </div>
        
        <div class="form-group">
          <label>邮箱</label>
          <input 
            v-model="registerForm.email" 
            type="email" 
            required 
            placeholder="请输入邮箱"
          />
        </div>
        
        <div class="form-group">
          <label>密码</label>
          <input 
            v-model="registerForm.password" 
            type="password" 
            required 
            placeholder="请输入密码"
          />
        </div>
        
        <div class="form-group">
          <label>确认密码</label>
          <input 
            v-model="registerForm.confirmPassword" 
            type="password" 
            required 
            placeholder="请再次输入密码"
          />
        </div>
        
        <button type="submit" :disabled="loading" class="register-btn">
          {{ loading ? '注册中...' : '注册' }}
        </button>
        
        <div class="form-footer">
          <a href="/login">已有账号？立即登录</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const loading = ref(false);

// 处理注册
async function handleRegister() {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('两次输入的密码不一致');
    return;
  }
  
  loading.value = true;
  
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: registerForm.value.username,
        email: registerForm.value.email,
        password: registerForm.value.password
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('注册成功！请登录');
      window.location.href = '/login';
    } else {
      alert('注册失败：' + result.message);
    }
  } catch (error) {
    console.error('Register error:', error);
    alert('注册失败，请重试');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.register-form {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.register-form h2 {
  text-align: center;
  margin-bottom: 30px;
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
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.register-btn {
  width: 100%;
  padding: 12px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
}

.register-btn:hover:not(:disabled) {
  background: #229954;
}

.register-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
}

.form-footer a {
  color: #3498db;
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}
</style>