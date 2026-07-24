import { useMemo, useState } from 'react';
import {
  ScanSearch, ArrowLeft, CheckCircle2, XCircle, RotateCcw, ChevronRight, Lightbulb,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, Pill, scoreTone } from '../components/ui.jsx';
import { EVIDENCE_CASES, scoreEvidenceCase } from '../data/evidenceWalkthrough.js';
import { sfx, burst } from '../utils/juice.js';

export default function EvidenceWalkthroughModule() {
  const { go } = useNav();
  const { recordQuiz } = useProgress();
  const [idx, setIdx] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState([]);

  const item = idx !== null && idx !== 'done' ? EVIDENCE_CASES[idx] : null;
  const question = item?.questions[qIdx];

  const start = () => {
    setIdx(0);
    setQIdx(0);
    setAnswers({});
    setRevealed(false);
    setScores([]);
    sfx.whoosh();
  };

  const pick = (optId) => {
    if (revealed || !question) return;
    setAnswers((a) => ({ ...a, [question.id]: optId }));
  };

  const confirm = () => {
    if (!question || !answers[question.id]) return;
    const ok = answers[question.id] === question.correct;
    recordQuiz(item.topicKey || 'basics', ok);
    if (ok) sfx.correct();
    else sfx.wrong();
    setRevealed(true);
  };

  const next = () => {
    if (!item) return;
    if (qIdx + 1 < item.questions.length) {
      setQIdx((i) => i + 1);
      setRevealed(false);
      return;
    }
    const sc = scoreEvidenceCase(item, answers);
    setScores((s) => [...s, { id: item.id, pct: sc.pct }]);
    if (idx + 1 >= EVIDENCE_CASES.length) {
      const all = [...scores, { id: item.id, pct: sc.pct }];
      const avg = Math.round(all.reduce((a, x) => a + x.pct, 0) / all.length);
      if (avg >= 70) burst({ stars: 2 });
      setIdx('done');
      return;
    }
    setIdx((i) => i + 1);
    setQIdx(0);
    setAnswers({});
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
          icon={ScanSearch}
          title="Evidence walkthrough"
          subtitle="Czytasz artefakt (export / ticket / log) i odpowiadasz: co dowodzi, czego brak, jaki follow-up."
        />
        <Card>
          <p className="text-sm text-slate-400 mb-4">
            Na rozmowie i w field work nie wystarczy definicja kontroli — musisz czytać dowód.
            {EVIDENCE_CASES.length} artefaktów × 3 pytania.
          </p>
          <button type="button" className="btn-primary" onClick={start}>
            Start ({EVIDENCE_CASES.length} case’y)
          </button>
        </Card>
      </div>
    );
  }

  if (idx === 'done') {
    return (
      <div className="space-y-5 animate-slidein">
        <SectionHeader icon={ScanSearch} title="Walkthrough — wynik" subtitle={`Średnia ${avgDone}%`} />
        <Pill tone={scoreTone(avgDone)}>{avgDone}%</Pill>
        <div className="space-y-2">
          {scores.map((s) => {
            const c = EVIDENCE_CASES.find((x) => x.id === s.id);
            return (
              <Card key={s.id} className="flex items-center justify-between gap-2">
                <span className="text-sm text-slate-300">{c?.title}</span>
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

  const picked = answers[question.id];

  return (
    <div className="space-y-4 animate-slidein">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button type="button" onClick={() => setIdx(null)} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" /> Wyjście
        </button>
        <Pill tone="neutral">{idx + 1}/{EVIDENCE_CASES.length} · Q{qIdx + 1}/{item.questions.length}</Pill>
      </div>

      <SectionHeader icon={ScanSearch} title={item.title} subtitle={item.artifactLabel} />

      <Card className="!p-0 overflow-hidden">
        <div className="px-3 py-2 border-b border-ink-700/60 bg-ink-900/80 text-[11px] font-mono text-slate-500">
          artifact preview
        </div>
        <pre className="p-3 text-[12px] leading-relaxed font-mono text-emerald-200/90 overflow-x-auto whitespace-pre-wrap">
          {item.artifact.join('\n')}
        </pre>
      </Card>

      <Card>
        <p className="text-sm font-medium text-slate-100 mb-3">{question.prompt}</p>
        <div className="space-y-2">
          {question.options.map((o) => {
            const isPick = picked === o.id;
            const show = revealed;
            const isCorrect = o.id === question.correct;
            let cls = 'w-full text-left rounded-lg border px-3 py-2.5 text-sm transition-colors ';
            if (show && isCorrect) cls += 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100';
            else if (show && isPick && !isCorrect) cls += 'border-rose-500/50 bg-rose-500/10 text-rose-100';
            else if (isPick) cls += 'border-accent/50 bg-accent/10 text-slate-100';
            else cls += 'border-ink-700/60 bg-ink-900/40 text-slate-300 hover:border-ink-500';
            return (
              <button key={o.id} type="button" disabled={revealed} onClick={() => pick(o.id)} className={cls}>
                <span className="inline-flex items-start gap-2">
                  {show && isCorrect && <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />}
                  {show && isPick && !isCorrect && <XCircle className="h-4 w-4 mt-0.5 shrink-0" />}
                  <span>{o.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mt-3 flex gap-2 rounded-lg border border-ink-700/50 bg-ink-900/50 p-3 text-sm text-slate-300">
            <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{question.explain}</span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {!revealed ? (
            <button type="button" className="btn-primary" disabled={!picked} onClick={confirm}>
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
