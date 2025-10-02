// main-app/src/store/index.js
import { createPinia, defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),
  
  actions: {
    // 登录
    login(userData, token) {
      this.user = userData;
      this.token = token;
      this.isAuthenticated = true;
      
      // 保存到localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
    },
    
    // 登出
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      
      // 清除localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    
    // 初始化状态
    init() {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (user && token) {
        this.user = JSON.parse(user);
        this.token = token;
        this.isAuthenticated = true;
      }
    }
  }
});

export default createPinia();