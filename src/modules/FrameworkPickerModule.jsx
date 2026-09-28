import { useMemo, useState } from 'react';
import {
  Library, ArrowLeft, CheckCircle2, XCircle, RotateCcw, ChevronRight, Lightbulb,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, Pill, scoreTone } from '../components/ui.jsx';
import { FRAMEWORKS, FRAMEWORK_CASES } from '../data/frameworkPicker.js';
import { sfx, burst } from '../utils/juice.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FrameworkPickerModule() {
  const { go } = useNav();
  const { recordQuiz } = useProgress();
  const [queue, setQueue] = useState(null);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState([]);

  const start = () => {
    setQueue(shuffle(FRAMEWORK_CASES));
    setIdx(0);
    setSelected([]);
    setRevealed(false);
    setScores([]);
    sfx.whoosh();
  };

  const cs = queue?.[idx];

  const toggle = (id) => {
    if (revealed) return;
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const scoreCase = (primaryIds, picked) => {
    const need = new Set(primaryIds);
    let hit = 0;
    let wrong = 0;
    picked.forEach((id) => {
      if (need.has(id)) hit += 1;
      else wrong += 1;
    });
    const miss = primaryIds.length - hit;
    const raw = primaryIds.length === 0 ? 0 : Math.round(((hit - wrong * 0.4 - miss * 0.3) / primaryIds.length) * 100);
    return Math.max(0, Math.min(100, raw));
  };

  const reveal = () => {
    if (!cs || selected.length === 0) return;
    const pct = scoreCase(cs.primaryIds, selected);
    recordQuiz('frameworks', pct >= 60);
    if (pct >= 60) sfx.correct();
    else sfx.wrong();
    setScores((s) => [...s, { id: cs.id, pct }]);
    setRevealed(true);
  };

  const next = () => {
    if (idx + 1 >= queue.length) {
      const avg = scores.length
        ? Math.round(scores.reduce((a, x) => a + x.pct, 0) / scores.length)
        : 0;
      if (avg >= 70) burst({ stars: 2 });
      setQueue('done');
      return;
    }
    setIdx((i) => i + 1);
    setSelected([]);
    setRevealed(false);
  };

  const avgDone = useMemo(() => {
    if (queue !== 'done' || scores.length === 0) return 0;
    return Math.round(scores.reduce((a, x) => a + x.pct, 0) / scores.length);
  }, [queue, scores]);

  if (!queue) {
    return (
      <div className="space-y-5 animate-slidein">
        <button type="button" onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" /> Mapa
        </button>
        <SectionHeader
          icon={Library}
          title="Framework picker"
          subtitle="Ten sam fakt → które frameworki ze ściągi mapujesz? ISO ≠ NIST ≠ CIS ≠ NIS2."
        />
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {FRAMEWORKS.map((f) => (
              <div key={f.id} className="rounded-lg border border-ink-600/60 bg-ink-900/40 p-2.5">
                <div className="text-sm font-semibold text-slate-100">{f.label}</div>
                <div className="text-[0.6875rem] text-slate-500 mt-0.5">{f.oneLiner}</div>
              </div>
            ))}
          </div>
          <button type="button" className="btn-primary" onClick={start}>
            Start mapowania ({FRAMEWORK_CASES.length} faktów)
          </button>
        </Card>
      </div>
    );
  }

  if (queue === 'done') {
    return (
      <div className="space-y-5 animate-slidein">
        <SectionHeader icon={Library} title="Framework picker — wynik" subtitle={`Średnia ${avgDone}%`} />
        <Pill tone={scoreTone(avgDone)}>{avgDone}%</Pill>
        <div className="space-y-2">
          {scores.map((s) => {
            const c = FRAMEWORK_CASES.find((x) => x.id === s.id);
            return (
              <Card key={s.id} className="flex items-center justify-between gap-2">
                <span className="text-sm text-slate-300 line-clamp-1">{c?.fact}</span>
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

  const primary = new Set(cs.primaryIds);

  return (
    <div className="space-y-4 animate-slidein">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => go('quest')} className="text-sm text-slate-400 hover:text-slate-200 inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Wyjdź
        </button>
        <span className="text-xs text-slate-500">{idx + 1} / {queue.length}</span>
      </div>

      <Card>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Fakt</div>
        <p className="font-medium text-slate-100 mb-2">{cs.fact}</p>
        <p className="text-sm text-slate-400 mb-4">{cs.prompt}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FRAMEWORKS.map((f) => {
            const on = selected.includes(f.id);
            let ring = on ? 'border-accent/50 bg-accent/10' : 'border-ink-600/60 hover:bg-ink-700/30';
            if (revealed) {
              if (primary.has(f.id) && on) ring = 'border-emerald-500/50 bg-emerald-500/10';
              else if (primary.has(f.id) && !on) ring = 'border-amber-500/40 bg-amber-500/5';
              else if (!primary.has(f.id) && on) ring = 'border-rose-500/40 bg-rose-500/10';
              else ring = 'border-ink-700/50 opacity-60';
            }
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => toggle(f.id)}
                className={`rounded-lg border p-3 text-left transition-colors ${ring}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-slate-100">{f.label}</span>
                  {revealed && primary.has(f.id) && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                  {revealed && !primary.has(f.id) && on && <XCircle className="h-4 w-4 text-rose-400 shrink-0" />}
                </div>
                <div className="text-[0.6875rem] text-slate-500 mt-1">{f.oneLiner}</div>
                {revealed && cs.explain[f.id] && (
                  <div className="mt-2 text-xs text-slate-400 flex gap-1">
                    <Lightbulb className="h-3 w-3 text-accent-soft shrink-0 mt-0.5" />
                    <span>{cs.explain[f.id]}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {!revealed ? (
            <button type="button" className="btn-primary" disabled={selected.length === 0} onClick={reveal}>
              Sprawdź mapowanie
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={next}>
              {idx + 1 >= queue.length ? 'Podsumowanie' : 'Następny fakt'}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
