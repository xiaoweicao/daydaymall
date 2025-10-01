# 电商项目完整实战案例

## 📱 项目介绍

这是一个基于 **Vue 3 + TypeScript + UniApp** 开发的跨平台电商应用完整案例。

### 技术栈

- **框架**: UniApp + Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **网络请求**: 封装的 axios 风格请求库
- **UI 组件**: 自定义组件 + UniApp 内置组件
- **代码规范**: ESLint + Prettier

### 功能模块

- ✅ 用户认证（登录/注册/忘记密码）
- ✅ 首页（轮播图、分类、商品推荐）
- ✅ 商品分类
- ✅ 商品列表（搜索、筛选、排序）
- ✅ 商品详情（规格选择、加入购物车）
- ✅ 购物车（商品管理、结算）
- ✅ 订单流程（创建订单、支付、订单管理）
- ✅ 用户中心（个人信息、收货地址、我的订单）
- ✅ 评价系统

### 项目特色

1. **完整的业务流程** - 从浏览商品到下单支付的完整闭环
2. **真实的项目结构** - 符合企业级项目规范
3. **可复用的组件** - 高度封装的业务组件
4. **完善的状态管理** - 使用 Pinia 管理全局状态
5. **优雅的错误处理** - 统一的请求拦截和错误提示
6. **多端适配** - 支持 H5、小程序、App

## 📂 项目结构

```
mall-project/
├── src/
│   ├── api/                      # API 接口
│   │   ├── user.ts              # 用户相关接口
│   │   ├── product.ts           # 商品相关接口
│   │   ├── cart.ts              # 购物车接口
│   │   ├── order.ts             # 订单接口
│   │   └── address.ts           # 地址接口
│   │
│   ├── components/              # 公共组件
│   │   ├── common/              # 通用组件
│   │   │   ├── NavBar.vue      # 导航栏
│   │   │   ├── TabBar.vue      # 底部导航
│   │   │   ├── SearchBar.vue   # 搜索栏
│   │   │   └── Loading.vue     # 加载组件
│   │   │
│   │   ├── business/            # 业务组件
│   │   │   ├── ProductCard.vue # 商品卡片
│   │   │   ├── CartItem.vue    # 购物车项
│   │   │   └── OrderItem.vue   # 订单项
│   │   │
│   │   └── layout/              # 布局组件
│   │       ├── Container.vue
│   │       └── Empty.vue       # 空状态
│   │
│   ├── pages/                   # 页面
│   │   ├── index/               # 首页
│   │   │   └── index.vue
│   │   │
│   │   ├── category/            # 分类
│   │   │   └── category.vue
│   │   │
│   │   ├── cart/                # 购物车
│   │   │   └── cart.vue
│   │   │
│   │   ├── user/                # 用户中心
│   │   │   └── user.vue
│   │   │
│   │   ├── login/               # 登录注册
│   │   │   ├── login.vue
│   │   │   └── register.vue
│   │   │
│   │   ├── product/             # 商品
│   │   │   ├── list.vue        # 商品列表
│   │   │   └── detail.vue      # 商品详情
│   │   │
│   │   ├── order/               # 订单
│   │   │   ├── confirm.vue     # 确认订单
│   │   │   ├── list.vue        # 订单列表
│   │   │   └── detail.vue      # 订单详情
│   │   │
│   │   └── address/             # 地址管理
│   │       ├── list.vue
│   │       └── edit.vue
│   │
│   ├── store/                   # 状态管理
│   │   ├── modules/
│   │   │   ├── user.ts         # 用户状态
│   │   │   ├── cart.ts         # 购物车状态
│   │   │   ├── order.ts        # 订单状态
│   │   │   └── app.ts          # 应用状态
│   │   └── index.ts
│   │
│   ├── utils/                   # 工具函数
│   │   ├── request.ts          # 请求封装
│   │   ├── storage.ts          # 本地存储
│   │   ├── validator.ts        # 表单验证
│   │   ├── format.ts           # 格式化工具
│   │   └── permission.ts       # 权限工具
│   │
│   ├── styles/                  # 全局样式
│   │   ├── common.scss         # 通用样式
│   │   ├── variables.scss      # 变量定义
│   │   └── mixins.scss         # Mixin
│   │
│   ├── types/                   # TypeScript 类型定义
│   │   ├── user.d.ts
│   │   ├── product.d.ts
│   │   ├── cart.d.ts
│   │   └── order.d.ts
│   │
│   ├── static/                  # 静态资源
│   │   ├── images/
│   │   ├── icons/
│   │   └── tabbar/
│   │
│   ├── App.vue                  # 应用入口
│   ├── main.ts                  # 主入口
│   ├── manifest.json            # 应用配置
│   ├── pages.json               # 页面配置
│   └── uni.scss                 # 全局样式变量
│
├── .env.development             # 开发环境变量
├── .env.production              # 生产环境变量
├── .eslintrc.js                 # ESLint 配置
├── .prettierrc                  # Prettier 配置
├── tsconfig.json                # TypeScript 配置
├── vite.config.ts               # Vite 配置
└── package.json
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-repo/uniapp-mall.git
cd uniapp-mall
```

### 2. 安装依赖

```bash
npm install
```

### 3. 运行项目

```bash
# H5
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin

# App
npm run dev:app
```

### 4. 构建项目

```bash
# H5
npm run build:h5

# 微信小程序
npm run build:mp-weixin

# App
npm run build:app
```

## 📖 功能详解

### 1. 用户模块

**功能点：**
- 手机号/邮箱登录
- 短信验证码登录
- 第三方登录（微信、支付宝）
- 用户注册
- 忘记密码
- 个人信息管理
- 头像上传

**技术实现：**
- JWT Token 认证
- Pinia 状态持久化
- 请求拦截器自动添加 Token
- Token 过期自动刷新

### 2. 商品模块

**功能点：**
- 商品分类浏览
- 商品搜索（关键词、历史记录）
- 商品筛选（价格、销量、评价）
- 商品详情（图片预览、规格选择）
- 商品收藏
- 商品评价展示

**技术实现：**
- 虚拟列表优化长列表性能
- 图片懒加载
- SKU 规格选择算法
- 搜索防抖

### 3. 购物车模块

**功能点：**
- 加入购物车
- 购物车列表
- 商品数量修改
- 商品删除
- 全选/反选
- 价格计算
- 失效商品处理

**技术实现：**
- Pinia 状态管理
- 本地存储持久化
- 库存实时校验
- 价格计算优化

### 4. 订单模块

**功能点：**
- 确认订单
- 收货地址选择
- 支付方式选择
- 优惠券使用
- 订单提交
- 订单列表（全部、待付款、待发货、待收货、已完成）
- 订单详情
- 订单取消
- 订单支付
- 确认收货
- 订单评价

**技术实现：**
- 订单状态机管理
- 支付接口集成
- 订单超时自动取消
- 物流信息查询

### 5. 地址模块

**功能点：**
- 地址列表
- 添加地址
- 编辑地址
- 删除地址
- 设置默认地址
- 地区选择器

**技术实现：**
- 省市区三级联动
- 地址表单验证
- 默认地址标记

## 🎨 UI 设计规范

### 颜色规范

```scss
// 主色
$primary-color: #FF6B6B;
$primary-light: #FF8E8E;
$primary-dark: #E85A5A;

// 辅助色
$success-color: #52C41A;
$warning-color: #FAAD14;
$error-color: #F5222D;
$info-color: #1890FF;

// 中性色
$text-color: #333333;
$text-color-secondary: #666666;
$text-color-placeholder: #999999;
$border-color: #E5E5E5;
$background-color: #F5F5F5;
```

### 字体规范

```scss
$font-size-xs: 20rpx;
$font-size-sm: 24rpx;
$font-size-base: 28rpx;
$font-size-lg: 32rpx;
$font-size-xl: 36rpx;
```

### 间距规范

```scss
$spacing-xs: 10rpx;
$spacing-sm: 20rpx;
$spacing-base: 30rpx;
$spacing-lg: 40rpx;
$spacing-xl: 60rpx;
```

## 📊 性能优化

### 1. 代码层面

- 使用虚拟列表处理长列表
- 图片懒加载
- 路由懒加载
- 组件按需加载
- 防抖节流处理

### 2. 资源优化

- 图片压缩
- 小图标使用字体图标
- 静态资源 CDN 加速
- 开启 Gzip 压缩

### 3. 网络优化

- 请求合并
- 接口缓存
- 预加载关键数据
- 骨架屏提升体验

### 4. 小程序优化

- 分包加载
- 独立分包
- 预下载分包
- 控制包体积

## 🔒 安全措施

1. **接口安全**
   - Token 认证
   - 接口签名验证
   - 请求加密

2. **数据安全**
   - 敏感信息加密存储
   - HTTPS 传输
   - XSS 防护

3. **业务安全**
   - 防刷单
   - 防重复提交
   - 支付验证

## 📝 开发规范

### 命名规范

- 组件名：大驼峰（PascalCase）
- 文件名：小写短横线（kebab-case）
- 变量名：小驼峰（camelCase）
- 常量名：大写下划线（UPPER_CASE）

### 代码注释

- 组件必须写清楚功能说明
- 复杂逻辑必须添加注释
- API 接口要注明参数和返回值
- 工具函数要写使用示例

### Git 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
test: 测试
chore: 构建/工具链
```

## 🐛 常见问题

### 1. 支付相关

**Q: 如何集成支付功能？**

A: 参考 `api/payment.ts` 和微信/支付宝官方文档

### 2. 权限相关

**Q: 如何处理未登录用户？**

A: 使用路由守卫，参考 `utils/permission.ts`

### 3. 多端适配

**Q: 如何处理不同平台的差异？**

A: 使用条件编译，参考各个页面的实现

## 📚 学习建议

1. **先理解整体架构** - 从 pages.json 和目录结构开始
2. **学习核心模块** - 用户、商品、购物车、订单
3. **研究状态管理** - Pinia 的使用和数据流
4. **掌握网络请求** - 请求封装和错误处理
5. **实践组件封装** - 学习可复用组件的设计

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT License

---

**开始学习，成为 UniApp 高手！** 🚀
