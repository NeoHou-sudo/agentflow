import type { APIRoute } from 'astro';
import { bySlug, generatedAt } from '../../lib/catalog';
import { SITE, siteBase } from '../../lib/site';

// SSR 而不是预渲染：预渲染成静态文件会丢掉 access-control-allow-origin，
// 跨域 fetch 就废了 —— 而这个端点的全部意义就是被别的程序取走。
export const prerender = false;

/**
 * GET /workflows/<slug>.json —— 机器可读的单个工作流。
 *
 * 有了它，别人不用爬 HTML：一行 fetch 就能把提示词、参数、输出格式接进自己的 Agent。
 * 开放 CORS，因为「能被别的程序取走」正是这个端点的全部意义。
 */
const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'cache-control': 'public, max-age=3600',
};

export const GET: APIRoute = ({ params, site }) => {
  const w = bySlug(params.slug ?? '');
  if (!w) {
    return new Response(JSON.stringify({ error: 'not_found', slug: params.slug }, null, 2), {
      status: 404,
      headers: { 'content-type': 'application/json; charset=utf-8', ...CORS },
    });
  }

  const base = siteBase({ site });
  const body = {
    // 约定：字段只增不改。要改结构就抬 schemaVersion。
    schemaVersion: 1,
    generatedAt,
    slug: w.slug,
    url: `${base}/workflows/${w.slug}/`,
    rawUrl: `${base}/workflows/${w.slug}.raw.md`,
    jsonUrl: `${base}/workflows/${w.slug}.json`,
    category: w.category,
    categoryName: w.categoryName,
    title: w.title,
    titleEn: w.titleEn || null,
    scene: w.scene || null,
    source: w.source || null,
    difficulty: w.difficulty,
    version: w.version,
    updatedAt: w.updatedAt || null,
    license: 'MIT',
    fields: w.fields.map((f) => ({
      key: `f${f.i}`,
      label: f.label,
      hint: f.hint || null,
      options: f.options.length ? f.options : null,
      tokens: { zh: f.zhTokens, en: f.enTokens },
    })),
    prompts: {
      zh: w.promptZh || null,
      en: w.promptEn || null,
    },
    outputFormat: w.outputFormat || null,
    disclaimer: w.disclaimer || null,
    sourceFile: w.path,
    repo: `${SITE.repo}/blob/main/${w.path}`,
  };

  return new Response(`${JSON.stringify(body, null, 2)}\n`, {
    headers: { 'content-type': 'application/json; charset=utf-8', ...CORS },
  });
};

export const OPTIONS: APIRoute = () => new Response(null, { status: 204, headers: CORS });
