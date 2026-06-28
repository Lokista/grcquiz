import { L } from '../shape.js';

// Frameworki i regulacje.
export const FRAMEWORKS_LESSONS = [
  L({
    id: 'iso-27001',
    topicKey: 'frameworks',
    title: 'ISO 27001',
    minutes: 7,
    definition: `ISO 27001 określa wymagania dla systemu zarządzania bezpieczeństwem informacji (ISMS). To standard certyfikowalny: klauzule 4–10 (kontekst, przywództwo, planowanie, wsparcie, działanie, ocena wyników, doskonalenie) + Annex A (zbiór kontroli). Wymaga risk assessmentu, SoA (Statement of Applicability), polityk, audytów wewnętrznych i management review.`,
    example: `Organizacja certyfikuje się na ISO 27001: musi pokazać rejestr ryzyk, SoA (które kontrole z Annex A stosuje i dlaczego), politykę bezpieczeństwa, wyniki audytów wewnętrznych i protokół management review z decyzjami. Certyfikat wydaje jednostka akredytowana po audycie Stage 1 + Stage 2.`,
    interviewAnswer: `ISO 27001 określa wymagania dla systemu zarządzania bezpieczeństwem informacji (ISMS). To standard certyfikowalny — klauzule 4–10 plus Annex A (kontrole). Wymaga risk assessmentu, SoA (Statement of Applicability), polityk, audytów wewnętrznych i management review. W audycie sprawdzam, czy ISMS jest "żywy" (cykl PDCA), a nie tylko dokumentem na półkę.`,
    commonMistakes: [
      'Certyfikat traktowany jako cel, nie ciągłe doskonalenie.',
      'SoA oderwane od rejestru ryzyk (kontrole bez uzasadnienia).',
      'Brak audytów wewnętrznych lub brak ich niezależności.',
      'Management review bez decyzji i zasobów.',
    ],
    quiz: {
      question: 'SoA (Statement of Applicability) w ISO 27001 to:',
      options: ['Lista kontrolerów z Annex A, które organizacja stosuje i dlaczego', 'Raport finansowy', 'Polityka haseł', 'Lista pracowników'],
      correct: 0,
      explain: 'SoA to uzasadniony wybór kontroli z Annex A — które stosuje organizacja, które pomija i dlaczego, z odniesieniem do risk assessmentu.',
    },
  }),

  L({
    id: 'iso-27002',
    topicKey: 'frameworks',
    title: 'ISO 27002',
    minutes: 5,
    definition: `ISO 27002 pokazuje dobre praktyki wdrażania kontroli — to przewodnik "jak" realizować kontrole z Annex A ISO 27001. Nie jest certyfikowalny sam w sobie; jest materiałem referencyjnym. Obejmuje domeny: polityki, organizacja, ludzie, fizyczne, zarządzanie tożsamością i dostępem, kryptografia, operacje, komunikacja, dostawcy, rozwój systemów, zaopatrzenie, gotowość na incydenty.`,
    example: `ISO 27001 wymaga kontroli A.5.17 (authentication info). ISO 27002 tłumaczy, jak tę kontrolę wdrożyć: MFA, polityka haseł, nie dzielenie się hasłem, revok przy kompromitacji. Auditor używa 27002 jako źródła dobrych praktyk przy ocenie skuteczności.`,
    interviewAnswer: `ISO 27002 pokazuje dobre praktyki wdrażania kontroli — jest przewodnikiem "jak" realizować kontrole z Annex A ISO 27001. Nie jest certyfikowalny sam w sobie, jest materiałem referencyjnym. Auditor używa go jako źródła dobrych praktyk przy ocenie skuteczności kontroli i projektowaniu rekomendacji.`,
    commonMistakes: [
      'Mieszanie 27001 (wymagania, certyfikowalny) z 27002 (praktyki, referencyjny).',
      'Traktowanie 27002 jako checklisty do odhaczenia bez kontekstu ryzyka.',
      'Brak odniesienia kontroli do 27001 Annex A / SoA.',
    ],
    quiz: {
      question: 'ISO 27002 jest:',
      options: ['Standardem certyfikowalnym jak 27001', 'Przewodnikiem dobrych praktyk wdrażania kontroli (referencyjnym)', 'Polityką HR', 'Wymogiem prawnym UE'],
      correct: 1,
      explain: '27002 to materiał referencyjny — dobre praktyki dla kontroli z Annex A 27001. Certyfikuje się na 27001, nie 27002.',
    },
  }),

  L({
    id: 'nist-csf',
    topicKey: 'frameworks',
    title: 'NIST CSF',
    minutes: 6,
    definition: `NIST Cybersecurity Framework pomaga zarządzać cyberbezpieczeństwem przez funkcje Govern, Identify, Protect, Detect, Respond i Recover (wersja 2.0 dodała Govern). Każda funkcja ma kategorie i podkategorie (wyniki). Nie jest certyfikowalny; to elastyczna struktura do oceny dojrzałości i priorytetyzacji. Często używany z profilem "current" vs "target".`,
    example: `Mapowanie: Identify (inwentaryzacja aktywów), Protect (MFA, szkolenia, patch), Detect (SIEM, logi), Respond (procedura IR), Recover (backup/DR), Govern (polityka, role). Ocena dojrzałości 1–5 per kategoria pokazuje luki i plan rozwoju.`,
    interviewAnswer: `NIST CSF pomaga zarządzać cyberbezpieczeństwem przez funkcje Govern, Identify, Protect, Detect, Respond i Recover. Każda funkcja ma kategorie i podkategorie (wyniki). Nie jest certyfikowalny — to elastyczna struktura do oceny dojrzałości i priorytetyzacji (profil current vs target). Używam go, by pokazać zarządowi, gdzie są luki i co najpierw wdrożyć.`,
    commonMistakes: [
      'Pomijanie funkcji Govern (dodana w 2.0).',
      'Traktowanie CSF jako checklisty bez profilu current/target.',
      'Mapowanie tylko części funkcji (np. sam Protect).',
    ],
    quiz: {
      question: 'Która funkcja została dodana w NIST CSF 2.0?',
      options: ['Identify', 'Govern', 'Recover', 'Protect'],
      correct: 1,
      explain: 'NIST CSF 2.0 dodał funkcję Govern (nadzór, polityka, role) obok Identify/Protect/Detect/Respond/Recover.',
    },
  }),

  L({
    id: 'cobit',
    topicKey: 'frameworks',
    title: 'COBIT',
    minutes: 5,
    definition: `COBIT skupia się na governance i zarządzaniu IT — to framework ISACA łączący cele biznesowe z celami IT i procesami. Definiuje domeny: Evaluate-Direct-Monitor (EDM), Align-Plan-Organise (APO), Build-Acquire-Implement (BAI), Deliver-Service-Support (DSS), Monitor-Evaluate-Assess (MEA). Daje macierz celów biznesowych ↔ celów IT ↔ procesów i metryk.`,
    example: `Zarząd chce "zwiększyć zaufanie klientów do danych". COBIT mapuje to na cel IT "zapewnić bezpieczeństwo informacji" i procesy DSS05 (zarządzanie bezpieczeństwem) z metrykami (liczba incydentów, czas reakcji). Auditor używa COBIT do oceny dojrzałości procesów IT w skali 0–5.`,
    interviewAnswer: `COBIT skupia się na governance i zarządzaniu IT — łączy cele biznesowe z celami IT i procesami (domeny EDM/APO/BAI/DSS/MEA). Daje macierz celów biznesowych ↔ celów IT ↔ procesów z metrykami. W audycie używam COBIT do oceny dojrzałości procesów IT (skala 0–5) i pokazania, jak luki procesowe wpływają na cele biznesowe.`,
    commonMistakes: [
      'Traktowanie COBIT jako standardu bezpieczeństwa (to governance IT).',
      'Stosowanie bez mapowania na cele biznesowe.',
      'Pomijanie metryk i oceny dojrzałości.',
    ],
    quiz: {
      question: 'COBIT przede wszystkim służy do:',
      options: ['Governance i zarządzania IT (cele biznesowe ↔ IT ↔ procesy)', 'Penetracji systemów', 'Zakupu hardware', 'Księgowości'],
      correct: 0,
      explain: 'COBIT to framework governance IT — łączy cele biznesowe z celami IT i procesami, ocenia dojrzałość procesów.',
    },
  }),

  L({
    id: 'cis-controls',
    topicKey: 'frameworks',
    title: 'CIS Controls',
    minutes: 5,
    definition: `CIS Controls to praktyczna lista najważniejszych zabezpieczeń (wersja 8 ma 18 kontroli, m.in. inwentaryzacja aktywów, zarządzanie danymi, bezpieczna konfiguracja, zarządzanie dostępem, MFA, logowanie, zarządzanie incydentami). To konkrety — co zrobić, nie tylko co osiągnąć. Często mapowane do NIST CSF i ISO 27001. IG1/IG2/IG3 — poziomy wdrożenia wg dojrzałości.`,
    example: `CIS Control 1: inwentaryzacja wszystkich urządzeń. Control 4: bezpieczna konfiguracja. Control 6: logi i alerty. Control 5: MFA. Auditor sprawdza pokrycie CIS Controls jako szybki test podstawowej higieny — bez inwentaryzacji trudno łatać i chronić.`,
    interviewAnswer: `CIS Controls to praktyczna lista najważniejszych zabezpieczeń (18 kontroli w v8: inwentaryzacja, bezpieczna konfiguracja, MFA, logowanie, zarządzanie incydentami). To konkretne działania, nie tylko cele. Poziomy wdrożenia IG1/IG2/IG3 odpowiadają dojrzałości. Używam ich jako szybkiego testu podstawowej higieny bezpieczeństwa.`,
    commonMistakes: [
      'Próba wdrożenia wszystkiego naraz bez priorytetyzacji IG.',
      'Pomijanie Control 1 (inwentaryzacja) — bez niej inne kontroli słabiej działają.',
      'Brak mapowania CIS do NIST CSF/ISO.',
    ],
    quiz: {
      question: 'CIS Controls to przede wszystkim:',
      options: ['Wymóg prawny UE', 'Praktyczna lista konkretnych zabezpieczeń do wdrożenia', 'Polisa ubezpieczeniowa', 'Standard księgowy'],
      correct: 1,
      explain: 'CIS Controls to konkretna lista zabezpieczeń (co zrobić), z poziomami IG1–IG3. Praktyczne uzupełnienie ramowych frameworków.',
    },
  }),

  L({
    id: 'soc2',
    topicKey: 'frameworks',
    title: 'SOC 2',
    minutes: 6,
    definition: `SOC 2 to raport AICPA oceniający kontrole w usługach chmurowych wg Trust Services Criteria: Security, Availability, Processing Integrity, Confidentiality, Privacy. Dwa typy: Type I (design na dany dzień) i Type II (operating effectiveness w okresie, zwykle 6–12 mies.). Wykonuje audytor CPA; wynikiem raport dla klientów (często pod NDA).`,
    example: `Dostawca SaaS przechodzi SOC 2 Type II: audytor testuje przez 6 mies. kontrole dostępu, zmian, backupu, monitoringu. Raport pokazuje, które kontrole działają i czy były wyjątki. Klienci enterprise wymagają SOC 2 przed zakupem.`,
    interviewAnswer: `SOC 2 to raport AICPA oceniający kontrole w usługach chmurowych wg Trust Services Criteria: Security, Availability, Processing Integrity, Confidentiality, Privacy. Type I ocenia design na dany dzień; Type II — operating effectiveness w okresie (zwykle 6–12 mies.). Wykonuje audytor CPA. Klienci enterprise często wymagają SOC 2 Type II od dostawców SaaS.`,
    commonMistakes: [
      'Mieszanie SOC 1 (kontrole finansowe) z SOC 2 (TSC).',
      'Traktowanie Type I jako dowodu skuteczności (to tylko design).',
      'Brak uświadomienia, że SOC 2 to raport, nie certyfikat.',
    ],
    quiz: {
      question: 'SOC 2 Type II ocenia:',
      options: ['Design kontroli na dany dzień', 'Operating effectiveness kontroli w okresie', 'Ceny usług', 'Zadowolenie pracowników'],
      correct: 1,
      explain: 'Type II testuje skuteczność działania kontroli w okresie (np. 6–12 mies.). Type I ocenia tylko design na jeden dzień.',
    },
  }),

  L({
    id: 'pci-dss',
    topicKey: 'frameworks',
    title: 'PCI DSS',
    minutes: 6,
    definition: `PCI DSS to standard bezpieczeństwa danych kart płatniczych (Payment Card Industry Data Security Standard), wymagany przez organizacje kartowe (Visa, Mastercard). Dotyczy każdego, kto przetwarza/przechowuje/przekazuje dane kart. Wymagania: sieci chronione, MFA, szyfrowanie transmisji, program antywirusowy, monitorowanie, testy bezpieczeństwa, polityka. Niezgodność = kary i ryzyko utraty możliwości przyjmowania kart.`,
    example: `E-commerce przechowuje numery kart → musi być zgodny z PCI DSS: segmentacja sieci CDE (Cardholder Data Environment), szyfrowanie TLS, nie przechowuj CVV, logi, skany quarterly ASV, roczny audyt QSA (dla wyższych poziomów).`,
    interviewAnswer: `PCI DSS to standard bezpieczeństwa danych kart płatniczych, wymagany przez organizacje kartowe. Dotyczy każdej organizacji przetwarzającej/przechowującej/przekazującej dane kart. Wymagania obejmują m.in. segmentację CDE, MFA, szyfrowanie, monitorowanie, skany i audyty (ASV/QSA). Niezgodność grozi karami i utratą możliwości przyjmowania płatności kartami.`,
    commonMistakes: [
      'Mylzenie zakresu — dane kart mogą być w wielu systemach (shadow).',
      'Przechowywanie CVV (zabronione po autoryzacji).',
      'Brak segmentacji CDE (cała sieć w zakresie audytu).',
      'Pomijanie skanów quarterly i audytu rocznego.',
    ],
    quiz: {
      question: 'PCI DSS obowiązuje:',
      options: ['Tylko banki', 'Każdego przetwarzającego/przechowującego/przekazującego dane kart', 'Tylko firmy spoza UE', 'Tylko sektor publiczny'],
      correct: 1,
      explain: 'PCI DSS dotyczy każdej organizacji w łańcuchu płatności kartą, niezależnie od wielkości — zakres zależy od liczby transakcji (poziomy).',
    },
  }),

  L({
    id: 'gdpr-rodo',
    topicKey: 'frameworks',
    title: 'GDPR / RODO',
    minutes: 7,
    definition: `RODO (GDPR) to unijne rozporządzenie o ochronie danych osobowych. Kluczowe zasady: legalność i przejrzystość, minimalizacja, celowość, ograniczenie przechowywania, integralność i poufność. Prawa osób: dostęp, sprostowanie, usunięcie, ograniczenie, przenoszenie, sprzeciw. Obowiązki administratora: zgody, DPIA, rejestr czynności, notyfikacja UODO 72h, ZISD, umowa powierzenia (DPA). Kary do 4% rocznego obrotu.`,
    example: `Wyciek bazy klientów: ocena ryzyka dla praw osób → jeśli wysokie, notyfikacja UODO w 72h i komunikat do osób. DPIA wymagane przy wysokim ryzyku (np. monitoring, profilowanie). Umowa z dostawcą chmury = DPA (art. 28). Privacy by Design wbudowane w projekt systemu.`,
    interviewAnswer: `RODO to unijne rozporządzenie o ochronie danych osobowych. Kluczowe zasady: legalność, minimalizacja, celowość, ograniczenie przechowywania, integralność i poufność. Prawa osób: dostęp, sprostowanie, usunięcie, sprzeciw. Obowiązki: zgody, DPIA, rejestr czynności, notyfikacja UODO 72h, ZISD, DPA z podwykonawcami. Kary do 4% obrotu. W audycie IT sprawdzam techniczne kontrole wspierające RODO (szyfrowanie, dostęp, retencja, logi).`,
    commonMistakes: [
      'Brak notyfikacji UODO w 72h przy wycieku (przekroczenie terminu).',
      'Brak DPIA przy wysokiego-ryzyka przetwarzaniu.',
      'Brak DPA z dostawcą (art. 28).',
      'Pomijanie retencji danych (przechowywanie "na zawsze").',
    ],
    quiz: {
      question: 'Przy naruszeniu bezpieczeństwa danych osobowych notyfikacja UODO:',
      options: ['Nie jest wymagana', 'Bez zbędnej zwłoki, nie później niż 72h', 'Do końca roku', 'Tylko jeśli klient zażąda'],
      correct: 1,
      explain: 'RODO art. 33: zgłoszenie do UODO bez zbędnej zwłoki, nie później niż 72h od stwierdzenia naruszenia (chyba że niskie ryzyko dla praw osób).',
    },
  }),
];
