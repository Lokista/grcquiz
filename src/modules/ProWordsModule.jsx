import { useState } from 'react';
import {
  MessageCircle, ArrowLeft, Sparkles, CheckCircle2, XCircle, RotateCcw, Lightbulb,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, Pill, scoreTone } from '../components/ui.jsx';
import { dealProWords } from '../data/proWords.js';
import { sfx, burst } from '../utils/juice.js';

export default function ProWordsModule() {
  const { go } = useNav();
  const { recordQuiz } = useProgress();
  const [deal, setDeal] = useState(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);

  const start = () => {
    setDeal(dealProWords(5));
    setIdx(0);
    setPicked(null);
    setResults([]);
    setDone(false);
    sfx.whoosh();
  };

  const current = deal?.[idx];

  const confirm = () => {
    if (!current || picked === null) return;
    const opt = current.options.find((o) => o.id === picked);
    const ok = !!opt?.correct;
    recordQuiz('basics', ok);
    if (ok) sfx.correct();
    else sfx.wrong();
    const nextResults = [...results, { id: current.id, term: current.term, ok, good: current.good }];
    setResults(nextResults);
    if (idx + 1 >= deal.length) {
      const pct = Math.round((nextResults.filter((r) => r.ok).length / nextResults.length) * 100);
      if (pct >= 80) burst({ stars: 2 });
      setDone(true);
    } else {
      setIdx((i) => i + 1);
      setPicked(null);
    }
  };

  if (!deal) {
    return (
      <div className="space-y-5 animate-slidein">
        <button type="button" onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" /> Mapa
        </button>
        <SectionHeader
          icon={MessageCircle}
          title="Pro-słowa drafter"
          subtitle="Losuj 5 terminów ze ściągi — wybierz zdanie, które brzmi jak audytor na rozmowie."
        />
        <Card className="text-center">
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
            Ćwiczysz residual risk, PBC, design/operating, compensating control… w jednym zdaniu przy case’ie bankowym.
          </p>
          <button type="button" className="btn-primary" onClick={start}>
            <Sparkles className="h-4 w-4" /> Losuj 5 słów
          </button>
        </Card>
      </div>
    );
  }

  if (done) {
    const hit = results.filter((r) => r.ok).length;
    const pct = Math.round((hit / results.length) * 100);
    return (
      <div className="space-y-5 animate-slidein">
        <SectionHeader icon={MessageCircle} title="Debrief pro-słów" subtitle={`${hit}/${results.length} · ${pct}%`} />
        <Pill tone={scoreTone(pct)}>{pct}%</Pill>
        <div className="space-y-3">
          {results.map((r) => (
            <Card key={r.id}>
              <div className="flex items-center gap-2 mb-2">
                {r.ok
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  : <XCircle className="h-4 w-4 text-rose-400" />}
                <span className="font-semibold text-slate-100">{r.term}</span>
              </div>
              <div className="text-xs text-accent-soft mb-1 flex items-center gap-1"><Lightbulb className="h-3 w-3" /> Wzorcowe zdanie</div>
              <p className="text-sm text-slate-300">{r.good}</p>
            </Card>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={start}><RotateCcw className="h-4 w-4" /> Nowa runda</button>
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
        <span className="text-xs text-slate-500">{idx + 1} / {deal.length}</span>
      </div>
      <Card>
        <Pill tone="accent">{current.term}</Pill>
        <p className="mt-2 text-sm text-slate-400">{current.meaning}</p>
        <p className="mt-1 text-xs text-slate-500">Kontekst: {current.caseHint}</p>
        <div className="label mt-4 mb-2">Które zdanie powiesz na rozmowie?</div>
        <div className="space-y-2">
          {current.options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setPicked(o.id)}
              className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                picked === o.id
                  ? 'border-accent/50 bg-accent/15 text-slate-100'
                  : 'border-ink-600/60 text-slate-300 hover:bg-ink-700/40'
              }`}
            >
              {o.text}
            </button>
          ))}
        </div>
        <button type="button" className="btn-primary mt-4" disabled={!picked} onClick={confirm}>
          Potwierdź
        </button>
      </Card>
    </div>
  );
}
