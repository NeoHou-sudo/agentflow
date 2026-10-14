# AgentFlow

> {n_workflows} 条真跑过的 AI Agent 工作流。**填参数 → 提示词自动拼好 → 复制走，或者当场跑一遍。**

把提示词库做成**基础设施** —— 不只是给人看的文档，也是能被程序调用的端点。

外壳是可换的（[换壳](#换壳)）：视觉、README、对外说法同一份配置，工作流本身不变。

站点跑在 Cloudflare Workers 上，免费档足够。

[部署文档](docs/DEPLOY.md) · [往哪走](docs/ROADMAP.md) · [换壳](#换壳)

---

## 它解决什么问题

网上到处都是「10 个超好用的 ChatGPT 提示词」，抄下来会发现两件事：

1. 提示词里的 `[占位符]` 得自己一个个找、一个个改；
2. 改完不知道别人用它是出了什么结果，更别说接进自己的系统。

这里反过来：**每条工作流都拆成了可填的输入项**，而且它同时为人用和给程序用。

```bash
# 给人用
打开站点 → 填参数 → 复制提示词，或者点「用 AI 跑一遍」

# 给程序用
curl -s https://你的域名/workflows/product-research.json | jq '.fields[].label'
```

## 实际效果长什么样

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

每条工作流都带**预期输出格式**，所以结果能直接进会议、进表格，也能直接进流水线。

## 适合谁

把 AI 接进自己系统的人 —— 要的是**可调用、可版本化**的东西，不是一堆还要手动改的提示词。

具体一点：

- 你在写一个内部工具，想让非技术同事也能跑这些分析，不想自己维护提示词副本 → 直接 `fetch` JSON 端点
- 你想把这些提示词版本化、diff、塞进 CI → `raw.md` 就是仓库里那个文件，可以直接比对
- 你只是想快点拿到结果 → 打开站点填参数，五分钟内出东西

<!-- SPLIT: english -->

## English

**AgentFlow** is a collection of {n_workflows} battle-tested AI agent workflows — product research,
portfolio review, content scripting, clinical literature analysis, threat modeling.

Each workflow is a Markdown file with a structured prompt, a list of **fill-in parameters**,
an expected output format, and a real-world example. The site turns those parameters into a form:
fill it in and the prompt is assembled for you. Copy it into any agent, or run it right there.

```bash
pnpm install && pnpm dev             # local
npx wrangler login && pnpm deploy    # Cloudflare Workers
```

For programmatic use, every workflow is also an endpoint (CORS enabled):

```bash
curl -s https://your-domain/workflows/product-research.json   # prompt + fields + output format
curl -s https://your-domain/workflows/product-research.raw.md # the raw markdown
curl -s https://your-domain/workflows.json                    # index of all workflows
```

See [docs/DEPLOY.md](docs/DEPLOY.md). MIT licensed.
