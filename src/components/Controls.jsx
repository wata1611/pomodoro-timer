export default function Controls({ isRunning, onStartPause, onReset, onSkip, colors, isDark }) {
  return (
    <div className="flex items-center gap-4">
      {/* リセット */}
      <button
        onClick={onReset}
        title="リセット"
        className={[
          'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95',
          isDark
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            : 'bg-white hover:bg-gray-100 text-gray-600 shadow-md',
        ].join(' ')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>

      {/* 開始/一時停止 */}
      <button
        onClick={onStartPause}
        className={[
          'w-20 h-20 rounded-full text-white font-bold text-lg shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center',
          colors.buttonClass,
        ].join(' ')}
      >
        {isRunning ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 ml-1" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>

      {/* スキップ */}
      <button
        onClick={onSkip}
        title="次のフェーズへスキップ"
        className={[
          'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95',
          isDark
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            : 'bg-white hover:bg-gray-100 text-gray-600 shadow-md',
        ].join(' ')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5,4 15,12 5,20" />
          <line x1="19" y1="5" x2="19" y2="19" />
        </svg>
      </button>
    </div>
  );
}
