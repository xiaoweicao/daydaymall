// business-app/src/main.js
import { createApp } from 'vue';
import Dashboard from './views/Dashboard.vue';
import UserManagement from './views/UserManagement.vue';

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  const app = createApp({
    template: `
      <div>
        <Dashboard v-if="currentRoute === '/dashboard'" />
        <UserManagement v-if="currentRoute === '/users'" />
      </div>
    `,
    data() {
      return {
        currentRoute: window.location.pathname
      };
    },
    components: {
      Dashboard,
      UserManagement
    }
  });
  
  app.mount('#root');
}

// 导出生命周期函数
export async function bootstrap() {
  console.log('Business app bootstraped');
}

export async function mount(props) {
  console.log('Business app mount', props);
  
  const container = props.container ? props.container.querySelector('#root') : document.getElementById('root');
  
  const app = createApp({
    template: `
      <div>
        <Dashboard v-if="currentRoute === '/dashboard'" />
        <UserManagement v-if="currentRoute === '/users'" />
      </div>
    `,
    data() {
      return {
        currentRoute: window.location.pathname
      };
    },
    components: {
      Dashboard,
      UserManagement
    }
  });
  
  app.mount(container);
}

export async function unmount(props) {
  console.log('Business app unmount', props);
  const container = props.container ? props.container.querySelector('#root') : document.getElementById('root');
  container.innerHTML = '';
}