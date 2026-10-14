#!/usr/bin/env node
/**
 * 换壳工具。`pnpm theme`
 *
 *   pnpm theme                 列出所有壳 + 当前是哪个
 *   pnpm theme set <id>        切过去（改 apps/site/theme.txt）并重出分享卡
 *   pnpm theme preview         把每个壳的分享卡都渲一张到 .tmp/theme-preview/ 方便对比
 *
 * 为什么要有这个：v1 把品牌信息写死在组件里，于是「换个壳」等于重做一遍。
 * 现在换壳是一条命令 —— 也就不必再纠结「该套哪个壳」，随时能换回来。
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES, DEFAULT_THEME, themeIds, assertThemesValid } from '../apps/site/themes.mjs';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const THEME_FILE = path.join(ROOT, 'apps/site/theme.txt');
const PREVIEW_DIR = path.join(ROOT, '.tmp/theme-preview');

assertThemesValid();

async function currentId() {
  if (!existsSync(THEME_FILE)) return DEFAULT_THEME;
  const v = (await readFile(THEME_FILE, 'utf8')).trim();
  return v || DEFAULT_THEME;
}

function list() {
  const cur = process.env.__CURRENT__;
  console.log('可用的壳：\n');
  for (const id of themeIds()) {
    const t = THEMES[id];
    const mark = id === cur ? '▶' : ' ';
    console.log(`${mark} ${id.padEnd(9)} ${t.label.padEnd(18)} [${t.scheme}]  ${t.note}`);
  }
  console.log(`\n当前：${cur}　（apps/site/theme.txt）`);
  console.log('切换：pnpm theme set <id>　　对比分享卡：pnpm theme preview');
}

async function set(id) {
  if (!THEMES[id]) {
    console.error(`✖ 没有这个壳：「${id}」。可选：${themeIds().join(' / ')}`);
    process.exit(1);
  }
  await writeFile(THEME_FILE, `${id}\n`, 'utf8');
  console.log(`✔ 已切到 ${THEMES[id].label}（${id}）`);
  console.log('  下一步：pnpm og 重出分享卡；dev 在跑的话要重启（主题在 config 阶段解析）');
}

async function preview() {
  await mkdir(PREVIEW_DIR, { recursive: true });
  console.log(`渲染 ${themeIds().length} 张分享卡到 .tmp/theme-preview/ …\n`);
  for (const id of themeIds()) {
    const out = path.join(PREVIEW_DIR, `${id}.png`);
    try {
      const { stdout } = await run(
        process.execPath,
        [path.join(ROOT, 'scripts/build-og.mjs'), `--out=${out}`],
        { env: { ...process.env, THEME: id } },
      );
      console.log(`✔ ${id.padEnd(9)} ${stdout.split('\n').filter(Boolean).pop().trim()}`);
    } catch (err) {
      console.error(`✖ ${id} 渲染失败：${err.message}`);
      process.exitCode = 1;
    }
  }
  console.log(`\n都在 ${path.relative(ROOT, PREVIEW_DIR)}/ 下，可以直接对比。`);
}

const [cmd, arg] = process.argv.slice(2);

if (!cmd) {
  process.env.__CURRENT__ = await currentId();
  list();
} else if (cmd === 'set') {
  if (!arg) {
    console.error(`✖ 要指定壳：pnpm theme set <${themeIds().join('|')}>`);
    process.exit(1);
  }
  await set(arg);
} else if (cmd === 'preview') {
  await preview();
} else if (themeIds().includes(cmd)) {
  // 手滑少打 set 也认
  await set(cmd);
} else {
  console.error(`✖ 不认识的命令「${cmd}」。可用：set <id> / preview / 直接跑 pnpm theme 看列表`);
  process.exit(1);
}
