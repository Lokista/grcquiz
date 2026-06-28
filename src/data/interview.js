import { I } from './shape.js';

// Pytania rekrutacyjne (symulacja rozmowy z Lead Auditorem / Managerem).
// Tryb gry: użytkownik wybiera karty (klik / przeciągnij) — buildAnswerOptions + evaluateSelection.
// Aby dodać pytanie: dopisz I({...}) z keyPoints.

export const INTERVIEW_QUESTIONS = [
  I({
    id: 'iv-about-you',
    topicKey: 'basics',
    difficulty: 'soft',
    question: 'Opowiedz o sobie i dlaczego przechodzisz z developmentu do IT Audytu.',
    keyPoints: [
      { label: 'Zwięzłe podsumowanie doświadczenia', keywords: ['lata doswiadczenia', 'backend', 'frontend', 'developer', 'inzynier', 'projekt'] },
      { label: 'Co przenosi z dev (wartość dla audytu)', keywords: ['rozumiem systemy', 'znam kod', 'rozumiem kontrole techniczne', 'automatyzacj', 'analiza danych', 'sql', 'log'] },
      { label: 'Motywacja do audytu (rzeczowa)', keywords: ['obiektywnosc', 'dowod', 'proces', 'zarzadzanie ryzykiem', 'zgodnosc', 'wartosc biznesowa', 'chce rozwinac', 'szeroki perspektyw'] },
      { label: 'Zbieżność skills dev ↔ audyt', keywords: ['analityczne myslenie', 'dokladnosc', 'czytanie dokumentacji', 'rozumienie infrastruktury', 'uwaga do detali'] },
    ],
    idealAnswer: `Mam X lat w developmentie — budowałem systemy backend i znałem infrastrukturę, więc rozumiem, jak działają kontrole techniczne od środka. Przechodzę do audytu, bo chcę pracować bliżej zarządzania ryzykiem i zgodności, gdzie mój analityczny mindset i znajomość systemów dają wartość: potrafię ocenić, czy kontrola faktycznie działa, nie tylko czy istnieje na papierze. Audyt daje mi szerszy pogląd na organizację i procesy niż praca nad jednym produktem.`,
    whyGood: 'Pokazuje konkretne doświadczenie, wyjaśnia motywację rzeczowo (nie "bo płacą lepiej"), i argumentuje, co umiejętności dev dają audytowi — to argument "wartości dodanej", którego rekruterzy szukają.',
    commonMistakes: [
      'Historia życia od podstawówki — rekruter chce 30–60 sekund zwięzłości.',
      'Motywacja "bo IT audit jest spokojniejsze/lepiej płatny" — nie rzeczowa.',
      'Brak powiązania skills dev z wartością dla audytu.',
    ],
    followUp: 'A jak poradzisz sobie, że nie będziesz już pisał kodu na co dzień?',
  }),

  I({
    id: 'iv-what-is-risk',
    topicKey: 'basics',
    difficulty: 'tech',
    question: 'Czym jest ryzyko?',
    keyPoints: [
      { label: 'Definicja z wpływem na cele', keywords: ['mozliwosc', 'szansa', 'niepewnosc', 'wplyw na cele', 'negatywny wplyw', 'cele biznesowe'] },
      { label: 'Prawdopodobieństwo × wpływ', keywords: ['prawdopodobienstwo', 'likeli', 'impact', 'wplyw', 'mnozenie', 'szansa razy wplyw', 'l x i', 'ocena'] },
      { label: 'Zagrożenie × podatność', keywords: ['zagrozen', 'threat', 'podatnosc', 'vulner', 'wykorzysta', 'materializuj'] },
    ],
    idealAnswer: `Ryzyko to możliwość, że zagrożenie wykorzysta podatność i spowoduje negatywny wpływ na cele biznesowe. Najczęściej ocenia się je przez wpływ i prawdopodobieństwo.`,
    whyGood: 'Zwięzła, precyzyjna definicja łącząca threat/vulnerability z oceną L×I — pokazuje, że rozumiesz relację, nie tylko słownik.',
    commonMistakes: [
      '"Ryzyko to zagrożenie" — mylenie ryzyka z threat.',
      'Brak wymiaru wpływu na cele biznesowe.',
      'Brak prawdopodobieństwa.',
    ],
  }),

  I({
    id: 'iv-threat-vuln-risk',
    topicKey: 'basics',
    difficulty: 'tech',
    question: 'Czym różni się threat, vulnerability i risk?',
    keyPoints: [
      { label: 'Threat = zagrożenie, co może wyrządzić szkodę', keywords: ['zagrozen', 'threat', 'wyrzadzic szkode', 'atakujac', 'malwar', 'ransomwar', 'pozoln', 'dzialani', 'kto'] },
      { label: 'Vulnerability = słabość do wykorzystania', keywords: ['podatnosc', 'vulner', 'slabosc', 'wykorzystac', 'brak mfa', 'niezaratowany', 'dziura', 'brak łat'] },
      { label: 'Risk = możliwy skutek z L i I', keywords: ['risk', 'ryzyko', 'mozliwosc', 'materializacji', 'wplyw', 'prawdopodobienstwo', 'skutek', 'L i I', 'l x i'] },
      { label: 'Relacja między trzema (threat × vuln → risk)', keywords: ['wykorzysta podatnosc', 'relacja', 'zagrozen wykorzystuje podatnosc', 'wplywa na cele', 'funkcja'] },
    ],
    idealAnswer: `Threat (zagrożenie) to potencjalne działanie lub zdarzenie mogące wyrządzić szkodę — np. atakujący, ransomware. Vulnerability (podatność) to słabość, którą zagrożenie może wykorzystać — np. brak MFA, niezałatany system. Risk to możliwość, że zagrożenie wykorzysta podatność i wpłynie negatywnie na cele; oceniam je przez prawdopodobieństwo i wpływ. Kontrole redukują podatności i wpływ, więc obniżają ryzyko.`,
    whyGood: 'Jasno rozdziela trzy pojęcia i pokazuje relację (threat × vulnerability → risk), z konkretnymi przykładami — to kluczowe rozróżnienie, na którym rekruterzy sprawdzają podstawy.',
    commonMistakes: [
      'Mieszanie threat i risk ("ryzyko to hacker").',
      'Brak relacji między pojęciami.',
      'Brak przykładów — same definicje bez ożycia.',
    ],
    followUp: 'Podaj przykład: ten sam system, ale wymień threat, vulnerability i resulting risk.',
  }),

  I({
    id: 'iv-ad-threats-controls',
    topicKey: 'identity',
    difficulty: 'tech',
    question: 'Podaj zagrożenia, podatności i kontrole dla Active Directory.',
    keyPoints: [
      { label: 'Zagrożenia AD', keywords: ['przejecie konta', 'przywilejow', 'kerberoast', 'pass-the-hash', 'dcsync', 'lateral movement', 'ransomwar', 'eskalacja', 'gold ticket'] },
      { label: 'Podatności AD', keywords: ['za duzo domain admin', 'konta serwisow stare hasla', 'brak laps', 'krbtgt', 'zaufania domen', 'stale konto', 'gruppeny'] },
      { label: 'Kontrole preventive', keywords: ['laps', 'tier model', 'mfa', 'pam', 'least privilege', 'gmsa', 'osobne konto admin', 'segmentacja'] },
      { label: 'Kontrole detective/monitoring', keywords: ['logi', 'siem', 'monitorowanie domain admin', 'alerty', 'audit policy', 'korelacja', 'krbtgt reset'] },
      { label: 'Zarządzanie uprzywilejowanymi', keywords: ['przeglad domain admin', 'pam', 'just-in-time', 'rotacja hasel serwisowych'] },
    ],
    idealAnswer: `Zagrożenia: przejęcie konta uprzywilejowanego, Kerberoasting, Pass-the-Hash, DCSync, lateral movement, eskalacja do Domain Admin, ransomware. Podatności: za dużo kont w Domain Admins, konta serwisowe ze starymi hasłami i bez gMSA, brak LAPS (ten sam lokalny admin), słabe zaufania między domenami, konta wyłączone nieusunięte. Kontrole preventive: LAPS, tier model, MFA, PAM z JIT, osobne konta admin, least privilege, gMSA dla serwisów. Detective: logi + SIEM z alertami na akcje Domain Admin, audit policy, korelacja, reset krbtgt po incydencie. Plus cykliczny przegląd członków grup uprzywilejowanych.`,
    whyGood: 'Wymienia konkretnie ataki (Kerberoasting, PtH) — pokazuje wiedzę techniczną, nie tylko ogólniki. Łączy preventive + detective + governance (przeglądy).',
    commonMistakes: [
      'Samo "założymy MFA" bez ataków AD (Kerberoasting, PtH).',
      'Pomijanie LAPS i kont serwisowych.',
      'Brak detekcji — same preventive.',
    ],
    followUp: 'Jak sprawdzisz, ile kont naprawdę potrzebuje Domain Admin?',
  }),

  I({
    id: 'iv-least-privilege',
    topicKey: 'controls',
    difficulty: 'tech',
    question: 'Czym jest Least Privilege?',
    keyPoints: [
      { label: 'Minimalne uprawnienia do zadań', keywords: ['minimaln', 'uprawnien', 'potrzebnych do zadan', 'tylko co potrzeba', 'need-to-know'] },
      { label: 'Tylko na czas trwania (JIT)', keywords: ['czas', 'just-in-time', 'jit', 'tymczasowo', 'najmniej na najkrotszy', 'okres'] },
      { label: 'Kontrole realizujące (RBAC/PAM/access review)', keywords: ['rbac', 'pam', 'access review', 'przeglad', 'jit', 'role'] },
      { label: 'Ograniczenie powierzchni ataku/skutku', keywords: ['powierzchnia ataku', 'skutki', 'ogranicza', 'zmniejsza wplyw', 'zminimizowac'] },
    ],
    idealAnswer: `Least Privilege to zasada nadawania minimalnych uprawnień potrzebnych do wykonywania zadań — i tylko na czas ich trwania. Powiązana z need-to-know. Realizuję ją przez RBAC, cykliczny access review usuwający nadmiar, oraz PAM z just-in-time access dla uprawnień uprzywilejowanych. Ogranicza powierzchnię ataku i skutki ewentualnego przejęcia konta.`,
    whyGood: 'Definicja + "czasowo" (często pomijane) + konkretne kontrole (RBAC, access review, PAM/JIT) + uzasadnienie (powierzchnia ataku). Pełna odpowiedź.',
    commonMistakes: [
      'Brak wymiaru "czasowo" (uprawnienia na stałe zamiast JIT).',
      'Brak kontrole realizujących — sama definicja.',
      'Pomijanie access review.',
    ],
  }),

  I({
    id: 'iv-offboarding',
    topicKey: 'controls',
    difficulty: 'tech',
    question: 'Jak wygląda proces odebrania dostępów po odejściu pracownika?',
    keyPoints: [
      { label: 'Trigger z HR (źródło prawdy)', keywords: ['hr', 'ticket', 'trigger', 'zrodlo prawdy', 'data odejscia', 'workflow'] },
      { label: 'SLA czasowy (np. 24h)', keywords: ['sla', '24h', '24 godzin', 'czas', 'termin', 'natychmiast'] },
      { label: 'Wszystkie systemy (AD + aplikacje + SaaS + konta serwisowe)', keywords: ['ad', 'aplikacj', 'saas', 'serwisow', 'wszystkich systemach', 'erp', 'vpn', 'email'] },
      { label: 'Konta współdzielone i PAM', keywords: ['wspoldzielone', 'pam', 'rotacja hasla', 'usun z grup', 'session'] },
      { label: 'Weryfikacja po fakcie + dowód', keywords: ['weryfikacja', 'dowod', 'raport', 'audit trail', 'przeglad', 'potwierdzenie'] },
    ],
    idealAnswer: `Proces offboardingu zaczyna się od triggera z HR (źródło prawdy o zatrudnieniu) — ticket uruchamia odebranie w SLA, np. 24h. Odbieram dostęp we wszystkich systemach: AD (grupy, konta), aplikacje, SaaS, VPN, e-mail, konta serwisowe i współdzielone (rotacja hasła w PAM). Weryfikuję po fakcie raportem, że nic nie zostało, i zostawiam audit trail. W audycie próbuję próbkę offboardingów i sprawdzam czas między datą odejścia a revokiem w każdym systemie.`,
    whyGood: 'Pokazuje pełen zakres (nie tylko AD), SLA, źródło prawdy (HR), weryfikację z dowodem i jak audytor by to testował — to odróżnia kandydata "wymieniania" od "myślącego jak audytor".',
    commonMistakes: [
      'Odbieranie tylko w AD, pomijanie SaaS/aplikacji.',
      'Brak SLA — "kiedy IT znajdzie czas".',
      'Brak weryfikacji i dowodu (audit trail).',
      'Pomijanie kont współdzielonych (rotacja hasła).',
    ],
    followUp: 'A jeśli pracownik odszedł 3 dni temu, a konto SaaS nadal działa — jakie ustalenie?',
  }),

  I({
    id: 'iv-itgc-vs-itac',
    topicKey: 'controls',
    difficulty: 'tech',
    question: 'Czym różni się ITGC od ITAC?',
    keyPoints: [
      { label: 'ITGC = ogólne środowisko IT', keywords: ['itgc', 'general', 'ogoln', 'srodowisko it', 'wiele systemow', 'fundament'] },
      { label: 'Przykłady ITGC', keywords: ['access', 'change', 'backup', 'incident', 'patch', 'monitoring', 'zarzadzanie dostepem', 'zarzadzanie zmiana'] },
      { label: 'ITAC = wewnątrz konkretnej aplikacji', keywords: ['itac', 'application', 'wewnatrz aplikacji', 'konkretna aplikacj', 'wbudow'] },
      { label: 'Przykłady ITAC', keywords: ['walidacj', 'obowiazkow', 'workflow akceptacj', 'automatyczne wyliczen', 'rol', 'input', 'mandatory field'] },
      { label: 'Relacja: ITAC opiera się na ITGC', keywords: ['opiera', 'zalezy', 'bez itgc', 'fundament', 'zaufanie', 'bez itgc nie ufac itac'] },
    ],
    idealAnswer: `ITGC, czyli IT General Controls, to ogólne kontrole środowiska IT, takie jak zarządzanie dostępami, zarządzanie zmianą, backup, incident management, patch management oraz monitoring. ITAC, czyli IT Application Controls, to kontrole działające wewnątrz konkretnej aplikacji, np. walidacja danych wejściowych, pola obowiązkowe, workflow akceptacji, automatyczne wyliczenia i ograniczenia ról. ITAC opiera się na ITGC — bez skutecznego Change Management i Access Management nie można ufać kontrolom w aplikacji.`,
    whyGood: 'Jasno rozdziela "ogólne środowisko" vs "wewnątrz aplikacji", daje przykłady obu i pokazuje relację (ITAC wymaga ITGC) — to trzeci element, którego wielu kandydatów nie wspomina.',
    commonMistakes: [
      'Wymienianie przykładów bez rozróżnienia.',
      'Brak relacji (ITAC polega na ITGC).',
      'Mieszanie — np. nazywanie walidacji formularza ITGC.',
    ],
    followUp: 'Jak byś testował, czy ITAC w ERP są skuteczne, mając ITGC na uwadze?',
  }),

  I({
    id: 'iv-change-management',
    topicKey: 'controls',
    difficulty: 'tech',
    question: 'Jak wygląda poprawny Change Management?',
    keyPoints: [
      { label: 'Ticket + opis zmiany', keywords: ['ticket', 'cr', 'opis zmiany', 'change request'] },
      { label: 'Ocena ryzyka + approval (CAB)', keywords: ['ocena ryzyka', 'approval', 'akceptacj', 'cab', 'change advisory board', 'zatwierdz'] },
      { label: 'Development + testy + code review', keywords: ['development', 'test', 'code review', 'qa', 'srodowisko testow'] },
      { label: 'Plan rollbacku', keywords: ['rollback', 'plan cofniecia', 'wycofan'] },
      { label: 'Wdrożenie w oknie + dokumentacja', keywords: ['wdrozen', 'okno serwisow', 'dokumentacj', 'komunikacj'] },
      { label: 'SoD (nie ten sam develop i approve)', keywords: ['sod', 'segregacj', 'inna osoba', 'nie ten sam', 'rozdzial'] },
    ],
    idealAnswer: `Poprawny proces zmiany powinien obejmować ticket, opis zmiany, ocenę ryzyka, approval, development, testy, code review, wdrożenie, dokumentację i plan rollbacku. Każda zmiana przechodzi przez CAB/approval, w oknie serwisowym, z osobą zatwierdzającą inną niż wdrażająca (SoD). Emergency change też wymaga retroaktywnego CR i przeglądu.`,
    whyGood: 'Wymienia pełen flow w kolejności, dodaje SoD i okno serwisowe, oraz wspomina emergency — pokazuje, że znasz realia, nie tylko schemat z podręcznika.',
    commonMistakes: [
      'Brak planu rollbacku.',
      'Brak SoD — ten sam develop i approve.',
      'Pomijanie emergency changes (retro CR).',
      'Brak okna serwisowego.',
    ],
    followUp: 'A jak oceniasz emergency change włączone w piątek wieczorem?',
  }),

  I({
    id: 'iv-sod',
    topicKey: 'controls',
    difficulty: 'tech',
    question: 'Czym jest SoD (Segregation of Duties)?',
    keyPoints: [
      { label: 'Rozdzielenie obowiązków w krytycznym procesie', keywords: ['rozdzielen', 'obowiazkow', 'krytyczn proces', 'jedna osoba nie kontroluje'] },
      { label: 'Cel: błędy, nadużycia, nieautoryzowane', keywords: ['bled', 'naduzyc', 'nieautoryzowan', 'fraud', 'zmniejsza ryzyko'] },
      { label: 'Przykłady IT/finanse', keywords: ['developer', 'wdrazajacy', 'rozny', 'dostawca', 'platnosc', 'ksiegowanie', 'akceptujacy'] },
      { label: 'Wykrywanie konfliktów / wyjątki', keywords: ['konflikt', 'wykryw', 'narzedzi', 'wyjatki', 'akceptacj', 'przeglad'] },
    ],
    idealAnswer: `Segregation of Duties oznacza rozdzielenie obowiązków, tak aby jedna osoba nie kontrolowała całego krytycznego procesu. Zmniejsza to ryzyko błędów, nadużyć i nieautoryzowanych działań. W IT: developer ≠ wdrażający na produkcję ≠ audytujący. W finansach: tworzenie dostawcy ≠ akceptacja płatności ≠ księgowanie. Konflikty SoD wykrywam narzędziowo, a wyjątki wymagają formalnej akceptacji i przeglądu.`,
    whyGood: 'Definicja + cel (trzy ryzyka) + przykłady z IT i finansów + mechanizm wykrywania konfliktów. Kompletna odpowiedź.',
    commonMistakes: [
      'SoD tylko w finansach, pomijanie IT.',
      'Brak przykładów.',
      'Brak mechanizmu wyjątków.',
    ],
    followUp: 'Jak wykryjesz konflikt SoD w systemie z 10k uprawnień?',
  }),

  I({
    id: 'iv-shared-admin',
    topicKey: 'identity',
    difficulty: 'tech',
    question: 'Co jest problemem przy współdzielonym koncie administratora?',
    keyPoints: [
      { label: 'Brak rozliczalności (accountability)', keywords: ['rozliczalnosc', 'accountability', 'nie wiadomo kto', 'kto wykon', 'kto zmien'] },
      { label: 'Niemożliwa identyfikacja w logach', keywords: ['log', 'identyfikacj', 'nie da sie ustalic', 'jeden konto wielu osob'] },
      { label: 'Rekomendacje: konta imienne + MFA + PAM + monitoring', keywords: ['imienne', 'osobne konto', 'mfa', 'pam', 'monitoring', 'sesj', 'just-in-time'] },
      { label: 'Ryzyko przy odejściu/nieautoryzowanym działaniu', keywords: ['odejsc', 'rotacja hasla', 'nieautoryzowan', 'naduzyc', 'kradziez'] },
    ],
    idealAnswer: `Problemem jest brak rozliczalności. Jeśli kilka osób używa jednego konta administratora, nie da się jednoznacznie ustalić, kto wykonał daną zmianę. Rekomendacją są osobne konta imienne, MFA, monitoring działań i PAM z nagrywaniem sesji i just-in-time access. Przy odejściu admina rotujemy hasło — przy koncie współdzielonym to niemożliwe bez zablokowania wszystkich.`,
    whyGood: 'Nazywa problem (rozliczalność), tłumaczy konsekwencję (logi bez właściciela), daje konkretne rekomendacje (konta imienne, MFA, PAM, monitoring) i pokazuje dodatkowe ryzyko (rotacja przy odejściu).',
    commonMistakes: [
      'Samo "niebezpieczne" bez rozliczalności.',
      'Brak rekomendacji.',
      'Pomijanie rotacji hasła przy odejściu.',
    ],
    followUp: 'Co jeśli system legacy nie obsługuje osobnych kont admin?',
  }),

  I({
    id: 'iv-risk-assessment-process',
    topicKey: 'basics',
    difficulty: 'mixed',
    question: 'Jak wygląda proces risk assessment?',
    keyPoints: [
      { label: 'Identyfikacja aktywów i ich klasyfikacja', keywords: ['aktyw', 'identyfikacj', 'klasyfikacj', 'co chronimy', 'wlasiciel'] },
      { label: 'Identyfikacja zagrożeń i podatności', keywords: ['zagrozen', 'podatnosc', 'threat', 'vulner', 'scenariusz'] },
      { label: 'Ocena L i I (inherent)', keywords: ['prawdopodobienstwo', 'wplyw', 'inherent', 'l x i', 'matryca', 'score'] },
      { label: 'Kontrole i ryzyko residualne', keywords: ['kontrol', 'residual', 'rezydualn', 'po kontrolach', 'treatment'] },
      { label: 'Treatment + porównanie z apetytem + owner', keywords: ['treatment', 'mitigat', 'transfer', 'avoid', 'accept', 'apetyt', 'owner', 'wlasiciel ryzyka'] },
      { label: 'Monitorowanie i reasesment (cykl)', keywords: ['monitorowan', 'reasesm', 'cykl', 'przeglad', 'pdca'] },
    ],
    idealAnswer: `Risk assessment: 1) identyfikuję i klasyfikuję aktywa (co chronimy, właściciel, klasyfikacja); 2) identyfikuję zagrożenia i podatności (scenariusze); 3) oceniam inherent risk = prawdopodobieństwo × wpływ w matrycy; 4) mapuję kontrole i liczę ryzyko residualne; 5) wybieram treatment (mitigate/transfer/avoid/accept) i porównuję residualne z apetytem, z właścicielem ryzyka; 6) monitoruję i reasessuję cyklicznie (PDCA) oraz po incydentach.`,
    whyGood: 'Uporządkowany proces krok po kroku, z inherent vs residual, treatment i apetytem, oraz cyklem reasesmentu — to pełny proces, nie tylko "liczymy L×I".',
    commonMistakes: [
      'Brak identyfikacji aktywów jako startu.',
      'Mieszanie inherent i residual.',
      'Brak treatment i porównania z apetytem.',
      'Jednorazowy — brak cyklu reasesmentu.',
    ],
    followUp: 'Kto powinien być właścicielem ryzyka — IT czy biznes?',
  }),

  I({
    id: 'iv-frameworks',
    topicKey: 'frameworks',
    difficulty: 'tech',
    question: 'Jakie frameworki znasz i czym się różnią?',
    keyPoints: [
      { label: 'ISO 27001 (ISMS, certyfikowalny) + 27002 (praktyki)', keywords: ['iso 27001', 'isms', 'certyfikowaln', 'wymagania', '27002', 'praktyki', 'annex a'] },
      { label: 'NIST CSF (funkcje Govern/ID/Protect/Detect/Respond/Recover)', keywords: ['nist csf', 'govern', 'identify', 'protect', 'detect', 'respond', 'recover', 'dojrzalosc'] },
      { label: 'COBIT (governance IT)', keywords: ['cobit', 'governance', 'zarzadzan it', 'cele biznesow', 'dojrzalosc proces'] },
      { label: 'CIS Controls (praktyczna lista zabezpieczeń)', keywords: ['cis', 'controls', 'praktyczn', 'zabezpieczen', 'ig1', 'ig2'] },
      { label: 'SOC 2 / PCI DSS / RODO (kontekst)', keywords: ['soc 2', 'pci dss', 'rodo', 'gdpr', 'trust services', 'karty', 'dane osobow'] },
      { label: 'Różnica: wymagania vs praktyki vs governance vs regulacje', keywords: ['wymagania', 'praktyki', 'governance', 'regulacj', 'certyfikowaln', 'roznic'] },
    ],
    idealAnswer: `ISO 27001 określa wymagania dla systemu zarządzania bezpieczeństwem informacji. ISO 27002 pokazuje dobre praktyki wdrażania kontroli. NIST CSF pomaga zarządzać cyberbezpieczeństwem przez funkcje Govern, Identify, Protect, Detect, Respond i Recover. COBIT skupia się na governance i zarządzaniu IT. CIS Controls to praktyczna lista najważniejszych zabezpieczeń. SOC 2 ocenia kontrole usług chmurowych wg Trust Services Criteria. PCI DSS dotyczy danych kart płatniczych, a RODO — ochrony danych osobowych z karami do 4% obrotu.`,
    whyGood: 'Krótko charakteryzuje każdy i pokazuje różnicę (wymagania vs praktyki vs governance vs regulacje) — rekruter chce zobaczyć, że rozumiesz, kiedy użyć czego, nie tylko listę nazw.',
    commonMistakes: [
      'Sama lista nazw bez różnic.',
      'Mieszanie ISO 27001 (wymagania, certyfikowalny) z 27002 (praktyki).',
      'Brak regulacji (RODO/PCI).',
    ],
    followUp: 'Który framework wybrałbyś jako punkt startu dla firmy SaaS 50 osób i dlaczego?',
  }),

  I({
    id: 'iv-cia-triad',
    topicKey: 'basics',
    difficulty: 'tech',
    question: 'Czym jest CIA Triad?',
    keyPoints: [
      { label: 'Confidentiality', keywords: ['confidentiality', 'poufnosc', 'dostep uprawnion', 'szyfrowan', 'rbac', 'mfa'] },
      { label: 'Integrity', keywords: ['integrity', 'integralnosc', 'poprawnosc', 'niezmienion', 'sumy kontroln', 'workflow akceptacj', 'hash'] },
      { label: 'Availability', keywords: ['availability', 'dostepnosc', 'dziala gdy potrzebny', 'backup', 'dr', 'clustering', 'rto/rpo'] },
      { label: 'Mapowanie kontroli do celów', keywords: ['wspiera', 'mapowan', 'ktory cel', 'np. szyfrowan = confidentiality'] },
    ],
    idealAnswer: `CIA Triad to trzy fundamenty bezpieczeństwa informacji: Confidentiality (poufność — dostęp tylko uprawnionych, np. szyfrowanie, RBAC, MFA), Integrity (integralność — poprawność i brak nieautoryzowanych zmian, np. sumy kontrolne, workflow akceptacji, hashe) i Availability (dostępność — system działa, gdy potrzebny, np. backup, DR, clustering, RTO/RPO). Każdą kontrolę mapuję do celów, które wspiera — szyfrowanie to Confidentiality, backup to Availability, sumy kontrolne to Integrity.`,
    whyGood: 'Definiuje każdy cel z konkretnymi kontrolami i pokazuje mapowanie — to trzeci element, który pokazuje myślenie audytora, nie tylko słownik.',
    commonMistakes: [
      'Sama rozwinięcia skrótu bez przykładów.',
      'Brak mapowania kontroli do celów.',
      'Mieszanie — np. "backup = Integrity" (to głównie Availability).',
    ],
    followUp: 'Do którego z celów CIA należy test restore z backupu i dlaczego?',
  }),

  I({
    id: 'iv-hr-controls',
    topicKey: 'controls',
    difficulty: 'tech',
    question: 'Jakie kontrole sprawdziłbyś w systemie HR?',
    keyPoints: [
      { label: 'RBAC + least privilege (kto widzi/co edytuje)', keywords: ['rbac', 'rol', 'least privilege', 'kto widzi', 'edytuj', 'wynagrodzen', 'dane osobow', 'roznica miedzy widok a edycj'] },
      { label: 'SoD (tworzenie pracownika ≠ akceptacja płacy)', keywords: ['sod', 'tworzen', 'akceptacj', 'platnosc', 'wynagrodzen', 'rozdzial', 'inna osoba'] },
      { label: 'Audit trail / logi zmian poufnych', keywords: ['audit trail', 'log', 'zmian', 'wynagrodzen', 'historia', 'kto zmien', 'poufn'] },
      { label: 'Walidacja danych (PESEL, formaty, pola obowiązkowe)', keywords: ['walidacj', 'pesel', 'format', 'obowiazkow', 'input', 'mandatory'] },
      { label: 'Integracja z IAM/offboarding (joiner-mover-leaver)', keywords: ['iam', 'joiner', 'mover', 'leaver', 'offboard', 'integracj', 'zrodlo prawdy', 'trigger'] },
      { label: 'Privacy by Design (RODO, minimalizacja, retencja)', keywords: ['rodo', 'privacy', 'minimalizacj', 'retencj', 'pseudonimizacj', 'dpa'] },
    ],
    idealAnswer: `W systemie HR sprawdziłbym: RBAC i least privilege (rola HR Manager edytuje wynagrodzenia, zwykły HR widzi tylko dane podstawowe); SoD (tworzenie pracownika ≠ akceptacja zmiany wynagrodzenia); audit trail zmian poufnych (kto zmieniał wynagrodzenie i kiedy); walidację danych (PESEL, pola obowiązkowe); integrację z IAM dla joiner-mover-leaver (HR jako źródło prawdy uruchamia provisioning/offboarding); oraz Privacy by Design — minimalizacja, retencja i zgodność z RODO (DPIA przy monitoring/profilowanie).`,
    whyGood: 'Pokazuje myślenie audytora: łączy ITAC (RBAC, walidacja, SoD w aplikacji), ITGC (IAM, audit trail) i regulacje (RODO). To szeroka odpowiedź, nie tylko "sprawdzę dostęp".',
    commonMistakes: [
      'Samo "sprawdzę kto ma dostęp" — bez SoD, walidacji, RODO.',
      'Brak audit trail dla zmian poufnych.',
      'Pomijanie integracji HR → IAM (joiner-mover-leaver).',
    ],
    followUp: 'Jak sprawdzisz, że pracownik z innej roli nie edytuje wynagrodzeń?',
  }),

  I({
    id: 'iv-client-disagrees',
    topicKey: 'basics',
    difficulty: 'soft',
    question: 'Co zrobisz, gdy klient nie zgadza się z ustaleniem audytowym?',
    keyPoints: [
      { label: 'Wysłuchaj i zrozum stanowisko klienta', keywords: ['wysluch', 'rozumi', 'stanowisko', 'perspektyw', 'spotkan'] },
      { label: 'Odnies się do dowodu i kryterium', keywords: ['dowod', 'kryterium', 'fakt', 'probka', 'wzgledem czego', 'evidence'] },
      { label: 'Odróżnij kwestie techniczne od opinii biznesowej', keywords: ['fakt', 'opini', 'techniczn', 'biznesow', 'rozdzial'] },
      { label: 'Rozważ doprecyzowanie/uzupełnienie ustalenia', keywords: ['doprecyzow', 'uzupeln', 'uzupelnienie', 'kontekst', 'aktualizuj'] },
      { label: 'Eskalacja/management response w raporcie jeśli brak zgody', keywords: ['eskalacj', 'management respons', 'odpowiedz zarzadu', 'raport', 'warunki', 'rozbieznosc', 'protokol'] },
    ],
    idealAnswer: `Najpierw wysłucham klienta i rozumiem jego stanowisko — może zna kontekst, którego nie miałem. Odnoszę się do dowodu i kryterium: tłumaczę, względem czego ustalenie powstało i jaką próbkę/test zrobiłem. Rozdzielam fakty (dowody) od opinii. Jeśli klient ma rację faktyczną — doprecyzowuję lub aktualizuję ustalenie. Jeśli nie przekonuje mnie, zostawiam ustalenie, ale rejestruję management response klienta w raporcie z rozbieżnością i eskaluję do governance wg procedury. Nie usuwam ustaleń pod naciskiem.`,
    whyGood: 'Pokazuje profesjonalizm: empatia (wysłuchanie), oparcie na dowodzie, rozróżnienie faktu od opinii, elastyczność gdy klient ma rację, i stanowczość + management response gdy nie. To zachowanie, którego szukają w Big4.',
    commonMistakes: [
      'Upieranie się bez wysłuchania klienta.',
      'Usuwanie ustalenia pod naciskiem.',
      'Brak management response w raporcie przy rozbieżności.',
      'Brak eskalacji do governance.',
    ],
    followUp: 'A jeśli klient odmawia dostępu do dowodu, twierdząc "kontrola działa"?',
  }),

  I({
    id: 'iv-ai-in-audit',
    topicKey: 'ai',
    difficulty: 'mixed',
    question: 'Jak użyłbyś AI w audycie?',
    keyPoints: [
      { label: 'Analiza pełnej populacji / wykrywanie anomalii', keywords: ['populacj', 'anomali', 'duplikat', 'wzorce', 'pelny zbior', '100k', 'transakcj'] },
      { label: 'Streszczanie dokumentów i transkrypcji', keywords: ['streszcz', 'transkrypcj', 'dokument', 'wywiad', 'podsumowan'] },
      { label: 'Draft ustaleń / rekomendacji', keywords: ['draft', 'ustalen', 'rekomendacj', 'kryterium', 'wzor'] },
      { label: 'Human-in-the-loop (audytor weryfikuje)', keywords: ['human-in-the-loop', 'weryfikuj', 'audytor', 'nie zastepuj', 'sprawdz'] },
      { label: 'Ochrona poufnych danych klienta', keywords: ['poufn', 'dane klient', 'chron', 'nie wklejaj', 'publiczn llm', 'dlp'] },
      { label: 'Transparentność / dokumentacja metody', keywords: ['transparentn', 'dokumentacj', 'metod', 'wyjasnialn', 'hallucin'] },
    ],
    idealAnswer: `AI wspiera audytora, nie zastępuje. Użyłbym go do analizy pełnej populacji zamiast próbki (duplikaty płatności, anomalie, nietypowe logowania), wykrywania wzorców w logach i transakcjach, streszczania transkrypcji i dokumentów, oraz draftowania ustaleń i rekomendacji. Zasady: human-in-the-loop (audytor weryfikuje), poufne dane klienta chronione (nie trafiają do publicznych LLM), metody udokumentowane, a wyniki AI sprawdzam przed użyciem — AI nie ocenia solo i nie generuje ustaleń bez mojej weryfikacji.`,
    whyGood: 'Konkretne zastosowania + granice (human-in-the-loop, ochrona danych, transparentność). Pokazuje, że wiesz, gdzie AI pomaga i gdzie trzeba uważać — to dojrzałe podejście, którego szukają.',
    commonMistakes: [
      'AI ocenia solo bez weryfikacji.',
      'Wklejanie poufnych danych do publicznych LLM.',
      'Brak dokumentacji metod (halucynacje).',
      'Samo "użyłbym ChatGPT" bez konkretnych zastosowań.',
    ],
    followUp: 'Jak udokumentujesz, że AI pomogło w analizie, by wynik był weryfikowalny?',
  }),

  I({
    id: 'iv-backup-works',
    topicKey: 'controls',
    difficulty: 'tech',
    question: 'Jak sprawdziłbyś, czy backup naprawdę działa?',
    keyPoints: [
      { label: 'Logi sukcesu to za mało — test odtworzenia', keywords: ['logi sukcesu', 'test odtworzen', 'restore', 'nie wystarcz', 'kopia'] },
      { label: 'Kiedy ostatni test + wynik', keywords: ['kiedy ostatni', 'ostatni test', 'data', 'wynik', 'raport', '12 mies'] },
      { label: 'RTO i RPO spełnione', keywords: ['rto', 'rpo', 'spelnion', 'mierz', 'cel', 'czas odtworzen', 'utrata danych'] },
      { label: 'Backup offline/immutable (ransomware)', keywords: ['offline', 'immutable', 'ransomwar', 'air-gap', 'kopie offline'] },
      { label: 'Retencja + szyfrowanie + próba całości', keywords: ['retencj', 'szyfrowan', 'odtworzen calosc', 'probk', 'integrit'] },
    ],
    idealAnswer: `Same logi sukcesu backupu nie wystarczą. Audytor powinien sprawdzić, czy wykonywano test odtworzenia backupu, kiedy był wykonany, jaki był wynik oraz czy spełniono RTO i RPO. Pytam też o kopię offline/immutable (ochrona przed ransomware, które szyfruje też backup online), retencję i szyfrowanie backupu. Brak testu restore = kontrola backupu istnieje, ale operating effectiveness niepotwierdzona.`,
    whyGood: 'Zaczyna od "logi to za mało" (kluczowy punkt), wymienia RTO/RPO, kopię offline/immutable i retencję — to kompletny test backupu, nie tylko "czy backup się robi".',
    commonMistakes: [
      'Traktowanie logów sukcesu jako dowodu.',
      'Brak pytania o RTO/RPO.',
      'Pomijanie kopii offline/immutable (ransomware).',
      'Niepytanie o test całości, tylko części.',
    ],
    followUp: 'A jeśli backup jest online w tej samej infrastrukturze co produkcja — jakie ryzyko?',
  }),
];

export const INTERVIEW_MAP = Object.fromEntries(INTERVIEW_QUESTIONS.map((q) => [q.id, q]));

export function interviewById(id) {
  return INTERVIEW_MAP[id] || null;
}

// Normalizacja tekstu: lowercase + usuń polskie diakrytyki (do keyword matching).
export function normalizeText(s) {
  if (!s) return '';
  return String(s)
    .toLowerCase()
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e').replace(/ł/g, 'l')
    .replace(/ń/g, 'n').replace(/ó/g, 'o').replace(/ś/g, 's').replace(/ż/g, 'z')
    .replace(/ź/g, 'z')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// --- Tryb gry: klik / przeciągnij karty (bez wpisywania) ---

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffleDeterministic(items, seed) {
  const arr = [...items];
  let s = hashStr(String(seed));
  for (let i = arr.length - 1; i > 0; i -= 1) {
    s = (s * 1103515245 + 12345) >>> 0;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const GENERIC_DISTRACTORS = [
  'Wystarczy zapytać klienta, czy kontrola działa — bez dowodu.',
  'Audytor sam naprawia ustalenia przed raportem, żeby klient był zadowolony.',
  'Ryzyko to to samo co zagrożenie — nie trzeba rozdzielać pojęć.',
  'Logi sukcesu backupu w pełni potwierdzają skuteczność kontroli.',
  'Współdzielone konto admin jest OK, jeśli hasło jest silne.',
  'Change Management to tylko ticket — approval i testy są opcjonalne.',
  'ITGC i ITAC to synonimy — dotyczą tego samego poziomu kontroli.',
  'SoD dotyczy wyłącznie finansów, nie systemów IT.',
  'Offboarding w AD wystarczy — SaaS i aplikacje mogą poczekać.',
  'Residual risk liczy się przed wdrożeniem kontroli.',
];

/** Karty odpowiedzi: poprawne (keyPoints) + dystraktory. Deterministyczna kolejność per pytanie. */
export function buildAnswerOptions(question, allQuestions = INTERVIEW_QUESTIONS) {
  const correct = question.keyPoints.map((p, i) => ({
    id: `${question.id}-c-${i}`,
    label: p.label,
    correct: true,
    kpIndex: i,
  }));

  const seen = new Set(correct.map((c) => normalizeText(c.label)));
  const distractors = [];

  for (let i = 0; i < question.commonMistakes.length; i += 1) {
    const label = question.commonMistakes[i].length > 90
      ? `${question.commonMistakes[i].slice(0, 87)}…`
      : question.commonMistakes[i];
    const norm = normalizeText(label);
    if (seen.has(norm)) continue;
    seen.add(norm);
    distractors.push({ id: `${question.id}-m-${i}`, label, correct: false });
  }

  for (const oq of allQuestions) {
    if (oq.id === question.id) continue;
    for (let i = 0; i < oq.keyPoints.length; i += 1) {
      const label = oq.keyPoints[i].label;
      const norm = normalizeText(label);
      if (seen.has(norm)) continue;
      seen.add(norm);
      distractors.push({ id: `d-${oq.id}-${i}`, label, correct: false });
    }
  }

  for (let i = 0; i < GENERIC_DISTRACTORS.length; i += 1) {
    const label = GENERIC_DISTRACTORS[i];
    const norm = normalizeText(label);
    if (seen.has(norm)) continue;
    seen.add(norm);
    distractors.push({ id: `g-${i}`, label, correct: false });
  }

  const targetTotal = Math.min(10, Math.max(6, correct.length + 3));
  const need = Math.max(2, targetTotal - correct.length);
  const picked = shuffleDeterministic(distractors, question.id).slice(0, need);
  return shuffleDeterministic([...correct, ...picked], `${question.id}-opts`);
}

/** Ocena kart — tylko informacyjnie; wynik zawsze pełny (bez kar). */
export function evaluateSelection(question, selectedIds) {
  const selected = new Set(selectedIds);
  const results = question.keyPoints.map((p, i) => {
    const id = `${question.id}-c-${i}`;
    return { label: p.label, hit: selected.has(id) };
  });
  const total = results.length;
  return { results, covered: total, total, scorePct: 100 };
}

/** @deprecated — zachowane dla kompatybilności; gra używa evaluateSelection */
export function evaluateAnswer(question, userAnswer) {
  const norm = normalizeText(userAnswer);
  const results = question.keyPoints.map((p) => {
    const hit = p.keywords.some((kw) => {
      const nkw = normalizeText(kw);
      if (!nkw) return false;
      if (norm.includes(nkw)) return true;
      const words = nkw.split(' ');
      if (words.length === 1 && nkw.length >= 5) {
        const stem = nkw.slice(0, Math.min(6, nkw.length - 1));
        if (norm.includes(stem)) return true;
      }
      return false;
    });
    return { label: p.label, hit };
  });
  const covered = results.filter((r) => r.hit).length;
  const total = results.length;
  const scorePct = total > 0 ? Math.round((covered / total) * 100) : 0;
  return { results, covered, total, scorePct };
}
