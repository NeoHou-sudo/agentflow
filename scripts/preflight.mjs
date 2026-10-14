#!/usr/bin/env node
/**
 * 部署前检查。`pnpm deploy` 的第一步，拦住「静默发错配置」这一类事故。
 *
 * 目前查两件事：
 *   1. SITE_URL 还是不是占位值 —— 是的话 canonical / sitemap / OG 全指向
 *      agentflow.workers.dev，站点权重白送，而且自己不会发现。
 *   2. wrangler.jsonc 与 site-url.txt 是否都在（后者是唯一来源，删了就退回占位值）。
 *
 * 故意做成 hard fail：宁可不部署，也不要带着错 canonical 上线。
 */
import { readFile, access } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL_FILE = path.join(ROOT, 'apps/site/site-url.txt');
const WRANGLER = path.join(ROOT, 'apps/site/wrangler.jsonc');
const DEFAULT_SITE_URL = 'https://agentflow.workers.dev';

const problems = [];

/** 本地读文件，逻辑与 astro.config.mjs 的 resolveSiteUrl 保持一致 */
async function resolveSiteUrl() {
  if (process.env.SITE_URL) return { url: process.env.SITE_URL.trim(), from: '环境变量 SITE_URL' };
  if (existsSync(SITE_URL_FILE)) {
    const v = (await readFile(SITE_URL_FILE, 'utf8')).trim();
    if (v) return { url: v, from: 'apps/site/site-url.txt' };
  }
  return { url: DEFAULT_SITE_URL, from: '内置占位值' };
}

const { url, from } = await resolveSiteUrl();
const normalized = url.replace(/\/+$/, '');

if (normalized === DEFAULT_SITE_URL) {
  problems.push(
    `站点地址还是占位值 ${DEFAULT_SITE_URL}（来自：${from}）。\n` +
      '    先绑好域名，再把正式地址写进 apps/site/site-url.txt。\n' +
      '    这个值决定 canonical / sitemap / llms.txt / OG，错了搜索引擎会认错站。',
  );
}

try {
  const parsed = new URL(normalized);
  if (parsed.protocol !== 'https:') {
    problems.push(`站点地址不是 https：${normalized}（Cloudflare 上应该用 https）。`);
  }
  if (parsed.pathname !== '/' || parsed.search || parsed.hash) {
    problems.push(`站点地址应该是纯域名，不带路径或参数：${normalized}`);
  }
} catch {
  problems.push(`站点地址不是合法 URL：${normalized}`);
}

if (!existsSync(WRANGLER)) problems.push('找不到 apps/site/wrangler.jsonc。');

if (problems.length) {
  console.error('✖ 部署前检查没通过：\n');
  for (const p of problems) console.error(`  · ${p}`);
  console.error(
    '\n  只是想看看构建产物？用 `pnpm build`（不检查）。\n' +
      '  确实要带占位值部署（比如先跑一次试用）：SITE_URL=https://x.example pnpm deploy\n',
  );
  process.exit(1);
}

console.log(`✔ 部署前检查通过：站点地址 ${normalized}（来自：${from}）`);
