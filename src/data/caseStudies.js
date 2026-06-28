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
];

export const CASE_MAP = Object.fromEntries(CASE_STUDIES.map((c) => [c.id, c]));

export function caseById(id) {
  return CASE_MAP[id] || null;
}
