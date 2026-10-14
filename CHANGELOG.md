# CHANGELOG

## v2.1.0 — 2026-10-14

P0 与 P1 落地。这一版的共同点是：**把「只有人打开页面才发现不对」的问题交给机器判。**

### 新增

- **工作流 raw 端点**（可编程取用）：
  - `/workflows/<slug>.json` —— 提示词 + 参数（含中英两种占位符写法）+ 输出格式，带 CORS
  - `/workflows/<slug>.raw.md` —— 仓库里的原始 markdown，方便 `curl` 到本地 diff
  - `/workflows.json` —— 全量索引
  三条都**故意走 Worker、不预渲染**：静态文件会丢掉 `access-control-allow-origin`，
  跨域 fetch 就废了，而能被别的程序取走正是它们存在的意义。详情页有对应的发现区块。
- **OG 分享卡换成真 PNG**（1200×630）。原来是 SVG，Twitter / Facebook / 微信都不认。
  `scripts/build-og.mjs` 用本机 chromium 截图，中文渲染和设计稿一致；
  数字从 catalog 读，改完内容 `pnpm og` 重跑即可。
- **试跑结果可留存**：结果面板加「存结果（含参数）」，把参数表 + 实际发出的提示词 +
  输出一起存成 `.md`。之前只存在于浏览器里，刷新就没。
- **工作流反馈**：详情页底部「跑通了 / 没用」两按钮，落 KV。
  **没绑 KV 时接口返回 `stored:false`、页面显示「这次没记上」，不假装记录成功。**
- **内容不变式检查** `scripts/check-catalog.mjs`（`pnpm check`，已接进 CI）。
  专抓构建不报错但页面不对的那类问题：字段只有单语占位符、中英占位符数量不一致
  导致按索引配对整体错位、参数全填完提示词里还留着方括号。
- 新增 `pnpm og` 与 `pnpm check` 两个脚本。

### 修复

- **9 个工作流补上英文提示词**，16/16 双语。顺带修掉 4 个旧英文版本身的缺口：
  - `script-outline` 的英文版没有配角那一行 → 英文下第 7 个参数无处可填
  - `portfolio-review` 的英文表格少一行 `[Fund B]` → 中英占位符数量差 1，**按索引配对整体错位**
  - `listing-optimize` 的英文版缺「现有 listing」输入项
  - `product-research` 的 `[X]` 被复选框过滤器误杀 —— 过滤器只判了「是不是单个 x」，
    把最常用的「填个数字」占位符也当成了任务列表。改成必须形如 `- [x]` 才算
- **同一字段的多种占位符写法现在都会被替换**。`trend-analysis` 的「平台」在正文里
  写成 `[平台]`、在列表里写成 `[抖音/快手/B站/小红书]`，合并成一个字段后只会替换第一处。
  字段结构从单个 token 改成 token 数组。
- `threat-modeling` 的 `[资产2]/[资产3]` 之前被 `FIELD_OVERRIDES` 屏蔽掉，
  导致这两个占位符永远填不上。改为给三个资产各起一个说得清的名字，不再屏蔽。
- **`SITE_URL` 收敛成单一来源**：原来要改两个地方，而且 `wrangler.jsonc` 里的那份
  没有任何代码读它（改了不起作用，但看着像是生效了）。现在唯一来源是
  `apps/site/site-url.txt`，`pnpm deploy` 会先检查，占位值直接拦住并说明怎么改。
- raw 端点里的 URL 出现了双斜杠（`https://host//workflows/...`）。
- 结果区在没跑过时会显示占位文案，早先「复制结果 / 存结果」会把这段提示语也一起存进 `.md`。

### 变更

- CI 增加 `pnpm catalog`（含不变式检查），内容有问题直接红。
- `deploy-cloudflare.yml` 在缺少 `vars.SITE_URL` 时跳过并说明原因，而不是带着占位域名发上线。
- `docs/DEPLOY.md` 重写相关章节：SITE_URL 单一来源、KV 双用途（限流 + 反馈）、
  机器可读端点、加工作流的完整流程。`docs/ROADMAP.md` 标记已完成项并重排 P0/P1/P2。

### 移除

- `apps/site/public/og.svg`（被 `og.png` + `og-src/template.html` 取代）。

---

## v2.0.0 — 2026-10-14

从「一个静态橱窗」变成「一个能用的工具」。核心改动只有一条原则：
**内容只有一个来源，页面是它的编译产物。**

### 新增

- **Astro 5 站点**（`apps/site/`），部署为 Cloudflare Worker + 静态资源。
  内容页全部预渲染成静态 HTML（部署产物 707 KiB / gzip 164 KiB，23 个 URL），
  只有 `/api/run` 走 Worker。
- **参数表单**：构建脚本从提示词里自动识别 `[占位符]` 与 `{{变量}}`，
  生成可填表单（本次覆盖 16/16 个工作流，共 83 个字段）。
  填完实时替换，提示词自动拼好。
- **一键复制 / 下载 .md / 分享链接**：分享链接把参数编码进 `?p=`，打开即还原。
- **站内试跑**（`POST /api/run`）：SSE 流式输出。三种后端按可用性退化 ——
  自建 OpenAI 兼容端点 → Cloudflare Workers AI（零配置）→ 本地演示模式。
  可选 KV 限流。
- **每个工作流一个独立 URL**，带 canonical / OG / Twitter 卡片 /
  JSON-LD（HowTo + BreadcrumbList + TechArticle）。
- **自动 sitemap.xml、robots.txt**，以及 **`/llms.txt` + `/llms-full.txt`** ——
  给 AI 爬虫的结构化索引（提示词库最值钱的流量入口）。
- **可搜索的全量列表页**（关键词 + 分类筛选，纯前端、渐进增强）。
- **GitHub Actions**：`ci.yml`（构建即内容校验）+ `deploy-cloudflare.yml`（push 即上线）。
- 新增文档：`docs/DEPLOY.md`（部署 runbook）、`docs/ROADMAP.md`（往哪走）。

### 修复

- **`workflows/content/short-video-script.md` 提示词代码块提前闭合**：
  提示词正文里嵌了裸的三反引号，导致该块在 GitHub 上渲染错位、复制出来是断的。
  外层改为四反引号包裹。
- **`workflows/content/batch-content-creation.md` 残留 `{{topic}}` 模板变量**：
  与后面 `## 我的主题` 一节表达同一件事，用户会不知道该填哪个。已统一为 `[占位符]`。
- 中文标题被英文顶掉：H1 是「English / 中文」的文件，
  页面标题会显示成英文。现在按「有没有汉字」区分，与顺序无关。

### 变更

- `workflows/**/*.md` 保持原样作为**唯一内容源**，但格式从「给人读」升级为「接口契约」：
  构建脚本会校验结构，抽不到提示词 / 代码块没闭合会直接 `exit 1` 中断构建。
- README 重写；`README_CN.md` 合并进 `README.md`（原来两份内容几乎一样，已经分叉过）。
- `CONTRIBUTING.md` 重写：把「脚本怎么读这个文件」写成表格，
  并明确两个必须避开的坑（嵌套代码块、「输出格式」示例的位置）。
- 旧的静态 launcher 移到 `legacy/launcher.html` 留档；
  根目录重复的 `index.html` 删除。
- GitHub Pages 部署（`deploy-pages.yml`）与无意义的 `demo.yml` 移除，
  由 Cloudflare Workers 部署替代。

### 移除

- `launcher/`（→ `legacy/`）、根 `index.html`、`.github/workflows/deploy-pages.yml`、
  `.github/workflows/demo.yml`。

---

## v1.2 — 2026-06-01

- 龙虾工具包 + 3 个新内容创作工作流 + 交互式 launcher + 平台部署指南。

## v1.0 — 2026-06-01

- 初始版本：16 个工作流、README、MIT 协议。
