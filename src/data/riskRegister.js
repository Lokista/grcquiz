/**
 * Risk register mini — inherent → kontrola → residual (+ treatment).
 * Skala uproszczona 1–5 (L×I) jak na rozmowie Junior GRC.
 */

export const LEVELS = [1, 2, 3, 4, 5];

export const TREATMENTS = [
  { id: 'mitigate', label: 'Mitigate', tip: 'Wzmocnij / wdrażaj kontrole' },
  { id: 'accept', label: 'Accept', tip: 'Świadoma akceptacja (właściciel + limity)' },
  { id: 'transfer', label: 'Transfer', tip: 'Ubezpieczenie / outsourcing z umową' },
  { id: 'avoid', label: 'Avoid', tip: 'Wycofaj aktywność / system' },
];

export const RISK_CASES = [
  {
    id: 'rk-ransomware',
    title: 'Ransomware na ERP',
    scenario: 'Średnia firma produkcyjna. ERP w internecie przez legacy VPN bez MFA. Backup lokalny, bez offsite, restore nietestowany 18 mies.',
    asset: 'ERP / ciągłość produkcji',
    inherent: { L: 4, I: 5 }, // 20
    residualAfter: { L: 2, I: 3 }, // po MFA+offsite+restore drill — oczekiwany rząd
    /** Użytkownik wybiera residual L i I osobno; tolerancja ±1 na każdą oś jeśli treatment mitigate */
    correctTreatment: 'mitigate',
    controlsHint: 'MFA na VPN, EDR, offsite immutable backup, restore test, patch.',
    explain: 'Inherent wysokie (łatwy wektor + duży impact). Residual spada dopiero po realnych kontrolach — nie „accept” bez MFA/backup.',
  },
  {
    id: 'rk-vendor-payroll',
    title: 'Wyciek u vendora payroll',
    scenario: 'Krytyczny SaaS payroll. SOC2 qualified (access review gaps). Brak aktualnego vendor RA i CUEC u klienta.',
    asset: 'Dane wynagrodzeń / RODO',
    inherent: { L: 3, I: 5 },
    residualAfter: { L: 2, I: 4 },
    correctTreatment: 'mitigate',
    controlsHint: 'Vendor RA, CUEC (MFA SSO, leaver notify), bridge letter, contractual audit rights.',
    explain: 'Transfer częściowo (vendor), ale residual zostaje u klienta bez TPRM — mitigate oversight, nie samo „transfer”.',
  },
  {
    id: 'rk-lab-wifi',
    title: 'Otwarte Wi‑Fi w labie R&D',
    scenario: 'Odizolowana sieć lab (air-gap od prod). Tylko urządzenia testowe bez PII. Ryzyko: ktoś podłączy się do lab SSID.',
    asset: 'Lab network',
    inherent: { L: 3, I: 2 },
    residualAfter: { L: 2, I: 2 },
    correctTreatment: 'accept',
    controlsHint: 'Segmentacja już jest; opcjonalnie captive portal.',
    explain: 'Niski impact na biznes krytyczny + izolacja → accept z monitoringiem segmentacji jest rozsądny.',
  },
  {
    id: 'rk-shared-admin',
    title: 'Shared Domain Admin',
    scenario: '4 osoby, jedno konto adm_shared, hasło w KeePass zespołu. Brak PAM.',
    asset: 'AD / privileged access',
    inherent: { L: 5, I: 5 },
    residualAfter: { L: 2, I: 4 },
    correctTreatment: 'mitigate',
    controlsHint: 'Indywidualne konta, PAM/JIT, MFA, log review, zakaz shared.',
    explain: 'Nie accept bez compensating. Mitigate (lub avoid shared całkowicie).',
  },
  {
    id: 'rk-legacy-app',
    title: 'Aplikacja bez supportu',
    scenario: 'Stary system faktur EOL, vendor upadł. Zawiera dane finansowe. Migracja zaplanowana za 18 mies. WAF + izolacja VLAN + readonly poza miesiącem zamknięcia.',
    asset: 'Legacy billing',
    inherent: { L: 4, I: 4 },
    residualAfter: { L: 3, I: 3 },
    correctTreatment: 'accept',
    controlsHint: 'Time-boxed acceptance + compensating + plan migracji z ownerem.',
    explain: 'Avoid (wyłączenie) może blokować biznes; formal accept + compensate + deadline jest typowy GRC move.',
  },
  {
    id: 'rk-cloud-misconfig',
    title: 'Publiczny bucket S3',
    scenario: 'Dev wystawił bucket z logami (PII klientów) jako public-read „na chwilę”. Wykryte po 2 dniach przez CSPM.',
    asset: 'Customer PII / cloud',
    inherent: { L: 4, I: 5 },
    residualAfter: { L: 1, I: 4 },
    correctTreatment: 'mitigate',
    controlsHint: 'Natychmiast private + IR; SCP/deny public; CSPM gate w CI; szkolenie.',
    explain: 'Po incydencie: mitigate + ewentualnie transfer (cyber insurance) jako uzupełnienie, nie zamiast.',
  },
  {
    id: 'rk-third-party-api',
    title: 'API partnera bez SLA security',
    scenario: 'Startup partner, brak SOC, umowa bez security exhibit. Integracja read-only katalog produktów (bez PII).',
    asset: 'Product catalog API',
    inherent: { L: 3, I: 2 },
    residualAfter: { L: 2, I: 2 },
    correctTreatment: 'accept',
    controlsHint: 'Minimal scope, rate limit, monitoring; później DPA jeśli zakres urośnie.',
    explain: 'Niski impact (brak PII) → accept z ograniczeniem scope; mitigate jeśli dojdą dane osobowe.',
  },
  {
    id: 'rk-physical-dc',
    title: 'Serwerownia bez CCTV',
    scenario: 'Mały DC on-prem, kontrola dostępu kartami + strażnik 24/7, brak kamer. Audyt ISO pyta o A.7 physical.',
    asset: 'Physical security',
    inherent: { L: 2, I: 4 },
    residualAfter: { L: 2, I: 3 },
    correctTreatment: 'mitigate',
    controlsHint: 'CCTV lub uzasadniony exclude w SoA z compensating (access logs + escort).',
    explain: 'Dla ISO często mitigate (kamery) albo świadomy SoA exclude — nie ignorować.',
  },
  {
    id: 'rk-insider-fraud',
    title: 'Fraud AP bez SoD',
    scenario: 'Jedna osoba tworzy vendor, zatwierdza fakturę i księguje płatność. Brak 4-eyes.',
    asset: 'Płatności / fraud',
    inherent: { L: 4, I: 5 },
    residualAfter: { L: 2, I: 4 },
    correctTreatment: 'mitigate',
    controlsHint: 'SoD, dual approval, bank recon niezależny.',
    explain: 'Klasyczny mitigate — accept fraud risk bez SoD jest rzadko do obrony.',
  },
  {
    id: 'rk-shutdown-product',
    title: 'Produkt z nieakceptowalnym ryzykiem',
    scenario: 'Aplikacja medyczna przetwarza dane zdrowotne bez podstawy prawnej i bez zabezpieczeń. Legal: brak możliwości compliance w 90 dni.',
    asset: 'Health data product',
    inherent: { L: 5, I: 5 },
    residualAfter: { L: 1, I: 1 },
    correctTreatment: 'avoid',
    controlsHint: 'Wycofanie produktu / stop processing do czasu legal+security baseline.',
    explain: 'Gdy nie da się zmitigować w czasie — avoid (zaprzestanie).',
  },
];

export function scoreBand(L, I) {
  return L * I;
}

/** Residual OK jeśli obie osie w tolerancji ±1 względem modelu i residual < inherent score */
export function scoreRiskPick(caseItem, pickL, pickI, treatment) {
  const inh = scoreBand(caseItem.inherent.L, caseItem.inherent.I);
  const target = caseItem.residualAfter;
  const Lok = Math.abs(pickL - target.L) <= 1;
  const Iok = Math.abs(pickI - target.I) <= 1;
  const residual = scoreBand(pickL, pickI);
  const reduced = residual < inh;
  const treatOk = treatment === caseItem.correctTreatment;
  let pct = 0;
  if (Lok) pct += 30;
  if (Iok) pct += 30;
  if (reduced) pct += 10;
  if (treatOk) pct += 30;
  return {
    pct,
    Lok,
    Iok,
    treatOk,
    reduced,
    inherentScore: inh,
    residualScore: residual,
    perfect: Lok && Iok && treatOk && reduced,
  };
}
