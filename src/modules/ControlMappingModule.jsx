import { useMemo, useState } from 'react';
import {
  GitBranchPlus, ArrowLeft, CheckCircle2, XCircle, RotateCcw, ChevronRight, Lightbulb,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, Pill, scoreTone } from '../components/ui.jsx';
import { CONTROL_MAP_CASES, scoreControlMapping } from '../data/controlMapping.js';
import { sfx, burst } from '../utils/juice.js';

function toggleIn(list, id) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

function PoolButton({ item, active, revealed, isCorrect, onClick, kind }) {
  let cls = 'w-full text-left rounded-lg border px-3 py-2 text-sm transition-colors ';
  if (revealed && isCorrect) cls += 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100';
  else if (revealed && active && !isCorrect) cls += 'border-rose-500/50 bg-rose-500/10 text-rose-100';
  else if (active) cls += 'border-accent/50 bg-accent/10 text-slate-100';
  else cls += 'border-ink-700/60 bg-ink-900/40 text-slate-300 hover:border-ink-500';

  return (
    <button type="button" disabled={revealed} onClick={onClick} className={cls}>
      <span className="inline-flex items-start gap-2">
        {revealed && isCorrect && <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />}
        {revealed && active && !isCorrect && <XCircle className="h-4 w-4 mt-0.5 shrink-0" />}
        <span>
          <span className="text-[10px] uppercase tracking-wide text-slate-500 mr-1.5">{kind}</span>
          {item.label}
        </span>
      </span>
    </button>
  );
}

export default function ControlMappingModule() {
  const { go } = useNav();
  const { recordQuiz } = useProgress();
  const [idx, setIdx] = useState(null);
  const [tests, setTests] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [lastScore, setLastScore] = useState(null);
  const [scores, setScores] = useState([]);

  const item = idx !== null && idx !== 'done' ? CONTROL_MAP_CASES[idx] : null;

  const start = () => {
    setIdx(0);
    setTests([]);
    setEvidence([]);
    setRevealed(false);
    setLastScore(null);
    setScores([]);
    sfx.whoosh();
  };

  const reveal = () => {
    if (!item || (tests.length === 0 && evidence.length === 0)) return;
    const sc = scoreControlMapping(item, tests, evidence);
    recordQuiz('controls', sc.pct >= 60);
    if (sc.pct >= 60) sfx.correct();
    else sfx.wrong();
    setLastScore(sc);
    setScores((s) => [...s, { id: item.id, pct: sc.pct }]);
    setRevealed(true);
  };

  const next = () => {
    if (idx + 1 >= CONTROL_MAP_CASES.length) {
      const avg = scores.length
        ? Math.round(scores.reduce((a, x) => a + x.pct, 0) / scores.length)
        : 0;
      if (avg >= 70) burst({ stars: 2 });
      setIdx('done');
      return;
    }
    setIdx((i) => i + 1);
    setTests([]);
    setEvidence([]);
    setRevealed(false);
    setLastScore(null);
  };

  const avgDone = useMemo(() => {
    if (idx !== 'done' || scores.length === 0) return 0;
    return Math.round(scores.reduce((a, x) => a + x.pct, 0) / scores.length);
  }, [idx, scores]);

  const needT = useMemo(() => new Set(item?.correctTests || []), [item]);
  const needE = useMemo(() => new Set(item?.correctEvidence || []), [item]);

  if (idx === null) {
    return (
      <div className="space-y-5 animate-slidein">
        <button type="button" onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" /> Mapa
        </button>
        <SectionHeader
          icon={GitBranchPlus}
          title="Control → test → evidence"
          subtitle="Do kontroli ITGC przypisz właściwe testy i PBC. Dystraktory są celowo „prawdziwe, ale nie te”."
        />
        <Card>
          <p className="text-sm text-slate-400 mb-4">
            Klasyczny schemat rozmowy: jak przetestujesz kontrolę i czego poprosisz.
            {CONTROL_MAP_CASES.length} kontroli (Access, Change, JOML, Ops, Privileged, Backup).
          </p>
          <button type="button" className="btn-primary" onClick={start}>
            Start ({CONTROL_MAP_CASES.length} mapowania)
          </button>
        </Card>
      </div>
    );
  }

  if (idx === 'done') {
    return (
      <div className="space-y-5 animate-slidein">
        <SectionHeader icon={GitBranchPlus} title="Mapping — wynik" subtitle={`Średnia ${avgDone}%`} />
        <Pill tone={scoreTone(avgDone)}>{avgDone}%</Pill>
        <div className="space-y-2">
          {scores.map((s) => {
            const c = CONTROL_MAP_CASES.find((x) => x.id === s.id);
            return (
              <Card key={s.id} className="flex items-center justify-between gap-2">
                <span className="text-sm text-slate-300">{c?.title}</span>
                <Pill tone={scoreTone(s.pct)}>{s.pct}%</Pill>
              </Card>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={start}><RotateCcw className="h-4 w-4" /> Jeszcze raz</button>
          <button type="button" className="btn-ghost" onClick={() => go('quest')}>Mapa</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slidein">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button type="button" onClick={() => setIdx(null)} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" /> Wyjście
        </button>
        <Pill tone="neutral">{idx + 1}/{CONTROL_MAP_CASES.length}</Pill>
      </div>

      <SectionHeader icon={GitBranchPlus} title={item.title} subtitle={item.domain} />

      <Card>
        <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">Kontrola</div>
        <p className="text-sm text-slate-100">{item.control.label}</p>
        <p className="mt-2 text-xs text-slate-500">Zaznacz wszystkie właściwe testy i evidence (klik = toggle).</p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <div className="text-sm font-semibold text-slate-200 mb-2">Testy audytowe</div>
          <div className="space-y-2">
            {item.tests.map((t) => (
              <PoolButton
                key={t.id}
                item={t}
                kind="test"
                active={tests.includes(t.id)}
                revealed={revealed}
                isCorrect={needT.has(t.id)}
                onClick={() => setTests((prev) => toggleIn(prev, t.id))}
              />
            ))}
          </div>
        </Card>
        <Card>
          <div className="text-sm font-semibold text-slate-200 mb-2">Evidence / PBC</div>
          <div className="space-y-2">
            {item.evidence.map((e) => (
              <PoolButton
                key={e.id}
                item={e}
                kind="pbc"
                active={evidence.includes(e.id)}
                revealed={revealed}
                isCorrect={needE.has(e.id)}
                onClick={() => setEvidence((prev) => toggleIn(prev, e.id))}
              />
            ))}
          </div>
        </Card>
      </div>

      {revealed && lastScore && (
        <Card>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Pill tone={scoreTone(lastScore.pct)}>{lastScore.pct}%</Pill>
            <Pill tone={lastScore.testsOk ? 'good' : 'bad'}>Testy {lastScore.testsOk ? 'OK' : 'luki'}</Pill>
            <Pill tone={lastScore.evidenceOk ? 'good' : 'bad'}>Evidence {lastScore.evidenceOk ? 'OK' : 'luki'}</Pill>
          </div>
          <div className="flex gap-2 text-sm text-slate-300">
            <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{item.explain}</span>
          </div>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {!revealed ? (
          <button
            type="button"
            className="btn-primary"
            disabled={tests.length === 0 && evidence.length === 0}
            onClick={reveal}
          >
            Sprawdź mapowanie
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={next}>
            Dalej <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
