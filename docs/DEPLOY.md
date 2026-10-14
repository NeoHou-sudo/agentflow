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
pnpm deploy                 # = pnpm build && wrangler deploy
```

第一次 `deploy` 会问你是否创建 Worker，回车确认。跑完会打印一个
`https://agentflow.<你的子域>.workers.dev` 地址，直接就能访问。

**部署前建议改两处名字**（都在 `apps/site/wrangler.jsonc`）：

| 字段 | 说明 |
|---|---|
| `name` | Worker 名，决定默认域名 |
| `vars.SITE_URL` | 站点正式地址。influences canonical / sitemap / llms.txt |

`SITE_URL` 同时还要在构建期生效，所以用：

```bash
SITE_URL=https://你的域名 pnpm deploy
```

（或者在 `apps/site/astro.config.mjs` 里把那行默认值改掉。）

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

## 4. 加一道限流（可选，但公网建议开）

```bash
npx wrangler kv namespace create RATE_LIMIT
```

把输出的 id 填进 `apps/site/wrangler.jsonc`：

```jsonc
"kv_namespaces": [{ "binding": "RATE_LIMIT", "id": "<粘进来的 id>" }]
```

不配也能跑，只是没有每 IP 每小时限次（默认配了就限 30 次/小时，
可用 `RUN_RATE_LIMIT_PER_HOUR` 调整）。

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
3. Cloudflare Dashboard 开 Web Analytics（免费、无 Cookie）。

---

## 常见问题

**改了 md 但线上没变？**
内容在构建时就编译进 HTML 了，改完要重新 `pnpm deploy`（或 push 触发 Action）。

**`/api/run` 报 `ai_failed`？**
大概率是 Workers AI 免费额度用完了，或者 `MODEL` 写了个不存在的模型 id。
去 CF Dashboard → Workers AI 看配额。

**页面是 404 但文件明明构建出来了？**
检查 `wrangler.jsonc` 的 `assets.directory` 是不是 `dist`，以及 `main` 是不是
`dist/_worker.js/index.js`。这两个是配套的，改一个必须改另一个。

**文件完全不下发到 Worker，那 `/api/run` 怎么办？**
静态资源优先命中，没命中静态文件的请求才会进 Worker —— 这也是为什么整站几乎不消耗
Worker 请求数，只有试跑那一下才算。
