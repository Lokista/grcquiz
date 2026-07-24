import { useMemo, useState } from 'react';
import {
  Dices, ArrowLeft, CheckCircle2, XCircle, RotateCcw, ChevronRight, Lightbulb,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, Pill, scoreTone } from '../components/ui.jsx';
import { SAMPLING_CASES } from '../data/samplingDrill.js';
import { sfx, burst } from '../utils/juice.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SamplingDrillModule() {
  const { go } = useNav();
  const { recordQuiz } = useProgress();
  const [queue, setQueue] = useState(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState([]);

  const start = () => {
    setQueue(
      shuffle(SAMPLING_CASES).map((c) => ({
        ...c,
        options: shuffle(c.options),
      })),
    );
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
    recordQuiz('tools', ok);
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
          icon={Dices}
          title="Sampling drill"
          subtitle="100% vs próba, bias, rozszerzanie, populacja, atrybuty — decyzje jak w fieldwork."
        />
        <Card>
          <p className="text-sm text-slate-400 mb-4">
            Na rozmowie liczy się uzasadnienie metody, nie magiczna liczba „25”.
            {' '}
            {SAMPLING_CASES.length}
            {' '}
            case’ów.
          </p>
          <button type="button" className="btn-primary" onClick={start}>
            Start (
            {SAMPLING_CASES.length}
            )
          </button>
        </Card>
      </div>
    );
  }

  if (queue === 'done') {
    return (
      <div className="space-y-5 animate-slidein">
        <SectionHeader icon={Dices} title="Sampling — wynik" subtitle={`${results.filter((r) => r.ok).length}/${results.length}`} />
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
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Scenariusz</div>
        <p className="text-sm text-accent-soft mb-3">{round.scenario}</p>
        <p className="text-sm font-medium text-slate-100 mb-3">{round.question}</p>

        <div className="space-y-2 mb-4">
          {round.options.map((o) => {
            let cls = 'w-full text-left rounded-lg border px-3 py-2.5 text-sm transition-colors ';
            if (revealed && o.id === round.correct) cls += 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100';
            else if (revealed && o.id === picked && o.id !== round.correct) cls += 'border-rose-500/50 bg-rose-500/10 text-rose-100';
            else if (picked === o.id) cls += 'border-accent/50 bg-accent/10 text-slate-100';
            else cls += 'border-ink-700/60 bg-ink-900/40 text-slate-300 hover:border-ink-500';
            return (
              <button key={o.id} type="button" disabled={revealed} onClick={() => setPicked(o.id)} className={cls}>
                <span className="inline-flex items-start gap-2">
                  {revealed && o.id === round.correct && <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />}
                  {revealed && o.id === picked && o.id !== round.correct && <XCircle className="h-4 w-4 mt-0.5 shrink-0" />}
                  <span>{o.label}</span>
                </span>
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
              Dalej <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
