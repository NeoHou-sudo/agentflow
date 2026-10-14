# CHANGELOG

## v2.4.0 — 2026-10-14

**公司品牌拿掉，视觉风格不变。**

Neo：「公司品牌拿掉，但是视觉风格不变」。所以拆的是品牌词，不动视觉。

### 变更

- **壳 `qianyi` → `harbor`**（Harbor 港口）。改名是因为它不再是品牌壳，
  留着公司拼音当 id 会让人以为还带着品牌。
- **摘掉的（品牌）**：
  - 公司名与英文名 —— 副标题位现在留空，页眉只有产品名
  - 主 Slogan「让世界记得中国工厂」、意象句「浅处起云，忆通四海」、
    英文句「Made in China. Remembered by the world.」、业务口号「自己的站，自己的客户」
  - 页脚的品牌意象句
  - `shells.mjs` 的 `brand` 字段与它的校验器（`BRAND_KEYS` / `assertBrandValid`）——
    不带品牌就不需要出处校验，留着是死代码
  - 营销素材包里的公司 FAQ、合规提示、品牌向的渠道稿（官网首屏 / 邮件签名那几段）
- **原样保留的（视觉）**：全部 25 个颜色与圆角 token、字体栈（宋体标题 / 黑体正文 /
  Inter / JetBrains Mono）、排版纪律（标题字距 +0.05~0.14em、英文辅助行全大写 +0.30em、
  正文行高 1.85）、`markSvg` 标记图形（云 + 帆 + 水线、金色前帆，未改色未拆件）、
  70/20/10 用色比例、圆角方形徽章。

### 修复

- **`global.css` 里的壳选择器还是 `qianyi`**，而壳 id 已改成 `harbor` ——
  不修的话整套壳的样式一条都不会生效（宋体标题、行高 1.85、曦金强调全部失效），
  而且**构建不报错**。已改为 `harbor`（54 处）。
- **页脚的字符兜底标记读起来是「港 AgentFlow」**。页眉已经有真 Logo，
  页脚不再放标记。

### 说明

- 标记图形沿用了原手册里的主符号。它是「云 + 帆 + 水线」这个图形，
  不带公司名和商标声明；但如果要连图形一起去掉，把 `shells.mjs` 里
  `harbor.markSvg` 删掉即可，会退回字符标记。
- `docs/ROADMAP.md` 与 `shells/_shared.md` 里的相关段落改成中性的「视觉来源」说明，
  指向那份手册的规范、但不带品牌名与链接。

---

## v2.3.0 — 2026-10-14

**壳升级成完整概念：视觉 + 站点文案 + README + 营销素材，同一份配置。**

起因是 Neo 说「我说的壳子不只是外观，还有 README 和营销的壳子」。
v2.2.0 只把外观抽成了主题，README 还是手写一份、对外说法散在各处 —— 换壳只换到一半。

### 新增

- **壳注册表** `apps/site/shells.mjs`（原 `themes.mjs`）。一个壳现在包含：
  `tokens`（视觉）/ `fonts` / `mark` + `markSvg`（标记）/ `hero` + `tagline`（站点文案）/
  `copy`（description、audience、props、pitch、tone）/ `brand`（品牌出处）。
- **第四个壳 `qianyi`（浅忆云品牌壳）**，完全按《浅忆云_品牌视觉手册_V1》做：
  - 色板：靛海 `#0C2440` / 远天 `#1D4F82` / 曦金 `#D9A441` / 云青 `#6FA8BF` /
    月白 `#F4F7FA` / 墨 `#16202B` / 灰蓝 / 线条 `#DFE6EE`
  - 70 / 20 / 10 用色比例：70% 月白留白、20% 靛海结构与文字、10% 曦金只给一个点
  - 字体：中文标题思源宋体 / 中文正文思源黑体 / 英文 Inter / 数字与代码 JetBrains Mono
  - 排版纪律：标题字距 +0.05~0.14em、英文辅助行全大写 +0.30em、正文行高 1.85
  - Slogan 体系：主 Slogan「让世界记得中国工厂」、意象句「浅处起云，忆通四海」、
    英文主句「Made in China. Remembered by the world.」
  - **真 Logo 直接进站点**：主符号 SVG 从手册里原样取出（云 + 帆 + 水线，金色前帆），
    用于页眉标记与 favicon。手册纪律「不许改色 / 不许拆件」—— 代码里不做任何重绘。
    （注：v2.4.0 起该壳改名 `harbor` 并移除品牌，图形保留。）
- **README 变成壳的编译产物**：`shells/<id>.readme.md`（壳的定位）+ `shells/_shared.md`
  （仓库共用说明）由 `scripts/build-readme.mjs` 合成根 `README.md`。
  实测切壳会让 README 差 65 行 —— 这就是之前只换到一半的那一半。
- **营销素材包** `shells/<id>.marketing.md`：定位、电梯陈述、目标人群、价值主张、
  对比表、各渠道可直接粘贴的稿子、FAQ、口吻规则。`pnpm shell kit [id]` 打印。
- `pnpm shell`（原 `pnpm theme`）新增 `kit` 子命令；新增 `pnpm readme`。
- CI 新增 `pnpm readme --check`：手改 README 或改了壳没重跑，直接红。

### 变更

- `theme.txt` → `shell.txt`，`themes.mjs` → `shells.mjs`，`THEME` → `SHELL`，
  `pnpm theme` → `pnpm shell`，`data-theme` → `data-shell`。一次性改完，不留双名。
- 首页新增「为什么是这几条」区块，直接吃壳的 `copy.props` / `copy.pitch` / `copy.audience`。
- `tokens` 新增 `accent` / `accent-rgb`：给「只用于一个点」的强调色一个正式位置。
- 壳可指定 `fonts.mono`，Base 会注入 `--mono`。

### 修复

- **价值主张区块重复渲染**：props 原是字符串，靠切「：」分标题和正文，
  没有冒号的那条会把整句既当标题又当正文。改成 `{title, body}` 结构。
- **`{audience}` / `{tone_list}` / `{props_list}` 没被替换**：buildVars 只提供了
  README 用的键。已补齐并在生成后检查残留占位符。
- **`monoVar` 用到才定义** → 构建报 `Cannot access before initialization`。
- **引用块续行出现 `>>`**：tone_list 每行都加了前缀，模板还自带一个 `>`。
- **品牌壳次级文字 4.39:1，差 0.1 没过 WCAG AA**。手册定的灰蓝 `#6B7A8C` 在白底上
  就这水平。取同色相里能过线的最浅一档 `#69788A`（4.51:1），并在代码里注明偏差原因。
- **金色用量超标**：初版把 hero 高亮、四个统计数字、强调徽章都上了曦金。
  手册写「金色只用于要人一眼看到的那一个点」—— 统计数字是结构，改回靛海。

---

## v2.2.0 — 2026-10-14

**把「壳」变成配置项。** 起因是「龙虾不火了，要不要套个新壳再来一遍」——
这个问法本身暴露了问题：v1 把品牌写死在组件里（🦞 散在 `Base.astro`、`site.ts`、
`404`、README、分享卡模板五处），所以每换一次壳都要重做一遍。

现在的答案是：三个壳都留着，换壳改一行。

### 新增

- **主题系统** `apps/site/themes.mjs` + `apps/site/theme.txt`。一个主题提供
  25 个颜色/圆角变量、字体栈、logo 标记、副标题、tagline 模板、hero 文案。
- 三个内置壳：
  | id | 壳 | 形态 |
  |---|---|---|
  | `harness` | Harness 装配线 | 深色 + 冷绿 + 等宽标题 |
  | `atelier` | Atelier 高定 | **浅色** + 高定橙 + 宋体标题 + 直角 |
  | `lobster` | 龙虾工具包 | v1 原貌，留档对比 |
- **`pnpm theme`**：列出现有壳 / `set <id>` 切换 / `preview` 把每个壳的分享卡都渲出来对比。
- 分享卡、站点图标（favicon 改为按主题生成的 data URI）、`theme-color`、
  `og:image:alt` 全部跟着主题走。
- 主题定义纳入 `pnpm check`：少一个 token、id 对不上、scheme 写错，CI 直接红。
- 新增内容检查项：`assertThemesValid()` 与 catalog 检查一起跑。

### 变更

- **`global.css` 里 18 处写死的颜色全部收进变量**（`rgba(255,107,53,…)`、`#d8d8e4`、
  `#07070c`、`rgba(0,0,0,.55)`…）。不做这一步浅色壳立不起来：代码块和结果面板会留在深色上。
- 组件里不再出现任何品牌名或品牌色 —— 这是「换壳不用改代码」的前提。
- README 去掉 🦞 硬绑定，新增「换壳」一节。

### 修复

- **主题在 `src/lib/theme.ts` 里读 `process.env.THEME` 读不到**。
  那个模块走 Vite 的 SSR 转换，`process.env` 不是外层的（实测 `THEME=atelier` 时页面仍是默认壳）。
  改成在 `astro.config.mjs`（真正的 Node）里解析，再用 `vite.define` 注入成编译期常量。
  代价：改 `theme.txt` 要重启 dev server，`pnpm theme set` 会提示。
- 分享卡上那句话原来是从站点正文硬截的，会断在半句上（「或者在这里当场…」）。
  改成主题单独提供 `hero.ogLead`。
- Atelier 壳的中文标题没走衬线 —— 字体栈里 Georgia 排前面，中文回退成了黑体，字重 800 还是合成加粗。
  改成「中文优先（Songti SC 在前）+ 标题 500 字重」，正文保持无衬线（中文长段落用宋体太累）。

### 说明

- 视觉可以借鉴奢侈品的语言，但**产品名没有用真实奢侈品牌**。那个壳叫 `atelier`（通用词）。
  叫「爱马仕」是商标问题，不是审美问题。
- `platforms/openclaw/` 那份部署指南绑在 v1「小龙虾」概念上，换壳后与站点已无关系，是否保留自行决定。

### 验证

- 三个壳各自渲染 + 截图，并实测关键对比度（正文/代码块/结果面板/次要文字）：
  harness 16.6 / 13.19 / 11.25 / 7.19，atelier 16.55 / 13.58 / 10.62 / 7.1，
  lobster 16.2 / 13.47 / 12.26 / 6.62 —— 全部远超 WCAG AA（4.5:1）。
- 26 项浏览器回归在 harness 壳下全绿、零控制台错误。
- `pnpm catalog`（含主题与内容不变式）· `astro build` · `wrangler deploy --dry-run` 全通过。

---

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
