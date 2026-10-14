# 🦞 AgentFlow

> 16 个真跑过的 AI Agent 工作流。**填参数 → 提示词自动拼好 → 复制走，或者当场跑一遍。**

站点跑在 Cloudflare Workers 上，免费档足够。

[English](#english) · [部署文档](docs/DEPLOY.md) · [往哪走](docs/ROADMAP.md)

---

## 它解决什么问题

网上到处都是「10 个超好用的 ChatGPT 提示词」，抄下来发现两件事：

1. 提示词里的 `[占位符]` 得自己一个个找、一个个改；
2. 改完了不知道别人用它是出了什么结果。

这里反过来：**每个工作流都拆成了可填的输入项**。打开页面就是一张表单，
填完参数，提示词自动拼好，一键复制；想直接看结果，点「用 AI 跑一遍」。

```
选品调研 → 填「芯片平台 / 屏幕 / 成本」→ 提示词拼好 → 复制 或 直接跑
```

### 实际效果长什么样

**电商选品调研**（填 8 个参数，约 3 分钟）

> **你填**：CPU N100 / 15.6" IPS / 成本 ¥800 / 目标 Amazon US
>
> **Agent 出**：$280–350 价格带有空缺，只有 3 个主要卖家。建议售价 $299–329，毛利 22–26%。
> 风险：美国站要 FCC、欧盟要 CE。建议先测 20 台。

**持仓诊断**（填 7 个参数，约 2 分钟）

> **你填**：网店 ¥50,000 + 成长型基金 ¥30,000 / 总资产 ¥120,000 / 年目标 ¥100,000
>
> **Agent 出**：网店占 41%，过度集中。30 天内调到股债 60/40。成长型基金日投从 ¥25 提到 ¥60，
> 补齐年度目标的缺口。

每个工作流都带**预期输出格式**，所以结果能直接进会议、进表格，不用再收拾一遍。

## 现在有什么

| 分类 | 数量 | 例子 |
|---|---|---|
| 🛒 电商运营 | 3 | 选品调研、竞品分析、Listing 优化 |
| 📈 投资分析 | 3 | 持仓诊断、市场分析、资产配置 |
| 🎬 内容创作 | 6 | 分镜脚本、批量文案、人设设计、爆款选题 |
| 🩺 医学研究 | 2 | 临床证据分析、鉴别诊断 |
| 🛡️ 安全审计 | 2 | 威胁建模、漏洞报告分析 |

每个工作流都有：完整提示词（**16/16 中英双语**）· 参数表单 · **预期输出格式** · **真实案例**。

## 怎么用

**方式一：在网站上用（推荐）**

打开站点 → 挑一个工作流 → 填参数 → 复制提示词，或点「用 AI 跑一遍」。

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

每个工作流都是一个 md 文件，结构固定（见下）。任何 Agent 框架都能直接解析。
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
platforms/          ← Coze / Dify / OpenClaw 的部署指南
apps/site/          ← Astro 5 + Cloudflare Workers 站点
  src/pages/        ← 首页 / 列表 / 详情 / 分类，构建时预渲染成静态 HTML
  src/pages/api/run.ts   ← 唯一走 Worker 的路由：站内试跑
scripts/build-catalog.mjs ← 把 workflows/*.md 编译成结构化数据，并校验内容
docs/               ← 部署 runbook、路线图
legacy/             ← 旧的静态 launcher 页，留档用
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
| `pnpm catalog` | 把 md 编译成数据 **+ 跑内容不变式检查**（有问题直接报错） |
| `pnpm build` | 构建 Cloudflare 产物 |
| `pnpm deploy` | 部署前检查 → 构建 → 推送 |
| `pnpm og` | 重新生成分享卡 `og.png`（改了内容数字后跑） |

## 部署

```bash
npx wrangler login
pnpm deploy
```

完整步骤（自定义域名、Workers AI、限流、GitHub Actions 自动部署）见 **[docs/DEPLOY.md](docs/DEPLOY.md)**。

## 想贡献一个工作流？

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

## 技术栈

Astro 5（SSR，内容页预渲染）· Cloudflare Workers + 静态资源 · Workers AI（站内试跑，零配置）
· 无数据库 · 无后台 · MIT

---

<a id="english"></a>
## English

**AgentFlow** is a collection of 16 battle-tested AI agent workflows — e-commerce product research,
portfolio review, content scripting, clinical literature analysis, threat modeling.

Each workflow is a Markdown file with a structured prompt, a list of **fill-in parameters**,
an expected output format, and a real-world example. The site turns those parameters into a form:
fill it in and the prompt is assembled for you. Copy it into any agent, or run it right there.

```bash
pnpm install && pnpm dev        # local
npx wrangler login && pnpm deploy   # Cloudflare Workers
```

See [docs/DEPLOY.md](docs/DEPLOY.md). MIT licensed.

---

⭐ [github.com/NeoHou-sudo/agentflow](https://github.com/NeoHou-sudo/agentflow)

[![Stars](https://img.shields.io/github/stars/NeoHou-sudo/agentflow?style=social)](https://github.com/NeoHou-sudo/agentflow/stargazers)
[![Forks](https://img.shields.io/github/forks/NeoHou-sudo/agentflow?style=social)](https://github.com/NeoHou-sudo/agentflow/network/members)
