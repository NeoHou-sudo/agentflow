import type { APIRoute } from 'astro';
import { bySlug } from '../../lib/catalog';
import { runtimeEnv } from '../../lib/site';

export const prerender = false;

/**
 * POST /api/run — 把页面上填好的提示词真的跑一遍。
 *
 * 三种后端，按可用性依次退化（都不需要改前端）：
 *   1. LLM_BASE_URL + LLM_API_KEY（wrangler secret）→ 你自己的 OpenAI 兼容端点
 *   2. AI 绑定（wrangler.jsonc 里的 `ai`）→ Cloudflare Workers AI，免费额度，零配置
 *   3. 都没有 → 返回一段「演示模式」文本，页面不至于报错一片红
 *
 * 输出统一成 SSE：data: {"response":"..."}
 * 限流：绑了 RATE_LIMIT（KV）就按 IP 每小时限次；没绑就跳过。
 */

const SYSTEM_PROMPT =
  '你是 AgentFlow 的工作流执行器。用户会给你一段已经填好参数的专业提示词，' +
  '请严格按提示词里的要求执行，并且遵守它指定的输出格式（通常是 markdown 表格 + 结论先行）。' +
  '不要输出与任务无关的寒暄、不要复述提示词本身、不要解释你是怎么做的。中文提问用中文回答。';

const SSE_HEADERS = {
  'content-type': 'text/event-stream; charset=utf-8',
  'cache-control': 'no-cache, no-transform',
  connection: 'keep-alive',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

function sseFromText(text: string): Response {
  const body = `data: ${JSON.stringify({ response: text })}\n\ndata: [DONE]\n\n`;
  return new Response(body, { headers: SSE_HEADERS });
}

/** 把上游 OpenAI 兼容的 SSE 归一化成 {response} */
function normalizeOpenAIStream(src: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buf = '';
  return new ReadableStream({
    async start(controller) {
      const reader = src.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const raw = line.slice(5).trim();
          if (!raw || raw === '[DONE]') continue;
          try {
            const j = JSON.parse(raw);
            const delta = j?.choices?.[0]?.delta?.content ?? j?.choices?.[0]?.text;
            if (delta) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ response: delta })}\n\n`));
          } catch {
            /* 忽略解析不了的行 */
          }
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = runtimeEnv(locals) as Record<string, unknown>;
  const maxChars = Number(env.RUN_MAX_PROMPT_CHARS ?? 12000) || 12000;

  let body: { slug?: string; prompt?: string; lang?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json', message: '请求体不是合法 JSON' }, 400);
  }

  const prompt = String(body?.prompt ?? '').trim();
  if (!prompt) return json({ error: 'empty_prompt', message: '提示词是空的，先把参数填上' }, 400);
  if (body?.slug && !bySlug(String(body.slug))) {
    return json({ error: 'unknown_workflow', message: '不认识这个工作流' }, 404);
  }
  if (prompt.length > maxChars) {
    return json(
      { error: 'prompt_too_long', message: `提示词 ${prompt.length} 字符，超过上限 ${maxChars}` },
      413,
    );
  }

  // ---- 限流（仅当部署者绑了 KV） ----
  const kv = env.RATE_LIMIT as { get(k: string): Promise<string | null>; put(k: string, v: string, o?: { expirationTtl?: number }): Promise<void> } | undefined;
  if (kv && typeof kv.get === 'function') {
    const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
    const bucket = `rl:${ip}:${Math.floor(Date.now() / 3_600_000)}`;
    try {
      const used = Number((await kv.get(bucket)) ?? 0) || 0;
      const limit = Number(env.RUN_RATE_LIMIT_PER_HOUR ?? 30) || 30;
      if (used >= limit) {
        return json({ error: 'rate_limited', message: `每小时最多 ${limit} 次，歇一会儿再来` }, 429);
      }
      await kv.put(bucket, String(used + 1), { expirationTtl: 3600 });
    } catch {
      /* KV 出问题不该阻断主流程 */
    }
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ];

  // ---- 1) 自建 OpenAI 兼容端点 ----
  const baseUrl = typeof env.LLM_BASE_URL === 'string' ? env.LLM_BASE_URL.replace(/\/+$/, '') : '';
  const apiKey = typeof env.LLM_API_KEY === 'string' ? env.LLM_API_KEY : '';
  if (baseUrl && apiKey) {
    try {
      const up = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: env.MODEL ?? 'deepseek-chat',
          messages,
          stream: true,
          temperature: 0.6,
        }),
      });
      if (!up.ok || !up.body) {
        const detail = (await up.text().catch(() => '')).slice(0, 300);
        return json(
          { error: 'upstream_error', message: `上游返回 ${up.status}：${detail || '无内容'}` },
          502,
        );
      }
      return new Response(normalizeOpenAIStream(up.body), { headers: SSE_HEADERS });
    } catch (err) {
      return json({ error: 'fetch_failed', message: `连不上上游：${(err as Error).message}` }, 502);
    }
  }

  // ---- 2) Workers AI ----
  const ai = env.AI as { run(model: string, opts: unknown): Promise<unknown> } | undefined;
  if (ai && typeof ai.run === 'function') {
    const model = typeof env.MODEL === 'string' && env.MODEL ? env.MODEL : '@cf/meta/llama-3.1-8b-instruct';
    try {
      const stream = (await ai.run(model, { messages, stream: true })) as ReadableStream<Uint8Array>;
      if (stream && typeof (stream as ReadableStream).getReader === 'function') {
        return new Response(stream, { headers: SSE_HEADERS });
      }
      // 没给流（有些模型不支持）→ 当整段文本处理
      const raw = stream as unknown as { response?: string };
      return sseFromText(raw?.response ?? String(stream));
    } catch (err) {
      return json(
        {
          error: 'ai_failed',
          message: `Workers AI 调用失败：${(err as Error).message}。免费额度可能用完了，或被模型名写错。`,
        },
        502,
      );
    }
  }

  // ---- 3) 本地 / 未绑定 AI ----
  return sseFromText(
    [
      '【演示模式】这个部署没有配置 AI 绑定，所以不会真的调用模型。',
      '',
      '在 Cloudflare 上启用只需两步：',
      '1. apps/site/wrangler.jsonc 里保留 "ai": { "binding": "AI" }',
      '2. wrangler deploy 之后，Worker 就带上了 Workers AI 的免费额度',
      '',
      '本地 astro dev 想真跑，可以用 wrangler dev，或配上自己的端点：',
      '  wrangler secret put LLM_BASE_URL',
      '  wrangler secret put LLM_API_KEY',
      '',
      '现在先看效果的话，点右上角「复制提示词」，粘到任意 Agent 里即可。',
    ].join('\n'),
  );
};

export const GET: APIRoute = () =>
  json({ error: 'method_not_allowed', message: '请用 POST 调用 /api/run' }, 405);
