/**
 * AgentFlow 壳注册表（唯一真源）。
 *
 * 一个「壳」不是配色方案，是**一整套对外说法**：
 *   1. 视觉   —— tokens（颜色/圆角）、字体栈、logo 标记
 *   2. 站点文案 —— 标题、副标题、tagline、hero、meta description
 *   3. README  —— 仓库门脸（由 scripts/build-readme.mjs 合成根 README.md）
 *   4. 营销素材 —— 定位、价值主张、口吻规则、各渠道可直接粘贴的稿子
 *                   （在 shells/<id>.marketing.md，`pnpm shell kit` 打印）
 *
 * 为什么要有这层：v1 把这四样都写死在各自的地方（🦞 在组件里、README 是手写单份、
 * 定位散在文案里）。结果「换个壳」只能换到颜色，README 和对外说法纹丝不动 ——
 * 壳就只换了一半。
 *
 * 用 .mjs 而不是 .ts：它要同时被站点（src/lib/shell.ts 包一层类型）、
 * 构建脚本（build-og / build-readme）和 CI 检查读。
 */

/** 没配置时用哪个 */
export const DEFAULT_SHELL = 'harness';

/**
 * Harbor 壳的标记：云 + 帆 + 水线，金色前帆。
 * 图形照一份内部品牌视觉手册的原样取出，只去了编辑平台注入的属性 ——
 * 那条手册的纪律是「不许改色、不许变形、不许拆件」，所以这里不做任何「优化」。
 * 本壳不携带该公司品牌：没有公司名、没有 Slogan、没有商标声明。
 */
const QIANYI_MARK_SVG = `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"> <rect fill="#0C2440" height="108" rx="30" width="108" x="6" y="6"/> <g fill="#F5F8FB"><circle cx="76" cy="28" r="6.5"/><circle cx="85" cy="25" r="8"/><circle cx="91.5" cy="29" r="5.5"/><rect height="7" rx="3.5" width="22" x="72" y="28"/></g> <path d="M56 82 L67 40 C 79 56 86 71 88 82 Z" fill="#F5F8FB"/> <path d="M54 82 L54 46 C 46 59 39 71 34 82 Z" fill="#D9A441"/> <path d="M20 90 Q 60 99 100 90" fill="none" stroke="#F5F8FB" stroke-linecap="round" stroke-width="5.5"/> </svg>`;

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
  'accent',
  'accent-rgb',
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

/** copy 里必须有的键 —— 缺了就是把「营销壳」做成了空壳 */
export const REQUIRED_COPY = ['description', 'audience', 'props', 'pitch', 'tone'];

export const SHELLS = {
  /* ------------------------------------------------------------------ */
  harbor: {
    id: 'harbor',
    label: 'Harbor 港口',
    note:
      '浅色 + 靛海 / 曦金 / 月白 + 宋体标题。**配色与排版规范源自一份内部品牌视觉手册**' +
      '（70/20/10 用色比例、字体分工、字距与行高纪律都照它来），但本壳不带任何公司品牌 ——' +
      '名字、Slogan、Logo 归属都不在这里。视觉照抄，品牌不沾。',
    scheme: 'light',
    name: 'AgentFlow',
    // 不带公司英文名。壳的副标题位留给空 —— 页眉只有产品名，更像工具，不像公司门面。
    subtitle: '',
    // markSvg 是真标记（云 + 帆 + 水线，金色前帆）；mark 只是它加载失败时的字符兜底
    mark: '港',
    markMono: false,
    markSvg: QIANYI_MARK_SVG,
    title: 'AgentFlow · Harbor',
    tagline: '{n} 条真跑过的 AI Agent 工作流 · 可填空 · 可复制 · 可被程序调用',
    hero: {
      line1: '别再从零憋提示词',
      line2Pre: '填参数，',
      em: '直接拿结果',
      line2Post: '',
      ogLead: '填参数 → 提示词自动拼好 → 复制走，或者当场跑一遍',
      lead:
        '每一条都是自己先跑通，才放上来的。填参数，拿到拼好的提示词，' +
        '或者就在这里跑一遍看结果。',
    },
    copy: {
      description:
        '{n} 条真跑过的 AI Agent 工作流，覆盖电商选品、投资分析、内容创作、临床证据、安全审计五类场景。' +
        '每条都能在线填参数、一键复制提示词，或直接跑出结果。',
      audience: '不想每次从零憋提示词的人 —— 以及要把 AI 接进自己系统的人。',
      props: [
        { title: '真跑过', body: '每一条都有真实输入和真实产出，不是理论生成的' },
        { title: '填参数就够', body: '提示词自动拼好，不用自己找哪里要改' },
        { title: '输出有定式', body: '每条都规定输出格式，结果能直接进文档和会议' },
        { title: '能接进系统', body: 'JSON 与 raw.md 端点带 CORS，程序可以直接取走' },
      ],
      pitch: '把提示词做成能交出去的东西。',
      tone: [
        '标题用宋体，正文用黑体，英文辅助行全大写 + 大字距',
        '不用红色做强调 —— 红与绿容易被误读，强调只给曦金',
        '一个画面里金色不超过 10%，超过就从「稳」滑向「促销」',
        '不堆术语，把复杂的事讲清楚',
      ],
    },
    fonts: {
      display: 'Inter, "Source Han Serif SC", "Noto Serif SC", "Songti SC", serif',
      body: 'Inter, "Source Han Sans SC", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
      mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    },
    tokens: {
      // 70% 月白留白 / 20% 靛海结构与文字 / 10% 曦金只给一个点
      bg: '#F4F7FA',
      'bg-soft': '#FFFFFF',
      panel: '#FFFFFF',
      'panel-2': '#EDF2F7',
      line: '#DFE6EE',
      'line-soft': '#E9EEF4',
      text: '#16202B',
      // 手册写的是灰蓝 #6B7A8C，但它落在白底上只有 4.39:1，差一点没过 WCAG AA。
      // 取同色相里能过线的最浅一档（深 2），月白底上 4.20:1。
      'text-dim': '#69788A',
      'text-mute': '#8794A3',
      brand: '#0C2440',
      'brand-2': '#1D4F82',
      'brand-soft': '#6FA8BF',
      accent: '#D9A441',
      'accent-rgb': '217,164,65',
      'brand-rgb': '12,36,64',
      'brand2-rgb': '29,79,130',
      green: '#2F7D4F',
      blue: '#2B5EA8',
      purple: '#6B4BB0',
      cyan: '#1A7F8C',
      'code-text': '#16202B',
      'run-bg': '#EDF2F7',
      'run-text': '#16202B',
      'header-bg': 'rgba(244,247,250,0.88)',
      'shadow-rgb': '12,36,64',
      // 徽章用圆角方形，比圆形更适合做图标
      radius: '6px',
      'radius-sm': '4px',
    },
  },

  /* ------------------------------------------------------------------ */
  harness: {
    id: 'harness',
    label: 'Harness 装配线',
    note: '工程感：冷绿主色 + 深底 + 等宽标题。面向「能把东西接进程序」的人。',
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
    copy: {
      description:
        '{n} 条真跑过的 AI Agent 工作流。填参数生成完整提示词，或直接用 Workers AI 试跑；' +
        '另有带 CORS 的 JSON / raw.md 端点，能被你的程序直接调用。MIT 开源。',
      audience: '把 AI 接进自己系统的人 —— 要的是可调用、可版本化的东西，不是一堆还要手动改的提示词。',
      props: [
        { title: '提示词变成了端点', body: '{n} 条工作流各有 JSON 与 raw.md 地址，带 CORS —— 你的程序不用爬 HTML' },
        { title: '参数是结构化的', body: '连中英两种占位符写法都给出来，够你直接写一个表单生成器' },
        { title: '输出格式是规定好的', body: '结果能进流水线，不用再收拾一遍' },
        { title: '内容只有一个来源', body: 'workflows/**.md —— 加一条工作流 = 加一个文件，不碰代码' },
      ],
      pitch: '把提示词库做成基础设施：填参数、拿 JSON、接进你的流水线。',
      tone: [
        '动词开头，短句。能用数字就不用形容词',
        '不说「赋能」「闭环」「一站式」这类词',
        '不承诺效果，只说做过什么、结果长什么样',
      ],
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
      'accent': '#6ef0b0',
      'accent-rgb': '110,240,176',
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
      '浅色 + 高定橙 + 衬线标题 + 直角。视觉借鉴奢侈品的语言（大留白、细线条、克制色），' +
      '但产品名不用真实奢侈品牌 —— 那是商标问题，不是审美问题。',
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
    copy: {
      description:
        '{n} 条真跑过的 AI Agent 工作流 —— 电商选品、内容创作、持仓诊断、威胁建模。' +
        '每条都带完整提示词、预期输出格式和真实案例，结果可以直接交出去。MIT 开源。',
      audience: '在意产出质量和形式的人 —— 不想研究提示词工程，只想要一份能直接用、能交出去的东西。',
      props: [
        { title: '真跑过，真出过结果', body: '不是「10 个超好用的提示词」那种合集' },
        { title: '填参数就够了', body: '拼好的提示词直接拿走，也可以在这里跑一遍看结果' },
        { title: '规定了输出长什么样', body: '拿到的是能直接交出去的表格和结论，不是还要整理的原料' },
        { title: '克制', body: '一共 {n} 条，不是 {n}00 条。不堆功能' },
      ],
      pitch: '把提示词做成可交付的东西。',
      tone: [
        '少用形容词，不用感叹号',
        '句子可以长一点，别写得像广告',
        '「够用」比「强大」更值得说',
      ],
    },
    // 中文形体优先：Georgia 排前面的话中文会回退成黑体，「高定」就没了。
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
      'accent': '#c25a17',
      'accent-rgb': '194,90,23',
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
    note: 'v1 的橙红 + 深底 + 🦞。留档用 —— 想对比换壳前后效果时切回来看。',
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
    copy: {
      description:
        '{n} 个真跑过的 AI Agent 工作流：电商选品、内容创作、持仓诊断、威胁建模…' +
        '每个都能在线填参数、一键复制提示词，或直接在页面上跑出结果。MIT 开源。',
      audience: '不想每次从零憋提示词的人 —— 找一个贴近自己场景的，改改参数就能用。',
      props: [
        { title: '真跑过、真出过结果', body: '不是理论生成，也不是网上抄的' },
        { title: '填完参数自动拼好', body: '不用自己找哪里要改' },
        { title: '知道会得到什么', body: '每条都给预期输出格式和真实案例' },
        { title: '复制粘贴就能用', body: '不需要技术背景' },
      ],
      pitch: '拿来即用，不用每次从零憋提示词。',
      tone: ['直接、口语化', '可以带点自嘲，不要端着'],
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
      'accent': '#ff6b35',
      'accent-rgb': '255,107,53',
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

export const shellIds = () => Object.keys(SHELLS);

/** 校验：tokens/copy 缺键、id 对不上、scheme 写错都直接抛，不让它静默降级 */
export function assertShellsValid(shells = SHELLS) {
  for (const [key, s] of Object.entries(shells)) {
    if (s.id !== key) throw new Error(`壳 ${key} 的 id 字段是 ${s.id}，对不上`);
    for (const token of REQUIRED_TOKENS) {
      if (!s.tokens?.[token]) throw new Error(`壳 ${key} 缺少 token：${token}`);
    }
    for (const field of REQUIRED_COPY) {
      const v = s.copy?.[field];
      if (v === undefined || (Array.isArray(v) && !v.length)) {
        throw new Error(`壳 ${key} 的 copy 缺少 ${field}（营销壳不能是空的）`);
      }
    }
    for (const [i, prop] of s.copy.props.entries()) {
      if (!prop?.title || !prop?.body) {
        throw new Error(`壳 ${key} 的 copy.props[${i}] 必须是 {title, body}`);
      }
    }
    if (s.markSvg && !s.markSvg.includes('<svg')) {
      throw new Error(`壳 ${key} 的 markSvg 不是一段 SVG`);
    }
    if (!['dark', 'light'].includes(s.scheme)) throw new Error(`壳 ${key} 的 scheme 必须是 dark/light`);
    for (const part of ['hero', 'name', 'mark', 'tagline']) {
      if (!s[part]) throw new Error(`壳 ${key} 缺少 ${part}`);
    }
  }
  if (!shells[DEFAULT_SHELL]) throw new Error(`DEFAULT_SHELL(${DEFAULT_SHELL}) 不在注册表里`);
}

/**
 * 替换文案里的占位符。支持的键见 build-readme.mjs 传给它的 vars。
 * 没替换掉的 `{xxx}` 会被保留（不是静默变成空字符串）—— 方便一眼看出哪里漏了。
 */
export function fillCopy(text, vars) {
  return String(text).replace(/\{([a-z_][a-z0-9_]*)\}/g, (m, key) =>
    vars[key] !== undefined ? String(vars[key]) : m,
  );
}

/** 壳名 → CSS 自定义属性列表（给 Base.astro 注入 <html style>） */
export function shellCssVars(shell) {
  return Object.entries(shell.tokens)
    .map(([k, v]) => `--${k}: ${v};`)
    .join(' ');
}

export function resolveShell(id) {
  return SHELLS[id] ?? SHELLS[DEFAULT_SHELL];
}
