# AgentFlow

> {n_workflows} 条真跑过的 AI Agent 工作流。**值得被认真对待的提示词。**

每一条都是真跑过、真出过结果的。填参数，拿到拼好的提示词，或者就在这里跑一遍看结果。
不堆功能，够用为止。

站点跑在 Cloudflare Workers 上，免费档足够。

[部署文档](docs/DEPLOY.md) · [往哪走](docs/ROADMAP.md) · [换壳](#换壳)

---

## 它解决什么问题

提示词这个东西，大部分时候长这样：一段话，里面挖了几个空，谁都能改，改完不知道对不对。

拿去做正经事就会发现问题 —— 它不可复现，也不可交付。

这里换了个做法：**每条工作流都拆成了可填的输入项，并且规定了输出长什么样**。
填完参数，你拿到的是一份能直接交出去的东西，而不是一段还要自己整理的原料。

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

在意产出质量和形式的人。

- 你不想研究提示词工程，只想要一份能直接用、能交出去的东西
- 你要把结果发给别人看，所以格式和口径比「有没有 AI 感」重要得多
- 你受够了一共几百条、每条都得试的提示词合集

一共 {n_workflows} 条。不是 {n_workflows}00 条。

<!-- SPLIT: english -->

## English

**AgentFlow** is a small, curated set of {n_workflows} AI agent workflows — the ones that were
actually used, with the outputs they actually produced.

Each one ships with a fill-in form, a defined **expected output format**, and a real example.
Fill in the parameters and you get something you can hand over — not raw material you still
have to clean up.

```bash
pnpm install && pnpm dev             # local
npx wrangler login && pnpm deploy    # Cloudflare Workers
```

Want the prompt on its own? Every workflow has a JSON endpoint and a raw markdown one:

```bash
curl -s https://your-domain/workflows/product-research.raw.md
```

See [docs/DEPLOY.md](docs/DEPLOY.md). MIT licensed.
