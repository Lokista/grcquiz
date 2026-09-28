// Postęp ścieżki „Bezpieczeństwo IT” — osobno od postępu ścieżki IT Audyt/GRC.
import { SEC_STAGES, SEC_ITEMS } from '../data/secops/index.js';

export const SEC_STORAGE_KEY = 'grcquiz-secops-v1';

export const SEC_RANKS = [
  [0, 'Stażysta SOC'],
  [150, 'Analityk L1'],
  [400, 'Analityk L2'],
  [800, 'Specjalista'],
  [1400, 'Starszy specjalista'],
  [2200, 'Lider bezpieczeństwa'],
  [3500, 'CISO miasta'],
];

export function defaultSecState() {
  return { xp: 0, stages: {}, missed: [], day: null, streak: 0, open: false, gigaBest: 0, examBest: null, answered: 0, correct: 0 };
}

export function loadSec() {
  try {
    const raw = window.localStorage.getItem(SEC_STORAGE_KEY);
    return raw ? { ...defaultSecState(), ...JSON.parse(raw) } : defaultSecState();
  } catch {
    return defaultSecState();
  }
}

export function saveSec(state) {
  try { window.localStorage.setItem(SEC_STORAGE_KEY, JSON.stringify(state)); } catch { /* prywatne okno / brak miejsca */ }
}

function dayStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function touchDay(state) {
  const today = dayStr(new Date());
  if (state.day === today) return state;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return { ...state, day: today, streak: state.day === dayStr(y) ? state.streak + 1 : 1 };
}

export function secRank(xp) {
  let cur = SEC_RANKS[0];
  let next = null;
  SEC_RANKS.forEach((r, i) => {
    if (xp >= r[0]) { cur = r; next = SEC_RANKS[i + 1] || null; }
  });
  const pct = next ? (xp - cur[0]) / (next[0] - cur[0]) : 1;
  return { title: cur[1], next, pct, level: SEC_RANKS.indexOf(cur) + 1 };
}

export function starsFor(pct) {
  if (pct >= 0.95) return 3;
  if (pct >= 0.75) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export function stageUnlocked(state, index) {
  if (state.open || index === 0) return true;
  return (state.stages[SEC_STAGES[index - 1].id]?.stars || 0) >= 1;
}

export function secTotalStars(state) {
  return SEC_STAGES.reduce((sum, s) => sum + (state.stages[s.id]?.stars || 0), 0);
}

export function missedItems(state) {
  return state.missed.map((id) => SEC_ITEMS[id]).filter(Boolean);
}

/** XP za poprawną odpowiedź rośnie z combo (maks. +10). */
export function xpFor(combo) {
  return 10 + Math.min(Math.max(combo - 1, 0), 5) * 2;
}
