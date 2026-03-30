import { useEffect, useState, useCallback } from 'react';

const rand = (min, max) => Math.random() * (max - min) + min;

const createRipple = (color) => ({
  id: performance.now() + Math.random(),
  x: rand(5, 95),               // 画面上の横位置 (%)
  y: rand(5, 95),               // 画面上の縦位置 (%)
  size: rand(30, 110),          // 初期直径 (px)
  duration: rand(2.8, 5.0),     // アニメーション時間 (s)
  dx: rand(-70, 70),            // 水平ドリフト (px)
  dy: rand(-70, 70),            // 垂直ドリフト (px)
  scale: rand(3.0, 4.5),        // 最終拡大率
  color,
});

export default function RippleBackground({ strokeColor, isRunning }) {
  const [ripples, setRipples] = useState([]);

  // タブが非表示になったら波紋をクリア
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setRipples([]);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // isRunning が true の間、一定間隔で波紋を追加
  useEffect(() => {
    if (!isRunning) return;

    // 開始直後に数個まとめて生成してすぐ画面を賑やかに
    setRipples(() => Array.from({ length: 4 }, () => createRipple(strokeColor)));

    const id = setInterval(() => {
      if (!document.hidden) {
        setRipples((prev) => [...prev, createRipple(strokeColor)]);
      }
    }, 750);

    return () => clearInterval(id);
  }, [isRunning, strokeColor]);

  // アニメーション完了後に該当波紋を除去
  const handleEnd = useCallback((id) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{
        zIndex: 1,
        opacity: isRunning ? 1 : 0,
        transition: isRunning ? 'opacity 1.5s ease-in' : 'opacity 0.6s ease-out',
      }}
    >
      {ripples.map(({ id, x, y, size, duration, dx, dy, scale, color }) => (
        <div
          key={id}
          onAnimationEnd={() => handleEnd(id)}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2,
            borderRadius: '50%',
            border: `1.5px solid ${color}`,
            // CSS カスタムプロパティ経由でキーフレームに値を渡す
            '--dx': `${dx}px`,
            '--dy': `${dy}px`,
            '--scale': scale,
            animation: `ripple-random ${duration}s ease-out forwards`,
          }}
        />
      ))}
    </div>
  );
}
