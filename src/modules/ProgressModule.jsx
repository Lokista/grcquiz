import {
  BarChart3, ShieldCheck, Zap, Flame, BookOpen, HelpCircle,
  MessagesSquare, Brain, Layers, TrendingUp, Trash2,
  AlertTriangle, Star, Trophy, ArrowLeft,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, ProgressBar, Pill, TopicIcon } from '../components/ui.jsx';
import * as Sel from '../state/selectors.js';
import { accent } from '../data/topics.js';
import { ACHIEVEMENTS } from '../data/achievements.js';

export default function ProgressModule() {
  const { go } = useNav();
  const { state, levelInfo, reset } = useProgress();
  const info = levelInfo();
  const masteryList = Sel.masteryPerTopic(state);
  const overall = Sel.overallMastery(state);
  const stars = Sel.totalStars(state);
  const earnedBadges = (state.achievements || []).length;

  return (
    <div className="space-y-5 animate-slidein">
      <button onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Mapa misji
      </button>
      <SectionHeader
        icon={BarChart3}
        title="Statystyki gry"
        subtitle="Poziom, XP i postęp w kampanii. Tylko zdobywanie — bez kar."
      />

      {/* Level hero */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-accent/15 text-accent-soft ring-1 ring-accent/30">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400">Poziom {info.level}</div>
              <div className="text-2xl font-extrabold text-slate-100">{info.title}</div>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-semibold text-slate-200">{state.xp} XP</span>
                {state.streak > 0 && <span className="inline-flex items-center gap-1 text-amber-400"><Flame className="h-3.5 w-3.5" /> {state.streak} dni</span>}
              </div>
            </div>
          </div>
          <div className="w-full sm:w-72">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Do poziomu {info.level + 1}</span>
              <span className="font-semibold text-slate-200">{info.toNext} XP</span>
            </div>
            <ProgressBar value={info.intoLevel} max={info.span} />
            <div className="mt-1.5 text-[0.6875rem] text-slate-500">{Math.round(info.pct * 100)}% aktualnego poziomu</div>
          </div>
        </div>
      </Card>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Stat icon={Star} label="Gwiazdki" value={stars} tone="gold" />
        <Stat icon={Trophy} label="Odznaki" value={`${earnedBadges}/${ACHIEVEMENTS.length}`} tone="gold" />
        <Stat icon={TrendingUp} label="Opanowanie" value={`${Math.round(overall * 100)}%`} tone="accent" />
        <Stat icon={BookOpen} label="Lekcje" value={`${Sel.lessonsCompletedTotal(state)}/${Sel.totals().lessons}`} />
        <Stat icon={HelpCircle} label="Quizy" value={Sel.quizStats(state).total || 0} sub="ukończone" />
        <Stat icon={MessagesSquare} label="Rozmowa" value={Sel.interviewStats(state).answered} sub={`/${Sel.interviewStats(state).total}`} />
        <Stat icon={Brain} label="Sytuacje" value={Sel.scenariosStats(state).total} sub="przejścia" />
        <Stat icon={Layers} label="Fiszki" value={`${Sel.flashcardsStats(state).known}/${Sel.flashcardsStats(state).total}`} />
      </div>

      {/* Mastery per topic */}
      <Card>
        <SectionHeader title="Opanowanie tematów" subtitle="Lekcje + quizy + fiszki" />
        <div className="space-y-4">
          {masteryList.map(({ topic, mastery: m, lessonsDone, lessonsTotal }) => {
            const a = accent(topic.key);
            const tk = state.topics[topic.key] || {};
            const fcIds = Sel.topicCounts()[topic.key]?.cardIds || [];
            const fcKnown = fcIds.filter((id) => state.flashcards[id]?.last === 'known').length;
            return (
              <div key={topic.key} className="rounded-lg border border-ink-700/60 bg-ink-900/30 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`grid h-7 w-7 place-items-center rounded-md ${a.bg} ${a.text} shrink-0`}>
                      <TopicIcon name={topic.icon} className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-slate-200 truncate">{topic.label}</span>
                  </div>
                  <Pill tone="good">{Math.round(m * 100)}%</Pill>
                </div>
                <ProgressBar value={m} barClass="xp-bar" />
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.6875rem] text-slate-500">
                  <span>Lekcje: <span className="text-slate-300">{lessonsDone}/{lessonsTotal}</span></span>
                  {tk.quizTotal > 0 && <span>Quizy: <span className="text-slate-300">{tk.quizCorrect}/{tk.quizTotal}</span></span>}
                  {fcIds.length > 0 && <span>Fiszki: <span className="text-slate-300">{fcKnown}/{fcIds.length}</span></span>}
                  <button onClick={() => go('learn', { topicKey: topic.key })} className="ml-auto text-accent-soft hover:underline">Ucz się →</button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="border-rose-500/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-slate-100">Reset postępu</div>
            <div className="text-sm text-slate-400 mt-0.5">Kasuje XP, poziom, statystyki i kolejkę powtórek zapisane w tej przeglądarce.</div>
          </div>
          <button
            onClick={() => { if (confirm('Na pewno zresetować cały postęp? Tej operacji nie można cofnąć.')) reset(); }}
            className="btn-ghost text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
          >
            <Trash2 className="h-4 w-4" /> Reset
          </button>
        </div>
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub, tone = 'neutral' }) {
  const tones = {
    accent: 'text-accent-soft bg-accent/15',
    gold: 'text-gold bg-gold/15',
    neutral: 'text-slate-300 bg-ink-700/60',
  };
  return (
    <Card className="p-3">
      <div className={`grid h-8 w-8 place-items-center rounded-md ${tones[tone]} mb-2`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-lg font-bold text-slate-100 leading-tight">{value}</div>
      <div className="text-[0.6875rem] text-slate-400">{label}</div>
      {sub && <div className="text-[0.625rem] text-slate-500">{sub}</div>}
    </Card>
  );
}
