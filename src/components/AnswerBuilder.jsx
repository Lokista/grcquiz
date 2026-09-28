import { useMemo, useState } from 'react';
import { GripVertical, MousePointerClick, Plus, X } from 'lucide-react';

/**
 * Budowanie odpowiedzi przez klik lub przeciąganie kart — zero wpisywania.
 */
export default function AnswerBuilder({ options, selectedIds, onChange, disabled }) {
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);
  const [dragId, setDragId] = useState(null);
  const [overZone, setOverZone] = useState(null);

  const inAnswer = options.filter((o) => selected.has(o.id));
  const inPool = options.filter((o) => !selected.has(o.id));

  const toggle = (id) => {
    if (disabled) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange([...next]);
  };

  const moveToAnswer = (id) => {
    if (disabled || selected.has(id)) return;
    onChange([...selected, id]);
  };

  const moveToPool = (id) => {
    if (disabled || !selected.has(id)) return;
    onChange([...selected].filter((x) => x !== id));
  };

  const onDragStart = (e, id) => {
    if (disabled) return;
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const onDragEnd = () => {
    setDragId(null);
    setOverZone(null);
  };

  const onDropZone = (zone) => (e) => {
    e.preventDefault();
    setOverZone(null);
    const id = e.dataTransfer.getData('text/plain') || dragId;
    if (!id) return;
    if (zone === 'answer') moveToAnswer(id);
    else moveToPool(id);
    setDragId(null);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setOverZone('answer'); }}
        onDragLeave={() => setOverZone(null)}
        onDrop={onDropZone('answer')}
        className={`min-h-[120px] rounded-xl border-2 border-dashed p-3 transition-colors ${
          overZone === 'answer' ? 'border-accent/60 bg-accent/10' : 'border-accent/25 bg-accent/5'
        } ${disabled ? 'opacity-70' : ''}`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-soft">Twoja odpowiedź</span>
          <span className="text-[0.6875rem] text-slate-500 inline-flex items-center gap-1">
            <MousePointerClick className="h-3 w-3" /> klik lub <GripVertical className="h-3 w-3" /> przeciągnij
          </span>
        </div>
        {inAnswer.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">Wybierz karty, które pasują do pytania — kliknij lub przeciągnij tutaj.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {inAnswer.map((o) => (
              <OptionChip
                key={o.id}
                option={o}
                inAnswer
                disabled={disabled}
                dragging={dragId === o.id}
                onToggle={() => toggle(o.id)}
                onDragStart={(e) => onDragStart(e, o.id)}
                onDragEnd={onDragEnd}
              />
            ))}
          </div>
        )}
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setOverZone('pool'); }}
        onDragLeave={() => setOverZone(null)}
        onDrop={onDropZone('pool')}
        className={`rounded-xl border border-ink-700/60 bg-ink-900/30 p-3 transition-colors ${
          overZone === 'pool' ? 'ring-1 ring-ink-500' : ''
        }`}
      >
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Dostępne karty</div>
        <div className="flex flex-wrap gap-2">
          {inPool.map((o) => (
            <OptionChip
              key={o.id}
              option={o}
              disabled={disabled}
              dragging={dragId === o.id}
              onToggle={() => toggle(o.id)}
              onDragStart={(e) => onDragStart(e, o.id)}
              onDragEnd={onDragEnd}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function OptionChip({ option, inAnswer, disabled, dragging, onToggle, onDragStart, onDragEnd }) {
  return (
    <button
      type="button"
      draggable={!disabled}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onToggle}
      disabled={disabled}
      className={`group inline-flex items-start gap-1.5 max-w-full text-left rounded-lg border px-3 py-2 text-sm transition-all cursor-grab active:cursor-grabbing ${
        dragging ? 'opacity-50 scale-95' : ''
      } ${
        inAnswer
          ? 'border-accent/40 bg-accent/15 text-slate-100 hover:bg-accent/20'
          : 'border-ink-600/70 bg-ink-800/60 text-slate-300 hover:border-ink-500 hover:bg-ink-700/70'
      } ${disabled ? 'pointer-events-none' : ''}`}
    >
      <GripVertical className="h-4 w-4 shrink-0 text-slate-500 mt-0.5 opacity-60 group-hover:opacity-100" />
      <span className="min-w-0">{option.label}</span>
      <span className="shrink-0 mt-0.5 opacity-60">
        {inAnswer ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}
