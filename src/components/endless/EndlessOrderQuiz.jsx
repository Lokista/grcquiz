import { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

function shuffleIndices(n, seed) {
  const a = Array.from({ length: n }, (_, i) => i);
  let s = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  for (let i = a.length - 1; i > 0; i -= 1) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function EndlessOrderQuiz({ question, revealed, onComplete }) {
  const displayOrder = useMemo(
    () => shuffleIndices(question.items.length, question.id),
    [question.id, question.items.length],
  );
  const [sequence, setSequence] = useState([]);

  const posOf = (displayIdx) => {
    const itemIdx = displayOrder[displayIdx];
    return sequence.indexOf(itemIdx);
  };

  const toggle = (displayIdx) => {
    if (revealed) return;
    const itemIdx = displayOrder[displayIdx];
    const pos = sequence.indexOf(itemIdx);
    if (pos >= 0) {
      setSequence(sequence.slice(0, pos));
      return;
    }
    const next = [...sequence, itemIdx];
    setSequence(next);
    if (next.length === question.items.length) {
      onComplete();
    }
  };

  const reset = () => {
    if (revealed) return;
    setSequence([]);
  };

  const isCorrectOrder = () => {
    if (sequence.length !== question.correctOrder.length) return false;
    return sequence.every((v, i) => v === question.correctOrder[i]);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">Klikaj elementy w kolejności od pierwszego do ostatniego. Klik ponownie, by cofnąć od tego kroku.</p>
      <div className="space-y-2">
        {displayOrder.map((itemIdx, displayIdx) => {
          const pos = posOf(displayIdx);
          const picked = pos >= 0;
          const correctPos = question.correctOrder.indexOf(itemIdx);
          const userCorrect = revealed && picked && sequence[pos] === question.correctOrder[pos];
          let cls = 'border-ink-700/60 bg-ink-850/40 hover:bg-ink-700/50 hover:border-accent/30';
          if (revealed) {
            if (userCorrect) cls = 'border-emerald-500/50 bg-emerald-500/10';
            else if (picked) cls = 'border-accent/30 bg-accent/5';
            else cls = 'border-emerald-500/25 bg-emerald-500/5';
          } else if (picked) {
            cls = 'border-accent/40 bg-accent/10';
          }
          return (
            <button
              key={itemIdx}
              type="button"
              disabled={revealed}
              onClick={() => toggle(displayIdx)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${cls}`}
            >
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                revealed ? 'bg-emerald-600 text-white' : picked ? 'bg-accent text-white' : 'bg-ink-700 text-slate-300'
              }`}>
                {revealed ? correctPos + 1 : picked ? pos + 1 : '·'}
              </span>
              <span className="text-slate-100 flex-1">{question.items[itemIdx]}</span>
              {(userCorrect || (revealed && !picked)) && (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
      {!revealed && sequence.length > 0 && (
        <button type="button" onClick={reset} className="text-xs text-slate-500 hover:text-slate-300 inline-flex items-center gap-1">
          <RotateCcw className="h-3 w-3" /> Resetuj kolejność
        </button>
      )}
      {revealed && !isCorrectOrder() && (
        <p className="text-xs text-slate-400">Twoja kolejność mogła różnić się — i tak zdobywasz XP. Porównaj z poprawną poniżej.</p>
      )}
    </div>
  );
}
