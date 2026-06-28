/** Rozbudowane wyjaśnienia mini-quizów lekcji — klucz = id lekcji. */
export const QUIZ_RICH_EXPLAINS = {
  'what-is-it-audit': {
    why: 'Audyt IT ocenia kontrole, nie kod. Szukasz dowodów design effectiveness (czy proces jest sensownie zaprojektowany) i operating effectiveness (czy działał w okresie audytu) — raporty, tickety, logi, próbki.',
    traps: '„Błędy w kodzie linia po linii” to code review lub pentest, nie klasyczny IT audit. „Szukanie winnych” niszczy współpracę z klientem — audytor ocenia kontrolę, nie karze ludzi.',
    audit: 'Przy każdej kontroli zadaj: jakie kryterium (polityka, ISO, wewnętrzny standard)? Jaki artefakt to potwierdza? Czy testowałem próbkę z okresu audytu?',
  },
  'auditor-mindset': {
    why: 'Profesjonalny audytor nie akceptuje deklaracji. Prosi o artefakt (raport MFA, lista revoków, ticket change) i weryfikuje na próbce, czy kontrola faktycznie działała — to operating effectiveness.',
    traps: 'Zapis „OK” bez dowodu to błąd metodologiczny. Od razu pisać ustalenie negatywne też — najpierw zbierasz dowód. Wymuszanie narzędzia to konsulting, nie audyt.',
    audit: 'Mantra: „Pokaż mi dowód.” Jeśli klient mówi „działa”, odpowiedz: „Proszę o raport z ostatniego kwartału i próbkę 15 rekordów — sprawdzę spójność.”',
  },
  'what-is-control': {
    why: 'Alert SIEM informuje o zdarzeniu po jego wystąpieniu — to warstwa detekcyjna (detective). MFA blokowałaby zanim dojdzie do logowania (preventive), procedura IR naprawia skutki (corrective).',
    traps: 'MFA to preventive, nie detective. Procedura IR to corrective. „Fizyczna” nie pasuje do alertu w systemie. Dobre obrona łączy warstwy — sam alert bez reakcji ma niską skuteczność.',
    audit: 'Mapuj każdą kontrolę na typ (P/D/C) i na cel CIA. Brak warstwy detekcyjnej przy wysokim ryzyku = rekomendacja uzupełnienia kontroli, nie tylko „włącz alert”.',
  },
  evidence: {
    why: 'Silny dowód access review = raport z okresu + manager sign-off + tickety revoku. Pokazuje, że proces nie tylko istniał w polityce, ale został wykonany i zaakceptowany.',
    traps: 'Screenshot bez daty i autora łatwo sfałszować. Deklaracja ustna CISO to self-attestation bez niezależności. Diagram architektury opisuje design, nie dowodzi, że review się odbył.',
    audit: 'Oceniaj dowód: kompletność (kontekst, okres), wiarygodność (kto podpisał), istotność (czy dotyczy testowanej kontroli). Słaby dowód → ustalenie o braku operating effectiveness.',
  },
  'risk-threat-vulnerability': {
    why: 'Brak MFA to słabość w zabezpieczeniach — podatność (vulnerability), którą atakujący może wykorzystać. Threat to sam atakujący/phishing; risk to ocena L×I tego scenariusza.',
    traps: 'Threat ≠ risk („hacker” to zagrożenie, nie ryzyko). Brak MFA sam w sobie nie jest jeszcze „ryzykiem” w rejestrze — dopiero po ocenie prawdopodobieństwa i wpływu. Kontrola to środek redukcji, nie podatność.',
    audit: 'W rejestrze ryzyk szukaj logicznej ścieżki: aktywo → threat → vulnerability → inherent risk → kontrola → residual risk. Brak podatności w opisie = słabe uzasadnienie score.',
  },
  asset: {
    why: 'Bez inwentaryzacji aktywów nie wiesz, co chronić ani jak klasyfikować dane. Risk assessment startuje od aktywów, ich właścicieli i wymagań CIA — reszta to konsekwencja.',
    traps: 'Narzędzie GRC to tylko rejestr — bez aktywów puste. Polisa ubezpieczeniowa to transfer ryzyka, nie identyfikacja aktywów. Polityka haseł to kontrola, nie punkt startowy oceny ryzyka.',
    audit: 'Pytaj klienta: „Gdzie macie rejestr aktywów informacyjnych? Kto jest właścicielem CRM/ERP? Jaka klasyfikacja poufności?” Bez tego rejestr ryzyk jest na piasku.',
  },
  likelihood: {
    why: 'Likelihood opieramy na faktach: historia incydentów, statystyki branżowe, skuteczność istniejących kontroli. „Czucie” bez skali i danych nie przejdzie w rozmowie z zarządem ani audytorem zewnętrznym.',
    traps: 'Intuicja bez kalibracji skali 1–5 jest bezużyteczna w porównaniu ryzyk. Liczba stron polityki nie ma związku z prawdopodobieństwem. Wielkość biura ≠ częstotliwość ataku.',
    audit: 'Przy każdym L w rejestrze pytaj: skąd ta liczba? Czy uwzględniono kontrole detekcyjne/preventive? Czy to L inherentne czy residualne po kontrolach?',
  },
  impact: {
    why: 'Wyciek danych osobowych ma wysoki impact: kary RODO (do 4% obrotu), notyfikacja UODO, utrata zaufania klientów, koszty prawne i remediacji — to skala skutków, nie prawdopodobieństwo.',
    traps: 'Likelihood to „jak często”, vulnerability to słabość techniczna, control rating to ocena kontroli — żadne z nich nie mierzy wielkości szkody po incydencie.',
    audit: 'Impact licz finansowo, operacyjnie, reputacyjnie i regulacyjnie. Wyciek RODO prawie zawsze ≥4/5 — porównaj z apetytem na ryzyko zarządu.',
  },
  'risk-score': {
    why: 'W klasycznej matrycy 5×5 score = Likelihood × Impact. Przy L=4 i I=4 wychodzi 16 — strefa wysokiego ryzyka wymagająca treatmentu lub formalnej akceptacji.',
    traps: '8 to L+I (dodawanie), nie mnożenie. 4 to sama składowa. 20 to np. L=4×I=5 — inny scenariusz. Mnożenie lepiej rozróżnia skrajne kombinacje niż suma.',
    audit: 'Zawsze sprawdź, czy rejestr mnoży L×I, czy przypadkiem dodaje. Upewnij się, że inherent i residual nie są mieszane w jednej kolumnie bez etykiety.',
  },
  'residual-risk': {
    why: 'Residual risk to ryzyko, które zostaje po wdrożeniu kontroli — nigdy zero, bo kontrole mają luki i wyjątki. Porównujesz je z apetytem na ryzyko zarządu.',
    traps: 'Inherent = przed kontrolami. Apetyt to akceptowalny poziom dla organizacji, nie „pozostałe ryzyko”. Kara regulacyjna to skutek materializacji, nie definicja residual.',
    audit: 'Po teście kontroli zapytaj: „Jaki residual zostaje?” Jeśli > apetyt → dodatkowe kontrole, kompensacja lub risk acceptance z terminem i właścicielem.',
  },
  'risk-treatment': {
    why: 'Ubezpieczenie cyber przenosi część kosztów finansowych na ubezpieczyciela — to transfer. Nie usuwa ryzyka operacyjnego, reputacyjnego ani obowiązków regulacyjnych (np. zgłoszenie UODO).',
    traps: 'Mitigate = wdrożenie kontroli technicznych/organizacyjnych. Avoid = rezygnacja z działalności. Accept = świadoma decyzja governance, gdy residual mieści się w apetycie.',
    audit: 'Przy rekomendacji wskazuj treatment: mitigate (MFA), transfer (ubezpieczenie + DPA), avoid (wyłączenie systemu), accept (tylko z formalnym podpisem i terminem).',
  },
  'cia-triad': {
    why: 'Backup i test restore gwarantują, że system i dane będą dostępne po awarii lub ataku — to Availability. Szyfrowanie backupu chroniłoby Confidentiality; sumy kontrolne — Integrity.',
    traps: 'Backup nie naprawia nieautoryzowanej zmiany danych (Integrity) — tylko przywraca kopię. Sam backup bez testu restore to kontrola na papierze. Confidentiality to kto widzi dane, nie czy system działa.',
    audit: 'Przy backupie pytaj o RTO/RPO i ostatni udany test restore — to dowód Availability. Zapytaj też, czy backup jest offline/immutable (ransomware).',
  },
  'audit-finding': {
    why: 'Rekomendacja bez właściciela i terminu nie da się zamknąć — to najczęstszy błąd juniorów. Poprawne ustalenie ma: kryterium, warunek, przyczynę, skutek, rekomendację z ownerem i deadline.',
    traps: 'Kryterium, warunek i skutek są potrzebne — brak któregoś osłabia ustalenie. Ale sama rekomendacja „wdrożyć MFA” bez owner/deadline zostaje wisząca w trackerze latami.',
    audit: 'Szablon: „Kryterium: polityka X. Warunek: 3/15 bez MFA. Skutek: przejęcie konta. Rekomendacja: MFA 100% do [data], owner: Head of IT.”',
  },

  itgc: {
    why: 'ITGC to ogólne kontrole środowiska IT wspierające wiele systemów: dostęp, zmiana, backup, incydent, patch, monitoring. Bez nich nie ufasz danym z ERP ani ITAC.',
    traps: 'Walidacja PESEL w HR to ITAC (w aplikacji). Wyliczenie podatku w ERP to logika biznesowa/ITAC. Workflow faktury w aplikacji finansowej — ITAC, nie ITGC.',
    audit: 'W audycie finansowym ITGC są fundamentem: najpierw access/change/backup dla systemów finansowych, potem ITAC w modułach księgowych.',
  },
  itac: {
    why: 'Walidacja formatu PESEL w module HR działa wewnątrz konkretnej aplikacji — to IT Application Control. ITGC obejmuje np. kto może wdrożyć zmianę w tej aplikacji (Change Management).',
    traps: 'ITGC ≠ ITAC. Polityka to intencja, nie automatyczna kontrola w aplikacji. Kontrola fizyczna to drzwi/karty — nie walidacja pola formularza.',
    audit: 'Test ITAC na produkcji (nie demo): spróbuj wprowadzić błędny PESEL, zmienić wynagrodzenie bez approval — czy aplikacja blokuje? Sprawdź też, czy zmiana kodu przeszła przez ITGC change.',
  },
  'access-management': {
    why: 'Offboarding w SLA (np. 24h) we wszystkich systemach — AD, aplikacje lokalne, SaaS — redukuje ryzyko, że były pracownik nadal ma dostęp. Joiner-mover-leaver to rdzeń IAM.',
    traps: '„Kiedy IT znajdzie czas” = brak procesu. „Nigdy nie odbieramy” to akceptacja permanentnego ryzyka. Czekanie do audytu = zombie konta przez miesiące.',
    audit: 'Proś o listę odejść z ostatnich 90 dni i porównaj z revokami w AD/SaaS — opóźnienia > SLA to ustalenie. Sprawdź też konta kontraktowe z datą wygaśnięcia.',
  },
  'change-management': {
    why: 'Wdrożenie bez approvalu łamie Change Management — brak segregacji, brak oceny ryzyka, brak audyt trail. Emergency change wymaga retroaktywnego CR, nie „na szybko” bez śladu.',
    traps: 'Ticket, approval, testy i rollback plan są elementami poprawnego procesu — brak któregoś osłabia kontrolę, ale najgorsza praktyka to wdrożenie produkcyjne bez żadnego approvalu.',
    audit: 'Próbka 20–30 change z okresu: każdy musi mieć ticket, approval, test (lub uzasadnienie emergency) i plan rollback. Piątkowy hotfix bez CR = klasyczne ustalenie.',
  },
  'backup-recovery': {
    why: 'Logi sukcesu mówią tylko, że kopia powstała — nie że da się odtworzyć dane w RTO/RPO. Test restore to dowód operating effectiveness kontroli backupu.',
    traps: 'Rozmiar backupu i marka narzędzia nie dowodzą odzyskiwalności. Zielone logi bez testu restore to najczęstsza iluzja bezpieczeństwa u klientów.',
    audit: 'Pytanie must-have: „Kiedy ostatni test restore i jaki wynik vs RTO/RPO?” Brak testu w 12 mies. → ustalenie + rekomendacja kwartalnego testu z raportem.',
  },
  'incident-management': {
    why: 'RODO art. 33: zgłoszenie do UODO bez zbędnej zwłoki, najpóźniej 72h od stwierdzenia naruszenia ochrony danych osobowych (chyba że niskie ryzyko dla praw osób).',
    traps: '„Do końca roku” i „tylko na żądanie klienta” to błąd prawny. Brak notyfikacji przy wycieku RODO = wysokie ryzyko kary niezależnie od remediacji technicznej.',
    audit: 'Przy incydencie RODO sprawdź timeline: kiedy wykryto, kiedy oceniono ryzyko, kiedy wysłano do UODO. Przekroczenie 72h = ustalenie compliance + słaba procedura IR.',
  },
  'patch-management': {
    why: 'SLA łatania powinno zależeć od krytyczności CVE (CVSS): Critical ~7 dni, High ~30 dni — bo exploit publiczny zwiększa likelihood materializacji.',
    traps: 'Dzień tygodnia, preferencje admina czy marka serwera nie mają związku z ryzykiem. Bez inwentaryzacji nie wiesz, co łatasz — shadow IT zostaje niezałatane.',
    audit: 'Próbka systemów z inwentaryzacji: ile dni od publikacji Critical CVE do wdrożenia? Systemy > SLA → ustalenie. Zapytaj o weryfikację po patchu (restart, skan).',
  },
  'logging-monitoring': {
    why: 'Zbieranie logów bez przeglądu alertów i reakcji to kontrola detekcyjna o niskiej operating effectiveness — dane leżą, incydenty nie są wykrywane na czas.',
    traps: '„Skuteczna” wymagałaby procesu triage i eskalacji. Brak ryzyka to absurd przy braku monitoringu. Polityka bez operacji to tylko dokument.',
    audit: 'Pytaj: kto przegląda alerty, w jakim SLA reaguje, czy są przykłady eskalacji P1. Szczególnie logi akcji admina — bez nich brak accountability.',
  },
  'segregation-of-duties': {
    why: 'Ten sam administrator wykonuje i zatwierdza zmiany produkcyjne — klasyczne naruszenie SoD. Jedna osoba kontroluje cały proces → ryzyko błędu i nadużycia bez wykrycia.',
    traps: '„Poprawne SoD” to oczywisty błąd. Kontrola detekcyjna nie zastępuje rozdzielenia obowiązków. Polityka bez egzekucji nie naprawia konfliktu.',
    audit: 'Mapuj role: kto koduje, kto testuje, kto akceptuje (CAB), kto wdraża. W finansach: tworzenie dostawcy ≠ akceptacja płatności. Wyjątki SoD wymagają akceptacji i przeglądu.',
  },
  'least-privilege': {
    why: 'Least Privilege = minimalne uprawnienia potrzebne do zadania, najlepiej czasowo (JIT/PAM) i z cyklicznym access review usuwającym nadmiar po zmianie stanowiska.',
    traps: 'Admin „na wszelki wypadek” i „wszystkie uprawnienia dla wygody” to antywzorzec. Dostęp tylko do logów to nadal może być nadmierny, jeśli nie potrzebny do roli.',
    audit: 'Szukaj kont z uprawnieniami wyższymi niż rola (admin lokalny dla wszystkich). Sprawdź elwatowany dostęp — czy czasowy, logowany, przez PAM?',
  },

  'active-directory': {
    why: 'Domain Admins to pełna kontrola nad domeną — powinno być kilka kont, używanych tylko do zadań admin domeny, przez PAM. 40 kont = ogromna powierzchnia ataku (Kerberoasting, PtH).',
    traps: '„Wymóg regulacyjny” — nie ma takiego. „Bez znaczenia” ignoruje realne ataki AD. „Poprawna praktyka” — Microsoft i CIS zalecają minimalizację DA.',
    audit: 'Eksportuj Domain Admins + Enterprise Admins. Policz, zapytaj o uzasadnienie każdego konta. Sprawdź LAPS, gMSA dla kont serwisowych, stare hasła.',
  },
  'shared-admin-accounts': {
    why: 'Współdzielone konto = w logach widać tylko „Administrator”, nie konkretną osobę. Po incydencie nie ustalisz sprawcy — brak accountability i compliance.',
    traps: 'Siła hasła nie rozwiązuje problemu tożsamości. Wolne logowanie to UX, nie ryzyko audytowe. Limit znaków hasła to polityka haseł, nie główny problem shared account.',
    audit: 'Pytaj: „Czy admini mają konta imienne?” Sprawdź logi — czy da się powiązać akcję z osobą. Rekomendacja: imienne konta + MFA + PAM z nagrywaniem sesji.',
  },
  mfa: {
    why: 'SMS OTP jest podatny na SIM swap i przechwycenie — najsłabszy czynnik. FIDO2/klucz sprzętowy jest phishing-resistant. TOTP lepszy od SMS; push z numerem lepszy od gołego SMS.',
    traps: 'FIDO2 i TOTP to silniejsze opcje — nie „najmniej bezpieczne”. Push z numerem nadal lepszy od SMS, choć ma ryzyko MFA fatigue.',
    audit: 'Raport enforcement MFA (100% kont?), lista wyjątków z akceptacją i terminem. Dla adminów wymagaj FIDO2/TOTP, nie SMS. Sprawdź ochronę przed MFA fatigue.',
  },
  pam: {
    why: 'Vaulting w PAM przechowuje hasła poza zasięgiem admina i rotuje je po sesji — admin nie zna hasła root/DA, więc nie może go wyciec ani użyć poza sesją.',
    traps: 'MFA to uwierzytelnianie, nie vaulting. RBAC to role, SSO to federacja — żadne nie zastępuje PAM dla kont uprzywilejowanych.',
    audit: 'Czy wszystkie konta DA/root/serwisowe przechodzą przez PAM? Czy sesje są nagrywane i przeglądane? Czy JIT działa (dostęp na godziny, nie na stałe)?',
  },
  iam: {
    why: 'HR jest źródłem prawdy o zatrudnieniu — kto jest zatrudniony, zwolniony, zmienił stanowisko. IAM na tej podstawie robi joiner-mover-leaver w AD i aplikacjach.',
    traps: 'AD odzwierciedla dostęp, nie status zatrudnienia — może być nieaktualny. Excel admina i konto AD jako źródło = ręczne błędy i zombie konta.',
    audit: 'Porównaj listę aktywnych z HR z kontami w AD/SaaS (XLOOKUP). Konta bez pracownika = zombie. Sprawdź automatyzację provisioning vs ręczne tickety.',
  },

  'iso-27001': {
    why: 'SoA (Statement of Applicability) dokumentuje, które kontrole z Annex A ISO 27001 organizacja stosuje, które pomija i dlaczego — powiązane z risk assessmentem, nie checklistą na ślepo.',
    traps: 'Raport finansowy, polityka haseł czy lista pracowników to inne artefakty ISMS — nie zastępują SoA. SoA bez uzasadnienia pominięć kontroli = słabe ISMS.',
    audit: 'SoA + rejestr ryzyk muszą być spójne: każda kontrola w SoA ma uzasadnienie ryzykiem. Sprawdź, czy ISMS żyje (audyty wewnętrzne, management review z decyzjami).',
  },
  'iso-27002': {
    why: 'ISO 27002 to przewodnik „jak wdrożyć” kontrole z Annex A — materiał referencyjny, nie standard certyfikowalny. Certyfikuje się na ISO 27001.',
    traps: '27001 = wymagania ISMS (certyfikowalny). 27002 = dobre praktyki implementacji. Polityka HR i „wymóg prawny UE” — błędne kategorie.',
    audit: 'Używaj 27002 jako benchmarku skuteczności kontroli przy ocenie i rekomendacjach — np. jak wdrożyć A.5.17 authentication zgodnie z 27002.',
  },
  'nist-csf': {
    why: 'NIST CSF 2.0 dodał funkcję Govern — nadzór, polityka, role, kultura ryzyka — obok Identify, Protect, Detect, Respond, Recover. Bez Govern reszta jest orphan.',
    traps: 'Identify, Protect, Recover istniały wcześniej — nie są „nowe” w 2.0. Govern to właśnie nowość w wersji 2.0.',
    audit: 'Mapuj kontrole klienta na 6 funkcji CSF. Brak Govern (polityki, role, apetyt na ryzyko) = luka strategiczna, nie tylko techniczna.',
  },
  cobit: {
    why: 'COBIT łączy cele biznesowe z celami IT i procesami (EDM/APO/BAI/DSS/MEA) — framework governance IT od ISACA, nie pentest ani księgowość.',
    traps: 'Penetracja to security testing. Hardware i księgowość to inne domeny. COBIT ocenia dojrzałość procesów IT w skali 0–5.',
    audit: 'Użyj COBIT, by pokazać zarządowi: luka procesowa (np. brak DSS05) → wpływ na cel biznesowy (zaufanie klienta do danych).',
  },
  'cis-controls': {
    why: 'CIS Controls to konkretna lista zabezpieczeń (18 kontroli v8: inwentaryzacja, MFA, logi…) z poziomami IG1–IG3 — praktyczne „co zrobić”, nie tylko „co osiągnąć”.',
    traps: 'To nie wymóg prawny UE ani polisa ubezpieczeniowa. Standard księgowy (IFRS) to inna dziedzina. CIS uzupełnia NIST CSF i ISO mapowaniem.',
    audit: 'Szybki test higieny: Control 1 inwentaryzacja, Control 5 MFA, Control 6 logi. Brak Control 1 = reszta kontroli stoi na słabych fundamentach.',
  },
  soc2: {
    why: 'SOC 2 Type II testuje operating effectiveness kontroli przez okres (zwykle 6–12 mies.) — audytor CPA weryfikuje, czy kontrole działały, nie tylko czy istnieją w designie.',
    traps: 'Type I = design na jeden dzień — słabszy dowód dla klientów enterprise. Ceny i zadowolenie pracowników nie są przedmiotem SOC 2 (TSC: Security, Availability…).',
    audit: 'Przy vendor due diligence wymagaj Type II, nie tylko Type I. Czytaj wyjątki (exceptions) w raporcie — „mamy SOC 2” bez czytania to iluzja.',
  },
  'pci-dss': {
    why: 'PCI DSS obowiązuje każdego w łańcuchu przetwarzania danych kart — merchant, processor, host — nie tylko banki. Zakres (Level 1–4) zależy od wolumenu transakcji.',
    traps: '„Tylko banki” — e-commerce też. „Tylko poza UE” — globalny standard kart. „Tylko sektor publiczny” — dotyczy prywatnych firm przyjmujących karty.',
    audit: 'Mapuj CDE (Cardholder Data Environment), segmentację sieci, czy CVV nie jest przechowywane, quarterly ASV scans, MFA na dostęp do CDE.',
  },
  'gdpr-rodo': {
    why: 'RODO art. 33: administrator zgłasza naruszenie ochrony danych osobowych do UODO bez zbędnej zwłoki, jeśli może naruszyć prawa osób — deadline 72h od stwierdzenia.',
    traps: 'Brak notyfikacji „bo niskie ryzyko” wymaga udokumentowanej oceny — nie domyślnego milczenia. „Do końca roku” i „tylko na żądanie” to błędy compliance.',
    audit: 'W audycie IT sprawdź: procedura IR z timeline 72h, szablony notyfikacji UODO/osób, rejestr czynności, DPA z podwykonawcami (art. 28), retencja danych.',
  },

  'ai-governance': {
    why: 'Publiczny ChatGPT może przetwarzać dane poza kontrolą organizacji — ryzyko wycieku poufnych informacji, IP i naruszenia RODO (transfer, brak umowy powierzenia).',
    traps: 'To nie jest poprawna praktyka ani wymóg EU AI Act (akt reguluje systemy AI, nie zabrania ChatGPT). „Bez znaczenia” ignoruje realne incydenty shadow AI.',
    audit: 'Sprawdź politykę akceptowalnego użycia AI, allowlistę narzędzi, DLP blokujące wklejanie poufnych. Inwentaryzuj przypadki użycia AI w organizacji.',
  },
  'privacy-by-design': {
    why: 'Privacy by Design (RODO art. 25) wbudowuje ochronę prywatności od fazy projektu: minimalizacja danych, domyślne ustawienia chroniące, pseudonimizacja, retencja — nie „dodatek RODO na końcu”.',
    traps: 'DLP to narzędzie, nie zasada projektowa. Antyspam to inna dziedzina. Dodanie ochrony po wdrożeniu to antywzorzec PbD.',
    audit: 'Przy nowym systemie pytaj o DPIA, minimalizację pól, retencję, RBAC, szyfrowanie — czy były w wymaganiach przed go-live, nie w backlogu „kiedyś”.',
  },
  'ai-in-audit': {
    why: 'AI w audycie wspiera analizę (anomalie, streszczenia, drafty) — audytor weryfikuje każdy wynik (human-in-the-loop). Halucynacje i błędne flagi są realne.',
    traps: 'Solo AI bez weryfikacji narusza standardy profesjonalne. Wklejanie danych klienta do publicznego LLM to wyciek. AI nie zastępuje podpisanego raportu audytora.',
    audit: 'Dokumentuj, gdzie AI pomogło. Weryfikuj oflagowane transakcje ręcznie. Używaj enterprise/ on-prem LLM z DPA dla danych klienta, nie publicznego chatu.',
  },

  'excel-basics-audit': {
    why: 'XLOOKUP/INDEX-MATCH łączy listę dostępów z aktywnymi pracownikami HR. ISNA/IFERROR flaguje konta bez dopasowania — klasyczne „zombie” (dostęp bez zatrudnienia).',
    traps: 'SUMA nie łączy zbiorów. Sam pivot agreguje, ale nie robi anti-join z HR. Warunkowe formatowanie dat nie znajdzie brakujących pracowników.',
    audit: 'Workflow: kopia danych źródłowych → XLOOKUP(login, HR!A:A, „AKTYWNY”, „BRAK”) → filtruj BRAK → to populacja do ustalenia access management. Dokumentuj metodykę.',
  },
};

export function getRichQuizExplain(lessonId, fallback) {
  const rich = QUIZ_RICH_EXPLAINS[lessonId];
  if (rich) return rich;
  if (typeof fallback === 'string' && fallback.trim()) {
    return { why: fallback.trim() };
  }
  if (fallback && typeof fallback === 'object') return fallback;
  return { why: '' };
}
