/**
 * SoD conflict finder — Segregation of Duties ze ściągi.
 * Jedna osoba nie kontroluje całego krytycznego procesu (finanse / IT change).
 */

export const SOD_SCENARIOS = [
  {
    id: 'sod-payments',
    title: 'Płatności / AP',
    blurb: 'Klasyczne SoD finansowe ze ściągi.',
    roles: [
      { id: 'vendor_create', label: 'Tworzy dostawcę' },
      { id: 'invoice_approve', label: 'Zatwierdza fakturę' },
      { id: 'payment_exec', label: 'Wykonuje płatność' },
      { id: 'reconcile', label: 'Uzgodnienie bankowe' },
    ],
    /** Pary [a,b] które NIE powinny być u tej samej osoby */
    conflicts: [
      ['vendor_create', 'invoice_approve'],
      ['vendor_create', 'payment_exec'],
      ['invoice_approve', 'payment_exec'],
    ],
    explain: 'Jedna osoba nie powinna tworzyć dostawcy, zatwierdzać faktury i wykonywać płatności. Ryzyko: fraud, błąd, brak niezależnej weryfikacji.',
  },
  {
    id: 'sod-change',
    title: 'Change / DevOps',
    blurb: 'SoD w IT: developer ≠ deployer bez kontroli.',
    roles: [
      { id: 'develop', label: 'Development / commit' },
      { id: 'code_review', label: 'Code review / approve PR' },
      { id: 'deploy_prod', label: 'Deploy na produkcję' },
      { id: 'prod_admin', label: 'Admin prod (break-glass)' },
    ],
    conflicts: [
      ['develop', 'deploy_prod'],
      ['develop', 'code_review'],
      ['code_review', 'deploy_prod'],
    ],
    explain: 'Developer nie powinien sam zatwierdzać i wdrażać swojej zmiany. Ryzyko: nieautoryzowana zmiana, awaria, obejście kontroli.',
  },
  {
    id: 'sod-hr-payroll',
    title: 'HR / wynagrodzenia',
    blurb: 'ITAC w systemie HR ze ściągi.',
    roles: [
      { id: 'create_employee', label: 'Tworzy pracownika' },
      { id: 'edit_salary', label: 'Edytuje wynagrodzenie' },
      { id: 'approve_payroll', label: 'Akceptuje listę płac' },
      { id: 'run_payment', label: 'Uruchamia wypłatę' },
    ],
    conflicts: [
      ['create_employee', 'approve_payroll'],
      ['edit_salary', 'approve_payroll'],
      ['edit_salary', 'run_payment'],
      ['approve_payroll', 'run_payment'],
    ],
    explain: 'Tworzenie/edycja ≠ akceptacja płacy ≠ wypłata. Ryzyko: fraud wynagrodzeń, błąd danych osobowych.',
  },
  {
    id: 'sod-access',
    title: 'Access Management',
    blurb: 'Kto wnioskuje, kto zatwierdza, kto nadaje.',
    roles: [
      { id: 'request_access', label: 'Wnioskuje o dostęp' },
      { id: 'approve_access', label: 'Zatwierdza dostęp (owner/manager)' },
      { id: 'provision', label: 'Nadaje dostęp w systemie (IAM)' },
      { id: 'access_review', label: 'Wykonuje access review' },
    ],
    conflicts: [
      ['request_access', 'approve_access'],
      ['provision', 'approve_access'],
      ['provision', 'access_review'],
    ],
    explain: 'Wnioskodawca ≠ approval; nadający nie powinien sam „reviewować” swoich nadań bez niezależności. Ryzyko: nadmiarowe uprawnienia, unauthorized access.',
  },
];

function pairKey(a, b) {
  return [a, b].sort().join('|');
}

export function conflictKeySet(scenario) {
  return new Set(scenario.conflicts.map(([a, b]) => pairKey(a, b)));
}

/** Wszystkie możliwe pary ról (i<j). */
export function allPairs(roles) {
  const pairs = [];
  for (let i = 0; i < roles.length; i += 1) {
    for (let j = i + 1; j < roles.length; j += 1) {
      pairs.push([roles[i].id, roles[j].id]);
    }
  }
  return pairs;
}

export function scoreSodSelection(scenario, selectedKeys) {
  const need = conflictKeySet(scenario);
  const selected = new Set(selectedKeys);
  let hit = 0;
  let wrong = 0;
  selected.forEach((k) => {
    if (need.has(k)) hit += 1;
    else wrong += 1;
  });
  const miss = need.size - hit;
  const raw = need.size === 0 ? 0 : Math.round(((hit - wrong * 0.5 - miss * 0.35) / need.size) * 100);
  return {
    hit,
    need: need.size,
    wrong,
    miss,
    pct: Math.max(0, Math.min(100, raw)),
  };
}

export { pairKey };
