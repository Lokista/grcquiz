import { useMemo, useState } from 'react';
import {
  CalendarCheck2, ArrowLeft, CheckCircle2, ChevronRight, Clock, Sparkles,
  RotateCcw, Flame, Target,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, Pill, TopicBadge } from '../components/ui.jsx';
import * as Sel from '../state/selectors.js';
import {
  DAY_PLAN_STEPS, loadDayPlanDone, saveDayPlanDone, pickWeakDrills,
} from '../data/interviewDayPlan.js';
import { topicByKey } from '../data/topics.js';
import { sfx } from '../utils/juice.js';

export default function InterviewDayPlanModule() {
  const { go } = useNav();
  const { state } = useProgress();
  const [done, setDone] = useState(loadDayPlanDone);

  const weak = useMemo(() => Sel.weakTopics(state, 3), [state]);
  const topWeak = weak[0];
  const weakDrills = useMemo(
    () => pickWeakDrills(topWeak?.key || 'basics', 3),
    [topWeak?.key],
  );

  const mark = (id) => {
    const next = { ...done, [id]: true };
    setDone(next);
    saveDayPlanDone(next);
    sfx.correct();
  };

  const reset = () => {
    setDone({});
    saveDayPlanDone({});
  };

  const completed = DAY_PLAN_STEPS.filter((s) => done[s.id]).length;
  const totalMin = DAY_PLAN_STEPS.reduce((a, s) => a + s.minutes, 0);

  return (
    <div className="space-y-5 animate-slidein">
      <button type="button" onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Mapa
      </button>

      <SectionHeader
        icon={CalendarCheck2}
        title="Interview day plan"
        subtitle={`Playbook „dziś rozmowa” · ~${totalMin} min · ${completed}/${DAY_PLAN_STEPS.length} kroków`}
      />

      <Card>
        <div className="flex flex-wrap items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent-soft ring-1 ring-accent/30 shrink-0">
            <Target className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-100">Twój fokus (weak topic)</div>
            {topWeak ? (
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <TopicBadge topicKey={topWeak.key} />
                <Pill tone={topWeak.mastery < 0.4 ? 'bad' : 'warn'}>
                  {Math.round(topWeak.mastery * 100)}
                  % mastery
                </Pill>
                <span className="text-xs text-slate-500">
                  {topicByKey(topWeak.key)?.label}
                </span>
              </div>
            ) : (
              <p className="text-sm text-slate-400 mt-1">Brak danych — zacznij od basics.</p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              Jak Today/playbook w AIron Coach: jedna ścieżka zamiast 18 pozycji w menu.
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="btn-ghost text-xs" onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset dnia
          </button>
          {completed === DAY_PLAN_STEPS.length && (
            <Pill tone="good"><CheckCircle2 className="h-3 w-3" /> Plan ukończony — powodzenia</Pill>
          )}
        </div>
      </Card>

      <div className="space-y-3">
        {DAY_PLAN_STEPS.map((step, i) => {
          const isDone = !!done[step.id];
          return (
            <Card key={step.id} className={isDone ? 'ring-1 ring-emerald-500/30' : ''}>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <Pill tone={isDone ? 'good' : 'accent'}>
                  Krok
                  {' '}
                  {i + 1}
                </Pill>
                <Pill tone="neutral">
                  <Clock className="h-3 w-3" />
                  ~
                  {step.minutes}
                  {' '}
                  min
                </Pill>
                {isDone && <Pill tone="good"><CheckCircle2 className="h-3 w-3" /> Done</Pill>}
              </div>
              <div className="font-semibold text-slate-100">{step.label}</div>
              <p className="mt-1 text-sm text-slate-400">{step.blurb}</p>

              {step.kind === 'weak' && (
                <div className="mt-3 space-y-2">
                  {weakDrills.map((d) => (
                    <button
                      key={`${d.view}-${d.label}`}
                      type="button"
                      className="btn-primary w-full sm:w-auto"
                      onClick={() => go(d.view, d.params || {})}
                    >
                      {d.label}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ))}
                  <button type="button" className="btn-ghost text-xs" onClick={() => go('weak')}>
                    <Flame className="h-3.5 w-3.5" />
                    Otwórz Weak-topic trainer
                  </button>
                </div>
              )}

              {step.kind === 'link' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="btn-primary" onClick={() => go(step.view)}>
                    Start
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  {step.altView && (
                    <button type="button" className="btn-ghost" onClick={() => go(step.altView)}>
                      Alternatywa
                    </button>
                  )}
                </div>
              )}

              <div className="mt-3">
                {!isDone ? (
                  <button type="button" className="btn-ghost text-xs" onClick={() => mark(step.id)}>
                    <Sparkles className="h-3.5 w-3.5" />
                    Oznacz jako zrobione
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400/80">Krok zaliczony</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
