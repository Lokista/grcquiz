import { L } from '../shape.js';

// Narzędzia audytora — Excel.
export const TOOLS_LESSONS = [
  L({
    id: 'excel-basics-audit',
    topicKey: 'tools',
    title: 'Excel basics dla audytora',
    minutes: 8,
    definition: `Excel to podstawowe narzędzie audytora do analizy danych klienta. Kluczowe umiejętności: próbkowanie (RAND, RANDBETWEEN, top-N), wyszukiwanie i łączenie zbiorów (VLOOKUP/XLOOKUP, INDEX/MATCH), tabele przestawne (Pivot) do agregacji, warunkowe formatowanie (flagi duplikatów, anomalii), filtrowanie i sortowanie, podstawowe formuły (SUMIFS, COUNTIFS, IF, AND/OR), oraz higiena (nie niszcz danych źródłowych — pracuj na kopii).`,
    example: `Audyt access review: dostajesz 10k wierszy uprawnień. Pivot: liczba kont per rola, per manager. Warunkowe formatowanie: duplikaty kont, konta bez managera. XLOOKUP: połącz z listą aktywnych pracowników z HR — flaguj konta "zombie" (dostęp bez zatrudnienia). COUNTIFS: ile kont admin bez MFA. SUMIFS: suma kwot transakcji weekendowych.`,
    interviewAnswer: `W audycie używam Excela do analizy danych klienta: próbkowania (RAND/RANDBETWEEN, top-N po ryzyku), łączenia zbiorów (XLOOKUP/INDEX-MATCH — np. dostępy vs lista zatrudnionych z HR, by znaleźć konta zombie), tabel przestawnych do agregacji (konta per rola/manager), warunkowego formatowania (duplikaty, anomalie) oraz SUMIFS/COUNTIFS do filtrów ilościowych. Zawsze pracuję na kopii danych źródłowych i dokumentuję metodykę.`,
    commonMistakes: [
      'Edycja danych źródłowych zamiast pracy na kopii (utrata dowodu).',
      'VLOOKUP bez dokładnego dopasowania (FALSE) — fałszywe trafienia.',
      'Brak dokumentacji metodyki — nie odtworzysz, jak powstał wynik.',
      'Próba zrobienia całości w Excelu, gdy dane są za duże (SQL/Python lepszy).',
      'Mieszanie typów danych (liczby jako tekst) → błędne SUM/COUNT.',
    ],
    quiz: {
      question: 'Chcesz znaleźć konta z dostępem, których nie ma na liście aktywnych pracowników HR. Najlepsze:',
      options: ['SUMA', 'XLOOKUP / INDEX-MATCH połączony z ISNA', 'Warunkowe formatowanie dat', 'Pivot sam w sobie'],
      correct: 1,
      explain: 'XLOOKUP/INDEX-MATCH łączy zbiór dostępu z HR; ISNA/IFERROR flaguje konta bez trafienia = "zombie" (dostęp bez zatrudnienia).',
    },
  }),

  L({
    id: 'excel-leaver-analytics',
    topicKey: 'tools',
    title: 'Excel: leavers vs active users',
    minutes: 7,
    definition: `Data analytics w audycie: szukasz wyjątków w danych — HR leavers vs active users, admini bez MFA, zmiany bez ticketu, duplikaty, loginy po odejściu. Excel: Pivot, XLOOKUP/VLOOKUP, COUNTIF/COUNTIFS, filtry. Duplikaty sprawdzasz po employee ID / login / email.`,
    example: `Arkusz A: lista zwolnień HR (employee_id, leave_date). Arkusz B: eksport AD (login, employee_id, enabled, last_logon). XLOOKUP employee_id z A w B → jeśli enabled=TRUE i leave_date < dziś = exception (unauthorized access). COUNTIFS: ile aktywnych po leave_date. Pivot: wyjątki per dział.`,
    interviewAnswer: `Do offboardingu łączę listę HR leavers z eksportem AD przez XLOOKUP/VLOOKUP po employee ID lub loginie. Flaguuję konta enabled po dacie odejścia, liczę COUNTIF/COUNTIFS, Pivotem grupuję wyjątki. Duplikaty loginu/emailu też sprawdzam. To kandydaci do próbki i findingu — nie kończę na samym Excelu bez ticketu/disable evidence.`,
    commonMistakes: [
      'Sam Excel bez request list (ticket, data disable, logi).',
      'Złe klucze join (login vs email) → fałszywe zombie.',
      'Edycja źródła zamiast kopii.',
    ],
    quiz: {
      question: 'HR leave_date = 1.03, AD enabled = TRUE 15.03. To głównie:',
      options: ['Pass kontroli', 'Exception / red flag unauthorized access', 'Dowód MFA', 'Kompensująca kontrola'],
      correct: 1,
      explain: 'Konto aktywne po odejściu = klasyczny wyjątek leaver; dalej: ticket, disable, logi i ewentualny finding.',
    },
  }),
];
