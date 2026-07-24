import { useMemo, useState } from 'react';
import {
  Split, ArrowLeft, CheckCircle2, XCircle, RotateCcw, ChevronRight, Lightbulb,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, Pill, scoreTone } from '../components/ui.jsx';
import {
  SOD_SCENARIOS, allPairs, conflictKeySet, scoreSodSelection, pairKey,
} from '../data/sodConflicts.js';
import { sfx, burst } from '../utils/juice.js';

function roleLabel(scenario, id) {
  return scenario.roles.find((r) => r.id === id)?.label || id;
}

export default function SodFinderModule() {
  const { go } = useNav();
  const { recordQuiz } = useProgress();
  const [idx, setIdx] = useState(null);
  const [selected, setSelected] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState([]);

  const scenario = idx !== null && idx !== 'done' ? SOD_SCENARIOS[idx] : null;
  const pairs = useMemo(() => (scenario ? allPairs(scenario.roles) : []), [scenario]);
  const need = useMemo(() => (scenario ? conflictKeySet(scenario) : new Set()), [scenario]);

  const start = () => {
    setIdx(0);
    setSelected([]);
    setRevealed(false);
    setScores([]);
    sfx.whoosh();
  };

  const toggle = (key) => {
    if (revealed) return;
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const reveal = () => {
    if (!scenario || selected.length === 0) return;
    const sc = scoreSodSelection(scenario, selected);
    recordQuiz('controls', sc.pct >= 60);
    if (sc.pct >= 60) sfx.correct();
    else sfx.wrong();
    setScores((s) => [...s, { id: scenario.id, pct: sc.pct }]);
    setRevealed(true);
  };

  const next = () => {
    if (idx + 1 >= SOD_SCENARIOS.length) {
      const avg = scores.length
        ? Math.round(scores.reduce((a, x) => a + x.pct, 0) / scores.length)
        : 0;
      if (avg >= 70) burst({ stars: 2 });
      setIdx('done');
      return;
    }
    setIdx((i) => i + 1);
    setSelected([]);
    setRevealed(false);
  };

  const avgDone = useMemo(() => {
    if (idx !== 'done' || scores.length === 0) return 0;
    return Math.round(scores.reduce((a, x) => a + x.pct, 0) / scores.length);
  }, [idx, scores]);

  if (idx === null) {
    return (
      <div className="space-y-5 animate-slidein">
        <button type="button" onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" /> Mapa
        </button>
        <SectionHeader
          icon={Split}
          title="SoD conflict finder"
          subtitle="Zaznacz pary ról, które NIE powinny być u jednej osoby (ściąga: SoD / 4-eyes)."
        />
        <Card>
          <p className="text-sm text-slate-400 mb-4">
            SoD = rozdzielenie obowiązków. Ryzyko konfliktu: fraud, błąd, brak niezależnej weryfikacji.
            Przykłady: płatności, Change (dev≠deploy), HR/payroll, Access Management.
          </p>
          <button type="button" className="btn-primary" onClick={start}>
            Start ({SOD_SCENARIOS.length} macierze)
          </button>
        </Card>
      </div>
    );
  }

  if (idx === 'done') {
    return (
      <div className="space-y-5 animate-slidein">
        <SectionHeader icon={Split} title="SoD — wynik" subtitle={`Średnia ${avgDone}%`} />
        <Pill tone={scoreTone(avgDone)}>{avgDone}%</Pill>
        <div className="space-y-2">
          {scores.map((s) => {
            const sc = SOD_SCENARIOS.find((x) => x.id === s.id);
            return (
              <Card key={s.id} className="flex items-center justify-between gap-2">
                <span className="text-sm text-slate-300">{sc?.title}</span>
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
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => go('quest')} className="text-sm text-slate-400 hover:text-slate-200 inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Wyjdź
        </button>
        <span className="text-xs text-slate-500">{idx + 1} / {SOD_SCENARIOS.length}</span>
      </div>

      <Card>
        <div className="font-semibold text-slate-100">{scenario.title}</div>
        <p className="text-sm text-slate-400 mt-1 mb-4">{scenario.blurb}</p>

        <div className="label mb-2">Zaznacz konflikty SoD (pary)</div>
        <div className="space-y-2">
          {pairs.map(([a, b]) => {
            const key = pairKey(a, b);
            const on = selected.includes(key);
            const isConflict = need.has(key);
            let ring = on ? 'border-accent/50 bg-accent/10' : 'border-ink-600/60 hover:bg-ink-700/30';
            if (revealed) {
              if (isConflict && on) ring = 'border-emerald-500/50 bg-emerald-500/10';
              else if (isConflict && !on) ring = 'border-amber-500/40 bg-amber-500/5';
              else if (!isConflict && on) ring = 'border-rose-500/40 bg-rose-500/10';
              else ring = 'border-ink-700/40 opacity-50';
            }
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key)}
                className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${ring}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-200">
                    <span className="font-medium">{roleLabel(scenario, a)}</span>
                    <span className="text-slate-500"> ↔ </span>
                    <span className="font-medium">{roleLabel(scenario, b)}</span>
                  </span>
                  {revealed && isConflict && on && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                  {revealed && isConflict && !on && <XCircle className="h-4 w-4 text-amber-400 shrink-0" />}
                  {revealed && !isConflict && on && <XCircle className="h-4 w-4 text-rose-400 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mt-4 rounded-lg border border-ink-600/60 bg-ink-900/40 p-3 text-sm text-slate-300 flex gap-2">
            <Lightbulb className="h-4 w-4 text-accent-soft shrink-0 mt-0.5" />
            <span>{scenario.explain}</span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {!revealed ? (
            <button type="button" className="btn-primary" disabled={selected.length === 0} onClick={reveal}>
              Sprawdź konflikty
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={next}>
              {idx + 1 >= SOD_SCENARIOS.length ? 'Podsumowanie' : 'Następna macierz'}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
