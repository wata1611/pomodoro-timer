import { PHASES } from '../utils/constants';

export default function SessionDots({ pomodoroCount, phase, isRunning, isDark }) {
  const completedInCycle = pomodoroCount % 4;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-3">
        {[0, 1, 2, 3].map((i) => {
          const isCompleted = i < completedInCycle;
          const isCurrent = i === completedInCycle && phase === PHASES.WORK;

          return (
            <div
              key={i}
              className={[
                'w-4 h-4 rounded-full transition-all duration-500',
                isCompleted
                  ? 'bg-red-500 scale-110'
                  : isCurrent && isRunning
                  ? 'bg-red-400 animate-pulse'
                  : isCurrent
                  ? 'bg-red-400/50'
                  : isDark
                  ? 'bg-gray-600'
                  : 'bg-gray-300',
              ].join(' ')}
            />
          );
        })}
      </div>
      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        {completedInCycle} / 4 セッション
      </p>
    </div>
  );
}
