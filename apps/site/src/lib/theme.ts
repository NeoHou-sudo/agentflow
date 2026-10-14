import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  THEMES as RAW_THEMES,
  DEFAULT_THEME,
  themeIds,
  assertThemesValid,
  themeCssVars,
} from '../../themes.mjs';

export interface Theme {
  id: string;
  label: string;
  note: string;
  scheme: 'dark' | 'light';
  name: string;
  subtitle: string;
  mark: string;
  markMono: boolean;
  title: string;
  tagline: string;
  hero: { line1: string; line2Pre: string; em: string; line2Post: string; lead: string };
  tokens: Record<string, string>;
}

const THEMES = RAW_THEMES as unknown as Record<string, Theme>;

export { DEFAULT_THEME, themeIds, assertThemesValid, themeCssVars };
export { THEMES };

const THEME_FILE = fileURLToPath(new URL('../../theme.txt', import.meta.url));

/** astro.config.mjs 通过 vite.define 注入的编译期常量 */
declare const __AF_THEME__: string | undefined;

/**
 * 当前主题。解析顺序：环境变量 THEME → apps/site/theme.txt → 默认。
 * 一个字符串决定整站外观与文案口吻 —— 换壳不需要碰任何组件。
 */
export function currentThemeId(): string {
  // 主路径：编译期注入（astro.config.mjs 那边解析好传下来）
  if (typeof __AF_THEME__ === 'string' && THEMES[__AF_THEME__]) return __AF_THEME__;

  // 兜底：直接跑脚本（非 Vite 环境）时自己读
  const fromEnv = process.env.THEME?.trim();
  if (fromEnv && THEMES[fromEnv]) return fromEnv;

  let fromFile = '';
  try {
    fromFile = readFileSync(THEME_FILE, 'utf8').trim();
  } catch {
    return DEFAULT_THEME; // 文件不存在 → 默认
  }
  if (!fromFile) return DEFAULT_THEME;
  if (!THEMES[fromFile]) {
    // 写错名字不能静默退回默认值 —— 那会让人以为换壳生效了
    throw new Error(
      `apps/site/theme.txt 里的主题「${fromFile}」不存在。可选：${themeIds().join(' / ')}`,
    );
  }
  return fromFile;
}

export function currentTheme(): Theme {
  return THEMES[currentThemeId()] ?? THEMES[DEFAULT_THEME];
}

/** tagline 里的 {n} 换成实际工作流数量 */
export function taglineWith(theme: Theme, total: number): string {
  return theme.tagline.replace('{n}', String(total));
}
