#!/usr/bin/env node
/**
 * 内容不变式检查。`pnpm check`，CI 在 catalog 之后跑。
 *
 * build-catalog.mjs 只管「能不能解析出东西」；这里管的是**更细的静默缺陷** ——
 * 那些不会让构建失败、但你点进页面才发现不对的问题：
 *
 *   · 某个字段只有中文占位符、没有英文的 → 切到 English 后那个坑填不上
 *   · 填完所有参数，提示词里还留着方括号 → 生成的东西是半成品
 *   · 中英文占位符数量不一致 → 按索引配对会整体错位（把时长配到观众上）
 *
 * 这些都在英文提示词补齐那一轮真实发生过。加了这道闸，下次直接报错而不是靠肉眼。
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertThemesValid, themeIds, THEMES, DEFAULT_THEME } from '../apps/site/themes.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = path.join(ROOT, 'apps/site/src/data/workflows.json');

const PLACEHOLDER = /\[[^\]\n]{1,120}\]|\{\{[^}\n]{1,40}\}\}/g;

/** 输入项之外、允许留着方括号的地方：任务列表复选框、输出格式示例 */
const ALLOWED_LEFTOVER = (text) =>
  text
    .split('\n')
    .filter((line) => {
      const t = line.trim();
      if (/^[-*+]\s*\[[ xX*\-]\]/.test(t)) return false; // 复选框
      if (/^\[[ xX*\-]\]/.test(t)) return false;
      return true;
    })
    .join('\n');

const problems = [];
const warnings = [];

/** 把某个语言下所有字段的占位符都替换成标记值，返回残留的占位符 */
function residual(prompt, fields, key) {
  let out = prompt;
  for (const f of fields) {
    for (const token of f[key] ?? []) {
      if (token) out = out.split(token).join(`«${f.label}»`);
    }
  }
  const text = ALLOWED_LEFTOVER(out);
  return [...new Set(text.match(PLACEHOLDER) ?? [])];
}

// 主题定义也得校验：tokens 少一个键、id 写错，都会让某个壳静默退回默认颜色
try {
  assertThemesValid();
} catch (err) {
  console.error(`✖ 主题定义有问题：${err.message}`);
  process.exit(1);
}

const catalog = JSON.parse(await readFile(CATALOG, 'utf8'));

for (const w of catalog.workflows) {
  const where = w.id;

  if (!w.promptZh && !w.promptEn) {
    problems.push(`${where}: 一个提示词都没有`);
    continue;
  }
  if (w.promptZh && w.promptEn && w.fields.length === 0) {
    warnings.push(`${where}: 中英都有但没有可填字段`);
  }

  // 1) 字段不能只有单语的占位符（英文缺了更常见）
  const orphanEn = w.fields.filter((f) => f.zhTokens?.length && !f.enTokens?.length);
  const orphanZh = w.fields.filter((f) => f.enTokens?.length && !f.zhTokens?.length);
  if (orphanEn.length) {
    problems.push(
      `${where}: ${orphanEn.length} 个字段缺英文占位符 → ${orphanEn.map((f) => f.label).join('、')}` +
        '（切到 English 后这些填不上）',
    );
  }
  if (orphanZh.length) {
    problems.push(
      `${where}: ${orphanZh.length} 个字段缺中文占位符 → ${orphanZh.map((f) => f.label).join('、')}`,
    );
  }

  // 2) 中英占位符数量要一致，否则按索引配对会错位
  if (w.promptZh && w.promptEn) {
    const zhCount = w.fields.reduce((n, f) => n + (f.zhTokens?.length ?? 0), 0);
    const enCount = w.fields.reduce((n, f) => n + (f.enTokens?.length ?? 0), 0);
    // 合并字段（同一件事写了两种写法）会让计数大于字段数，这是正常的；
    // 不正常的是两边差太多。
    if (zhCount === 0 || enCount === 0) {
      problems.push(`${where}: 中英占位符数量异常（zh=${zhCount}, en=${enCount}）`);
    }
  }

  // 3) 参数全填之后，提示词里不该再留方括号（除了复选框和输出格式示例）
  if (w.fields.length) {
    if (w.promptZh) {
      const left = residual(w.promptZh, w.fields, 'zhTokens');
      if (left.length) warnings.push(`${where} [中文] 全填后仍残留: ${left.join(' ')}`);
    }
    if (w.promptEn) {
      const left = residual(w.promptEn, w.fields, 'enTokens');
      if (left.length) warnings.push(`${where} [英文] 全填后仍残留: ${left.join(' ')}`);
    }
  }

  // 4) 字段得给点提示，否则用户不知道填什么
  for (const f of w.fields) {
    if (!f.options?.length && !f.hint) {
      problems.push(`${where}: 字段「${f.label}」既没有可选值也没有提示`);
    }
    if (!f.label || f.label.length > 30) {
      problems.push(`${where}: 字段名可疑「${f.label}」`);
    }
  }

  // 5) 元信息
  if (!w.title) problems.push(`${where}: 没有标题`);
  if (!w.summary) warnings.push(`${where}: 没有摘要（卡片会是空的）`);
  if (!w.outputFormat) warnings.push(`${where}: 没有预期输出格式`);
  if (!w.raw) problems.push(`${where}: 缺 raw markdown（raw.md 端点会返回空）`);
}

console.log(`检查了 ${catalog.workflows.length} 个工作流 · 主题 ${themeIds().length} 个（默认 ${DEFAULT_THEME}）`);
console.log(
  `  双语 ${catalog.workflows.filter((w) => w.promptEn).length} · 可填字段 ${catalog.workflows.reduce(
    (n, w) => n + w.fields.length,
    0,
  )} · 有输出格式 ${catalog.workflows.filter((w) => w.outputFormat).length}`,
);

if (warnings.length) {
  console.log(`\n⚠️  ${warnings.length} 条提醒（不阻断）：`);
  for (const x of warnings) console.log(`   · ${x}`);
}

if (problems.length) {
  console.error(`\n✖ ${problems.length} 条问题：`);
  for (const p of problems) console.error(`   · ${p}`);
  process.exit(1);
}

console.log('\n✔ 内容不变式全部通过');
