import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

/** 站点没改成自己域名时用的占位值。scripts/preflight.mjs 会拦住它不让部署。 */
export const DEFAULT_SITE_URL = 'https://agentflow.workers.dev';

/**
 * 站点根地址的唯一来源。canonical / sitemap / llms.txt / OG 全靠它。
 *
 * 解析顺序：
 *   1. 环境变量 SITE_URL（CI 里用）
 *   2. apps/site/site-url.txt（本地唯一要改的那一行）
 *   3. 占位值
 *
 * 以前这个值同时写在 astro.config 和 wrangler.jsonc 的 vars 里 ——
 * 改一处忘一处，canonical 就指向 workers.dev。现在只剩这一处。
 */
export function resolveSiteUrl() {
  const normalize = (v) => v.trim().replace(/\/+$/, '');

  if (process.env.SITE_URL) return normalize(process.env.SITE_URL);

  try {
    const fromFile = readFileSync(fileURLToPath(new URL('./site-url.txt', import.meta.url)), 'utf8');
    if (fromFile.trim()) return normalize(fromFile);
  } catch {
    /* 文件不存在就用占位值 */
  }
  return DEFAULT_SITE_URL;
}

export default defineConfig({
  site: resolveSiteUrl(),
  // 内容页全部预渲染成静态 HTML（内容只在发版时变），
  // 只有 /api/run 与几个机器可读端点走 Worker。
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
