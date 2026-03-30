const RADIUS = 110;
const STROKE = 10;
const CENTER = 140;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CircularProgress({ progress, colors, isDark, children }) {
  const offset = CIRCUMFERENCE * (1 - Math.min(1, Math.max(0, progress)));

  return (
    <div className="relative" style={{ width: 280, height: 280 }}>
      <svg
        width="280"
        height="280"
        viewBox="0 0 280 280"
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* 背景トラック */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={isDark ? colors.trackDark : colors.trackLight}
          strokeWidth={STROKE}
        />
        {/* プログレス円弧 */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>

      {/* 中央コンテンツ */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
