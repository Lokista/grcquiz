import confetti from 'canvas-confetti';

// --- Mute (persystencja) ---
const MUTE_KEY = 'auditor-quest-mute';
let muted = (() => {
  if (typeof window === 'undefined') return false;
  try { return window.localStorage.getItem(MUTE_KEY) === '1'; } catch { return false; }
})();

export function isMuted() { return muted; }
export function setMuted(v) {
  muted = !!v;
  if (typeof window !== 'undefined') {
    try { window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch { /* ignore */ }
  }
}

// --- Dźwięk (WebAudio, bez assetów) ---
let audioCtx = null;
function ctx() {
  if (muted) return null;
  if (typeof window === 'undefined') return null;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  } catch { return null; }
}

function tone(freq, start, dur, type = 'sine', gain = 0.08) {
  const ac = ctx();
  if (!ac) return;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, ac.currentTime + start);
  g.gain.setValueAtTime(0, ac.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  o.connect(g); g.connect(ac.destination);
  o.start(ac.currentTime + start);
  o.stop(ac.currentTime + start + dur + 0.02);
}

export const sfx = {
  correct() { tone(660, 0, 0.12, 'triangle', 0.07); tone(990, 0.08, 0.14, 'triangle', 0.05); },
  wrong() { tone(200, 0, 0.18, 'sawtooth', 0.05); },
  click() { tone(440, 0, 0.05, 'square', 0.03); },
  star() { tone(880, 0, 0.1, 'triangle', 0.06); tone(1320, 0.09, 0.12, 'triangle', 0.05); },
  levelup() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.16, 'triangle', 0.06)); },
  whoosh() { tone(300, 0, 0.2, 'sine', 0.04); },
  fanfare() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.08, 0.22, 'triangle', 0.07)); },
};

// --- Confetti ---
export function burst(opts = {}) {
  if (typeof window === 'undefined') return;
  const { stars = 3 } = opts;
  const c = confetti;
  if (stars >= 3) {
    // big celebration
    c({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#22c55e', '#eab308', '#60a5fa'], ...opts });
    setTimeout(() => c({ particleCount: 60, spread: 100, origin: { y: 0.5 }, angle: 60, colors: ['#22c55e', '#eab308'] }), 150);
    setTimeout(() => c({ particleCount: 60, spread: 100, origin: { y: 0.5 }, angle: 120, colors: ['#3b82f6', '#60a5fa'] }), 250);
  } else if (stars === 2) {
    c({ particleCount: 50, spread: 60, origin: { y: 0.6 }, colors: ['#3b82f6', '#60a5fa', '#eab308'], ...opts });
  } else {
    c({ particleCount: 25, spread: 45, origin: { y: 0.65 }, colors: ['#64748b', '#94a3b8'], ...opts });
  }
}

export function levelUpBurst() {
  if (typeof window === 'undefined') return;
  confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 }, colors: ['#eab308', '#3b82f6', '#22c55e'] });
  sfx.levelup();
}

// --- Pływające "+XP" ---
export function spawnFloat(text, x, y) {
  if (typeof window === 'undefined') return;
  const el = document.createElement('div');
  el.textContent = text;
  el.style.cssText = [
    'position:fixed', `left:${x}px`, `top:${y}px`,
    'z-index:9999', 'pointer-events:none', 'font-weight:800',
    'font-size:18px', 'color:#60a5fa', 'text-shadow:0 2px 8px rgba(59,130,246,0.5)',
    'transform:translate(-50%,-50%)', 'transition:transform 900ms ease-out, opacity 900ms ease-out',
    'opacity:1', 'will-change:transform,opacity',
  ].join(';');
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.transform = 'translate(-50%, -140%)';
    el.style.opacity = '0';
  });
  setTimeout(() => el.remove(), 950);
}
