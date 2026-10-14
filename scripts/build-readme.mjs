#!/usr/bin/env node
/**
 * 按当前壳合成根 README.md。
 *
 *   pnpm readme          写 README.md
 *   pnpm readme --check  只比对，不一致就 exit 1（CI 用）
 *
 * 为什么 README 要生成：README 是仓库门脸，它同时承载「定位 / 口吻 / 数字」——
 * 这三样都跟壳走。手写一份的话，换壳只换到颜色，门脸纹丝不动，壳就只换了一半。
 *
 * 合成方式：
 *   shells/<壳>.readme.md   ← 壳相关（标题、定位、实际效果、适合谁、English）
 *   shells/_shared.md       ← 仓库共用（怎么用、结构、部署、贡献、换壳）
 *   shells/<壳>.readme.md 里用 `<!-- SPLIT: english -->` 切成上下两段，
 *   中间夹共用部分，这样英文简介仍然在文末。
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SHELLS, DEFAULT_SHELL, shellIds, assertShellsValid, fillCopy } from '../apps/site/shells.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'apps/site');
const SHELL_DIR = path.join(SITE, 'shells');
const CATALOG = path.join(SITE, 'src/data/workflows.json');
const OUT = path.join(ROOT, 'README.md');
const SHELL_FILE = path.join(SITE, 'shell.txt');
const SPLIT = '<!-- SPLIT: english -->';

const HEADER = `<!--
  这个文件由 \`pnpm readme\` 从 apps/site/shells/ 合成 —— 直接改这里，下次生成会被覆盖。

  改壳的定位 / 口吻 / 实际效果 → apps/site/shells/<壳>.readme.md
  改仓库说明（怎么用 / 结构 / 部署 / 贡献） → apps/site/shells/_shared.md
  换壳 → pnpm shell set <id>
-->
`;

export function currentShellId() {
  const fromEnv = process.env.SHELL?.trim();
  if (fromEnv && SHELLS[fromEnv]) return fromEnv;

  if (existsSync(SHELL_FILE)) {
    const v = readFileSync(SHELL_FILE, 'utf8').trim();
    if (!v) return DEFAULT_SHELL;
    if (!SHELLS[v]) {
      // 写错名字不能静默退回默认壳 —— 那会让人以为换壳生效了
      throw new Error(`apps/site/shell.txt 里的壳「${v}」不存在。可选：${shellIds().join(' / ')}`);
    }
    return v;
  }
  return DEFAULT_SHELL;
}

/** 模板占位符的取值。README 合成和营销素材包都从这里取，保证数字一致。 */
export async function buildVars() {
  if (!existsSync(CATALOG)) {
    throw new Error('找不到 apps/site/src/data/workflows.json —— 先跑 `pnpm catalog`');
  }
  const catalog = JSON.parse(await readFile(CATALOG, 'utf8'));
  const id = currentShellId();
  const shell = SHELLS[id];
  const workflows = catalog.workflows;

  return {
    n_workflows: workflows.length,
    n_fields: workflows.reduce((n, w) => n + w.fields.length, 0),
    n_bilingual: workflows.filter((w) => w.promptZh && w.promptEn).length,
    n_categories: catalog.categories.length,
    repo: 'https://github.com/NeoHou-sudo/agentflow',
    shell_id: shell.id,
    shell_label: shell.label,
    // 营销素材包要把口吻规则和卖点也并进来，省得模板里再抄一遍
    tone_list: shell.copy.tone.map((t) => `> - ${t}`).join('\n'),
    audience: shell.copy.audience,
    props_list: shell.copy.props
      .map((prop, i) => `${i + 1}. **${prop.title}** —— ${prop.body}`)
      .join('\n'),
    category_table: catalog.categories
      .map((c) => {
        const list = workflows.filter((w) => w.category === c.id);
        const names = list.slice(0, 3).map((w) => w.title);
        const more = list.length > 3 ? ' 等' : '';
        return `| ${c.icon} ${c.name} | ${c.count} | ${names.join('、')}${more} |`;
      })
      .join('\n'),
    shell_table: shellIds()
      .map((sid) => {
        const s = SHELLS[sid];
        const you = sid === id ? ' ← 当前' : '';
        return `| \`${sid}\` | ${s.label} | ${s.scheme === 'light' ? '浅色' : '深色'} | ${s.copy.pitch}${you} |`;
      })
      .join('\n'),
  };
}

/** 组装 README 正文（不含头部注释） */
export async function renderReadme() {
  assertShellsValid();
  const id = currentShellId();
  const vars = await buildVars();
  const fill = (t) => fillCopy(t, vars);
  const shellReadme = await readFile(path.join(SHELL_DIR, `${id}.readme.md`), 'utf8');
  const shared = await readFile(path.join(SHELL_DIR, '_shared.md'), 'utf8');

  if (!shellReadme.includes(SPLIT)) {
    throw new Error(`shells/${id}.readme.md 里缺少 ${SPLIT} 分隔标记`);
  }
  const [top, bottom] = shellReadme.split(SPLIT);

  return `${fill(top).trim()}\n\n${fill(shared).trim()}\n\n${fill(bottom).trim()}\n`;
}

/** 未替换的占位符 —— 生成时留个心眼，别让 {n_workflow} 这种笔误直接进 README */
export function leftoverPlaceholders(text) {
  return [...new Set((text.match(/\{[a-z_][a-z0-9_]*\}/g) ?? []))];
}

export async function checkReadme() {
  const expected = HEADER + (await renderReadme());
  const actual = existsSync(OUT) ? await readFile(OUT, 'utf8') : '';
  if (actual === expected) return { ok: true };
  const left = leftoverPlaceholders(expected.replace(HEADER, ''));
  return {
    ok: false,
    reason: actual ? 'README.md 与当前壳不一致' : 'README.md 不存在',
    leftover: left,
  };
}

async function main() {
  const check = process.argv.includes('--check');

  if (check) {
    const r = await checkReadme();
    if (!r.ok) {
      console.error(`✖ ${r.reason}。跑 \`pnpm readme\` 重新合成。`);
      if (r.leftover?.length) {
        console.error(`  另外这些占位符没被替换（可能是写错了）：${r.leftover.join(' ')}`);
      }
      process.exit(1);
    }
    console.log('✔ README.md 与当前壳一致');
    return;
  }

  const id = currentShellId();
  const body = await renderReadme();
  const left = leftoverPlaceholders(body);
  await writeFile(OUT, HEADER + body, 'utf8');
  console.log(`✔ README.md 已按壳「${SHELLS[id].label}」(${id}) 合成`);
  console.log(`  ${path.relative(ROOT, OUT)} —— ${body.split('\n').length} 行`);
  if (left.length) {
    console.warn(`\n⚠️  有占位符没被替换：${left.join(' ')}`);
    console.warn('   （拼错键名会原样留在 README 里，检查一下 shells/ 下的模板）');
  }
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  main().catch((err) => {
    console.error(`✖ ${err.message}`);
    process.exit(1);
  });
}
