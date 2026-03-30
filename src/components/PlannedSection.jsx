import { useState, useEffect } from 'react';
import { calcTotalMinutes } from '../utils/constants';

const MAX_POMODOROS = 20;
const MIN_POMODOROS = 1;

const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}分`;
  if (m === 0) return `${h}時間`;
  return `${h}時間${m}分`;
};

const formatEndTime = (date) =>
  date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function PlannedSection({ isDark, isPlannedMode, remainingPlanned, plannedTotal, longBreakMin, plannedEndTimeStr, workColors, onStart, onCancel }) {
  const [count, setCount] = useState(4);
  const [endTimeStr, setEndTimeStr] = useState('');

  // カウントまたは長休憩時間が変わるたびに終了予定時刻を再計算
  useEffect(() => {
    const totalMin = calcTotalMinutes(count, longBreakMin);
    const end = new Date(Date.now() + totalMin * 60 * 1000);
    setEndTimeStr(formatEndTime(end));
  }, [count, longBreakMin]);

  const change = (delta) =>
    setCount((c) => Math.min(MAX_POMODOROS, Math.max(MIN_POMODOROS, c + delta)));

  // 実行中の表示
  if (isPlannedMode) {
    return (
      <div
        className={[
          'w-full max-w-sm rounded-2xl p-5 flex flex-col gap-3 shadow-lg',
          isDark ? 'bg-gray-800/80' : 'bg-white/80',
        ].join(' ')}
      >
        <div className="flex justify-between items-center">
          <h2 className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            計画実行中
          </h2>
          <button
            onClick={onCancel}
            className={`text-xs px-3 py-1 rounded-full transition-all ${
              isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
            }`}
          >
            キャンセル
          </button>
        </div>

        {/* 終了予定時刻 */}
        <div className={`rounded-xl p-3 text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <p className={`text-xs mb-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>終了予定</p>
          <p className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
            {plannedEndTimeStr}
          </p>
        </div>

        {/* 進捗バー */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              残り <span className="font-bold" style={{ color: workColors.stroke }}>{remainingPlanned}</span> / {plannedTotal} ポモドーロ
            </span>
            <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
              完了: {plannedTotal - remainingPlanned}
            </span>
          </div>
          <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((plannedTotal - remainingPlanned) / plannedTotal) * 100}%`,
                backgroundColor: workColors.stroke,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 設定UI
  return (
    <div
      className={[
        'w-full max-w-sm rounded-2xl p-5 flex flex-col gap-4 shadow-lg',
        isDark ? 'bg-gray-800/80' : 'bg-white/80',
      ].join(' ')}
    >
      <h2 className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        目標ポモドーロ数を設定して開始
      </h2>

      {/* カウンター */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => change(-1)}
          disabled={count <= MIN_POMODOROS}
          className={[
            'w-10 h-10 rounded-full text-xl font-bold transition-all active:scale-95',
            count <= MIN_POMODOROS
              ? isDark ? 'bg-gray-700 text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              : isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
          ].join(' ')}
        >
          −
        </button>

        <div className="text-center">
          <span className={`text-4xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {count}
          </span>
          <span className={`ml-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            ポモドーロ
          </span>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {formatDuration(calcTotalMinutes(count, longBreakMin))}
          </p>
        </div>

        <button
          onClick={() => change(1)}
          disabled={count >= MAX_POMODOROS}
          className={[
            'w-10 h-10 rounded-full text-xl font-bold transition-all active:scale-95',
            count >= MAX_POMODOROS
              ? isDark ? 'bg-gray-700 text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              : isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
          ].join(' ')}
        >
          ＋
        </button>
      </div>

      {/* 終了予定時刻 */}
      <div className={`rounded-xl p-3 text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
        <p className={`text-xs mb-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>終了予定</p>
        <p className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
          {endTimeStr}
        </p>
      </div>

      {/* 開始ボタン */}
      <button
        onClick={() => onStart(count)}
        className={`w-full py-3 rounded-xl text-white font-bold transition-all active:scale-95 shadow-md ${workColors.buttonClass}`}
      >
        この計画で開始
      </button>
    </div>
  );
}
