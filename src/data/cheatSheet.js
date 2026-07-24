/**
 * Cheat sheet 1-pager — pro-słowa + frameworki + severity + skrót PBC.
 * Generowany z istniejących danych ściągi.
 */

import { PRO_WORDS } from './proWords.js';
import { FRAMEWORKS } from './frameworkPicker.js';
import { SEVERITY_RULES } from './severityCalibrator.js';
import { REQUEST_LIST_AREAS } from './requestLists.js';

const SHORT_PBC = ['access', 'change', 'backup', 'leaver', 'incident', 'vendor'];

export function buildCheatSheetMarkdown() {
  const lines = [
    '# Ściąga rozmowa — Junior IT Auditor / GRC',
    '',
    `_Wygenerowano: ${new Date().toISOString().slice(0, 10)}_`,
    '',
    '## Severity (High / Medium / Low)',
    '',
    `- **High:** ${SEVERITY_RULES.High}`,
    `- **Medium:** ${SEVERITY_RULES.Medium}`,
    `- **Low:** ${SEVERITY_RULES.Low}`,
    '',
    'Bank: płatności, dane klientów, brak MFA adminów, brak restore, konto po odejściu → zwykle **High**.',
    '',
    '## Frameworki — różnice (one-liner)',
    '',
  ];
  FRAMEWORKS.forEach((f) => {
    lines.push(`- **${f.label}:** ${f.oneLiner}`);
  });
  lines.push('');
  lines.push('## Pro-słowa — zdanie na rozmowę');
  lines.push('');
  PRO_WORDS.forEach((w) => {
    lines.push(`- **${w.term}:** ${w.good}`);
  });
  lines.push('');
  lines.push('## Request list / PBC (skrót)');
  lines.push('');
  REQUEST_LIST_AREAS.filter((a) => SHORT_PBC.includes(a.id)).forEach((a) => {
    lines.push(`### ${a.label}`);
    a.items.slice(0, 5).forEach((item, i) => lines.push(`${i + 1}. ${item}`));
    lines.push('');
  });
  lines.push('## Finding (szablon)');
  lines.push('');
  lines.push('1. Condition → 2. Criteria → 3. Cause → 4. Risk/Impact → 5. Recommendation → 6. Management response');
  lines.push('');
  lines.push('## Reguła case');
  lines.push('');
  lines.push('Proces + control owner → polityki/tickety/logi → ryzyko/kontrola/dowód → próbka → wyjątek (+ evidence) → finding.');
  lines.push('');
  lines.push('_Evidence > deklaracje. Nie zgaduj — weryfikuj._');
  return lines.join('\n');
}

export function buildCheatSheetPlain() {
  return buildCheatSheetMarkdown()
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*/g, '');
}
