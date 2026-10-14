# CHANGELOG

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
