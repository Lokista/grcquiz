import { L } from '../shape.js';

// Kontrole IT: ITGC, ITAC i procesy.
export const CONTROLS_LESSONS = [
  L({
    id: 'itgc',
    topicKey: 'controls',
    title: 'ITGC (IT General Controls)',
    minutes: 7,
    definition: `ITGC, czyli IT General Controls, to ogólne kontrole środowiska IT, takie jak zarządzanie dostępami, zarządzanie zmianą, backup, incident management, patch management oraz monitoring. Są "ogólne", bo wspierają wiele systemów i procesów jednocześnie — w odróżnieniu od ITAC, które są wbudowane w konkretną aplikację.`,
    example: `W audycie finansowym sprawdzamy ITGC, by zaufać danym z systemów: czy dostęp do ERP był nadawany z approval (Access Mgmt), czy zmiany w ERP miały ticket i testy (Change Mgmt), czy backup ERP był testowany pod kątem restore. Bez ITGC nie ma zaufania do ITAC i do danych finansowych.`,
    interviewAnswer: `ITGC, czyli IT General Controls, to ogólne kontrole środowiska IT, takie jak zarządzanie dostępami, zarządzanie zmianą, backup, incident management, patch management oraz monitoring. Wspierają wiele systemów naraz i dają fundament zaufania do danych — bez ITGC nie można ufać ITAC ani raportom finansowym.`,
    commonMistakes: [
      'Myślenie, że ITGC to tylko "dostępy" — to pełny zestaw procesów IT.',
      'Brak testów operating effectiveness — "mamy procedurę" to za mało.',
      'Pomijanie patch management i monitoringu w zakresie ITGC.',
      'Mieszanie ITGC z ITAC (ITGC = ogólne środowisko, ITAC = wewnątrz aplikacji).',
    ],
    quiz: {
      question: 'Które z poniższych to klasyczny zakres ITGC?',
      options: ['Walidacja pola obowiązkowego w formularzu', 'Access Management + Change Management + Backup', 'Wyliczenie podatku w module ERP', 'Workflow akceptacji faktury w aplikacji'],
      correct: 1,
      explain: 'ITGC to ogólne procesy IT: access, change, backup, incident, patch, monitoring. Pozostałe to przykłady ITAC (wewnątrz aplikacji).',
    },
  }),

  L({
    id: 'itac',
    topicKey: 'controls',
    title: 'ITAC (IT Application Controls)',
    minutes: 6,
    definition: `ITAC, czyli IT Application Controls, to kontrole działające wewnątrz konkretnej aplikacji, np. walidacja danych wejściowych, pola obowiązkowe, workflow akceptacji, automatyczne wyliczenia i ograniczenia ról. Mają sens tylko w kontekście danej aplikacji i opierają się na ITGC (np. zmiana w aplikacji musi przejść przez Change Management).`,
    example: `W systemie HR: ITAC = pole PESEL walidowane formatem, salary editable tylko przez rolę HR Manager, zmiana wynagrodzenia wymaga akceptacji drugiej osoby (SoD wewnątrz aplikacji), interface blokuje usunięcie pracownika z aktywnym kontraktem.`,
    interviewAnswer: `ITAC, czyli IT Application Controls, to kontrole działające wewnątrz konkretnej aplikacji, np. walidacja danych wejściowych, pola obowiązkowe, workflow akceptacji, automatyczne wyliczenia i ograniczenia ról. Są specyficzne dla aplikacji i opierają się na ITGC — np. zmiana w aplikacji też musi przechodzić przez Change Management.`,
    commonMistakes: [
      'Traktowanie ITAC jak ITGC (ITAC nie są "ogólne").',
      'Testowanie ITAC bez sprawdzenia ITGC (zmiana w aplikacji bez Change Mgmt = niskie zaufanie).',
      'Brak testu, czy kontrola automatyczna faktycznie działa na produkcji, nie tylko w demo.',
    ],
    quiz: {
      question: 'Walidacja formatu PESEL w systemie HR to:',
      options: ['ITGC', 'ITAC', 'Kontrola fizyczna', 'Polityka'],
      correct: 1,
      explain: 'Walidacja wewnątrz konkretnej aplikacji to ITAC. ITGC to kontrole ogólne środowiska IT.',
    },
  }),

  L({
    id: 'access-management',
    topicKey: 'controls',
    title: 'Access Management',
    minutes: 6,
    definition: `Access Management to proces nadawania, modyfikowania i odbierania dostępu zgodnie z least privilege i need-to-know. Obejmuje: wniosek + approval, provisioning, cykliczny access review (np. co 90 dni) oraz offboarding (odebranie w SLA, np. 24h). Kontrole: RBAC, MFA, PAM dla kont uprzywilejowanych.`,
    example: `Joiner-Mover-Leaver: nowy pracownik → wniosek HR → akcept manager → IT nadaje role w AD/ERP. Zmiana stanowiska (mover) → revok stare + nowe. Odejście (leaver) → HR ticket → IT odbiera w 24h, też konta w aplikacjach i SaaS, nie tylko AD.`,
    interviewAnswer: `Access Management to proces zarządzania cyklem dostępu: wniosek z akceptacją, provisioning zgodny z least privilege, cykliczny przegląd (co 90 dni) oraz offboarding z SLA (np. 24h). Sprawdzam, czy role są oparte na RBAC, czy konta uprzywilejowane mają MFA/PAM, i czy access review faktycznie kończy się revokami — nie tylko podpisami.`,
    commonMistakes: [
      'Offboarding tylko w AD, pomijanie aplikacji SaaS i lokalnych.',
      'Access review "odhaczanie" bez realnych revoków.',
      'Brak SLA dla odebrania dostępu.',
      'Nadawanie dostępu na stałe zamiast czasowego (dla kontraktorów).',
    ],
    quiz: {
      question: 'Po odejściu pracownika dostęp powinien być odebrany:',
      options: ['Kiedy IT znajdzie czas', 'W ramach SLA (np. 24h) we wszystkich systemach', 'Nigdy, na wszelki wypadek', 'Po następnym audycie'],
      correct: 1,
      explain: 'Offboarding powinien mieć SLA (np. 24h) i obejmować AD, aplikacje i SaaS. Opóźnienia = ryzyko nieautoryzowanego dostępu.',
    },
  }),

  L({
    id: 'change-management',
    topicKey: 'controls',
    title: 'Change Management',
    minutes: 7,
    definition: `Change Management to proces kontrolowanego wprowadzania zmian w systemach, tak by uniknąć awarii i niezamierzonych skutków. Poprawny proces: ticket, opis zmiany, ocena ryzyka, approval, development, testy, code review, wdrożenie, dokumentacja i plan rollbacku. Nigdy bez approvalu, nigdy bez planu cofnięcia.`,
    example: `Zła zmiana: developer wdraża hotfix na produkcję w piątek wieczorem bez ticketa "bo szybko". Dobra zmiana: ticket CR-123, opis, ocena ryzyka (niskie), approval managera + CAB, testy na środowisku QA, code review, wdrożenie w oknie serwisowym, rollback gotowy, dokumentacja po.`,
    interviewAnswer: `Poprawny proces zmiany powinien obejmować ticket, opis zmiany, ocenę ryzyka, approval, development, testy, code review, wdrożenie, dokumentację i plan rollbacku. Każda zmiana przechodzi przez CAB/approval, nigdy bezpośrednio na produkcję. Sprawdzam próbkę zmian: czy każda miała approval, testy i plan cofnięcia.`,
    commonMistakes: [
      'Wdrażanie bez ticketa i approval (emergency bez retroaktywnego CR).',
      'Brak planu rollbacku.',
      'Te same osoby rozwijają i wdrażają bez segregation of duties.',
      'Zmiany w piątek wieczór / bez okna serwisowego.',
    ],
    quiz: {
      question: 'Co jest BRAKEM w poprawnym Change Management?',
      options: ['Ticket i opis zmiany', 'Approval i testy', 'Plan rollbacku', 'Wdrożenie bez approvalu "na szybko"'],
      correct: 3,
      explain: 'Wdrożenie bez approvalu łamie proces. Poprawny flow: ticket, opis, ocena ryzyka, approval, testy, code review, wdrożenie, dokumentacja, rollback.',
    },
  }),

  L({
    id: 'backup-recovery',
    topicKey: 'controls',
    title: 'Backup & Recovery',
    minutes: 7,
    definition: `Backup & Recovery to kontrole zapewniające Availability i integralność danych. Kluczowe pojęcia: RTO (Recovery Time Objective — jak szybko odtwarzamy), RPO (Recovery Point Objective — ile danych możemy stracić). Same logi sukcesu backupu nie wystarczą — audytor sprawdza, czy wykonywano test odtworzenia, kiedy, jaki był wynik i czy spełniono RTO/RPO.`,
    example: `Klient: "Backup się robi, logi zielone." Audytor: proszę o raport testu restore z ostatnich 12 miesięcy. Brak testu → ustalenie: kontrola backupu istnieje, ale operating effectiveness niepotwierdzona; ryzyko utraty danych pozostaje wysokie. Rekomendacja: kwartalny test restore z raportem RTO/RPO.`,
    interviewAnswer: `Same logi sukcesu backupu nie wystarczą. Audytor powinien sprawdzić, czy wykonywano test odtworzenia backupu, kiedy był wykonany, jaki był wynik oraz czy spełniono RTO i RPO. Pytam też o kopiowanie offline (ochrona przed ransomware), retencję i szyfrowanie backupu. Brak testu restore = kontrola niepotwierdzona.`,
    commonMistakes: [
      'Traktowanie "logi zielone" jako dowodu (brak testu restore).',
      'Brak backupu offline/immutable (ransomware szyfruje też backup online).',
      'Nieznajomość RTO/RPO lub brak ich pomiaru w teście.',
      'Backup bez szyfrowania (Confidentiality).',
    ],
    quiz: {
      question: 'Co jest NAJWAŻNIEJSZE dla audytora w kontroli backupu?',
      options: ['Logi sukcesu kopii', 'Raport testu odtworzenia z RTO/RPO', 'Rozmiar backupu', 'Marka narzędzia backupu'],
      correct: 1,
      explain: 'Logi sukcesu mówią, że kopia powstała. Dopiero test odtworzenia potwierdza, że dane da się odzyskać w RTO/RPO — to operating effectiveness.',
    },
  }),

  L({
    id: 'incident-management',
    topicKey: 'controls',
    title: 'Incident Management',
    minutes: 6,
    definition: `Incident Management to proces wykrywania, klasyfikacji, reagowania i zamykania incydentów bezpieczeństwa z SLA i eskalacją. Obejmuje: klasyfikację priorytetów (P1–P4), role (Incident Manager), procedurę IR, notyfikacje (np. UODO w 72h dla RODO) oraz lessons learned aktualizujące kontrole i rejestr ryzyk.`,
    example: `P1: wyciek danych klientów. War room: izolacja, forensics, ocena RODO (notyfikacja UODO 72h), komunikacja, aktualizacja rejestru ryzyk, CAPA (np. automatyczny scan misconfig). Po incydencie: post-mortem i zmiana kontroli.`,
    interviewAnswer: `Incident Management to proces wykrywania, klasyfikacji, reakcji i zamykania incydentów z SLA i eskalacją. W audycie sprawdzam: klasyfikację priorytetów, role (Incident Manager), procedurę IR, notyfikacje (UODO 72h dla RODO) i lessons learned, które aktualizują rejestr ryzyk i kontrole. Brak testu procedury IR (tabletop) = ustalenie o niskiej skuteczności.`,
    commonMistakes: [
      'Brak klasyfikacji priorytetów i SLA.',
      'Incydent naprawiony bez aktualizacji rejestru ryzyk i lessons learned.',
      'Brak notyfikacji UODO przy wycieku RODO (przekroczenie 72h).',
      'Procedura IR nigdy nie testowana (tabletop).',
    ],
    quiz: {
      question: 'Przy wycieku danych osobowych (RODO) notyfikacja UODO powinna nastąpić:',
      options: ['Do końca roku', 'Bez zbędnej zwłoki, nie później niż 72h', 'Tylko jeśli klient zażąda', 'Nie jest wymagana'],
      correct: 1,
      explain: 'RODO art. 33: zgłoszenie do organu nadzorczego bez zbędnej zwłoki, nie później niż 72h po stwierdzeniu naruszenia.',
    },
  }),

  L({
    id: 'patch-management',
    topicKey: 'controls',
    title: 'Patch Management',
    minutes: 6,
    definition: `Patch Management to proces identyfikacji, testowania, zatwierdzania i wdrażania aktualizacji (łatek) z SLA zależnym od krytyczności (np. CVE krytyczne = 7 dni, wysokie = 30 dni). Obejmuje inwentaryzację aktywów (nie w każdym systemie łatamy, jeśli nie wiemy, że istnieje), monitoring CVE i weryfikację po wdrożeniu.`,
    example: `SLA patch: CVE Critical 7 dni, High 30 dni, Medium 90 dni. Audytor próbuje 20 systemów: 5 ma CVE Critical po 45 dniach → ustalenie. Kompensująco: segmentacja sieci, WAF, EDR. Shadow IT (systemy poza inwentaryzacją) = niełatane.`,
    interviewAnswer: `Patch Management to proces łatania z SLA zależnym od krytyczności CVE (np. Critical 7 dni, High 30 dni). W audycie próbuję systemy wg inwentaryzacji, sprawdzam czas od publikacji CVE do wdrożenia i weryfikację po patchu. Zwracam uwagę na shadow IT — systemy poza inwentaryzacją nie są łatane. Brak SLA lub przekroczenia = ustalenie.`,
    commonMistakes: [
      'Brak SLA zależnego od krytyczności.',
      'Łatanie tylko serwerów, pomijanie endpointów i shadow IT.',
      'Brak weryfikacji, czy patch faktycznie wdrożony (niby wdrożone, a restartu nie było).',
      'Brak inwentaryzacji — nie wiadomo, co łatamy.',
    ],
    quiz: {
      question: 'SLA dla łatania powinno zależeć od:',
      options: ['Krytyczności CVE (np. Critical 7 dni)', 'Dnia tygodnia', 'Preferencji administratora', 'Marki serwera'],
      correct: 0,
      explain: 'SLA zależy od krytyczności podatności (CVSS/CVE). Krytyczne łatamy szybko (np. 7 dni), niskie — dłużej.',
    },
  }),

  L({
    id: 'logging-monitoring',
    topicKey: 'controls',
    title: 'Logging & Monitoring',
    minutes: 6,
    definition: `Logging & Monitoring to detekcyjna warstwa kontroli: zbieranie logów (logowania, zmiany, administratora), korelacja (SIEM), alerty i reakcja. Kontrole: co logujemy (kto, co, kiedy), jak długo retencja, kto przegląda alerty, czas reakcji. Bez logów brak rozliczalności (accountability) i brak detekcji.`,
    example: `Logi administratora: każda akcja admina logowana, wysyłana do SIEM, alerty o nietypowych akcjach (masowe usuwanie, dostęp do poufnych plików). Retencja 1 rok. Brak logów akcji admina = brak rozliczalności (klasyczny problem shared admin account).`,
    interviewAnswer: `Logging & Monitoring to detekcyjna warstwa: zbieramy logi (logowania, zmiany, akcje admina), korelujemy w SIEM, ustawiamy alerty i reagujemy. W audycie sprawdzam, co logujemy (kto/co/kiedy), retencję, kto przegląda alerty i czas reakcji. Szczególnie logi akcji administratora — bez nich nie ma rozliczalności przy współdzielonym koncie.`,
    commonMistakes: [
      'Logi zbierane, ale nikt ich nie przegląda (brak alertów/reagowania).',
      'Brak logów akcji administratora.',
      'Zbyt krótka retencja do celów forensicznych.',
      'Brak synchronizacji czasu (NTP) — logi nie do połączenia.',
    ],
    quiz: {
      question: 'Logi zbierane, ale nikt nie przegląda alertów. To:',
      options: ['Kontrola skuteczna', 'Kontrola z niską operating effectiveness', 'Brak ryzyka', 'Polityka'],
      correct: 1,
      explain: 'Logowanie bez monitoringu i reakcji = kontrola detekcyjna z niską skutecznością. Zbieranie danych to nie detekcja.',
    },
  }),

  L({
    id: 'segregation-of-duties',
    topicKey: 'controls',
    title: 'Segregation of Duties (SoD)',
    minutes: 6,
    definition: `Segregation of Duties oznacza rozdzielenie obowiązków, tak aby jedna osoba nie kontrolowała całego krytycznego procesu. Zmniejsza to ryzyko błędów, nadużyć i nieautoryzowanych działań. Klasyczne rozdzielenie: wniosek / akceptacja / wykonanie / kontrola — nie powinny być u tej samej osoby. W IT: developer ≠ wdrażający na produkcję ≠ audytujący.`,
    example: `Złe SoD: jeden administrator robi wszystkie zmiany produkcyjne i sam je zatwierdza. Dobre SoD: developer koduje, tester testuje, CAB akceptuje, operator wdraża, audyt weryfikuje. W finansach: ten, kto tworzy dostawcę ≠ ten, kto zatwierdza płatność ≠ ten, kto ją księguje.`,
    interviewAnswer: `Segregation of Duties oznacza rozdzielenie obowiązków, tak aby jedna osoba nie kontrolowała całego krytycznego procesu. Zmniejsza to ryzyko błędów, nadużyć i nieautoryzowanych działań. W IT: developer ≠ wdrażający na produkcję ≠ audytujący. W finansach: tworzenie dostawcy ≠ akceptacja płatności ≠ księgowanie. SoD sprawdzam też wewnątrz aplikacji (ITAC).`,
    commonMistakes: [
      'Jedna osoba robi i zatwierdza zmiany produkcyjne.',
      'SoD tylko w finansach, pomijanie IT.',
      'Brak narzędzia do wykrywania konfliktów SoD w dużych systemach.',
      'Wyjątki SoD bez formalnej akceptacji i przeglądu.',
    ],
    quiz: {
      question: 'Jeden administrator robi i sam zatwierdza wszystkie zmiany produkcyjne. To:',
      options: ['Poprawne SoD', 'Naruszenie SoD (brak rozdzielenia obowiązków)', 'Kontrola detekcyjna', 'Polityka'],
      correct: 1,
      explain: 'Ten sam człowiek wykonuje i akceptuje — klasyczny konflikt SoD, zwiększa ryzyko błędów i nadużyć.',
    },
  }),

  L({
    id: 'least-privilege',
    topicKey: 'controls',
    title: 'Least Privilege',
    minutes: 5,
    definition: `Least Privilege to zasada nadawania minimalnych uprawnień potrzebnych do wykonywania zadań — i tylko na czas ich trwania. Powiązana z need-to-know. Kontrole: RBAC, JIT (just-in-time) access, PAM dla uprawnień admina, cykliczny access review usuwający nadmiarowe uprawnienia.`,
    example: `Zła praktyka: każdy w dziale ma admina lokalnego "na wszelki wypadek". Dobra: użytkownik ma role "report viewer" (tylko odczyt); elwatowany dostęp do produkcji tylko przez PAM, czasowo (2h), z powodem i logowaniem sesji.`,
    interviewAnswer: `Least Privilege to zasada minimalnych uprawnień — tylko te, które są potrzebne do zadania, i tylko na czas jego trwania. Realizuję ją przez RBAC, access review usuwające nadmiar, PAM i JIT access dla uprawnień uprzywilejowanych. Sprawdzam, czy nie ma "konta admina dla wszystkich" i czy elwatowany dostęp jest czasowy i logowany.`,
    commonMistakes: [
      'Stale uprawnienia dawane "na stałe" i nigdy nie usuwane.',
      'Admin lokalny dla każdego "na wszelki wypadek".',
      'Brak access review — uprawnienia rosną po zmianie stanowiska.',
      'Brak JIT/PAM — elwatowany dostęp dostępny zawsze.',
    ],
    quiz: {
      question: 'Zgodnie z Least Privilege użytkownik powinien mieć:',
      options: ['Admina na wszelki wypadek', 'Minimalne uprawnienia potrzebne do zadań, czasowo', 'Wszystkie uprawnienia dla wygody', 'Dostęp tylko do logów'],
      correct: 1,
      explain: 'Least Privilege = minimum potrzebnych uprawnień, najlepiej czasowo (JIT/PAM) i z cyklicznym przeglądem.',
    },
  }),
];
