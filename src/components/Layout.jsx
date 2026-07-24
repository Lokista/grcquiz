import { useState } from 'react';
import {
  Map as MapIcon, Target, Trophy, BarChart3, BookOpen, MessagesSquare,
  Briefcase, Layers, Brain, ShieldCheck, Menu, X, Flame, Star, Zap,
  ChevronDown, Repeat, Mic2, FilePenLine, ClipboardList, GraduationCap,
  MessageCircle, Library, Gauge, ScrollText, Split, ScanSearch, GitBranchPlus,
  Tags, MessageSquareQuote,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import * as Sel from '../state/selectors.js';

const NAV_ITEMS = [
  { view: 'quest', label: 'Mapa misji', icon: MapIcon, primary: true },
  { view: 'mock', label: 'Mock 45 min', icon: Mic2, primary: true },
  { view: 'exam', label: 'Exam mode', icon: GraduationCap, primary: true },
  { view: 'endless', label: 'Endless Quiz', icon: Repeat, primary: true },
  { view: 'daily', label: 'Wyzwanie dnia', icon: Target, primary: true },
  { view: 'achievements', label: 'Osiągnięcia', icon: Trophy, primary: true },
  { view: 'stats', label: 'Statystyki', icon: BarChart3, primary: true },
];

const FREE_ITEMS = [
  { view: 'learn', label: 'Nauka', icon: BookOpen, desc: 'Lekcje + quiz' },
  { view: 'interview', label: 'Rozmowa rekrutacyjna', icon: MessagesSquare, desc: 'Karty odpowiedzi' },
  { view: 'prowords', label: 'Pro-słowa', icon: MessageCircle, desc: 'Zdania na rozmowę' },
  { view: 'frameworks', label: 'Framework picker', icon: Library, desc: 'ISO/NIST/CIS/NIS2…' },
  { view: 'severity', label: 'Severity calibrator', icon: Gauge, desc: 'High / Med / Low' },
  { view: 'sod', label: 'SoD conflicts', icon: Split, desc: 'Macierz konfliktów ról' },
  { view: 'evidence', label: 'Evidence walkthrough', icon: ScanSearch, desc: 'Czytaj artefakt' },
  { view: 'controlmap', label: 'Control mapping', icon: GitBranchPlus, desc: 'Test + PBC do kontroli' },
  { view: 'classify', label: 'Exception vs deficiency', icon: Tags, desc: 'Exception / Def / Obs / OK' },
  { view: 'manager', label: 'Ton do managera', icon: MessageSquareQuote, desc: 'Soft / pro / harsh' },
  { view: 'cheatsheet', label: 'Cheat sheet', icon: ScrollText, desc: '1-pager na rozmowę' },
  { view: 'blind', label: 'Blind finding', icon: FilePenLine, desc: 'Write-up z faktów' },
  { view: 'requestlist', label: 'Request list / PBC', icon: ClipboardList, desc: 'Checklisty evidence' },
  { view: 'cases', label: 'Case study', icon: Briefcase, desc: 'Scenariusze audytowe' },
  { view: 'flashcards', label: 'Fiszki', icon: Layers, desc: 'Pojęcia' },
  { view: 'think', label: 'Myśl jak audytor', icon: Brain, desc: 'Wybierz reakcję' },
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

export default function Layout({ children }) {
  const { view, go } = useNav();
  const { state: pstate } = useProgress();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [freeOpen, setFreeOpen] = useState(true);

  const NavList = ({ onNavigate }) => (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = view === item.view;
        const Icon = item.icon;
        return (
          <button
            key={item.view}
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
          onClick={() => setFreeOpen((v) => !v)}
          className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300"
        >
          <span>Tryb swobodny</span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${freeOpen ? '' : '-rotate-90'}`} />
        </button>
      </div>
      {freeOpen && (
        <div className="flex flex-col gap-1">
          {FREE_ITEMS.map((item) => {
            const active = view === item.view;
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                onClick={() => { go(item.view); onNavigate?.(); }}
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
          })}
        </div>
      )}
    </nav>
  );

  return (
    <div className="flex h-full min-h-0">
      <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-ink-700/60 bg-ink-900/50 backdrop-blur">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-ink-700/60">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent/15 text-accent-soft ring-1 ring-accent/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-slate-100">Auditor Quest</div>
            <div className="text-[11px] text-slate-400">Trener IT Audytora</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavList />
        </div>
        <div className="border-t border-ink-700/60 px-3 py-3">
          <GameHUD />
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between border-b border-ink-700/60 bg-ink-900/90 backdrop-blur px-4 py-3">
        <button onClick={() => go('quest')} className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-accent-soft" />
          <span className="text-sm font-bold text-slate-100">Auditor Quest</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-gold"><Star className="h-3.5 w-3.5" /> {Sel.totalStars(pstate)}</span>
          <button onClick={() => setMobileOpen(true)} className="btn-ghost px-2 py-1.5" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex w-72 max-w-[80%] flex-col bg-ink-900 border-r border-ink-700/60 animate-slidein">
            <div className="flex items-center justify-between px-4 py-4 border-b border-ink-700/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent-soft" />
                <span className="text-sm font-bold text-slate-100">Auditor Quest</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="btn-ghost px-2 py-1.5" aria-label="Zamknij">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <NavList onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="border-t border-ink-700/60 px-3 py-3">
              <GameHUD />
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
