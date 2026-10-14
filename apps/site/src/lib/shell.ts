import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  SHELLS as RAW_SHELLS,
  DEFAULT_SHELL,
  shellIds,
  assertShellsValid,
  shellCssVars,
  fillCopy,
} from '../../shells.mjs';

export interface Shell {
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
  hero: { line1: string; line2Pre: string; em: string; line2Post: string; lead: string; ogLead?: string };
  copy: {
    description: string;
    audience: string;
    props: string[];
    pitch: string;
    tone: string[];
  };
  fonts?: { display: string; body: string };
  tokens: Record<string, string>;
}

const SHELLS = RAW_SHELLS as unknown as Record<string, Shell>;

export { DEFAULT_SHELL, shellIds, assertShellsValid, shellCssVars, fillCopy };
export { SHELLS };

const SHELL_FILE = fileURLToPath(new URL('../../shell.txt', import.meta.url));

/** astro.config.mjs 通过 vite.define 注入的编译期常量 */
declare const __AF_SHELL__: string | undefined;

/**
 * 当前壳。解析顺序：环境变量 SHELL → apps/site/shell.txt → 默认。
 * 一个字符串决定整站外观、站点文案、README 和营销素材 —— 换壳不需要碰任何组件。
 */
export function currentShellId(): string {
  // 主路径：编译期注入（astro.config.mjs 那边解析好传下来）
  if (typeof __AF_SHELL__ === 'string' && SHELLS[__AF_SHELL__]) return __AF_SHELL__;

  // 兜底：直接跑脚本（非 Vite 环境）时自己读
  const fromEnv = process.env.SHELL?.trim();
  if (fromEnv && SHELLS[fromEnv]) return fromEnv;

  let fromFile = '';
  try {
    fromFile = readFileSync(SHELL_FILE, 'utf8').trim();
  } catch {
    return DEFAULT_SHELL; // 文件不存在 → 默认
  }
  if (!fromFile) return DEFAULT_SHELL;
  if (!SHELLS[fromFile]) {
    // 写错名字不能静默退回默认值 —— 那会让人以为换壳生效了
    throw new Error(
      `apps/site/shell.txt 里的壳「${fromFile}」不存在。可选：${shellIds().join(' / ')}`,
    );
  }
  return fromFile;
}

export function currentShell(): Shell {
  return SHELLS[currentShellId()] ?? SHELLS[DEFAULT_SHELL];
}

/** tagline / copy 里的 {n} 换成实际工作流数量 */
export function fillCounts(text: string, vars: Record<string, string | number>): string {
  return fillCopy(text, vars);
}
