import { useState } from 'react';
import {
  Mic2, ArrowLeft, Clock, ChevronRight, CheckCircle2, ListChecks, Sparkles,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { Card, SectionHeader, Pill } from '../components/ui.jsx';
import { MOCK_INTERVIEW } from '../data/mockInterview.js';

/**
 * Orkiestrator mocku 45 min — uruchamia istniejące moduły (interview / cases / think).
 */
export default function MockInterviewModule() {
  const { go } = useNav();
  const [done, setDone] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aq_mock45_done') || '{}');
    } catch {
      return {};
    }
  });

  const mark = (phaseId) => {
    const next = { ...done, [phaseId]: true };
    setDone(next);
    localStorage.setItem('aq_mock45_done', JSON.stringify(next));
  };

  const reset = () => {
    setDone({});
    localStorage.removeItem('aq_mock45_done');
  };

  const m = MOCK_INTERVIEW;
  const completed = m.phases.filter((p) => done[p.id]).length;

  return (
    <div className="space-y-5 animate-slidein">
      <SectionHeader
        icon={Mic2}
        title={m.title}
        subtitle={`${m.subtitle} · ~${m.totalMinutes} min · ukończono ${completed}/${m.phases.length} faz`}
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
          <Clock className="h-4 w-4 text-accent-soft" />
          <span>Ustaw timer 45 min. Idź fazami po kolei — po każdym module wróć tu (przycisk wstecz / mapa).</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="btn-ghost text-xs" onClick={reset}>
            Reset postępu mocku
          </button>
          {completed === m.phases.length && (
            <Pill tone="good"><CheckCircle2 className="h-3 w-3" /> Mock ukończony — zobacz debrief poniżej</Pill>
          )}
        </div>
      </Card>

      <div className="space-y-3">
        {m.phases.map((phase, i) => {
          const isDone = !!done[phase.id];
          return (
            <Card key={phase.id} className={isDone ? 'ring-1 ring-emerald-500/30' : ''}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Pill tone={isDone ? 'good' : 'accent'}>Faza {i + 1}</Pill>
                    <Pill tone="neutral">~{phase.minutes} min</Pill>
                    {isDone && <Pill tone="good"><CheckCircle2 className="h-3 w-3" /> Done</Pill>}
                  </div>
                  <div className="font-semibold text-slate-100">{phase.label}</div>
                  <p className="mt-1 text-sm text-slate-400">{phase.blurb}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {phase.action && (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      mark(phase.id);
                      go(phase.action.view, phase.action.params);
                    }}
                  >
                    <Sparkles className="h-4 w-4" /> Start fazy
                  </button>
                )}
                {phase.choices?.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    className="btn-ghost border border-ink-600/60"
                    onClick={() => {
                      mark(phase.id);
                      go(c.view, c.params);
                    }}
                  >
                    {c.label} <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
                {phase.steps?.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    className="btn-ghost border border-ink-600/60"
                    onClick={() => {
                      mark(phase.id);
                      go(s.view, s.params);
                    }}
                  >
                    {s.label} <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
                {!isDone && (
                  <button type="button" className="btn-ghost text-xs" onClick={() => mark(phase.id)}>
                    Oznacz jako zrobione bez startu
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="flex items-center gap-2 font-semibold text-slate-100 mb-2">
          <ListChecks className="h-4 w-4 text-accent-soft" /> Debrief po mocku
        </div>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-300">
          {m.debrief.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <button type="button" className="btn-ghost mt-4 text-sm" onClick={() => go('quest')}>
          <ArrowLeft className="h-4 w-4" /> Wróć do mapy
        </button>
      </Card>
    </div>
  );
}
