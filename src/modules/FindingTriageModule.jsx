import { useMemo, useState } from 'react';
import {
  Inbox, ArrowLeft, RotateCcw, ChevronRight, Lightbulb,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, Pill, scoreTone } from '../components/ui.jsx';
import {
  TRIAGE_NOTES, SEVERITY_OPTS, ACTION_OPTS, scoreTriage,
} from '../data/findingTriage.js';
import { sfx, burst } from '../utils/juice.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SEV_TONE = {
  critical: 'bad', high: 'bad', medium: 'warn', low: 'neutral', info: 'good',
};

export default function FindingTriageModule() {
  const { go } = useNav();
  const { recordQuiz } = useProgress();
  const [queue, setQueue] = useState(null);
  const [idx, setIdx] = useState(0);
  const [severity, setSeverity] = useState(null);
  const [action, setAction] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [last, setLast] = useState(null);
  const [results, setResults] = useState([]);

  const start = () => {
    setQueue(shuffle(TRIAGE_NOTES));
    setIdx(0);
    setSeverity(null);
    setAction(null);
    setRevealed(false);
    setLast(null);
    setResults([]);
    sfx.whoosh();
  };

  const note = queue && queue !== 'done' ? queue[idx] : null;

  const donePct = useMemo(() => {
    if (queue !== 'done' || results.length === 0) return 0;
    return Math.round(results.reduce((a, r) => a + r.pct, 0) / results.length);
  }, [queue, results]);

  const confirm = () => {
    if (!note || !severity || !action) return;
    const sc = scoreTriage(note, severity, action);
    recordQuiz('basics', sc.pct >= 50);
    if (sc.perfect) sfx.correct();
    else sfx.wrong();
    setLast(sc);
    setResults((r) => [...r, { id: note.id, pct: sc.pct }]);
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
    setSeverity(null);
    setAction(null);
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
          icon={Inbox}
          title="Finding triage"
          subtitle="Inbox ustaleń: raw note → severity + next action. Kalibracja priorytetu jak na rozmowie."
        />
        <Card>
          <p className="text-sm text-slate-400 mb-4">
            {TRIAGE_NOTES.length}
            {' '}
            notatek. Najpierw materiality, potem ruch (eskalacja / PBC / draft / park / drop).
          </p>
          <button type="button" className="btn-primary" onClick={start}>
            Otwórz kolejkę
          </button>
        </Card>
      </div>
    );
  }

  if (queue === 'done') {
    return (
      <div className="space-y-5 animate-slidein">
        <SectionHeader icon={Inbox} title="Triage — wynik" subtitle={`Średnia ${donePct}%`} />
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
        <span className="text-xs text-slate-500">
          {idx + 1}
          {' '}
          /
          {' '}
          {queue.length}
        </span>
      </div>

      <Card>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Kontekst</div>
        <p className="text-sm text-accent-soft mb-3">{note.context}</p>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Raw note</div>
        <p className="text-sm text-slate-100 mb-4 whitespace-pre-wrap">{note.note}</p>

        <div className="label mb-2">Severity</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {SEVERITY_OPTS.map((o) => {
            let cls = severity === o.id
              ? 'border-accent/50 bg-accent/15 text-accent-soft'
              : 'border-ink-600/60 text-slate-300 hover:bg-ink-700/40';
            if (revealed) {
              if (o.id === note.correctSeverity) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
              else if (o.id === severity && o.id !== note.correctSeverity) cls = 'border-rose-500/50 bg-rose-500/10 text-rose-300';
            }
            return (
              <button
                key={o.id}
                type="button"
                disabled={revealed}
                aria-pressed={severity === o.id}
                onClick={() => setSeverity(o.id)}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${cls}`}
                title={o.tip}
              >
                {o.label}
              </button>
            );
          })}
        </div>

        <div className="label mb-2">Next action</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {ACTION_OPTS.map((o) => {
            let cls = action === o.id
              ? 'border-accent/50 bg-accent/15 text-accent-soft'
              : 'border-ink-600/60 text-slate-300 hover:bg-ink-700/40';
            if (revealed) {
              if (o.id === note.correctAction) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
              else if (o.id === action && o.id !== note.correctAction) cls = 'border-rose-500/50 bg-rose-500/10 text-rose-300';
            }
            return (
              <button
                key={o.id}
                type="button"
                disabled={revealed}
                aria-pressed={action === o.id}
                onClick={() => setAction(o.id)}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${cls}`}
              >
                <div className="font-semibold">{o.label}</div>
                <div className="text-xs text-slate-500">{o.tip}</div>
              </button>
            );
          })}
        </div>

        {revealed && last && (
          <div className="mb-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              <Pill tone={scoreTone(last.pct)}>{last.pct}%</Pill>
              <Pill tone={last.sevOk ? 'good' : 'bad'}>
                Severity
                {last.sevOk ? ' OK' : ' miss'}
              </Pill>
              <Pill tone={last.actOk ? 'good' : 'bad'}>
                Action
                {last.actOk ? ' OK' : ' miss'}
              </Pill>
              <Pill tone={SEV_TONE[note.correctSeverity]}>{note.correctSeverity}</Pill>
            </div>
            <div className="flex gap-2 rounded-lg border border-ink-700/50 bg-ink-900/50 p-3 text-sm text-slate-300">
              <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{note.explain}</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {!revealed ? (
            <button type="button" className="btn-primary" disabled={!severity || !action} onClick={confirm}>
              Sprawdź triage
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={next}>
              Następna notatka
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
