/**
 * Blind finding write-up — fakty bez gotowego findingu.
 * Gracz układa karty w 6 sekcjach szablonu ze ściągi.
 */

const SECTIONS = [
  { key: 'condition', label: '1. Condition', hint: 'Co znaleziono i w jakiej próbce' },
  { key: 'criteria', label: '2. Criteria', hint: 'Polityka / framework / wymaganie' },
  { key: 'cause', label: '3. Cause', hint: 'Dlaczego powstało' },
  { key: 'risk', label: '4. Risk / Impact', hint: 'Ryzyko biznesowe' },
  { key: 'recommendation', label: '5. Recommendation', hint: 'Co poprawić' },
  { key: 'management', label: '6. Management response', hint: 'Co klient zrobi i do kiedy (placeholder audytora)' },
];

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffleDeterministic(items, seed) {
  const arr = [...items];
  let s = hashStr(String(seed));
  for (let i = arr.length - 1; i > 0; i -= 1) {
    s = (s * 1103515245 + 12345) >>> 0;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** @type {Array<{
 *  id: string,
 *  topicKey: string,
 *  title: string,
 *  minutes: number,
 *  facts: string[],
 *  modelFinding: string,
 *  sections: Record<string, { correct: string[], distractors: string[] }>
 * }>} */
export const BLIND_FINDINGS = [
  {
    id: 'bf-leaver-active',
    topicKey: 'identity',
    title: 'Konto aktywne po odejściu (bank)',
    minutes: 8,
    facts: [
      'Scope: offboarding AD + systemy bankowe, okres Q1.',
      'Polityka: disable AD/ERP/VPN/mail w dniu odejścia.',
      'Próbka 25 leaverów z HR.',
      '4/25 kont AD enabled >7 dni po leave_date; brak ticketu offboarding dla 3 z nich.',
      'Manager: „HR zawsze pisze na Teams” — bez daty disable w systemie.',
    ],
    modelFinding: `Condition: W próbie 25 leaverów 4 konta AD były aktywne >7 dni po dacie odejścia; dla 3 brak ticketu offboarding.
Criteria: Polityka wymaga disable w dniu odejścia oraz ticketu offboardingowego.
Cause: Brak skutecznej integracji HR→IAM / egzekwowania SLA; poleganie na czacie zamiast procesu.
Risk/Impact: Unauthorized access do systemów/danych klientów banku (high).
Recommendation: Automatyczny revok HR→AD w SLA; monitoring kont enabled po leave_date; access review leaverów.
Management response: [do uzupełnienia przez klienta — owner IAM, termin, dowód zamknięcia].`,
    sections: {
      condition: {
        correct: [
          '4/25 kont AD enabled >7 dni po leave_date',
          'Dla 3 z 4 brak ticketu offboarding',
        ],
        distractors: [
          '100% próbki bez wyjątków',
          'Backup nie miał restore testu',
        ],
      },
      criteria: {
        correct: [
          'Polityka: disable w dniu odejścia',
          'Wymagany ticket offboardingowy / proces leaver',
        ],
        distractors: [
          'Opinia managera, że „jest OK”',
          'Kolor logo banku w brandbooku',
        ],
      },
      cause: {
        correct: [
          'Brak skutecznego egzekwowania HR→IT/IAM',
          'Poleganie na czacie Teams zamiast ticketu/SLA',
        ],
        distractors: [
          'Zbyt silne hasła użytkowników',
          'Brak ISO certyfikatu kawiarni',
        ],
      },
      risk: {
        correct: [
          'Unauthorized access po odejściu',
          'Dane klientów / systemy bankowe — high impact',
        ],
        distractors: [
          'Wyłącznie estetyka UI bankowości',
          'Ryzyko zerowe, bo były silne hasła',
        ],
      },
      recommendation: {
        correct: [
          'Automatyczny disable/revok wg SLA + monitoring',
          'Ticket offboarding obowiązkowy; review leaverów',
        ],
        distractors: [
          'Wyłączyć cały AD do odwołania',
          'Usunąć finding, bo manager obiecał poprawę',
        ],
      },
      management: {
        correct: [
          'Owner (np. IAM) + termin remediacji',
          'Zamknięcie dopiero na dowodzie (nie deklaracji)',
        ],
        distractors: [
          'Audytor sam wyłącza konta w produkcji',
          'Brak ownera — „zajmie się IT kiedyś”',
        ],
      },
    },
  },
  {
    id: 'bf-hotfix-payments',
    topicKey: 'controls',
    title: 'Hotfix płatności bez Change',
    minutes: 8,
    facts: [
      'System płatności / core banking.',
      'Developer wdrożył hotfix na prod „bo pilne”; ticket „zrobię później”.',
      'Brak approvala przed deploy, brak UAT, brak rollback w ticketcie.',
      'Developer sam wdraża własną zmianę.',
      'Polityka Change wymaga: ticket, risk, approval, testy/UAT, rollback.',
    ],
    modelFinding: `Condition: Hotfix na prod systemu płatności bez ticketu/approvalu/UAT/rollback; developer = deployer.
Criteria: Polityka Change Management (ticket, risk assessment, approval przed wdrożeniem, testy/UAT, rollback, SoD).
Cause: Omijanie procesu dla „pilnych” zmian; brak egzekwowania emergency change z retro CR.
Risk/Impact: Fraud, błąd płatności, awaria, niezgodność — high w banku.
Recommendation: Pełny CM + emergency z retro approval; SoD develop≠deploy; obowiązkowy rollback plan.
Management response: Owner Change Manager — termin, % zmian poza procesem do zera, dowód z ticketów.`,
    sections: {
      condition: {
        correct: [
          'Deploy na prod bez ticketu/approvalu przed wdrożeniem',
          'Brak UAT i rollback planu; developer sam wdraża',
        ],
        distractors: [
          'Wszystkie zmiany miały pełny UAT',
          'Problem dotyczył tylko koloru przycisku',
        ],
      },
      criteria: {
        correct: [
          'Polityka Change: ticket, approval, testy/UAT, rollback',
          'SoD: developer nie wdraża sam bez kontroli',
        ],
        distractors: [
          'Wystarczy ustna zgoda na korytarzu',
          'PCI DSS wymaga wyłącznie ładnego UI',
        ],
      },
      cause: {
        correct: [
          'Omijanie procesu dla „pilnych” hotfixów',
          'Brak egzekwowanego emergency change (retro CR)',
        ],
        distractors: [
          'Zbyt dużo MFA na VPN',
          'HR nie wysłał listy urlopów',
        ],
      },
      risk: {
        correct: [
          'Fraud / błąd płatności / awaria',
          'Niezgodność Change — high w banku',
        ],
        distractors: [
          'Tylko opóźnienie newslettera marketingowego',
          'Brak ryzyka — lokalny test wystarcza',
        ],
      },
      recommendation: {
        correct: [
          'Ticket + approval + UAT + rollback przed/przy emergency',
          'SoD i retro CR dla hotfixów; monitoring % poza procesem',
        ],
        distractors: [
          'Zakaz wszystkich zmian na zawsze',
          'Ticket wyłącznie po miesiącu od deploy',
        ],
      },
      management: {
        correct: [
          'Owner Change + termin + metryka zmian poza procesem',
          'Dowód: tickety emergency z approval/rollback',
        ],
        distractors: [
          'Developer decyduje sam o zamknięciu findingu',
          'Usunięcie findingu pod naciskiem biznesu',
        ],
      },
    },
  },
  {
    id: 'bf-no-restore',
    topicKey: 'controls',
    title: 'Backup bez restore testu',
    minutes: 7,
    facts: [
      'Codzienny backup — logi „successful” przez 12 mies.',
      'Nigdy nie wykonano restore testu.',
      'RTO/RPO zapisane w dokumencie, nie mierzone.',
      'Kopia tylko online, ta sama infrastruktura co produkcja.',
      'System: dane klientów banku.',
    ],
    modelFinding: `Condition: Brak restore testu mimo zielonych logów backupu; RTO/RPO nie mierzone; brak kopii offline/immutable.
Criteria: Polityka BCP/DR / wymaganie potwierdzenia recoverability (restore test, RTO/RPO).
Cause: Traktowanie „backup successful” jako dowodu odtworzenia; brak planu testów DR.
Risk/Impact: Brak recoverability — utrata danych / przestój (high); ransomware może szyfrować też backup online.
Recommendation: Kwartalny restore test z pomiarem RTO/RPO; kopia offline/immutable; raport z testu.
Management response: Owner Infrastructure — harmonogram testów, wynik, decyzja przy niespełnieniu RTO/RPO.`,
    sections: {
      condition: {
        correct: [
          'Brak restore testu mimo logów success',
          'RTO/RPO nie mierzone; brak offline/immutable',
        ],
        distractors: [
          'Restore testowany co tydzień z raportem',
          'Brak w ogóle jakiegokolwiek backupu',
        ],
      },
      criteria: {
        correct: [
          'Wymagane potwierdzenie recoverability (restore + RTO/RPO)',
          'Polityka backup/DR organizacji',
        ],
        distractors: [
          'Wystarczy zielony pasek w konsoli backupu',
          'Kryterium = opinia dostawcy chmury na Twitterze',
        ],
      },
      cause: {
        correct: [
          'Logi kopii mylone z dowodem odtworzenia',
          'Brak zaplanowanych testów DR/restore',
        ],
        distractors: [
          'Zbyt częste access review',
          'Nadmiar MFA dla użytkowników',
        ],
      },
      risk: {
        correct: [
          'Brak potwierdzonej recoverability / utrata danych',
          'Ransomware może szyfrować backup online',
        ],
        distractors: [
          'Tylko wolniejszy Excel na HR',
          'Ryzyko estetyczne brandingu',
        ],
      },
      recommendation: {
        correct: [
          'Kwartalny restore test + pomiar RTO/RPO',
          'Kopia offline/immutable + raport z testu',
        ],
        distractors: [
          'Wyłączyć backup, by oszczędzić miejsce',
          'Zastąpić backup zrzutami Teams',
        ],
      },
      management: {
        correct: [
          'Owner infra/DR + harmonogram testów',
          'Zamknięcie na raporcie restore (nie na deklaracji)',
        ],
        distractors: [
          'Zamknięcie bo „backup zawsze działał”',
          'Brak terminu — „przy okazji”',
        ],
      },
    },
  },
];

export const BLIND_FINDING_MAP = Object.fromEntries(BLIND_FINDINGS.map((b) => [b.id, b]));

export function blindFindingById(id) {
  return BLIND_FINDING_MAP[id] || null;
}

export const FINDING_SECTIONS = SECTIONS;

/** Karty do jednej sekcji: correct + distractors, tasowane. */
export function buildSectionOptions(finding, sectionKey) {
  const sec = finding.sections[sectionKey];
  if (!sec) return [];
  const correct = sec.correct.map((label, i) => ({
    id: `${finding.id}-${sectionKey}-c-${i}`,
    label,
    correct: true,
  }));
  const distractors = sec.distractors.map((label, i) => ({
    id: `${finding.id}-${sectionKey}-d-${i}`,
    label,
    correct: false,
  }));
  return shuffleDeterministic([...correct, ...distractors], `${finding.id}-${sectionKey}`);
}

/** Ocena: % trafionych required cards minus kara za dystraktory (min 0). */
export function scoreBlindFinding(finding, selections) {
  let hit = 0;
  let need = 0;
  let wrong = 0;
  for (const s of SECTIONS) {
    const opts = buildSectionOptions(finding, s.key);
    const selected = new Set(selections[s.key] || []);
    const required = opts.filter((o) => o.correct);
    need += required.length;
    required.forEach((o) => { if (selected.has(o.id)) hit += 1; });
    opts.filter((o) => !o.correct).forEach((o) => { if (selected.has(o.id)) wrong += 1; });
  }
  const raw = need === 0 ? 0 : Math.round(((hit - wrong * 0.5) / need) * 100);
  return { hit, need, wrong, pct: Math.max(0, Math.min(100, raw)) };
}
