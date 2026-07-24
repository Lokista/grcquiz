import { useEffect, useMemo, useState, useRef } from 'react';
import {
  MessagesSquare, ArrowLeft, CheckCircle2, Star, ChevronRight, RotateCcw,
  Award, ListChecks, Sparkles, Target, Flame, Lightbulb,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { useMission } from '../state/MissionContext.jsx';
import AnswerBuilder from '../components/AnswerBuilder.jsx';
import { Card, SectionHeader, TopicBadge, Pill, EmptyState, scoreTone } from '../components/ui.jsx';
import { TOPICS, accent } from '../data/topics.js';
import { INTERVIEW_QUESTIONS, buildAnswerOptions, evaluateSelection } from '../data/interview.js';
import { sfx, burst } from '../utils/juice.js';

const DIFF_LABEL = { soft: 'Soft', tech: 'Techniczne', mixed: 'Mieszane' };
const DIFF_TONE = { soft: 'gold', tech: 'accent', mixed: 'warn' };
const AUTO_MS = 450;

export default function InterviewModule() {
  const { params, go } = useNav();
  const mission = useMission();

  if (mission.active && mission.content?.queue) {
    return (
      <InterviewRun
        key={`m-${mission.mission.id}-${params.rerun || 0}`}
        queue={mission.content.queue}
        startIndex={0}
        missionMode={mission}
        onExit={() => go('chapter', { topicKey: mission.mission.chapterKey })}
      />
    );
  }
  if (params.mode === 'run') {
    return (
      <InterviewRun
        queue={params.queue || []}
        startIndex={params.startIndex || 0}
        daily={!!params.daily}
        exam={!!params.exam}
        examMinutes={params.examMinutes || 15}
        onExit={() => go(params.exam ? 'exam' : params.daily ? 'daily' : 'interview')}
      />
    );
  }
  return <InterviewList />;
}

function InterviewList() {
  const { go } = useNav();
  const { state } = useProgress();
  const [topicFilter, setTopicFilter] = useState('all');
  const [onlyPending, setOnlyPending] = useState(false);

  const filtered = useMemo(() => INTERVIEW_QUESTIONS.filter((q) => {
    if (topicFilter !== 'all' && q.topicKey !== topicFilter) return false;
    if (onlyPending && state.interview[q.id]) return false;
    return true;
  }), [topicFilter, onlyPending, state.interview]);

  const startSim = () => {
    const queue = (topicFilter === 'all' ? INTERVIEW_QUESTIONS : INTERVIEW_QUESTIONS.filter((q) => q.topicKey === topicFilter)).map((q) => q.id);
    go('interview', { mode: 'run', queue, startIndex: 0 });
  };

  return (
    <div className="space-y-5 animate-slidein">
      <SectionHeader icon={MessagesSquare} title="Rozmowa rekrutacyjna (swobodny)" subtitle="Kliknij karty i leć dalej — zawsze +XP, bez kar." />
      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <button onClick={startSim} className="btn-primary"><Sparkles className="h-4 w-4" /> Rozpocznij symulację</button>
          <span className="text-xs text-slate-500">({topicFilter === 'all' ? INTERVIEW_QUESTIONS.length : filtered.length} pytań)</span>
          <label className="ml-auto flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
            <input type="checkbox" checked={onlyPending} onChange={(e) => setOnlyPending(e.target.checked)} className="accent-blue-500" /> Tylko nieodpowiedziane
          </label>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={topicFilter === 'all'} onClick={() => setTopicFilter('all')}>Wszystkie tematy</FilterChip>
          {TOPICS.map((t) => <FilterChip key={t.key} active={topicFilter === t.key} onClick={() => setTopicFilter(t.key)}>{t.label}</FilterChip>)}
        </div>
      </Card>
      <div className="space-y-2.5">
        {filtered.map((q) => {
          const rec = state.interview[q.id];
          return (
            <button key={q.id} onClick={() => go('interview', { mode: 'run', queue: [q.id], startIndex: 0 })} className="group card card-pad text-left w-full hover:ring-1 hover:ring-accent/30 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5"><Pill tone={DIFF_TONE[q.difficulty]}>{DIFF_LABEL[q.difficulty]}</Pill><TopicBadge topicKey={q.topicKey} /></div>
                  <div className="font-semibold text-slate-100 group-hover:text-accent-soft transition-colors">{q.question}</div>
                </div>
                <div className="shrink-0 text-right">{rec ? <Pill tone={scoreTone(rec.best)}><Star className="h-3 w-3" /> {rec.attempts}×</Pill> : <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-accent-soft" />}</div>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && <EmptyState title="Brak pytań w tym filtrze" icon={ListChecks}>Zmień filtr.</EmptyState>}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return <button onClick={onClick} className={`chip border transition-colors ${active ? 'bg-accent/15 text-accent-soft border-accent/30' : 'bg-ink-700/50 text-slate-300 border-ink-600/60 hover:bg-ink-700'}`}>{children}</button>;
}

function InterviewRun({ queue, startIndex, onExit, missionMode, daily, exam, examMinutes }) {
  const { recordInterview, removeRetry, recordCombo, recordDaily } = useProgress();
  const [idx, setIdx] = useState(startIndex);
  const [selectedIds, setSelectedIds] = useState([]);
  const [result, setResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(() => (exam ? (examMinutes || 15) * 60 : null));
  const timedOut = useRef(false);

  const q = INTERVIEW_QUESTIONS.find((x) => x.id === queue[idx]);
  const options = useMemo(() => (q ? buildAnswerOptions(q) : []), [q]);

  useEffect(() => {
    if (!exam || secondsLeft === null || finished) return undefined;
    if (secondsLeft <= 0) {
      if (!timedOut.current) {
        timedOut.current = true;
        sfx.wrong();
        finishRun();
      }
      return undefined;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [exam, secondsLeft, finished]); // eslint-disable-line react-hooks/exhaustive-deps

  const finishRun = () => {
    recordCombo(maxCombo);
    if (daily) {
      recordDaily(100);
      burst({ stars: 3 });
      sfx.fanfare();
    }
    if (missionMode) {
      missionMode.complete(3);
      return;
    }
    if (exam) sfx.fanfare();
    setFinished(true);
  };

  const advance = () => {
    if (idx + 1 >= queue.length) finishRun();
    else {
      setIdx((i) => i + 1);
      setSelectedIds([]);
      setResult(null);
      setShowHint(false);
    }
  };

  const evaluate = () => {
    if (selectedIds.length === 0 || !q) return;
    const res = evaluateSelection(q, selectedIds);
    setResult(res);
    recordInterview(q.id, res.covered, res.total, q.topicKey);
    sfx.click();
    setCombo((c) => { const nc = c + 1; setMaxCombo((m) => Math.max(m, nc)); return nc; });
    removeRetry('interview', q.id);
  };

  useEffect(() => {
    if (!result) return undefined;
    const t = setTimeout(advance, AUTO_MS);
    return () => clearTimeout(t);
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!q && !finished) return <Card><EmptyState title="Brak pytań" icon={MessagesSquare} /><button onClick={onExit} className="btn-ghost mt-3">Wróć</button></Card>;
  if (finished) {
    return (
      <RunSummary
        maxCombo={maxCombo}
        daily={daily}
        exam={exam}
        queue={queue}
        timedOut={timedOut.current}
        onExit={onExit}
      />
    );
  }

  const a = accent(q.topicKey);
  const mm = secondsLeft !== null ? Math.floor(secondsLeft / 60) : 0;
  const ss = secondsLeft !== null ? secondsLeft % 60 : 0;
  const timeUrgent = exam && secondsLeft !== null && secondsLeft < 60;

  return (
    <div className="space-y-4 animate-slidein">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onExit} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200"><ArrowLeft className="h-4 w-4" /> {missionMode ? 'Wróć' : exam ? 'Przerwij egzamin' : daily ? 'Przerwij' : 'Wyjdź'}</button>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          {exam && secondsLeft !== null && (
            <span className={`inline-flex items-center gap-1 font-semibold tabular-nums ${timeUrgent ? 'text-rose-400' : 'text-accent-soft'}`}>
              <Target className="h-3.5 w-3.5" /> {mm}:{String(ss).padStart(2, '0')}
            </span>
          )}
          {combo >= 2 && <span className="inline-flex items-center gap-1 text-amber-400 font-semibold"><Flame className="h-3.5 w-3.5" /> x{combo}</span>}
          <span>{idx + 1} / {queue.length}</span>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-700/70"><div className="h-full rounded-full xp-bar transition-all" style={{ width: `${((idx + (result ? 1 : 0)) / queue.length) * 100}%` }} /></div>

      {missionMode && <MissionBanner mission={missionMode.mission} hint="Wybierz karty i leć — auto-dalej." />}
      {daily && <div className="card card-pad py-2 bg-gold/5 border-gold/20 text-sm text-slate-300">Wyzwanie dnia · {queue.length} pytań</div>}
      {exam && <div className="card card-pad py-2 bg-accent/5 border-accent/20 text-sm text-slate-300">Exam mode · bez podpowiedzi · debrief na końcu</div>}

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <span className={`chip ${a.bg} ${a.text} border ${a.border}`}><span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} /> Pytanie</span>
          <Pill tone={DIFF_TONE[q.difficulty]}>{DIFF_LABEL[q.difficulty]}</Pill>
        </div>
        <div className="font-medium text-slate-100 mb-4">{q.question}</div>
        <div className="flex items-center justify-between mb-2">
          <span className="label">Zbuduj odpowiedź</span>
          {!exam && (
            <button onClick={() => setShowHint((v) => !v)} className="text-xs text-slate-400 hover:text-accent-soft inline-flex items-center gap-1"><Lightbulb className="h-3.5 w-3.5" /> {showHint ? 'Ukryj' : 'Podpowiedź'}</button>
          )}
        </div>
        {showHint && !result && !exam && (
          <div className="mb-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2 text-xs text-slate-300">
            Szukaj ok. <strong className="text-amber-400">{q.keyPoints.length}</strong> elementów w puli.
          </div>
        )}
        <AnswerBuilder options={options} selectedIds={selectedIds} onChange={setSelectedIds} disabled={!!result} />
        {!result ? (
          <div className="mt-4 flex items-center gap-2">
            <button onClick={evaluate} disabled={selectedIds.length === 0} className="btn-primary">Dalej</button>
            <span className="text-xs text-slate-500">+XP za każde pytanie</span>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 text-sm text-accent-soft animate-pulse">
            <CheckCircle2 className="h-4 w-4" /> +XP · następne…
          </div>
        )}
      </Card>
    </div>
  );
}

function RunSummary({ maxCombo, daily, exam, queue, timedOut, onExit }) {
  const questions = (queue || []).map((id) => INTERVIEW_QUESTIONS.find((q) => q.id === id)).filter(Boolean);

  if (exam) {
    return (
      <div className="space-y-4 animate-slidein">
        <SectionHeader
          icon={Award}
          title={timedOut ? 'Czas minął — debrief' : 'Egzamin ukończony'}
          subtitle="Teraz możesz przejrzeć wzorcowe odpowiedzi (niedostępne w trakcie)."
        />
        {timedOut && (
          <Card className="border-rose-500/30 bg-rose-500/5 text-sm text-rose-200">
            Timer dobiegł końca. Poniżej idealne odpowiedzi do nauki.
          </Card>
        )}
        {maxCombo >= 3 && <Card className="text-center text-amber-400 text-sm"><Flame className="inline h-4 w-4" /> Combo x{maxCombo}</Card>}
        <div className="space-y-3">
          {questions.map((q, i) => (
            <Card key={q.id}>
              <div className="text-xs text-slate-500 mb-1">Pytanie {i + 1}</div>
              <div className="font-medium text-slate-100 mb-2">{q.question}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-accent-soft mb-1">Idealna odpowiedź</div>
              <p className="text-sm text-slate-300 leading-relaxed">{q.idealAnswer}</p>
              {q.commonMistakes?.length > 0 && (
                <ul className="mt-2 list-disc pl-4 text-xs text-slate-500 space-y-0.5">
                  {q.commonMistakes.map((m) => <li key={m}>Unikaj: {m}</li>)}
                </ul>
              )}
            </Card>
          ))}
        </div>
        <button type="button" onClick={onExit} className="btn-primary"><RotateCcw className="h-4 w-4" /> Wróć do Exam</button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slidein">
      <SectionHeader icon={daily ? Target : Award} title={daily ? 'Wyzwanie dnia ✓' : 'Gotowe!'} subtitle="Zawsze +XP — bez kar" />
      {maxCombo >= 3 && <Card className="text-center text-amber-400 text-sm"><Flame className="inline h-4 w-4" /> Combo x{maxCombo}</Card>}
      <button onClick={onExit} className="btn-primary"><RotateCcw className="h-4 w-4" /> {daily ? 'Wróć' : 'Wróć do listy'}</button>
    </div>
  );
}

function MissionBanner({ mission, hint }) {
  return (
    <div className="card card-pad py-2 bg-gold/5 border-gold/20 flex items-center gap-3">
      <Target className="h-5 w-5 text-gold shrink-0" />
      <div className="min-w-0">
        <div className="font-semibold text-slate-100 truncate">{mission.title}</div>
        <div className="text-xs text-slate-400">{hint}</div>
      </div>
    </div>
  );
}
