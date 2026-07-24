import { useMemo, useState } from 'react';
import {
  ClipboardList, Copy, Check, ArrowLeft, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { Card, SectionHeader, Pill } from '../components/ui.jsx';
import {
  REQUEST_LIST_AREAS,
  formatRequestListMarkdown,
  formatRequestListPlain,
} from '../data/requestLists.js';
import { sfx } from '../utils/juice.js';

export default function RequestListModule() {
  const { go } = useNav();
  const [selected, setSelected] = useState(['access', 'change', 'backup']);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [format, setFormat] = useState('md'); // md | plain

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectAll = () => setSelected(REQUEST_LIST_AREAS.map((a) => a.id));
  const clear = () => setSelected([]);

  const text = useMemo(
    () => (format === 'md' ? formatRequestListMarkdown(selected) : formatRequestListPlain(selected)),
    [selected, format],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      sfx.correct();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      sfx.wrong();
    }
  };

  return (
    <div className="space-y-5 animate-slidein">
      <button type="button" onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Mapa
      </button>
      <SectionHeader
        icon={ClipboardList}
        title="Request list / PBC"
        subtitle="Checklisty evidence ze ściągi — zaznacz obszary, skopiuj na rozmowę lub engagement."
      />

      <Card>
        <div className="flex flex-wrap gap-2 mb-3">
          <button type="button" className="btn-ghost text-xs" onClick={selectAll}>Wszystkie</button>
          <button type="button" className="btn-ghost text-xs" onClick={clear}>Wyczyść</button>
          <Pill tone="neutral">{selected.length} obszarów</Pill>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {REQUEST_LIST_AREAS.map((a) => {
            const on = selected.includes(a.id);
            const open = !!expanded[a.id];
            return (
              <div
                key={a.id}
                className={`rounded-lg border p-3 transition-colors ${
                  on ? 'border-accent/40 bg-accent/10' : 'border-ink-600/60 bg-ink-900/40'
                }`}
              >
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(a.id)}
                    className="mt-1 accent-blue-500"
                    id={`rl-${a.id}`}
                  />
                  <label htmlFor={`rl-${a.id}`} className="min-w-0 flex-1 cursor-pointer">
                    <div className="font-semibold text-sm text-slate-100">{a.label}</div>
                    <div className="text-[11px] text-slate-500">{a.blurb}</div>
                  </label>
                  <button
                    type="button"
                    className="btn-ghost px-1.5 py-1"
                    onClick={() => setExpanded((e) => ({ ...e, [a.id]: !e[a.id] }))}
                    aria-label="Podgląd"
                  >
                    {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
                {open && (
                  <div className="mt-2 pl-6 text-xs text-slate-400 space-y-2">
                    <div>
                      <div className="font-semibold text-slate-300 mb-1">Evidence</div>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {a.items.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold text-amber-400/90 mb-1">Red flags</div>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {a.redFlags.map((r) => <li key={r}>{r}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="label">Eksport</span>
          <button
            type="button"
            className={`chip border ${format === 'md' ? 'bg-accent/15 text-accent-soft border-accent/30' : 'border-ink-600/60'}`}
            onClick={() => setFormat('md')}
          >
            Markdown
          </button>
          <button
            type="button"
            className={`chip border ${format === 'plain' ? 'bg-accent/15 text-accent-soft border-accent/30' : 'border-ink-600/60'}`}
            onClick={() => setFormat('plain')}
          >
            Plain text
          </button>
          <button
            type="button"
            className="btn-primary ml-auto"
            disabled={selected.length === 0}
            onClick={copy}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Skopiowano' : 'Kopiuj listę'}
          </button>
        </div>
        <pre className="max-h-80 overflow-auto rounded-lg border border-ink-600/60 bg-ink-950/60 p-3 text-[11px] text-slate-300 whitespace-pre-wrap font-mono">
          {selected.length === 0 ? 'Zaznacz co najmniej jeden obszar.' : text}
        </pre>
      </Card>
    </div>
  );
}
