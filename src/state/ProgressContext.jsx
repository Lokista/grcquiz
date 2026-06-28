import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Trophy } from 'lucide-react';
import * as P from './progress.js';
import * as Sel from './selectors.js';
import { checkAchievements, achievementById } from '../data/achievements.js';
import { levelUpBurst, burst, sfx } from '../utils/juice.js';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [state, setState] = useState(P.defaultState);
  const [toasts, setToasts] = useState([]);
  const hydrated = useRef(false);
  const prevLevel = useRef(1);

  useEffect(() => {
    const loaded = P.load();
    setState(loaded);
    prevLevel.current = P.levelFromXp(loaded.xp);
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (hydrated.current) P.save(state);
  }, [state]);

  const pushToast = useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((list) => [...list, { id, ...t }]);
    setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 4000);
  }, []);

  // Detekcja awansu poziomu
  useEffect(() => {
    if (!hydrated.current) return;
    const lvl = P.levelFromXp(state.xp);
    if (lvl > prevLevel.current) {
      levelUpBurst();
      pushToast({ title: `Awans na poziom ${lvl}!`, desc: P.levelTitle(lvl), tone: 'gold' });
    }
    prevLevel.current = lvl;
  }, [state.xp, pushToast]);

  // Detekcja osiągnięć
  useEffect(() => {
    if (!hydrated.current) return;
    const stats = Sel.buildAchievementStats(state);
    const newly = checkAchievements(state, stats);
    if (newly.length > 0) {
      setState((s) => P.unlockAchievements(s, newly));
      newly.forEach((id) => {
        const a = achievementById(id);
        if (a) {
          burst({ stars: 2 });
          sfx.star();
          pushToast({ title: `Osiągnięcie: ${a.title}`, desc: a.desc, tone: 'gold', icon: a.icon });
        }
      });
    }
  }, [state, pushToast]);

  const apply = useCallback((fn) => setState((prev) => fn(prev)), []);

  const api = useMemo(() => ({
    state,
    apply,
    toasts,
    pushToast,
    reset: () => apply(() => P.reset()),
    // akcje domenowe (nauka)
    recordLessonDone: (topicKey, lessonId) => apply((s) => P.recordLessonDone(s, topicKey, lessonId)),
    recordQuiz: (topicKey, isCorrect) => apply((s) => P.recordQuiz(s, topicKey, isCorrect)),
    recordFlashcard: (cardId, rating, topicKey) => apply((s) => P.recordFlashcard(s, cardId, rating, topicKey)),
    recordInterview: (qId, covered, total, topicKey) => apply((s) => P.recordInterview(s, qId, covered, total, topicKey)),
    recordCase: (caseId, correctCount, totalSub, topicKey) => apply((s) => P.recordCase(s, caseId, correctCount, totalSub, topicKey)),
    recordScenario: (scenarioId, isCorrect, topicKey) => apply((s) => P.recordScenario(s, scenarioId, isCorrect, topicKey)),
    pushRetry: (item) => apply((s) => P.pushRetry(s, item)),
    removeRetry: (type, id) => apply((s) => P.removeRetry(s, type, id)),
    clearRetry: () => apply((s) => P.clearRetry(s)),
    // warstwa gry
    recordStars: (missionId, stars) => apply((s) => P.recordStars(s, missionId, stars)),
    recordCombo: (combo) => apply((s) => P.recordCombo(s, combo)),
    recordDaily: (score) => apply((s) => P.recordDaily(s, score)),
    // selektory
    levelInfo: () => P.levelProgress(state.xp),
    topicMastery: (key, counts) => P.topicMastery(state, key, counts),
    isDailyAvailable: () => P.isDailyAvailable(state),
    isDailyDoneToday: () => P.isDailyDoneToday(state),
  }), [state, apply, toasts, pushToast]);

  return (
    <ProgressContext.Provider value={api}>
      {children}
      <Toaster toasts={toasts} />
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress musi być wewnątrz ProgressProvider');
  return ctx;
}

function Toaster({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 z-[10000] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const Icon = t.icon || Trophy;
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-gold/30 bg-ink-850/95 px-4 py-3 shadow-card animate-slidein backdrop-blur max-w-xs"
          >
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/15 text-gold shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-100">{t.title}</div>
              {t.desc && <div className="text-xs text-slate-400 mt-0.5">{t.desc}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
