/**
 * AgentFlow 主题注册表（唯一真源）。
 *
 * 用 .mjs 而不是 .ts，是因为它同时要被两边读：
 *   · 站点（src/lib/theme.ts 包一层类型）
 *   · 构建脚本（scripts/build-og.mjs 要按主题出分享卡）
 *
 * 为什么要有这层：v1 把所有品牌信息写死在组件里（Base.astro 的 🦞、
 * site.ts 的「龙虾工具包」、18 处写死的颜色），结果「换壳」等于重做一遍。
 * 现在换壳 = 改 apps/site/theme.txt 一行。
 *
 * 加一个新主题：在 THEMES 里加一条，确保 tokens 里每个变量都给到
 * （缺了会退回 global.css 的默认值，浅色主题会因此露馅），
 * 然后 `pnpm theme set <id>`。
 */

/** 没配置时用哪个 */
export const DEFAULT_THEME = 'harness';

/** tokens 里必须有的键。少一个就在构建时报错，不让它静默退回深色默认值。 */
export const REQUIRED_TOKENS = [
  'bg',
  'bg-soft',
  'panel',
  'panel-2',
  'line',
  'line-soft',
  'text',
  'text-dim',
  'text-mute',
  'brand',
  'brand-2',
  'brand-soft',
  'brand-rgb',
  'brand2-rgb',
  'green',
  'blue',
  'purple',
  'cyan',
  'code-text',
  'run-bg',
  'run-text',
  'header-bg',
  'shadow-rgb',
  'radius',
  'radius-sm',
];

export const THEMES = {
  /* ------------------------------------------------------------------ */
  harness: {
    id: 'harness',
    label: 'Harness 装配线',
    note: '工程感：冷绿主色 + 深底 + 等宽标题。面向「能被程序调用」这件事本身。',
    scheme: 'dark',
    name: 'AgentFlow',
    subtitle: 'HARNESS',
    mark: '⌗',
    markMono: true,
    title: 'AgentFlow · Harness',
    tagline: '{n} 条真跑过的 AI Agent 工作流 · 可填空 · 可复制 · 可被程序调用',
    hero: {
      line1: '提示词不该靠复制粘贴',
      line2Pre: '把它接进',
      em: '一条可复用的装配线',
      line2Post: '',
      ogLead: '填参数 → 提示词自动拼好 → 复制走或当场跑一遍 · 另有 JSON / raw.md 端点',
      lead:
        '每条工作流都拆成了可以填的输入项：填参数 → 提示词自动拼好 → 复制走，或者在这里当场跑一遍。' +
        '另有 JSON 与 raw.md 端点，能被你自己的程序直接调用。',
    },
    fonts: {
      display: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
      body: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", sans-serif',
    },
    tokens: {
      bg: '#07080a',
      'bg-soft': '#0b0d10',
      panel: '#0f1216',
      'panel-2': '#0b0e12',
      line: '#1e242c',
      'line-soft': '#161b21',
      text: '#e7eaee',
      'text-dim': '#98a1ad',
      'text-mute': '#6b7480',
      brand: '#2ee08a',
      'brand-2': '#12b8a0',
      'brand-soft': '#6ef0b0',
      'brand-rgb': '46,224,138',
      'brand2-rgb': '18,184,160',
      green: '#4ade80',
      blue: '#60a5fa',
      purple: '#a78bfa',
      cyan: '#22d3ee',
      'code-text': '#cfd6de',
      'run-bg': '#04060a',
      'run-text': '#b9c2cc',
      'header-bg': 'rgba(7,8,10,0.82)',
      'shadow-rgb': '0,0,0',
      radius: '7px',
      'radius-sm': '5px',
    },
  },

  /* ------------------------------------------------------------------ */
  atelier: {
    id: 'atelier',
    label: 'Atelier 高定',
    note:
      '浅色 + 高定橙 + 衬线标题 + 直角。视觉上借鉴了奢侈品的语言（大留白、细线条、克制色），' +
      '但产品名不要用真实奢侈品牌 —— 那是商标问题，不是审美问题。',
    scheme: 'light',
    name: 'AgentFlow',
    subtitle: '',
    mark: 'AF',
    markMono: false,
    title: 'AgentFlow · Atelier',
    tagline: '{n} 条真跑过的 AI Agent 工作流 · 值得被认真对待的提示词',
    hero: {
      line1: '把提示词',
      line2Pre: '做成',
      em: '可交付的东西',
      line2Post: '',
      ogLead: '填参数，拿到拼好的提示词；或者就在这里跑一遍看结果',
      lead:
        '每一条都是真跑过、真出过结果的。填参数，拿到拼好的提示词，或者就在这里跑一遍看结果。' +
        '不堆功能，够用为止。',
    },
    // 中文形体优先：Georgia 排前面的话，中文会回退成黑体，「高定」就没了。
    // 正文仍走无衬线 —— 中文长段落用宋体读起来很累。
    fonts: {
      display: '"Songti SC", "STSong", Georgia, "Times New Roman", serif',
      body: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", sans-serif',
    },
    tokens: {
      bg: '#faf7f3',
      'bg-soft': '#f4efe8',
      panel: '#ffffff',
      'panel-2': '#f7f3ed',
      line: '#e3dacd',
      'line-soft': '#ece5db',
      text: '#1b1815',
      'text-dim': '#5f574d',
      'text-mute': '#8d8375',
      // 比「那个橙」再深一点：白底上要保住对比度，纯 #f37021 放小字会飘
      brand: '#c25a17',
      'brand-2': '#9c3f0c',
      'brand-soft': '#a8480f',
      'brand-rgb': '194,90,23',
      'brand2-rgb': '156,63,12',
      green: '#2f7d4f',
      blue: '#2b5ea8',
      purple: '#6b4bb0',
      cyan: '#1a7f8c',
      'code-text': '#2a2622',
      'run-bg': '#f4efe8',
      'run-text': '#3a352e',
      'header-bg': 'rgba(250,247,243,0.86)',
      'shadow-rgb': '92,68,40',
      radius: '2px',
      'radius-sm': '2px',
    },
  },

  /* ------------------------------------------------------------------ */
  lobster: {
    id: 'lobster',
    label: '龙虾工具包（v1 原貌）',
    note: 'v1 的橙红 + 深底。留档用 —— 想对比换壳前后效果时切回来看。',
    scheme: 'dark',
    name: 'AgentFlow',
    subtitle: '龙虾工具包',
    mark: '🦞',
    markMono: false,
    title: 'AgentFlow · 龙虾工具包',
    tagline: '{n} 个真跑过的 AI Agent 工作流 · 可搜索 · 可填空 · 可站内试跑',
    hero: {
      line1: '不是「10 个超好用的提示词」',
      line2Pre: '是',
      em: '真跑过、真出过结果',
      line2Post: '的工作流',
      ogLead: '填完参数，提示词自动拼好，复制走或者直接在这里跑一遍',
      lead:
        '每条工作流都拆成了可以填的输入项：填完参数，提示词自动拼好，复制走或者直接在这里跑一遍。',
    },
    fonts: {
      display: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", sans-serif',
    },
    tokens: {
      bg: '#0a0a0f',
      'bg-soft': '#101019',
      panel: '#14141e',
      'panel-2': '#0f0f1a',
      line: '#262636',
      'line-soft': '#1d1d2b',
      text: '#e8e8ef',
      'text-dim': '#9a9aae',
      'text-mute': '#6b6b80',
      brand: '#ff6b35',
      'brand-2': '#ff2d55',
      'brand-soft': '#ff9f6a',
      'brand-rgb': '255,107,53',
      'brand2-rgb': '255,45,85',
      green: '#4ade80',
      blue: '#60a5fa',
      purple: '#a78bfa',
      cyan: '#22d3ee',
      'code-text': '#d8d8e4',
      'run-bg': '#07070c',
      'run-text': '#c9c9d6',
      'header-bg': 'rgba(10,10,15,0.82)',
      'shadow-rgb': '0,0,0',
      radius: '14px',
      'radius-sm': '9px',
    },
  },
};

export const themeIds = () => Object.keys(THEMES);

/** 校验：tokens 缺键、id 对不上都直接抛，不让它静默降级 */
export function assertThemesValid(themes = THEMES) {
  for (const [key, t] of Object.entries(themes)) {
    if (t.id !== key) throw new Error(`主题 ${key} 的 id 字段是 ${t.id}，对不上`);
    for (const token of REQUIRED_TOKENS) {
      if (!t.tokens?.[token]) throw new Error(`主题 ${key} 缺少 token：${token}`);
    }
    if (!['dark', 'light'].includes(t.scheme)) throw new Error(`主题 ${key} 的 scheme 必须是 dark/light`);
    for (const part of ['hero', 'name', 'mark', 'tagline']) {
      if (!t[part]) throw new Error(`主题 ${key} 缺少 ${part}`);
    }
  }
  if (!themes[DEFAULT_THEME]) throw new Error(`DEFAULT_THEME(${DEFAULT_THEME}) 不在注册表里`);
}

/**
 * 主题名 → CSS 自定义属性列表（给 Base.astro 注入 <html style>）。
 * fonts 不走 CSS 变量：字体栈里带逗号和引号，塞进 style="" 会很难读，
 * 所以站点用 global.css 里的 [data-theme] 规则，分享卡直接用 theme.fonts。
 */

/** 主题名 → CSS 自定义属性列表（给 Base.astro 注入 <html style>） */
export function themeCssVars(theme) {
  return Object.entries(theme.tokens)
    .map(([k, v]) => `--${k}: ${v};`)
    .join(' ');
}

export function resolveTheme(id) {
  const t = THEMES[id] ?? THEMES[DEFAULT_THEME];
  return t;
}
