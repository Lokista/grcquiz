import { ShieldCheck, ShieldHalf, ChevronRight } from 'lucide-react';
import { useTrack, TRACKS } from '../state/TrackContext.jsx';
import { useNav } from '../state/NavContext.jsx';
import { SEC_TOTAL } from '../data/secops/index.js';

const CARDS = [
  {
    id: 'audit',
    icon: ShieldCheck,
    ring: 'hover:border-accent ring-accent/30',
    iconTone: 'bg-accent/15 text-accent-soft',
    points: ['Mapa misji: 6 światów, lekcje, case study, egzaminy', 'Mock 45 min, Exam mode, Endless Quiz', 'Fieldwork: evidence, SoD, sampling, triage ustaleń'],
  },
  {
    id: 'secops',
    icon: ShieldHalf,
    ring: 'hover:border-rose-400 ring-rose-500/30',
    iconTone: 'bg-rose-500/15 text-rose-300',
    points: [`13 kolejek, ${SEC_TOTAL} zadań: tylko klikanie`, 'Giga Quiz bez końca, egzamin na czas, powtórka błędów', 'Incydenty, EDR, podatności, logi, KSC/NIS2, SZBI, OWASP'],
  },
];

/** Wybór ścieżki nauki — pokazywany przy pierwszym uruchomieniu i z menu. */
export default function TrackPicker({ embedded = false }) {
  const { track, setTrack } = useTrack();
  const { go } = useNav();

  const choose = (id) => {
    setTrack(id);
    go(TRACKS[id].home);
  };

  return (
    <div className={embedded ? '' : 'flex min-h-full items-center justify-center px-4 py-10'}>
      <div className="w-full max-w-4xl">
        <div className="mb-6 text-center">
          <div className="label">GRC Quiz</div>
          <h1 className="mt-1 text-2xl font-bold text-slate-100 sm:text-3xl">Wybierz ścieżkę</h1>
          <p className="mt-2 text-sm text-slate-400">Każda ścieżka ma własne tryby i własny postęp. Zmienisz ją w każdej chwili w menu.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {CARDS.map((c) => {
            const t = TRACKS[c.id];
            const Icon = c.icon;
            const active = track === c.id;
            return (
              <button key={c.id} type="button" onClick={() => choose(c.id)}
                className={`group flex flex-col gap-3 rounded-2xl border border-ink-700/70 bg-ink-850/70 p-5 text-left transition-all hover:-translate-y-0.5 ${c.ring} ${active ? 'ring-2' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`grid h-11 w-11 place-items-center rounded-xl ${c.iconTone}`}><Icon className="h-6 w-6" /></div>
                  <div>
                    <div className="text-lg font-bold text-slate-100">{t.label}</div>
                    {active && <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Aktualna ścieżka</div>}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{t.desc}</p>
                <ul className="space-y-1 text-xs text-slate-400">
                  {c.points.map((p) => <li key={p} className="flex gap-2"><span className="text-slate-600">•</span>{p}</li>)}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-accent-soft group-hover:text-accent">
                  {active ? 'Kontynuuj' : 'Wybierz'} <ChevronRight className="h-4 w-4" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
