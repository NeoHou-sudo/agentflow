# 部署到 Cloudflare Workers

全站跑在 **一个 Worker + 静态资源 + Workers AI** 上，免费档足够。没有数据库、没有后台，
内容全部来自 `workflows/**/*.md`，构建时编译进静态 HTML。

---

## 0. 环境

- Node ≥ 20
- pnpm ≥ 10（`corepack enable`）
- Cloudflare 账号（**只有部署那一步才需要**，本地开发全离线）

---

## 1. 本地跑起来

```bash
pnpm install

# 从 workflows/*.md 生成目录数据（apps/site/src/data/workflows.json）
pnpm catalog

# 前台 http://localhost:4321
pnpm dev
```

开发时 `pnpm dev` 会自动先跑一次 `pnpm catalog`，所以改完 md 直接刷新页面就能看到。

`/api/run` 在本地是「演示模式」：没有 AI 绑定，不会真的调模型，但会返回一段说明文本，
前端不会报错。想在本地真跑，见下面第 4 节。

---

## 2. 一键部署

```bash
npx wrangler login          # 浏览器授权，只需要一次
pnpm deploy
```

**部署前先做一件事**：把正式地址写进 `apps/site/site-url.txt`（一行，就这一个文件）。

```
https://你的域名
```

这个值决定 canonical / sitemap / llms.txt / OG 卡片指向哪里，写错了搜索引擎会认错站。
`pnpm deploy` 的第一步就是检查它 —— 还是占位值会直接拦住你并说清楚怎么改，
不会让你把错 canonical 发上线。`pnpm build` 不检查（本地随便构建）。

顺带一提：`apps/site/wrangler.jsonc` 里**没有** SITE_URL，这是故意的。
它是构建期的事，放在运行时的 vars 里只会让人以为改了有用。

`wrangler.jsonc` 里需要改的只有 `name`（Worker 名，决定默认域名）。

---

## 3. Workers AI（站内试跑）

`apps/site/wrangler.jsonc` 里已经有这一段，**不需要任何 key**：

```jsonc
"ai": { "binding": "AI" }
```

部署后 `/api/run` 就能直接调模型，用免费额度。想换模型：

```bash
cd apps/site
npx wrangler secret put MODEL     # 例如 @cf/meta/llama-3.3-70b-instruct-fp8-fast
```

不想要这个功能？把 `"ai"` 那一段删掉即可，页面上的试跑按钮会退化成一段说明文字，
「复制提示词」照常可用。

> 中文场景如果嫌 8B 模型不够用，把 `MODEL` 换成 Qwen 系列或 70B 的效果会明显更好，
> 代价是免费额度的消耗速度。

### 换用自己的 API key（可选，质量更好）

```bash
cd apps/site
npx wrangler secret put LLM_BASE_URL   # 例如 https://api.deepseek.com/v1
npx wrangler secret put LLM_API_KEY
```

两个都设了之后，`/api/run` 会优先走你自己的端点（OpenAI 兼容即可），
Workers AI 只作为兜底。

---

## 4. 加 KV（可选，公网建议开）

```bash
npx wrangler kv namespace create RATE_LIMIT
```

把输出的 id 填进 `apps/site/wrangler.jsonc`（文件里有一段注释掉的例子，照着填）：

```jsonc
"kv_namespaces": [
  { "binding": "RATE_LIMIT", "id": "<粘进来的 id>" }
],
```

绑上之后同时开两个功能：

| 功能 | 说明 |
|---|---|
| 接口限流 | `/api/run` 按 IP 每小时限次（默认 30，用 `RUN_RATE_LIMIT_PER_HOUR` 调） |
| 工作流反馈 | 详情页的「跑通了 / 没用」按钮落库 |

**不绑也能跑**，只是两项都没有。特别说明：反馈接口没绑 KV 时会返回
`stored: false`，页面显示「这次没记上」—— 不会假装记录成功。

想看反馈数据：

```bash
npx wrangler kv key list --binding RATE_LIMIT --remote | grep fb:
npx wrangler kv key get --binding RATE_LIMIT --remote "fb:product-research:up"
```

---

## 5. 绑自己的域名

CF Dashboard → Workers & Pages → 选中 `agentflow` → Settings → Domains & Routes → Add custom domain。

绑完把 `SITE_URL` 改成正式域名，`pnpm deploy` 重发一次（canonical 和 sitemap 才会对）。

---

## 6. 自动部署（GitHub Actions）

`.github/workflows/deploy-cloudflare.yml` 已经在仓库里，push 到 `main` 就自动部署。
需要在仓库 Settings → Secrets 里加两条：

| Secret | 从哪来 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | CF Dashboard → My Profile → API Tokens → 用「Edit Cloudflare Workers」模板 |
| `CLOUDFLARE_ACCOUNT_ID` | CF Dashboard 右侧 Workers 概览页可以复制 |

没配这两个 secret 的话，这个 workflow 会跳过部署，但 CI（构建 + 类型检查）照常跑。

---

## 7. 上线后该做的三件事

1. **Google Search Console** 提交 `https://你的域名/sitemap.xml` —— 这一步没有自动化，得手动做一次。
2. 确认 `https://你的域名/llms.txt` 能打开 —— 这是给 AI 爬虫的索引，比 sitemap 更能带来「被引用」。
3. 用 [Facebook 分享调试器](https://developers.facebook.com/tools/debug/) 和
   [Twitter Card 验证器](https://cards-dev.twitter.com/validator) 各刷一次首页，
   确认 `og.png` 被正确抓到（换了域名或改了图之后都要重刷缓存）。

---

## 8. 机器可读端点

除了给人看的页面，站上还有几条给程序用的：

| 端点 | 内容 | 注 |
|---|---|---|
| `/workflows.json` | 全量索引（不含提示词正文） | 带 CORS |
| `/workflows/<slug>.json` | 单个工作流：提示词 + 参数 + 输出格式 | 带 CORS，`schemaVersion: 1` |
| `/workflows/<slug>.raw.md` | 仓库里的原始 markdown | 方便 `curl` 到本地 diff |
| `/llms.txt` / `/llms-full.txt` | 给模型的目录 / 全文 | 静态文件 |

前三条是**故意走 Worker 的（没预渲染）**：预渲染成静态文件会丢掉
`access-control-allow-origin`，跨域 `fetch` 就废了 —— 而能被别的程序取走正是它们存在的意义。

---

## 9. 加一个工作流

```bash
# 1. 新建 workflows/<分类>/<slug>.md，按 CONTRIBUTING.md 的格式
# 2. 本地校验（解析 + 不变式）
pnpm catalog
# 3. 看渲染效果
pnpm dev
# 4. 提交
```

`pnpm catalog` 会跑两道检查：

- `build-catalog.mjs` —— 能不能解析出提示词、代码块有没有闭合（不通过直接 exit 1）
- `check-catalog.mjs` —— 更细的静默缺陷：某个字段只有中文占位符没有英文的、
  中英占位符数量对不上（按索引配对会整体错位）、参数全填完提示词里还留着方括号

**改了工作流内容之后记得重跑一次 `pnpm og`**，否则分享卡上的数字（几个工作流 / 几个双语）会停在旧值。

---

## 常见问题

**改了 md 但线上没变？**
内容在构建时就编译进 HTML 了，改完要重新 `pnpm deploy`（或 push 触发 Action）。

**`pnpm deploy` 报「站点地址还是占位值」？**
去改 `apps/site/site-url.txt`。这是故意的 —— 带着错 canonical 上线比部署失败更麻烦。

**`/api/run` 报 `ai_failed`？**
大概率是 Workers AI 免费额度用完了，或者 `MODEL` 写了个不存在的模型 id。
去 CF Dashboard → Workers AI 看配额。

**点了反馈但提示「这次没记上」？**
没绑 KV。见第 4 节。

**页面是 404 但文件明明构建出来了？**
检查 `wrangler.jsonc` 的 `assets.directory` 是不是 `dist`，以及 `main` 是不是
`dist/_worker.js/index.js`。这两个是配套的，改一个必须改另一个。

**静态资源优先命中，那 `/api/run` 怎么办？**
没命中静态文件的请求才会进 Worker —— 这也是为什么整站几乎不消耗
Worker 请求数，只有试跑和机器可读端点那几下才算。
