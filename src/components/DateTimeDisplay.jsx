import { useState, useEffect } from 'react';

export default function DateTimeDisplay({ isDark }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const dateStr = now.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  const timeStr = now.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="flex flex-col items-center gap-0.5">
      <p className={`text-xs tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        {dateStr}
      </p>
      <p className={`text-2xl font-mono font-semibold tabular-nums ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {timeStr}
      </p>
    </div>
  );
}
