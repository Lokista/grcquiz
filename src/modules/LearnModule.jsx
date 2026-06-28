import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen, ArrowLeft, CheckCircle2, Circle, Clock,
  Lightbulb, MessageSquareQuote, AlertTriangle, HelpCircle, Target,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { useMission } from '../state/MissionContext.jsx';
import { Card, SectionHeader, TopicBadge, TopicIcon, Markdown, Pill, EmptyState } from '../components/ui.jsx';
import { TOPICS, accent } from '../data/topics.js';
import { LESSONS, lessonsByTopic, lessonById } from '../data/lessons/index.js';
import { getRichQuizExplain } from '../data/quizRichExplains.js';
import QuizExplain from '../components/QuizExplain.jsx';
import { sfx } from '../utils/juice.js';

export default function LearnModule() {
  const { params, go } = useNav();
  const mission = useMission();

  // Tryb misji
  if (mission.active && mission.content?.lesson) {
    return (
      <LessonDetail
        key={`m-${mission.mission.id}-${params.rerun || 0}`}
        lesson={mission.content.lesson}
        missionMode={mission}
        onBack={() => go('chapter', { topicKey: mission.mission.chapterKey })}
      />
    );
  }
  // Tryb swobodny: konkretna lekcja
  if (params.lessonId) {
    const lesson = lessonById(params.lessonId);
    if (lesson) return <LessonDetail lesson={lesson} onBack={() => go('learn', { topicKey: params.topicKey })} />;
  }
  return <LessonList initialTopic={params.topicKey} />;
}

function LessonList({ initialTopic }) {
  const { go } = useNav();
  const { state } = useProgress();
  const [topicFilter, setTopicFilter] = useState(initialTopic || 'all');

  const filtered = useMemo(() => LESSONS.filter((l) => {
    if (topicFilter !== 'all' && l.topicKey !== topicFilter) return false;
    return true;
  }), [topicFilter]);

  const grouped = useMemo(() => {
    if (topicFilter !== 'all') return [{ topic: TOPICS.find((t) => t.key === topicFilter), lessons: filtered }];
    const map = {};
    for (const l of filtered) (map[l.topicKey] ||= []).push(l);
    return TOPICS.map((t) => ({ topic: t, lessons: map[t.key] || [] })).filter((g) => g.lessons.length);
  }, [filtered, topicFilter]);

  const doneCount = (key) => {
    const lessons = state.topics[key]?.lessons || {};
    return Object.keys(lessons).filter((k) => lessons[k]).length;
  };

  return (
    <div className="space-y-5 animate-slidein">
      <SectionHeader
        icon={BookOpen}
        title="Tryb nauki (swobodny)"
        subtitle="Najpierw mini-quiz, potem definicja i materiał. W kampanii — misje z gwiazdkami przez Mapę misji."
      />
      <Card>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={topicFilter === 'all'} onClick={() => setTopicFilter('all')}>Wszystkie ({LESSONS.length})</FilterChip>
          {TOPICS.map((t) => (
            <FilterChip key={t.key} active={topicFilter === t.key} onClick={() => setTopicFilter(t.key)}>
              <TopicIcon name={t.icon} className="h-3.5 w-3.5" />
              {t.label} ({doneCount(t.key)}/{lessonsByTopic(t.key).length})
            </FilterChip>
          ))}
        </div>
      </Card>

      {grouped.length === 0 && <EmptyState title="Brak lekcji" icon={BookOpen}>Zmień filtr tematu.</EmptyState>}

      {grouped.map(({ topic, lessons }) => {
        const a = accent(topic.key);
        return (
          <div key={topic.key}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className={`grid h-7 w-7 place-items-center rounded-md ${a.bg} ${a.text}`}><TopicIcon name={topic.icon} className="h-4 w-4" /></span>
              <h3 className="text-sm font-bold text-slate-200">{topic.label}</h3>
              <span className="text-xs text-slate-500">· {lessons.length} lekcji</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lessons.map((l) => {
                const done = !!state.topics[l.topicKey]?.lessons?.[l.id];
                return (
                  <button key={l.id} onClick={() => go('learn', { lessonId: l.id })} className="group card card-pad text-left hover:ring-1 hover:ring-accent/30 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-slate-100 group-hover:text-accent-soft transition-colors">{l.title}</div>
                      {done ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" /> : <Circle className="h-5 w-5 text-slate-600 shrink-0" />}
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500"><Clock className="h-3 w-3" /> ~{l.minutes} min<span className="text-slate-600">·</span><span>quiz → materiał</span></div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`chip border transition-colors ${active ? 'bg-accent/15 text-accent-soft border-accent/30' : 'bg-ink-700/50 text-slate-300 border-ink-600/60 hover:bg-ink-700'}`}>
      {children}
    </button>
  );
}

const TABS = [
  { key: 'definition', label: 'Definicja', icon: Lightbulb },
  { key: 'example', label: 'Przykład', icon: BookOpen },
  { key: 'interview', label: 'Jak odpowiadać', icon: MessageSquareQuote },
  { key: 'mistakes', label: 'Typowe błędy', icon: AlertTriangle },
  { key: 'quiz', label: 'Mini-quiz', icon: HelpCircle },
];

function LessonDetail({ lesson, onBack, missionMode }) {
  const { recordLessonDone, recordQuiz, state } = useProgress();
  const hasQuiz = !!lesson.quiz;
  const [phase, setPhase] = useState(hasQuiz ? 'quiz' : 'learn');
  const [tab, setTab] = useState('definition');
  const done = !!state.topics[lesson.topicKey]?.lessons?.[lesson.id];

  const markDone = () => { if (!done) recordLessonDone(lesson.topicKey, lesson.id); };

  const handleQuizAnswer = () => {
    recordQuiz(lesson.topicKey, true);
    sfx.click();
    markDone();
    setPhase('learn');
    setTab('definition');
  };

  const finishMission = () => {
    if (!missionMode) return;
    missionMode.complete(3);
  };

  useEffect(() => {
    if (!missionMode || phase !== 'learn') return undefined;
    const t = setTimeout(finishMission, 700);
    return () => clearTimeout(t);
  }, [missionMode, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const LEARN_TABS = TABS.filter((t) => t.key !== 'quiz');

  return (
    <div className="space-y-4 animate-slidein">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> {missionMode ? 'Wróć do świata' : 'Wróć do lekcji'}
      </button>

      {missionMode && (
        <MissionBanner
          mission={missionMode.mission}
          hint={phase === 'quiz' ? 'Najpierw mini-quiz — potem zobaczysz definicję i materiał.' : 'Przeczytaj materiał, potem zakończ misję.'}
        />
      )}

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <TopicBadge topicKey={lesson.topicKey} className="mb-2" />
            <h1 className="text-xl font-bold text-slate-100">{lesson.title}</h1>
            <div className="mt-1 text-xs text-slate-500"><Clock className="inline h-3 w-3" /> ~{lesson.minutes} min</div>
          </div>
          {phase === 'learn' && !missionMode && (
            <button onClick={markDone} disabled={done} className={done ? 'btn-ghost' : 'btn-primary'}>
              <CheckCircle2 className="h-4 w-4" /> {done ? 'Zaliczone' : 'Zalicz (+10 XP)'}
            </button>
          )}
        </div>
      </Card>

      {phase === 'quiz' && hasQuiz && (
        <Card>
          <MiniQuiz lesson={lesson} onAnswer={handleQuizAnswer} />
        </Card>
      )}

      {phase === 'learn' && (
        <>
          {hasQuiz && (
            <Card className="flex flex-wrap items-center gap-3 py-3">
              <Pill tone="good">Quiz ✓ +XP</Pill>
              <span className="text-sm text-slate-400">Materiał do nauki poniżej.</span>
            </Card>
          )}

          <div className="flex flex-wrap gap-1.5">
            {LEARN_TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button key={t.key} onClick={() => setTab(t.key)} className={`chip border transition-colors ${active ? 'bg-accent/15 text-accent-soft border-accent/30' : 'bg-ink-700/50 text-slate-300 border-ink-600/60 hover:bg-ink-700'}`}>
                  <Icon className="h-3.5 w-3.5" /> {t.label}
                </button>
              );
            })}
          </div>

          <Card>
            {tab === 'definition' && (<><DefHead icon={Lightbulb} label="Definicja" /><Markdown text={lesson.definition} /></>)}
            {tab === 'example' && (<><DefHead icon={BookOpen} label="Przykład z życia" /><Markdown text={lesson.example} /></>)}
            {tab === 'interview' && (<><DefHead icon={MessageSquareQuote} label="Jak odpowiadać na rozmowie" /><div className="rounded-lg border border-accent/20 bg-accent/5 p-4"><Markdown text={lesson.interviewAnswer} /></div></>)}
            {tab === 'mistakes' && (
              <>
                <DefHead icon={AlertTriangle} label="Typowe błędy do uniknięcia" />
                <ul className="space-y-2">
                  {lesson.commonMistakes.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300"><AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" /><span>{m}</span></li>
                  ))}
                </ul>
              </>
            )}
          </Card>

          {missionMode && phase === 'learn' && (
            <p className="text-xs text-gold animate-pulse">Następna misja za chwilę…</p>
          )}
        </>
      )}
    </div>
  );
}

function MissionBanner({ mission, hint }) {
  return (
    <div className="card card-pad bg-gold/5 border-gold/20 flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-gold/15 text-gold shrink-0">
        <Target className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-gold">Misja</div>
        <div className="font-semibold text-slate-100 truncate">{mission.title}</div>
        <div className="text-xs text-slate-400">{hint}</div>
      </div>
    </div>
  );
}

function DefHead({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 text-slate-200 mb-3">
      <Icon className="h-4 w-4 text-accent-soft" /><span className="font-semibold">{label}</span>
    </div>
  );
}

function MiniQuiz({ lesson, onAnswer }) {
  const { quiz } = lesson;
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  if (!quiz) return <p className="text-sm text-slate-400">Ta lekcja nie ma mini-quizu.</p>;

  const richExplain = getRichQuizExplain(lesson.id, quiz.explain);

  const choose = (idx) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    onAnswer();
  };

  return (
    <div className="space-y-3">
      <DefHead icon={HelpCircle} label="Mini-quiz — zacznij tutaj" />
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
        <div className="font-semibold text-slate-100 mb-3">{quiz.question}</div>
        <div className="space-y-2">
          {quiz.options.map((opt, idx) => {
            const isCorrect = idx === quiz.correct;
            const isPicked = idx === selected;
            let cls = 'border-ink-700/60 bg-ink-850/40 hover:bg-ink-700/40';
            if (revealed) {
              if (isCorrect) cls = 'border-emerald-500/40 bg-emerald-500/10';
              else if (isPicked) cls = 'border-accent/30 bg-accent/5';
              else cls = 'border-ink-700/40 bg-ink-850/20 opacity-60';
            }
            return (
              <button key={idx} onClick={() => choose(idx)} disabled={revealed} className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${cls}`}>
                <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${revealed && isCorrect ? 'bg-emerald-500 text-white' : revealed && isPicked ? 'bg-accent text-white' : 'bg-ink-700 text-slate-300'}`}>{String.fromCharCode(65 + idx)}</span>
                <span className="text-slate-200">{opt}</span>
              </button>
            );
          })}
        </div>
        {revealed && (
          <div className="mt-4 rounded-lg border border-ink-700/60 bg-ink-850/60 p-3 animate-pop">
            <div className="flex items-center gap-2 mb-1.5">
              <Pill tone="good">+5 XP</Pill>
            </div>
            <div className="text-sm text-slate-300"><strong className="text-slate-100">Odpowiedź:</strong> {quiz.options[quiz.correct]}</div>
            <QuizExplain explain={richExplain} className="mt-2" />
            <p className="mt-3 text-xs text-accent-soft">Przechodzisz do materiału…</p>
          </div>
        )}
      </div>
    </div>
  );
}
