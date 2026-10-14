# AgentFlow

> {n_workflows} 条真跑过的 AI Agent 工作流。**填参数 → 提示词自动拼好 → 复制走，或者当场跑一遍。**

浅处起云，忆通四海。这一版按《浅忆云_品牌视觉手册_V1》做 —— 靛海、曦金、月白，
宋体标题、黑体正文。不制造概念，不堆术语，把复杂的事做到浅白可用。

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

{audience}

我们先把这套东西在自己公司跑通了，才拿出来的。

<!-- SPLIT: english -->

## English

**AgentFlow** is a collection of {n_workflows} AI agent workflows that were actually used,
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
