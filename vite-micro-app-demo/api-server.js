// API服务 - 微应用配置管理
const express = require('express');
const app = express();

// 微应用配置数据库
const microApps = {
  'app1': {
    name: 'app1',
    version: '1.2.3',
    baseUrl: 'https://cdn.example.com/micro-apps/app1/v1.2.3',
    activeRule: '/app1',
    status: 'active'
  },
  'app2': {
    name: 'app2', 
    version: '2.1.0',
    baseUrl: 'https://cdn.example.com/micro-apps/app2/v2.1.0',
    activeRule: '/app2',
    status: 'active'
  }
};

// 获取所有应用配置
app.get('/micro-apps/config', (req, res) => {
  res.json(microApps);
});

// 获取单个应用配置
app.get('/micro-apps/:appName', (req, res) => {
  const appName = req.params.appName;
  const app = microApps[appName];
  
  if (!app) {
    return res.status(404).json({ error: 'App not found' });
  }
  
  res.json(app);
});

// 获取应用最新版本
app.get('/micro-apps/:appName/latest', (req, res) => {
  const appName = req.params.appName;
  const app = microApps[appName];
  
  if (!app) {
    return res.status(404).json({ error: 'App not found' });
  }
  
  res.json(app);
});

// 部署新版本
app.post('/micro-apps/:appName/deploy', (req, res) => {
  const appName = req.params.appName;
  const appInfo = req.body;
  
  // 更新应用配置
  microApps[appName] = {
    ...microApps[appName],
    ...appInfo,
    deployTime: new Date().toISOString()
  };
  
  res.json({ success: true, app: microApps[appName] });
});

app.listen(3000, () => {
  console.log('API服务运行在端口 3000');
});