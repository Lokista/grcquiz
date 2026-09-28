import { Zap, Flame, Star, Infinity as InfinityIcon, Timer, RotateCcw, Lock, ShieldHalf, Trophy, Target } from 'lucide-react';
import { useNav } from '../../state/NavContext.jsx';
import { useSecops } from '../../state/SecopsContext.jsx';
import { SEC_STAGES, SEC_TOTAL, TIER_INFO } from '../../data/secops/index.js';
import { secRank, secTotalStars, stageUnlocked, missedItems } from '../../state/secops.js';

function Stars({ n, className = 'h-4 w-4' }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} z 3 gwiazdek`}>
      {[0, 1, 2].map((i) => <Star key={i} className={`${className} ${i < n ? 'fill-gold text-gold' : 'text-ink-600'}`} />)}
    </span>
  );
}

function ModeTile({ icon: Icon, title, desc, meta, onClick, disabled, tone }) {
  const tones = {
    accent: 'from-accent/25 to-accent/5 border-accent/40 hover:border-accent',
    gold: 'from-gold/20 to-gold/5 border-gold/40 hover:border-gold',
    rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/40 hover:border-rose-400',
    slate: 'from-ink-700/60 to-ink-850/40 border-ink-600/70 hover:border-slate-400',
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`group flex flex-col gap-1.5 rounded-xl border bg-gradient-to-br p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${tones[tone]}`}>
      <div className="flex items-center justify-between gap-2">
        <Icon className="h-5 w-5 text-slate-100" />
        {meta && <span className="font-mono text-[11px] text-slate-400">{meta}</span>}
      </div>
      <div className="text-base font-bold text-slate-100">{title}</div>
      <div className="text-xs leading-snug text-slate-400">{desc}</div>
    </button>
  );
}

export default function SecopsHome() {
  const { go } = useNav();
  const { state, toggleOpen } = useSecops();
  const rank = secRank(state.xp);
  const missed = missedItems(state).length;
  const accuracy = state.answered ? Math.round((state.correct / state.answered) * 100) : null;

  return (
    <div className="space-y-6">
      <div className="card card-pad">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30">
              <ShieldHalf className="h-6 w-6" />
              <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-gold text-[11px] font-extrabold text-ink-950 ring-2 ring-ink-850">{rank.level}</span>
            </div>
            <div>
              <div className="label">Bezpieczeństwo IT · sektor publiczny</div>
              <h1 className="text-xl font-bold text-slate-100">{rank.title}</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="chip border border-ink-600/60 bg-ink-800 text-slate-300"><Zap className="h-3.5 w-3.5 text-accent-soft" /> {state.xp} XP</span>
            <span className="chip border border-ink-600/60 bg-ink-800 text-slate-300"><Star className="h-3.5 w-3.5 text-gold" /> {secTotalStars(state)}/{SEC_STAGES.length * 3}</span>
            <span className="chip border border-ink-600/60 bg-ink-800 text-slate-300"><Flame className="h-3.5 w-3.5 text-amber-400" /> {state.streak || 0} d</span>
            {accuracy != null && <span className="chip border border-ink-600/60 bg-ink-800 text-slate-300"><Target className="h-3.5 w-3.5 text-emerald-400" /> {accuracy}%</span>}
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-700/70">
          <div className="h-full rounded-full xp-bar transition-all" style={{ width: `${Math.round(rank.pct * 100)}%` }} />
        </div>
        <div className="mt-1.5 text-xs text-slate-400">
          {rank.next ? `Do rangi „${rank.next[1]}”: ${rank.next[0] - state.xp} XP` : 'Najwyższa ranga'} · {SEC_TOTAL} zadań w banku
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ModeTile icon={Zap} tone="accent" title="Szybka zmiana" meta="10 · ~3 min" desc="Losowe zadania z otwartych kolejek." onClick={() => go('sec-quick')} />
        <ModeTile icon={InfinityIcon} tone="gold" title="Giga Quiz" meta={state.gigaBest ? `rekord ${state.gigaBest}` : '3 życia'} desc="Bez końca, ze wszystkich tematów. Mnożnik rośnie z serią." onClick={() => go('sec-giga')} />
        <ModeTile icon={Timer} tone="rose" title="Egzamin" meta={state.examBest != null ? `najlepiej ${Math.round(state.examBest * 100)}%` : '30 · 20 min'} desc="Bez podpowiedzi. Wyjaśnienia dopiero na końcu." onClick={() => go('sec-exam')} />
        <ModeTile icon={RotateCcw} tone="slate" title="Powtórka błędów" meta={missed ? `${missed}` : null} desc={missed ? 'Wracają zadania, w których się pomyliłeś.' : 'Na razie pusto. Tu trafią pomyłki.'} disabled={!missed} onClick={() => go('sec-review')} />
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="section-title">Kolejki</h2>
            <p className="text-xs text-slate-400">Kolor to szansa, że temat padnie na rozmowie. Gwiazdka otwiera następną kolejkę.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
            {['S', 'A', 'B', 'C'].map((t) => (
              <span key={t} className="inline-flex items-center gap-1"><span className={`rounded px-1.5 font-bold ${TIER_INFO[t].chip}`}>{t}</span>{TIER_INFO[t].label}</span>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {SEC_STAGES.map((s, i) => {
            const open = stageUnlocked(state, i);
            const st = state.stages[s.id] || {};
            return (
              <button key={s.id} type="button" disabled={!open} onClick={() => go('sec-stage', { stageId: s.id })}
                className={`relative overflow-hidden rounded-xl border bg-ink-850/70 p-4 pl-5 text-left transition-all ${
                  open ? 'border-ink-700/70 hover:-translate-y-0.5 hover:border-accent/60' : 'cursor-not-allowed border-ink-700/40 opacity-50'
                } ${s.boss ? 'ring-1 ring-gold/40' : ''}`}>
                <span className={`absolute inset-y-3 left-0 w-1.5 rounded-r ${TIER_INFO[s.tier].bar}`} />
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] tracking-wide text-slate-500">{s.code} · {Math.min(s.boss ? 7 : 8, s.items.length)} z {s.items.length}</span>
                  <span className={`rounded px-1.5 text-[11px] font-bold ${TIER_INFO[s.tier].chip}`}>{s.tier}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-base font-semibold text-slate-100">
                  {s.boss && <Trophy className="h-4 w-4 text-gold" />}{s.name}
                </div>
                <div className="text-xs leading-snug text-slate-400">{s.sub}</div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  {open ? <Stars n={st.stars || 0} /> : <span className="inline-flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> Zdobądź gwiazdkę w poprzedniej</span>}
                  <span>{st.best != null ? `najlepiej ${Math.round(st.best * 100)}%` : open ? 'nowa' : ''}</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>Postęp tej ścieżki zapisuje się w tej przeglądarce, osobno od ścieżki IT Audyt.</span>
          <button type="button" onClick={toggleOpen} className="text-accent-soft underline underline-offset-2 hover:text-accent">
            {state.open ? 'Włącz blokady kolejek' : 'Otwórz wszystkie kolejki'}
          </button>
        </div>
      </div>
    </div>
  );
}
