// 主应用 - 微前端加载器
class ViteMicroFrontendLoader {
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

  // 通过manifest动态加载应用
  async loadApp(appName) {
    const app = this.apps.get(appName);
    if (!app) throw new Error(`App ${appName} not found`);

    if (app.status === 'loaded') return app.instance;

    try {
      // 1. 加载manifest文件
      const manifestUrl = `${app.baseUrl}/manifest.json`;
      const manifestResponse = await fetch(manifestUrl);
      const manifest = await manifestResponse.json();
      
      // 2. 获取实际的文件名
      const entryFile = manifest['src/main.jsx']?.file;
      if (!entryFile) {
        throw new Error(`Entry file not found in manifest for ${appName}`);
      }

      // 3. 构建完整的URL
      const appUrl = `${app.baseUrl}/${entryFile}`;
      
      // 4. 检查缓存
      if (this.cache.has(appUrl)) {
        app.instance = this.cache.get(appUrl);
        app.status = 'loaded';
        return app.instance;
      }

      // 5. 动态加载脚本
      const instance = await this.loadScript(appUrl);
      
      // 6. 缓存实例
      this.cache.set(appUrl, instance);
      app.instance = instance;
      app.status = 'loaded';
      
      return instance;
    } catch (error) {
      console.error(`Failed to load ${appName}:`, error);
      throw error;
    }
  }

  // 加载脚本文件
  loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => {
        // 从URL提取应用名称
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

  // 从URL提取应用名称
  extractAppNameFromUrl(url) {
    // 根据Vite配置的name字段
    return 'MicroApp';
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

  // 路由处理
  handleRoute(path) {
    const targetApp = this.findAppByPath(path);
    
    if (targetApp !== this.currentApp) {
      // 卸载当前应用
      if (this.currentApp) {
        this.unmountApp(this.currentApp);
      }

      // 挂载目标应用
      if (targetApp) {
        this.mountApp(targetApp, document.getElementById('subapp-container'));
      }

      this.currentApp = targetApp;
    }
  }

  findAppByPath(path) {
    for (const [appName, app] of this.apps) {
      if (path.startsWith(app.activeRule)) {
        return appName;
      }
    }
    return null;
  }
}