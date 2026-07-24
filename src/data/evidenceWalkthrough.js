/**
 * Evidence walkthrough — czytanie artefaktu jak na rozmowie / w field work.
 * Artefakt = tekstowy „screenshot”; pytania: co dowodzi / czego brak / follow-up.
 */

export const EVIDENCE_CASES = [
  {
    id: 'ew-access-review',
    title: 'Access review — export Excel',
    topicKey: 'identity',
    artifactLabel: 'Export: Q2 Access Review — SAP Finance',
    artifact: [
      'UserID | Role | LastLogin | Reviewer | Decision | Date',
      'j.kowal | FI_AP_POST | 2026-06-12 | a.nowak | Keep | 2026-06-20',
      'm.lis | FI_AP_POST+FI_VENDOR | 2025-11-03 | a.nowak | Keep | 2026-06-20',
      'temp.ext | FI_AP_POST | 2026-01-08 | (blank) | (blank) | (blank)',
      'svc_batch | SAP_ALL | never | a.nowak | Keep | 2026-06-20',
      '---',
      'Reviewer comment: „Done in 25 min before deadline.”',
      'Sample size: 4 of 180 AP users (self-selected by reviewer).',
    ],
    questions: [
      {
        id: 'q1',
        prompt: 'Co ten artefakt realnie dowodzi?',
        options: [
          { id: 'a', label: 'Że access review był wykonany kompletnie i niezależnie' },
          { id: 'b', label: 'Że ktoś wyeksportował listę i częściowo ją „przejrzał”' },
          { id: 'c', label: 'Że wszyscy użytkownicy AP mają SoD OK' },
          { id: 'd', label: 'Że konta serwisowe są poza scope audytu' },
        ],
        correct: 'b',
        explain: 'Masz ślad przeglądu, ale nie kompletność ani jakość. Braki w wierszach i próba self-selected osłabiają dowód.',
      },
      {
        id: 'q2',
        prompt: 'Czego przede wszystkim brakuje w evidence?',
        options: [
          { id: 'a', label: 'Podpisu CEO' },
          { id: 'b', label: 'Decyzji dla temp.ext, uzasadnienia SAP_ALL, kryterium próby / pełnego pokrycia' },
          { id: 'c', label: 'Hasha pliku SHA-256' },
          { id: 'd', label: 'Screenshotu Active Directory' },
        ],
        correct: 'b',
        explain: 'Puste decyzje, privileged „Keep” bez rationale i self-selected sample = klasyczne luki PBC.',
      },
      {
        id: 'q3',
        prompt: 'Najlepszy follow-up request?',
        options: [
          { id: 'a', label: '„Proszę o nowy export bez zmian”' },
          { id: 'b', label: 'Pełna populacja + kryteria próby / 100% privileged; decyzja dla temp.ext; rationale dla SAP_ALL; kto zatwierdził review' },
          { id: 'c', label: 'Tylko polityka Access Management' },
          { id: 'd', label: 'Wywiad z CFO zamiast evidence' },
        ],
        correct: 'b',
        explain: 'Follow-up zamyka lukę kontroli: kompletność, privileged, ownership decyzji.',
      },
    ],
  },
  {
    id: 'ew-change-ticket',
    title: 'Change ticket — hotfix prod',
    topicKey: 'controls',
    artifactLabel: 'Jira CHG-8841 (status: Done)',
    artifact: [
      'Title: Hotfix payment gateway timeout',
      'Type: Emergency | Risk: High | Environment: Production',
      'Requester: dev.lead | Implementer: same (dev.lead)',
      'Approver: (none — „verbal OK from manager on call”)',
      'CAB: skipped (emergency flag)',
      'Test evidence: „tested on laptop” (no ticket link)',
      'Rollback plan: „redeploy previous build if needed”',
      'Post-impl review: blank',
      'Deploy window: 2026-06-14 23:40–23:55',
      'Linked PR: #1208 (1 approval from junior on same team)',
    ],
    questions: [
      {
        id: 'q1',
        prompt: 'Co ten ticket dowodzi dobrze?',
        options: [
          { id: 'a', label: 'Że emergency change był w pełni kontrolowany' },
          { id: 'b', label: 'Że zmiana na prod nastąpiła i jest udokumentowana w tickecie' },
          { id: 'c', label: 'Że testy UAT przeszły' },
          { id: 'd', label: 'Że SoD developer≠deployer jest zachowane' },
        ],
        correct: 'b',
        explain: 'Masz ślad zdarzenia (kto, kiedy, co). Nie masz dowodu kontroli jakości / approval / SoD.',
      },
      {
        id: 'q2',
        prompt: 'Najpoważniejsza luka kontroli?',
        options: [
          { id: 'a', label: 'Brak emoji w opisie' },
          { id: 'b', label: 'Ten sam implementer + brak formalnego approval + słaby test/PIR' },
          { id: 'c', label: 'Zbyt krótki rollback plan (tekst istnieje)' },
          { id: 'd', label: 'Deploy w nocy' },
        ],
        correct: 'b',
        explain: 'Emergency nie zwalnia z approval trail i post-impl review; self-deploy + verbal OK = red flag.',
      },
      {
        id: 'q3',
        prompt: 'Co poprosisz jako następne PBC?',
        options: [
          { id: 'a', label: 'Politykę urlopową' },
          { id: 'b', label: 'Emergency change log + dowód retrospective approval / PIR + deploy logs + kto mógł zatwierdzić out-of-band' },
          { id: 'c', label: 'Tylko screenshot PR' },
          { id: 'd', label: 'CV developera' },
        ],
        correct: 'b',
        explain: 'Domknij: czy proces emergency istnieje, czy był retrospective approval i czy da się odtworzyć deploy.',
      },
    ],
  },
  {
    id: 'ew-joiner-leaver',
    title: 'Joiner/Leaver — ticket + AD',
    topicKey: 'identity',
    artifactLabel: 'HR leaver + AD export (fragment)',
    artifact: [
      'HR: Anna B. — last working day 2026-05-30 | ticket LEA-221 closed 2026-06-02',
      'AD user: a.borkowska — Enabled: TRUE | LastLogon: 2026-06-18',
      'Groups: VPN_Users, Finance_RO, SharePoint_AP, Azure_DevOps_Readers',
      'Mailbox: active | Forwarding: to team@company.com',
      'Laptop return: checklist signed 2026-05-31',
      'IAM comment: „Disable scheduled — backlog”',
    ],
    questions: [
      {
        id: 'q1',
        prompt: 'Jaki finding jest najlepiej poparty tymi faktami?',
        options: [
          { id: 'a', label: 'Brak polityki JOML' },
          { id: 'b', label: 'Konto leavera aktywne po odejściu (kontrola deprovisioning nieskuteczna)' },
          { id: 'c', label: 'Zbyt wiele grup SharePoint' },
          { id: 'd', label: 'Laptop zwrócony za wcześnie' },
        ],
        correct: 'b',
        explain: 'HR zamknięte, sprzęt OK, ale AD Enabled + logon po last day = operacyjna nieskuteczność kontroli.',
      },
      {
        id: 'q2',
        prompt: 'Czego ten pakiet jeszcze nie dowodzi wystarczająco?',
        options: [
          { id: 'a', label: 'Że Anna w ogóle odeszła (jest HR ticket)' },
          { id: 'b', label: 'Pełnego zakresu dostępów (SaaS poza AD), kto miał wyłączyć, SLA vs faktyczna data' },
          { id: 'c', label: 'Że forwarding istnieje' },
          { id: 'd', label: 'Że laptop wrócił' },
        ],
        correct: 'b',
        explain: 'AD ≠ całość; potrzebujesz ownera procesu, SLA i innych IdP/SaaS.',
      },
      {
        id: 'q3',
        prompt: 'Najlepszy follow-up?',
        options: [
          { id: 'a', label: 'Poproś o usunięcie wiersza z exportu' },
          { id: 'b', label: 'Population leaverów Q2 + matching disable dates; lista SaaS; wyjątki/approval na delayed disable' },
          { id: 'c', label: 'Tylko polityka HR' },
          { id: 'd', label: 'Ankieta satysfakcji exit interview' },
        ],
        correct: 'b',
        explain: 'Przejdź z anegdoty (1 case) do testu populacji + scope systemów.',
      },
    ],
  },
  {
    id: 'ew-backup-restore',
    title: 'Backup — job log',
    topicKey: 'controls',
    artifactLabel: 'Veeam job log — SQL_Prod_Nightly',
    artifact: [
      'Job: SQL_Prod_Nightly | Schedule: 01:00 daily',
      '2026-06-01 SUCCESS  (2.1 TB)  duration 3h12m',
      '2026-06-02 SUCCESS',
      '2026-06-03 WARNING — skipped DB: Payments_Archive (lock timeout)',
      '2026-06-04 SUCCESS',
      '2026-06-05 FAILED — repository full; alert emailed backup_ops@',
      '2026-06-06 SUCCESS (after +4TB disk)',
      'Restore test last 12 months: none recorded',
      'Retention: 14 days | Encryption: enabled | Offsite copy: disabled',
    ],
    questions: [
      {
        id: 'q1',
        prompt: 'Co log dowodzi solidnie?',
        options: [
          { id: 'a', label: 'Że RTO/RPO są met' },
          { id: 'b', label: 'Że job był uruchamiany i miał sukcesy/ostrzeżenia/awarie w okresie' },
          { id: 'c', label: 'Że restore zawsze zadziała' },
          { id: 'd', label: 'Że offsite jest skonfigurowany' },
        ],
        correct: 'b',
        explain: 'Log = operacyjna historia joba. Nie = dowód odtwarzalności ani DR.',
      },
      {
        id: 'q2',
        prompt: 'Kluczowa luka względem typowego ITGC / availability?',
        options: [
          { id: 'a', label: 'Brak koloru w UI backupu' },
          { id: 'b', label: 'Brak restore test + skip krytycznej DB + brak offsite' },
          { id: 'c', label: 'Retention 14 dni zawsze jest za krótki' },
          { id: 'd', label: 'Encryption enabled to ryzyko' },
        ],
        correct: 'b',
        explain: 'Backup bez restore test i z niepełnym pokryciem to klasyczny finding; offsite wzmacnia resilience.',
      },
      {
        id: 'q3',
        prompt: 'Follow-up PBC?',
        options: [
          { id: 'a', label: 'Screenshot „SUCCESS” z jednego dnia' },
          { id: 'b', label: 'Policy backup/DR + dowód restore test (kto/kiedy/wynik) + handling WARNING/FAILED + offsite/DR drill' },
          { id: 'c', label: 'Tylko faktura za dyski' },
          { id: 'd', label: 'CV admina backupu' },
        ],
        correct: 'b',
        explain: 'Domknij kontrolę: nie „czy job istnieje”, tylko „czy da się odzyskać i czy wyjątki są zarządzane”.',
      },
    ],
  },
  {
    id: 'ew-vendor-soc',
    title: 'Vendor — SOC 2 report cover',
    topicKey: 'frameworks',
    artifactLabel: 'SOC 2 Type II — CloudPay Ltd (cover + exceptions page)',
    artifact: [
      'Period: 2025-01-01 → 2025-12-31 | Type II | Trust: Security, Availability',
      'Opinion: Qualified (exceptions noted)',
      'Exception EX-03: Access reviews for privileged cloud admins — 2 quarters missed',
      'Exception EX-07: Change tickets without approval — 14 of 40 sample',
      'Complementary User Entity Controls (CUECs): MFA on SSO, timely leaver notify, review shared accounts',
      'Client usage: payroll API + file exchange SFTP',
      'Last vendor risk assessment on file: 2023 (draft)',
      'Contract: right-to-audit clause present; bridge letter: none',
    ],
    questions: [
      {
        id: 'q1',
        prompt: 'Co SOC report daje Tobie jako audytorowi klienta?',
        options: [
          { id: 'a', label: 'Pełne zapewnienie, że CloudPay nie ma ryzyk' },
          { id: 'b', label: 'Independent assurance za okres + sygnał wyjątków i CUEC do pokrycia po stronie klienta' },
          { id: 'c', label: 'Zgodność z ISO 27001 certyfikatem' },
          { id: 'd', label: 'Dowód, że API payroll jest bezbłędne biznesowo' },
        ],
        correct: 'b',
        explain: 'SOC to assurance nad kontrolami service organization; CUEC i exceptions musisz zaadresować.',
      },
      {
        id: 'q2',
        prompt: 'Największy problem w tym PBC packu?',
        options: [
          { id: 'a', label: 'Qualified opinion + stare vendor RA + brak bridge letter przy użyciu po okresie' },
          { id: 'b', label: 'Zbyt długi okres Type II' },
          { id: 'c', label: 'Obecność right-to-audit' },
          { id: 'd', label: 'SFTP w ogóle' },
        ],
        correct: 'a',
        explain: 'Exceptions + outdated TPRM assessment + potencjalna luka okresu (bridge) = słabe vendor oversight.',
      },
      {
        id: 'q3',
        prompt: 'Co zrobisz dalej?',
        options: [
          { id: 'a', label: 'Odrzucisz SOC i zakończysz test' },
          { id: 'b', label: 'Mapujesz CUEC → dowody klienta; pytasz o remediation exceptions; aktualizujesz vendor RA; bridge letter jeśli potrzeba' },
          { id: 'c', label: 'Prosisz tylko o logo ISO' },
          { id: 'd', label: 'Ignorujesz exceptions bo „to problem vendora”' },
        ],
        correct: 'b',
        explain: 'TPRM: zrozum residual risk u klienta, nie „schowaj raport do folderu”.',
      },
    ],
  },
  {
    id: 'ew-firewall-rule',
    title: 'Firewall — rule export',
    topicKey: 'controls',
    artifactLabel: 'fw-edge-01 rules (excerpt)',
    artifact: [
      'ID 88 | ANY → 10.0.50.0/24 | tcp/3389 | ALLOW | comment: „temp vendor support 2024” | last hit: 2026-06-19',
      'ID 91 | 10.0.10.0/24 → ANY | ANY | ALLOW | comment: (blank) | last hit: 2026-06-20',
      'ID 102 | Corp_VPN → JumpHosts | tcp/22 | ALLOW | ticket NET-5521 | reviewed 2026-03-01',
      'Rule review last completed: 2024-11',
      'Owner field: mostly blank | Change tickets linked: 1 of 40 allow-any rules',
    ],
    questions: [
      {
        id: 'q1',
        prompt: 'Co widać od razu jako audytor?',
        options: [
          { id: 'a', label: 'Sieć jest bezpieczna bo jest firewall' },
          { id: 'b', label: 'Broad ALLOW (ANY/RDP) + stare „temp” + słaby rule review' },
          { id: 'c', label: 'Tylko VPN jest problemem' },
          { id: 'd', label: 'Brak IPv6 = finding High' },
        ],
        correct: 'b',
        explain: 'Overly permissive + expired temp + brak cyklicznego review = typowy network finding.',
      },
      {
        id: 'q2',
        prompt: 'Czego brakuje w evidence jakości reguł?',
        options: [
          { id: 'a', label: 'Owner, business justification, ticket, daty review, wyjątki czasowe' },
          { id: 'b', label: 'Koloru reguł na diagramie' },
          { id: 'c', label: 'Podpisu dostawcy firewalla' },
          { id: 'd', label: 'Eksportu do PDF koniecznie' },
        ],
        correct: 'a',
        explain: 'Bez ownership i justification nie da się ocenić czy ALLOW jest authorized.',
      },
      {
        id: 'q3',
        prompt: 'Follow-up?',
        options: [
          { id: 'a', label: 'Wyłącz firewall na czas audytu' },
          { id: 'b', label: 'Population allow-any / admin ports; aging temp rules; ostatni rule review + remediation plan' },
          { id: 'c', label: 'Tylko polityka Acceptable Use' },
          { id: 'd', label: 'Wywiad z recepcją' },
        ],
        correct: 'b',
        explain: 'Testuj populację ryzykownych reguł i proces review, nie jedną anegdotę.',
      },
    ],
  },
];

export function scoreEvidenceCase(caseItem, answers) {
  const total = caseItem.questions.length;
  let hit = 0;
  const detail = caseItem.questions.map((q) => {
    const picked = answers[q.id];
    const ok = picked === q.correct;
    if (ok) hit += 1;
    return { id: q.id, ok, correct: q.correct, picked, explain: q.explain };
  });
  return { hit, total, pct: total ? Math.round((hit / total) * 100) : 0, detail };
}
