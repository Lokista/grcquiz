/**
 * Pro-słowa ze ściągi — losuj zestaw, ćwicz jedno zdanie w kontekście case’u.
 */

export const PRO_WORDS = [
  {
    id: 'pw-evidence',
    term: 'evidence',
    meaning: 'Weryfikowalny artefakt, że kontrola działała w okresie.',
    caseHint: 'access review / offboarding',
    good: 'Proszę o evidence: ticket, approval i eksport ról z timestampem — bez tego nie potwierdzam operating effectiveness.',
    traps: [
      'Evidence to to samo co deklaracja managera na Teams.',
      'Wystarczy, że klient powie „mamy kontrolę”.',
      'Evidence zbieram dopiero po final report.',
    ],
  },
  {
    id: 'pw-finding',
    term: 'finding',
    meaning: 'Ustalenie: condition, criteria, cause, risk, recommendation (+ management response).',
    caseHint: 'konto aktywne po odejściu',
    good: 'Opiszę finding: condition w próbce, criteria z polityki, cause procesu, risk unauthorized access i recommendation z ownerem.',
    traps: [
      'Finding to luźna uwaga bez kryterium.',
      'Finding piszę zanim poproszę o dodatkowe evidence przy wyjątku.',
      'Finding zawsze zamykam deklaracją klienta.',
    ],
  },
  {
    id: 'pw-residual',
    term: 'residual risk',
    meaning: 'Ryzyko po istniejących kontrolach; porównujesz z apetytem; treatment dokumentuje risk owner.',
    caseHint: 'po wdrożeniu MFA+PAM',
    good: 'Po MFA i PAM oceniam residual risk i porównuję z apetytem — jeśli wyższe, mitigate albo formalny accept risk ownera.',
    traps: [
      'Residual risk liczę przed kontrolami.',
      'Po kontrolach residual zawsze wynosi zero.',
      'Audytor sam akceptuje residual bez risk ownera.',
    ],
  },
  {
    id: 'pw-design',
    term: 'design effectiveness',
    meaning: 'Czy kontrola jest dobrze zaprojektowana (polityka/proces).',
    caseHint: 'polityka MFA istnieje',
    good: 'Design effectiveness wygląda OK — polityka wymaga MFA; teraz testuję operating na próbce kont.',
    traps: [
      'Design = to samo co operating effectiveness.',
      'Skoro polityka jest, nie muszę testować działania.',
      'Design oceniam tylko po ustnej deklaracji.',
    ],
  },
  {
    id: 'pw-operating',
    term: 'operating effectiveness',
    meaning: 'Czy kontrola faktycznie działała w okresie (próba + evidence).',
    caseHint: 'access review',
    good: 'Sprawdzam operating effectiveness na próbce: raport review, podpisy i tickety revoku w okresie audytu.',
    traps: [
      'Wystarczy zielony status „backup successful”.',
      'Operating oceniam bez próbki i timestampów.',
      'Operating to tylko istnienie polityki.',
    ],
  },
  {
    id: 'pw-pbc',
    term: 'request list / PBC',
    meaning: 'Provided By Client — lista dowodów do dostarczenia.',
    caseHint: 'start engagementu',
    good: 'Po walkthrough wysyłam request list (PBC): tickety, logi, eksporty i approvale potrzebne do testów.',
    traps: [
      'PBC to lista rekomendacji remediacji.',
      'Request list robię dopiero po final findingach.',
      'Na PBC wystarczy jeden screenshot bez daty.',
    ],
  },
  {
    id: 'pw-control-owner',
    term: 'control owner',
    meaning: 'Właściciel konkretnej kontroli (design + evidence).',
    caseHint: 'Change Management',
    good: 'Najpierw ustalam control ownera Change — od niego biorę politykę, tickety i wyjaśnienia wyjątków.',
    traps: [
      'Control owner to zawsze „całe IT”.',
      'Ownera nie potrzebuję, wystarczy zakres systemu.',
      'Control owner = process owner zawsze ta sama osoba.',
    ],
  },
  {
    id: 'pw-process-owner',
    term: 'process owner',
    meaning: 'Właściciel procesu end-to-end (inicjacja → monitoring).',
    caseHint: 'offboarding',
    good: 'Ustalam process ownera offboardingu (HR/IAM), żeby zrozumieć przepływ i gdzie powstaje evidence.',
    traps: [
      'Process owner nie jest potrzebny przy ITGC.',
      'Wystarczy rozmawiać tylko z developerem.',
      'Process owner zastępuje control ownera w findingu.',
    ],
  },
  {
    id: 'pw-sample',
    term: 'testuję próbkę',
    meaning: 'Nie testujesz wszystkiego — próba wg metodyki/seniora; pass / exception / need more evidence.',
    caseHint: '25 leaverów',
    good: 'Biorę próbkę 25 leaverów i dla każdego porównuję politykę, dane z systemu, approval i timestamp.',
    traps: [
      'Zawsze testuję 100% populacji ręcznie.',
      'Przy wyjątku od razu final finding bez dopytania.',
      'Próbkę wybieram tylko z kont, które klient wskaże jako „OK”.',
    ],
  },
  {
    id: 'pw-compensating',
    term: 'compensating control',
    meaning: 'Kontrola częściowo łagodząca lukę — nie kasuje findingu, może obniżyć severity.',
    caseHint: 'brak MFA, jest monitoring',
    good: 'Monitoring logowań to compensating control do czasu MFA — odnotowuję go, ale finding o braku MFA zostaje.',
    traps: [
      'Compensating control zawsze zamyka finding jako pass.',
      'Przy high na płatnościach compensating zawsze wystarcza.',
      'Compensating = to samo co residual risk acceptance.',
    ],
  },
  {
    id: 'pw-deficiency',
    term: 'control deficiency',
    meaning: 'Brak kontroli, zły design albo brak działania w praktyce.',
    caseHint: 'polityka 24h disable, 4/25 aktywne po 2 tyg.',
    good: 'To control deficiency: design mówi 24h, operating pokazuje konta aktywne po 2 tygodniach.',
    traps: [
      'Deficiency tylko gdy w ogóle nie ma polityki.',
      'Jeden wyjątek nigdy nie jest deficiency.',
      'Deficiency nie wymaga recommendation.',
    ],
  },
  {
    id: 'pw-likelihood-impact',
    term: 'likelihood / impact',
    meaning: 'Prawdopodobieństwo i wpływ — składowe risk score.',
    caseHint: 'brak MFA adminów płatności',
    good: 'Dla adminów płatności bez MFA oceniam wysoki impact (fraud) i podnoszę likelihood przy phishingu — stąd risk score high.',
    traps: [
      'Wystarczy sama likelihood bez impactu.',
      'Impact liczę tylko jako karę RODO, ignorując reputację i transakcje.',
      'Likelihood/impact nie łączę z threat i vulnerability.',
    ],
  },
  {
    id: 'pw-verify',
    term: 'weryfikuję / potwierdzam dowodami',
    meaning: 'Nie zgadujesz; opierasz się na artefaktach.',
    caseHint: 'klient mówi „działa”',
    good: 'Nie biorę deklaracji za pass — weryfikuję i potwierdzam dowodami z systemu i ticketów.',
    traps: [
      'Weryfikacja = szybkie zgadywanie na rozmowie.',
      'Dowody ustne seniora klienta zawsze wystarczą.',
      'Jak nie wiem, zmyślam framework.',
    ],
  },
  {
    id: 'pw-escalate',
    term: 'eskaluję',
    meaning: 'Gdy brak zgody / blokada evidence — senior/manager + dokumentacja stanowiska.',
    caseHint: 'klient nie zgadza się z findingiem',
    good: 'Wysłucham, poproszę o dodatkowe evidence; jeśli bez zmian — omawiam z seniorem i dokumentuję management response.',
    traps: [
      'Eskaluję natychmiast bez rozmowy z klientem.',
      'Usuwam finding pod naciskiem, żeby nie eskalować.',
      'Eskalacja = kłótnia na spotkaniu.',
    ],
  },
  {
    id: 'pw-identify-risk',
    term: 'identyfikuję ryzyko',
    meaning: 'Łączysz threat × vulnerability → wpływ na cele biznesowe.',
    caseHint: 'hotfix bez approvala',
    good: 'Identyfikuję ryzyko: nieautoryzowana zmiana w płatnościach może dać fraud lub awarię — stąd high.',
    traps: [
      'Ryzyko = samo zagrożenie (threat).',
      'Identyfikuję ryzyko dopiero w final PDF bez wcześniejszej analizy.',
      'Ryzyko opisuję bez wpływu biznesowego.',
    ],
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Losuj n słów z 4 opcjami zdania (1 good + 3 traps). */
export function dealProWords(n = 5) {
  return shuffle(PRO_WORDS).slice(0, n).map((w) => {
    const options = shuffle([
      { id: 'good', text: w.good, correct: true },
      ...w.traps.map((t, i) => ({ id: `t${i}`, text: t, correct: false })),
    ]);
    return { ...w, options };
  });
}
