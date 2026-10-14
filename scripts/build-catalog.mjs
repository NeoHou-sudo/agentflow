#!/usr/bin/env node
/**
 * AgentFlow catalog builder
 * ------------------------------------------------------------------
 * 唯一意图源 = 仓库根 `workflows/**\/*.md`（人手写的原始提示词文件，保持原样）。
 * 本脚本把它们解析成结构化 JSON，供 apps/site 渲染。
 *
 * 产物：apps/site/src/data/workflows.json  （构建期生成，gitignore）
 *
 * 设计原则：
 *  - 内容与页面同源：改 md 即改站，不需要动任何 HTML/组件。
 *  - 解析失败不静默：任何工作流缺提示词都会在 stderr 报警并以 exit 1 中断构建，
 *    避免「页面看着有内容、点进去是空的」这种只有人眼才能发现的问题。
 *  - 零依赖：不引入 markdown 解析库，自己按 fence 状态机切块。
 */
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORKFLOWS_DIR = path.join(ROOT, 'workflows');
const OUT_FILE = path.join(ROOT, 'apps', 'site', 'src', 'data', 'workflows.json');

/** 分类元数据：目录名 → 展示信息。新增目录必须在此登记，否则构建报错。 */
const CATEGORIES = {
  ecommerce: {
    id: 'ecommerce',
    name: '电商运营',
    nameEn: 'E-commerce',
    icon: '🛒',
    accent: '#ff6b35',
    desc: '选品、竞品、Listing —— 跑在真实 Amazon 站点上的运营动作',
  },
  investment: {
    id: 'investment',
    name: '投资分析',
    nameEn: 'Investment',
    icon: '📈',
    accent: '#4ade80',
    desc: '持仓诊断、市场分析、资产配置 —— 结论先行，直接给动作',
  },
  content: {
    id: 'content',
    name: '内容创作',
    nameEn: 'Content',
    icon: '🎬',
    accent: '#a78bfa',
    desc: '选题、脚本、人设 —— 一次投入批量产出，1 人顶一个团队',
  },
  medicine: {
    id: 'medicine',
    name: '医学研究',
    nameEn: 'Medicine',
    icon: '🩺',
    accent: '#60a5fa',
    desc: '临床决策、鉴别诊断 —— 仅供专业人员参考，不构成诊疗建议',
  },
  security: {
    id: 'security',
    name: '安全审计',
    nameEn: 'Security',
    icon: '🛡️',
    accent: '#22d3ee',
    desc: '威胁建模、漏洞报告分析 —— 把扫描结果变成修复优先级',
  },
};

/* ------------------------------- 解析 ------------------------------- */

const CJK = /[\u4e00-\u9fff\u3400-\u4dbf]/;

/** 已经被详情页单独渲染过的章节，不再进「其余章节」 */
const CONSUMED_SECTIONS =
  /提示词|Prompt|输出格式|Expected Output|Output Format|免责声明|Disclaimer|工作流描述|Workflow Description|何时使用|When to Use|适用场景|一句话/;

function cjkRatio(text) {
  const body = text.replace(/\s/g, '');
  if (!body) return 0;
  let cjk = 0;
  for (const ch of body) if (CJK.test(ch)) cjk += 1;
  return cjk / body.length;
}

/**
 * 单遍状态机解析：必须在 fence 内部忽略 `## ` 标题。
 * 实测 `workflows/content/short-video-script.md` 的提示词正文里就带 `## 我的主题`
 * 这类二级标题，按行朴素切分会把提示词切碎。
 */
function parseMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const sections = [];
  const preamble = { title: '', lines: [] };
  let current = null;
  let inFence = false;
  let fenceLen = 3;
  let fenceLang = '';
  let fenceBuf = [];

  const pushSection = () => {
    flushText();
    if (current) sections.push(current);
  };
  const flushText = () => {
    if (current && current.buf.length) {
      current.parts.push({ text: current.buf.join('\n') });
      current.buf = [];
    }
  };
  const newSection = (title) => ({ title, lines: [], fences: [], parts: [], buf: [] });

  for (const line of lines) {
    if (inFence) {
      // 支持任意长度围栏：外层用更长的一串反引号包裹内层的 ``` 示例
      const closer = line.match(/^(`{3,})\s*$/);
      if (closer && closer[1].length >= fenceLen) {
        inFence = false;
        flushText();
        current.fences.push({ lang: fenceLang, body: fenceBuf.join('\n').trim() });
        current.parts.push({ code: fenceBuf.join('\n').trim() });
        fenceBuf = [];
      } else {
        fenceBuf.push(line);
      }
      continue;
    }
    const fenceOpen = line.match(/^(`{3,})([A-Za-z0-9_+.-]*)/);
    if (fenceOpen) {
      if (!current) current = newSection('');
      flushText();
      inFence = true;
      fenceLen = fenceOpen[1].length;
      fenceLang = (fenceOpen[2] || '').toLowerCase();
      fenceBuf = [];
      continue;
    }
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      const title = h2[1];
      if (!current) current = newSection('');
      pushSection();
      current = newSection(title);
      continue;
    }
    const h1 = line.match(/^#\s+(.+?)\s*$/);
    if (h1 && !preamble.title) {
      preamble.title = h1[1];
      continue;
    }
    if (!current) current = newSection('');
    current.lines.push(line);
    current.buf.push(line);
  }
  flushText();
  pushSection();
  if (inFence) throw new Error('unterminated code fence');

  return { preamble, sections };
}

/** 从一段带 `> **键**: 值` 的元信息里取值 */
function metaValue(text, keys) {
  for (const line of text.split('\n')) {
    const m = line.match(/^>\s*\*\*(.+?)\*\*\s*[:：]\s*(.+?)\s*$/);
    if (!m) continue;
    const key = m[1].replace(/\s+/g, '');
    if (keys.some((k) => key.includes(k))) return m[2];
  }
  return '';
}

/**
 * 少数工作流的占位符语义靠机器猜不准（比如「资产梳理」那三行模板），
 * 在这里显式登记，宁可手写六行，也不让页面上出现看不懂的输入框。
 */
const FIELD_OVERRIDES = {
  'security/threat-modeling': {
    deny: ['资产2', '资产3'],
    relabel: { 资产1: '关键资产（名称）', 描述: '关键资产（描述）', '高/中/低': '机密性需求' },
  },
  'investment/asset-allocation': {
    relabel: { 类别A: '资产类别 A', 类别B: '资产类别 B', 列出希望达到的比例: '目标配置比例' },
  },
  'ecommerce/product-research': {
    relabel: { 搜索: '搜索关键词（如 J4125 laptop）', 基于成本: '采购成本（元/台）' },
  },
  'ecommerce/listing-optimize': {
    relabel: { 产品特点: '产品特点（列 3 个）', 粘贴现有标题: '现有 Listing（如有）' },
  },
  'security/vulnerability-scan': {
    relabel: { 如有之前扫描的漏洞: '已修复项（如有）' },
  },
};

/** 字段名里带方括号的一定是误抓（占位符串成了一行） */
function cleanLabel(raw) {
  if (/[[\]]/.test(raw)) return '';
  let s = raw;
  const stop = Math.max(
    s.lastIndexOf('。'),
    s.lastIndexOf('！'),
    s.lastIndexOf('？'),
    s.lastIndexOf('；'),
    s.lastIndexOf('\n'),
  );
  if (stop >= 0) s = s.slice(stop + 1);
  const open = Math.max(s.lastIndexOf('（'), s.lastIndexOf('('));
  if (open >= 0 && !/[）)]/.test(s.slice(open))) s = s.slice(0, open);
  s = s
    .replace(/\*\*/g, '')
    .replace(/^\s*[>#\-*+]\s*/, '')
    .replace(/^\s*\d+[.、)]\s*/, '')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/[^\p{L}\p{N}%]+$/u, '')
    .trim();
  const open2 = Math.max(s.lastIndexOf('（'), s.lastIndexOf('('));
  if (open2 >= 0 && !/[）)]/.test(s.slice(open2))) s = s.slice(0, open2).trim();
  if (s.length < 2 || s.length > 26) return '';
  if (/^(请|帮我|需要|你是一位|我需要)/.test(s)) return '';
  return s;
}

/** 占位符本身很长时，取前面那截当字段名：`你的视频主题，例如：…` → 「视频主题」 */
function shortLabel(token) {
  let t = token.split(/[，,；;、（(/|]/)[0].trim().replace(/^(你的|您的|我的)/, '');
  if (!t) t = token;
  return t.length > 20 ? `${t.slice(0, 20)}…` : t;
}

/**
 * 提示词末尾常跟一段「要输出什么」的规格（`## 输出格式`、`### 1. 开场钩子`…），
 * 那半段的 [] 是示例占位，不是用户要填的输入项。
 * 实测 16 个工作流里，真正的输入项全部出现在第一个三级标题之前 —— 在这两处切一刀。
 */
const OUTPUT_HEADING = /^#{2,4}\s*(输出格式|预期输出格式|输出示例|输出模板|Expected Output|Output Format)/i;

function splitOutputSpec(prompt) {
  const lines = prompt.split('\n');
  let cut = lines.findIndex((l) => OUTPUT_HEADING.test(l));
  const h3 = lines.findIndex((l) => /^###\s/.test(l));
  if (h3 >= 0 && (cut < 0 || h3 < cut)) cut = h3;
  if (cut <= 3) return { inputPart: prompt, tail: '' };
  return {
    inputPart: lines.slice(0, cut).join('\n').trim(),
    tail: lines.slice(cut).join('\n').trim(),
  };
}

/** 揪出用户真需要填的输入项 */
function extractFields(prompt) {
  if (!prompt) return { tokens: [], tail: '' };
  const { inputPart, tail } = splitOutputSpec(prompt);
  const cutTokens = extractTokens(inputPart);
  const allTokens = extractTokens(prompt);
  // 切了之后一个都不剩，说明这个工作流的输入项本来就在后半段 —— 那就别切
  const useCut = cutTokens.length > 0 && cutTokens.length < allTokens.length;
  return { tokens: useCut ? cutTokens : allTokens, tail };
}

/**
 * 抽出 [占位符] 与 {{变量}}，按出现顺序去重。
 * 同一个占位符可能出现多次（比如正文/示例里各一次），取第一个能当字段名的前缀。
 */
function extractTokens(text) {
  const order = [];
  const byToken = new Map();
  for (const line of text.split('\n')) {
    const re = /\[([^[\]\n]{1,60})\]|\{\{([^}\n]{1,40})\}\}/g;
    let m;
    while ((m = re.exec(line)) !== null) {
      const bracket = m[1] !== undefined;
      const token = (bracket ? m[1] : m[2]).trim();
      if (!token) continue;
      if (bracket && line[m.index + m[0].length] === '(') continue; // markdown 链接
      if (bracket && line[m.index - 1] === '!') continue; // 图片
      if (bracket && /^[\s\-x*]$/i.test(token)) continue; // 任务列表复选框
      const label = bracket ? cleanLabel(line.slice(0, m.index)) : '';
      const rec = byToken.get(token);
      if (!rec) {
        byToken.set(token, { token, braces: !bracket, labels: [label] });
        order.push(token);
      } else if (label) {
        rec.labels.push(label);
      }
    }
  }
  return order.map((t) => {
    const rec = byToken.get(t);
    return { token: rec.token, braces: rec.braces, label: rec.labels.find(Boolean) || '' };
  });
}

/** 把 [A / B / C] 这种写法拆成可选值；猜不准的一律不猜，宁可不给下拉 */
function toOptions(token) {
  if (!/[\/|]/.test(token) || token.length > 40) return [];
  if (/[（(]/.test(token)) return [];
  const parts = token
    .split(/\s*[\/|]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length < 2 || parts.length > 8) return [];
  const cjk = (s) => (s.match(/[\u4e00-\u9fff]/g) || []).length;
  if (parts.some((p) => p.length > 12 || cjk(p) > 5)) return [];
  return parts;
}

function difficultyFrom(text) {
  const stars = text.match(/⭐+/);
  if (stars) return Math.min(stars[0].length, 5);
  const n = text.match(/Difficulty\s*[:：]\s*(\d)/i);
  return n ? Number(n[1]) : 2;
}

function pickPrompt(sections, lang) {
  // 优先「提示词 / Prompt」小节；退化到全文任意非 markdown fence
  const wanted = sections.filter((s) => /提示词|Prompt/i.test(s.title));
  const pool = wanted.length ? wanted : sections;
  const candidates = [];
  for (const s of pool) {
    for (const f of s.fences) {
      if (f.lang === 'markdown' || f.lang === 'json' || f.lang === 'bash' || f.lang === 'sh') continue;
      if (f.body.length < 80) continue;
      candidates.push(f.body);
    }
  }
  if (!candidates.length) return '';
  if (lang === 'zh') {
    return candidates.find((c) => cjkRatio(c) > 0.15) || '';
  }
  return candidates.find((c) => c.length > 120 && cjkRatio(c) < 0.05) || '';
}

function pickOutputFormat(sections) {
  // 首选：专门的「输出格式」小节里的第一个代码块
  const wanted = sections.filter((s) => /输出格式|Expected Output|Output Format/i.test(s.title));
  for (const s of wanted) {
    const f = s.fences.find((x) => x.lang === 'markdown') || s.fences[0];
    if (f) return f.body;
  }
  // 退化：全文任意 ```markdown 块
  for (const s of sections) {
    const f = s.fences.find((x) => x.lang === 'markdown');
    if (f) return f.body;
  }
  return '';
}

function sectionsToText(sections) {
  return sections.map((s) => s.lines.join('\n')).join('\n');
}

/* --------------------------- 极简 markdown 渲染 ---------------------------
 * 只服务于「详情页的其余章节」（定制建议 / 真实案例 / 公式库…）。
 * 不引第三方库：渲染范围可控，坏掉的输入最多是段落没分段，不会出安全问题。
 * 所有输入都先转义 HTML，再按行做行内替换。
 * ---------------------------------------------------------------------- */

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ESC[c]);

function inline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function renderMarkdown(md) {
  const out = [];
  const lines = md.split('\n');
  let i = 0;
  let listOpen = null; // 'ul' | 'ol'
  const closeList = () => {
    if (listOpen) {
      out.push(`</${listOpen}>`);
      listOpen = null;
    }
  };
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) {
      closeList();
      i += 1;
      continue;
    }
    if (/^```/.test(line)) {
      closeList();
      const buf = [];
      i += 1;
      while (i < lines.length && !/^`{3,}\s*$/.test(lines[i])) buf.push(lines[i++]);
      i += 1;
      out.push(`<pre><code>${escapeHtml(buf.join('\n'))}</code></pre>`);
      continue;
    }
    if (/^---+\s*$/.test(line)) {
      closeList();
      out.push('<hr />');
      i += 1;
      continue;
    }
    const h = line.match(/^(#{1,6})\s+(.+)$/);
    if (h) {
      closeList();
      const lv = Math.min(h[1].length + 2, 6); // 页面里已经有 h1/h2，章节从 h3 起
      out.push(`<h${lv}>${inline(h[2])}</h${lv}>`);
      i += 1;
      continue;
    }
    // 表格：连续两行以上，第二行是分隔行
    if (/^\s*\|/.test(line) && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] || '')) {
      closeList();
      const head = line.split('|').slice(1, -1).map((c) => c.trim());
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        rows.push(lines[i].split('|').slice(1, -1).map((c) => c.trim()));
        i += 1;
      }
      out.push(
        `<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows
          .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`)
          .join('')}</tbody></table>`,
      );
      continue;
    }
    const bq = line.match(/^>\s?(.*)$/);
    if (bq) {
      closeList();
      out.push(`<blockquote>${inline(bq[1])}</blockquote>`);
      i += 1;
      continue;
    }
    const ul = line.match(/^\s*[-*+]\s+(.+)$/);
    const ol = line.match(/^\s*\d+[.、)]\s+(.+)$/);
    if (ul || ol) {
      const want = ul ? 'ul' : 'ol';
      if (listOpen !== want) {
        closeList();
        out.push(`<${want}>`);
        listOpen = want;
      }
      out.push(`<li>${inline((ul || ol)[1])}</li>`);
      i += 1;
      continue;
    }
    closeList();
    const buf = [line];
    i += 1;
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,6}\s|```|>|\s*[-*+]\s|\s*\d+[.、)]\s|\||---)/.test(lines[i])) {
      buf.push(lines[i++]);
    }
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  closeList();
  return out.join('\n');
}


/* ------------------------------- 主流程 ------------------------------- */

const warnings = [];
const errors = [];

async function main() {
  const dirs = (await readdir(WORKFLOWS_DIR, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const workflows = [];

  for (const dir of dirs.sort()) {
    const cat = CATEGORIES[dir];
    if (!cat) {
      errors.push(`未登记的分类目录：workflows/${dir}（请在 scripts/build-catalog.mjs 的 CATEGORIES 里补上）`);
      continue;
    }
    const files = (await readdir(path.join(WORKFLOWS_DIR, dir)))
      .filter((f) => f.endsWith('.md'))
      .sort();

    for (const file of files) {
      const abs = path.join(WORKFLOWS_DIR, dir, file);
      const md = await readFile(abs, 'utf8');
      const { preamble, sections } = parseMarkdown(md);
      const slug = file.replace(/\.md$/, '');
      const slugDir = `${dir}/${slug}`;

      const head = sections.find((s) => s.title === '') || { lines: [], fences: [], parts: [] };
      const headText = [...preamble.lines, ...head.lines].join('\n');

      const title = preamble.title.replace(/^[^\p{L}\p{N}]+/u, '').trim();
      // H1 有的是「中文 / English」，有的是「English / 中文」——按有没有汉字来分，
      // 不能按下标取，否则一半工作流的中文名会变成英文。
      const titleParts = title.split('/').map((s) => s.trim());
      const cjkCount = (s) => (s.match(/[\u4e00-\u9fff]/g) || []).length;
      const zhPart = titleParts.find((p) => cjkCount(p) > 0) || titleParts[0];
      const enPart = titleParts.find((p) => p !== zhPart && cjkCount(p) === 0) || '';
      const titleZh = zhPart.replace(/(工作流|流程)$/, '').trim() || zhPart;
      const titleEn = enPart.replace(/\s*Workflow$/i, '').trim();

      const scene = metaValue(headText, ['适用场景', 'UseCase', 'Use Case', '场景']) ||
        metaValue(sectionsToText(sections), ['适用场景']) || '';
      const source = metaValue(headText, ['来源', 'Source']) || '';
      const effect = metaValue(headText, ['效果', 'Effect']) || '';
      const difficultyRaw = metaValue(headText, ['难度', 'Difficulty']) || '';
      const difficulty = difficultyFrom(difficultyRaw || '⭐⭐');

      const promptZh = pickPrompt(sections, 'zh');
      const promptEn = pickPrompt(sections, 'en');

      const disclaimerSection = sections.find((s) => /免责声明|Disclaimer/i.test(s.title));
      const disclaimer = disclaimerSection ? disclaimerSection.lines.join('\n').trim() : '';

      // 其余章节（定制建议 / 真实案例 / 公式库 / 使用技巧…）原样搬到详情页
      const extras = sections
        .filter((s) => s.title && !CONSUMED_SECTIONS.test(s.title))
        .map((s) => ({
          title: s.title.replace(/^[^\p{L}\p{N}]+/u, '').trim(),
          html: renderMarkdown(
            s.parts.map((p) => (p.code !== undefined ? `\`\`\`\n${p.code}\n\`\`\`` : p.text)).join('\n'),
          ),
        }))
        .filter((e) => e.html.replace(/<[^>]+>/g, '').trim().length > 20);

      // 中英占位符按出现顺序配对成「字段」
      const zhFields = extractFields(promptZh);
      const enFields = extractFields(promptEn);
      const zhTokens = zhFields.tokens;
      const enTokens = enFields.tokens;
      const overrides = FIELD_OVERRIDES[slugDir] || {};
      const fieldCount = Math.max(zhTokens.length, enTokens.length);
      const fields = [];
      for (let i = 0; i < fieldCount; i += 1) {
        const z = zhTokens[i];
        const e = enTokens[i];
        const rawToken = (z && z.token) || (e && e.token) || '';
        if (overrides.deny && overrides.deny.includes(rawToken)) continue;
        // 中文提示词是这个站的主线，同一索引两边都在时以中文的字段名为准
        const baseLabel =
          (z ? z.label || shortLabel(z.token) : '') ||
          (e && e.label) ||
          shortLabel(rawToken);
        // relabel 可以按占位符原文写，也可以按机器猜出来的字段名写
        const relabel = overrides.relabel || {};
        const label = relabel[rawToken] || relabel[baseLabel] || baseLabel;
        // 同一件事被写了两遍的（如 trend-analysis 的「平台」），合成一个字段、把选项补上
        const dup = fields.find((f) => f.label === label);
        if (dup) {
          if (!dup.options.length && toOptions(rawToken).length) dup.options = toOptions(rawToken);
          if (z && !dup.zhToken) dup.zhToken = z.braces ? `{{${z.token}}}` : `[${z.token}]`;
          if (e && !dup.enToken) dup.enToken = e.braces ? `{{${e.token}}}` : `[${e.token}]`;
          continue;
        }
        fields.push({
          i: fields.length,
          label,
          hint: rawToken,
          zhToken: z ? (z.braces ? `{{${z.token}}}` : `[${z.token}]`) : '',
          enToken: e ? (e.braces ? `{{${e.token}}}` : `[${e.token}]`) : '',
          options: toOptions(rawToken),
        });
      }
      const outputFormat =
        pickOutputFormat(sections) || zhFields.tail || enFields.tail;

      const versionLine = md.match(/Workflow version:\s*([\d.]+)\s*\|\s*Last updated:\s*([\d-]+)/);
      const updatedAt = versionLine ? versionLine[2] : '';
      const version = versionLine ? versionLine[1] : '1.0';

      const summary = (effect || scene || (head.lines.join('\n').trim()) || titleZh)
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('>') && !l.startsWith('#') && !l.startsWith('---'))
        .join(' ')
        .slice(0, 160);

      const body = md.replace(/^#\s.+\n/, '').trim();

      if (!promptZh && !promptEn) errors.push(`${slugDir}: 没抽到任何提示词（检查 md 的代码块结构）`);
      else if (!promptZh) warnings.push(`${slugDir}: 只有英文提示词`);
      if (!outputFormat) warnings.push(`${slugDir}: 没抽到输出格式块`);
      if (!fields.length) warnings.push(`${slugDir}: 没有占位符（表单会是空的）`);

      workflows.push({
        slug,
        id: slugDir,
        category: dir,
        categoryName: cat.name,
        icon: cat.icon,
        accent: cat.accent,
        title: titleZh,
        titleEn,
        scene,
        source,
        effect,
        summary,
        difficulty,
        difficultyRaw,
        version,
        updatedAt,
        disclaimer,
        promptZh,
        promptEn,
        outputFormat,
        fields,
        path: `workflows/${slugDir}.md`,
        extras,
        stats: {
          zhChars: promptZh.length,
          enChars: promptEn.length,
          placeholders: fields.length,
        },
      });
    }
  }

  // 难度降序、再按分类稳定排序，首页与列表都用这个顺序
  workflows.sort((a, b) => b.difficulty - a.difficulty || a.id.localeCompare(b.id));

  const usedCategories = [...new Set(workflows.map((w) => w.category))]
    .map((id) => ({ ...CATEGORIES[id], count: workflows.filter((w) => w.category === id).length }));

  const out = {
    generatedAt: new Date().toISOString(),
    source: 'workflows/**/*.md',
    categories: usedCategories,
    workflows,
  };

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, `${JSON.stringify(out, null, 2)}\n`, 'utf8');

  console.log(`✔ catalog: ${workflows.length} 个工作流 / ${usedCategories.length} 个分类`);
  console.log(`  ${path.relative(ROOT, OUT_FILE)}`);
  console.log(
    `  带参数表单: ${workflows.filter((w) => w.fields.length).length} / 双语: ${workflows.filter((w) => w.promptZh && w.promptEn).length} / 有输出格式: ${workflows.filter((w) => w.outputFormat).length}`,
  );
  if (warnings.length) {
    console.warn(`\n⚠️  ${warnings.length} 条提醒（不阻断构建）：`);
    for (const w of warnings) console.warn(`   - ${w}`);
  }
  if (errors.length) {
    console.error(`\n✖ ${errors.length} 条错误：`);
    for (const e of errors) console.error(`   - ${e}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
