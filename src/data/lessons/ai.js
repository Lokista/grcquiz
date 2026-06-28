import { L } from '../shape.js';

// AI w audycie i privacy.
export const AI_LESSONS = [
  L({
    id: 'ai-governance',
    topicKey: 'ai',
    title: 'AI Governance',
    minutes: 7,
    definition: `AI Governance to zestaw zasad, procesów i kontroli nad ryzykiem związanym z używaniem AI w organizacji. Obejmuje: inwentaryzację przypadków użycia AI, ocenę ryzyka (poufność danych wejściowych, stronniczość, halucynacje, wyjaśnialność), zatwierdzanie zastosowań, monitoring, zgodność z regulacjami (np. EU AI Act). Kluczowe: nie wprowadzać poufnych danych do publicznych LLM bez kontroli.`,
    example: `Pracownik wkleja kod źródłowy i dane klientów do publicznego ChatGPT "żeby pomógł". Ryzyko: wyciek poufnych danych, naruszenie RODO, utrata IP. AI Governance: allowlista zatwierdzonych narzędzi, DLP blokujące wklejanie poufnych, polityka akceptowalnego użycia, ocena ryzyka przed wdrożeniem nowego przypadku.`,
    interviewAnswer: `AI Governance to zasady i kontrole nad ryzykiem używania AI. Obejmuje inwentaryzację zastosowań, ocenę ryzyka (poufność wejść, stronniczość, halucynacje, wyjaśnialność), zatwierdzanie i monitoring. Kluczowe dla audytora: czy organizacja ma politykę akceptowalnego użycia, czy poufne dane nie trafiają do publicznych LLM, i czy AI w procesach krytycznych ma nadzór człowieka (human-in-the-loop) zgodnie z EU AI Act.`,
    commonMistakes: [
      'Brak polityki akceptowalnego użycia AI (shadow AI).',
      'Wklejanie poufnych danych/kodu do publicznych LLM.',
      'Brak oceny ryzyka i zatwierdzania nowych zastosowań.',
      'AI w decyzjach o ludziach bez wyjaśnialności i nadzoru.',
    ],
    quiz: {
      question: 'Pracownik wkleja dane klientów do publicznego ChatGPT. To:',
      options: ['Poprawna praktyka AI Governance', 'Ryzyko wycieku poufnych i naruszenia RODO', 'Wymóg EU AI Act', 'Bez znaczenia'],
      correct: 1,
      explain: 'Wklejanie poufnych danych do publicznych LLM = ryzyko wycieku i naruszenia RODO. AI Governance wymaga allowlisty i DLP.',
    },
  }),

  L({
    id: 'privacy-by-design',
    topicKey: 'ai',
    title: 'Privacy by Design',
    minutes: 6,
    definition: `Privacy by Design to zasada wbudowania ochrony prywatności w projekt systemu od początku, nie jako dodatku. 7 zasad Cavoukian: proaktywność, prywatność domyślna, wbudowanie, pełna funkcjonalność, bezpieczeństwo end-to-end, widoczność/transparentność, poszanowanie prywatności użytkownika. RODO art. 25 czyni to obowiązkiem administratora.`,
    example: `Nowa aplikacja HR: Privacy by Design = minimalizacja (zbieramy tylko potrzebne pola), domyślne ustawienia najwyższej ochrony, szyfrowanie danych, role-based access, pseudonimizacja, retencja zdefiniowana od startu, DPIA przed wdrożeniem. Nie "dodajemy RODO na końcu".`,
    interviewAnswer: `Privacy by Design to zasada wbudowania ochrony prywatności w projekt systemu od początku (RODO art. 25). 7 zasad: proaktywność, prywatność domyślna, wbudowanie, pełna funkcjonalność, bezpieczeństwo end-to-end, transparentność, poszanowanie użytkownika. W praktyce: minimalizacja danych, domyślne ustawienia chroniące, pseudonimizacja, retencja i DPIA już w fazie projektowania.`,
    commonMistakes: [
      'Traktowanie RODO jako dodatku "na końcu" projektu.',
      'Brak minimalizacji (zbieranie danych "na wszelki wypadek").',
      'Domyślne ustawienia niskiej ochrony (opt-in zamiast opt-out).',
      'Brak DPIA przy wysokiego-ryzyka przetwarzaniu.',
    ],
    quiz: {
      question: 'Privacy by Design oznacza przede wszystkim:',
      options: ['Ochronę prywatności dodaną po wdrożeniu', 'Wbudowanie ochrony prywatności od początku projektu', 'Kupno narzędzia DLP', 'Politykę antyspamową'],
      correct: 1,
      explain: 'Privacy by Design = ochrona prywatności projektowana od startu (minimalizacja, domyślna ochrona, pseudonimizacja), nie dodatek po wdrożeniu. RODO art. 25.',
    },
  }),

  L({
    id: 'ai-in-audit',
    topicKey: 'ai',
    title: 'Wykorzystanie AI w audycie',
    minutes: 6,
    definition: `AI w audycie wspiera, nie zastępuje audytora. Zastosowania: analiza dużych zbiorów danych (cała populacja zamiast próbki), wykrywanie anomalii i wzorców (duplicate payments, nietypowe logowania), streszczanie dokumentów i transkrypcji, draft ustaleń i rekomendacji, klasyfikacja ryzyk. Kluczowe: człowiek weryfikuje wyniki (human-in-the-loop), AI nie ocenia solo, a poufne dane klienta są chronione.`,
    example: `Audyt wydatków: AI analizuje 100k transakcji i flaguje anomalie (duplikaty, weekendowe płatności, nietypowi dostawcy) — audytor bada oflagowane, a nie próbkę 50. AI draftuje opis ustalenia z kryterium i rekomendacją; audytor weryfikuje i podpisuje.`,
    interviewAnswer: `AI wspiera audytora, nie zastępuje. Użyłbym go do: analizy pełnej populacji zamiast próbki (duplikaty, anomalie), wykrywania wzorców w logach i transakcjach, streszczania transkrypcji i dokumentów, draftowania ustaleń i rekomendacji. Zasady: human-in-the-loop (audytor weryfikuje), poufne dane klienta chronione, wyniki AI sprawdzam przed użyciem — AI nie ocenia solo i nie generuje ustaleń bez mojej weryfikacji.`,
    commonMistakes: [
      'Zastępowanie audytora AI bez weryfikacji (halucynacje, błędy).',
      'Wklejanie poufnych danych klienta do publicznych LLM.',
      'Brak dokumentacji, że AI pomogło (transparentność metod).',
      'AI jako "czarna skrzynka" — brak wyjaśnialności oflagowań.',
    ],
    quiz: {
      question: 'Złota zasada używania AI w audycie to:',
      options: ['AI ocenia solo bez weryfikacji', 'Human-in-the-loop — audytor weryfikuje wyniki AI', 'AI zastępuje raport audytu', 'Wklejaj wszystkie dane klienta do ChatGPT'],
      correct: 1,
      explain: 'AI wspiera, ale audytor weryfikuje wyniki (human-in-the-loop). Poufne dane klienta chronione, metody udokumentowane.',
    },
  }),
];
