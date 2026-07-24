import { useMemo, useState } from 'react';
import {
  Scale, ArrowLeft, CheckCircle2, XCircle, RotateCcw, ChevronRight, Lightbulb,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, Pill, scoreTone } from '../components/ui.jsx';
import { POLICY_CASES, GAP_OPTS } from '../data/policyPractice.js';
import { sfx, burst } from '../utils/juice.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PolicyPracticeModule() {
  const { go } = useNav();
  const { recordQuiz } = useProgress();
  const [queue, setQueue] = useState(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState([]);

  const start = () => {
    setQueue(shuffle(POLICY_CASES));
    setIdx(0);
    setPicked(null);
    setRevealed(false);
    setResults([]);
    sfx.whoosh();
  };

  const round = queue && queue !== 'done' ? queue[idx] : null;

  const donePct = useMemo(() => {
    if (queue !== 'done' || results.length === 0) return 0;
    return Math.round((results.filter((r) => r.ok).length / results.length) * 100);
  }, [queue, results]);

  const confirm = () => {
    if (!round || !picked) return;
    const ok = picked === round.correct;
    recordQuiz('controls', ok);
    if (ok) sfx.correct();
    else sfx.wrong();
    setResults((r) => [...r, { id: round.id, ok }]);
    setRevealed(true);
  };

  const next = () => {
    if (!queue || queue === 'done') return;
    if (idx + 1 >= queue.length) {
      const hit = results.filter((r) => r.ok).length;
      if (results.length && hit / results.length >= 0.75) burst({ stars: 2 });
      setQueue('done');
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
    setRevealed(false);
  };

  if (!queue) {
    return (
      <div className="space-y-5 animate-slidein">
        <button type="button" onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" /> Mapa
        </button>
        <SectionHeader
          icon={Scale}
          title="Policy vs practice"
          subtitle="Porównaj kryterium (polityka) z evidence (praktyka) → design / OE / dokumentacja / OK."
        />
        <Card>
          <div className="space-y-2 text-sm text-slate-300 mb-4">
            {GAP_OPTS.map((o) => (
              <div key={o.id}>
                <span className="font-semibold text-slate-200">{o.label}</span>
                <span className="text-slate-400">
                  {' '}
                  —
                  {' '}
                  {o.tip}
                </span>
              </div>
            ))}
          </div>
          <button type="button" className="btn-primary" onClick={start}>
            Start (
            {POLICY_CASES.length}
            )
          </button>
        </Card>
      </div>
    );
  }

  if (queue === 'done') {
    return (
      <div className="space-y-5 animate-slidein">
        <SectionHeader icon={Scale} title="Policy vs practice — wynik" subtitle={`${results.filter((r) => r.ok).length}/${results.length}`} />
        <Pill tone={scoreTone(donePct)}>{donePct}%</Pill>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={start}><RotateCcw className="h-4 w-4" /> Jeszcze raz</button>
          <button type="button" className="btn-ghost" onClick={() => go('quest')}>Mapa</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slidein">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => go('quest')} className="text-sm text-slate-400 hover:text-slate-200 inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Wyjdź
        </button>
        <span className="text-xs text-slate-500">
          {idx + 1}
          {' '}
          /
          {' '}
          {queue.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Polityka / kryterium</div>
          <p className="text-sm text-slate-100">{round.policy}</p>
        </Card>
        <Card>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Praktyka / evidence</div>
          <p className="text-sm text-accent-soft">{round.practice}</p>
        </Card>
      </div>

      <Card>
        <div className="label mb-2">Jaki gap?</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {GAP_OPTS.map((o) => {
            let cls = picked === o.id
              ? 'border-accent/50 bg-accent/15 text-accent-soft'
              : 'border-ink-600/60 text-slate-300 hover:bg-ink-700/40';
            if (revealed) {
              if (o.id === round.correct) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
              else if (o.id === picked && o.id !== round.correct) cls = 'border-rose-500/50 bg-rose-500/10 text-rose-300';
            }
            return (
              <button
                key={o.id}
                type="button"
                disabled={revealed}
                aria-pressed={picked === o.id}
                onClick={() => setPicked(o.id)}
                className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${cls}`}
              >
                <div className="font-semibold inline-flex items-center gap-1.5">
                  {revealed && o.id === round.correct && <CheckCircle2 className="h-4 w-4" />}
                  {revealed && o.id === picked && o.id !== round.correct && <XCircle className="h-4 w-4" />}
                  {o.label}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{o.tip}</div>
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mb-4 flex gap-2 rounded-lg border border-ink-700/50 bg-ink-900/50 p-3 text-sm text-slate-300">
            <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{round.explain}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {!revealed ? (
            <button type="button" className="btn-primary" disabled={!picked} onClick={confirm}>Sprawdź</button>
          ) : (
            <button type="button" className="btn-primary" onClick={next}>
              Dalej
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
