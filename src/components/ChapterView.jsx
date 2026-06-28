import { ArrowLeft, Star, Lock, Check, ChevronRight } from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, ProgressBar, TopicIcon, Pill } from './ui.jsx';
import * as Sel from '../state/selectors.js';
import { MISSION_TYPES } from '../data/missions.js';
import { accent as topicAccent } from '../data/topics.js';
import { topicByKey } from '../data/topics.js';
import { sfx } from '../utils/juice.js';

export default function ChapterView() {
  const { params, go } = useNav();
  const { state } = useProgress();
  const topic = topicByKey(params.topicKey);
  if (!topic) {
    return <Card><p className="text-sm text-slate-400">Nie znaleziono świata.</p><button onClick={() => go('quest')} className="btn-ghost mt-3">Wróć do mapy</button></Card>;
  }
  const a = topicAccent(topic.key);
  const list = Sel.missionListForChapter(state, topic.key);
  const done = list.filter((x) => x.stars > 0).length;
  const stars = list.reduce((s, x) => s + x.stars, 0);
  const max = list.length * 3;

  return (
    <div className="space-y-5 animate-slidein">
      <button onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Mapa misji
      </button>

      <Card className="overflow-hidden relative">
        <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ background: 'radial-gradient(30rem 15rem at 90% -20%, rgba(59,130,246,0.25), transparent 60%)' }} />
        <div className="relative flex items-center gap-4">
          <div className={`grid h-14 w-14 place-items-center rounded-2xl ${a.bg} ${a.text} ring-1 ${a.ring}`}>
            <TopicIcon name={topic.icon} className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-slate-100">{topic.label}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{topic.blurb}</p>
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 text-gold" /> {stars}/{max}</span>
              <span>{done}/{list.length} misji</span>
            </div>
          </div>
        </div>
        <div className="relative mt-3"><ProgressBar value={done} max={list.length || 1} barClass={done >= list.length ? 'bg-emerald-500' : 'xp-bar'} /></div>
      </Card>

      {/* Mission path */}
      <div className="relative pl-4">
        <div className="absolute left-[26px] top-2 bottom-2 w-0.5 bg-ink-700/60" />
        <div className="space-y-3">
          {list.map(({ mission, stars: st, unlocked }, i) => {
            const meta = MISSION_TYPES[mission.type] || MISSION_TYPES.lesson;
            const Icon = meta.icon;
            const isBoss = mission.type === 'case' || mission.type === 'exam';
            return (
              <div key={mission.id} className="relative">
                {/* node dot */}
                <div className={`absolute -left-3 top-5 grid h-5 w-5 place-items-center rounded-full ring-4 ring-ink-950 ${st > 0 ? 'bg-gold' : 'bg-ink-700'}`}>
                  {st > 0 && <Check className="h-3 w-3 text-ink-950" />}
                </div>
                <button
                  onClick={() => { if (unlocked) { sfx.whoosh(); go(mission.route.view, mission.route.params); } }}
                  disabled={!unlocked}
                  className={`group w-full card card-pad text-left transition-all ${unlocked ? 'hover:ring-1 hover:ring-accent/30' : 'opacity-60'} ${isBoss ? 'border-rose-500/20' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`grid h-10 w-10 place-items-center rounded-lg shrink-0 ${isBoss ? 'bg-rose-500/15 text-rose-400' : 'bg-ink-700/60 text-slate-200'}`}>
                      {unlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-5 w-5 text-slate-500" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">Misja {i + 1}</span>
                        {isBoss && <Pill tone="bad">{mission.type === 'exam' ? 'Egzamin' : 'Boss'}</Pill>}
                        {st === 3 && <Pill tone="gold"><Star className="h-3 w-3 fill-gold" /> Perfekcyjnie</Pill>}
                      </div>
                      <div className="font-semibold text-slate-100 truncate">{mission.title}</div>
                      <div className="text-xs text-slate-500 truncate">{mission.subtitle}</div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[0,1,2].map((k) => (
                          <Star key={k} className={`h-3.5 w-3.5 ${k < st ? 'fill-gold text-gold' : 'text-slate-700'}`} />
                        ))}
                      </div>
                      {unlocked && <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-accent-soft" />}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
