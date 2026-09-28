import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { loadSec, saveSec, touchDay, xpFor, starsFor } from './secops.js';

const SecopsContext = createContext(null);

export function SecopsProvider({ children }) {
  const [state, setState] = useState(() => loadSec());

  const update = useCallback((fn) => {
    setState((prev) => {
      const next = fn(prev);
      saveSec(next);
      return next;
    });
  }, []);

  const startSession = useCallback(() => update((s) => touchDay(s)), [update]);

  const api = useMemo(() => ({
    state,
    startSession,
    /** Zapisuje odpowiedź; zwraca zdobyte XP. */
    answer: (itemId, ok, combo) => {
      const gain = ok ? xpFor(combo) : 0;
      update((s) => ({
        ...s,
        xp: s.xp + gain,
        answered: s.answered + 1,
        correct: s.correct + (ok ? 1 : 0),
        missed: ok ? s.missed.filter((id) => id !== itemId) : s.missed.includes(itemId) ? s.missed : [...s.missed, itemId],
      }));
      return gain;
    },
    /** Kończy etap; zwraca bonus XP za nowe gwiazdki. */
    finishStage: (stageId, pct) => {
      const stars = starsFor(pct);
      const prev = state.stages[stageId] || { stars: 0, best: 0 };
      const bonus = stars > prev.stars ? (stars - prev.stars) * 15 : 0;
      update((s) => ({
        ...s,
        xp: s.xp + bonus,
        stages: { ...s.stages, [stageId]: { stars: Math.max(prev.stars, stars), best: Math.max(prev.best || 0, pct) } },
      }));
      return { stars, bonus };
    },
    recordGiga: (score) => update((s) => ({ ...s, gigaBest: Math.max(s.gigaBest || 0, score) })),
    recordExam: (pct) => update((s) => ({ ...s, examBest: Math.max(s.examBest ?? 0, pct) })),
    toggleOpen: () => update((s) => ({ ...s, open: !s.open })),
  }), [state, update, startSession]);

  return <SecopsContext.Provider value={api}>{children}</SecopsContext.Provider>;
}

export function useSecops() {
  const ctx = useContext(SecopsContext);
  if (!ctx) throw new Error('useSecops musi być wewnątrz SecopsProvider');
  return ctx;
}
