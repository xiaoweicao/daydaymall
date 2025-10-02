// 实际生产环境的微前端加载器
class ProductionMicroFrontendLoader {
  constructor() {
    this.apps = new Map();
    this.manifests = new Map();
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

  // 加载manifest文件
  async loadManifest(appName, baseUrl) {
    if (this.manifests.has(appName)) {
      return this.manifests.get(appName);
    }

    try {
      const manifestUrl = `${baseUrl}/manifest.json`;
      const response = await fetch(manifestUrl);
      const manifest = await response.json();
      this.manifests.set(appName, manifest);
      return manifest;
    } catch (error) {
      console.error(`Failed to load manifest for ${appName}:`, error);
      throw error;
    }
  }

  // 根据manifest加载应用
  async loadApp(appName) {
    const app = this.apps.get(appName);
    if (!app) throw new Error(`App ${appName} not found`);

    if (app.status === 'loaded') return app.instance;

    try {
      // 加载manifest
      const manifest = await this.loadManifest(appName, app.baseUrl);
      
      // 获取入口文件
      const entryFile = manifest['src/main.jsx']?.file;
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

  // 加载脚本文件
  loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => {
        // 根据URL提取应用名称
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
    const match = url.match(/\/([^\/]+)\/micro-app\.(es|umd)\.js$/);
    return match ? match[1] : 'ViteMicroApp';
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

// 使用示例
const microFrontend = new ProductionMicroFrontendLoader();

// 注册应用
microFrontend.registerApp('app1', {
  baseUrl: 'https://cdn.example.com/micro-apps/app1/v1.2.3',
  activeRule: '/app1'
});

microFrontend.registerApp('app2', {
  baseUrl: 'https://cdn.example.com/micro-apps/app2/v2.1.0',
  activeRule: '/app2'
});

// 路由处理
function handleRoute(path) {
  const targetApp = findAppByPath(path);
  if (targetApp) {
    microFrontend.mountApp(targetApp, document.getElementById('subapp-container'));
  }
}

function findAppByPath(path) {
  for (const [appName, app] of microFrontend.apps) {
    if (path.startsWith(app.activeRule)) {
      return appName;
    }
  }
  return null;
}

// 导出供主应用使用
window.MicroFrontendLoader = ProductionMicroFrontendLoader;