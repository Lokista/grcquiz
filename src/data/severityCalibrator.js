/**
 * Severity calibrator — High/Medium/Low ze ściągi + kontekst bankowy.
 *
 * High: admin/system krytyczny, dane klientów, brak MFA, brak restore, wiele wyjątków
 * Medium: kilka wyjątków, proces częściowy, są compensating controls
 * Low: pojedynczy błąd, niski impact, szybka korekta + dobry dowód
 */

export const SEVERITY_RULES = {
  High: 'Admin/system krytyczny, dane klientów, brak MFA, brak restore, wiele wyjątków.',
  Medium: 'Kilka wyjątków, proces działa częściowo, są kontrole kompensujące.',
  Low: 'Pojedynczy błąd, niski impact, szybka korekta i dobry dowód.',
};

export const SEVERITY_CASES = [
  {
    id: 'sv-mfa-payments',
    fact: 'Brak MFA dla administratorów systemu płatności w banku.',
    contexts: [
      {
        id: 'bank-pay',
        label: 'Bank — core payments',
        correct: 'High',
        why: 'System krytyczny + dane/transakcje klientów; banking: brak MFA adminów = high (fraud / pełna kontrola).',
      },
      {
        id: 'saas-blog',
        label: 'SaaS — wewnętrzny blog firmowy (brak danych klientów)',
        correct: 'Medium',
        why: 'Nadal privileged bez MFA, ale niższy impact biznesowy niż płatności; często medium z compensating (VPN/monitoring) — nie low.',
      },
      {
        id: 'lab',
        label: 'Lab testowy odizolowany, 1 admin, restore codziennie dokumentowany',
        correct: 'Low',
        why: 'Niski impact, izolacja, szybka korekta możliwa; nadal finding, ale severity low.',
      },
    ],
  },
  {
    id: 'sv-leaver',
    fact: 'Konto byłego pracownika aktywne po odejściu.',
    contexts: [
      {
        id: 'bank-14d',
        label: 'Bank — 14 dni, dostęp do danych klientów',
        correct: 'High',
        why: 'Unauthorized access + dane klientów; banking answers: high.',
      },
      {
        id: 'hr-1d',
        label: 'HR tool — 1 dzień, już zablokowane w trakcie audytu, ticket + logi kompletne',
        correct: 'Low',
        why: 'Pojedynczy wyjątek, szybka korekta, dobry dowód zamknięcia.',
      },
      {
        id: 'erp-few',
        label: 'ERP — 3/40 leaverów, dostęp finansowy, brak ticketów, compensating: weekly review częściowy',
        correct: 'Medium',
        why: 'Kilka wyjątków, proces częściowy, jest słaba kompensata — medium (nie high jak przy płatnościach + 14 dni bez śladu).',
      },
    ],
  },
  {
    id: 'sv-backup',
    fact: 'Backup „successful”, nigdy nie było restore testu.',
    contexts: [
      {
        id: 'bank-core',
        label: 'Bank — system z danymi klientów / płatnościami',
        correct: 'High',
        why: 'Brak recoverability przy krytycznych danych; ściąga banking: brak restore = high.',
      },
      {
        id: 'wiki',
        label: 'Wewnętrzna wiki bez danych wrażliwych, RTO luźne, kopia offline jest',
        correct: 'Medium',
        why: 'Luka operating (brak testu) przy niższym impact — medium; nie low, bo recoverability niepotwierdzona.',
      },
      {
        id: 'devbox',
        label: 'Pojedynczy laptop dewelopera (nie produkcja), szybki re-image w 1h udokumentowany',
        correct: 'Low',
        why: 'Niski impact, szybka korekta/alternatywa odtworzenia.',
      },
    ],
  },
  {
    id: 'sv-change',
    fact: 'Hotfix na produkcję bez approvala przed wdrożeniem.',
    contexts: [
      {
        id: 'bank-hotfix',
        label: 'Bank — hotfix w module płatności',
        correct: 'High',
        why: 'Fraud/błąd płatności/awaria/niezgodność — high.',
      },
      {
        id: 'marketing',
        label: 'Zmiana tekstu na stronie marketingowej, rollback w 2 min, retro CR tego samego dnia',
        correct: 'Low',
        why: 'Niski impact, szybka korekta, dobry dowód retro — low (proces i tak warto poprawić).',
      },
      {
        id: 'erp-partial',
        label: 'ERP HR — 2/15 zmian bez approvala, reszta OK, jest monitoring deployi',
        correct: 'Medium',
        why: 'Kilka wyjątków, proces częściowy, compensating monitoring — medium.',
      },
    ],
  },
  {
    id: 'sv-shared-admin',
    fact: 'Współdzielone konto admin.',
    contexts: [
      {
        id: 'bank-ad',
        label: 'Bank — Domain Admin shared przez 8 osób',
        correct: 'High',
        why: 'Brak accountability + privilege na krytycznym systemie.',
      },
      {
        id: 'vendor-support',
        label: 'Konto „support” vendora do read-only dashboardu statusów (bez danych klientów)',
        correct: 'Medium',
        why: 'Shared nadal zły (accountability), ale niższy impact — medium z rekomendacją kont imiennych.',
      },
      {
        id: 'print-server',
        label: 'Stary print server w filii, 1 osoba realnie używa, plan decommission w 2 tygodnie udokumentowany',
        correct: 'Low',
        why: 'Niski impact + szybka ścieżka zamknięcia — low.',
      },
    ],
  },
  {
    id: 'sv-exceptions',
    fact: 'Access review: wyjątki w próbce.',
    contexts: [
      {
        id: 'many-crit',
        label: '12/25 kont bez przeglądu, w tym admini płatności',
        correct: 'High',
        why: 'Wiele wyjątków + system/dane krytyczne.',
      },
      {
        id: 'few-comp',
        label: '3/25 wyjątków, manager podpisał late review w trakcie audytu, compensating: alerty IAM',
        correct: 'Medium',
        why: 'Kilka wyjątków + kompensata + częściowa naprawa.',
      },
      {
        id: 'one-fixed',
        label: '1/25 literówka w dacie podpisu, skorygowana od razu, pełny audit trail',
        correct: 'Low',
        why: 'Pojedynczy błąd, niski impact, szybka korekta, dobry dowód.',
      },
    ],
  },
];

export const SEVERITY_OPTIONS = ['High', 'Medium', 'Low'];
