import type { APIRoute } from 'astro';
import { workflows, categories, stats, generatedAt } from '../lib/catalog';
import { SITE, siteBase } from '../lib/site';

// 同 [slug].json.ts：为了带上 CORS 头，走 Worker 而不是静态文件。
export const prerender = false;

/**
 * GET /workflows.json —— 全量清单（不含提示词正文，只有索引）。
 *
 * 想让自己的程序遍历所有工作流时先打这个，再去取单个的 .json / .raw.md。
 * 单文件版本：/llms-full.txt（给模型），.json（给程序）。
 */
export const GET: APIRoute = ({ site }) => {
  const base = siteBase({ site });
  const body = {
    schemaVersion: 1,
    generatedAt,
    site: base,
    repo: SITE.repo,
    license: 'MIT',
    howToUse: {
      list: `${base}/workflows.json`,
      single: `${base}/workflows/<slug>.json`,
      rawMarkdown: `${base}/workflows/<slug>.raw.md`,
      forLLMs: `${base}/llms-full.txt`,
    },
    stats,
    categories: categories.map((c) => ({ ...c, url: `${base}/categories/${c.id}/` })),
    workflows: workflows.map((w) => ({
      slug: w.slug,
      title: w.title,
      titleEn: w.titleEn || null,
      category: w.category,
      scene: w.scene || null,
      difficulty: w.difficulty,
      fields: w.fields.length,
      bilingual: Boolean(w.promptZh && w.promptEn),
      updatedAt: w.updatedAt || null,
      url: `${base}/workflows/${w.slug}/`,
      jsonUrl: `${base}/workflows/${w.slug}.json`,
      rawUrl: `${base}/workflows/${w.slug}.raw.md`,
      sourceFile: w.path,
    })),
  };

  return new Response(`${JSON.stringify(body, null, 2)}\n`, {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=3600',
    },
  });
};

export const OPTIONS: APIRoute = () =>
  new Response(null, {
    status: 204,
    headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, OPTIONS' },
  });
