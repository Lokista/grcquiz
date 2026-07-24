import { useMemo } from 'react';
import {
  Flame, ArrowLeft, ChevronRight, TrendingDown, BookOpen,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, Pill, TopicBadge, ProgressBar } from '../components/ui.jsx';
import * as Sel from '../state/selectors.js';
import { pickWeakDrills } from '../data/interviewDayPlan.js';
import { topicByKey } from '../data/topics.js';

/**
 * Weak-topic trainer — progressive practice na najsłabszych tematach (stats mastery).
 */
export default function WeakTopicTrainerModule() {
  const { go } = useNav();
  const { state } = useProgress();

  const weak = useMemo(() => Sel.weakTopics(state, 5), [state]);
  const masteryList = useMemo(() => Sel.masteryPerTopic(state), [state]);

  return (
    <div className="space-y-5 animate-slidein">
      <button type="button" onClick={() => go('dayplan')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Day plan
      </button>

      <SectionHeader
        icon={Flame}
        title="Weak-topic trainer"
        subtitle="Więcej powtórek tam, gdzie mastery jest najniższe — jak progressive overload."
      />

      {weak.length === 0 && (
        <Card>
          <p className="text-sm text-slate-400">Brak statystyk — zrób kilka quizów / lekcji, wróć tu.</p>
          <button type="button" className="btn-primary mt-3" onClick={() => go('learn')}>
            <BookOpen className="h-4 w-4" />
            Nauka
          </button>
        </Card>
      )}

      <div className="space-y-4">
        {weak.map((w, i) => {
          const topic = topicByKey(w.key);
          const drills = pickWeakDrills(w.key, 4);
          const row = masteryList.find((m) => m.topic.key === w.key);
          return (
            <Card key={w.key} className={i === 0 ? 'ring-1 ring-amber-500/30' : ''}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {i === 0 && <Pill tone="warn"><TrendingDown className="h-3 w-3" /> Priorytet</Pill>}
                  <TopicBadge topicKey={w.key} />
                  <span className="text-sm font-semibold text-slate-100">{topic?.label || w.key}</span>
                </div>
                <Pill tone={w.mastery < 0.35 ? 'bad' : w.mastery < 0.6 ? 'warn' : 'good'}>
                  {Math.round(w.mastery * 100)}
                  %
                </Pill>
              </div>
              <ProgressBar value={w.mastery} barClass="xp-bar" />
              {row && (
                <div className="mt-1.5 text-[11px] text-slate-500">
                  Lekcje
                  {' '}
                  {row.lessonsDone}
                  /
                  {row.lessonsTotal}
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {drills.map((d) => (
                  <button
                    key={`${w.key}-${d.view}-${d.label}`}
                    type="button"
                    className="btn-primary"
                    onClick={() => go(d.view, d.params || {})}
                  >
                    {d.label}
                    <span className="text-[10px] opacity-70">
                      ~
                      {d.minutes}
                      m
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => go('learn', { topicKey: w.key })}
                >
                  Lekcje tematu
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
