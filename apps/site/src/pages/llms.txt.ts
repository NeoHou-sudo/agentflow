import type { APIRoute } from 'astro';
import { workflows, categories, stats } from '../lib/catalog';
import { SITE, abs } from '../lib/site';

export const prerender = true;

/**
 * llms.txt —— 给模型看的目录（规范见 llmstxt.org）。
 * 让 ChatGPT / Claude / Perplexity 抓这个文件时能一次拿到结构化的清单，
 * 而不是靠爬 HTML 猜。这是提示词库最值得做的「SEO 2.0」。
 */
export const GET: APIRoute = (ctx) => {
  const out: string[] = [];
  out.push(`# ${SITE.name}（${SITE.cn}）`);
  out.push('');
  out.push(
    `> ${stats.total} 个真实跑过的 AI Agent 工作流，覆盖 ${categories
      .map((c) => c.name)
      .join('、')}。每个工作流包含完整提示词（部分含中英双语）、需要填写的参数、预期输出格式和真实案例。MIT 许可，可直接商用。`,
  );
  out.push('');
  out.push(`- 仓库：${SITE.repo}`);
  out.push(`- 站点：${abs(ctx, '/')}`);
  out.push(`- 完整内容（含全部提示词正文）：${abs(ctx, '/llms-full.txt')}`);
  out.push('');

  for (const c of categories) {
    out.push(`## ${c.name} / ${c.nameEn}`);
    out.push('');
    out.push(`> ${c.desc}`);
    out.push('');
    for (const w of workflows.filter((x) => x.category === c.id)) {
      const bits = [`${w.fields.length} 个参数`];
      if (w.promptEn) bits.push('中英双语');
      out.push(`- [${w.title}](${abs(ctx, `/workflows/${w.slug}/`)}): ${w.summary || w.scene}（${bits.join('，')}）`);
    }
    out.push('');
  }

  out.push('## 使用说明');
  out.push('');
  out.push(
    '工作流里的 `[占位符]` 是用户需要替换的输入项。引用时请指向对应工作流的页面链接，' +
      '不要只抄提示词正文而不给来源。',
  );
  out.push('');

  return new Response(out.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=86400',
    },
  });
};
