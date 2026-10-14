#!/usr/bin/env node
/**
 * 生成社交分享卡 apps/site/public/og.png（1200×630）。
 *
 * 为什么不用 SVG：Twitter / Facebook / 微信 都不认 SVG 的 og:image，
 * 分享出去没有卡片图。所以这里把版式渲染成真 PNG。
 *
 * 为什么用 chromium 而不是 sharp/librsvg：中文字体的渲染差异太大，
 * 截图能保证和设计稿一模一样。只是要找到本机的一个 chrome。
 *
 * 产物已提交进仓库，所以 CI 和部署都不需要跑这个脚本 ——
 * 只有改了 og-src/template.html 或想让数字跟上下一次内容更新时才需要：
 *   pnpm og
 *
 * 找不到浏览器时脚本会明确报错并给出解法，不会静默生成一张空白图。
 */
import { readFile, writeFile, mkdir, mkdtemp, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES, DEFAULT_THEME, assertThemesValid } from '../apps/site/themes.mjs';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = path.join(ROOT, 'apps/site/src/data/workflows.json');
const TEMPLATE = path.join(ROOT, 'apps/site/og-src/template.html');
const OUT = (() => {
  const arg = process.argv.find((a) => a.startsWith('--out='));
  return arg ? path.resolve(arg.slice(6)) : path.join(ROOT, 'apps/site/public/og.png');
})();
const W = 1200;
const H = 630;
const THEME_FILE = path.join(ROOT, 'apps/site/theme.txt');

/** 按可能性排的候选浏览器；CHROME 环境变量优先 */
async function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;

  const home = process.env.HOME ?? '';
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
  ];

  // playwright 下载的浏览器也认（本机很可能有这个）
  const pwCache = path.join(home, 'Library/Caches/ms-playwright');
  if (existsSync(pwCache)) {
    const { readdir } = await import('node:fs/promises');
    for (const dir of await readdir(pwCache)) {
      if (!dir.startsWith('chromium')) continue;
      for (const rel of [
        'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        'chrome-mac/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        'chrome-linux/chrome',
      ]) {
        const p = path.join(pwCache, dir, rel);
        if (existsSync(p)) candidates.unshift(p);
      }
    }
  }
  // Windows 常见的两个位置
  candidates.push(
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  );

  return candidates.find((p) => existsSync(p)) ?? '';
}

/** 全双语时显示「中英双语」，否则显示具体的双语条数 */
function languagePill(theme, bilingual, total) {
  if (bilingual >= total) return theme.id === 'atelier' ? '中英双语' : '中 / EN 双语';
  return `${bilingual} 条中英双语`;
}

/** 直接读 PNG 头里的宽高，确认截图尺寸真的是 1200×630 */
async function pngSize(file) {
  const buf = await readFile(file);
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), bytes: buf.length };
}

async function main() {
  if (!existsSync(CATALOG)) {
    console.error('✖ 找不到 apps/site/src/data/workflows.json —— 先跑 `pnpm catalog`');
    process.exit(1);
  }

  assertThemesValid();

  // 主题：跟站点用同一份来源（环境变量 → theme.txt → 默认），
  // 否则会出现「站上是新壳、分享卡还是旧壳」这种最难发现的不一致。
  const themeId =
    (process.env.THEME && THEMES[process.env.THEME] && process.env.THEME) ||
    (existsSync(THEME_FILE) && (await readFile(THEME_FILE, 'utf8')).trim()) ||
    DEFAULT_THEME;
  const theme = THEMES[themeId];
  if (!theme) {
    console.error(`✖ 主题「${themeId}」不存在。可选：${Object.keys(THEMES).join(' / ')}`);
    process.exit(1);
  }

  const catalog = JSON.parse(await readFile(CATALOG, 'utf8'));
  const total = catalog.workflows.length;
  const cats = catalog.categories.length;
  const bilingual = catalog.workflows.filter((w) => w.promptEn).length;
  const filled = catalog.workflows.reduce((n, w) => n + w.fields.length, 0);

  const pill = (text, hot = false) => `<div class="pill${hot ? ' hot' : ''}">${text}</div>`;
  const pills = [
    pill(`${total} 条工作流`),
    pill(`${filled} 个可填参数`),
    pill(languagePill(theme, bilingual, total)),
    pill('MIT 开源', true),
  ].join('');

  // 高定壳走衬线、字距收紧；工程壳走等宽、字号略小才不挤
  const tuned =
    theme.id === 'atelier'
      // 宋体加粗是「合成加粗」，笔画会糊；衬线标题用 500 才像那么回事
      ? { h1: '76px', track: '0.005em', em: 'italic', pill: '2px', weight: '500' }
      : theme.id === 'harness'
        ? { h1: '66px', track: '-0.02em', em: 'normal', pill: '999px', weight: '800' }
        : { h1: '74px', track: '-1.5px', em: 'normal', pill: '999px', weight: '800' };

  // 分享卡上那句话单独写，不要截站点正文 —— 截出来会断在半句上（"或者在这里当场…"）
  const heroLead = theme.hero.ogLead ?? theme.hero.lead;

  const html = (await readFile(TEMPLATE, 'utf8'))
    .replaceAll('__BG__', theme.tokens.bg)
    .replaceAll('__TEXT__', theme.tokens.text)
    .replaceAll('__DIM__', theme.tokens['text-dim'])
    .replaceAll('__PANEL__', theme.tokens.panel)
    .replaceAll('__LINE__', theme.tokens.line)
    .replaceAll('__BRAND__', theme.tokens.brand)
    .replaceAll('__BRAND2__', theme.tokens['brand-2'])
    .replaceAll('__BRAND_RGB__', theme.tokens['brand-rgb'])
    .replaceAll('__BRAND2_RGB__', theme.tokens['brand2-rgb'])
    .replaceAll('__BODY_FONT__', theme.fonts?.body ?? 'sans-serif')
    .replaceAll('__DISPLAY_FONT__', theme.fonts?.display ?? 'sans-serif')
    .replaceAll('__MARK__', theme.mark)
    .replaceAll('__NAME__', theme.name)
    .replaceAll('__SUBTITLE__', theme.subtitle)
    .replaceAll('__H_LINE1__', theme.hero.line1)
    .replaceAll('__H_EM__', theme.hero.em)
    .replaceAll('__H_LINE2__', theme.hero.line2Post)
    .replaceAll('__LEAD__', heroLead)
    .replaceAll('__PILLS__', pills)
    .replaceAll('__URL__', 'github.com/NeoHou-sudo/agentflow')
    .replaceAll('__H1_SIZE__', tuned.h1)
    .replaceAll('__H1_WEIGHT__', tuned.weight)
    .replaceAll('__H1_TRACK__', tuned.track)
    .replaceAll('__EM_STYLE__', tuned.em)
    .replaceAll('__PILL_RADIUS__', tuned.pill);

  const unresolved = html.match(/__[A-Z0-9_]+__/g);
  if (unresolved) {
    console.error(`✖ 模板里还有没替换的占位：${[...new Set(unresolved)].join(' ')}`);
    process.exit(1);
  }

  const chrome = await findChrome();
  if (!chrome) {
    console.error('✖ 没找到可用的 Chrome / Chromium。');
    console.error('  指定一个：CHROME="/path/to/chrome" pnpm og');
    console.error('  或直接手改 apps/site/public/og.png（1200×630），跳过这个脚本。');
    process.exit(1);
  }

  const dir = await mkdtemp(path.join(tmpdir(), 'agentflow-og-'));
  const src = path.join(dir, 'og.html');
  await writeFile(src, html, 'utf8');
  await mkdir(path.dirname(OUT), { recursive: true });

  // 先删旧的，否则截图失败时会把上一版当成成功结果
  const { rm } = await import('node:fs/promises');
  await rm(OUT, { force: true });

  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${W},${H}`,
    '--virtual-time-budget=2500',
    `--screenshot=${OUT}`,
    `file://${src}`,
  ];

  try {
    await run(chrome, args, { maxBuffer: 1 << 24 });
  } catch (err) {
    // 老一点的 chrome 不认 --headless=new，退回 --headless
    try {
      await run(chrome, args.map((a) => (a === '--headless=new' ? '--headless' : a)), {
        maxBuffer: 1 << 24,
      });
    } catch {
      console.error(`✖ 截图失败：${err.message}`);
      process.exit(1);
    }
  }

  const size = await pngSize(OUT);
  if (!size) {
    console.error('✖ 截图没有产出合法 PNG。');
    process.exit(1);
  }
  if (size.width !== W || size.height !== H) {
    console.error(`✖ 尺寸不对：拿到 ${size.width}×${size.height}，预期 ${W}×${H}`);
    process.exit(1);
  }

  await stat(OUT);
  console.log(`✔ og.png 已生成：${size.width}×${size.height}，${(size.bytes / 1024).toFixed(1)} KB`);
  console.log(`  主题：${theme.label}（${theme.id}，${theme.scheme}）`);
  console.log(
    `  ${path.relative(ROOT, OUT)}  （数字来自 catalog：${total} 条工作流 / ${filled} 个可填参数 / ${bilingual} 条双语）`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
