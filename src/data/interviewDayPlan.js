/**
 * Interview day plan — playbook „dziś rozmowa” (wzorzec AIron Coach Today/playbook).
 * Kroki + mapowanie słabych tematów → drill views.
 */

/** Preferowane tryby per topicKey (kolejność = preferencja) */
export const WEAK_DRILL_MAP = {
  basics: [
    { view: 'classify', label: 'Exception vs deficiency', minutes: 8 },
    { view: 'manager', label: 'Ton do managera', minutes: 8 },
    { view: 'severity', label: 'Severity calibrator', minutes: 8 },
    { view: 'interview', label: 'Karty odpowiedzi', minutes: 10 },
  ],
  controls: [
    { view: 'controlmap', label: 'Control mapping', minutes: 10 },
    { view: 'sod', label: 'SoD conflicts', minutes: 8 },
    { view: 'evidence', label: 'Evidence walkthrough', minutes: 12 },
    { view: 'timeline', label: 'Process timeline', minutes: 10 },
    { view: 'sampling', label: 'Sampling drill', minutes: 8 },
  ],
  identity: [
    { view: 'timeline', label: 'Process timeline (JOML)', minutes: 10 },
    { view: 'evidence', label: 'Evidence walkthrough', minutes: 12 },
    { view: 'sod', label: 'SoD / access', minutes: 8 },
    { view: 'learn', label: 'Lekcje Identity', minutes: 10, params: { topicKey: 'identity' } },
  ],
  frameworks: [
    { view: 'frameworks', label: 'Framework picker', minutes: 8 },
    { view: 'cheatsheet', label: 'Cheat sheet', minutes: 5 },
    { view: 'learn', label: 'Lekcje frameworki', minutes: 10, params: { topicKey: 'frameworks' } },
  ],
  ai: [
    { view: 'learn', label: 'Lekcje AI / privacy', minutes: 10, params: { topicKey: 'ai' } },
    { view: 'interview', label: 'Karty odpowiedzi', minutes: 10 },
    { view: 'flashcards', label: 'Fiszki', minutes: 8 },
  ],
  tools: [
    { view: 'sampling', label: 'Sampling drill', minutes: 10 },
    { view: 'learn', label: 'Lekcje narzędzia', minutes: 10, params: { topicKey: 'tools' } },
    { view: 'flashcards', label: 'Fiszki', minutes: 8 },
  ],
};

export const FALLBACK_DRILLS = [
  { view: 'classify', label: 'Exception vs deficiency', minutes: 8 },
  { view: 'evidence', label: 'Evidence walkthrough', minutes: 12 },
  { view: 'controlmap', label: 'Control mapping', minutes: 10 },
];

export const DAY_PLAN_STORAGE_KEY = 'aq_dayplan_done';

/**
 * Statyczne kroki playbooka. `resolve` wypełnia dynamiczny drill ze słabego tematu.
 */
export const DAY_PLAN_STEPS = [
  {
    id: 'weak',
    label: 'Warm-up: słaby temat',
    blurb: 'Progressive practice — 1 drill pod najniższy mastery (jak overload w treningu).',
    minutes: 10,
    kind: 'weak',
  },
  {
    id: 'fieldwork',
    label: 'Fieldwork: czytaj dowód',
    blurb: 'Evidence walkthrough albo control mapping — to, czego szukają na rozmowie.',
    minutes: 12,
    kind: 'link',
    view: 'evidence',
    altView: 'controlmap',
  },
  {
    id: 'tone',
    label: 'Kalibracja: ton + klasyfikacja',
    blurb: 'Szybki przebieg Exception/Deficiency i wypowiedzi do managera.',
    minutes: 10,
    kind: 'link',
    view: 'classify',
    altView: 'manager',
  },
  {
    id: 'mock',
    label: 'Mock 45 min',
    blurb: 'Pełna symulacja rozmowy — fazy już masz w module Mock.',
    minutes: 45,
    kind: 'link',
    view: 'mock',
  },
  {
    id: 'cheatsheet',
    label: 'Cheat sheet (ostatnie 5 min)',
    blurb: 'Przejrzyj 1-pager / skopiuj na telefon przed wyjściem.',
    minutes: 5,
    kind: 'link',
    view: 'cheatsheet',
  },
];

export function pickWeakDrills(weakTopicKey, max = 3) {
  const list = WEAK_DRILL_MAP[weakTopicKey] || FALLBACK_DRILLS;
  return list.slice(0, max);
}

export function loadDayPlanDone() {
  try {
    return JSON.parse(localStorage.getItem(DAY_PLAN_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveDayPlanDone(done) {
  localStorage.setItem(DAY_PLAN_STORAGE_KEY, JSON.stringify(done));
}
