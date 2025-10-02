// auth-app/src/main.js
import { createApp } from 'vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  const app = createApp({
    template: `
      <div>
        <Login v-if="currentRoute === '/login'" />
        <Register v-if="currentRoute === '/register'" />
      </div>
    `,
    data() {
      return {
        currentRoute: window.location.pathname
      };
    },
    components: {
      Login,
      Register
    }
  });
  
  app.mount('#root');
}

// 导出生命周期函数
export async function bootstrap() {
  console.log('Auth app bootstraped');
}

export async function mount(props) {
  console.log('Auth app mount', props);
  
  const container = props.container ? props.container.querySelector('#root') : document.getElementById('root');
  
  const app = createApp({
    template: `
      <div>
        <Login v-if="currentRoute === '/login'" />
        <Register v-if="currentRoute === '/register'" />
      </div>
    `,
    data() {
      return {
        currentRoute: window.location.pathname
      };
    },
    components: {
      Login,
      Register
    }
  });
  
  app.mount(container);
}

export async function unmount(props) {
  console.log('Auth app unmount', props);
  const container = props.container ? props.container.querySelector('#root') : document.getElementById('root');
  container.innerHTML = '';
}