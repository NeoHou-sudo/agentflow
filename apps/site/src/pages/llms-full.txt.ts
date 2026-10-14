import type { APIRoute } from 'astro';
import { workflows, categories, stats, generatedAt } from '../lib/catalog';
import { SITE, abs } from '../lib/site';

export const prerender = true;

/**
 * llms-full.txt —— 把所有工作流的提示词正文一次性吐出来。
 * 模型抓一个文件就拿到全部内容，不用逐个页面爬。
 */
export const GET: APIRoute = (ctx) => {
  const out: string[] = [];
  out.push(`# ${SITE.name}（${SITE.cn}）— 完整工作流库`);
  out.push('');
  out.push(
    `> ${stats.total} 个工作流 / ${stats.fields} 个可填参数 / ${categories.length} 个领域。` +
      `源文件在 ${SITE.repo} 的 workflows/ 目录，本文件由构建脚本自动生成，生成时间 ${generatedAt}。`,
  );
  out.push('');
  out.push('参数说明：提示词中的 `[xxx]` 与 `{{xxx}}` 是需要用户替换的输入项。');
  out.push('');
  out.push('---');
  out.push('');

  for (const c of categories) {
    out.push(`# ${c.name} / ${c.nameEn}`);
    out.push('');
    for (const w of workflows.filter((x) => x.category === c.id)) {
      out.push(`## ${w.title}${w.titleEn ? ` / ${w.titleEn}` : ''}`);
      out.push('');
      out.push(`页面：${abs(ctx, `/workflows/${w.slug}/`)}`);
      out.push(`适用场景：${w.scene || '—'}${w.source ? `　来源：${w.source}` : ''}`);
      if (w.fields.length) {
        out.push('');
        out.push('需要用户填写的参数：');
        for (const f of w.fields) {
          out.push(`- ${f.label}${f.options.length ? `（可选：${f.options.join(' / ')}）` : ''}`);
        }
      }
      if (w.promptZh) {
        out.push('');
        out.push('### 提示词（中文）');
        out.push('');
        out.push('```text');
        out.push(w.promptZh);
        out.push('```');
      }
      if (w.promptEn) {
        out.push('');
        out.push('### Prompt (English)');
        out.push('');
        out.push('```text');
        out.push(w.promptEn);
        out.push('```');
      }
      if (w.outputFormat) {
        out.push('');
        out.push('### 预期输出格式');
        out.push('');
        out.push('```markdown');
        out.push(w.outputFormat);
        out.push('```');
      }
      if (w.disclaimer) {
        out.push('');
        out.push(`> ⚠️ 免责声明：${w.disclaimer.replace(/\n+/g, ' ')}`);
      }
      out.push('');
      out.push('---');
      out.push('');
    }
  }

  return new Response(out.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=86400',
    },
  });
};
