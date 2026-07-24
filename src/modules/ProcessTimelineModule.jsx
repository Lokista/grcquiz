import { useMemo, useState } from 'react';
import {
  ListOrdered, ArrowLeft, CheckCircle2, XCircle, RotateCcw, ChevronRight, Lightbulb,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, Pill, scoreTone } from '../components/ui.jsx';
import { TIMELINE_CASES, scoreTimelineOrder } from '../data/processTimeline.js';
import { sfx, burst } from '../utils/juice.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ProcessTimelineModule() {
  const { go } = useNav();
  const { recordQuiz } = useProgress();
  const [queue, setQueue] = useState(null);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState('order'); // order | gap | done-case
  const [sequence, setSequence] = useState([]);
  const [displayOrder, setDisplayOrder] = useState([]);
  const [gapPick, setGapPick] = useState(null);
  const [orderRevealed, setOrderRevealed] = useState(false);
  const [gapRevealed, setGapRevealed] = useState(false);
  const [orderOk, setOrderOk] = useState(false);
  const [scores, setScores] = useState([]);

  const start = () => {
    const q = shuffle(TIMELINE_CASES);
    setQueue(q);
    setIdx(0);
    prepareCase(q[0]);
    setScores([]);
    sfx.whoosh();
  };

  const prepareCase = (item) => {
    const n = item.steps.length;
    setDisplayOrder(shuffle([...Array(n).keys()]));
    setSequence([]);
    setGapPick(null);
    setPhase('order');
    setOrderRevealed(false);
    setGapRevealed(false);
    setOrderOk(false);
  };

  const item = queue && queue !== 'done' ? queue[idx] : null;

  const toggleStep = (stepIdx) => {
    if (orderRevealed || phase !== 'order') return;
    const pos = sequence.indexOf(stepIdx);
    if (pos >= 0) {
      setSequence(sequence.slice(0, pos));
      return;
    }
    setSequence([...sequence, stepIdx]);
  };

  const checkOrder = () => {
    if (!item || sequence.length !== item.steps.length) return;
    const ok = scoreTimelineOrder(sequence, item.steps.length);
    setOrderOk(ok);
    setOrderRevealed(true);
    if (ok) sfx.correct();
    else sfx.wrong();
  };

  const goGap = () => {
    setPhase('gap');
  };

  const checkGap = () => {
    if (!item || !gapPick) return;
    const gapOk = gapPick === item.correctGap;
    recordQuiz('controls', orderOk && gapOk);
    if (gapOk) sfx.correct();
    else sfx.wrong();
    const pct = (orderOk ? 50 : 0) + (gapOk ? 50 : 0);
    setScores((s) => [...s, { id: item.id, pct, orderOk, gapOk }]);
    setGapRevealed(true);
  };

  const next = () => {
    if (!queue || queue === 'done') return;
    if (idx + 1 >= queue.length) {
      const avg = scores.length
        ? Math.round(scores.reduce((a, x) => a + x.pct, 0) / scores.length)
        : 0;
      if (avg >= 70) burst({ stars: 2 });
      setQueue('done');
      return;
    }
    const nextIdx = idx + 1;
    setIdx(nextIdx);
    prepareCase(queue[nextIdx]);
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
          icon={ListOrdered}
          title="Process timeline"
          subtitle="Ułóż kroki JOML / Change / IR, potem wskaż typową lukę kontroli."
        />
        <Card>
          <p className="text-sm text-slate-400 mb-4">
            Klikaj kroki w kolejności (ponowny klik cofa od tego miejsca). Potem jedno pytanie o gap.
            {' '}
            {TIMELINE_CASES.length}
            {' '}
            procesy.
          </p>
          <button type="button" className="btn-primary" onClick={start}>
            Start (
            {TIMELINE_CASES.length}
            )
          </button>
        </Card>
      </div>
    );
  }

  if (queue === 'done') {
    return (
      <div className="space-y-5 animate-slidein">
        <SectionHeader icon={ListOrdered} title="Timeline — wynik" subtitle={`Średnia ${avgDone}%`} />
        <Pill tone={scoreTone(avgDone)}>{avgDone}%</Pill>
        <div className="space-y-2">
          {scores.map((s) => {
            const c = TIMELINE_CASES.find((x) => x.id === s.id);
            return (
              <Card key={s.id} className="flex items-center justify-between gap-2">
                <span className="text-sm text-slate-300">{c?.title}</span>
                <div className="flex gap-1">
                  <Pill tone={s.orderOk ? 'good' : 'bad'}>kolejność</Pill>
                  <Pill tone={s.gapOk ? 'good' : 'bad'}>luka</Pill>
                </div>
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
        <button type="button" onClick={() => setQueue(null)} className="text-sm text-slate-400 hover:text-slate-200 inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Wyjście
        </button>
        <Pill tone="neutral">{idx + 1}/{queue.length} · {phase === 'order' ? 'kolejność' : 'luka'}</Pill>
      </div>

      <SectionHeader icon={ListOrdered} title={item.title} subtitle={item.domain} />
      <p className="text-sm text-slate-400">{item.blurb}</p>

      {phase === 'order' && (
        <Card>
          <p className="text-xs text-slate-500 mb-3">Klikaj od pierwszego do ostatniego kroku.</p>
          <div className="space-y-2 mb-4">
            {displayOrder.map((stepIdx) => {
              const pos = sequence.indexOf(stepIdx);
              const picked = pos >= 0;
              let cls = 'border-ink-700/60 bg-ink-850/40 hover:border-accent/30';
              if (orderRevealed) {
                const userPos = sequence.indexOf(stepIdx);
                const okHere = userPos === stepIdx;
                if (okHere) cls = 'border-emerald-500/50 bg-emerald-500/10';
                else if (picked) cls = 'border-rose-500/40 bg-rose-500/10';
                else cls = 'border-emerald-500/25 bg-emerald-500/5';
              } else if (picked) {
                cls = 'border-accent/40 bg-accent/10';
              }
              return (
                <button
                  key={stepIdx}
                  type="button"
                  disabled={orderRevealed}
                  onClick={() => toggleStep(stepIdx)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${cls}`}
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                    orderRevealed ? (sequence.indexOf(stepIdx) === stepIdx ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white')
                      : picked ? 'bg-accent text-white' : 'bg-ink-700 text-slate-300'
                  }`}
                  >
                    {orderRevealed ? stepIdx + 1 : picked ? pos + 1 : '·'}
                  </span>
                  <span className="text-slate-200">{item.steps[stepIdx]}</span>
                </button>
              );
            })}
          </div>

          {orderRevealed && (
            <div className="mb-4 flex gap-2 rounded-lg border border-ink-700/50 bg-ink-900/50 p-3 text-sm text-slate-300">
              {orderOk ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />}
              <span>{orderOk ? 'Kolejność OK — teraz wskaż lukę.' : 'Kolejność niepoprawna (numery = właściwa pozycja). I tak przejdź do pytania o lukę.'}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {!orderRevealed ? (
              <>
                <button
                  type="button"
                  className="btn-primary"
                  disabled={sequence.length !== item.steps.length}
                  onClick={checkOrder}
                >
                  Sprawdź kolejność
                </button>
                <button type="button" className="btn-ghost" onClick={() => setSequence([])}>
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
              </>
            ) : (
              <button type="button" className="btn-primary" onClick={goGap}>
                Pytanie o lukę <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </Card>
      )}

      {phase === 'gap' && (
        <Card>
          <p className="text-sm font-medium text-slate-100 mb-3">{item.gapPrompt}</p>
          <div className="space-y-2 mb-4">
            {item.gapOptions.map((o) => {
              let cls = 'w-full text-left rounded-lg border px-3 py-2.5 text-sm transition-colors ';
              if (gapRevealed && o.id === item.correctGap) cls += 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100';
              else if (gapRevealed && o.id === gapPick && o.id !== item.correctGap) cls += 'border-rose-500/50 bg-rose-500/10 text-rose-100';
              else if (gapPick === o.id) cls += 'border-accent/50 bg-accent/10 text-slate-100';
              else cls += 'border-ink-700/60 bg-ink-900/40 text-slate-300 hover:border-ink-500';
              return (
                <button key={o.id} type="button" disabled={gapRevealed} onClick={() => setGapPick(o.id)} className={cls}>
                  {o.label}
                </button>
              );
            })}
          </div>

          {gapRevealed && (
            <div className="mb-4 flex gap-2 rounded-lg border border-ink-700/50 bg-ink-900/50 p-3 text-sm text-slate-300">
              <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{item.explain}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {!gapRevealed ? (
              <button type="button" className="btn-primary" disabled={!gapPick} onClick={checkGap}>Sprawdź</button>
            ) : (
              <button type="button" className="btn-primary" onClick={next}>
                Dalej <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
