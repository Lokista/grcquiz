import { useEffect, useMemo, useState } from 'react';
import {
  Brain, ArrowLeft, CheckCircle2, XCircle, AlertTriangle,
  Sparkles, ChevronRight, Lightbulb, RotateCcw, ShieldCheck, Target, Flame,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { useMission } from '../state/MissionContext.jsx';
import { Card, SectionHeader, TopicBadge, Pill, EmptyState } from '../components/ui.jsx';
import { TOPICS } from '../data/topics.js';
import { SCENARIOS, scenarioById } from '../data/scenarios.js';
import { sfx } from '../utils/juice.js';

const VERDICT = {
  good: { tone: 'good', icon: CheckCircle2, label: 'Wzorcowe', cls: 'border-emerald-500/40 bg-emerald-500/10' },
  mid: { tone: 'warn', icon: AlertTriangle, label: 'Częściowo', cls: 'border-amber-500/40 bg-amber-500/10' },
  bad: { tone: 'bad', icon: XCircle, label: 'Błędne', cls: 'border-rose-500/40 bg-rose-500/10' },
};

export default function ThinkLikeAuditorModule() {
  const { params, go } = useNav();
  const mission = useMission();

  if (mission.active && mission.content?.scenario) {
    return (
      <ScenarioRun
        key={`m-${mission.mission.id}-${params.rerun || 0}`}
        queue={[mission.content.scenario.id]}
        startIndex={0}
        missionMode={mission}
        onExit={() => go('chapter', { topicKey: mission.mission.chapterKey })}
      />
    );
  }
  if (params.mode === 'run') {
    return <ScenarioRun queue={params.queue || []} startIndex={params.startIndex || 0} onExit={() => go('think')} />;
  }
  return <ScenarioList />;
}

function ScenarioList() {
  const { go } = useNav();
  const { state } = useProgress();
  const [topicFilter, setTopicFilter] = useState('all');
  const filtered = useMemo(() => SCENARIOS.filter((s) => topicFilter === 'all' || s.topicKey === topicFilter), [topicFilter]);
  const startAll = () => go('think', { mode: 'run', queue: filtered.map((s) => s.id), startIndex: 0 });

  return (
    <div className="space-y-5 animate-slidein">
      <SectionHeader icon={Brain} title="Myśl jak audytor (swobodny)" subtitle="Sytuacje z audytu — wybierz najlepszą reakcję. W kampanii są to misje z gwiazdkami." />
      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <button onClick={startAll} className="btn-primary"><Sparkles className="h-4 w-4" /> Przejdź wszystkie ({filtered.length})</button>
          <div className="flex flex-wrap gap-1.5 ml-auto">
            <FilterChip active={topicFilter === 'all'} onClick={() => setTopicFilter('all')}>Wszystkie</FilterChip>
            {TOPICS.map((t) => <FilterChip key={t.key} active={topicFilter === t.key} onClick={() => setTopicFilter(t.key)}>{t.label}</FilterChip>)}
          </div>
        </div>
      </Card>
      <div className="space-y-2.5">
        {filtered.map((s) => {
          const rec = state.scenarios[s.id];
          return (
            <button key={s.id} onClick={() => go('think', { mode: 'run', queue: [s.id], startIndex: 0 })} className="group card card-pad text-left w-full hover:ring-1 hover:ring-accent/30 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <TopicBadge topicKey={s.topicKey} />
                    {rec && rec.total > 0 && <Pill tone={rec.correct > 0 ? 'good' : 'bad'}>{rec.correct}/{rec.total} poprawne</Pill>}
                  </div>
                  <div className="font-semibold text-slate-100 group-hover:text-accent-soft transition-colors">{s.title}</div>
                  <div className="mt-1 line-clamp-2 text-sm text-slate-400">{s.situation}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-accent-soft shrink-0" />
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && <EmptyState title="Brak scenariuszy" icon={Brain} />}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return <button onClick={onClick} className={`chip border transition-colors ${active ? 'bg-accent/15 text-accent-soft border-accent/30' : 'bg-ink-700/50 text-slate-300 border-ink-600/60 hover:bg-ink-700'}`}>{children}</button>;
}

function ScenarioRun({ queue, startIndex, onExit, missionMode }) {
  const { recordScenario, removeRetry, recordCombo } = useProgress();
  const [idx, setIdx] = useState(startIndex);
  const [picked, setPicked] = useState(null);
  const [finished, setFinished] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  const s = scenarioById(queue[idx]);

  const advance = () => {
    if (idx + 1 >= queue.length) {
      recordCombo(maxCombo);
      if (missionMode) {
        missionMode.complete(3);
        return;
      }
      setFinished(true);
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
  };

  useEffect(() => {
    if (picked === null) return undefined;
    const t = setTimeout(advance, 500);
    return () => clearTimeout(t);
  }, [picked]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!s) return <Card><EmptyState title="Brak scenariusza" icon={Brain} /><button onClick={onExit} className="btn-ghost mt-3">Wróć</button></Card>;

  const choose = (i) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === s.bestIndex;
    sfx.click();
    setCombo((c) => { const nc = c + 1; setMaxCombo((m) => Math.max(m, nc)); return nc; });
    recordScenario(s.id, correct, s.topicKey);
    setStats((st) => ({ correct: st.correct + (correct ? 1 : 0), total: st.total + 1 }));
    removeRetry('scenario', s.id);
  };

  if (finished) {
    return (
      <div className="space-y-4 animate-slidein">
        <SectionHeader icon={ShieldCheck} title="Podsumowanie" subtitle={`${stats.total} scenariuszy`} />
        <Card className="text-center">
          <div className="text-4xl font-extrabold text-slate-100">{stats.correct} / {stats.total}</div>
          <div className="text-sm text-slate-400 mt-1">poprawnych reakcji</div>
          {maxCombo >= 3 && <div className="mt-2 inline-flex items-center gap-1 text-amber-400 text-sm"><Flame className="h-4 w-4" /> Najlepsze combo: x{maxCombo}</div>}
        </Card>
        <button onClick={onExit} className="btn-primary"><RotateCcw className="h-4 w-4" /> Wróć</button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slidein">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onExit} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200"><ArrowLeft className="h-4 w-4" /> {missionMode ? 'Wróć do świata' : 'Zakończ'}</button>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          {combo >= 2 && <span className="inline-flex items-center gap-1 text-amber-400 font-semibold"><Flame className="h-3.5 w-3.5" /> Combo x{combo}</span>}
          <span>Sytuacja <span className="font-semibold text-slate-200">{idx + 1}</span> / {queue.length}</span>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-700/70"><div className="h-full rounded-full xp-bar transition-all" style={{ width: `${(idx / queue.length) * 100}%` }} /></div>

      {missionMode && <MissionBanner mission={missionMode.mission} hint="Wybierz wzorcową reakcję audytora." />}

      <Card>
        <div className="flex items-center gap-2 mb-3"><Brain className="h-5 w-5 text-accent-soft" /><h1 className="text-lg font-bold text-slate-100">{s.title}</h1></div>
        <div className="rounded-lg border border-ink-700/60 bg-ink-900/40 p-4 text-sm text-slate-200">{s.situation}</div>
      </Card>

      <Card>
        <div className="label mb-3">Wybierz najlepszą reakcję audytora:</div>
        <div className="space-y-2">
          {s.options.map((opt, i) => {
            const v = VERDICT[opt.verdict] || VERDICT.bad;
            const isPicked = picked === i;
            const isBest = i === s.bestIndex;
            let cls = 'border-ink-700/60 bg-ink-850/40 hover:bg-ink-700/40';
            if (picked !== null) {
              if (isBest) cls = 'border-emerald-500/40 bg-emerald-500/10';
              else if (isPicked) cls = v.cls;
              else cls = 'border-ink-700/40 bg-ink-850/20 opacity-60';
            }
            return (
              <button key={i} onClick={() => choose(i)} disabled={picked !== null} className={`flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left text-sm transition-colors ${cls}`}>
                <span className="grid h-6 w-6 place-items-center rounded-full text-xs font-bold bg-ink-700 text-slate-300 shrink-0 mt-0.5">{String.fromCharCode(65 + i)}</span>
                <span className="text-slate-200 flex-1">{opt.text}</span>
                {picked !== null && isBest && <span className="chip bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0"><CheckCircle2 className="h-3 w-3" /> Wzorcowa</span>}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className="mt-4 space-y-3 animate-pop">
            <div className={`rounded-lg border p-3 ${VERDICT[s.options[picked].verdict].cls}`}>
              <div className="flex items-center gap-2 mb-1">
                <Pill tone={VERDICT[s.options[picked].verdict].tone}>{picked === s.bestIndex ? 'Wybrałeś reakcję wzorcową' : `Twoja reakcja: ${VERDICT[s.options[picked].verdict].label}`}</Pill>
                {!missionMode && <span className="text-xs text-slate-400">+8 XP</span>}
              </div>
              <div className="text-sm text-slate-300">{s.options[picked].why}</div>
            </div>
            {picked !== s.bestIndex && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                <div className="flex items-center gap-2 mb-1"><CheckCircle2 className="h-4 w-4 text-emerald-400" /><span className="text-sm font-semibold text-emerald-400">Reakcja wzorcowa:</span></div>
                <div className="text-sm text-slate-200">{s.options[s.bestIndex].text}</div>
                <div className="mt-1.5 text-sm text-slate-300">{s.options[s.bestIndex].why}</div>
              </div>
            )}
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
              <div className="flex items-center gap-2 mb-1"><Lightbulb className="h-4 w-4 text-accent-soft" /><span className="text-sm font-semibold text-accent-soft">Lekcja audytora</span></div>
              <div className="text-sm text-slate-200">{s.auditorLesson}</div>
            </div>
            <p className="text-xs text-accent-soft animate-pulse">Następna sytuacja…</p>
          </div>
        )}
      </Card>
    </div>
  );
}

function MissionBanner({ mission, hint }) {
  return (
    <div className="card card-pad bg-gold/5 border-gold/20 flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-gold/15 text-gold shrink-0"><Target className="h-5 w-5" /></div>
      <div className="min-w-0">
        <div className="text-[0.6875rem] uppercase tracking-wider text-gold">Misja</div>
        <div className="font-semibold text-slate-100 truncate">{mission.title}</div>
        <div className="text-xs text-slate-400">{hint}</div>
      </div>
    </div>
  );
}
