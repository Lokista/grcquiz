/**
 * Exception vs deficiency sorter — klasyfikacja faktu jak na rozmowie Big4 / IT audit.
 *
 * Exception — odstępstwo od polityki/kontroli w próbce (incydent procesu), często wymaga
 *   oceny czy kontrola działa operacyjnie; bywa „known / approved”.
 * Deficiency — kontrola nie istnieje, jest źle zaprojektowana albo nieskuteczna (design / OE).
 * Observation — słabość / usprawnienie bez jasnego naruszenia kontroli / niskie ryzyko.
 * OK — fakt nie wskazuje na lukę (kontrola działa / compensating / poza scope).
 */

export const CLASSIFY_OPTIONS = [
  { id: 'exception', label: 'Exception', tip: 'Odstępstwo w wykonaniu / próbce (często jednostkowe)' },
  { id: 'deficiency', label: 'Deficiency', tip: 'Kontrola brak / zły design / nie działa (OE)' },
  { id: 'observation', label: 'Observation', tip: 'Usprawnienie / słabość bez twardego breach' },
  { id: 'ok', label: 'OK', tip: 'Brak luki — fakt nie wspiera findingu' },
];

export const CLASSIFY_RULES = {
  exception: 'Zdarzenie/odchylenie od procedury w konkretnym przypadku lub próbce — kontrola istnieje, ale wystąpił wyjątek (czasem approved).',
  deficiency: 'Problem systemowy: brak kontroli, zły design albo operating effectiveness nieskuteczna (powtarzalne / strukturalne).',
  observation: 'Warto poprawić, ale nie ma jasnego naruszenia kontroli lub ryzyko jest niskie / compensating silne.',
  ok: 'Dowód nie wskazuje na lukę — albo kontrola zadziałała, albo fakt jest mylący / poza kryterium.',
};

export const CLASSIFY_CASES = [
  {
    id: 'ex-leaver-active',
    fact: '3 z 25 leaverów w Q2 nadal miały Enabled=TRUE w AD >7 dni po last working day (SLA=24h). Brak documented exceptions.',
    correct: 'deficiency',
    explain: 'Powtarzalne naruszenie SLA deprovisioning = kontrola JOML nie działa skutecznie (OE deficiency), nie „jednorazowy wyjątek”.',
  },
  {
    id: 'ex-emergency-ok',
    fact: '1 emergency change bez CAB; w tickecie jest retrospective approval CIO + PIR w 48h zgodnie z procedurą emergency.',
    correct: 'ok',
    explain: 'Proces emergency przewiduje wyjątek od CAB przy retrospektywnym approval i PIR — to zgodność z kontrolą, nie finding.',
  },
  {
    id: 'ex-one-missed-review',
    fact: 'Access review Q1: 1 aplikacja z 40 nie została przejrzana w terminie; owner na urlopie; zrobiono w tygodniu 1 Q2; reszta OK; jest ticket wyjątku zatwierdzony przez CISO.',
    correct: 'exception',
    explain: 'Jednostkowe, udokumentowane odchylenie przy działającym procesie = exception (nie systemowa nieskuteczność).',
  },
  {
    id: 'ex-no-change-process',
    fact: 'Brak procedury change management; deploje na prod przez FTP z laptopów developerów; zero ticketów/approvali w okresie.',
    correct: 'deficiency',
    explain: 'Brak designu kontroli change = deficiency (nie exception w próbce — nie ma czego „odstępować”).',
  },
  {
    id: 'ex-password-hint',
    fact: 'Polityka haseł wymaga 14 znaków; w intranet FAQ jest stary screenshot z „min. 8 znaków”. Entra Conditional Access egzekwuje 14 + MFA.',
    correct: 'observation',
    explain: 'Praktyka egzekwowana jest OK; niespójna dokumentacja to observation / hygiene, nie twarda deficiency dostępu.',
  },
  {
    id: 'ex-shared-admin',
    fact: 'Wspólne konto Domain Admin „adm_shared” używane przez 4 osoby; hasło w KeePass zespołu; brak PAM; rotacja „gdy ktoś odejdzie”.',
    correct: 'deficiency',
    explain: 'Shared privileged bez accountability = zły design / brak kontroli privileged access.',
  },
  {
    id: 'ex-backup-fail-handled',
    fact: 'Job backup padł 1× (dysk full); alert → ticket → rozszerzenie repo tego samego dnia; restore test kwartalny zaliczony; brak powtórek.',
    correct: 'ok',
    explain: 'Kontrola detekcji i remediacji zadziałała; pojedynczy fail obsłużony ≠ deficiency.',
  },
  {
    id: 'ex-soc-qualified',
    fact: 'Vendor krytyczny: SOC 2 Type II qualified (access review missed 2 quarters). Client nie ma vendor RA update ani CUEC evidence od 18 miesięcy.',
    correct: 'deficiency',
    explain: 'TPRM oversight po stronie klienta nie działa (brak reakcji na exceptions / RA) = deficiency procesu vendor risk.',
  },
  {
    id: 'ex-firewall-temp',
    fact: 'Reguła ANY→RDP „temp vendor 2024” nadal ALLOW, last hit wczoraj; rule review nie był od 18 miesięcy; 30+ allow-any bez ownera.',
    correct: 'deficiency',
    explain: 'Systemowy brak rule review + stale permissive rules = OE/design deficiency network access control.',
  },
  {
    id: 'ex-sample-one-late',
    fact: 'W próbce 25 change’y: 24 mają approval przed deploy; 1 ma approval 2h po deploy (developer pomylił kolejność przycisków); ten sam change ma test + CAB OK; to pierwszy taki case w roku.',
    correct: 'exception',
    explain: 'Pojedyncze odchylenie timing approval przy silnym residual evidence procesu = exception do oceny, nie od razu pełna deficiency OE.',
  },
  {
    id: 'ex-dark-mode',
    fact: 'Konsola backupu nie ma dark mode; admini narzekają na UX.',
    correct: 'ok',
    explain: 'Poza kryterium kontroli ITGC/availability — nie finding audytowy bezpieczeństwa/kontroli.',
  },
  {
    id: 'ex-mfa-coverage',
    fact: 'MFA obowiązkowe w polityce; 12% kont uprzywilejowanych bez MFA (break-glass bez logowania użycia); reszta OK.',
    correct: 'deficiency',
    explain: 'Privileged bez MFA + niekontrolowany break-glass = kontrola MFA/privileged nieskuteczna dla krytycznej populacji.',
  },
  {
    id: 'ex-policy-typo',
    fact: 'W polityce ISMS literówka w nazwie systemu („SAAP” zamiast „SAP”); kontrole i SoA używają poprawnej nazwy.',
    correct: 'observation',
    explain: 'Kosmetyka dokumentacji bez wpływu na kontrolę = observation.',
  },
  {
    id: 'ex-approved-sod',
    fact: 'Developer ma też prawo deploy (SoD conflict); jest formalny risk acceptance CISO + compensating: mandatory 2-person release checklist + SIEM alert na self-deploy; review co kwartał.',
    correct: 'exception',
    explain: 'Znany, zaakceptowany konflikt z compensating = managed exception (nie „ukryta” deficiency), o ile acceptance jest aktualne.',
  },
];
