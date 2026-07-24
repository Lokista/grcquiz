// Tryb "Myśl jak audytor" — sytuacja + możliwe reakcje; użytkownik wybiera najlepszą.
// Każda opcja ma ocenę i wyjaśnienie; bestIndex wskazuje wzorcową.
// Aby dodać scenariusz: dopisz obiekt poniżej.

export const SCENARIOS = [
  {
    id: 'sc-no-evidence',
    topicKey: 'basics',
    title: 'Klient mówi, że kontrola działa, ale nie ma dowodów',
    situation: `Klient twierdzi, że kwartalny przegląd dostępu jest prowadzony, ale na prośbę o dowód odpowiada: "robimy to zawsze, ale nie mamy tego zapisanego". Co robisz?`,
    options: [
      { text: 'Wierzę klientowi i odhaczam kontrolę jako działającą', verdict: 'bad', why: 'Deklaracja to nie dowód. Bez artefaktu nie potwierdzisz operating effectiveness.' },
      { text: 'Zgłaszam ustalenie: kontrola istnieje w polityce, ale brak dowodów skuteczności', verdict: 'good', why: 'Audytor opiera się na dowodach. Brak artefaktu = kontrola design OK, operating effectiveness niepotwierdzona.' },
      { text: 'Wymuszam wdrożenie nowego narzędzia GRC', verdict: 'bad', why: 'Audytor nie narzuca rozwiązań — formułuje ustalenie i rekomendację; wybór narzędzia to decyzja klienta.' },
      { text: 'Od razu piszę ustalenie krytyczne o braku kontroli', verdict: 'mid', why: 'Kontrola w polityce istnieje (design), brakuje dowodu skuteczności — to mniejsza waga niż "brak kontroli".' },
    ],
    bestIndex: 1,
    auditorLesson: 'Audytor nie zgaduje — prosi o evidence i ocenia kontrolę przez pryzmat design i operating effectiveness.',
  },
  {
    id: 'sc-shared-admin',
    topicKey: 'identity',
    title: 'Administratorzy używają jednego konta',
    situation: `Wszystkich 12 administratorów loguje się jednym kontem "Administrator". Klient mówi, że to wygodniejsze. Co robisz?`,
    options: [
      { text: 'Akceptuję, skoro wygodne dla zespołu', verdict: 'bad', why: 'Wygoda nie usprawiedliwia braku rozliczalności.' },
      { text: 'Zgłaszam ustalenie: brak rozliczalności; rekomenduję konta imienne + MFA + PAM + monitoring', verdict: 'good', why: 'Kluczowy problem to accountability — jeden konto, wiele osób, nie da się ustalić sprawcy w logach.' },
      { text: 'Proszę, by zapisali hasło w Excelu "dla bezpieczeństwa"', verdict: 'bad', why: 'Excel z hasłem admina to dodatkowe ryzyko wycieku.' },
      { text: 'Wymuszam natychmiastowe wyłączenie konta, blokując pracę zespołu', verdict: 'bad', why: 'Audytor nie blokuje operacji; formułuje ustalenie z rekomendacją i terminem remediacji.' },
    ],
    bestIndex: 1,
    auditorLesson: 'Audytor analizuje ryzyko biznesowe (brak rozliczalności, nadużycia) i komunikuje rekomendacje profesjonalnie — bez paraliżowania klienta.',
  },
  {
    id: 'sc-backup-no-restore',
    topicKey: 'controls',
    title: 'Backup ma logi sukcesu, ale nigdy nie był odtwarzany',
    situation: `Klient pokazuje zielone logi backupu z 12 miesięcy. Na pytanie o test odtworzenia: "nigdy nie robiliśmy restore, ale kopia zawsze się robi". Co robisz?`,
    options: [
      { text: 'Uznaję kontrolę za skuteczną — logi są zielone', verdict: 'bad', why: 'Logi sukcesu kopii ≠ dowód, że dane da się odzyskać w RTO/RPO.' },
      { text: 'Zgłaszam ustalenie: kontrola backupu istnieje, ale operating effectiveness niepotwierdzona; rekomenduję kwartalny test restore z RTO/RPO', verdict: 'good', why: 'Dopiero test restore potwierdza Availability; brak testu = ryzyko utraty danych pozostaje wysokie.' },
      { text: 'Wymuszam natychmiastowy restore całej produkcji', verdict: 'bad', why: 'Audytor nie wykonuje operacji u klienta; to decyzja i ryzyko klienta.' },
      { text: 'Wpisuję "brak backupu"', verdict: 'bad', why: 'Backup istnieje; ustalenie musi być precyzyjne: brak testu restore, nie "brak backupu".' },
    ],
    bestIndex: 1,
    auditorLesson: 'Audytor ocenia kontrolę przez dowód skuteczności (test restore, RTO/RPO), nie przez logi samej kopii.',
  },
  {
    id: 'sc-dev-no-approval',
    topicKey: 'controls',
    title: 'Developer wdraża zmiany bez approvala',
    situation: `W próbie 10 zmian produkcyjnych: 4 wdrożone bez ticketa i approvalu, "bo to były małe hotfixy". Co robisz?`,
    options: [
      { text: 'Akceptuję — małe hotfixy nie wymagają procesu', verdict: 'bad', why: 'Każda zmiana na produkcji wymaga kontroli; "mały" to subiektywna ocena.' },
      { text: 'Zgłaszam ustalenie: brak skutecznego Change Management; rekomenduję CR (nawet retro), approval, testy, rollback, SoD', verdict: 'good', why: '40% zmian poza procesem = systemowa luka Change Management; ryzyko awarii i nieautoryzowanych zmian.' },
      { text: 'Zakazuję hotfixów całkowicie', verdict: 'bad', why: 'Audytor rekomenduje proces (emergency change z retro CR), nie zakazuje działania.' },
      { text: 'Piszę ustalenie tylko o SoD', verdict: 'mid', why: 'SoD to jeden z elementów, ale główna luka to brak approvalu/ticketa — ujęcie częściowe.' },
    ],
    bestIndex: 1,
    auditorLesson: 'Audytor ocenia design i operating effectiveness procesu; próba pokazuje skalę (40%), co uzasadnia ustalenie major.',
  },
  {
    id: 'sc-stale-account',
    topicKey: 'identity',
    title: 'Pracownik odszedł, ale konto nadal działa',
    situation: `Pracownik odszedł 14 dni temu, a jego konto w aplikacji SaaS nadal jest aktywne z dostępem do danych klientów. Co robisz?`,
    options: [
      { text: 'Nic — to po stronie klienta, nie moja spraw', verdict: 'bad', why: 'To ryzyko nieautoryzowanego dostępu po zatrudnieniu — w zakresie audytu access management.' },
      { text: 'Zgłaszam ustalenie: nieskuteczny offboarding (brak SLA / integracji HR→SaaS); rekomenduję automatyczny revok i SLA', verdict: 'good', why: 'Konto zombie = ryzyko RODO i nadużyć; ustalenie o operating effectiveness offboardingu z rekomendacją.' },
      { text: 'Samodzielnie wyłączam konto', verdict: 'bad', why: 'Audytor nie wykonuje operacji u klienta; eskaluje i rekomenduje.' },
      { text: 'Wpisuję "drobna uwaga" bez ustalenia', verdict: 'bad', why: 'Aktywne konto po 14 dniach = istotne ryzyko; wymaga formalnego ustalenia.' },
    ],
    bestIndex: 1,
    auditorLesson: 'Audytor dokumentuje ustalenia o nieskuteczności kontroli i łączy je z ryzykiem biznesowym/regulacyjnym (RODO).',
  },
  {
    id: 'sc-client-disagrees',
    topicKey: 'basics',
    title: 'Klient nie zgadza się z findingiem',
    situation: `Klient nie zgadza się z ustaleniem o braku MFA dla adminów, twierdząc "to nie jest problem, mamy silne hasła". Co robisz?`,
    options: [
      { text: 'Usuwam ustalenie, by nie psuć relacji', verdict: 'bad', why: 'Audytor nie usuwa ustaleń pod naciskiem; to strona obiektywności.' },
      { text: 'Wysłucham, odnoszę się do dowodu i kryterium, zostawiam ustalenie + rejestruję management response klienta w raporcie', verdict: 'good', why: 'Profesjonalizm: empatia + oparcie na dowodzie + stanowczość; rozbieżność dokumentuję jako management response.' },
      { text: 'Eskaluję do zarządu klienta bez rozmowy z klientem', verdict: 'bad', why: 'Najpierw rozmowa z właścicielem procesu; eskalacja to ostatni krok wg procedury.' },
      { text: 'Zgadzam się, że silne hasła wystarczą', verdict: 'bad', why: 'Silne hasła nie zastępują MFA; ustalenie pozostaje uzasadnione ryzykiem przejęcia konta.' },
    ],
    bestIndex: 1,
    auditorLesson: 'Audytor komunikuje rekomendacje profesjonalnie: wysłucha, oprze się na dowodzie, nie ugnie się pod naciskiem, a rozbieżność zapisze w raporcie.',
  },
  {
    id: 'sc-hr-cross-role',
    topicKey: 'controls',
    title: 'System HR pozwala edytować dane spoza roli',
    situation: `W teście ITAC okazuje się, że użytkownik z rolą "HR-viewer" może edytować pole wynagrodzenia przez niestandardowy formularz pomijający sprawdzanie ról. Co robisz?`,
    options: [
      { text: 'Traktuję jako drobną uwagę — formularz i tak mało używany', verdict: 'bad', why: 'Eskalacja uprawnień do poufnych danych = istotne ryzyko (RODO, fraud), niezależnie od częstości użycia.' },
      { text: 'Zgłaszam ustalenie: luka ITAC (brak autoryzacji na poziomie formularza); rekomenduję spójne RBAC na wszystkich ścieżkach + test', verdict: 'good', why: 'ITAC muszą działać na każdej ścieżce dostępu; pominięcie na jednym formularzu = luka projektowa i operacyjna.' },
      { text: 'Proszę, by usunęli formularz', verdict: 'mid', why: 'To może być obejście problemu, ale rekomendacją jest naprawa autoryzacji, nie usuwanie funkcjonalności.' },
      { text: 'Piszę ustalenie o ITGC', verdict: 'mid', why: 'To luka ITAC (autoryzacja w aplikacji), nie ITGC; ujęcie niewłaściwej kategorii.' },
    ],
    bestIndex: 1,
    auditorLesson: 'Audytor ocenia design i operating effectiveness kontroli na wszystkich ścieżkach; eskalacja uprawnień = wysokie ryzyko.',
  },
  {
    id: 'sc-patching-overdue',
    topicKey: 'controls',
    title: 'Krytyczne CVE niezałatane od 45 dni',
    situation: `W próbie 20 systemów: 5 ma krytyczne CVE niezałatane od 45 dni. Klient tłumaczy brakiem okna serwisowego. Co robisz?`,
    options: [
      { text: 'Akceptuję — okno serwisowe to usprawiedliwienie', verdict: 'bad', why: '45 dni na Critical przekracza każdy racjonalny SLA (zwykle 7 dni); okno to do zaplanowania, nie wymówka.' },
      { text: 'Zgłaszam ustalenie: nieskuteczny patch management (SLA); rekomenduję SLA wg krytyczności + kompensację (segmentacja/WAF/EDR) do patcha', verdict: 'good', why: 'Mam ryzyko wykorzystania CVE; rekomenduję SLA + kontrole kompensujące na czas do patcha.' },
      { text: 'Wymuszam shutdown systemów do patcha', verdict: 'bad', why: 'Audytor nie zatrzymuje operacji; rekomenduje i klient decyduje o ryzyku.' },
      { text: 'Piszę "brak patch management"', verdict: 'mid', why: 'Patch management istnieje, ale nieskuteczny (SLA); ustalenie powinno być precyzyjne.' },
    ],
    bestIndex: 1,
    auditorLesson: 'Audytor ocenia skuteczność kontroli względem SLA i ryzyka; rekomenduje kompensację do czasu remediacji.',
  },
  {
    id: 'sc-teams-not-evidence',
    topicKey: 'basics',
    title: 'Czaty Teams jako „dowód” offboardingu',
    situation: `W banku kontrola leaver. Klient daje zrzut Teams (bez daty): „HR napisał do IT” i mówi, że to wystarczy. Co robisz?`,
    options: [
      { text: 'Oznaczam pass — komunikacja HR→IT jest widoczna', verdict: 'bad', why: 'Screenshot bez daty/kontekstu to słabe evidence; nie widać disable, ticketu ani SLA.' },
      { text: 'Proszę o mocne evidence (data HR, ticket, data disable, logi); Teams traktuję jako wskazówkę, nie dowód skuteczności', verdict: 'good', why: 'Ściąga: mocne = export/log/ticket/approval z timestampem; słabe = ustna deklaracja / screenshot bez kontekstu.' },
      { text: 'Piszę finding „brak HR” bez dalszych próśb', verdict: 'mid', why: 'Za wcześnie — najpierw request list i próbka; może istnieć ticket poza czatem.' },
      { text: 'Akceptuję, jeśli polityka nie wymaga ticketów', verdict: 'bad', why: 'Nawet przy słabej polityce audytor ocenia ryzyko unauthorized access i design/operating.' },
    ],
    bestIndex: 1,
    auditorLesson: 'Evidence > deklaracje. Bez daty disable i logów nie potwierdzasz operating effectiveness offboardingu.',
  },
  {
    id: 'sc-payments-no-mfa-admin',
    topicKey: 'controls',
    title: 'Admini płatności bez MFA',
    situation: `Bank: administratorzy systemu płatności bez MFA. Klient: „Hasła są długie, to wystarczy.” Co robisz?`,
    options: [
      { text: 'Akceptuję — silne hasła = niski risk', verdict: 'bad', why: 'Ściąga banking: brak MFA adminów = high risk (przejęcie = pełna kontrola / fraud).' },
      { text: 'Finding high: brak MFA na privileged; rekomenduję MFA + konta imienne + PAM/monitoring', verdict: 'good', why: 'Unauthorized access / privilege misuse; płatności = duży impact biznesowy.' },
      { text: 'Tylko medium — kompensują silne hasła', verdict: 'mid', why: 'Kompensata możliwa do odnotowania, ale przy płatnościach severity zwykle high.' },
      { text: 'Wymuszam natychmiastowy shutdown płatności', verdict: 'bad', why: 'Audytor rekomenduje i eskaluje — nie zatrzymuje operacji samodzielnie.' },
    ],
    bestIndex: 1,
    auditorLesson: 'W banku brak MFA adminów przy płatnościach mapujesz na high: fraud, reputacja, zgodność.',
  },
  {
    id: 'sc-shadow-ai-bank',
    topicKey: 'ai',
    title: 'Shadow AI w zespole kredytowym',
    situation: `Analitycy wklejają dane klientów do publicznego ChatGPT „dla szybkości”. Brak polityki approved tools. Co robisz?`,
    options: [
      { text: 'Ignoruję — AI przyspiesza pracę', verdict: 'bad', why: 'Shadow AI: data leakage, brak ownera, brak walidacji outputu.' },
      { text: 'Finding: shadow AI / data leakage; rekomenduję approved tools, klasyfikację danych, human review, logging, DPIA/vendor assessment', verdict: 'good', why: 'Kontrole AI Governance ze ściągi: approved tools, classification, redaction, human review, logging, access, DPIA, vendor.' },
      { text: 'Zakazuję całego AI w banku bez analizy', verdict: 'mid', why: 'Lepsza allowlista i kontrola niż ślepy zakaz — decyzja klienta, Ty rekomendujesz ramy.' },
      { text: 'Piszę tylko o RODO bez ryzyka AI', verdict: 'mid', why: 'RODO jest częścią, ale ściąga wymienia też hallucination, prompt injection, explainability.' },
    ],
    bestIndex: 1,
    auditorLesson: 'AI wspiera, nie zastępuje odpowiedzialności — shadow AI = wyciek + brak governance.',
  },
];

export const SCENARIO_MAP = Object.fromEntries(SCENARIOS.map((s) => [s.id, s]));

export function scenarioById(id) {
  return SCENARIO_MAP[id] || null;
}
