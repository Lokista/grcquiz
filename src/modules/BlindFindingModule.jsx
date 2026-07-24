import { useMemo, useState } from 'react';
import {
  FilePenLine, ArrowLeft, ChevronRight, CheckCircle2, XCircle, Lightbulb, RotateCcw, Award,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import AnswerBuilder from '../components/AnswerBuilder.jsx';
import { Card, SectionHeader, TopicBadge, Pill, EmptyState, Markdown, scoreTone } from '../components/ui.jsx';
import {
  BLIND_FINDINGS, FINDING_SECTIONS, blindFindingById,
  buildSectionOptions, scoreBlindFinding,
} from '../data/blindFindings.js';
import { sfx, burst } from '../utils/juice.js';

export default function BlindFindingModule() {
  const { params, go } = useNav();
  if (params.findingId) {
    const f = blindFindingById(params.findingId);
    if (f) return <BlindRun finding={f} onExit={() => go('blind')} />;
  }
  return <BlindList />;
}

function BlindList() {
  const { go } = useNav();
  return (
    <div className="space-y-5 animate-slidein">
      <SectionHeader
        icon={FilePenLine}
        title="Blind finding write-up"
        subtitle="Dostajesz tylko fakty — układaj finding w 6 polach ze ściągi (condition → management response)."
      />
      <div className="grid grid-cols-1 gap-3">
        {BLIND_FINDINGS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => go('blind', { findingId: f.id })}
            className="group card card-pad text-left hover:ring-1 hover:ring-accent/30 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <TopicBadge topicKey={f.topicKey} />
                  <Pill tone="neutral">~{f.minutes} min</Pill>
                </div>
                <div className="font-semibold text-slate-100 group-hover:text-accent-soft transition-colors">{f.title}</div>
                <div className="mt-1 text-sm text-slate-400 line-clamp-2">{f.facts[0]}</div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-accent-soft shrink-0" />
            </div>
          </button>
        ))}
        {BLIND_FINDINGS.length === 0 && <EmptyState title="Brak scenariuszy" icon={FilePenLine} />}
      </div>
    </div>
  );
}

function BlindRun({ finding, onExit }) {
  const { recordScenario, recordCombo } = useProgress();
  const [secIdx, setSecIdx] = useState(0);
  const [selections, setSelections] = useState({});
  const [phase, setPhase] = useState('build'); // build | result
  const [combo, setCombo] = useState(0);

  const section = FINDING_SECTIONS[secIdx];
  const options = useMemo(
    () => buildSectionOptions(finding, section.key),
    [finding, section.key],
  );
  const selectedIds = selections[section.key] || [];

  const score = useMemo(
    () => (phase === 'result' ? scoreBlindFinding(finding, selections) : null),
    [phase, finding, selections],
  );

  const setSectionSel = (ids) => {
    setSelections((prev) => ({ ...prev, [section.key]: ids }));
  };

  const next = () => {
    if (secIdx < FINDING_SECTIONS.length - 1) {
      setSecIdx((i) => i + 1);
      return;
    }
    const sc = scoreBlindFinding(finding, selections);
    recordScenario(finding.id, sc.pct >= 60, finding.topicKey);
    const nextCombo = sc.pct >= 60 ? combo + 1 : 0;
    setCombo(nextCombo);
    recordCombo(nextCombo);
    if (sc.pct >= 70) {
      burst({ stars: 1 });
      sfx.star();
    } else {
      sfx.click();
    }
    setPhase('result');
  };

  if (phase === 'result' && score) {
    return (
      <div className="space-y-5 animate-slidein">
        <SectionHeader icon={Award} title={finding.title} subtitle="Wynik blind findingu" />
        <Card>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Pill tone={scoreTone(score.pct)}>{score.pct}%</Pill>
            <Pill tone="neutral">Trafione {score.hit}/{score.need}</Pill>
            {score.wrong > 0 && <Pill tone="warn">Dystraktory: {score.wrong}</Pill>}
          </div>
          <p className="text-sm text-slate-400 mb-3">
            Szablon ściągi: Condition → Criteria → Cause → Risk → Recommendation → Management response.
          </p>
          <div className="rounded-lg border border-ink-600/60 bg-ink-900/40 p-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-accent-soft mb-2 flex items-center gap-1">
              <Lightbulb className="h-3.5 w-3.5" /> Model finding
            </div>
            <Markdown text={finding.modelFinding} className="prose-audit whitespace-pre-wrap" />
          </div>
          <div className="mt-4 space-y-2">
            {FINDING_SECTIONS.map((s) => {
              const opts = buildSectionOptions(finding, s.key);
              const sel = new Set(selections[s.key] || []);
              return (
                <div key={s.key} className="text-sm">
                  <div className="font-medium text-slate-200 mb-1">{s.label}</div>
                  <ul className="space-y-1">
                    {opts.filter((o) => o.correct).map((o) => (
                      <li key={o.id} className="flex items-start gap-2 text-slate-300">
                        {sel.has(o.id)
                          ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          : <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />}
                        <span>{o.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={onExit}>
              <ArrowLeft className="h-4 w-4" /> Lista
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setSelections({});
                setSecIdx(0);
                setPhase('build');
              }}
            >
              <RotateCcw className="h-4 w-4" /> Jeszcze raz
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-slidein">
      <div className="flex items-center gap-2">
        <button type="button" className="btn-ghost px-2 py-1.5" onClick={onExit} aria-label="Wróć">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <SectionHeader icon={FilePenLine} title={finding.title} subtitle={`Sekcja ${secIdx + 1}/${FINDING_SECTIONS.length}: ${section.label}`} />
      </div>

      <Card>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Fakty (tylko to masz)</div>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
          {finding.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <div className="mb-1 font-semibold text-slate-100">{section.label}</div>
        <p className="text-xs text-slate-500 mb-3">{section.hint}</p>
        <AnswerBuilder
          options={options}
          selectedIds={selectedIds}
          onChange={setSectionSel}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {secIdx > 0 && (
            <button type="button" className="btn-ghost" onClick={() => setSecIdx((i) => i - 1)}>
              Wstecz
            </button>
          )}
          <button type="button" className="btn-primary" onClick={next}>
            {secIdx < FINDING_SECTIONS.length - 1 ? 'Dalej' : 'Oceń finding'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}
