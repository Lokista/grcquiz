import { C } from './shape.js';

// Case studies audytowe — scenariusz + pytania strukturyzowane + analiza wzorcowa.
// Aby dodać case: dopisz C({...}). Pytania: type 'multi'|'single', correct = [] | idx.

export const CASE_STUDIES = [
  C({
    id: 'case-erp',
    topicKey: 'controls',
    title: 'System ERP — dojrzała firma produkcyjna',
    difficulty: 'junior',
    minutes: 14,
    scenario: {
      context: `Firma produkcyjna (600 osób) używa systemu ERP jako systemu core. Audyt ITGC + ITAC. Poniższe ustalenia z fazy rozpoznania:`,
      facts: [
        { label: 'Administratorzy', value: '40 kont z uprawnieniami admin', flag: 'risk' },
        { label: 'MFA', value: 'Brak MFA dla administratorów', flag: 'risk' },
        { label: 'Przegląd uprawnień', value: 'Nie robiony od 2 lat', flag: 'risk' },
        { label: 'Backup', value: 'Istnieje, logi sukcesu, ale nigdy nie testowano odtworzenia', flag: 'risk' },
        { label: 'Zmiany produkcyjne', value: 'Jeden administrator wykonuje wszystkie zmiany', flag: 'risk' },
        { label: 'Change Management', value: 'Brak formalnego procesu zatwierdzania zmian', flag: 'risk' },
      ],
    },
    questions: [
      {
        id: 'q-risks', type: 'multi', points: 6,
        prompt: 'Zaznacz największe ryzyka w tym scenariuszu:',
        options: [
          'Brak MFA dla administratorów',
          'Brak przeglądu uprawnień od 2 lat',
          'Backup istnieje, ale bez testu odtworzenia',
          'Jeden administrator wykonuje wszystkie zmiany produkcyjne (SoD)',
          'Brak formalnego procesu zatwierdzania zmian',
          '40 kont administratorów (duża powierzchnia ataku)',
          'Proces onboardingu nowych pracowników HR',
        ],
        correct: [0, 1, 2, 3, 4, 5],
        explain: 'Wszystkie 6 to realne ryzyka (MFA, access review, backup, SoD, change mgmt, nadmiar adminów). Onboarding HR nie jest ryzykiem w tym scenariuszu.',
      },
      {
        id: 'q-critical', type: 'single', points: 3,
        prompt: 'Które ryzyko ma najwyższy wpływ (impact) i powinno być potraktowane jako KRYTYCZNE?',
        options: [
          'Brak MFA dla 40 administratorów (przejęcie konta uprzywilejowanego)',
          'Brak przeglądu uprawnień od 2 lat',
          'Brak formalnego Change Management',
        ],
        correct: 0,
        explain: '40 adminów bez MFA = bezpośrednia droga do przejęcia środowiska (phishing/credential stuffing). W połączeniu z brakiem przeglądu i SoD = najwyższy impact. Inne są wysokie, ale to jest krytyczne.',
      },
      {
        id: 'q-recs', type: 'multi', points: 6,
        prompt: 'Jakie rekomendacje dasz klientowi?',
        options: [
          'Wdrożyć MFA dla 100% kont uprzywilejowanych (najlepiej FIDO2)',
          'Cykliczny przegląd dostępu (np. co 90 dni) z realnymi revokami',
          'Wdrożyć PAM z kontami imiennymi i just-in-time access',
          'Ustanowić formalny Change Management (CR, approval, testy, rollback, SoD)',
          'Kwartalny test restore z pomiarem RTO/RPO',
          'Zmniejszyć liczbę administratorów do minimum wymaganego',
          'Wyłączyć wszystkie systemy produkcyjne do czasu remediacji',
        ],
        correct: [0, 1, 2, 3, 4, 5],
        explain: 'Konkretne, proporcjonalne rekomendacje. Wyłączenie produkcji nie jest proporcjonalne — to decyzja klienta o ryzyku, nie rekomendacja audytu.',
      },
      {
        id: 'q-itgc', type: 'multi', points: 4,
        prompt: 'Które z tych problemów dotyczą ITGC (a nie ITAC)?',
        options: [
          'Brak MFA / zarządzanie dostępem (Access Management)',
          'Brak przeglądu uprawnień (Access Management)',
          'Jeden admin wszystkie zmiany / brak zatwierdzania (Change Management)',
          'Backup bez testu restore (Backup & Recovery)',
          'Walidacja formatu PESEL w formularzu pracownika',
        ],
        correct: [0, 1, 2, 3],
        explain: 'Access/Change/Backup to klasyczne ITGC (ogólne środowisko IT). Walidacja PESEL w formularzu to ITAC (kontrola wewnątrz aplikacji HR).',
      },
      {
        id: 'q-controls', type: 'multi', points: 5,
        prompt: 'Jakie kontrole powinny istnieć, by załatać te luki?',
        options: [
          'MFA + PAM + konta imienne admin',
          'Access review co 90 dni z revokami i audit trail',
          'Change Management: CR + approval + testy + code review + rollback + SoD',
          'Kwartalny test restore z raportem RTO/RPO + backup offline/immutable',
          'Logging & Monitoring: SIEM, alerty akcji administratora',
          'Brak logów akcji administratora (oszczędność miejsca)',
        ],
        correct: [0, 1, 2, 3, 4],
        explain: 'Brak logów akcji admina to luka, nie kontrola — uniemożliwia rozliczalność, zwłaszcza przy kontach współdzielonych.',
      },
      {
        id: 'q-residual', type: 'single', points: 2,
        prompt: 'Jak ocenić ryzyko residualne po wdrożeniu rekomendacji?',
        options: [
          'Porównać residualne z apetytem na ryzyko; jeśli wyższe — dodatkowe kontrole lub formalna akceptacja governance z terminem',
          'Założyć, że po kontrolach ryzyko = 0',
          'Porównać tylko z karą RODO, ignorując inne skutki',
          'Zostawić bez oceny — klient sam zdecyduje',
        ],
        correct: 0,
        explain: 'Residualne nigdy nie jest zerowe. Porównujemy je z apetytem na ryzyko zarządu; jeśli wyższe — mitigat lub formalna akceptacja (risk acceptance) z kompensacją i terminem.',
      },
    ],
    modelAnalysis: `Największe ryzyka: (1) 40 adminów bez MFA → przejęcie konta uprzywilejowanego (KRYTYCZNE — phishing/credential stuffing daje bezpośredni dostęp do ERP); (2) brak przeglądu uprawnień od 2 lat → nadmiarowe i "zombie" dostępy (RODO + fraud); (3) backup bez testu restore → ryzyko utraty danych pozostaje wysokie mimo kopii; (4) jeden admin robi wszystkie zmiany + brak Change Management → SoD i awarie/nieautoryzowane zmiany.

Obszary ITGC: Access Management (MFA, przegląd), Change Management (approval, SoD, rollback), Backup & Recovery (test restore). Walidacja PESEL w formularzu to ITAC, nie ITGC.

Rekomendacje (priorytet): MFA FIDO2 dla 100% adminów; PAM z kontami imiennymi i JIT; access review co 90 dni z revokami i audit trail; formalny Change Management (CR, approval, testy, code review, rollback, SoD — osobny develop/wdrażający/audytujący); kwartalny test restore z RTO/RPO + backup offline/immutable; redukcja liczby adminów do minimum; SIEM + alerty akcji admina.

Ryzyko residualne: po wdrożeniu oceniam na nowo L×I i porównuję z apetytem na ryzyko zarządu. Np. przejęcie konta: inherent 20 → po MFA+PAM+monitoring residual ~8. Jeśli apetyt = 6, potrzebny plan dodatkowy (np. contingent z ubezpieczeniem) lub formalna akceptacja governance z terminem i kompensacją. Nigdy nie założymy residual = 0.`,
  }),

  C({
    id: 'case-ad',
    topicKey: 'identity',
    title: 'Active Directory — firma fintech',
    difficulty: 'junior',
    minutes: 12,
    scenario: {
      context: `Firma fintech (180 osób, płatności B2B). Audyt tożsamości i dostępu. Ustalenia z rozpoznania:`,
      facts: [
        { label: 'Domain Admins', value: '35 kont w grupie Domain Admins', flag: 'risk' },
        { label: 'Konta serwisowe', value: 'Hasła niezmieniane od 3 lat, brak gMSA', flag: 'risk' },
        { label: 'LAPS', value: 'Nie wdrożony — ten sam hasło lokalnego admina na endpointach', flag: 'risk' },
        { label: 'Konta wyłączone', value: 'Nie usuwane, część "zapomnianych" kont', flag: 'risk' },
        { label: 'Logowanie', value: 'Logi wysyłane do SIEM, ale alerty rzadko przeglądane', flag: 'risk' },
        { label: 'MFA', value: 'Wdrożone dla VPN i O365', flag: 'ok' },
      ],
    },
    questions: [
      {
        id: 'q-risks', type: 'multi', points: 5,
        prompt: 'Zaznacz najważniejsze ryzyka/zagrożenia w AD:',
        options: [
          '35 kont w Domain Admins (zbyt duża powierzchnia ataku, eskalacja)',
          'Konta serwisowe ze starymi hasłami, bez gMSA (Kerberoasting)',
          'Brak LAPS — ten sam lokalny admin na endpointach (lateral movement)',
          'Konta wyłączone nieusunięte (kradzież/wskrzeszenie konta)',
          'Logi do SIEM, ale alerty nie przeglądane (niska detekcja)',
          'MFA na VPN i O365',
        ],
        correct: [0, 1, 2, 3, 4],
        explain: 'Pierwsze 5 to ryzyka. MFA na VPN/O365 to kontrola (positive), nie ryzyko — choć brak MFA na AD lokalnie mógłby być ujęty osobno.',
      },
      {
        id: 'q-attacks', type: 'multi', points: 4,
        prompt: 'Jakie ataki są ułatwione przez te luki?',
        options: [
          'Kerberoasting (konta serwisowe ze starymi hasłami)',
          'Pass-the-Hash / lateral movement (brak LAPS, ten sam lokalny admin)',
          'Eskalacja do Domain Admin (35 kont = duża szansa przejęcia jednego)',
          'Wskrzeszenie wyłączonego konta (nieusunięte)',
          'DDoS na stronę marketingową',
        ],
        correct: [0, 1, 2, 3],
        explain: 'Konkretne ataki AD: Kerberoasting, PtH/lateral, eskalacja, wskrzeszenie konta. DDoS marketingu nie wynika z tych luk.',
      },
      {
        id: 'q-recs', type: 'multi', points: 5,
        prompt: 'Jakie rekomendacje dasz?',
        options: [
          'Zmniejszyć Domain Admins do minimum (np. 2–3), używać tylko do zadań admin domeny',
          'Wdrożyć gMSA dla kont serwisowych + rotacja haseł',
          'Wdrożyć LAPS na endpointach (unikalne hasła lokalnego admina)',
          'Usunąć wyłączone konta wg polityki retencji (np. 30 dni po offboardingu)',
          'Tier model + PAM z JIT dla uprawniejowanych',
          'Przegląd alertów SIEM z SLA + eskalacja (logging & monitoring)',
          'Wyłączyć wszystkie konta Domain Admin natychmiast',
        ],
        correct: [0, 1, 2, 3, 4, 5],
        explain: 'Proporcjonalne rekomendacje. Wyłączenie wszystkich Domain Admin zablokowałoby pracę — audytor nie paraliżuje klienta.',
      },
      {
        id: 'q-priority', type: 'single', points: 2,
        prompt: 'Co naprawiasz w pierwszej kolejności?',
        options: [
          'Redukcja Domain Admins + MFA/PAM dla pozostałych (najwyższy impact, niski koszt)',
          'Renowacja biura',
          'Migracja do nowej domeny AD',
          'Zakup drugiego SIEM-a',
        ],
        correct: 0,
        explain: 'Najwyższy impact (przejęcie domeny) + proporcjonalny koszt — redukcja Domain Admins i MFA/PAM to quick win o najwyższym ROI.',
      },
    ],
    modelAnalysis: `Najważniejsze ryzyka: 35 kont w Domain Admins (duża powierzchnia ataku i eskalacja), konta serwisowe ze starymi hasłami bez gMSA (Kerberoasting), brak LAPS (ten sam lokalny admin → lateral movement / Pass-the-Hash), konta wyłączone nieusunięte (wskrzeszenie/kradzież), logi do SIEM ale alerty nie przeglądane (niska detekcja). MFA na VPN/O365 to pozytyw, ale lokalne logowanie do AD nie jest chronione.

Priorytet remediacji (wg impact/koszt): (1) redukcja Domain Admins do 2–3 + MFA/PAM JIT dla uprzywilejowanych; (2) gMSA dla kont serwisowych + rotacja; (3) LAPS na endpointach; (4) usunięcie wyłączonych kont wg retencji; (5) SLA przeglądu alertów SIEM + eskalacja. Tier model (izolacja adminów od endpointów) średnioterminowo.

Po remediacji: residual przejęcia domeny inherent ~20 → po Domain Admins+MFA+PAM+LAPS+monitoring ~6–8; porównać z apetytem i ewentualnie formalna akceptacja z kompensacją.`,
  }),

  C({
    id: 'case-backup-bcp',
    topicKey: 'controls',
    title: 'Backup i ciągłość działania — SaaS B2B',
    difficulty: 'junior',
    minutes: 10,
    scenario: {
      context: `Dostawca SaaS B2B (120 osób). Audyt Backup & Recovery i BCP. Ustalenia:`,
      facts: [
        { label: 'Backup', value: 'Codzienny, logi sukcesu, ale restore testowany raz 18 mies. temu', flag: 'risk' },
        { label: 'Kopia', value: 'Tylko online, w tej samej infrastrukturze co produkcja', flag: 'risk' },
        { label: 'RTO/RPO', value: 'Zdefiniowane w dokumencie, ale nie mierzone w teście', flag: 'risk' },
        { label: 'BCP/DR', value: 'Dokument BCP istnieje, tabletop nie robiony', flag: 'risk' },
        { label: 'Szyfrowanie backupu', value: 'Brak szyfrowania kopii', flag: 'risk' },
      ],
    },
    questions: [
      {
        id: 'q-risks', type: 'multi', points: 5,
        prompt: 'Zaznacz najważniejsze ryzyka:',
        options: [
          'Restore testowany 18 mies. temu (operating effectiveness niepotwierdzona)',
          'Kopia tylko online w tej samej infrastrukturze (ransomware szyfruje też backup)',
          'RTO/RPO zdefiniowane ale nie mierzone (nie wiadomo, czy osiągalne)',
          'Brak tabletop BCP (zespoły nie znają ról w kryzysie)',
          'Brak szyfrowania backupu (Confidentiality)',
        ],
        correct: [0, 1, 2, 3, 4],
        explain: 'Wszystkie 5 to realne ryzyka dostępności i poufności. Kopia online w tej samej infra = klasyczny błąd vs ransomware.',
      },
      {
        id: 'q-recs', type: 'multi', points: 5,
        prompt: 'Jakie rekomendacje dasz?',
        options: [
          'Kwartalny test restore z pomiarem RTO/RPO i raportem',
          'Kopia offline/immutable (air-gap) chroniona przed ransomware',
          'Szyfrowanie backupu (Confidentiality)',
          'Roczny tabletop BCP/DR z rolami, eskalacją i lessons learned',
          'Retencja wg polityki + test integralności kopii',
          'Wyłączyć backup, by oszczędzić miejsce',
        ],
        correct: [0, 1, 2, 3, 4],
        explain: 'Kompleksowe rekomendacje dostępności i poufności. Wyłączenie backupu zwiększa ryzyko — to nie rekomendacja.',
      },
      {
        id: 'q-residual', type: 'single', points: 2,
        prompt: 'Po remediacji jak oceniasz residual?',
        options: [
          'Poniżej apetytu przy kwartalnym teście restore + offline/immutable + DR tabletop — residual akceptowalny',
          'Nadal krytyczne — niemożliwe do obniżenia',
          'Nigdy nie oceniamy residual w BCP',
          'Residual = 0 po wdrożeniu kopii offline',
        ],
        correct: 0,
        explain: 'Skuteczne kontrole (test restore, offline/immutable, DR tabletop) obniżają residual poniżej apetytu. Nigdy nie jest 0 — pozostałe ryzyko (np. regionalna awaria) kompensuje DR/geo-redundancja.',
      },
    ],
    modelAnalysis: `Krytyczne luki: restore testowany 18 mies. temu (kontrola backupu istnieje, ale operating effectiveness niepotwierdzona); kopia tylko online w tej samej infrastrukturze (ransomware szyfruje produkcję i backup — klasyk); RTO/RPO zdefiniowane ale nie mierzone (nie wiadomo, czy osiągalne); brak tabletop BCP (zespoły nie znają ról w kryzysie); brak szyfrowania kopii (Confidentiality).

Rekomendacje: kwartalny test restore z pomiarem RTO/RPO i raportem; kopia offline/immutable (air-gap) chroniona przed ransomware; szyfrowanie backupu; roczny tabletop BCP/DR z rolami, eskalacją, lessons learned; retencja wg polityki + test integralności kopii; geo-redundancja dla regionalnych awarii.

Residual: po wdrożeniu (test restore + offline/immutable + DR tabletop + szyfrowanie) residual utraty danych/przestoju spada poniżej apetytu; pozostałe ryzyko regionalne kompensuje DR/geo-redundancja. Nigdy residual = 0.`,
  }),

  // --- Pakiet ze ściągi GRC / rozmowa bankowa ---
  C({
    id: 'case-bank-leaver',
    topicKey: 'identity',
    title: 'Bank — offboarding / leaver (AD)',
    difficulty: 'junior',
    minutes: 12,
    scenario: {
      context: `Bank (retail). Scope: offboarding / leaver — Active Directory + dostęp do systemów. Manager mówi: „U nas offboarding działa — HR zawsze pisze do IT.” Dostajesz: zrzut czatu Teams z HR (bez daty) i ustną deklarację.`,
      facts: [
        { label: 'Deklaracja managera', value: '„HR zawsze pisze do IT”', flag: 'risk' },
        { label: 'Evidence dostarczone', value: 'Screenshot Teams bez daty + ustna deklaracja', flag: 'risk' },
        { label: 'Polityka (klient)', value: 'Disable AD/ERP/VPN/mail w dniu odejścia', flag: 'ok' },
        { label: 'Próbka (później)', value: 'Do ustalenia po request list', flag: 'ok' },
      ],
    },
    questions: [
      {
        id: 'q-next', type: 'single', points: 3,
        prompt: 'Co robisz NAJPIERW jako audytor?',
        options: [
          'Odhaczam kontrolę — manager potwierdził, że działa',
          'Ustalam scope, ownerów, walkthrough; proszę o request list (HR date, ticket, disable, logi) — nie biorę czatu za dowód',
          'Wyłączam konta pracowników samodzielnie',
          'Piszę finding krytyczny bez próbki',
        ],
        correct: 1,
        explain: 'Ściąga: scope → owner → walkthrough → request list. Deklaracja i Teams bez daty = słabe evidence.',
      },
      {
        id: 'q-evidence', type: 'multi', points: 5,
        prompt: 'Jakie evidence jest na request list offboardingu (ściąga)?',
        options: [
          'Data odejścia z HR',
          'Ticket offboardingowy',
          'Data disable konta',
          'Logi / potwierdzenie blokady AD (oraz ERP/VPN/mail wg polityki)',
          'Odebranie aplikacji, grup, MFA/tokena, dostępu fizycznego',
          'Sam zrzut Teams bez daty jako jedyny dowód',
        ],
        correct: [0, 1, 2, 3, 4],
        explain: 'Evidence checklist offboarding. Ustna deklaracja / screenshot bez kontekstu = słabe.',
      },
      {
        id: 'q-redflags', type: 'multi', points: 4,
        prompt: 'Jakie red flags szukasz przy leaverze?',
        options: [
          'Konto aktywne po odejściu',
          'Brak ticketu / brak daty disable',
          'Brak access review w kontekście leaverów',
          'Shared account / nadmiarowe role przy dostępie',
          'Zielony status „backup successful” bez restore',
        ],
        correct: [0, 1, 2, 3],
        explain: 'Backup to inny obszar. Leaver: unauthorized access gdy konto żyje po odejściu.',
      },
      {
        id: 'q-pass', type: 'single', points: 3,
        prompt: 'Kiedy uznasz PASS na próbce?',
        options: [
          'Gdy manager potwierdzi ustnie, że „zawsze tak robimy”',
          'Gdy na próbce: data HR ↔ ticket ↔ disable w terminie polityki + logi',
          'Gdy jest jakikolwiek screenshot czatu',
          'Gdy polityka istnieje — bez testu operating',
        ],
        correct: 1,
        explain: 'Pass = operating effectiveness na próbce z mocnym evidence. Exception → wyjaśnienie + dodatkowy dowód; finding gdy potwierdzone (np. konto aktywne).',
      },
      {
        id: 'q-severity', type: 'single', points: 2,
        prompt: 'Konto byłego pracownika aktywne 14 dni po odejściu — severity (bank)?',
        options: [
          'Low — to tylko jeden przypadek',
          'High — unauthorized access, dane klientów / systemy bankowe',
          'Brak finding — HR obiecał poprawę',
          'Medium tylko gdy brak MFA',
        ],
        correct: 1,
        explain: 'Ściąga banking: konto po odejściu = unauthorized access; high przy danych/systemach krytycznych.',
      },
    ],
    modelAnalysis: `Krok po kroku (ściąga): scope (system/proces/okres/kontrola) → polityki → process/control owner → walkthrough → request list → ryzyka/kontrole → próbka → design vs operating → wyjątki → finding.

Evidence offboarding: data HR, ticket, data disable, logi blokady, odebranie aplikacji/grup/MFA/fizycznego. Teams bez daty + deklaracja = słabe — nie potwierdzam skuteczności.

Red flags: konto aktywne po odejściu, brak ticketu/disable, shared/nadmiarowe role, brak review. Pass tylko przy śladzie HR↔ticket↔disable+logi. Finding: condition (np. 1/25 aktywne), criteria (polityka disable w dniu X), cause, risk unauthorized access, recommendation (SLA + automatyzacja HR→IAM), management response.`,
  }),

  C({
    id: 'case-bank-hotfix',
    topicKey: 'controls',
    title: 'Bank — hotfix płatności bez Change Management',
    difficulty: 'junior',
    minutes: 12,
    scenario: {
      context: `Core banking / system płatności. Developer: „Wrzuciłem hotfix na prod, bo było pilne — ticket zrobię później. Testowałem lokalnie.” Brak approvala przed wdrożeniem, brak UAT, brak rollback planu w ticketcie.`,
      facts: [
        { label: 'Ticket przed wdrożeniem', value: 'Brak (obiecany „później”)', flag: 'risk' },
        { label: 'Approval przed deploy', value: 'Brak', flag: 'risk' },
        { label: 'Testy / UAT', value: 'Tylko lokalnie', flag: 'risk' },
        { label: 'Rollback plan', value: 'Brak w ticketcie', flag: 'risk' },
        { label: 'SoD', value: 'Developer sam wdraża własną zmianę', flag: 'risk' },
        { label: 'System', value: 'Płatności — fraud / błąd płatności', flag: 'risk' },
      ],
    },
    questions: [
      {
        id: 'q-redflags', type: 'multi', points: 5,
        prompt: 'Zaznacz red flags Change Management z tego opisu:',
        options: [
          'Brak ticketu przed wdrożeniem',
          'Brak approvala przed wdrożeniem',
          'Brak testów/UAT (tylko lokalnie)',
          'Deployment przed zgodą / „ticket później”',
          'Developer sam wdraża własną zmianę',
          'Brak rollback planu',
          'Istnienie polityki Change — sama w sobie red flag',
        ],
        correct: [0, 1, 2, 3, 4, 5],
        explain: 'Ściąga Change: ticket, risk assessment, approval, review, testy/UAT, deploy, dokumentacja, rollback. Polityka to kryterium, nie red flag.',
      },
      {
        id: 'q-evidence', type: 'multi', points: 4,
        prompt: 'Jakie evidence poprosisz (checklist Change)?',
        options: [
          'Ticket / opis zmiany',
          'Approval przed wdrożeniem',
          'Test / UAT evidence',
          'PR / code review',
          'Deployment log',
          'Rollback plan / dokumentacja',
          'Sam screenshot Teams „było pilne”',
        ],
        correct: [0, 1, 2, 3, 4, 5],
        explain: 'Evidence checklist Change ze ściągi. Deklaracja „pilne” ≠ dowód kontroli.',
      },
      {
        id: 'q-severity', type: 'single', points: 3,
        prompt: 'Severity w banku / systemie płatności?',
        options: [
          'Low — hotfixi są normalne',
          'High — brak approvala/testów/rollback przy płatnościach = fraud, awaria, niezgodność',
          'Medium tylko gdy brak MFA',
          'Brak finding — emergency zawsze OK bez śladu',
        ],
        correct: 1,
        explain: 'Odpowiedzi bankowe: system płatności = duże ryzyko fraudu/błędu; brak approvala zmiany = awaria/luka/niezgodność.',
      },
      {
        id: 'q-recs', type: 'multi', points: 4,
        prompt: 'Rekomendacje zgodne z procesem Change (ściąga)?',
        options: [
          'Ticket + opis + risk assessment przed wdrożeniem',
          'Approval przed wdrożeniem',
          'Development + code review',
          'Testy / UAT przed prod',
          'Deployment z dokumentacją i rollback planem',
          'Emergency change z retro CR / approval (nie „bez śladu”)',
          'Zakazać wszystkich hotfixów na zawsze',
        ],
        correct: [0, 1, 2, 3, 4, 5],
        explain: 'Proces ze ściągi + emergency ze śladem. Zakaz absolutny nie jest rekomendacją audytora.',
      },
    ],
    modelAnalysis: `Red flags: brak ticketu/approvalu/testów, deploy przed zgodą, developer sam wdraża, brak rollback.

Evidence: ticket, approval, test/UAT, PR/review, deployment log, rollback.

Severity High w płatnościach (fraud, błąd, reputacja, zgodność).

Rekomendacja: pełny Change (ticket → risk → approval → dev → review → test/UAT → deploy → dokumentacja + rollback); emergency z retro CR. Finding wg szablonu: condition, criteria (polityka CM), cause, risk/impact, recommendation, management response.`,
  }),

  C({
    id: 'case-entra-bank',
    topicKey: 'identity',
    title: 'Bank — Microsoft Entra / M365',
    difficulty: 'junior',
    minutes: 12,
    scenario: {
      context: `Bank używa Microsoft Entra ID (Azure AD) + M365. Audyt IAM w chmurze. Ustalenia z rozpoznania:`,
      facts: [
        { label: 'Privileged roles', value: 'Global Admin: 18 kont; PIM nie wymuszony (stałe role)', flag: 'risk' },
        { label: 'MFA / Conditional Access', value: 'MFA wyłączone dla „awaryjnych” kont break-glass; legacy auth włączony', flag: 'risk' },
        { label: 'Guest users', value: '240 guestów; brak kwartalnego review; część z dostępem do SharePoint z danymi klientów', flag: 'risk' },
        { label: 'Service principals', value: 'App registrations z Client Secret bez ownera i bez rotacji >18 mies.', flag: 'risk' },
        { label: 'Audit logs', value: 'Logi są, retencja 30 dni; brak alertów na role changes', flag: 'risk' },
        { label: 'Access review', value: 'Nie prowadzony dla privileged / guest', flag: 'risk' },
      ],
    },
    questions: [
      {
        id: 'q-ask', type: 'multi', points: 5,
        prompt: 'O co pytasz / co weryfikujesz w Entra (ściąga Cloud/M365)?',
        options: [
          'IAM, Conditional Access, MFA',
          'Privileged roles + PIM/PAM',
          'Guest users, inactive accounts, role changes',
          'Service principals, legacy auth',
          'Audit logs, backup/retention, secure configuration',
          'Ownerów, access review, hardening',
          'Kolor brandingu banku',
        ],
        correct: [0, 1, 2, 3, 4, 5],
        explain: 'Detail Cloud/Entra ze ściągi — branding nie jest kontrolą IAM.',
      },
      {
        id: 'q-risks', type: 'multi', points: 5,
        prompt: 'Największe ryzyka w tym scenariuszu:',
        options: [
          'Za dużo stałych Global Admin bez PIM (privilege escalation / przejęcie)',
          'Legacy auth + wyjątki MFA (account takeover)',
          'Guest bez review z dostępem do danych klientów (data leakage / unauthorized access)',
          'Service principals bez ownera i stare sekrety',
          'Krótka retencja logów + brak alertów role changes (słaba detekcja)',
          'Brak access review privileged/guest',
        ],
        correct: [0, 1, 2, 3, 4, 5],
        explain: 'Wszystkie wynikają z faktów — mapują na threats ze ściągi (unauthorized access, privilege, leakage, misconfig).',
      },
      {
        id: 'q-evidence', type: 'multi', points: 4,
        prompt: 'Jakie evidence poprosisz?',
        options: [
          'Eksport privileged roles + status PIM',
          'Polityki Conditional Access + raport MFA compliance',
          'Lista guest + ostatni access review',
          'Lista app registrations / service principals + owner + data sekretu',
          'Sample audit logs / alerty role changes',
          'Sam zrzut Teams „mamy MFA”',
        ],
        correct: [0, 1, 2, 3, 4],
        explain: 'Mocne evidence = export/raport/konfiguracja. Deklaracja = słabe.',
      },
      {
        id: 'q-recs', type: 'multi', points: 4,
        prompt: 'Rekomendacje:',
        options: [
          'Wymuszyć PIM (JIT) dla privileged; zredukować stałych Global Admin',
          'MFA + Conditional Access; wyłączyć legacy auth; kontrolowane break-glass',
          'Kwartalny review guest + least privilege do SharePoint',
          'Owner + rotacja sekretów service principals; monitoring',
          'Dłuższa retencja logów + alerty na role changes',
          'Wyłączyć cały Entra do czasu remediacji',
        ],
        correct: [0, 1, 2, 3, 4],
        explain: 'Proporcjonalne kontrole ze ściągi (PIM/PAM, MFA, review, logging). Shutdown Entra nie jest rekomendacją audytora.',
      },
      {
        id: 'q-severity', type: 'single', points: 2,
        prompt: '18 stałych Global Admin bez PIM + legacy auth — severity w banku?',
        options: [
          'Low',
          'High — privileged + account takeover przy danych/transakcjach',
          'Brak finding — chmura Microsoft jest bezpieczna domyślnie',
          'Medium tylko gdy brak backupu',
        ],
        correct: 1,
        explain: 'Banking: brak MFA/admini / privilege = high risk.',
      },
    ],
    modelAnalysis: `Entra checklist (ściąga): IAM, CA, MFA, privileged + PIM/PAM, guest, inactive, audit logs, retention, public exposure, secure config, role changes, service principals, legacy auth + ownerzy/review/logi/hardening.

Tu: za dużo stałych GA, brak PIM, legacy auth, guest bez review, stare SP, krótka retencja, brak alertów = unauthorized access / privilege escalation / leakage / słaba detekcja.

Evidence: export ról, CA/MFA, guest review, SP owners/sekrety, logi. Rec: PIM JIT, redukcja GA, MFA+CA, off legacy, guest review, SP hygiene, retencja+alerty.`,
  }),

  C({
    id: 'case-vendor-bank',
    topicKey: 'frameworks',
    title: 'Bank — third party / vendor (chmura kredytu)',
    difficulty: 'junior',
    minutes: 11,
    scenario: {
      context: `Bank wdraża SaaS do scoringu kredytowego z danymi klientów. Vendor ma dostęp do API i plików. Due diligence przed go-live jest „w toku”.`,
      facts: [
        { label: 'Umowa / DPA', value: 'Umowa handlowa jest; DPA „wyślemy później”', flag: 'risk' },
        { label: 'SOC2 / ISO', value: 'Vendor pokazał marketing PDF „jesteśmy secure”; brak SOC2 Type II / ISO cert', flag: 'risk' },
        { label: 'SLA', value: 'Brak jasnego SLA incident notification i uptime', flag: 'risk' },
        { label: 'Access list', value: '3 konta vendor + shared „support”; brak review', flag: 'risk' },
        { label: 'Subprocessors / data location', value: 'Nieudokumentowane', flag: 'risk' },
        { label: 'Exit / right to audit', value: 'Brak w umowie', flag: 'risk' },
      ],
    },
    questions: [
      {
        id: 'q-risks', type: 'multi', points: 5,
        prompt: 'Ryzyka third party (ściąga):',
        options: [
          'Dostęp vendora do danych/systemów',
          'Słaby security posture / brak dowodu kontroli (SOC2/ISO)',
          'Subprocessors i lokalizacja danych nieznane',
          'Brak incident notification / SLA',
          'Shared support account + brak access review',
          'Brak exit plan / right to audit',
          'Zbyt ładne logo vendora',
        ],
        correct: [0, 1, 2, 3, 4, 5],
        explain: 'Detail Third Party ze ściągi. Logo nie jest ryzykiem.',
      },
      {
        id: 'q-evidence', type: 'multi', points: 4,
        prompt: 'Evidence checklist vendor:',
        options: [
          'Umowa',
          'DPA',
          'SOC2 / ISO',
          'Vendor risk assessment',
          'SLA report',
          'Access list',
          'Exit plan / right to audit',
          'Sam pitch deck sprzedażowy',
        ],
        correct: [0, 1, 2, 3, 4, 5, 6],
        explain: 'Evidence Vendor ze ściągi. Pitch ≠ dowód kontroli.',
      },
      {
        id: 'q-severity', type: 'single', points: 3,
        prompt: 'Brak DPA przy danych klientów banku przed go-live — severity?',
        options: [
          'Low — DPA można dograć po starcie',
          'High — RODO/compliance + third-party risk; nie startuj bez DPA i due diligence',
          'Brak tematu audytu IT',
          'Medium tylko gdy brak MFA w banku',
        ],
        correct: 1,
        explain: 'RODO + NIS2 supply chain / vendor; banking answers łączą dane klientów z compliance.',
      },
      {
        id: 'q-recs', type: 'multi', points: 4,
        prompt: 'Rekomendacje przed go-live:',
        options: [
          'Podpisać DPA przed przetwarzaniem danych',
          'Wymagać SOC2 Type II / ISO lub równoważnej oceny + vendor risk assessment',
          'SLA: incident notification, uptime; right to audit; exit plan',
          'Imienne konta vendora, least privilege, access review; zakaz shared support',
          'Udokumentować subprocessors i data location',
          'Wdrożyć bez umowy — „zaufanie biznesowe”',
        ],
        correct: [0, 1, 2, 3, 4],
        explain: 'Kontrole TPRM ze ściągi. Start bez umowy/DPA = unikaj.',
      },
    ],
    modelAnalysis: `Third party (ściąga): dostęp do danych/systemów, SLA, posture, subcontractors, data location, incident notification. Evidence: umowa, DPA, SOC2/ISO, vendor risk assessment, SLA, access list, exit, right to audit.

Tu: brak DPA, brak realnego assurance, brak SLA/notyfikacji, shared access, nieznane subprocessors/location, brak exit/audit clause = high przed go-live z danymi klientów.

Rec: DPA + assurance + SLA + named access/review + dokumentacja łańcucha + exit/right to audit przed produkcją.`,
  }),

  C({
    id: 'case-incident-bank',
    topicKey: 'controls',
    title: 'Bank — Incident Management / RCA',
    difficulty: 'junior',
    minutes: 11,
    scenario: {
      context: `Bank: incydent — niedostępność kanału płatności mobilnych ~3h. Audyt procesu Incident Management.`,
      facts: [
        { label: 'Procedura IR', value: 'Dokument istnieje, ostatni update 2 lata temu', flag: 'risk' },
        { label: 'Klasyfikacja', value: 'Traktowane jako „usterka IT”; brak formalnego P1 mimo wpływu na klientów', flag: 'risk' },
        { label: 'Eskalacja / SLA', value: 'Pierwszy ticket po 90 min; brak jasnego SLA reakcji', flag: 'risk' },
        { label: 'Rejestr', value: 'Jest ticket, ale bez timeline zdarzeń', flag: 'risk' },
        { label: 'RCA', value: 'Brak root cause analysis — „naprawiliśmy restartem”', flag: 'risk' },
        { label: 'Lessons learned', value: 'Brak; te same alerty ignorowane tydzień wcześniej', flag: 'risk' },
      ],
    },
    questions: [
      {
        id: 'q-check', type: 'multi', points: 5,
        prompt: 'Co sprawdzasz w Incident Management (ściąga)?',
        options: [
          'Czy jest procedura',
          'Klasyfikacja incydentów',
          'Kto eskaluje i SLA reakcji',
          'Ticket / incident register',
          'Root cause analysis',
          'Lessons learned',
          'Tylko kolor statusu w Jira',
        ],
        correct: [0, 1, 2, 3, 4, 5],
        explain: 'Detail Incident ze ściągi — pełny cykl, nie sam ticket.',
      },
      {
        id: 'q-risks', type: 'multi', points: 4,
        prompt: 'Ryzyka z tego scenariusza:',
        options: [
          'Opóźniona reakcja = większy impact',
          'Brak forensic / timeline evidence',
          'Brak kontroli nad incydentem (zła klasyfikacja)',
          'Powtarzalność — brak lessons learned',
          'Brak RCA = ta sama przyczyna wróci',
        ],
        correct: [0, 1, 2, 3, 4],
        explain: 'Ściąga: opóźniona reakcja, brak forensic evidence, brak kontroli nad incydentem.',
      },
      {
        id: 'q-evidence', type: 'multi', points: 3,
        prompt: 'Evidence checklist Incident:',
        options: [
          'Ticket / rejestr',
          'RCA',
          'Lessons learned',
          'Sam ustny „już działa”',
        ],
        correct: [0, 1, 2],
        explain: 'Evidence: ticket, RCA, lessons learned.',
      },
      {
        id: 'q-severity', type: 'single', points: 2,
        prompt: '3h downtime płatności + brak RCA/lessons — severity?',
        options: [
          'Low',
          'High — wpływ na klientów/transakcje + słaba gotowość IR',
          'Brak findingu — restart wystarczył',
          'Medium tylko gdy brak MFA',
        ],
        correct: 1,
        explain: 'Banking: płatności + opóźniona reakcja / brak RCA = istotny impact.',
      },
      {
        id: 'q-recs', type: 'multi', points: 4,
        prompt: 'Rekomendacje:',
        options: [
          'Zaktualizować procedurę IR + klasyfikację (P1 przy kanale płatności)',
          'SLA reakcji/eskalacji z mierzalnym timeline w tickecie',
          'Obowiązkowe RCA dla P1/P2',
          'Lessons learned + follow-up na alerty wcześniej ignorowane',
          'Zakazać restartów serwerów na zawsze',
        ],
        correct: [0, 1, 2, 3],
        explain: 'Proces IR ze ściągi. Restart może być akcją doraźną — ale bez RCA to nie zamknięcie.',
      },
    ],
    modelAnalysis: `Incident (ściąga): procedura, klasyfikacja, kto eskaluje, SLA, ticket/register, RCA, lessons learned. Ryzyko opóźnionej reakcji = większy impact, brak forensic, brak kontroli.

Tu: stara procedura, zła klasyfikacja, wolny ticket, brak timeline/RCA/lessons, ignorowane alerty = high przy płatnościach.

Evidence: ticket, RCA, lessons learned. Rec: IR update, SLA+timeline, RCA obowiązkowe, lessons + alert hygiene.`,
  }),
];

export const CASE_MAP = Object.fromEntries(CASE_STUDIES.map((c) => [c.id, c]));

export function caseById(id) {
  return CASE_MAP[id] || null;
}
