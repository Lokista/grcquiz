/**
 * Finding triage queue — jak inbox: raw notes → severity + next action.
 */

export const SEVERITY_OPTS = [
  { id: 'critical', label: 'Critical', tip: 'Natychmiastowy wpływ / fraud / masowy dostęp' },
  { id: 'high', label: 'High', tip: 'Poważna luka kontroli, szeroki impact' },
  { id: 'medium', label: 'Medium', tip: 'Istotna luka, ograniczony / kompensowany impact' },
  { id: 'low', label: 'Low', tip: 'Drobiazg / documentation / wąski zakres' },
  { id: 'info', label: 'Info / drop', tip: 'Poza scope lub nie finding' },
];

export const ACTION_OPTS = [
  { id: 'escalate', label: 'Eskaluj teraz', tip: 'Lead / management / IR' },
  { id: 'extend', label: 'Rozszerz test', tip: 'Większa próba / populacja' },
  { id: 'pbc', label: 'Poproś PBC', tip: 'Brakuje dowodu do wniosku' },
  { id: 'draft', label: 'Draft finding', tip: 'Masz wystarczająco na write-up' },
  { id: 'park', label: 'Park / observation', tip: 'Niski priorytet / follow-up później' },
  { id: 'drop', label: 'Drop', tip: 'Nie finding / poza kryterium' },
];

export const TRIAGE_NOTES = [
  {
    id: 'tr-leaver-admin',
    note: 'Notatka: „ex-admin AD nadal Enabled, last logon wczoraj, last day 3 tyg. temu. Payroll SaaS też aktywny.”',
    context: 'Bank / dostęp uprzywilejowany',
    correctSeverity: 'critical',
    correctAction: 'escalate',
    explain: 'Privileged leaver aktywny = natychmiastowe ryzyko. Eskaluj + contain, nie „parkuj na later”.',
  },
  {
    id: 'tr-one-late-approval',
    note: '„W próbie 25 change: 1 approval 40 min po deploy. Reszta czysta. Pierwszy taki case w roku.”',
    context: 'ITGC Change',
    correctSeverity: 'low',
    correctAction: 'extend',
    explain: 'Pojedyncze odchylenie — najpierw rozszerz/stratify zanim High finding. Severity na razie niska.',
  },
  {
    id: 'tr-no-restore',
    note: '„Backup job daily SUCCESS. Restore test: brak wpisu od 16 miesięcy. RTO deklarowane 4h.”',
    context: 'Availability',
    correctSeverity: 'high',
    correctAction: 'draft',
    explain: 'Backup bez restore = kontrola incomplete. Dość na draft finding High (OE), nie trzeba IR.',
  },
  {
    id: 'tr-policy-typo',
    note: '„W ISMS literówka SAP→SAAP. SoA i kontrole techniczne OK.”',
    context: 'Dokumentacja',
    correctSeverity: 'info',
    correctAction: 'park',
    explain: 'Observation / hygiene — park, nie eskalacja.',
  },
  {
    id: 'tr-soc-qualified',
    note: '„Vendor payroll SOC2 qualified (access review missed). Nasz vendor RA z 2023, CUEC puste.”',
    context: 'TPRM',
    correctSeverity: 'high',
    correctAction: 'pbc',
    explain: 'Najpierw dociągnij RA/CUEC/remediation evidence; High residual po stronie klienta.',
  },
  {
    id: 'tr-verbal-hotfix',
    note: '„Hotfix prod, verbal OK od managera, brak ticketu. Płatności 2h down.”',
    context: 'Change / incident',
    correctSeverity: 'high',
    correctAction: 'pbc',
    explain: 'Zbierz deploy logs, kto autoryzował, PIR — potem draft. High, nie Critical fraud bez dowodu.',
  },
  {
    id: 'tr-self-selected',
    note: '„Owner dał nam 10 kont „najważniejszych” z access review zamiast pełnego exportu.”',
    context: 'Sampling / PBC',
    correctSeverity: 'medium',
    correctAction: 'pbc',
    explain: 'Self-selected = bias. Poproś pełną populację/export — to blocker jakości testu.',
  },
  {
    id: 'tr-mfa-gap',
    note: '„12% privileged bez MFA. Break-glass shared, brak log review.”',
    context: 'Identity',
    correctSeverity: 'high',
    correctAction: 'draft',
    explain: 'Clear OE/design gap privileged — draft High; escalate tylko jeśli aktywny abuse.',
  },
  {
    id: 'tr-wifi-guest',
    note: '„Hasło Wi‑Fi gościnne na kartce przy recepcji. Sieć guest izolowana od corp.”',
    context: 'Physical / network',
    correctSeverity: 'low',
    correctAction: 'park',
    explain: 'Jeśli guest izolowany — niski risk / observation. Nie Critical.',
  },
  {
    id: 'tr-firewall-any',
    note: '„ANY→RDP „temp 2024” nadal ALLOW, last hit dziś. Rule review 18 mies. temu. 40 allow-any bez ownera.”',
    context: 'Network',
    correctSeverity: 'high',
    correctAction: 'extend',
    explain: 'Rozszerz na populację allow-any / aging; High deficiency network access.',
  },
  {
    id: 'tr-cafeteria',
    note: '„Menu stolówki nieaktualne. Audytowany żartuje.”',
    context: 'Noise',
    correctSeverity: 'info',
    correctAction: 'drop',
    explain: 'Poza kryterium kontroli — drop.',
  },
  {
    id: 'tr-sod-accepted',
    note: '„Dev=deploy; jest risk acceptance CISO + peer release + SIEM self-deploy alert; review Q ok.”',
    context: 'SoD',
    correctSeverity: 'low',
    correctAction: 'park',
    explain: 'Managed exception z compensating — obserwuj acceptance, nie eskaluj jako Critical.',
  },
];

export function scoreTriage(note, severity, action) {
  const sevOk = severity === note.correctSeverity;
  const actOk = action === note.correctAction;
  const pct = (sevOk ? 50 : 0) + (actOk ? 50 : 0);
  return { sevOk, actOk, pct, perfect: sevOk && actOk };
}
