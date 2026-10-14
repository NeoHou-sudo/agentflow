import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// 站点根地址：canonical / sitemap / llms.txt / OG 全靠它。
// 部署到 Cloudflare 后把自己的域名填这里（或构建时传环境变量 SITE_URL）。
const site = process.env.SITE_URL ?? 'https://agentflow.workers.dev';

export default defineConfig({
  site,
  // 内容页全部预渲染成静态 HTML（内容只在发版时变），
  // 只有 /api/run 走 Worker —— 静态资源在 CF 上不计费，页面也就没有冷启动。
  output: 'server',
  adapter: cloudflare({
    // 本地开发默认不拉起 wrangler 平台代理（那会要求先 wrangler login）。
    // 没了它，/api/run 走「演示模式」，页面照常可用。
    // 想在本地连真实的 D1/KV/AI 绑定：CF_PLATFORM_PROXY=1 pnpm dev
    platformProxy: { enabled: process.env.CF_PLATFORM_PROXY === '1' },
  }),
  build: {
    // 目录式 URL：/workflows/product-research/ 而不是 .html
    format: 'directory',
  },
  devToolbar: { enabled: false },
  vite: {
    build: { cssMinify: true },
  },
});
