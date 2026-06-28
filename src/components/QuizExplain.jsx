/** Renderuje rozbudowane wyjaśnienie quizu (string lub sekcje why/traps/audit). */
export function normalizeQuizExplain(explain) {
  if (!explain) return [];
  if (typeof explain === 'string') {
    return explain.trim() ? [{ label: null, text: explain.trim() }] : [];
  }
  const sections = [];
  if (explain.why?.trim()) sections.push({ label: 'Dlaczego', text: explain.why.trim() });
  if (explain.traps?.trim()) sections.push({ label: 'Pułapki', text: explain.traps.trim() });
  if (explain.audit?.trim()) sections.push({ label: 'W audycie', text: explain.audit.trim() });
  return sections;
}

export default function QuizExplain({ explain, className = '' }) {
  const sections = normalizeQuizExplain(explain);
  if (sections.length === 0) return null;

  return (
    <div className={`space-y-2.5 ${className}`}>
      {sections.map((s, i) => (
        <div key={i}>
          {s.label && (
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-0.5">
              {s.label}
            </div>
          )}
          <p className="text-sm text-slate-300 leading-relaxed">{s.text}</p>
        </div>
      ))}
    </div>
  );
}
