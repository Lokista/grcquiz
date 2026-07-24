/**
 * Request list / PBC generator — checklisty evidence ze ściągi GRC.
 * Do skopiowania przed rozmową / na engagement.
 */

export const REQUEST_LIST_AREAS = [
  {
    id: 'access',
    label: 'Access Management',
    blurb: 'Nadawanie dostępu, RBAC, MFA, review',
    items: [
      'Ticket z uzasadnieniem biznesowym (business justification)',
      'Approval ownera / managera przed nadaniem',
      'Eksport uprawnień / ról z systemu (z timestampem)',
      'Role matrix (jeśli jest)',
      'Data nadania dostępu',
      'Potwierdzenie MFA (raport compliance) — gdzie wymagane',
      'Ostatni access review + lista revoków',
    ],
    redFlags: [
      'Brak approvala',
      'Shared account',
      'Nadmiarowe role',
      'Brak access review',
      'Konto aktywne po odejściu',
    ],
  },
  {
    id: 'leaver',
    label: 'Offboarding / Leaver',
    blurb: 'HR → IT/IAM → disable',
    items: [
      'Data odejścia z HR',
      'Ticket offboardingowy',
      'Data disable konta (AD / ERP / VPN / mail)',
      'Logi / potwierdzenie blokady',
      'Odebranie aplikacji, grup, MFA/tokena',
      'Odebranie dostępu fizycznego (jeśli w scope)',
    ],
    redFlags: [
      'Konto enabled po leave_date',
      'Brak ticketu',
      'Brak daty disable',
      'Tylko czat Teams bez artefaktu systemowego',
    ],
  },
  {
    id: 'privileged',
    label: 'Privileged Access / Admin / PAM',
    blurb: 'Admini, service accounts, PAM/PIM',
    items: [
      'Lista kont uprzywilejowanych + business justification',
      'Potwierdzenie kont imiennych (brak shared admin)',
      'Status MFA / PAM / PIM (JIT)',
      'Access review privileged',
      'Logi / alerty akcji admina',
      'Ownerzy service accounts + rotacja haseł/sekretów',
    ],
    redFlags: [
      'Shared admin',
      'Konta nieaktywne / bez ownera',
      'Brak MFA na adminach',
      'Za dużo Domain/Global Admin',
    ],
  },
  {
    id: 'change',
    label: 'Change Management',
    blurb: 'Ticket → approval → test → deploy',
    items: [
      'Ticket / opis zmiany',
      'Risk assessment (jeśli wymagany)',
      'Approval przed wdrożeniem',
      'Code review / PR',
      'Evidence testów / UAT',
      'Deployment log',
      'Rollback plan / dokumentacja',
    ],
    redFlags: [
      'Brak ticketu / approvala / testów',
      'Deploy przed zgodą',
      'Developer sam wdraża własną zmianę',
      'Brak rollback planu',
    ],
  },
  {
    id: 'backup',
    label: 'Backup & Restore',
    blurb: 'Recoverability, RTO/RPO',
    items: [
      'Polityka backupu + harmonogram',
      'Raporty / logi backupu',
      'Logi błędów backupu',
      'Raport restore testu (data, wynik)',
      'Zdefiniowane i zmierzone RTO / RPO',
      'Informacja o kopii offline / immutable (jeśli dotyczy)',
    ],
    redFlags: [
      'Tylko „backup successful” bez restore',
      'RTO/RPO tylko na papierze',
      'Kopia tylko online w tej samej infra',
    ],
  },
  {
    id: 'ad',
    label: 'Active Directory',
    blurb: 'Domain Admins, GPO, leavers, logi',
    items: [
      'Lista Domain Admins / Enterprise Admins / local admins',
      'Last login / inactive accounts',
      'MFA / Conditional Access (jeśli hybrid/cloud)',
      'Access review privileged groups',
      'Failed logons / audit logs (sample)',
      'Polityka haseł / GPO (wybrane)',
      'Status LAPS / kont serwisowych (jeśli w scope)',
    ],
    redFlags: [
      'Dużo Domain Admins',
      'Brak MFA',
      'Stare / shared accounts',
      'Stale / leaver accounts',
    ],
  },
  {
    id: 'entra',
    label: 'Microsoft Entra / M365',
    blurb: 'IAM cloud, PIM, guest, legacy auth',
    items: [
      'Eksport privileged roles + status PIM',
      'Polityki Conditional Access + MFA compliance',
      'Lista guest users + ostatni review',
      'App registrations / service principals + owner + wiek sekretu',
      'Status legacy authentication',
      'Sample audit logs / alerty role changes',
      'Retencja logów',
    ],
    redFlags: [
      'Stałe Global Admin bez PIM',
      'Legacy auth włączony',
      'Guest bez review',
      'SP bez ownera / stare sekrety',
    ],
  },
  {
    id: 'incident',
    label: 'Incident Management',
    blurb: 'IR, RCA, lessons learned',
    items: [
      'Procedura IR (wersja / data)',
      'Klasyfikacja incydentów',
      'Definicja SLA reakcji / eskalacji',
      'Ticket / incident register (sample P1/P2)',
      'Root cause analysis (RCA)',
      'Lessons learned / follow-up actions',
    ],
    redFlags: [
      'Brak RCA („naprawione restartem”)',
      'Brak timeline w tickecie',
      'Brak lessons learned',
      'Opóźniona klasyfikacja / eskalacja',
    ],
  },
  {
    id: 'vendor',
    label: 'Third Party / Vendor',
    blurb: 'DPA, SOC2, SLA, access',
    items: [
      'Umowa z vendorem',
      'DPA (jeśli dane osobowe)',
      'SOC2 Type II / ISO (lub równoważna ocena)',
      'Vendor risk assessment',
      'SLA (uptime, incident notification)',
      'Access list kont vendora',
      'Exit plan / right to audit',
      'Subprocessors / data location (jeśli dotyczy)',
    ],
    redFlags: [
      'Brak DPA przy danych klientów',
      'Tylko pitch deck zamiast assurance',
      'Shared support account',
      'Brak right to audit / exit',
    ],
  },
  {
    id: 'logging',
    label: 'Logging & Monitoring / SIEM',
    blurb: 'Accountability, alerty',
    items: [
      'Przykładowe logi: user ID, timestamp, akcja, wynik, źródło',
      'Ochrona logów przed modyfikacją / retencja',
      'Centralny SIEM / agregacja (jeśli jest)',
      'Sample alertów privileged actions + triage',
    ],
    redFlags: [
      'Brak logów admina',
      'Brak SIEM / krótką retencję',
      'Brak alertów dla privileged',
      'Logi bez reakcji (brak triage)',
    ],
  },
];

export function formatRequestListMarkdown(areaIds) {
  const areas = REQUEST_LIST_AREAS.filter((a) => areaIds.includes(a.id));
  const lines = [
    '# Request list / PBC (ściąga)',
    '',
    `_Wygenerowano: ${new Date().toISOString().slice(0, 10)}_`,
    '',
  ];
  for (const a of areas) {
    lines.push(`## ${a.label}`);
    lines.push(`_${a.blurb}_`);
    lines.push('');
    lines.push('### Evidence do dostarczenia');
    a.items.forEach((item, i) => lines.push(`${i + 1}. [ ] ${item}`));
    lines.push('');
    lines.push('### Red flags');
    a.redFlags.forEach((r) => lines.push(`- ${r}`));
    lines.push('');
  }
  lines.push('---');
  lines.push('_Zasada: evidence > deklaracje. Screenshot bez daty / ustna deklaracja = słabe._');
  return lines.join('\n');
}

export function formatRequestListPlain(areaIds) {
  const areas = REQUEST_LIST_AREAS.filter((a) => areaIds.includes(a.id));
  const lines = ['REQUEST LIST / PBC', ''];
  for (const a of areas) {
    lines.push(`=== ${a.label.toUpperCase()} ===`);
    a.items.forEach((item, i) => lines.push(`${i + 1}. ${item}`));
    lines.push('Red flags: ' + a.redFlags.join('; '));
    lines.push('');
  }
  return lines.join('\n');
}
