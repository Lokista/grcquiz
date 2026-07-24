import { useMemo, useState } from 'react';
import {
  ShieldAlert, ArrowLeft, RotateCcw, ChevronRight, Lightbulb,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, Pill, scoreTone } from '../components/ui.jsx';
import {
  RISK_CASES, LEVELS, TREATMENTS, scoreBand, scoreRiskPick,
} from '../data/riskRegister.js';
import { sfx, burst } from '../utils/juice.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function LevelPicker({ label, value, onChange, disabled, revealCorrect, correct }) {
  return (
    <div>
      <div className="text-xs text-slate-500 mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {LEVELS.map((n) => {
          let cls = value === n
            ? 'border-accent/50 bg-accent/15 text-accent-soft'
            : 'border-ink-600/60 text-slate-300 hover:bg-ink-700/40';
          if (revealCorrect) {
            if (n === correct) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
            else if (n === value && n !== correct) cls = 'border-rose-500/40 bg-rose-500/10 text-rose-300';
          }
          return (
            <button
              key={n}
              type="button"
              disabled={disabled}
              aria-pressed={value === n}
              onClick={() => onChange(n)}
              className={`h-9 w-9 rounded-lg border text-sm font-bold transition-colors ${cls}`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function RiskRegisterModule() {
  const { go } = useNav();
  const { recordQuiz } = useProgress();
  const [queue, setQueue] = useState(null);
  const [idx, setIdx] = useState(0);
  const [pickL, setPickL] = useState(null);
  const [pickI, setPickI] = useState(null);
  const [treatment, setTreatment] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [last, setLast] = useState(null);
  const [results, setResults] = useState([]);

  const start = () => {
    setQueue(shuffle(RISK_CASES));
    setIdx(0);
    setPickL(null);
    setPickI(null);
    setTreatment(null);
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
    if (!item || !pickL || !pickI || !treatment) return;
    const sc = scoreRiskPick(item, pickL, pickI, treatment);
    recordQuiz('basics', sc.pct >= 60);
    if (sc.pct >= 70) sfx.correct();
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
    setPickL(null);
    setPickI(null);
    setTreatment(null);
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
          icon={ShieldAlert}
          title="Risk register mini"
          subtitle="Inherent (L×I) → residual po kontrolach → treatment (mitigate/accept/transfer/avoid)."
        />
        <Card>
          <p className="text-sm text-slate-400 mb-4">
            Skala 1–5. Residual oceniasz po sensownych kontrolach z scenariusza. Tolerancja ±1 na L i I względem modelu.
            {' '}
            {RISK_CASES.length}
            {' '}
            ryzyk.
          </p>
          <button type="button" className="btn-primary" onClick={start}>Start</button>
        </Card>
      </div>
    );
  }

  if (queue === 'done') {
    return (
      <div className="space-y-5 animate-slidein">
        <SectionHeader icon={ShieldAlert} title="Risk — wynik" subtitle={`Średnia ${donePct}%`} />
        <Pill tone={scoreTone(donePct)}>{donePct}%</Pill>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={start}><RotateCcw className="h-4 w-4" /> Jeszcze raz</button>
          <button type="button" className="btn-ghost" onClick={() => go('quest')}>Mapa</button>
        </div>
      </div>
    );
  }

  const inhScore = scoreBand(item.inherent.L, item.inherent.I);

  return (
    <div className="space-y-4 animate-slidein">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => go('quest')} className="text-sm text-slate-400 hover:text-slate-200 inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Wyjdź
        </button>
        <span className="text-xs text-slate-500">{idx + 1} / {queue.length}</span>
      </div>

      <SectionHeader icon={ShieldAlert} title={item.title} subtitle={item.asset} />

      <Card>
        <p className="text-sm text-slate-300 mb-3">{item.scenario}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Pill tone="bad">
            Inherent L
            {item.inherent.L}
            ×I
            {item.inherent.I}
            {' '}
            =
            {' '}
            {inhScore}
          </Pill>
          <Pill tone="neutral">{item.controlsHint}</Pill>
        </div>
      </Card>

      <Card>
        <div className="text-sm font-semibold text-slate-200 mb-3">Twój residual (po kontrolach)</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <LevelPicker
            label="Likelihood (L)"
            value={pickL}
            onChange={setPickL}
            disabled={revealed}
            revealCorrect={revealed}
            correct={item.residualAfter.L}
          />
          <LevelPicker
            label="Impact (I)"
            value={pickI}
            onChange={setPickI}
            disabled={revealed}
            revealCorrect={revealed}
            correct={item.residualAfter.I}
          />
        </div>
        {pickL && pickI && (
          <p className="text-xs text-slate-500 mb-4">
            Twój residual score:
            {' '}
            <span className="text-slate-200 font-semibold">{scoreBand(pickL, pickI)}</span>
          </p>
        )}

        <div className="label mb-2">Treatment</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {TREATMENTS.map((t) => {
            let cls = treatment === t.id
              ? 'border-accent/50 bg-accent/15 text-accent-soft'
              : 'border-ink-600/60 text-slate-300 hover:bg-ink-700/40';
            if (revealed) {
              if (t.id === item.correctTreatment) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
              else if (t.id === treatment && t.id !== item.correctTreatment) cls = 'border-rose-500/40 bg-rose-500/10 text-rose-300';
            }
            return (
              <button
                key={t.id}
                type="button"
                disabled={revealed}
                aria-pressed={treatment === t.id}
                onClick={() => setTreatment(t.id)}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${cls}`}
              >
                <div className="font-semibold">{t.label}</div>
                <div className="text-xs text-slate-500">{t.tip}</div>
              </button>
            );
          })}
        </div>

        {revealed && last && (
          <div className="mb-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              <Pill tone={scoreTone(last.pct)}>{last.pct}%</Pill>
              <Pill tone={last.Lok ? 'good' : 'bad'}>L</Pill>
              <Pill tone={last.Iok ? 'good' : 'bad'}>I</Pill>
              <Pill tone={last.treatOk ? 'good' : 'bad'}>Treatment</Pill>
            </div>
            <div className="flex gap-2 rounded-lg border border-ink-700/50 bg-ink-900/50 p-3 text-sm text-slate-300">
              <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{item.explain}</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {!revealed ? (
            <button type="button" className="btn-primary" disabled={!pickL || !pickI || !treatment} onClick={confirm}>
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
