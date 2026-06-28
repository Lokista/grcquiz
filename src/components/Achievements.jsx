import { ArrowLeft, Trophy, Lock, Star, Zap } from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { SectionHeader, Pill } from '../components/ui.jsx';
import { ACHIEVEMENTS } from '../data/achievements.js';

export default function Achievements() {
  const { go } = useNav();
  const { state } = useProgress();
  const owned = new Set(state.achievements || []);
  const earned = ACHIEVEMENTS.filter((a) => owned.has(a.id));

  return (
    <div className="space-y-5 animate-slidein">
      <button onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Mapa misji
      </button>
      <SectionHeader
        icon={Trophy}
        title="Osiągnięcia"
        subtitle={`${earned.length}/${ACHIEVEMENTS.length} odznak · każda daje +15 XP`}
        right={<Pill tone="gold"><Star className="h-3 w-3" /> {earned.length}</Pill>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((a) => {
          const got = owned.has(a.id);
          const Icon = a.icon;
          return (
            <div
              key={a.id}
              className={`card card-pad flex items-start gap-3 ${got ? 'border-gold/30' : 'opacity-70'}`}
            >
              <div className={`grid h-11 w-11 place-items-center rounded-lg shrink-0 ${got ? 'bg-gold/15 text-gold' : 'bg-ink-700/60 text-slate-500'}`}>
                {got ? <Icon className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-100">{a.title}</span>
                  {got && <Pill tone="gold"><Zap className="h-3 w-3" /> +15</Pill>}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{a.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
