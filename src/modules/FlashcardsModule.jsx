import { useMemo, useState } from 'react';
import {
  Layers, ArrowLeft, RotateCcw, Check, X, Sparkles,
  Volume2, Repeat, Target, Flame,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { useMission } from '../state/MissionContext.jsx';
import { Card, SectionHeader, TopicBadge, TopicIcon, EmptyState } from '../components/ui.jsx';
import { TOPICS, accent } from '../data/topics.js';
import { FLASHCARDS, flashcardsByTopic } from '../data/flashcards.js';
import { sfx } from '../utils/juice.js';

export default function FlashcardsModule() {
  const { params, go } = useNav();
  const mission = useMission();

  if (mission.active && mission.content?.queue) {
    return (
      <FlashcardRun
        key={`m-${mission.mission.id}-${params.rerun || 0}`}
        queue={mission.content.queue}
        missionMode={mission}
        onExit={() => go('chapter', { topicKey: mission.mission.chapterKey })}
      />
    );
  }
  if (params.mode === 'run') {
    return <FlashcardRun queue={params.queue || []} onExit={() => go('flashcards')} />;
  }
  return <FlashcardList />;
}

function FlashcardList() {
  const { go } = useNav();
  const { state } = useProgress();
  const [topicFilter, setTopicFilter] = useState('all');
  const cards = useMemo(() => (topicFilter === 'all' ? FLASHCARDS : flashcardsByTopic(topicFilter)), [topicFilter]);

  const startSession = (repeatWrong = false) => {
    let queue = cards.map((c) => c.id);
    if (repeatWrong) queue = queue.filter((id) => state.flashcards[id]?.last !== 'known');
    if (queue.length === 0) return;
    go('flashcards', { mode: 'run', queue });
  };

  const knownCount = cards.filter((c) => state.flashcards[c.id]?.last === 'known').length;

  return (
    <div className="space-y-5 animate-slidein">
      <SectionHeader icon={Layers} title="Fiszki (swobodny)" subtitle="Pojęcia z definicją, przykładem i wersją na rozmowę. W kampanii są to misje treningowe." />
      <Card>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <FilterChip active={topicFilter === 'all'} onClick={() => setTopicFilter('all')}>Wszystkie ({FLASHCARDS.length})</FilterChip>
          {TOPICS.map((t) => <FilterChip key={t.key} active={topicFilter === t.key} onClick={() => setTopicFilter(t.key)}><TopicIcon name={t.icon} className="h-3.5 w-3.5" /> {t.label}</FilterChip>)}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => startSession(false)} className="btn-primary"><Sparkles className="h-4 w-4" /> Sesja ({cards.length})</button>
          <button onClick={() => startSession(true)} className="btn-ghost"><Repeat className="h-4 w-4" /> Powtórz nieznane ({cards.filter((c) => state.flashcards[c.id]?.last !== 'known').length})</button>
          <span className="ml-auto text-xs text-slate-400">Znane: <span className="font-semibold text-emerald-400">{knownCount}</span> / {cards.length}</span>
        </div>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((c) => {
          const rec = state.flashcards[c.id];
          const a = accent(c.topicKey);
          return (
            <button key={c.id} onClick={() => go('flashcards', { mode: 'run', queue: [c.id] })} className="group card card-pad text-left hover:ring-1 hover:ring-accent/30 transition-all">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`chip ${a.bg} ${a.text} border ${a.border}`}><span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />{c.topicKey}</span>
                {rec?.last === 'known' ? <Check className="h-4 w-4 text-emerald-400" /> : rec?.last === 'unknown' ? <RotateCcw className="h-4 w-4 text-slate-500" /> : null}
              </div>
              <div className="font-bold text-slate-100">{c.term}</div>
              <div className="mt-1 line-clamp-2 text-sm text-slate-400">{c.definition}</div>
            </button>
          );
        })}
        {cards.length === 0 && <EmptyState title="Brak fiszek w tym filtrze" icon={Layers} />}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return <button onClick={onClick} className={`chip border transition-colors ${active ? 'bg-accent/15 text-accent-soft border-accent/30' : 'bg-ink-700/50 text-slate-300 border-ink-600/60 hover:bg-ink-700'}`}>{children}</button>;
}

function FlashcardRun({ queue, onExit, missionMode }) {
  const { recordFlashcard, recordCombo } = useProgress();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({ known: 0, unknown: 0 });
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [done, setDone] = useState(false);

  const card = FLASHCARDS.find((c) => c.id === queue[idx]);
  if (!card) return <Card><EmptyState title="Brak fiszek" icon={Layers} /><button onClick={onExit} className="btn-ghost mt-3">Wróć</button></Card>;

  const mark = (rating) => {
    recordFlashcard(card.id, rating, card.topicKey);
    if (rating === 'known') { sfx.correct(); setCombo((c) => { const nc = c + 1; setMaxCombo((m) => Math.max(m, nc)); return nc; }); }
    else { sfx.click(); setCombo((c) => { const nc = c + 1; setMaxCombo((m) => Math.max(m, nc)); return nc; }); }
    setResults((r) => ({ known: r.known + (rating === 'known' ? 1 : 0), unknown: r.unknown + (rating === 'unknown' ? 1 : 0) }));
    if (idx + 1 >= queue.length) {
      recordCombo(maxCombo);
      if (missionMode) {
        missionMode.complete(3);
        return;
      }
      setDone(true);
    } else {
      setIdx(idx + 1);
      setFlipped(false);
    }
  };

  if (done) {
    return (
      <div className="space-y-4 animate-slidein">
        <SectionHeader icon={Layers} title="Koniec sesji" subtitle={`${queue.length} fiszek`} />
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center"><div className="text-3xl font-extrabold text-emerald-400">{results.known}</div><div className="text-xs text-slate-400">znam</div></Card>
          <Card className="text-center"><div className="text-3xl font-extrabold text-slate-300">{results.unknown}</div><div className="text-xs text-slate-400">w trakcie</div></Card>
          <Card className="text-center"><div className="text-3xl font-extrabold text-slate-100">{queue.length}</div><div className="text-xs text-slate-400">razem</div></Card>
        </div>
        {maxCombo >= 3 && <div className="text-center text-amber-400 text-sm"><Flame className="inline h-4 w-4" /> Najlepsze combo: x{maxCombo}</div>}
        <button onClick={onExit} className="btn-primary"><RotateCcw className="h-4 w-4" /> Wróć</button>
      </div>
    );
  }

  const a = accent(card.topicKey);
  return (
    <div className="space-y-4 animate-slidein">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onExit} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200"><ArrowLeft className="h-4 w-4" /> {missionMode ? 'Wróć do świata' : 'Zakończ'}</button>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          {combo >= 2 && <span className="inline-flex items-center gap-1 text-amber-400 font-semibold"><Flame className="h-3.5 w-3.5" /> Combo x{combo}</span>}
          <span>Fiszka <span className="font-semibold text-slate-200">{idx + 1}</span> / {queue.length}</span>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-700/70"><div className="h-full rounded-full xp-bar transition-all" style={{ width: `${(idx / queue.length) * 100}%` }} /></div>

      {missionMode && <MissionBanner mission={missionMode.mission} hint="Odpowiedz w głowie, odwróć fiszkę i oceń. Znane = 3 gwiazdki przy ≥90%." />}

      <div className="flip-scene">
        <div className={`flip-card relative h-72 w-full cursor-pointer ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped((v) => !v)}>
          <div className="flip-face absolute inset-0 card card-pad flex flex-col items-center justify-center text-center">
            <div className="mb-3"><TopicBadge topicKey={card.topicKey} /></div>
            <div className="text-2xl font-extrabold text-slate-100">{card.term}</div>
            <div className="mt-4 text-xs text-slate-500 flex items-center gap-1.5"><Volume2 className="h-3.5 w-3.5" /> Kliknij, aby odwrócić</div>
          </div>
          <div className="flip-face flip-back absolute inset-0 card card-pad flex flex-col overflow-y-auto">
            <div className={`chip ${a.bg} ${a.text} border ${a.border} self-start mb-2`}>{card.term}</div>
            <div className="text-sm text-slate-200"><strong className="text-slate-100">Definicja:</strong> {card.definition}</div>
            <div className="mt-2 text-sm text-slate-300"><strong className="text-slate-100">Przykład:</strong> {card.example}</div>
            <div className="mt-2 text-sm text-slate-300"><strong className="text-accent-soft">Na rozmowę:</strong> {card.interview}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button onClick={() => mark('unknown')} className="btn-ghost text-slate-300 border-ink-600/60 hover:bg-ink-700/60"><X className="h-4 w-4" /> Jeszcze uczę</button>
        <button onClick={() => mark('known')} className="btn-ghost text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"><Check className="h-4 w-4" /> Znam</button>
      </div>
      <p className="text-center text-[11px] text-slate-500">Najpierw odpowiedz sobie w głowie, potem odwróć i oceń.</p>
    </div>
  );
}

function MissionBanner({ mission, hint }) {
  return (
    <div className="card card-pad bg-gold/5 border-gold/20 flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-gold/15 text-gold shrink-0"><Target className="h-5 w-5" /></div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-gold">Misja</div>
        <div className="font-semibold text-slate-100 truncate">{mission.title}</div>
        <div className="text-xs text-slate-400">{hint}</div>
      </div>
    </div>
  );
}
