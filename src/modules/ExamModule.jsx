import { useMemo, useState } from 'react';
import {
  Timer, ArrowLeft, Sparkles, GraduationCap,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { Card, SectionHeader, Pill } from '../components/ui.jsx';
import { INTERVIEW_QUESTIONS } from '../data/interview.js';
import { TOPICS } from '../data/topics.js';
import { sfx } from '../utils/juice.js';

const PRESETS = [
  { id: 'quick', label: 'Szybki (8 pytań / 12 min)', count: 8, minutes: 12 },
  { id: 'standard', label: 'Standard (10 pytań / 15 min)', count: 10, minutes: 15 },
  { id: 'hard', label: 'Twardy (12 pytań / 18 min)', count: 12, minutes: 18 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Launcher egzaminu — uruchamia InterviewModule z exam=true (timer, bez podpowiedzi,
 * debrief z idealAnswer na końcu).
 */
export default function ExamModule() {
  const { go } = useNav();
  const [preset, setPreset] = useState('standard');
  const [topicKey, setTopicKey] = useState('all');
  const [mixSoft, setMixSoft] = useState(true);

  const pool = useMemo(() => {
    let q = INTERVIEW_QUESTIONS;
    if (topicKey !== 'all') q = q.filter((x) => x.topicKey === topicKey);
    if (!mixSoft) q = q.filter((x) => x.difficulty !== 'soft');
    return q;
  }, [topicKey, mixSoft]);

  const cfg = PRESETS.find((p) => p.id === preset) || PRESETS[1];

  const start = () => {
    const soft = pool.filter((q) => q.difficulty === 'soft');
    const tech = pool.filter((q) => q.difficulty !== 'soft');
    let queue = [];
    if (mixSoft && soft.length && topicKey === 'all') {
      const nSoft = Math.min(2, soft.length, Math.floor(cfg.count / 4) || 1);
      queue = [
        ...shuffle(soft).slice(0, nSoft),
        ...shuffle(tech).slice(0, cfg.count - nSoft),
      ];
      queue = shuffle(queue);
    } else {
      queue = shuffle(pool).slice(0, cfg.count);
    }
    if (queue.length === 0) return;
    sfx.whoosh();
    go('interview', {
      mode: 'run',
      queue: queue.map((q) => q.id),
      startIndex: 0,
      exam: true,
      examMinutes: cfg.minutes,
    });
  };

  return (
    <div className="space-y-5 animate-slidein">
      <button type="button" onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Mapa
      </button>
      <SectionHeader
        icon={GraduationCap}
        title="Exam mode"
        subtitle="Losowe pytania, timer, bez podpowiedzi. Idealne odpowiedzi dopiero na końcu."
      />

      <Card>
        <div className="label mb-2">Preset</div>
        <div className="flex flex-col gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPreset(p.id)}
              className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                preset === p.id
                  ? 'border-accent/40 bg-accent/10 text-accent-soft'
                  : 'border-ink-600/60 text-slate-300 hover:bg-ink-700/40'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Timer className="h-4 w-4" />
                {p.label}
              </span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="label mb-2">Filtr tematu</div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Chip active={topicKey === 'all'} onClick={() => setTopicKey('all')}>Wszystkie</Chip>
          {TOPICS.map((t) => (
            <Chip key={t.key} active={topicKey === t.key} onClick={() => setTopicKey(t.key)}>{t.label}</Chip>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={mixSoft}
            onChange={(e) => setMixSoft(e.target.checked)}
            className="accent-blue-500"
          />
          Wymieszaj 1–2 pytania soft (O mnie / GRC / bank)
        </label>
        <div className="mt-3">
          <Pill tone="neutral">Pula: {pool.length} pytań</Pill>
        </div>
      </Card>

      <button
        type="button"
        className="btn-primary w-full sm:w-auto"
        disabled={pool.length < 3}
        onClick={start}
      >
        <Sparkles className="h-4 w-4" /> Start egzaminu ({cfg.count} / {cfg.minutes} min)
      </button>
      {pool.length < 3 && (
        <p className="text-xs text-rose-400">Za mało pytań w filtrze — zmień temat.</p>
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
