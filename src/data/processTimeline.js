/**
 * Timeline drills — ułóż kroki procesu + wskaż lukę kontroli (JOML / Change).
 */

export const TIMELINE_CASES = [
  {
    id: 'tl-leaver',
    title: 'Leaver (JOML)',
    domain: 'Identity / Access',
    blurb: 'Ułóż poprawny przepływ offboardingu, potem wskaż typową lukę.',
    steps: [
      'HR rejestruje last working day / otwiera leaver ticket',
      'Manager potwierdza zakres systemów i datę',
      'IAM/IT wyłącza konto w IdP/AD wg SLA',
      'Revoke dostępu w krytycznych SaaS / VPN / mailbox',
      'Potwierdzenie zwrotu sprzętu + zamknięcie ticketu',
      'Okresowy recon HR leavers ↔ disable dates',
    ],
    gapPrompt: 'Najczęstsza luka, którą znajdziesz w evidence?',
    gapOptions: [
      { id: 'a', label: 'HR ticket jest za szczegółowy' },
      { id: 'b', label: 'Konto AD Enabled po last day / brak revoke w SaaS mimo zamkniętego ticketu' },
      { id: 'c', label: 'Zbyt szybki zwrot laptopa' },
      { id: 'd', label: 'Za dużo kroków w procedurze' },
    ],
    correctGap: 'b',
    explain: 'Proces na papierze bywa OK; OE pada na timely disable i systemach poza AD. Recon domyka kontrolę.',
  },
  {
    id: 'tl-joiner',
    title: 'Joiner (JOML)',
    domain: 'Identity / Access',
    blurb: 'Onboarding z least privilege.',
    steps: [
      'HR / hiring ticket z datą startu i rolą',
      'Manager wnioskuje o dostępy (role business)',
      'Owner/approver zatwierdza zakres (need-to-know)',
      'IAM provisionuje konto + MFA / standard groups',
      'Spot-check: czy nadano tylko zatwierdzone role',
      'Follow-up po 30/90 dniach (mover/role fit)',
    ],
    gapPrompt: 'Gdzie najczęściej pęka kontrola?',
    gapOptions: [
      { id: 'a', label: 'Provision przed approval / skopiowano dostępy „jak kolega” (excessive access)' },
      { id: 'b', label: 'HR podaje datę startu' },
      { id: 'c', label: 'Włączenie MFA' },
      { id: 'd', label: 'Istnienie ticketu w ogóle' },
    ],
    correctGap: 'a',
    explain: 'Klasyczny gap: clone-a-user i provision bez twardego approval scope.',
  },
  {
    id: 'tl-change-normal',
    title: 'Normal change → prod',
    domain: 'Change management',
    blurb: 'Standardowy happy path ITGC change.',
    steps: [
      'Ticket change z opisem, ryzykiem, rollback',
      'Development / commit na branch',
      'Code review / niezależny approval',
      'Test evidence (DEV/UAT) przed prod',
      'CAB / approver zatwierdza wdrożenie',
      'Deploy + weryfikacja + zamknięcie ticketu',
    ],
    gapPrompt: 'Który break jest najpoważniejszy w SoD/ITGC?',
    gapOptions: [
      { id: 'a', label: 'Deploy przed approval / ten sam dev=approver=deployer bez compensating' },
      { id: 'b', label: 'Zbyt długi opis rollback' },
      { id: 'c', label: 'Ticket ma numer' },
      { id: 'd', label: 'Test w UAT istnieje' },
    ],
    correctGap: 'a',
    explain: 'Kolejność approval → deploy i SoD to serce kontroli change.',
  },
  {
    id: 'tl-emergency',
    title: 'Emergency change',
    domain: 'Change management',
    blurb: 'Hotfix nie zeruje kontroli — zmienia ścieżkę.',
    steps: [
      'Incydent / awaria uzasadnia emergency flag',
      'Szybki ticket + risk + kto autoryzuje out-of-band',
      'Implementacja / deploy z minimalnym oknem',
      'Retrospective approval (w SLA, np. 24–72h)',
      'Post-implementation review / PIR',
      'Przegląd populacji emergency w okresie (audit trail)',
    ],
    gapPrompt: 'Czego najczęściej brakuje w PBC?',
    gapOptions: [
      { id: 'a', label: 'Retrospective approval + PIR (zostaje tylko „verbal OK”)' },
      { id: 'b', label: 'Kolor etykiety Emergency' },
      { id: 'c', label: 'Zbyt wiele PIR' },
      { id: 'd', label: 'Istnienie incydentu' },
    ],
    correctGap: 'a',
    explain: 'Emergency bez retrospekcji = obejście change control.',
  },
  {
    id: 'tl-access-request',
    title: 'Access request (IAM)',
    domain: 'Identity / Access',
    blurb: 'Wniosek o dostęp do aplikacji biznesowej.',
    steps: [
      'Użytkownik/manager składa wniosek (system/rola)',
      'Data owner zatwierdza',
      'SoD / conflict check (jeśli wymagane)',
      'IAM provisionuje w systemie',
      'Potwierdzenie dla wnioskodawcy',
      'Włączenie do kolejnego access review',
    ],
    gapPrompt: 'Typowa luka SoD/access?',
    gapOptions: [
      { id: 'a', label: 'Wnioskodawca sam sobie approve / provision bez owner approval' },
      { id: 'b', label: 'Wniosek ma ID' },
      { id: 'c', label: 'Access review istnieje w kalendarzu' },
      { id: 'd', label: 'Rola ma nazwę' },
    ],
    correctGap: 'a',
    explain: 'Request ≠ approve ≠ provision — złamanie tej kolejności to klasyczny finding.',
  },
  {
    id: 'tl-incident',
    title: 'Security incident',
    domain: 'Operations / IR',
    blurb: 'Od alertu do lessons learned.',
    steps: [
      'Detekcja / alert (SIEM, user, vendor)',
      'Triage i severity / assignment',
      'Containment (izolacja, revoke, block)',
      'Eradication & recovery',
      'Komunikacja / eskalacja wg playbook (np. RODO 72h jeśli dotyczy)',
      'Post-incident review + update kontroli',
    ],
    gapPrompt: 'Gdzie kontrola „wygląda OK”, a OE pada?',
    gapOptions: [
      { id: 'a', label: 'Alerty są, ale brak triage/SLA — ticket umiera w kolejce' },
      { id: 'b', label: 'Playbook ma spis treści' },
      { id: 'c', label: 'SIEM zbiera logi' },
      { id: 'd', label: 'Jest kanał Slack #incidents' },
    ],
    correctGap: 'a',
    explain: 'Detekcja bez reakcji = nieskuteczna kontrola. Testuj zamknięte P1 z timeline.',
  },
];

export function scoreTimelineOrder(sequence, stepCount) {
  if (!sequence || sequence.length !== stepCount) return false;
  return sequence.every((v, i) => v === i);
}
