### `pages.json` 与目录约定

最小示例：

```json
{
  "pages": [
    { "path": "pages/index/index", "style": { "navigationBarTitleText": "首页" } }
  ],
  "globalStyle": { "navigationBarTitleText": "应用" }
}
```

规范建议：

- 页面使用 `pages/<name>/index.vue` 形式，便于一键复制与模块化。
- TabBar 页面放置在 `pages/tabbar/` 下，配置到 `tabBar.list` 中。
- 子包放置在 `subpkg/` 目录，并在 `pages.json` 中声明 `subPackages`。

