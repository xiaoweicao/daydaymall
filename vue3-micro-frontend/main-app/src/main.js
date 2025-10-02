// main-app/src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import pinia from './store';

// 微前端加载器
class VueMicroFrontendLoader {
  constructor() {
    this.apps = new Map();
    this.cache = new Map();
  }

  // 注册应用
  registerApp(name, config) {
    this.apps.set(name, {
      ...config,
      status: 'not-loaded',
      instance: null
    });
  }

  // 加载应用
  async loadApp(appName) {
    const app = this.apps.get(appName);
    if (!app) throw new Error(`App ${appName} not found`);

    if (app.status === 'loaded') return app.instance;

    try {
      // 加载manifest
      const manifestUrl = `${app.baseUrl}/manifest.json`;
      const manifestResponse = await fetch(manifestUrl);
      const manifest = await manifestResponse.json();
      
      // 获取实际文件名
      const entryFile = manifest['src/main.js']?.file;
      if (!entryFile) {
        throw new Error(`Entry file not found in manifest for ${appName}`);
      }

      const appUrl = `${app.baseUrl}/${entryFile}`;
      
      // 检查缓存
      if (this.cache.has(appUrl)) {
        app.instance = this.cache.get(appUrl);
        app.status = 'loaded';
        return app.instance;
      }

      // 加载脚本
      const instance = await this.loadScript(appUrl);
      
      this.cache.set(appUrl, instance);
      app.instance = instance;
      app.status = 'loaded';
      
      return instance;
    } catch (error) {
      console.error(`Failed to load ${appName}:`, error);
      throw error;
    }
  }

  // 加载脚本
  loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => {
        const appName = this.extractAppNameFromUrl(url);
        const instance = window[appName];
        if (instance) {
          resolve(instance);
        } else {
          reject(new Error(`App instance not found for ${appName}`));
        }
      };
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      document.head.appendChild(script);
    });
  }

  extractAppNameFromUrl(url) {
    return 'VueMicroApp';
  }

  // 挂载应用
  async mountApp(appName, container) {
    const app = this.apps.get(appName);
    if (!app) throw new Error(`App ${appName} not found`);

    if (app.status !== 'loaded') {
      await this.loadApp(appName);
    }

    if (app.instance && app.instance.mount) {
      await app.instance.mount({ container });
    }
    app.status = 'mounted';
  }

  // 卸载应用
  async unmountApp(appName) {
    const app = this.apps.get(appName);
    if (!app || app.status !== 'mounted') return;

    if (app.instance && app.instance.unmount) {
      await app.instance.unmount();
    }
    app.status = 'loaded';
  }
}

// 创建应用
const app = createApp(App);
app.use(pinia);

// 将微前端加载器挂载到全局
window.VueMicroFrontendLoader = VueMicroFrontendLoader;

app.mount('#app');