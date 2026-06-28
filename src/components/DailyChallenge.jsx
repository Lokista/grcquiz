import { Target, ArrowLeft, Star, Zap, Flame, CheckCircle2, Sparkles } from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, Pill } from '../components/ui.jsx';
import { INTERVIEW_QUESTIONS } from '../data/interview.js';
import { sfx } from '../utils/juice.js';

export default function DailyChallenge() {
  const { go } = useNav();
  const { state, isDailyAvailable } = useProgress();
  const avail = isDailyAvailable();
  const d = state.daily || {};

  const start = () => {
    // 5 losowych pytań
    const shuffled = [...INTERVIEW_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5).map((q) => q.id);
    sfx.whoosh();
    go('interview', { mode: 'run', queue: shuffled, daily: true, startIndex: 0 });
  };

  return (
    <div className="space-y-5 animate-slidein">
      <button onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Mapa misji
      </button>
      <SectionHeader icon={Target} title="Wyzwanie dnia" subtitle="5 losowych pytań rekrutacyjnych. Jedna próba dziennie — duże XP." />

      <Card className="text-center">
        <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-2xl bg-gold/15 text-gold ring-1 ring-gold/30">
          <Target className="h-8 w-8" />
        </div>
        {avail ? (
          <>
            <h2 className="text-xl font-bold text-slate-100">Wyzwanie czeka!</h2>
            <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
              Odpowiedz na 5 losowych pytań rekrutacyjnych. Za ukończenie zdobywasz <span className="text-gold font-semibold">+25 XP</span> bonus i gwiazdki.
              Uważaj — dziś masz tylko jedną próbę.
            </p>
            <button onClick={start} className="btn-primary mt-5">
              <Sparkles className="h-4 w-4" /> Rozpocznij wyzwanie
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-slate-100">Ukończono dziś!</h2>
            <div className="mt-3 flex items-center justify-center gap-3">
              <Pill tone="good"><CheckCircle2 className="h-3.5 w-3.5" /> Wynik: {d.bestScore || 0}%</Pill>
              <Pill tone="gold"><Zap className="h-3.5 w-3.5" /> +25 XP</Pill>
            </div>
            <p className="mt-3 text-sm text-slate-400">Wróć jutro po nowe wyzwanie. Utrzymuj serię dni z rzędu!</p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-amber-400 text-sm">
              <Flame className="h-4 w-4" /> Seria: {state.streak || 0} dni
            </div>
          </>
        )}
      </Card>

      <Card>
        <div className="label mb-2">Zasady</div>
        <ul className="space-y-1.5 text-sm text-slate-300">
          <li className="flex items-start gap-2"><Star className="h-4 w-4 text-gold mt-0.5" /> Wynik ≥80% = 3 gwiazdki, ≥50% = 2, poniżej = 1.</li>
          <li className="flex items-start gap-2"><Zap className="h-4 w-4 text-amber-400 mt-0.5" /> Bonus +25 XP za pierwsze ukończenie danego dnia.</li>
          <li className="flex items-start gap-2"><Flame className="h-4 w-4 text-amber-400 mt-0.5" /> Codzienne ćwiczenie buduje serię (streak).</li>
        </ul>
      </Card>
    </div>
  );
}
