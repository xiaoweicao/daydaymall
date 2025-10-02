// settings-app/src/main.js
import { createApp } from 'vue';
import Settings from './views/Settings.vue';

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  const app = createApp(Settings);
  app.mount('#root');
}

// 导出生命周期函数
export async function bootstrap() {
  console.log('Settings app bootstraped');
}

export async function mount(props) {
  console.log('Settings app mount', props);
  
  const container = props.container ? props.container.querySelector('#root') : document.getElementById('root');
  
  const app = createApp(Settings);
  app.mount(container);
}

export async function unmount(props) {
  console.log('Settings app unmount', props);
  const container = props.container ? props.container.querySelector('#root') : document.getElementById('root');
  container.innerHTML = '';
}