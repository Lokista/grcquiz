// Kategorie/tematy — grupują lekcje, fiszki, pytania i scenariusze.
// Aby dodać nową domenę: dopisz obiekt tutaj i używaj topicKey w lekcjach/fiszkach/pytaniach.

export const TOPICS = [
  {
    key: 'basics',
    label: 'Podstawy audytu i ryzyka',
    icon: 'compass',
    accent: 'blue',
    blurb: 'Myślenie audytora, kontrola, dowód, ryzyko, threat/vulnerability, ocena ryzyka.',
  },
  {
    key: 'controls',
    label: 'Kontrole IT (ITGC / ITAC)',
    icon: 'listChecks',
    accent: 'emerald',
    blurb: 'ITGC, ITAC, access/change/backup/incident/patch management, logging, SoD, least privilege.',
  },
  {
    key: 'identity',
    label: 'Identity & Access',
    icon: 'keyRound',
    accent: 'violet',
    blurb: 'Active Directory, konta współdzielone, MFA, PAM, IAM.',
  },
  {
    key: 'frameworks',
    label: 'Frameworki i regulacje',
    icon: 'library',
    accent: 'amber',
    blurb: 'ISO 27001/27002, NIST CSF, COBIT, CIS Controls, SOC 2, PCI DSS, RODO.',
  },
  {
    key: 'ai',
    label: 'AI w audycie i privacy',
    icon: 'sparkles',
    accent: 'cyan',
    blurb: 'AI Governance, Privacy by Design, wykorzystanie AI w audycie.',
  },
  {
    key: 'tools',
    label: 'Narzędzia audytora',
    icon: 'fileSpreadsheet',
    accent: 'rose',
    blurb: 'Excel dla audytora: próbkowanie, pivot, VLOOKUP/XLOOKUP, warunkowe formatowanie.',
  },
];

export const TOPIC_MAP = Object.fromEntries(TOPICS.map((t) => [t.key, t]));

export function topicByKey(key) {
  return TOPIC_MAP[key] || null;
}

// Mapowanie akcentów -> klasy Tailwind (używane przez komponenty)
export const ACCENT_CLASSES = {
  blue: { text: 'text-blue-400', bg: 'bg-blue-500/15', ring: 'ring-blue-500/30', border: 'border-blue-500/30', dot: 'bg-blue-500' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/15', ring: 'ring-emerald-500/30', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },
  violet: { text: 'text-violet-400', bg: 'bg-violet-500/15', ring: 'ring-violet-500/30', border: 'border-violet-500/30', dot: 'bg-violet-500' },
  amber: { text: 'text-amber-400', bg: 'bg-amber-500/15', ring: 'ring-amber-500/30', border: 'border-amber-500/30', dot: 'bg-amber-500' },
  cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500/15', ring: 'ring-cyan-500/30', border: 'border-cyan-500/30', dot: 'bg-cyan-500' },
  rose: { text: 'text-rose-400', bg: 'bg-rose-500/15', ring: 'ring-rose-500/30', border: 'border-rose-500/30', dot: 'bg-rose-500' },
};

export function accent(key) {
  const t = topicByKey(key);
  return ACCENT_CLASSES[t?.accent || 'blue'] || ACCENT_CLASSES.blue;
}
