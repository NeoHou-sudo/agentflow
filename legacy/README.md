# legacy/ — 留档

这里放的是 v2.0.0 之前的东西，**不参与构建，不要在这里改东西**。

| 文件 | 是什么 |
|---|---|
| `launcher-v1.4.html` | v1.4 的在线工具箱页（59 KB，带工作流卡片展开、输入/输出示例标签页、4 个演示工具）。原来在仓库根目录当 `index.html`，也是 GitHub Pages 实际对外的那一版 |
| `launcher.html` | 更早的 launcher（23 KB，纯卡片 + 平台部署弹窗），原来在 `launcher/launcher.html` |
| `README-v1.4.md` / `README_CN-v1.4.md` | v1.4 的两份 README。注意这两份**内容几乎一样但已经分叉过**，正是 v2.0.0 把它们合并成一份的原因 |
| `deploy-pages.yml` | 旧的 GitHub Pages 部署 workflow。v2.0.0 起改用 Cloudflare Workers，这个不再生效 |

这些东西随时可以从 `git show v1.4:<路径>` 取回，留在这里只是省一次查历史的功夫。

v2.0.0 的站点在 [`apps/site/`](../apps/site/)，内容源在 [`workflows/`](../workflows/)。
