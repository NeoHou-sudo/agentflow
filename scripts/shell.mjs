#!/usr/bin/env node
/**
 * 换壳工具。`pnpm shell`
 *
 *   pnpm shell                 列出所有壳 + 当前是哪个
 *   pnpm shell set <id>        切过去（改 apps/site/shell.txt）
 *   pnpm shell preview         每个壳的分享卡各渲一张，放 .tmp/shell-preview/ 对比
 *   pnpm shell kit [id]        打印某个壳的营销素材包（默认当前壳，可直接粘贴）
 *
 * 为什么要有这个：v1 把「壳」理解成配色，于是换壳只换到了颜色 ——
 * README 和对外说法纹丝不动。现在一个壳包含视觉 + 站点文案 + README + 营销素材，
 * 全部由 apps/site/shells.mjs 和 apps/site/shells/ 下的模板定义。
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SHELLS, DEFAULT_SHELL, shellIds, assertShellsValid, fillCopy } from '../apps/site/shells.mjs';
import { buildVars, currentShellId } from './build-readme.mjs';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHELL_FILE = path.join(ROOT, 'apps/site/shell.txt');
const SHELL_DIR = path.join(ROOT, 'apps/site/shells');
const PREVIEW_DIR = path.join(ROOT, '.tmp/shell-preview');

assertShellsValid();

async function list() {
  const cur = await currentShellId();
  console.log('可用的壳：\n');
  for (const id of shellIds()) {
    const s = SHELLS[id];
    const mark = id === cur ? '▶' : ' ';
    console.log(`${mark} ${id.padEnd(9)} ${s.label.padEnd(20)} [${s.scheme}]`);
    console.log(`  ${' '.repeat(11)}${s.note}`);
    console.log(`  ${' '.repeat(11)}卖点：${s.copy.pitch}`);
    console.log('');
  }
  console.log(`当前：${cur}　（apps/site/shell.txt）\n`);
  console.log('  切换并让一切跟着变：');
  console.log('    pnpm shell set <id> && pnpm readme && pnpm og');
  console.log('  dev 在跑的话要重启 —— 壳在 config 阶段解析。\n');
  console.log('  看营销素材：pnpm shell kit');
  console.log('  对比分享卡：pnpm shell preview');
}

async function set(id) {
  if (!SHELLS[id]) {
    console.error(`✖ 没有这个壳：「${id}」。可选：${shellIds().join(' / ')}`);
    process.exit(1);
  }
  await writeFile(SHELL_FILE, `${id}\n`, 'utf8');
  const s = SHELLS[id];
  console.log(`✔ 已切到 ${s.label}（${id}，${s.scheme === 'light' ? '浅色' : '深色'}）\n`);
  console.log('  这个壳现在决定了四件事：');
  console.log('    视觉     颜色 / 圆角 / 字体 / 站点图标 / 分享卡');
  console.log('    站点文案 标题 / hero / meta description / 副标题');
  console.log('    README   根 README.md 由 pnpm readme 重新合成');
  console.log('    营销素材 定位 / 卖点 / 渠道稿 / 口吻规则（pnpm shell kit）\n');
  console.log('  下一步：pnpm readme && pnpm og');
}

async function preview() {
  await mkdir(PREVIEW_DIR, { recursive: true });
  console.log(`渲染 ${shellIds().length} 张分享卡到 .tmp/shell-preview/ …\n`);
  for (const id of shellIds()) {
    const out = path.join(PREVIEW_DIR, `${id}.png`);
    try {
      const { stdout } = await run(process.execPath, [path.join(ROOT, 'scripts/build-og.mjs'), `--out=${out}`], {
        env: { ...process.env, SHELL: id },
      });
      const line = stdout.split('\n').filter(Boolean).pop()?.trim() ?? '';
      console.log(`✔ ${id.padEnd(9)} ${line}`);
    } catch (err) {
      console.error(`✖ ${id} 渲染失败：${err.message}`);
      process.exitCode = 1;
    }
  }
  console.log(`\n都在 ${path.relative(ROOT, PREVIEW_DIR)}/ 下，可以直接对比。`);
}

async function kit(id) {
  const target = id || (await currentShellId());
  const s = SHELLS[target];
  if (!s) {
    console.error(`✖ 没有这个壳：「${target}」。可选：${shellIds().join(' / ')}`);
    process.exit(1);
  }
  const file = path.join(SHELL_DIR, `${target}.marketing.md`);
  if (!existsSync(file)) {
    console.error(`✖ 找不到 ${path.relative(ROOT, file)}`);
    process.exit(1);
  }
  const vars = await buildVars();
  const body = fillCopy(await readFile(file, 'utf8'), vars);

  // 口吻规则留在 shells.mjs 里当唯一真源，打印时并进来，省得两边各写一份
  const tone = s.copy.tone.map((t) => `- ${t}`).join('\n');
  process.stdout.write(`${body.replace(/\{tone_list\}/g, tone)}\n`);
}

const [cmd, arg] = process.argv.slice(2);

if (!cmd) {
  await list();
} else if (cmd === 'set') {
  if (!arg) {
    console.error(`✖ 要指定壳：pnpm shell set <${shellIds().join('|')}>`);
    process.exit(1);
  }
  await set(arg);
} else if (cmd === 'preview') {
  await preview();
} else if (cmd === 'kit') {
  await kit(arg);
} else if (shellIds().includes(cmd)) {
  await set(cmd); // 手滑少打 set 也认
} else {
  console.error(`✖ 不认识的命令「${cmd}」。可用：set <id> / preview / kit [id] / 直接跑 pnpm shell 看列表`);
  process.exit(1);
}
