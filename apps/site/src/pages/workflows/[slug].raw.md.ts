import type { APIRoute } from 'astro';
import { workflows, bySlug } from '../../lib/catalog';

// 同 [slug].json.ts：为了带上 CORS 头，走 Worker 而不是静态文件。
export const prerender = false;

/**
 * GET /workflows/<slug>.raw.md —— 原始 markdown。
 *
 * 就是仓库里 `workflows/**\/<slug>.md` 的原文（不含 H1 之外的任何改写），
 * 方便别人 `curl` 到本地直接塞进自己的 Agent 或做 diff 追踪。
 */
const HEADERS = {
  'content-type': 'text/markdown; charset=utf-8',
  'access-control-allow-origin': '*',
  'cache-control': 'public, max-age=3600',
};

export const GET: APIRoute = ({ params }) => {
  const w = bySlug(params.slug ?? '');
  if (!w) {
    return new Response(`# 404\n\n没有这个工作流：${params.slug}\n`, {
      status: 404,
      headers: HEADERS,
    });
  }
  return new Response(w.raw, { headers: HEADERS });
};
