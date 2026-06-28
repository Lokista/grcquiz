import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Star, ArrowRight, RotateCcw, Map as MapIcon, Lock, Check, X } from 'lucide-react';
import { useNav } from './NavContext.jsx';
import { useProgress } from './ProgressContext.jsx';
import { missionById, resolveMissionContent, nextMission, isMissionUnlocked, CHAPTERS } from '../data/missions.js';
import { MISSION_TYPES } from '../data/missions.js';
import { accent as topicAccent } from '../data/topics.js';
import { burst, sfx } from '../utils/juice.js';

const MissionContext = createContext(null);

export function MissionProvider({ children }) {
  const { params, go } = useNav();
  const { state, recordStars } = useProgress();
  const [overlay, setOverlay] = useState(null); // { mission, stars, isNewBest, gainedXp, next, nextUnlocked }

  const missionId = params.missionId || null;
  const mission = missionId ? missionById(missionId) : null;
  const content = mission ? resolveMissionContent(mission) : null;

  const complete = useCallback((stars) => {
    if (!mission) return;
    const prev = state.stars?.[mission.id] || 0;
    const newStars = Math.max(prev, stars);
    const gainedXp = (newStars - prev) * 5;
    const provisional = { ...(state.stars || {}), [mission.id]: newStars };
    const cIdx = CHAPTERS.findIndex((c) => c.topic.key === mission.chapterKey);
    const next = nextMission(mission);
    const nextUnlocked = next ? isMissionUnlocked(provisional, next, cIdx) : false;
    recordStars(mission.id, stars);
    burst({ stars: newStars });
    if (newStars >= 3) sfx.fanfare(); else sfx.star();
    setOverlay({ mission, stars: newStars, isNewBest: stars > prev, gainedXp, next, nextUnlocked });
  }, [mission, state.stars, recordStars]);

  const close = useCallback(() => setOverlay(null), []);

  const rerun = useCallback(() => {
    if (!mission) return;
    const r = (params.rerun || 0) + 1;
    setOverlay(null);
    go(mission.route.view, { ...mission.route.params, rerun: r });
  }, [mission, params.rerun, go]);

  const goNext = useCallback(() => {
    if (!overlay || !overlay.next) return;
    setOverlay(null);
    go(overlay.next.route.view, overlay.next.route.params);
  }, [overlay, go]);

  const goMap = useCallback(() => { setOverlay(null); go('quest'); }, [go]);

  const api = useMemo(() => ({
    active: !!mission,
    mission,
    content,
    complete,
  }), [mission, content, complete]);

  return (
    <MissionContext.Provider value={api}>
      {children}
      {overlay && (
        <MissionCompleteOverlay
          data={overlay}
          onClose={close}
          onRerun={rerun}
          onNext={goNext}
          onMap={goMap}
        />
      )}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const ctx = useContext(MissionContext);
  if (!ctx) throw new Error('useMission musi być wewnątrz MissionProvider');
  return ctx;
}

function MissionCompleteOverlay({ data, onClose, onRerun, onNext, onMap }) {
  const { mission, stars, isNewBest, gainedXp, next, nextUnlocked } = data;
  const meta = MISSION_TYPES[mission.type] || MISSION_TYPES.lesson;
  const a = topicAccent(mission.chapterKey);

  useEffect(() => {
    if (!next || !nextUnlocked) return undefined;
    const t = setTimeout(onNext, 900);
    return () => clearTimeout(t);
  }, [next, nextUnlocked, onNext]);

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/70 backdrop-blur-sm p-4 animate-pop">
      <div className="card card-pad w-full max-w-md text-center relative">
        <button onClick={onClose} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:text-slate-200 hover:bg-ink-700/60" aria-label="Zamknij">
          <X className="h-4 w-4" />
        </button>
        <div className={`mx-auto mb-3 grid h-14 w-14 place-items-center rounded-xl ${a.bg} ${a.text} ring-1 ${a.ring}`}>
          <meta.icon className="h-7 w-7" />
        </div>
        <div className="text-xs uppercase tracking-wider text-slate-400">{meta.label} ukończony</div>
        <h2 className="mt-1 text-xl font-bold text-slate-100">{mission.title}</h2>

        {/* Stars reveal */}
        <div className="my-6 flex items-center justify-center gap-3">
          {[0, 1, 2].map((i) => {
            const filled = i < stars;
            return (
              <div
                key={i}
                className={`grid h-16 w-16 place-items-center rounded-2xl border transition-all ${filled ? 'border-gold/50 bg-gold/15' : 'border-ink-700/60 bg-ink-900/40'}`}
                style={{ animation: filled ? `pop 200ms ease-out ${i * 80}ms both` : undefined }}
              >
                <Star className={`h-8 w-8 ${filled ? 'fill-gold text-gold' : 'text-slate-700'}`} />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-3 text-sm">
          {isNewBest ? (
            <span className="chip bg-gold/15 text-gold border border-gold/30"><Check className="h-3.5 w-3.5" /> Nowy rekord!</span>
          ) : (
            <span className="chip bg-ink-700/60 text-slate-300 border border-ink-600/60">Najlepszy: {stars}/3 ★</span>
          )}
          <span className="chip bg-accent/15 text-accent-soft border border-accent/30">+{gainedXp} XP</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-2">
          {next && nextUnlocked && (
            <>
              <button onClick={onNext} className="btn-primary">
                Następna misja <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-[11px] text-slate-500">Auto-przejście za chwilę…</p>
            </>
          )}
          {next && !nextUnlocked && (
            <div className="flex items-center justify-center gap-2 rounded-lg border border-ink-700/60 bg-ink-900/40 px-3 py-2 text-xs text-slate-400">
              <Lock className="h-3.5 w-3.5" /> Następna misja odblokuje się po zdobyciu większej liczby gwiazdek
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onRerun} className="btn-ghost">
              <RotateCcw className="h-4 w-4" /> Jeszcze raz
            </button>
            <button onClick={onMap} className="btn-ghost">
              <MapIcon className="h-4 w-4" /> Mapa misji
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
