import type { APIRoute } from 'astro';
import { bySlug } from '../../lib/catalog';
import { runtimeEnv } from '../../lib/site';

export const prerender = false;

/**
 * POST /api/feedback —— 每个工作流底部的「跑通了 / 没用」。
 *
 * 落 KV（绑了 FEEDBACK 就用它，否则退回 RATE_LIMIT 那个 namespace）。
 * 两个都没绑时不假装记录成功 —— 返回 stored:false，前端会照实说
 * 「这次没记上」，而不是弹一句骗人的「谢谢反馈」。
 *
 * 键：fb:<slug>:up / fb:<slug>:down（计数），fb:<slug>:last（最后时间）
 * 想看数据：npx wrangler kv key list --binding FEEDBACK --remote
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = runtimeEnv(locals) as Record<string, unknown>;
  const kv = (env.FEEDBACK ?? env.RATE_LIMIT) as
    | {
        get(k: string): Promise<string | null>;
        put(k: string, v: string, o?: { expirationTtl?: number }): Promise<void>;
      }
    | undefined;

  let body: { slug?: string; useful?: boolean };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const slug = String(body?.slug ?? '');
  const w = bySlug(slug);
  if (!w) return json({ ok: false, error: 'unknown_workflow' }, 404);
  if (typeof body?.useful !== 'boolean') return json({ ok: false, error: 'missing_useful' }, 400);

  if (!kv || typeof kv.get !== 'function') {
    return json({
      ok: true,
      stored: false,
      note: '这个部署没绑定 KV，反馈没落库。绑 FEEDBACK 或 RATE_LIMIT 之后就能记了。',
    });
  }

  const key = `fb:${slug}:${body.useful ? 'up' : 'down'}`;
  try {
    const current = Number((await kv.get(key)) ?? 0) || 0;
    await kv.put(key, String(current + 1));
    await kv.put(`fb:${slug}:last`, new Date().toISOString());
    return json({ ok: true, stored: true, count: current + 1, useful: body.useful });
  } catch (err) {
    return json({ ok: false, error: 'kv_failed', message: (err as Error).message }, 502);
  }
};

export const GET: APIRoute = () => json({ error: 'method_not_allowed' }, 405);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
