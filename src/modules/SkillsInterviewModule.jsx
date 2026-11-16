import { useMemo, useState } from 'react';
import {
  ArrowLeft, UserCheck, CheckCircle2, XCircle, ChevronRight, RotateCcw, Sparkles, MessageCircle,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { Card, SectionHeader, Pill } from '../components/ui.jsx';
import { SKILLS_INTERVIEW, SKILLS_INTERVIEW_CATS } from '../data/skillsInterview.js';
import { sfx } from '../utils/juice.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Tasuje odpowiedzi, pamiętając, która jest poprawna. */
function prepare(q) {
  const order = shuffle(q.options.map((_, i) => i));
  return {
    ...q,
    options: order.map((i) => q.options[i]),
    correct: order.indexOf(q.correct),
  };
}

/**
 * Pytania o umiejętności z CV — jedno pytanie na raz, przy błędzie
 * wyjaśnienie „dlaczego” i wzór odpowiedzi na rozmowę.
 */
export default function SkillsInterviewModule() {
  const { go } = useNav();
  const [cat, setCat] = useState('all');
  const [queue, setQueue] = useState(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [wrongIds, setWrongIds] = useState([]);

  const pool = useMemo(
    () => (cat === 'all' ? SKILLS_INTERVIEW : SKILLS_INTERVIEW.filter((q) => q.cat === cat)),
    [cat],
  );

  const start = (questions) => {
    sfx.whoosh();
    setQueue(shuffle(questions).map(prepare));
    setIdx(0);
    setPicked(null);
    setWrongIds([]);
  };

  const back = (
    <button type="button" onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
      <ArrowLeft className="h-4 w-4" /> Mapa
    </button>
  );

  if (!queue) {
    return (
      <div className="space-y-5 animate-slidein">
        {back}
        <SectionHeader
          icon={UserCheck}
          title="Pytania z CV: umiejętności"
          subtitle="Pytania, które padają o rzeczy z CV juniora GRC / IT security. Po złej odpowiedzi dostajesz wyjaśnienie i gotowe zdanie na rozmowę."
        />
        <Card>
          <div className="label mb-2">Temat</div>
          <div className="flex flex-wrap gap-1.5">
            <Chip active={cat === 'all'} onClick={() => setCat('all')}>Wszystkie</Chip>
            {SKILLS_INTERVIEW_CATS.map((c) => (
              <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
            ))}
          </div>
          <div className="mt-3">
            <Pill tone="neutral">Pula: {pool.length} pytań</Pill>
          </div>
        </Card>
        <button type="button" className="btn-primary w-full sm:w-auto" onClick={() => start(pool)}>
          <Sparkles className="h-4 w-4" /> Start ({pool.length})
        </button>
      </div>
    );
  }

  if (idx >= queue.length) {
    const good = queue.length - wrongIds.length;
    const retry = SKILLS_INTERVIEW.filter((q) => wrongIds.includes(q.id));
    return (
      <div className="space-y-5 animate-slidein">
        {back}
        <SectionHeader icon={UserCheck} title="Koniec rundy" subtitle={`Dobrze: ${good} z ${queue.length}`} />
        <div className="flex flex-col gap-2 sm:flex-row">
          {retry.length > 0 && (
            <button type="button" className="btn-primary" onClick={() => start(retry)}>
              <RotateCcw className="h-4 w-4" /> Powtórz błędne ({retry.length})
            </button>
          )}
          <button type="button" className="btn-ghost" onClick={() => setQueue(null)}>
            Wybierz temat
          </button>
        </div>
      </div>
    );
  }

  const q = queue[idx];
  const answered = picked !== null;
  const isRight = answered && picked === q.correct;

  const choose = (i) => {
    if (answered) return;
    setPicked(i);
    if (i === q.correct) {
      sfx.correct();
    } else {
      sfx.wrong();
      setWrongIds((w) => [...w, q.id]);
    }
  };

  const next = () => {
    sfx.click();
    setPicked(null);
    setIdx((n) => n + 1);
  };

  return (
    <div className="space-y-4 animate-slidein">
      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={() => setQueue(null)} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" /> Tematy
        </button>
        <Pill tone="neutral">{idx + 1} / {queue.length}</Pill>
      </div>

      <Card>
        <div className="label mb-2">{q.cat}</div>
        <p className="text-base font-semibold text-slate-100 leading-snug">{q.question}</p>
        <div className="mt-4 flex flex-col gap-2">
          {q.options.map((opt, i) => {
            let cls = 'border-ink-600/60 text-slate-300 hover:bg-ink-700/40';
            if (answered && i === q.correct) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200';
            else if (answered && i === picked) cls = 'border-rose-500/50 bg-rose-500/10 text-rose-200';
            else if (answered) cls = 'border-ink-700/60 text-slate-500';
            return (
              <button
                key={opt}
                type="button"
                onClick={() => choose(i)}
                disabled={answered}
                className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </Card>

      {answered && (
        <Card className={isRight ? 'border-emerald-500/30' : 'border-rose-500/30'}>
          <div className={`mb-2 inline-flex items-center gap-1.5 text-sm font-semibold ${isRight ? 'text-emerald-300' : 'text-rose-300'}`}>
            {isRight ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {isRight ? 'Dobrze!' : 'Nie tym razem'}
          </div>
          {!isRight && (
            <>
              <div className="label mb-1">Dlaczego</div>
              <p className="text-sm text-slate-300 leading-relaxed">{q.why}</p>
            </>
          )}
          <div className="label mb-1 mt-3 inline-flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5" /> Jak to powiedzieć na rozmowie
          </div>
          <p className="text-sm text-slate-200 italic leading-relaxed">„{q.say}”</p>
          <button type="button" className="btn-primary mt-4 w-full sm:w-auto" onClick={next}>
            Dalej <ChevronRight className="h-4 w-4" />
          </button>
        </Card>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chip border transition-colors ${
        active ? 'bg-accent/15 text-accent-soft border-accent/30' : 'bg-ink-700/50 text-slate-300 border-ink-600/60'
      }`}
    >
      {children}
    </button>
  );
}
