/**
 * Control → test → evidence mapping (ITGC).
 * Przypisz właściwe testy i evidence do kontroli; dystraktory w puli.
 */

export const CONTROL_MAP_CASES = [
  {
    id: 'cm-user-access-review',
    title: 'Okresowy access review',
    domain: 'ITGC — Access',
    control: {
      id: 'c1',
      label: 'Właściciele aplikacji przeglądają uprawnienia użytkowników co kwartał i dokumentują decyzje (keep/revoke).',
    },
    tests: [
      { id: 't-pop', label: 'Ustal populację reviewów w okresie i wybierz próbę (lub 100% privileged)' },
      { id: 't-trace', label: 'Dla próby: czy przegląd wykonano terminowo, przez właściwego ownera, z decyzją' },
      { id: 't-reperf', label: 'Przelicz residual risk score w rejestrze ryzyk' },
      { id: 't-follow', label: 'Sprawdź, czy revoke zostało zrealizowane w systemie (reperformance / screenshot after)' },
      { id: 't-pen', label: 'Wykonaj test penetracyjny aplikacji' },
    ],
    evidence: [
      { id: 'e-export', label: 'Export review (user/role/decision/date/reviewer)' },
      { id: 'e-policy', label: 'Polityka / procedura access review + RACI' },
      { id: 'e-ticket', label: 'Tickety revoke + potwierdzenie wyłączenia w IdP/app' },
      { id: 'e-logo', label: 'Logo ISO 27001 na stronie www' },
      { id: 'e-cv', label: 'CV ownera aplikacji' },
    ],
    correctTests: ['t-pop', 't-trace', 't-follow'],
    correctEvidence: ['e-export', 'e-policy', 'e-ticket'],
    explain: 'Testujesz design+operating effectiveness reviewu i domknięcie revoke. Logo/CV/pentest nie dowodzą tej kontroli.',
  },
  {
    id: 'cm-change-mgmt',
    title: 'Change management prod',
    domain: 'ITGC — Change',
    control: {
      id: 'c2',
      label: 'Zmiany na produkcję wymagają ticketu, testu i niezależnego approval przed deployem.',
    },
    tests: [
      { id: 't-pop', label: 'Uzyskaj populację deployi/prod changes w okresie; wybierz próbę' },
      { id: 't-attr', label: 'Dla próby sprawdź: ticket, test evidence, approval przed deploy, SoD implementer≠approver' },
      { id: 't-emerg', label: 'Osobno przejrzyj emergency changes (retrospective approval / PIR)' },
      { id: 't-salary', label: 'Porównaj wynagrodzenia developerów z rynkiem' },
      { id: 't-ui', label: 'Oceń kolorystykę UI aplikacji' },
    ],
    evidence: [
      { id: 'e-tickets', label: 'Change tickets / Jira + linked PRs' },
      { id: 'e-deploy', label: 'Deploy logs / release pipeline history' },
      { id: 'e-cab', label: 'Procedura change + CAB/emergency rules' },
      { id: 'e-menu', label: 'Menu stolówki biurowej' },
      { id: 'e-mfa', label: 'Screenshot MFA na Gmail prywatnym' },
    ],
    correctTests: ['t-pop', 't-attr', 't-emerg'],
    correctEvidence: ['e-tickets', 'e-deploy', 'e-cab'],
    explain: 'ITGC change = populacja → atrybuty kontroli → emergency path. Nie myl z HR ani UX.',
  },
  {
    id: 'cm-joiner-leaver',
    title: 'Leaver deprovisioning',
    domain: 'ITGC — Access / JOML',
    control: {
      id: 'c3',
      label: 'Dostęp pracownika jest wyłączany w terminie zgodnym z SLA od daty odejścia (HR trigger → IAM).',
    },
    tests: [
      { id: 't-hr', label: 'Weź populację leaverów z HR; zmatchuj daty disable w AD/IdP/app' },
      { id: 't-sla', label: 'Zmierz terminowość vs SLA; zbadaj wyjątki (delayed disable z approval)' },
      { id: 't-saas', label: 'Sprawdź krytyczne SaaS poza AD (np. cloud ERP, VPN as-a-service)' },
      { id: 't-backup', label: 'Uruchom restore test bazy HR' },
      { id: 't-brand', label: 'Oceń branding offboarding emaila' },
    ],
    evidence: [
      { id: 'e-hr', label: 'HR leaver list / tickets z last day' },
      { id: 'e-ad', label: 'Export AD/IdP: enabled flag + last logon + disable date' },
      { id: 'e-proc', label: 'Procedura JOML + SLA + owner' },
      { id: 'e-soc', label: 'SOC 2 vendora kawy w biurze' },
      { id: 'e-wifi', label: 'Hasło Wi‑Fi gościnnego na kartce' },
    ],
    correctTests: ['t-hr', 't-sla', 't-saas'],
    correctEvidence: ['e-hr', 'e-ad', 'e-proc'],
    explain: 'Kontrola leavera = HR event → timely disable across systems. Backup/branding nie testują tej kontroli.',
  },
  {
    id: 'cm-batch-jobs',
    title: 'Batch / interface monitoring',
    domain: 'ITGC — Operations',
    control: {
      id: 'c4',
      label: 'Krytyczne joby/interfejsy są monitorowane; błędy są eskalowane i rozwiązywane według procedury.',
    },
    tests: [
      { id: 't-inv', label: 'Uzyskaj inventory krytycznych jobów + ownerów' },
      { id: 't-fail', label: 'Dla próby failure/alert: czy wykryto, eskalowano, domknięto w terminie' },
      { id: 't-rekon', label: 'Sprawdź recon / control totals na kluczowych interfejsach' },
      { id: 't-sod', label: 'Policz konflikty SoD w module AP' },
      { id: 't-desk', label: 'Zmierz wysokość biurek w NOC' },
    ],
    evidence: [
      { id: 'e-mon', label: 'Alert rules / dashboard + on-call rota' },
      { id: 'e-inc', label: 'Incident/ticket history dla failed jobs' },
      { id: 'e-run', label: 'Runbook / procedura obsługi błędów interfejsu' },
      { id: 'e-meme', label: 'Memy z kanału Slack #random' },
      { id: 'e-badge', label: 'Zdjęcie legitymacji stażysty' },
    ],
    correctTests: ['t-inv', 't-fail', 't-rekon'],
    correctEvidence: ['e-mon', 'e-inc', 'e-run'],
    explain: 'Ops ITGC: wiesz co jest krytyczne, widzisz monitoring i domknięcie wyjątków — nie SoD AP ani ergonomia.',
  },
  {
    id: 'cm-privileged',
    title: 'Privileged access',
    domain: 'ITGC — Access',
    control: {
      id: 'c5',
      label: 'Dostępy uprzywilejowane są ograniczone, zatwierdzane i monitorowane (admin / break-glass).',
    },
    tests: [
      { id: 't-list', label: 'Uzyskaj listę privileged accounts/roles; potwierdź business need + approval' },
      { id: 't-mon', label: 'Sprawdź logging/monitoring użycia admin / break-glass + review alertów' },
      { id: 't-shared', label: 'Zidentyfikuj shared admin i oceń compensating controls' },
      { id: 't-pci', label: 'Przeprowadź pełny audyt PCI DSS merchant' },
      { id: 't-font', label: 'Sprawdź font w polityce bezpieczeństwa' },
    ],
    evidence: [
      { id: 'e-priv', label: 'Export privileged roles + joiner tickets / PAM list' },
      { id: 'e-logs', label: 'Sample admin logs / SIEM alerts + review evidence' },
      { id: 'e-std', label: 'Standard privileged access / break-glass procedure' },
      { id: 'e-cafeteria', label: 'Cennik stołówki' },
      { id: 'e-wallpaper', label: 'Wallpaper na laptopie CISO' },
    ],
    correctTests: ['t-list', 't-mon', 't-shared'],
    correctEvidence: ['e-priv', 'e-logs', 'e-std'],
    explain: 'Privileged = least privilege + approval + monitoring. Nie myl z całym PCI ani kosmetyką dokumentów.',
  },
  {
    id: 'cm-backup',
    title: 'Backup & restore',
    domain: 'ITGC — Operations / Availability',
    control: {
      id: 'c6',
      label: 'Krytyczne systemy są regularnie backupowane; odtwarzalność jest okresowo testowana.',
    },
    tests: [
      { id: 't-scope', label: 'Potwierdź scope krytycznych systemów vs joby backup' },
      { id: 't-success', label: 'Przejrzyj historię sukces/fail i handling wyjątków' },
      { id: 't-restore', label: 'Uzyskaj dowód restore test (kto, kiedy, wynik, RTO/RPO)' },
      { id: 't-access', label: 'Przetestuj password reset self-service UX' },
      { id: 't-color', label: 'Oceń dark mode w konsoli backupu' },
    ],
    evidence: [
      { id: 'e-jobs', label: 'Backup job configs + success/fail logs' },
      { id: 'e-restore', label: 'Protokół / ticket restore test' },
      { id: 'e-pol', label: 'Polityka backup/DR + retention' },
      { id: 'e-spotify', label: 'Playlista zespołu infra' },
      { id: 'e-plant', label: 'Zdjęcie rośliny w serwerowni' },
    ],
    correctTests: ['t-scope', 't-success', 't-restore'],
    correctEvidence: ['e-jobs', 'e-restore', 'e-pol'],
    explain: 'Backup bez restore test to pół kontroli. Scope + monitoring jobów + dowód odtworzenia.',
  },
];

function setEq(selected, correct) {
  const a = new Set(selected);
  const b = new Set(correct);
  if (a.size !== b.size) return false;
  for (const x of b) if (!a.has(x)) return false;
  return true;
}

/** Partial credit: precision on selected vs correct for tests+evidence combined */
export function scoreControlMapping(caseItem, selectedTests, selectedEvidence) {
  const needT = new Set(caseItem.correctTests);
  const needE = new Set(caseItem.correctEvidence);
  const gotT = new Set(selectedTests);
  const gotE = new Set(selectedEvidence);

  let tp = 0;
  let fp = 0;
  let fn = 0;
  for (const id of gotT) {
    if (needT.has(id)) tp += 1;
    else fp += 1;
  }
  for (const id of needT) if (!gotT.has(id)) fn += 1;
  for (const id of gotE) {
    if (needE.has(id)) tp += 1;
    else fp += 1;
  }
  for (const id of needE) if (!gotE.has(id)) fn += 1;

  const denom = tp + fp + fn;
  const pct = denom ? Math.round((tp / denom) * 100) : 0;
  const perfect = setEq(selectedTests, caseItem.correctTests)
    && setEq(selectedEvidence, caseItem.correctEvidence);

  return {
    pct,
    perfect,
    tp,
    fp,
    fn,
    testsOk: setEq(selectedTests, caseItem.correctTests),
    evidenceOk: setEq(selectedEvidence, caseItem.correctEvidence),
  };
}
