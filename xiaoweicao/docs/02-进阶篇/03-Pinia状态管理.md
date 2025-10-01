### Pinia 状态管理（最小可用）

安装：`npm i pinia`

注册：

```ts
// main.js
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(createPinia())
  return { app }
}
```

定义与使用：

```ts
// stores/user.ts
import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
  state: () => ({ token: '', profile: null }),
  actions: { setToken(t) { this.token = t } }
})

// 组件中
const user = useUserStore()
user.setToken('abc')
```

