import { useState } from 'react';
import {
  Map as MapIcon, Target, Trophy, BarChart3, BookOpen, MessagesSquare,
  Briefcase, Layers, Brain, ShieldCheck, Menu, X, Flame, Star, Zap,
  ChevronDown, Repeat, Mic2, FilePenLine, ClipboardList, GraduationCap,
  MessageCircle, Library, Gauge, ScrollText, Split, ScanSearch, GitBranchPlus,
  Tags, MessageSquareQuote, Dices, ListOrdered, CalendarCheck2, Inbox, Scale,
  ShieldAlert, FileCheck2, ShieldHalf, Timer, ArrowLeftRight,
  Infinity as InfinityIcon,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { useTrack, TRACKS } from '../state/TrackContext.jsx';
import { useSecops } from '../state/SecopsContext.jsx';
import { secRank, secTotalStars, missedItems } from '../state/secops.js';
import * as Sel from '../state/selectors.js';

/** Menu ścieżki „Bezpieczeństwo IT”. */
const SEC_NAV = [
  { view: 'sec', label: 'Kolejki', icon: MapIcon, match: ['sec', 'sec-stage'] },
  { view: 'sec-quick', label: 'Szybka zmiana', icon: Zap },
  { view: 'sec-giga', label: 'Giga Quiz', icon: InfinityIcon },
  { view: 'sec-exam', label: 'Egzamin na czas', icon: Timer },
  { view: 'sec-review', label: 'Powtórka błędów', icon: Repeat },
];

function TrackSwitch({ onNavigate }) {
  const { track, setTrack } = useTrack();
  const { go } = useNav();
  const opts = [
    { id: 'audit', label: 'IT Audyt / GRC', icon: ShieldCheck },
    { id: 'secops', label: 'Bezpieczeństwo IT', icon: ShieldHalf },
  ];
  return (
    <div className="mb-3">
      <div className="mb-1.5 flex items-center justify-between px-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Ścieżka</span>
        <button type="button" onClick={() => { go('tracks'); onNavigate?.(); }} className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300">
          <ArrowLeftRight className="h-3 w-3" /> opis
        </button>
      </div>
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-ink-700/60 bg-ink-900/60 p-1">
        {opts.map((o) => {
          const Icon = o.icon;
          const active = track === o.id;
          return (
            <button key={o.id} type="button" aria-pressed={active}
              onClick={() => { setTrack(o.id); go(TRACKS[o.id].home); onNavigate?.(); }}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold leading-tight transition-colors ${
                active ? (o.id === 'secops' ? 'bg-rose-500/20 text-rose-200 ring-1 ring-rose-500/40' : 'bg-accent/20 text-accent-soft ring-1 ring-accent/40') : 'text-slate-400 hover:text-slate-200'
              }`}>
              <Icon className="h-3.5 w-3.5 shrink-0" /> {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SecHUD() {
  const { state } = useSecops();
  const r = secRank(state.xp);
  return (
    <div className="rounded-xl border border-ink-700/60 bg-ink-850/70 p-3">
      <div className="flex items-center gap-3">
        <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30">
          <ShieldHalf className="h-6 w-6" />
          <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-gold text-[11px] font-extrabold text-ink-950 ring-2 ring-ink-850">{r.level}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-bold text-slate-100">{r.title}</div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-700/70">
            <div className="h-full xp-bar transition-all" style={{ width: `${r.pct * 100}%` }} />
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-0.5 text-gold"><Star className="h-3 w-3" /> {secTotalStars(state)}</span>
            <span className="inline-flex items-center gap-0.5 text-amber-400"><Flame className="h-3 w-3" /> {state.streak || 0}</span>
            <span className="inline-flex items-center gap-0.5"><Zap className="h-3 w-3" /> {state.xp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackHUD() {
  const { track } = useTrack();
  return track === 'secops' ? <SecHUD /> : <GameHUD />;
}

const NAV_ITEMS = [
  { view: 'quest', label: 'Mapa misji', icon: MapIcon, primary: true },
  { view: 'dayplan', label: 'Day plan', icon: CalendarCheck2, primary: true },
  { view: 'mock', label: 'Mock 45 min', icon: Mic2, primary: true },
  { view: 'exam', label: 'Exam mode', icon: GraduationCap, primary: true },
  { view: 'endless', label: 'Endless Quiz', icon: Repeat, primary: true },
  { view: 'daily', label: 'Wyzwanie dnia', icon: Target, primary: true },
  { view: 'achievements', label: 'Osiągnięcia', icon: Trophy, primary: true },
  { view: 'stats', label: 'Statystyki', icon: BarChart3, primary: true },
];

/** Grouped free mode — mniej chaosu w menu (IA jak Coach playbook sections). */
const FREE_GROUPS = [
  {
    id: 'rozmowa',
    label: 'Rozmowa',
    items: [
      { view: 'weak', label: 'Weak-topic trainer', icon: Flame, desc: 'Słabe tematy ze stats' },
      { view: 'interview', label: 'Rozmowa rekrutacyjna', icon: MessagesSquare, desc: 'Karty odpowiedzi' },
      { view: 'prowords', label: 'Pro-słowa', icon: MessageCircle, desc: 'Zdania na rozmowę' },
      { view: 'manager', label: 'Ton do managera', icon: MessageSquareQuote, desc: 'Soft / pro / harsh' },
      { view: 'classify', label: 'Exception vs deficiency', icon: Tags, desc: 'Exception / Def / Obs / OK' },
      { view: 'cheatsheet', label: 'Cheat sheet', icon: ScrollText, desc: '1-pager na rozmowę' },
    ],
  },
  {
    id: 'fieldwork',
    label: 'Fieldwork',
    items: [
      { view: 'evidence', label: 'Evidence walkthrough', icon: ScanSearch, desc: 'Czytaj artefakt' },
      { view: 'controlmap', label: 'Control mapping', icon: GitBranchPlus, desc: 'Test + PBC do kontroli' },
      { view: 'sod', label: 'SoD conflicts', icon: Split, desc: 'Macierz konfliktów ról' },
      { view: 'sampling', label: 'Sampling drill', icon: Dices, desc: 'Próba vs 100%' },
      { view: 'timeline', label: 'Process timeline', icon: ListOrdered, desc: 'Kolejność + luka' },
      { view: 'blind', label: 'Blind finding', icon: FilePenLine, desc: 'Write-up z faktów' },
      { view: 'requestlist', label: 'Request list / PBC', icon: ClipboardList, desc: 'Checklisty evidence' },
      { view: 'severity', label: 'Severity calibrator', icon: Gauge, desc: 'High / Med / Low' },
      { view: 'triage', label: 'Finding triage', icon: Inbox, desc: 'Severity + next action' },
    ],
  },
  {
    id: 'nauka',
    label: 'Nauka',
    items: [
      { view: 'learn', label: 'Nauka', icon: BookOpen, desc: 'Lekcje + quiz' },
      { view: 'flashcards', label: 'Fiszki', icon: Layers, desc: 'Pojęcia' },
      { view: 'cases', label: 'Case study', icon: Briefcase, desc: 'Scenariusze audytowe' },
      { view: 'think', label: 'Myśl jak audytor', icon: Brain, desc: 'Wybierz reakcję' },
    ],
  },
  {
    id: 'governance',
    label: 'GRC / ISMS',
    items: [
      { view: 'risk', label: 'Risk register mini', icon: ShieldAlert, desc: 'Inherent → residual' },
      { view: 'soa', label: 'SoA applicability', icon: FileCheck2, desc: 'Include / Exclude' },
      { view: 'frameworks', label: 'Framework picker', icon: Library, desc: 'ISO/NIST/CIS/NIS2…' },
      { view: 'policy', label: 'Policy vs practice', icon: Scale, desc: 'Design / OE / doc gap' },
    ],
  },
];

function GameHUD() {
  const { state, levelInfo } = useProgress();
  const info = levelInfo();
  const stars = Sel.totalStars(state);
  return (
    <div className="rounded-xl border border-ink-700/60 bg-ink-850/70 p-3">
      <div className="flex items-center gap-3">
        <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent-soft ring-1 ring-accent/30 shrink-0">
          <ShieldCheck className="h-6 w-6" />
          <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-gold text-ink-950 text-[11px] font-extrabold ring-2 ring-ink-850">{info.level}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-slate-100 truncate">{info.title}</div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-700/70">
            <div className="h-full xp-bar transition-all" style={{ width: `${info.pct * 100}%` }} />
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-0.5 text-gold"><Star className="h-3 w-3" /> {stars}</span>
            <span className="inline-flex items-center gap-0.5 text-amber-400"><Flame className="h-3 w-3" /> {state.streak || 0}</span>
            <span className="inline-flex items-center gap-0.5"><Zap className="h-3 w-3" /> {state.xp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FreeItemButton({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
        active ? 'bg-accent/15 text-accent-soft ring-1 ring-accent/30' : 'text-slate-300 hover:bg-ink-700/40 hover:text-slate-100'
      }`}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-accent-soft' : 'text-slate-400 group-hover:text-slate-200'}`} />
      <div className="min-w-0">
        <div className="text-sm font-medium leading-tight">{item.label}</div>
        <div className="text-[10px] text-slate-500 leading-snug">{item.desc}</div>
      </div>
    </button>
  );
}

export default function Layout({ children }) {
  const { view, go } = useNav();
  const { state: pstate } = useProgress();
  const { track } = useTrack();
  const { state: secState } = useSecops();
  const isSec = track === 'secops';
  const trackShort = TRACKS[track]?.short || 'Wybierz ścieżkę';
  const headerStars = isSec ? secTotalStars(secState) : Sel.totalStars(pstate);
  const secMissed = isSec ? missedItems(secState).length : 0;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [freeOpen, setFreeOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState({
    rozmowa: true, fieldwork: false, nauka: false, governance: true,
  });

  const toggleGroup = (id) => {
    setOpenGroups((g) => ({ ...g, [id]: !g[id] }));
  };

  const SecNavList = ({ onNavigate }) => (
    <nav className="flex flex-col gap-1">
      <TrackSwitch onNavigate={onNavigate} />
      {SEC_NAV.map((item) => {
        const active = (item.match || [item.view]).includes(view);
        const Icon = item.icon;
        return (
          <button
            key={item.view}
            type="button"
            onClick={() => { go(item.view, { rerun: Date.now() }); onNavigate?.(); }}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
              active ? 'bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/30' : 'text-slate-300 hover:bg-ink-700/50 hover:text-slate-100'
            }`}
          >
            <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-rose-300' : 'text-slate-400 group-hover:text-slate-200'}`} />
            <span className="flex-1 text-sm font-semibold">{item.label}</span>
            {item.view === 'sec-review' && secMissed > 0 && <span className="rounded-full bg-rose-500/20 px-2 text-[11px] font-bold text-rose-300">{secMissed}</span>}
          </button>
        );
      })}
      <p className="mt-4 px-3 text-[11px] leading-snug text-slate-500">
        Kolejki są ułożone według szansy, że temat padnie na rozmowie: od czerwonych (S) do zielonych (C).
      </p>
    </nav>
  );

  const AuditNavList = ({ onNavigate }) => (
    <nav className="flex flex-col gap-1">
      <TrackSwitch onNavigate={onNavigate} />
      {NAV_ITEMS.map((item) => {
        const active = view === item.view;
        const Icon = item.icon;
        return (
          <button
            key={item.view}
            type="button"
            onClick={() => { go(item.view); onNavigate?.(); }}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
              active ? 'bg-accent/15 text-accent-soft ring-1 ring-accent/30' : 'text-slate-300 hover:bg-ink-700/50 hover:text-slate-100'
            }`}
          >
            <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-accent-soft' : 'text-slate-400 group-hover:text-slate-200'}`} />
            <span className="text-sm font-semibold">{item.label}</span>
          </button>
        );
      })}

      <div className="mt-3 px-3">
        <button
          type="button"
          onClick={() => setFreeOpen((v) => !v)}
          className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300"
        >
          <span>Tryb swobodny</span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${freeOpen ? '' : '-rotate-90'}`} />
        </button>
      </div>
      {freeOpen && (
        <div className="flex flex-col gap-2">
          {FREE_GROUPS.map((group) => (
            <div key={group.id}>
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="flex w-full items-center justify-between px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600 hover:text-slate-400"
              >
                <span>{group.label}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${openGroups[group.id] ? '' : '-rotate-90'}`} />
              </button>
              {openGroups[group.id] && (
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <FreeItemButton
                      key={item.view}
                      item={item}
                      active={view === item.view}
                      onClick={() => { go(item.view); onNavigate?.(); }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );

  const NavList = isSec ? SecNavList : AuditNavList;

  return (
    <div className="flex h-full min-h-0">
      <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-ink-700/60 bg-ink-900/50 backdrop-blur">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-ink-700/60">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent/15 text-accent-soft ring-1 ring-accent/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-slate-100">GRC Quiz</div>
            <div className="text-[11px] text-slate-400">{trackShort}</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavList />
        </div>
        <div className="border-t border-ink-700/60 px-3 py-3">
          <TrackHUD />
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between border-b border-ink-700/60 bg-ink-900/90 backdrop-blur px-4 py-3">
        <button type="button" onClick={() => go(TRACKS[track]?.home || 'quest')} className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-accent-soft" />
          <span className="text-sm font-bold text-slate-100">GRC Quiz</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-gold"><Star className="h-3.5 w-3.5" /> {headerStars}</span>
          <button type="button" onClick={() => setMobileOpen(true)} className="btn-ghost px-2 py-1.5" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} aria-hidden />
          <aside className="relative flex w-72 max-w-[80%] flex-col bg-ink-900 border-r border-ink-700/60 animate-slidein">
            <div className="flex items-center justify-between px-4 py-4 border-b border-ink-700/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent-soft" />
                <span className="text-sm font-bold text-slate-100">GRC Quiz</span>
              </div>
              <button type="button" onClick={() => setMobileOpen(false)} className="btn-ghost px-2 py-1.5" aria-label="Zamknij">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <NavList onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="border-t border-ink-700/60 px-3 py-3">
              <TrackHUD />
            </div>
          </aside>
        </div>
      )}

      <main id="main-scroll" className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
