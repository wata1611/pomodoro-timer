export const PHASES = {
  WORK: 'work',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak',
};

export const DURATIONS = {
  [PHASES.WORK]: 25 * 60,
  [PHASES.SHORT_BREAK]: 5 * 60,
  [PHASES.LONG_BREAK]: 15 * 60,
};

export const PHASE_LABELS = {
  [PHASES.WORK]: '作業中',
  [PHASES.SHORT_BREAK]: '小休憩',
  [PHASES.LONG_BREAK]: '長休憩',
};

export const PHASE_MESSAGES = {
  [PHASES.WORK]: { title: '作業開始！', body: '25分間集中しましょう 💪' },
  [PHASES.SHORT_BREAK]: { title: 'お疲れ様でした！', body: '5分間休憩しましょう ☕' },
  [PHASES.LONG_BREAK]: { title: 'よく頑張りました！', body: '15分間しっかり休憩しましょう 🌿' },
};

/**
 * N ポモドーロを実行するのに必要な総分数を計算する。
 * セッション間の休憩ルール: 4の倍数番目の後 → 長休憩、それ以外 → 短休憩(5分)
 * 最後のセッション後は休憩なし。
 */
export const calcTotalMinutes = (n, longBreakMin = 15) => {
  if (n <= 0) return 0;
  const longBreaks = Math.floor((n - 1) / 4);
  const shortBreaks = (n - 1) - longBreaks;
  return n * 25 + shortBreaks * 5 + longBreaks * longBreakMin;
};

/**
 * 青系カラーテーマ 3種
 * 各テーマは PHASES キーをそのまま持ち、PHASE_COLORS の drop-in replacement として使用する
 */
export const BLUE_THEMES = [
  // ── 0: オーシャン ─────────────────────────────
  {
    name: 'オーシャン',
    preview: '#3b82f6',
    [PHASES.WORK]: {
      stroke: '#3b82f6',
      trackDark: '#1e3a5f',
      trackLight: '#bfdbfe',
      buttonClass: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
      textClass: 'text-blue-400',
      bgClass: 'from-blue-900/40 to-slate-900/60',
      bgLightClass: 'from-blue-50 to-sky-50',
    },
    [PHASES.SHORT_BREAK]: {
      stroke: '#38bdf8',
      trackDark: '#0c2840',
      trackLight: '#e0f2fe',
      buttonClass: 'bg-sky-400 hover:bg-sky-500 active:bg-sky-600',
      textClass: 'text-sky-400',
      bgClass: 'from-sky-900/40 to-blue-900/30',
      bgLightClass: 'from-sky-50 to-blue-50',
    },
    [PHASES.LONG_BREAK]: {
      stroke: '#818cf8',
      trackDark: '#1e1b4b',
      trackLight: '#e0e7ff',
      buttonClass: 'bg-indigo-400 hover:bg-indigo-500 active:bg-indigo-600',
      textClass: 'text-indigo-400',
      bgClass: 'from-indigo-900/40 to-blue-900/30',
      bgLightClass: 'from-indigo-50 to-blue-50',
    },
  },

  // ── 1: ミッドナイト ───────────────────────────
  {
    name: 'ミッドナイト',
    preview: '#6366f1',
    [PHASES.WORK]: {
      stroke: '#6366f1',
      trackDark: '#1e1b4b',
      trackLight: '#e0e7ff',
      buttonClass: 'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700',
      textClass: 'text-indigo-400',
      bgClass: 'from-indigo-900/50 to-slate-900/70',
      bgLightClass: 'from-indigo-50 to-slate-100',
    },
    [PHASES.SHORT_BREAK]: {
      stroke: '#a78bfa',
      trackDark: '#2d1b69',
      trackLight: '#ede9fe',
      buttonClass: 'bg-violet-400 hover:bg-violet-500 active:bg-violet-600',
      textClass: 'text-violet-400',
      bgClass: 'from-violet-900/40 to-indigo-900/40',
      bgLightClass: 'from-violet-50 to-indigo-50',
    },
    [PHASES.LONG_BREAK]: {
      stroke: '#60a5fa',
      trackDark: '#1e3a5f',
      trackLight: '#dbeafe',
      buttonClass: 'bg-blue-400 hover:bg-blue-500 active:bg-blue-600',
      textClass: 'text-blue-400',
      bgClass: 'from-blue-900/40 to-indigo-900/40',
      bgLightClass: 'from-blue-50 to-indigo-50',
    },
  },

  // ── 2: アークティック ─────────────────────────
  {
    name: 'アークティック',
    preview: '#22d3ee',
    [PHASES.WORK]: {
      stroke: '#22d3ee',
      trackDark: '#0a2a30',
      trackLight: '#cffafe',
      buttonClass: 'bg-cyan-400 hover:bg-cyan-500 active:bg-cyan-600',
      textClass: 'text-cyan-400',
      bgClass: 'from-cyan-900/40 to-slate-900/60',
      bgLightClass: 'from-cyan-50 to-sky-50',
    },
    [PHASES.SHORT_BREAK]: {
      stroke: '#2dd4bf',
      trackDark: '#0a2420',
      trackLight: '#ccfbf1',
      buttonClass: 'bg-teal-400 hover:bg-teal-500 active:bg-teal-600',
      textClass: 'text-teal-400',
      bgClass: 'from-teal-900/40 to-cyan-900/30',
      bgLightClass: 'from-teal-50 to-cyan-50',
    },
    [PHASES.LONG_BREAK]: {
      stroke: '#0ea5e9',
      trackDark: '#0c2840',
      trackLight: '#e0f2fe',
      buttonClass: 'bg-sky-500 hover:bg-sky-600 active:bg-sky-700',
      textClass: 'text-sky-400',
      bgClass: 'from-sky-900/40 to-cyan-900/30',
      bgLightClass: 'from-sky-50 to-cyan-50',
    },
  },
];
