import {
  Compass, ListChecks, KeyRound, Library, Sparkles, FileSpreadsheet,
  CheckCircle2, XCircle, AlertTriangle, Star, TrendingUp, Award, Zap,
} from 'lucide-react';
import { mdToHtml } from '../utils/markdown.js';
import { accent, topicByKey } from '../data/topics.js';

export const TOPIC_ICONS = {
  compass: Compass,
  listChecks: ListChecks,
  keyRound: KeyRound,
  library: Library,
  sparkles: Sparkles,
  fileSpreadsheet: FileSpreadsheet,
};

export function TopicIcon({ name, className = 'w-5 h-5' }) {
  const Cmp = TOPIC_ICONS[name] || Compass;
  return <Cmp className={className} />;
}

export function Card({ className = '', pad = true, children, ...rest }) {
  return (
    <div className={`card ${pad ? 'card-pad' : ''} ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function SectionHeader({ icon: Icon, title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-lg bg-accent/15 text-accent-soft">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

export function ProgressBar({ value, max = 1, className = '', barClass = 'xp-bar' }) {
  const pct = Math.max(0, Math.min(1, max ? value / max : 0));
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-ink-700/70 ${className}`}>
      <div className={`h-full rounded-full transition-all duration-500 ${barClass}`} style={{ width: `${pct * 100}%` }} />
    </div>
  );
}

export function Pill({ children, tone = 'neutral', className = '' }) {
  const tones = {
    neutral: 'bg-ink-700/70 text-slate-300 border border-ink-600/60',
    accent: 'bg-accent/15 text-accent-soft border border-accent/30',
    good: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    warn: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    bad: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    gold: 'bg-gold/15 text-gold border border-gold/30',
  };
  return <span className={`chip ${tones[tone] || tones.neutral} ${className}`}>{children}</span>;
}

export function TopicBadge({ topicKey, withIcon = true, className = '' }) {
  const a = accent(topicKey);
  return (
    <span className={`chip ${a.bg} ${a.text} border ${a.border} ${className}`}>
      {withIcon && <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />}
      {topicLabel(topicKey)}
    </span>
  );
}

function topicLabel(key) {
  return topicByKey(key)?.label || key;
}

export function Markdown({ text, className = 'prose-audit' }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: mdToHtml(text) }} />;
}

export function StatTile({ icon: Icon, label, value, sub, tone = 'accent' }) {
  const tones = {
    accent: 'text-accent-soft',
    good: 'text-emerald-400',
    warn: 'text-amber-400',
    gold: 'text-gold',
  };
  return (
    <Card className="flex items-center gap-3">
      {Icon && (
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-ink-700/60">
          <Icon className={`h-5 w-5 ${tones[tone]}`} />
        </div>
      )}
      <div className="min-w-0">
        <div className="text-2xl font-bold text-slate-100 leading-tight">{value}</div>
        <div className="text-xs text-slate-400">{label}</div>
        {sub && <div className="text-[0.6875rem] text-slate-500 mt-0.5">{sub}</div>}
      </div>
    </Card>
  );
}

export function EmptyState({ icon: Icon = AlertTriangle, title, children }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-600/60 bg-ink-850/40 p-10 text-center">
      <Icon className="h-8 w-8 text-slate-500 mb-3" />
      <div className="section-title mb-1">{title}</div>
      <div className="text-sm text-slate-400 max-w-md">{children}</div>
    </div>
  );
}

export function scoreTone(pct) {
  if (pct >= 80) return 'good';
  if (pct >= 50) return 'warn';
  return 'bad';
}

export function scoreIcon(pct) {
  if (pct >= 80) return CheckCircle2;
  if (pct >= 50) return AlertTriangle;
  return XCircle;
}

export const Icons = { CheckCircle2, XCircle, AlertTriangle, Star, TrendingUp, Award, Zap };
