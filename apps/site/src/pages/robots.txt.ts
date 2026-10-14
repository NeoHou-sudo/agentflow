import type { APIRoute } from 'astro';
import { abs } from '../lib/site';

export const prerender = true;

// 这个站的命运就是被人（和 AI）抄去用，所以主流抓取器全部放行，
// 只挡纯采集用途、从不回流的几个。
const ALLOW_UA = [
  '*',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
];
const DENY_UA = ['Bytespider', 'PetalBot', 'SemrushBot', 'AhrefsBot'];

export const GET: APIRoute = (ctx) => {
  const out: string[] = ['# AgentFlow — 提示词工作流库，欢迎索引与引用', ''];
  for (const ua of ALLOW_UA) {
    out.push(`User-agent: ${ua}`, 'Allow: /', '');
  }
  out.push('# 纯采集用途，不回流的挡掉');
  for (const ua of DENY_UA) {
    out.push(`User-agent: ${ua}`, 'Disallow: /', '');
  }
  out.push(`Sitemap: ${abs(ctx, '/sitemap.xml')}`);
  out.push(`# 给模型的索引：${abs(ctx, '/llms.txt')} / ${abs(ctx, '/llms-full.txt')}`);
  out.push('');

  return new Response(out.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=86400',
    },
  });
};
