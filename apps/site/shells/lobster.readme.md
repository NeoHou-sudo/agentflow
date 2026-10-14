# 🦞 AgentFlow

> {n_workflows} 个真跑过的 AI Agent 工作流，拿来即用，不用每次从零憋提示词。

站点跑在 Cloudflare Workers 上，免费档足够。

[部署文档](docs/DEPLOY.md) · [往哪走](docs/ROADMAP.md) · [换壳](#换壳)

---

## 它解决什么问题

做跨境电商的、管自己持仓的、写短剧的 —— 这些人每天都在用这些工作流。

不是理论，不是「10 个超好用的 ChatGPT 提示词」，是真跑过、真出过结果的。
而且每条都拆成了可以填的输入项：填完参数，提示词自动拼好，不用自己找哪里要改。

## 实际效果长什么样

**电商选品（3 分钟）**

> **你的输入**：芯片 J4125 / 屏幕 15.6寸 / 成本 ¥790 / 目标 Amazon.ca
>
> **AI Agent 跑完**：这配置建议卖 $220-250，毛利 18-22%。
> 中间价位玩家有 15 家，红海。但 $280+ 只有 3 家，还有空位。
> 建议先小批量测 30 台，别一口气压货。

**持仓诊断（2 分钟）**

> **你的输入**：科创板 0.6% / 黄金 ¥1,335 / 总资产 ¥128,000 / 目标 1 年 ¥90,000
>
> **AI Agent 跑完**：科创板建仓太慢，离目标差 ¥16,000。
> 立即做两件事：科创板日投从 25 元提到 60 元，标普 500 下周建仓。

## 适合谁

不想每次从零憋提示词的人。找一个贴近自己场景的，改改参数就能用。

不需要技术背景 —— 复制粘贴就行，唯一要做的就是填参数。

<!-- SPLIT: english -->

## English

**AgentFlow** is a collection of {n_workflows} AI agent workflows that were actually run in
production — e-commerce product research, portfolio review, short-video scripting,
clinical literature analysis, threat modeling.

Each workflow is a Markdown file with a complete prompt, a list of fill-in parameters,
the expected output format, and a real example. Fill in the parameters and the prompt is
assembled for you.

```bash
pnpm install && pnpm dev             # local
npx wrangler login && pnpm deploy    # Cloudflare Workers
```

See [docs/DEPLOY.md](docs/DEPLOY.md). MIT licensed.
