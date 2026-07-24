import { useMemo, useState } from 'react';
import {
  FileCheck2, ArrowLeft, RotateCcw, ChevronRight, Lightbulb,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, Pill, scoreTone } from '../components/ui.jsx';
import {
  SOA_CASES, SOA_DECISIONS, scoreSoa, soaJustifyOptions,
} from '../data/soaApplicability.js';
import { sfx, burst } from '../utils/juice.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SoaApplicabilityModule() {
  const { go } = useNav();
  const { recordQuiz } = useProgress();
  const [queue, setQueue] = useState(null);
  const [idx, setIdx] = useState(0);
  const [decision, setDecision] = useState(null);
  const [justifyId, setJustifyId] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [last, setLast] = useState(null);
  const [results, setResults] = useState([]);

  const start = () => {
    setQueue(
      shuffle(SOA_CASES).map((c) => ({
        ...c,
        justifies: shuffle(soaJustifyOptions(c)),
      })),
    );
    setIdx(0);
    setDecision(null);
    setJustifyId(null);
    setRevealed(false);
    setLast(null);
    setResults([]);
    sfx.whoosh();
  };

  const item = queue && queue !== 'done' ? queue[idx] : null;

  const donePct = useMemo(() => {
    if (queue !== 'done' || results.length === 0) return 0;
    return Math.round(results.reduce((a, r) => a + r.pct, 0) / results.length);
  }, [queue, results]);

  const confirm = () => {
    if (!item || !decision || !justifyId) return;
    const sc = scoreSoa(item, decision, justifyId);
    recordQuiz('frameworks', sc.pct >= 50);
    if (sc.perfect) sfx.correct();
    else sfx.wrong();
    setLast(sc);
    setResults((r) => [...r, { id: item.id, pct: sc.pct }]);
    setRevealed(true);
  };

  const next = () => {
    if (!queue || queue === 'done') return;
    if (idx + 1 >= queue.length) {
      const avg = results.length
        ? results.reduce((a, r) => a + r.pct, 0) / results.length
        : 0;
      if (avg >= 70) burst({ stars: 2 });
      setQueue('done');
      return;
    }
    setIdx((i) => i + 1);
    setDecision(null);
    setJustifyId(null);
    setRevealed(false);
    setLast(null);
  };

  if (!queue) {
    return (
      <div className="space-y-5 animate-slidein">
        <button type="button" onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" /> Mapa
        </button>
        <SectionHeader
          icon={FileCheck2}
          title="SoA applicability"
          subtitle="ISO 27001 Statement of Applicability: Include / Exclude + uzasadnienie."
        />
        <Card>
          <p className="text-sm text-slate-400 mb-4">
            Exclude bez justification = red flag na audycie certyfikującym.
            {' '}
            {SOA_CASES.length}
            {' '}
            kontroli Annex A (uproszczone ID).
          </p>
          <button type="button" className="btn-primary" onClick={start}>Start</button>
        </Card>
      </div>
    );
  }

  if (queue === 'done') {
    return (
      <div className="space-y-5 animate-slidein">
        <SectionHeader icon={FileCheck2} title="SoA — wynik" subtitle={`Średnia ${donePct}%`} />
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
        <span className="text-xs text-slate-500">{idx + 1} / {queue.length}</span>
      </div>

      <Card>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Kontrola</div>
        <p className="text-sm font-semibold text-slate-100 mb-3">{item.control}</p>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Kontekst ISMS</div>
        <p className="text-sm text-accent-soft mb-4">{item.context}</p>

        <div className="label mb-2">Decyzja SoA</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {SOA_DECISIONS.map((d) => {
            let cls = decision === d.id
              ? 'border-accent/50 bg-accent/15 text-accent-soft'
              : 'border-ink-600/60 text-slate-300 hover:bg-ink-700/40';
            if (revealed) {
              if (d.id === item.correct) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
              else if (d.id === decision && d.id !== item.correct) cls = 'border-rose-500/40 bg-rose-500/10 text-rose-300';
            }
            return (
              <button
                key={d.id}
                type="button"
                disabled={revealed}
                aria-pressed={decision === d.id}
                onClick={() => setDecision(d.id)}
                className={`rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${cls}`}
              >
                <div className="font-semibold">{d.label}</div>
                <div className="text-xs text-slate-500">{d.tip}</div>
              </button>
            );
          })}
        </div>

        <div className="label mb-2">Najlepsze uzasadnienie</div>
        <div className="space-y-2 mb-4">
          {item.justifies.map((j) => {
            let cls = justifyId === j.id
              ? 'border-accent/50 bg-accent/15 text-slate-100'
              : 'border-ink-700/60 bg-ink-900/40 text-slate-300 hover:border-ink-500';
            if (revealed) {
              if (j.good && j.id.startsWith('ok')) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100';
              else if (justifyId === j.id && !j.good) cls = 'border-rose-500/50 bg-rose-500/10 text-rose-100';
            }
            return (
              <button
                key={j.id}
                type="button"
                disabled={revealed}
                aria-pressed={justifyId === j.id}
                onClick={() => setJustifyId(j.id)}
                className={`w-full text-left rounded-lg border px-3 py-2.5 text-sm transition-colors ${cls}`}
              >
                {j.label}
              </button>
            );
          })}
        </div>

        {revealed && last && (
          <div className="mb-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              <Pill tone={scoreTone(last.pct)}>{last.pct}%</Pill>
              <Pill tone={last.decOk ? 'good' : 'bad'}>Decyzja</Pill>
              <Pill tone={last.justifyOk ? 'good' : 'bad'}>Uzasadnienie</Pill>
            </div>
            <div className="flex gap-2 rounded-lg border border-ink-700/50 bg-ink-900/50 p-3 text-sm text-slate-300">
              <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{item.explain}</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {!revealed ? (
            <button type="button" className="btn-primary" disabled={!decision || !justifyId} onClick={confirm}>
              Sprawdź
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={next}>
              Dalej <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
