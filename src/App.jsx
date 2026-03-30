import { useState, useEffect, useRef, useCallback } from 'react';
import CircularProgress from './components/CircularProgress';
import Controls from './components/Controls';
import SessionDots from './components/SessionDots';
import ThemeToggle from './components/ThemeToggle';
import DateTimeDisplay from './components/DateTimeDisplay';
import PlannedSection from './components/PlannedSection';
import ScheduleBar from './components/ScheduleBar';
import RippleBackground from './components/RippleBackground';
import ThemePicker from './components/ThemePicker';
import {
  PHASES,
  DURATIONS,
  PHASE_LABELS,
  PHASE_MESSAGES,
  BLUE_THEMES,
  calcTotalMinutes,
} from './utils/constants';
import { playWorkComplete, playBreakComplete, playPlanComplete, resumeAudioContext } from './utils/sound';
import { requestPermission, notify } from './utils/notification';

const formatTime = (seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
};

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [themeIndex, setThemeIndex] = useState(0);
  const [phase, setPhase] = useState(PHASES.WORK);
  const [timeLeft, setTimeLeft] = useState(DURATIONS[PHASES.WORK]);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  // 長休憩時間 (15 or 30 分)
  const [longBreakMin, setLongBreakMin] = useState(15);

  // 計画モード
  const [plannedTotal, setPlannedTotal] = useState(0);
  const [remainingPlanned, setRemainingPlanned] = useState(0);
  const isPlannedMode = remainingPlanned > 0;

  // ブラウザタブのタイトルを更新
  useEffect(() => {
    const label = PHASE_LABELS[phase];
    document.title = `${formatTime(timeLeft)} - ${label} | Pomodoro`;
  }, [timeLeft, phase]);

  // 通知許可リクエスト
  useEffect(() => {
    requestPermission();
  }, []);

  // ref で最新値を参照（useCallback 内で使うため）
  const phaseRef = useRef(phase);
  const pomodoroCountRef = useRef(pomodoroCount);
  const remainingPlannedRef = useRef(remainingPlanned);
  const plannedTotalRef = useRef(plannedTotal);
  const longBreakMinRef = useRef(longBreakMin);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { pomodoroCountRef.current = pomodoroCount; }, [pomodoroCount]);
  useEffect(() => { remainingPlannedRef.current = remainingPlanned; }, [remainingPlanned]);
  useEffect(() => { plannedTotalRef.current = plannedTotal; }, [plannedTotal]);
  useEffect(() => { longBreakMinRef.current = longBreakMin; }, [longBreakMin]);

  const advancePhase = useCallback(() => {
    const currentPhase = phaseRef.current;
    const currentCount = pomodoroCountRef.current;
    const remaining = remainingPlannedRef.current;
    const planned = remaining > 0; // 計画モード中か

    if (currentPhase === PHASES.WORK) {
      const newCount = currentCount + 1;
      setPomodoroCount(newCount);

      if (planned) {
        const newRemaining = remaining - 1;
        setRemainingPlanned(newRemaining);

        if (newRemaining === 0) {
          // 計画完了！（専用ファンファーレを再生）
          playPlanComplete();
          notify('全ポモドーロ完了！', `お疲れ様でした 🎉 ${plannedTotalRef.current}ポモドーロ達成！`);
          setPhase(PHASES.WORK);
          setTimeLeft(DURATIONS[PHASES.WORK]);
          setIsRunning(false);
          return;
        }
      }

      // 通常の作業完了音
      playWorkComplete();

      // 次の休憩へ
      const nextPhase = newCount % 4 === 0 ? PHASES.LONG_BREAK : PHASES.SHORT_BREAK;
      notify(PHASE_MESSAGES[nextPhase].title, PHASE_MESSAGES[nextPhase].body);
      setPhase(nextPhase);
      const nextDuration = nextPhase === PHASES.LONG_BREAK
        ? longBreakMinRef.current * 60
        : DURATIONS[nextPhase];
      setTimeLeft(nextDuration);
      // 常に自動スタート
      setIsRunning(true);
    } else {
      // 休憩完了 → 作業へ
      playBreakComplete();
      notify(PHASE_MESSAGES[PHASES.WORK].title, PHASE_MESSAGES[PHASES.WORK].body);
      setPhase(PHASES.WORK);
      setTimeLeft(DURATIONS[PHASES.WORK]);
      // 常に自動スタート
      setIsRunning(true);
    }
  }, []);

  // タイマー本体
  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          advancePhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, advancePhase]);

  const handleStartPause = () => {
    resumeAudioContext();
    setIsRunning((v) => !v);
  };

  const handleReset = () => {
    setIsRunning(false);
    const dur = phase === PHASES.LONG_BREAK ? longBreakMin * 60 : DURATIONS[phase];
    setTimeLeft(dur);
  };

  const handleSkip = () => {
    setIsRunning(false);
    advancePhase();
  };

  // 計画モード開始
  const handleStartPlanned = (count) => {
    resumeAudioContext();
    setIsRunning(false);
    setPhase(PHASES.WORK);
    setTimeLeft(DURATIONS[PHASES.WORK]);
    setPlannedTotal(count);
    setRemainingPlanned(count);
    // 次のレンダリング後にタイマーを開始
    setTimeout(() => setIsRunning(true), 50);
  };

  // 計画モードキャンセル
  const handleCancelPlanned = () => {
    setIsRunning(false);
    setRemainingPlanned(0);
    setPlannedTotal(0);
  };

  const totalDuration = phase === PHASES.LONG_BREAK ? longBreakMin * 60 : DURATIONS[phase];
  const progress = 1 - timeLeft / totalDuration;
  const colors = BLUE_THEMES[themeIndex][phase];

  // 計画モード実行中の終了予定時刻（毎秒 timeLeft が変わるたびに再計算）
  let plannedEndTimeStr = '';
  if (isPlannedMode) {
    const completedInPlan = plannedTotal - remainingPlanned;
    let elapsed = 0;
    for (let i = 1; i <= completedInPlan; i++) {
      elapsed += 25 * 60;
      if (i < plannedTotal) {
        elapsed += i % 4 === 0 ? longBreakMin * 60 : 5 * 60;
      }
    }
    if (phase === PHASES.WORK)             elapsed += 25 * 60 - timeLeft;
    else if (phase === PHASES.SHORT_BREAK) elapsed += 5 * 60 - timeLeft;
    else if (phase === PHASES.LONG_BREAK)  elapsed += longBreakMin * 60 - timeLeft;

    const totalSec = calcTotalMinutes(plannedTotal, longBreakMin) * 60;
    const end = new Date(Date.now() + (totalSec - elapsed) * 1000);
    plannedEndTimeStr = end.toLocaleString('ja-JP', {
      year: 'numeric', month: 'long', day: 'numeric',
      weekday: 'short', hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      {/* z-0: 背景グラデーション */}
      <div
        className={[
          'fixed inset-0 z-0 bg-gradient-to-br transition-colors duration-500',
          isDark ? `bg-gray-900 ${colors.bgClass}` : `bg-gray-50 ${colors.bgLightClass}`,
        ].join(' ')}
      />

      {/* z-[1]: 波紋エフェクト */}
      <RippleBackground strokeColor={colors.stroke} isRunning={isRunning} />

      {/* z-[2]: UIコンテンツ */}
      <div className="relative z-[2] min-h-screen flex flex-col items-center justify-center p-6 gap-4">
        {/* ヘッダー */}
        <div className="w-full max-w-sm flex justify-between items-center">
          <h1 className={`text-xl font-bold tracking-wide ${isDark ? 'text-white' : 'text-gray-800'}`}>
            💠 Pomodoro Timer
          </h1>
          <div className="flex items-center gap-3">
            <ThemePicker
              themes={BLUE_THEMES}
              currentIndex={themeIndex}
              onSelect={setThemeIndex}
              isDark={isDark}
            />
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark((v) => !v)} />
          </div>
        </div>

        {/* 日付・時刻 */}
        <DateTimeDisplay isDark={isDark} />

        {/* メインカード */}
        <div
          className={[
            'w-full max-w-sm rounded-3xl p-8 flex flex-col items-center gap-8 shadow-2xl',
            isDark ? 'bg-gray-800/80 backdrop-blur' : 'bg-white/80 backdrop-blur',
          ].join(' ')}
        >
          {/* フェーズタブ */}
          <div className={`flex gap-1 rounded-full p-1 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {Object.values(PHASES).map((p) => (
              <button
                key={p}
                onClick={() => {
                  if (p === phase) return;
                  setIsRunning(false);
                  setRemainingPlanned(0);
                  setPlannedTotal(0);
                  setPhase(p);
                  const dur = p === PHASES.LONG_BREAK ? longBreakMin * 60 : DURATIONS[p];
                  setTimeLeft(dur);
                }}
                className={[
                  'px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200',
                  phase === p
                    ? `text-white ${BLUE_THEMES[themeIndex][p].buttonClass.split(' ')[0]}`
                    : isDark
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-500 hover:text-gray-700',
                ].join(' ')}
              >
                {PHASE_LABELS[p]}
              </button>
            ))}
          </div>

          {/* 円形プログレス */}
          <CircularProgress progress={progress} colors={colors} isDark={isDark}>
            <div className="flex flex-col items-center gap-1">
              <span
                className={[
                  'font-mono font-bold tabular-nums leading-none',
                  isDark ? 'text-white' : 'text-gray-800',
                ].join(' ')}
                style={{ fontSize: '3.5rem' }}
              >
                {formatTime(timeLeft)}
              </span>
              <span className={`text-sm font-medium ${colors.textClass}`}>
                {PHASE_LABELS[phase]}
              </span>
              {isPlannedMode && (
                <span className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  残り {remainingPlanned} / {plannedTotal}
                </span>
              )}
            </div>
          </CircularProgress>

          {/* 長休憩時間トグル */}
          <div className="flex flex-col items-center gap-1.5">
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>長休憩の時間</p>
            <div className={`flex rounded-full p-1 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {[15, 30].map((min) => (
                <button
                  key={min}
                  onClick={() => {
                    setLongBreakMin(min);
                    if (phase === PHASES.LONG_BREAK) {
                      setIsRunning(false);
                      setTimeLeft(min * 60);
                    }
                  }}
                  className={[
                    'px-4 py-1 rounded-full text-xs font-semibold transition-all duration-200',
                    longBreakMin === min
                      ? 'bg-blue-500 text-white'
                      : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700',
                  ].join(' ')}
                >
                  {min}分
                </button>
              ))}
            </div>
          </div>

          {/* セッションドット */}
          <SessionDots
            pomodoroCount={pomodoroCount}
            phase={phase}
            isRunning={isRunning}
            isDark={isDark}
          />

          {/* コントロール */}
          <Controls
            isRunning={isRunning}
            onStartPause={handleStartPause}
            onReset={handleReset}
            onSkip={handleSkip}
            colors={colors}
            isDark={isDark}
          />
        </div>

        {/* スケジュールバー（計画モード時のみ） */}
        {isPlannedMode && (
          <ScheduleBar
            plannedTotal={plannedTotal}
            longBreakMin={longBreakMin}
            remainingPlanned={remainingPlanned}
            phase={phase}
            timeLeft={timeLeft}
            isDark={isDark}
            themeColors={BLUE_THEMES[themeIndex]}
          />
        )}

        {/* 目標設定セクション */}
        <PlannedSection
          isDark={isDark}
          isPlannedMode={isPlannedMode}
          remainingPlanned={remainingPlanned}
          plannedTotal={plannedTotal}
          longBreakMin={longBreakMin}
          plannedEndTimeStr={plannedEndTimeStr}
          workColors={BLUE_THEMES[themeIndex][PHASES.WORK]}
          onStart={handleStartPlanned}
          onCancel={handleCancelPlanned}
        />

        {/* 合計カウンター */}
        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          今日の完了ポモドーロ: <span className={`font-bold ${colors.textClass}`}>{pomodoroCount}</span>
        </p>
      </div>
    </div>
  );
}
