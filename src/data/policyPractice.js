/**
 * Policy vs practice — design (kryterium) vs operating evidence (praktyka).
 */

export const GAP_OPTS = [
  { id: 'none', label: 'Brak gapu', tip: 'Praktyka spełnia politykę / compensating OK' },
  { id: 'design', label: 'Gap design', tip: 'Polityka/kontrola źle zdefiniowana lub jej brak' },
  { id: 'oe', label: 'Gap OE', tip: 'Polityka OK, wykonanie nieskuteczne / niespójne' },
  { id: 'doc', label: 'Tylko dokumentacja', tip: 'Praktyka OK, papier niespójny' },
];

export const POLICY_CASES = [
  {
    id: 'pp-leaver-sla',
    policy: 'Polityka JOML: dostęp wyłączany ≤24h od last working day.',
    practice: 'Export: 8/40 leaverów Q2 Enabled >7 dni; brak documented exceptions.',
    correct: 'oe',
    explain: 'Kryterium istnieje i jest jasne — nieskuteczne wykonanie = operating effectiveness gap.',
  },
  {
    id: 'pp-change-approval',
    policy: 'Wszystkie prod changes wymagają niezależnego approval przed deploy.',
    practice: 'Pipeline blokuje merge bez 1 review; deploy tylko z approved ticketu; próba 25/25 OK.',
    correct: 'none',
    explain: 'Praktyka i evidence wspierają politykę — brak gapu.',
  },
  {
    id: 'pp-no-change-policy',
    policy: '(brak) — nie ma udokumentowanej procedury change / emergency.',
    practice: 'Deploje FTP z laptopów devów; zero ticketów w okresie.',
    correct: 'design',
    explain: 'Brak zdefiniowanej kontroli = design deficiency, nie tylko OE.',
  },
  {
    id: 'pp-mfa',
    policy: 'MFA obowiązkowe dla wszystkich dostępów zdalnych i privileged.',
    practice: 'Conditional Access egzekwuje MFA; wyjątek: 1 break-glass z logowaniem i review tygodniowym.',
    correct: 'none',
    explain: 'Controlled exception z monitoringiem = zgodne z dobrą praktyką; nie OE fail.',
  },
  {
    id: 'pp-mfa-fail',
    policy: 'MFA obowiązkowe dla privileged.',
    practice: '12% Domain Admin bez MFA; shared break-glass bez logów.',
    correct: 'oe',
    explain: 'Polityka jest — egzekucja nie działa na krytycznej populacji.',
  },
  {
    id: 'pp-backup',
    policy: 'Krytyczne systemy: daily backup + restore test co kwartał.',
    practice: 'Daily backup OK; ostatni restore test 16 mies. temu (failed, bez retest).',
    correct: 'oe',
    explain: 'Wymóg restore jest w polityce; praktyka go nie spełnia.',
  },
  {
    id: 'pp-password-doc',
    policy: 'Hasła min. 14 znaków + MFA.',
    practice: 'Entra egzekwuje 14+MFA; stary PDF na intranetie mówi „8 znaków”.',
    correct: 'doc',
    explain: 'Kontrola techniczna OK — niespójna dokumentacja, nie fail dostępu.',
  },
  {
    id: 'pp-access-review',
    policy: 'Kwartalny access review przez data ownera z keep/revoke.',
    practice: 'Review „done in 25 min”; self-selected 4/180 users; privileged Keep bez rationale.',
    correct: 'oe',
    explain: 'Proces nominalnie istnieje, jakość/kompletność = OE gap (i sampling bias).',
  },
  {
    id: 'pp-vendor',
    policy: 'Critical vendors: aktualny SOC2 Type II + coroczny vendor RA + CUEC.',
    practice: 'SOC qualified exceptions; RA z 2023; CUEC folder pusty.',
    correct: 'oe',
    explain: 'Polityka TPRM jest — oversight nie jest wykonywany.',
  },
  {
    id: 'pp-logging-none',
    policy: 'Brak wymogu monitoringu admin actions (polityka milczy).',
    practice: 'Brak logów privileged; nikt nie reviewuje.',
    correct: 'design',
    explain: 'Jeśli ryzyko privileged jest materialne, brak wymogu w polityce = design gap.',
  },
  {
    id: 'pp-emergency-ok',
    policy: 'Emergency: retrospective approval ≤48h + PIR.',
    practice: 'CHG-9: emergency flag, approval CIO w 24h, PIR w ticketcie, deploy log linked.',
    correct: 'none',
    explain: 'Ścieżka emergency spełniona — to nie obejście kontroli.',
  },
  {
    id: 'pp-sod-silent',
    policy: 'SoD: developer ≠ produkcyjny deployer.',
    practice: 'Wszyscy full-stack mają obie role; brak risk acceptance i compensating.',
    correct: 'oe',
    explain: 'Polityka zakazuje; praktyka łamie bez acceptance = OE (ew. świadomy design bypass → nadal finding).',
  },
];
