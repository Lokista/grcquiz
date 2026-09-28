import { useEffect, useMemo, useState } from 'react';
import {
  Briefcase, ArrowLeft, CheckCircle2, ChevronRight,
  RotateCcw, Award, Target,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { useMission } from '../state/MissionContext.jsx';
import { Card, SectionHeader, TopicBadge, Markdown, Pill, EmptyState, scoreTone } from '../components/ui.jsx';
import { CASE_STUDIES, caseById } from '../data/caseStudies.js';
import { scoreCaseQuestion } from '../data/shape.js';
import { sfx } from '../utils/juice.js';

export default function CaseStudyModule() {
  const { params, go } = useNav();
  const mission = useMission();

  if (mission.active && mission.content?.caseStudy) {
    return (
      <CaseRun
        key={`m-${mission.mission.id}-${params.rerun || 0}`}
        caseStudy={mission.content.caseStudy}
        missionMode={mission}
        onExit={() => go('chapter', { topicKey: mission.mission.chapterKey })}
      />
    );
  }
  if (params.caseId) {
    const c = caseById(params.caseId);
    if (c) return <CaseRun caseStudy={c} onExit={() => go('cases')} />;
  }
  return <CaseList />;
}

function CaseList() {
  const { go } = useNav();
  const { state } = useProgress();
  return (
    <div className="space-y-5 animate-slidein">
      <SectionHeader icon={Briefcase} title="Case study (swobodny)" subtitle="Scenariusze audytowe. W kampanii są to misje „Boss” z gwiazdkami." />
      <div className="grid grid-cols-1 gap-3">
        {CASE_STUDIES.map((c) => {
          const rec = state.cases[c.id];
          return (
            <button key={c.id} onClick={() => go('cases', { caseId: c.id })} className="group card card-pad text-left hover:ring-1 hover:ring-accent/30 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <TopicBadge topicKey={c.topicKey} />
                    <Pill tone="neutral">~{c.minutes} min</Pill>
                    <Pill tone="gold">{c.questions.length} pytań</Pill>
                  </div>
                  <div className="font-semibold text-slate-100 group-hover:text-accent-soft transition-colors">{c.title}</div>
                  <div className="mt-1 line-clamp-2 text-sm text-slate-400">{c.scenario.context}</div>
                </div>
                <div className="shrink-0 text-right">{rec ? <Pill tone={scoreTone(rec.best)}><Award className="h-3 w-3" /> {rec.best}%</Pill> : <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-accent-soft" />}</div>
              </div>
            </button>
          );
        })}
        {CASE_STUDIES.length === 0 && <EmptyState title="Brak case studies" icon={Briefcase} />}
      </div>
    </div>
  );
}

function CaseRun({ caseStudy: cs, onExit, missionMode }) {
  const { recordCase, recordCombo } = useProgress();
  const [phase, setPhase] = useState('questions');
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [maxCombo, setMaxCombo] = useState(0);

  const totalPoints = useMemo(() => cs.questions.reduce((a, q) => a + q.points, 0), [cs]);
  const earnedPoints = useMemo(() => cs.questions.reduce((a, q) => a + scoreCaseQuestion(q, answers[q.id]), 0), [cs, answers]);

  const finish = () => {
    recordCase(cs.id, earnedPoints, totalPoints, cs.topicKey);
    recordCombo(maxCombo);
    if (missionMode) {
      missionMode.complete(3);
      return;
    }
    setPhase('analysis');
  };

  useEffect(() => {
    if (!submitted) return undefined;
    const t = setTimeout(() => {
      if (qIdx + 1 >= cs.questions.length) finish();
      else { setQIdx((i) => i + 1); setSubmitted(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [submitted]); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'analysis') {
    return (
      <div className="space-y-4 animate-slidein">
        <SectionHeader icon={Award} title="Case ukończony" subtitle="Zawsze +XP" />
        <Card><Markdown text={cs.modelAnalysis} /></Card>
        <button onClick={onExit} className="btn-primary"><RotateCcw className="h-4 w-4" /> Wróć</button>
      </div>
    );
  }

  // questions phase
  const q = cs.questions[qIdx];
  const sel = answers[q.id];
  const isMulti = q.type === 'multi';

  const toggle = (i) => {
    if (submitted) return;
    if (isMulti) {
      setAnswers((prev) => {
        const cur = new Set(Array.isArray(sel) ? sel : []);
        if (cur.has(i)) cur.delete(i); else cur.add(i);
        return { ...prev, [q.id]: [...cur].sort() };
      });
      return;
    }
    setAnswers((prev) => ({ ...prev, [q.id]: i }));
    setSubmitted(true);
    sfx.click();
    setMaxCombo((m) => m + 1);
  };

  const submitMulti = () => {
    if (submitted || !hasSel) return;
    setSubmitted(true);
    sfx.click();
    setMaxCombo((m) => m + 1);
  };
  const hasSel = isMulti ? (Array.isArray(sel) && sel.length > 0) : (sel !== undefined && sel !== null);

  return (
    <div className="space-y-4 animate-slidein">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onExit} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200"><ArrowLeft className="h-4 w-4" /> Wyjdź</button>
        <span className="text-xs text-slate-400">{qIdx + 1} / {cs.questions.length}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-700/70"><div className="h-full rounded-full xp-bar transition-all" style={{ width: `${((qIdx + (submitted ? 1 : 0)) / cs.questions.length) * 100}%` }} /></div>

      {qIdx === 0 && (
        <Card className="py-3">
          <h1 className="font-bold text-slate-100">{cs.title}</h1>
          <p className="mt-1 text-sm text-slate-400 line-clamp-2">{cs.scenario.context}</p>
        </Card>
      )}

      {missionMode && <MissionBanner mission={missionMode.mission} hint="Kliknij odpowiedź — auto-dalej." />}

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Pill tone="accent">{q.points} pkt</Pill>
          <Pill tone="neutral">{isMulti ? 'Wielokrotnego wyboru' : 'Pojedynczego wyboru'}</Pill>
          {isMulti && <span className="text-[0.6875rem] text-slate-500">zaznacz wszystkie pasujące</span>}
        </div>
        <div className="font-semibold text-slate-100 mb-4">{q.prompt}</div>
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const picked = isMulti ? (Array.isArray(sel) && sel.includes(i)) : (sel === i);
            const correctSet = new Set(isMulti ? q.correct : [q.correct]);
            const isCorrect = correctSet.has(i);
            let cls = 'border-ink-700/60 bg-ink-850/40 hover:bg-ink-700/40';
            if (submitted) {
              if (isCorrect) cls = 'border-emerald-500/40 bg-emerald-500/10';
              else if (picked) cls = 'border-accent/30 bg-accent/5';
              else cls = 'border-ink-700/40 bg-ink-850/20 opacity-60';
            } else if (picked) cls = 'border-accent/40 bg-accent/10';
            return (
              <button key={i} onClick={() => toggle(i)} disabled={submitted} className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${cls}`}>
                <span className={`grid h-6 w-6 place-items-center rounded-md text-xs font-bold shrink-0 ${picked ? 'bg-accent text-white' : 'bg-ink-700 text-slate-300'}`}>{isMulti ? (picked ? '✓' : '○') : String.fromCharCode(65 + i)}</span>
                <span className="text-slate-200">{opt}</span>
                {submitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400 ml-auto shrink-0" />}
              </button>
            );
          })}
        </div>
        {!submitted ? (
          isMulti ? (
            <button onClick={submitMulti} disabled={!hasSel} className="btn-primary mt-4">Dalej</button>
          ) : null
        ) : (
          <p className="mt-3 text-xs text-accent-soft animate-pulse">Następne pytanie…</p>
        )}
      </Card>
    </div>
  );
}

function MissionBanner({ mission, hint }) {
  return (
    <div className="card card-pad bg-gold/5 border-gold/20 flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-gold/15 text-gold shrink-0"><Target className="h-5 w-5" /></div>
      <div className="min-w-0">
        <div className="text-[0.6875rem] uppercase tracking-wider text-gold">Misja — Boss</div>
        <div className="font-semibold text-slate-100 truncate">{mission.title}</div>
        <div className="text-xs text-slate-400">{hint}</div>
      </div>
    </div>
  );
}
