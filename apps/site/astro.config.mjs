import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { SHELLS, DEFAULT_SHELL } from './shells.mjs';

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

/**
 * 壳在这里解析，然后通过 vite.define 注入成编译期常量。
 *
 * 为什么不在 src/lib/shell.ts 里读 process.env：那个模块走 Vite 的 SSR 转换，
 * 里面的 process.env 读不到外层环境变量（实测 SHELL=atelier 时页面仍是默认壳）。
 * astro.config.mjs 跑在真正的 Node 里，所以在这里读，结果当常量发下去。
 *
 * 代价：改 shell.txt 要重启 dev server。astro.config 变了 Astro 自己会重启，
 * shell.txt 不会 —— 所以 `pnpm shell set` 会提示你重启。
 */
function resolveShellId() {
  const fromEnv = process.env.SHELL?.trim();
  if (fromEnv && SHELLS[fromEnv]) return fromEnv;
  const file = fileURLToPath(new URL('./shell.txt', import.meta.url));
  if (existsSync(file)) {
    const v = readFileSync(file, 'utf8').trim();
    if (v && !SHELLS[v]) {
      throw new Error(`apps/site/shell.txt 里的壳「${v}」不存在。可选：${Object.keys(SHELLS).join(' / ')}`);
    }
    if (v) return v;
  }
  return DEFAULT_SHELL;
}

const shellId = resolveShellId();

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
    define: {
      __AF_SHELL__: JSON.stringify(shellId),
    },
  },
});
