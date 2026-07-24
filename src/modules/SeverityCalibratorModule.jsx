import { useMemo, useState } from 'react';
import {
  Gauge, ArrowLeft, CheckCircle2, XCircle, RotateCcw, ChevronRight, Lightbulb,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, Pill, scoreTone } from '../components/ui.jsx';
import { SEVERITY_CASES, SEVERITY_OPTIONS, SEVERITY_RULES } from '../data/severityCalibrator.js';
import { sfx, burst } from '../utils/juice.js';

function flattenRounds() {
  const rounds = [];
  SEVERITY_CASES.forEach((c) => {
    c.contexts.forEach((ctx) => {
      rounds.push({
        id: `${c.id}-${ctx.id}`,
        fact: c.fact,
        ...ctx,
      });
    });
  });
  return rounds;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TONE = { High: 'bad', Medium: 'warn', Low: 'good' };

export default function SeverityCalibratorModule() {
  const { go } = useNav();
  const { recordQuiz } = useProgress();
  const [queue, setQueue] = useState(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState([]);

  const start = () => {
    setQueue(shuffle(flattenRounds()));
    setIdx(0);
    setPicked(null);
    setRevealed(false);
    setResults([]);
    sfx.whoosh();
  };

  const round = queue?.[idx];

  const confirm = () => {
    if (!round || !picked) return;
    const ok = picked === round.correct;
    recordQuiz('basics', ok);
    if (ok) sfx.correct();
    else sfx.wrong();
    setResults((r) => [...r, { id: round.id, ok, correct: round.correct, picked }]);
    setRevealed(true);
  };

  const next = () => {
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

  const donePct = useMemo(() => {
    if (queue !== 'done' || results.length === 0) return 0;
    return Math.round((results.filter((r) => r.ok).length / results.length) * 100);
  }, [queue, results]);

  if (!queue) {
    return (
      <div className="space-y-5 animate-slidein">
        <button type="button" onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" /> Mapa
        </button>
        <SectionHeader
          icon={Gauge}
          title="Severity calibrator"
          subtitle="Ten sam fakt, inny kontekst (bank / SaaS / lab) → High, Medium albo Low."
        />
        <Card>
          <div className="space-y-2 text-sm text-slate-300 mb-4">
            {Object.entries(SEVERITY_RULES).map(([k, v]) => (
              <div key={k}>
                <Pill tone={TONE[k]}>{k}</Pill>
                <span className="ml-2 text-slate-400">{v}</span>
              </div>
            ))}
          </div>
          <button type="button" className="btn-primary" onClick={start}>
            Start ({flattenRounds().length} rund)
          </button>
        </Card>
      </div>
    );
  }

  if (queue === 'done') {
    return (
      <div className="space-y-5 animate-slidein">
        <SectionHeader icon={Gauge} title="Severity — wynik" subtitle={`${results.filter((r) => r.ok).length}/${results.length}`} />
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
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Fakt (ten sam gap)</div>
        <p className="font-medium text-slate-100 mb-3">{round.fact}</p>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Kontekst</div>
        <p className="text-sm text-accent-soft mb-4">{round.label}</p>

        <div className="label mb-2">Severity?</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {SEVERITY_OPTIONS.map((s) => {
            let cls = picked === s
              ? 'border-accent/50 bg-accent/15 text-accent-soft'
              : 'border-ink-600/60 text-slate-300 hover:bg-ink-700/40';
            if (revealed) {
              if (s === round.correct) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
              else if (s === picked && s !== round.correct) cls = 'border-rose-500/50 bg-rose-500/10 text-rose-300';
            }
            return (
              <button
                key={s}
                type="button"
                disabled={revealed}
                onClick={() => setPicked(s)}
                className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${cls}`}
              >
                {s}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="rounded-lg border border-ink-600/60 bg-ink-900/40 p-3 text-sm text-slate-300 mb-4 flex gap-2">
            {picked === round.correct
              ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              : <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />}
            <div>
              <div className="font-semibold text-slate-100 mb-1 flex items-center gap-2">
                Wzorzec: <Pill tone={TONE[round.correct]}>{round.correct}</Pill>
              </div>
              <div className="flex gap-1 text-slate-400">
                <Lightbulb className="h-3.5 w-3.5 text-accent-soft shrink-0 mt-0.5" />
                <span>{round.why}</span>
              </div>
            </div>
          </div>
        )}

        {!revealed ? (
          <button type="button" className="btn-primary" disabled={!picked} onClick={confirm}>Sprawdź</button>
        ) : (
          <button type="button" className="btn-primary" onClick={next}>
            {idx + 1 >= queue.length ? 'Podsumowanie' : 'Dalej'}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </Card>
    </div>
  );
}
