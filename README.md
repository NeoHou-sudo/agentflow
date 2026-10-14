<!--
  这个文件由 `pnpm readme` 从 apps/site/shells/ 合成 —— 直接改这里，下次生成会被覆盖。

  改壳的定位 / 口吻 / 实际效果 → apps/site/shells/<壳>.readme.md
  改仓库说明（怎么用 / 结构 / 部署 / 贡献） → apps/site/shells/_shared.md
  换壳 → pnpm shell set <id>
-->
# AgentFlow

> 16 条真跑过的 AI Agent 工作流。**填参数 → 提示词自动拼好 → 复制走，或者当场跑一遍。**

每一条都是自己先跑通，才放上来的。不堆术语，把复杂的事讲清楚。

站点跑在 Cloudflare Workers 上，免费档足够。

[部署文档](docs/DEPLOY.md) · [往哪走](docs/ROADMAP.md) · [换壳](#换壳)

---

## 它解决什么问题

提示词这个东西，大部分时候长这样：一段话，里面挖了几个空，谁都能改，改完不知道对不对。

拿去做正经事就会发现问题 —— 它不可复现，也不可交付。

这里换了个做法：**每条工作流都拆成了可填的输入项，并且规定了输出长什么样。**
填完参数，拿到的是一份能直接交出去的东西，而不是一段还要自己整理的原料。

```bash
# 给人用
打开站点 → 填参数 → 复制提示词，或者点「用 AI 跑一遍」

# 给程序用
curl -s https://你的域名/workflows/product-research.json | jq '.fields[].label'
```

## 实际效果长什么样

**电商选品调研**（填 8 个参数）

> **你填**：CPU N100 / 15.6" IPS / 成本 ¥800 / 目标 Amazon US
>
> **拿到**：$280–350 价格带有空缺，只有 3 个主要卖家。建议售价 $299–329，毛利 22–26%。
> 风险：美国站要 FCC、欧盟要 CE。建议先测 20 台。

**持仓诊断**（填 7 个参数）

> **你填**：网店 ¥50,000 + 成长型基金 ¥30,000 / 总资产 ¥120,000 / 年目标 ¥100,000
>
> **拿到**：网店占 41%，过度集中。30 天内调到股债 60/40。成长型基金日投从 ¥25 提到 ¥60。

每条都带**预期输出格式**和**真实案例**，所以它的产出是表格、是结论，
可以直接放进文档、周报、会议材料里。

## 适合谁

不想每次从零憋提示词的人 —— 以及要把 AI 接进自己系统的人。

<!--
  仓库共用部分。所有壳共用这一份 —— 因为「仓库结构」「怎么部署」「怎么贡献」
  跟对外说法无关，跟着壳变只会让维护变成三倍。
  壳相关的那半在 shells/<id>.readme.md，由 scripts/build-readme.mjs 合成根 README.md。
-->

## 现在有什么

| 分类 | 数量 | 例子 |
|---|---|---|
| 📈 投资分析 | 3 | 资产配置策略、市场分析、持仓诊断 |
| 🩺 医学研究 | 2 | 临床研究分析、鉴别诊断辅助 |
| 🛡️ 安全审计 | 2 | 威胁建模、漏洞扫描报告分析 |
| 🎬 内容创作 | 6 | 分镜脚本生成、角色人设设计、内容趋势分析 等 |
| 🛒 电商运营 | 3 | 竞品分析、电商选品调研、Listing 优化 |

每条工作流都有：完整提示词（**16/16 中英双语**）· 参数表单 · **预期输出格式** · **真实案例**。

## 怎么用

**方式一：在网站上用（推荐）**

打开站点 → 挑一条工作流 → 填参数 → 复制提示词，或点「用 AI 跑一遍」。

**方式二：把提示词放进自己的 Agent**

复制走，粘到 ChatGPT / Claude / DeepSeek / Kimi / 通义 / Coze / Dify 都可以 —— 纯文本，平台无关。
想批量用，直接读源文件：

```
workflows/
├── ecommerce/product-research.md
├── content/short-video-script.md
└── ...
```

**方式三：接进自己的系统**

每条工作流都是一个 md 文件，结构固定（见下）。任何 Agent 框架都能直接解析。
站点还提供三个可以直接 `fetch` 的端点（都带 CORS）：

| 端点 | 拿到什么 |
|---|---|
| `/workflows/<slug>.json` | 提示词 + 参数 + 输出格式（`schemaVersion: 1`） |
| `/workflows/<slug>.raw.md` | 仓库里的原始 markdown |
| `/workflows.json` | 全量索引 |

```bash
curl -s https://你的域名/workflows/product-research.json | jq .prompts.zh
```

给模型的索引另有 `/llms.txt`（目录）和 `/llms-full.txt`（全部提示词正文）。

## 仓库结构

```
workflows/          ← 唯一内容源。加工作流 = 加一个 md 文件，不碰任何代码
apps/site/          ← Astro 5 + Cloudflare Workers 站点
  shells.mjs        ← 壳注册表：视觉 + 站点文案 + 口吻（唯一真源）
  shells/           ← 每个壳的 README 与营销素材
  src/pages/        ← 首页 / 列表 / 详情 / 分类，构建时预渲染成静态 HTML
  src/pages/api/    ← 走 Worker 的路由：站内试跑、反馈、机器可读端点
scripts/            ← 内容编译与校验、分享卡、README 合成、换壳工具
docs/               ← 部署 runbook、路线图
legacy/             ← v1 的静态 launcher 页，留档用
```

## 本地跑

```bash
pnpm install
pnpm dev      # http://localhost:4321
```

改 `workflows/*.md`，刷新页面就能看到变化 —— 页面是构建时从 md 生成的。

| 命令 | 作用 |
|---|---|
| `pnpm dev` | 本地开发（自动先跑一次内容编译） |
| `pnpm catalog` | 把 md 编译成数据 **+ 跑内容与壳的不变式检查**（有问题直接报错） |
| `pnpm build` | 构建 Cloudflare 产物 |
| `pnpm deploy` | 部署前检查 → 构建 → 推送 |
| `pnpm shell` | 列 / 切换 / 预览壳，打印营销素材包 |
| `pnpm readme` | 按当前壳重新合成 README.md |
| `pnpm og` | 重新生成分享卡 `og.png`（按当前壳） |

## 部署

```bash
npx wrangler login
pnpm deploy
```

完整步骤（自定义域名、Workers AI、限流、GitHub Actions 自动部署）见 **[docs/DEPLOY.md](docs/DEPLOY.md)**。

## 想贡献一条工作流？

规则只有两条：**你自己真跑过**，**有真实案例**。

文件放 `workflows/<分类>/<slug>.md`，按这个结构写：

````markdown
# 🎯 中文名 / English Name

> **适用场景**: 什么时候用它
> **来源**: 从哪来的（真实场景）
> **难度**: ⭐⭐⭐

---

## 📝 Exact Prompt / 完整提示词

### 中文版

```
（提示词正文，需要用户改的地方写成 [占位符]）
```

### English Version

```
（可选，英文版）
```

---

## 📊 Expected Output Format / 预期输出格式

```markdown
（你希望模型输出的格式，结论先行 + 表格）
```

---

## ✅ Real Example / 真实案例

> **输入**: ...
> **结果**: ...
````

提交后构建脚本会自动：

- 抽出标题 / 场景 / 难度 / 来源
- 从提示词里识别 `[占位符]` 和 `{{变量}}`，生成参数表单
- 生成独立 URL、sitemap、结构化数据、`llms.txt` 条目

**两个容易踩的坑**：

1. 提示词代码块里如果还要嵌套代码块，外层请用四个反引号包起来，否则块会断、构建会直接报错退出。
2. 提示词末尾别写「输出格式」示例 —— 那半段的 `[占位符]` 会被当成用户输入项。
   放到独立的 `## 📊 Expected Output Format` 小节里，脚本会自动切掉。

详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 换壳

一个「壳」不只是配色，是**一整套对外说法**：

| 层 | 在哪 | 换壳时会跟着变 |
|---|---|---|
| 视觉 | `shells.mjs` 的 `tokens` / `fonts` | 颜色、圆角、字体、站点图标、分享卡 |
| 站点文案 | `shells.mjs` 的 `name/tagline/hero/copy` | 标题、hero、meta description、副标题 |
| README | `shells/<id>.readme.md` + `shells/_shared.md` | 根 README.md 由 `pnpm readme` 重新合成 |
| 营销素材 | `shells/<id>.marketing.md` | 定位、价值主张、渠道稿、FAQ、口吻规则 |

都从这里读，改一处即可：

```bash
pnpm shell                  # 列出所有壳
pnpm shell set atelier      # 切过去（改 apps/site/shell.txt）
pnpm shell preview          # 每个壳的分享卡各渲一张对比
pnpm shell kit              # 打印当前壳的营销素材包（可直接粘贴）
pnpm readme                 # 重新合成 README.md
pnpm og                     # 重新生成分享卡
```

现有壳：

| id | 壳 | 明暗 | 一句话 |
|---|---|---|---|
| `harbor` | Harbor 港口 | 浅色 | 把提示词做成能交出去的东西。 ← 当前 |
| `harness` | Harness 装配线 | 深色 | 把提示词库做成基础设施：填参数、拿 JSON、接进你的流水线。 |
| `atelier` | Atelier 高定 | 浅色 | 把提示词做成可交付的东西。 |
| `lobster` | 龙虾工具包（v1 原貌） | 深色 | 拿来即用，不用每次从零憋提示词。 |

缺任何一个 token 或 copy 字段，`pnpm catalog` 会直接报错 ——
不让它静默退回默认值（不然某个壳会变成「配色换了一半、文案还是旧的」）。

### 视觉来源（harbor 壳）

`harbor` 的配色与排版规范参考了一份内部品牌视觉手册 —— 70/20/10 用色比例
（70% 月白留白、20% 靛海结构与文字、10% 曦金只给一个点）、字体分工
（中文标题宋体 / 正文黑体 / 英文 Inter / 数字与代码 JetBrains Mono）、
字距与行高纪律，都照它来。

**但这个壳不携带那个品牌**：没有公司名、没有 Slogan、没有商标声明。
视觉照抄，品牌不沾 —— 想改先读那份手册，手册管不到、但 CSS 必须表态的地方才动
`global.css` 里 `[data-shell="harbor"]` 那一段。

## 技术栈

Astro 5（SSR，内容页预渲染）· Cloudflare Workers + 静态资源 · Workers AI（站内试跑，零配置）
· 无数据库 · 无后台 · MIT

---

⭐ [github.com/NeoHou-sudo/agentflow](https://github.com/NeoHou-sudo/agentflow)

[![Stars](https://img.shields.io/github/stars/NeoHou-sudo/agentflow?style=social)](https://github.com/NeoHou-sudo/agentflow/stargazers)
[![Forks](https://img.shields.io/github/forks/NeoHou-sudo/agentflow?style=social)](https://github.com/NeoHou-sudo/agentflow/network/members)

## English

**AgentFlow** is a collection of 16 AI agent workflows that were actually used,
with the outputs they actually produced.

Each one ships with a fill-in form, a defined **expected output format**, and a real example.
Fill in the parameters and you get something you can hand over — not raw material you still
have to clean up.

```bash
pnpm install && pnpm dev             # local
npx wrangler login && pnpm deploy    # Cloudflare Workers
```

For programmatic use, every workflow is also an endpoint (CORS enabled):

```bash
curl -s https://your-domain/workflows/product-research.json   # prompt + fields + output format
curl -s https://your-domain/workflows/product-research.raw.md # the raw markdown
```

See [docs/DEPLOY.md](docs/DEPLOY.md). MIT licensed.
