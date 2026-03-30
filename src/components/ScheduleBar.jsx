import { useMemo } from 'react';
import { PHASES, calcTotalMinutes } from '../utils/constants';

const SEGMENT_LABELS = {
  work:       '作業',
  shortBreak: '小休憩',
  longBreak:  '長休憩',
};

const buildSegments = (n, longBreakMin) => {
  const segs = [];
  for (let i = 1; i <= n; i++) {
    segs.push({ type: 'work', minutes: 25 });
    if (i < n) {
      segs.push(
        i % 4 === 0
          ? { type: 'longBreak', minutes: longBreakMin }
          : { type: 'shortBreak', minutes: 5 }
      );
    }
  }
  return segs;
};

export default function ScheduleBar({
  plannedTotal,
  longBreakMin,
  remainingPlanned,
  phase,
  timeLeft,
  isDark,
  themeColors,
}) {
  // テーマカラーからセグメントスタイルを動的生成
  const segmentStyle = {
    work:       { color: themeColors[PHASES.WORK].stroke,        label: SEGMENT_LABELS.work },
    shortBreak: { color: themeColors[PHASES.SHORT_BREAK].stroke,  label: SEGMENT_LABELS.shortBreak },
    longBreak:  { color: themeColors[PHASES.LONG_BREAK].stroke,   label: SEGMENT_LABELS.longBreak },
  };
  const segments = useMemo(
    () => buildSegments(plannedTotal, longBreakMin),
    [plannedTotal, longBreakMin]
  );

  const totalMinutes = useMemo(
    () => calcTotalMinutes(plannedTotal, longBreakMin),
    [plannedTotal, longBreakMin]
  );
  const totalSeconds = totalMinutes * 60;

  // 経過秒数を計算
  const completedInPlan = plannedTotal - remainingPlanned;

  let elapsedSeconds = 0;
  for (let i = 1; i <= completedInPlan; i++) {
    elapsedSeconds += 25 * 60;
    if (i < plannedTotal) {
      elapsedSeconds += i % 4 === 0 ? longBreakMin * 60 : 5 * 60;
    }
  }

  // 現在フェーズ内の経過時間を加算
  if (phase === PHASES.WORK)        elapsedSeconds += 25 * 60 - timeLeft;
  else if (phase === PHASES.SHORT_BREAK) elapsedSeconds += 5 * 60 - timeLeft;
  else if (phase === PHASES.LONG_BREAK)  elapsedSeconds += longBreakMin * 60 - timeLeft;

  const arrowPct = totalSeconds > 0
    ? Math.min(100, (elapsedSeconds / totalSeconds) * 100)
    : 0;

  return (
    <div
      className={[
        'w-full max-w-sm rounded-2xl p-5 shadow-lg',
        isDark ? 'bg-gray-800/80' : 'bg-white/80',
      ].join(' ')}
    >
      <p className={`text-xs font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        スケジュール
      </p>

      {/* バー + 矢印 */}
      <div className="relative">
        {/* 矢印マーカー */}
        <div
          className="absolute -top-0.5 z-10 pointer-events-none"
          style={{
            left: `${arrowPct}%`,
            transform: 'translateX(-50%)',
            transition: 'left 1s linear',
          }}
        >
          <span
            className={`text-xs leading-none font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`}
          >
            ▼
          </span>
        </div>

        {/* 積み上げセグメントバー */}
        <div className="flex h-5 mt-4 rounded-md overflow-hidden gap-px">
          {segments.map((seg, i) => (
            <div
              key={i}
              title={`${segmentStyle[seg.type].label} (${seg.minutes}分)`}
              style={{
                backgroundColor: segmentStyle[seg.type].color,
                width: `${(seg.minutes / totalMinutes) * 100}%`,
                minWidth: '2px',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* 凡例 & 合計時間 */}
      <div className="flex justify-between items-center mt-2.5">
        <div className="flex gap-3">
          {Object.entries(segmentStyle).map(([type, { color, label }]) => (
            <div key={type} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
            </div>
          ))}
        </div>
        <span className={`text-xs tabular-nums ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          計 {totalMinutes}分
        </span>
      </div>
    </div>
  );
}
