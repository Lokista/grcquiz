import { useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export default function EndlessBucketQuiz({ question, revealed, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [assignments, setAssignments] = useState(() => question.items.map(() => null));

  const assign = (bucketIdx) => {
    if (revealed || selected == null) return;
    const next = [...assignments];
    next[selected] = bucketIdx;
    setAssignments(next);
    setSelected(null);
    if (next.every((a) => a !== null)) {
      onComplete();
    }
  };

  const selectItem = (idx) => {
    if (revealed) return;
    setSelected(selected === idx ? null : idx);
  };

  const reset = () => {
    if (revealed) return;
    setAssignments(question.items.map(() => null));
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">Kliknij element, potem koszyk. Wszystkie przypisane = dalej automatycznie.</p>

      <div className="grid grid-cols-2 gap-2">
        {question.buckets.map((name, bi) => (
          <button
            key={name}
            type="button"
            disabled={revealed || selected == null}
            onClick={() => assign(bi)}
            className={`rounded-xl border p-3 text-left min-h-[72px] transition-all ${
              selected != null && !revealed
                ? 'border-accent/50 bg-accent/10 hover:bg-accent/15 cursor-pointer'
                : 'border-ink-700/50 bg-ink-900/30'
            }`}
          >
            <div className="text-[11px] font-bold uppercase tracking-wide text-accent-soft mb-2">{name}</div>
            <div className="space-y-1">
              {question.items.map((it, ii) => {
                if (assignments[ii] !== bi) return null;
                const ok = revealed && it.bucket === bi;
                const bad = revealed && assignments[ii] !== it.bucket;
                return (
                  <div
                    key={ii}
                    className={`text-[11px] rounded px-2 py-1 ${
                      ok ? 'bg-emerald-500/20 text-emerald-300' : bad ? 'bg-amber-500/15 text-amber-200' : 'bg-ink-800 text-slate-300'
                    }`}
                  >
                    {it.text}
                  </div>
                );
              })}
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="text-[11px] text-slate-500 uppercase tracking-wide">Elementy do segregacji</div>
        {question.items.map((it, ii) => {
          const assigned = assignments[ii];
          const isSel = selected === ii;
          const ok = revealed && assigned === it.bucket;
          const bad = revealed && assigned !== null && assigned !== it.bucket;
          let cls = 'border-ink-700/60 bg-ink-850/40 hover:border-accent/30';
          if (isSel) cls = 'border-accent ring-1 ring-accent/40 bg-accent/10';
          else if (revealed && ok) cls = 'border-emerald-500/50 bg-emerald-500/10';
          else if (revealed && bad) cls = 'border-amber-500/40 bg-amber-500/10';
          else if (assigned != null && !revealed) cls = 'border-ink-700/40 bg-ink-900/20 opacity-60';
          return (
            <button
              key={ii}
              type="button"
              disabled={revealed}
              onClick={() => selectItem(ii)}
              className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${cls}`}
            >
              <span className="text-slate-100 flex-1">{it.text}</span>
              {assigned != null && !revealed && (
                <span className="text-[10px] text-accent-soft">{question.buckets[assigned]}</span>
              )}
              {revealed && ok && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {!revealed && assignments.some((a) => a !== null) && (
        <button type="button" onClick={reset} className="text-xs text-slate-500 hover:text-slate-300 inline-flex items-center gap-1">
          <RotateCcw className="h-3 w-3" /> Resetuj
        </button>
      )}
    </div>
  );
}
