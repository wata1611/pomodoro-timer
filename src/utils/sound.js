let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
};

const playTone = (ctx, freq, startTime, duration, volume = 0.3) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration);
};

// 作業完了: 上昇音 (C-E-G)
export const playWorkComplete = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playTone(ctx, 523.25, now, 0.35);       // C5
    playTone(ctx, 659.25, now + 0.18, 0.35); // E5
    playTone(ctx, 783.99, now + 0.36, 0.5);  // G5
  } catch (e) {
    console.warn('Sound error:', e);
  }
};

// 休憩完了: 下降音 (G-E-C)
export const playBreakComplete = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playTone(ctx, 783.99, now, 0.35);        // G5
    playTone(ctx, 659.25, now + 0.18, 0.35); // E5
    playTone(ctx, 523.25, now + 0.36, 0.5);  // C5
  } catch (e) {
    console.warn('Sound error:', e);
  }
};

// 計画完了ファンファーレ: C-E-G-C6 上昇 → G5-C6 余韻
export const playPlanComplete = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playTone(ctx, 523.25, now,        0.30, 0.30); // C5
    playTone(ctx, 659.25, now + 0.15, 0.30, 0.32); // E5
    playTone(ctx, 783.99, now + 0.30, 0.30, 0.34); // G5
    playTone(ctx, 1046.5, now + 0.45, 0.55, 0.36); // C6 (ひと息長め)
    playTone(ctx, 783.99, now + 0.70, 0.30, 0.25); // G5 (余韻1)
    playTone(ctx, 1046.5, now + 0.90, 0.80, 0.28); // C6 (余韻2・長め)
  } catch (e) {
    console.warn('Sound error:', e);
  }
};

// AudioContext を再開 (ユーザーインタラクション後に呼ぶ)
export const resumeAudioContext = () => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
  } catch (e) {
    // ignore
  }
};
