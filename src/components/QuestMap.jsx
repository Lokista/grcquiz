import { useState } from 'react';
import {
  ShieldCheck, Star, Flame, Zap, Lock, Target,
  Volume2, VolumeX, Map as MapIcon, Trophy, Sparkles, Repeat,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, SectionHeader, ProgressBar, TopicIcon, Pill } from './ui.jsx';
import * as Sel from '../state/selectors.js';
import { isMuted, setMuted, sfx } from '../utils/juice.js';

export default function QuestMap() {
  const { go } = useNav();
  const { state, levelInfo, isDailyAvailable } = useProgress();
  const [muted, setMutedState] = useState(isMuted());
  const info = levelInfo();
  const chapters = Sel.chapterList(state);
  const prog = Sel.overallMissionProgress(state);
  const stars = Sel.totalStars(state);
  const dailyAvail = isDailyAvailable();
  const achievementsCount = (state.achievements || []).length;

  const toggleMute = () => {
    const m = !muted;
    setMuted(m);
    setMutedState(m);
    if (!m) sfx.click();
  };

  return (
    <div className="space-y-6 animate-slidein">
      {/* HERO */}
      <Card className="overflow-hidden relative">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(40rem 20rem at 80% -20%, rgba(59,130,246,0.25), transparent 60%)' }} />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-accent/15 text-accent-soft ring-1 ring-accent/30">
              <ShieldCheck className="h-8 w-8" />
              <span className="absolute -bottom-1.5 -right-1.5 grid h-7 w-7 place-items-center rounded-full bg-gold text-ink-950 text-xs font-extrabold ring-2 ring-ink-850">{info.level}</span>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-accent-soft">Auditor Quest</div>
              <div className="text-2xl font-extrabold text-slate-100">{info.title}</div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-amber-400" /> <span className="font-semibold text-slate-200">{state.xp} XP</span></span>
                <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 text-gold" /> <span className="font-semibold text-slate-200">{stars}</span> gwiazdek</span>
                {state.streak > 0 && <span className="inline-flex items-center gap-1 text-amber-400"><Flame className="h-3.5 w-3.5" /> {state.streak} dni</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-full sm:w-64">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>Do poziomu {info.level + 1}</span>
                <span className="font-semibold text-slate-200">{info.toNext} XP</span>
              </div>
              <ProgressBar value={info.intoLevel} max={info.span} />
            </div>
            <button onClick={toggleMute} className="btn-ghost px-2.5 py-2" title={muted ? 'Włącz dźwięk' : 'Wycisz'}>
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </Card>

      {/* DAILY + CAMPAIGN PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <button
          onClick={() => go('endless')}
          className="card card-pad text-left transition-all hover:ring-1 hover:ring-accent/40 hover:-translate-y-0.5 lg:col-span-1"
        >
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-accent/15 text-accent-soft shrink-0">
              <Repeat className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-bold text-slate-100">Endless Quiz</div>
                <Pill tone="accent">Szybki</Pill>
              </div>
              <div className="text-sm text-slate-400 mt-1">Bez limitu pytań — lekcje, scenariusze, case study i fiszki w losowej kolejności.</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => go('daily')}
          disabled={!dailyAvail}
          className={`card card-pad text-left transition-all lg:col-span-1 ${dailyAvail ? 'hover:ring-1 hover:ring-gold/40 hover:-translate-y-0.5' : 'opacity-60'}`}
        >
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-gold/15 text-gold shrink-0">
              <Target className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-bold text-slate-100">Wyzwanie dnia</div>
                {dailyAvail ? <Pill tone="gold">Dostępne</Pill> : <Pill tone="good">Ukończone</Pill>}
              </div>
              <div className="text-sm text-slate-400 mt-1">5 losowych pytań rekrutacyjnych. Jedna próba dziennie — duże XP.</div>
            </div>
          </div>
        </button>

        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-accent-soft" />
              <span className="font-bold text-slate-100">Postęp kampanii</span>
            </div>
            <button onClick={() => go('achievements')} className="text-xs text-slate-400 hover:text-gold inline-flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" /> {achievementsCount} odznak
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <MiniStat label="Misje ukończone" value={`${prog.done}/${prog.total}`} />
            <MiniStat label="Gwiazdki" value={`${prog.stars}/${prog.max}`} tone="gold" />
            <MiniStat label="Opanowanie" value={`${Math.round(Sel.overallMastery(state) * 100)}%`} tone="accent" />
          </div>
          <ProgressBar value={prog.done} max={prog.total || 1} barClass="xp-bar" />
        </Card>
      </div>

      {/* WORLDS / CHAPTERS */}
      <div>
        <SectionHeader title="Światy" subtitle="Każdy świat to domena IT Audytu. Ukończ misje, zdobywaj gwiazdki i odblokowuj kolejne rozdziały." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {chapters.map((c) => {
            const t = c.topic;
            return (
              <button
                key={t.key}
                onClick={() => c.unlocked && go('chapter', { topicKey: t.key })}
                disabled={!c.unlocked}
                className={`group relative card card-pad text-left transition-all ${c.unlocked ? 'hover:ring-1 hover:ring-accent/30 hover:-translate-y-0.5' : 'opacity-70'}`}
              >
                {!c.unlocked && (
                  <div className="absolute inset-0 grid place-items-center rounded-xl bg-ink-950/60 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-1 text-slate-400">
                      <Lock className="h-6 w-6" />
                      <span className="text-xs">Ukończ poprzedni świat</span>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-ink-700/60 text-slate-200 shrink-0">
                    <TopicIcon name={t.icon} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-100">{t.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5 line-clamp-2">{t.blurb}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {[0,1,2].map((i) => {
                      const ratio = c.max > 0 ? c.stars / c.max : 0;
                      return <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(ratio*3) ? 'fill-gold text-gold' : 'text-slate-700'}`} />;
                    })}
                    <span className="ml-1 text-xs text-slate-400">{c.stars}/{c.max}</span>
                  </div>
                  <span className="text-xs text-slate-400">{c.done}/{c.total} misji</span>
                </div>
                <div className="mt-2"><ProgressBar value={c.done} max={c.total || 1} barClass={c.done >= c.total ? 'bg-emerald-500' : 'xp-bar'} /></div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Free play hint */}
      <Card className="bg-ink-850/40">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent/15 text-accent-soft shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="text-sm text-slate-300">
            <strong className="text-slate-100">Jak grać?</strong> Wybierz świat i przechodź misje po kolei — za każdą zdobywasz gwiazdki (1–3) i XP. 3 gwiazdki = mistrzostwo. Wolisz ćwiczyć swobodnie? Użyj <em>Trybu swobodnego</em> w menu.
          </div>
        </div>
      </Card>
    </div>
  );
}

function MiniStat({ label, value, tone = 'neutral' }) {
  const tones = { neutral: 'text-slate-100', gold: 'text-gold', accent: 'text-accent-soft' };
  return (
    <div className="rounded-lg border border-ink-700/60 bg-ink-900/40 p-3 text-center">
      <div className={`text-xl font-bold ${tones[tone]}`}>{value}</div>
      <div className="text-[11px] text-slate-400 mt-0.5">{label}</div>
    </div>
  );
}
