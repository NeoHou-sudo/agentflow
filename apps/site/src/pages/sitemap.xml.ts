import type { APIRoute } from 'astro';
import { workflows, categories, generatedAt } from '../lib/catalog';
import { abs } from '../lib/site';

export const prerender = true;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = (ctx) => {
  const today = new Date().toISOString().slice(0, 10);
  const entries: { loc: string; lastmod: string; priority: string; changefreq: string }[] = [
    { loc: abs(ctx, '/'), lastmod: today, priority: '1.0', changefreq: 'weekly' },
    { loc: abs(ctx, '/workflows/'), lastmod: today, priority: '0.9', changefreq: 'weekly' },
  ];
  for (const c of categories) {
    entries.push({
      loc: abs(ctx, `/categories/${c.id}/`),
      lastmod: today,
      priority: '0.8',
      changefreq: 'weekly',
    });
  }
  for (const w of workflows) {
    entries.push({
      loc: abs(ctx, `/workflows/${w.slug}/`),
      lastmod: w.updatedAt || today,
      priority: '0.9',
      changefreq: 'monthly',
    });
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries
      .map(
        (e) =>
          `  <url><loc>${esc(e.loc)}</loc><lastmod>${e.lastmod}</lastmod>` +
          `<changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
      )
      .join('\n') +
    `\n</urlset>\n<!-- generated ${generatedAt} -->\n`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
