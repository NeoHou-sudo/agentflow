# Harness 壳 · 营销素材包

> `pnpm shell kit harness` 打印这一份。数字与口吻规则从 `apps/site/shells.mjs` 读，
> 改壳配置这里会跟着变。
>
> **口吻**：动词开头、短句；能用数字就不用形容词；不说「赋能」「闭环」「一站式」；
> 不承诺效果，只说做过什么、结果长什么样。

---

## 一句话

把提示词库做成基础设施：填参数、拿 JSON、接进你的流水线。

## 电梯陈述（30 秒）

AgentFlow 是 {n_workflows} 条真跑过的 AI Agent 工作流。跟提示词合集的区别是它同时是给程序的：
每条工作流都有独立的 JSON 端点和 raw markdown 端点，带 CORS，参数是结构化的 ——
连中英两种占位符写法都给出来了，够你直接写一个表单生成器。

内容源就是仓库里的 `workflows/**.md`，加一条工作流等于加一个文件。

## 目标人群

把 AI 接进自己系统的人。

- 写内部工具，想让非技术同事也能跑这些分析，又不想维护提示词副本
- 想把这些提示词版本化、diff、塞进 CI
- 只是要快点拿到结果，不想读一堆文档

## 价值主张

1. **提示词从「文档」变成「可调用端点」** —— `/workflows/<slug>.json` 带 CORS，
   `raw.md` 可以 diff。你的程序不用爬 HTML。
2. **参数是结构化的** —— 连中英两种占位符写法都给出来，能直接写表单生成器。
3. **每条都有预期输出格式** —— 结果能进流水线，不用再收拾一遍。
4. **内容只有一个来源** —— `workflows/**.md`。加一条工作流 = 加一个文件，不碰代码。

## 与别的方案的差别

| | AgentFlow | 提示词合集 | SaaS 工作流平台 |
|---|---|---|---|
| 拿到的东西 | 提示词 + 参数结构 + 输出格式 | 一段文本 | 托管运行 |
| 程序可取 | 是（JSON / raw.md，带 CORS） | 否，得爬 | 要 API key 和账号 |
| 版本化 | 就是 git 仓库 | 复制粘贴 | 平台内 |
| 成本 | 自部署免费档 / 复制走免费 | 免费 | 按调用量 |
| 骗不了人的地方 | 只有 {n_workflows} 条 | 通常几百条，没跑过 | 要迁移 |

---

## 渠道稿

### Product Hunt / Hacker News（英文）

> **{n_workflows} AI agent workflows that are also API endpoints**
>
> Every "prompt library" I've used has the same problem: you copy a prompt, then spend
> five minutes hunting for the `[placeholders]` and replacing them. And you can't call it
> from anything.
>
> AgentFlow keeps the prompts in Markdown (one file per workflow, in `workflows/`), but
> builds two things out of them: a site where the placeholders become a fill-in form,
> and JSON / raw-markdown endpoints so your code can just fetch them. CORS enabled.
>
> Each workflow also declares its **expected output format**, so the result is a table you
> can hand over, not raw text you still have to clean up.
>
> Self-host on Cloudflare's free tier with one command. MIT.

### X / Twitter thread（英文）

> 1/ Prompt libraries are weird: great content, terrible ergonomics.
> You copy a prompt, then hunt for `[placeholders]` by hand. And you can't `fetch` it.
>
> 2/ I turned {n_workflows} workflows I actually use into something callable.
> The Markdown file is still the source of truth. Everything else is generated.
>
> 3/ `curl -s /workflows/product-research.json | jq '.fields[].label'`
> → structured params, including both the Chinese and English placeholder forms.
> Enough to generate a form from.
>
> 4/ `curl -s /workflows/product-research.raw.md`
> → the exact file in the repo. Diffable, versionable, copyable.
>
> 5/ Every workflow ships an expected output format. The result is a table,
> not a wall of text. That's the part people actually underestimate.
>
> 6/ Self-host: `npx wrangler login && pnpm deploy`. Free tier is enough.
> {repo}

### 小红书 / 即刻（中文口语）

> 攒了一批 AI 工作流，本来只是自己用，后来发现个问题：
> 网上那些「提示词合集」抄下来，第一件事是找方括号一个个改。
>
> 所以我把它们改成了能填的：打开页面就是一张表单，填完提示词自己就拼好了。
>
> 更关键的是 —— 我把它做成了能被程序调用的。每条工作流都有个 JSON 地址，
> 你的工具可以直接取，不用爬网页。
>
> 一共 {n_workflows} 条，都是我自己真跑过的。开源，可以自己部署。

### 冷启动邮件 / DM 开场

> 你好 —— 我在做 AgentFlow，{n_workflows} 条真跑过的 AI 工作流，每条都有 JSON 端点，
> 程序可以直接调。看你在做 {他们的方向}，不确定你用不用得上，链接在下面，不用回我。

---

## FAQ

**Q：跟「Awesome ChatGPT Prompts」那种仓库有什么区别？**
A：那个是给人读的列表。这里是可调用的：参数是结构化的，有 JSON 和 raw.md 端点，
内容由一个编译脚本从 md 生成，所以站点和仓库不会脱节。

**Q：为什么要自己部署？**
A：可以不部署 —— 提示词就是文本，复制走就行。要端点才需要部署，免费档够用，
一条命令。

**Q：只有 {n_workflows} 条，是不是太少了？**
A：是。这几条是真跑过的，我不想往里掺没验证过的。宁可少。

**Q：能商用吗？**
A：MIT，可以。

---

## 不要说的话

- ❌ 「赋能」「闭环」「一站式」「全链路」
- ❌ 「效率提升 10 倍」这类没依据的数字
- ❌ 「AI 驱动的智能工作流平台」（这不是平台）
- ❌ 承诺结果。只说做过什么、产出长什么样
- ❌ 跟大厂产品对标的表述 —— 这个项目没有那个体量，说了只会掉分
