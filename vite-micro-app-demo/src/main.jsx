// src/main.jsx (子应用入口)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}

// 导出生命周期函数
export async function bootstrap() {
  console.log('Vite micro app bootstraped');
}

export async function mount(props) {
  console.log('Vite micro app mount', props);
  const container = props.container ? props.container.querySelector('#root') : document.getElementById('root');
  ReactDOM.createRoot(container).render(<App />);
}

export async function unmount(props) {
  console.log('Vite micro app unmount', props);
  const container = props.container ? props.container.querySelector('#root') : document.getElementById('root');
  container.innerHTML = '';
}