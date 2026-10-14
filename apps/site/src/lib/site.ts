import type { APIContext } from 'astro';
import { stats } from './catalog';
import { currentTheme, taglineWith } from './theme';

/** 当前主题。整站外观与文案口吻都由它决定，见 apps/site/themes.mjs。 */
export const THEME = currentTheme();

export const SITE = {
  name: THEME.name,
  cn: THEME.subtitle,
  // 数字从 catalog 算出来，tagline 口吻从主题来 —— 都不硬编码。
  tagline: taglineWith(THEME, stats.total),
  repo: 'https://github.com/NeoHou-sudo/agentflow',
};

/** 当前请求的站点根地址（canonical / sitemap / OG 都用它） */
export function siteBase(ctx?: { site?: URL | string; url?: URL }): string {
  const fromAstro = ctx?.site ? String(ctx.site) : '';
  return (fromAstro || 'https://agentflow.workers.dev').replace(/\/+$/, '');
}

export function abs(ctx: { site?: URL | string; url?: URL }, path: string): string {
  return `${siteBase(ctx)}${path.startsWith('/') ? path : `/${path}`}`;
}

/** 读 Worker 运行时环境变量（astro dev 下可能没有 runtime） */
export function runtimeEnv(locals: unknown): Record<string, string> {
  const l = locals as { runtime?: { env?: Record<string, string> } } | undefined;
  return l?.runtime?.env ?? {};
}

export const DIFFICULTY_LABEL = ['', '复制即用', '入门', '进阶', '专业', '专家'];

export function stars(n: number): string {
  return '★'.repeat(Math.max(1, Math.min(5, n)));
}

export type { APIContext };
