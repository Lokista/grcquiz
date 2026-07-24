/**
 * „Co powiesz managerowi?” — kalibracja tonu na rozmowie / w exit meeting.
 * soft = za miękka (bagatelizuje), harsh = za twarda (oskarża / absolutyzuje),
 * pro = profesjonalna (fakt → ryzyko → impact → next step).
 */

export const TONE_OPTIONS = [
  { id: 'soft', label: 'Za miękka', tip: 'Bagatelizuje, unika jasnego wniosku' },
  { id: 'pro', label: 'Profesjonalna', tip: 'Fakt → ryzyko → wpływ → rekomendacja' },
  { id: 'harsh', label: 'Za twarda', tip: 'Oskarża osoby, absolutyzuje, bez dowodu' },
];

export const MANAGER_CASES = [
  {
    id: 'mt-leaver',
    context: 'Exit meeting z IT Managerem. Masz dowód: 3 leaverów z Enabled AD po SLA.',
    prompt: 'Która wypowiedź jest właściwa?',
    options: [
      {
        id: 'soft',
        text: '„Może warto kiedyś spojrzeć na offboarding, ale ogólnie pewnie jest OK — ludzie bywają zajęci.”',
      },
      {
        id: 'pro',
        text: '„W próbie 3/25 leaverów pozostało aktywnych w AD powyżej SLA 24h. Ryzyko: nieautoryzowany dostęp po odejściu. Proszę o populację Q2, root cause i plan domknięcia z ownerem oraz terminem.”',
      },
      {
        id: 'harsh',
        text: '„Wasze IAM jest kompletnie zepsute, ktoś tu ewidentnie nie pracuje — to przecież podstawy, każdy junior by to ogarnął.”',
      },
    ],
    correct: 'pro',
    explain: 'Pro: konkretna miara, ryzyko, jasny request. Soft rozmywa; harsh atakuje ludzi zamiast procesu.',
  },
  {
    id: 'mt-emergency',
    context: 'Hotfix bez formalnego approval; jest tylko „verbal OK”.',
    prompt: 'Jak to zakomunikujesz?',
    options: [
      {
        id: 'harsh',
        text: '„Łamiecie change policy — to niedopuszczalne i natychmiast raportuję do zarządu jako fraud.”',
      },
      {
        id: 'pro',
        text: '„CHG-8841 wszedł na prod bez udokumentowanego approval (tylko verbal). Dla High-risk change potrzebujemy śladu: kto zatwierdził, kiedy, oraz PIR. Czy możemy uzupełnić retrospective approval i sprawdzić inne emergency w okresie?”',
      },
      {
        id: 'soft',
        text: '„No nic się nie stało, skoro działa, to spoko — nie będę czepiał o papiery.”',
      },
    ],
    correct: 'pro',
    explain: 'Nie eskalujesz „fraud” bez podstaw; nie odpuszczasz kontroli. Prosi o domknięcie evidence i populację.',
  },
  {
    id: 'mt-sod',
    context: 'Developer = deployer; management mówi „u nas tak musi być, jesteśmy mali”.',
    prompt: 'Najlepsza odpowiedź?',
    options: [
      {
        id: 'pro',
        text: '„Rozumiem constraint zespołu. Konflikt SoD develop/deploy zwiększa ryzyko nieautoryzowanej zmiany. Możliwe ścieżki: risk acceptance z compensating (np. mandatory peer release + monitoring) albo rozdzielenie ról. Którą opcję wybieracie i jak ją udokumentujemy?”',
      },
      {
        id: 'soft',
        text: '„OK, skoro tak u Was jest, to nie finding — małe firmy są wyjątkiem od SoD.”',
      },
      {
        id: 'harsh',
        text: '„Albo rozdzielicie role do piątku, albo to Critical i koniec dyskusji.”',
      },
    ],
    correct: 'pro',
    explain: 'Profesjonalnie uznajesz realność, ale nie kasujesz ryzyka — oferujesz akceptowalne opcje kontroli.',
  },
  {
    id: 'mt-soc',
    context: 'Vendor SOC 2 qualified; Twój klient nie zaktualizował vendor RA.',
    prompt: 'Co mówisz risk ownerowi?',
    options: [
      {
        id: 'soft',
        text: '„MACIE SOC, więc vendor jest green — nic nie trzeba robić.”',
      },
      {
        id: 'harsh',
        text: '„Korzystacie z niebezpiecznego vendora, to Wasza wina jeśli będzie wyciek.”',
      },
      {
        id: 'pro',
        text: '„SOC jest qualified (m.in. access review exceptions). Bez aktualnego vendor RA i pokrycia CUEC residual risk po naszej stronie jest niejasny. Propozycja: zaktualizować ocenę, zebrać CUEC evidence i decision on acceptance/remediation do daty X.”',
      },
    ],
    correct: 'pro',
    explain: 'SOC ≠ automatyczny green. Pro tłumaczy residual i domyka ownership decyzji.',
  },
  {
    id: 'mt-observation',
    context: 'Znalazłeś tylko literówkę w polityce; kontrole techniczne OK.',
    prompt: 'Jak to podasz?',
    options: [
      {
        id: 'harsh',
        text: '„ISMS jest nieaktualny i niewiarygodny — to poważna luka governance.”',
      },
      {
        id: 'pro',
        text: '„Drobna niespójność nazwy systemu w polityce vs SoA. Nie wpływa na skuteczność kontroli; klasyfikuję jako observation do korekty dokumentacji przy następnym review.”',
      },
      {
        id: 'soft',
        text: '„W ogóle nie wspomnę — szkoda czasu wszystkich.”',
      },
    ],
    correct: 'pro',
    explain: 'Kalibracja materiality: nie pompujesz observation do Critical, ale też nie chowasz drobiazgu jeśli jest w scope komunikacji.',
  },
  {
    id: 'mt-backup',
    context: 'Backup job OK, ale brak restore test od 14 miesięcy.',
    prompt: 'Wypowiedź do Ops Lead?',
    options: [
      {
        id: 'pro',
        text: '„Logi pokazują regularne backupy, jednak nie mamy dowodu restore test w okresie. Bez testu nie potwierdzimy RTO/RPO. Proszę o zaplanowany restore (system, data, wynik) i właściciela procedury.”',
      },
      {
        id: 'soft',
        text: '„Backup się zieleni, więc disaster recovery na pewno działa.”',
      },
      {
        id: 'harsh',
        text: '„Nie macie DR, to oczywiste — przy awarii firma padnie i to przez Was.”',
      },
    ],
    correct: 'pro',
    explain: 'Oddzielasz co jest dowiedzione (job) od czego brakuje (restore) i prosisz o konkretny PBC.',
  },
  {
    id: 'mt-pushback',
    context: 'Manager: „To nie risk, bo nigdy nie było incydentu.”',
    prompt: 'Reakcja?',
    options: [
      {
        id: 'harsh',
        text: '„Brak incydentu nic nie znaczy, nie znacie się na ryzyku.”',
      },
      {
        id: 'soft',
        text: '„Faktycznie, skoro nie było incydentu, wycofuję ustalenie.”',
      },
      {
        id: 'pro',
        text: '„Brak materializacji nie usuwa ryzyka — kontrola ma działać zanim dojdzie do incydentu. Bazujemy na kryterium kontroli i dowodach z okresu. Możemy wspólnie doprecyzować impact i likelihood w Waszym kontekście biznesowym.”',
      },
    ],
    correct: 'pro',
    explain: 'Nie personalizujesz; trzymasz się kryterium i zapraszasz do kalibracji impactu.',
  },
  {
    id: 'mt-sample',
    context: 'W próbce 1/25 late approval; reszta czysta; pytają „to finding High?”.',
    prompt: 'Jak odpowiesz?',
    options: [
      {
        id: 'pro',
        text: '„Na ten moment to pojedyncze odchylenie (exception). Zanim podniosę severity, sprawdzę czy to izolat, czy symptom szerszy — np. rozszerzę próbkę / przejrzę emergency. Propozycja: exception z follow-up, nie od razu High deficiency.”',
      },
      {
        id: 'soft',
        text: '„1 na 25 to nic, ignorujemy całkowicie.”',
      },
      {
        id: 'harsh',
        text: '„1 wystarczy — High, pełny brak change control.”',
      },
    ],
    correct: 'pro',
    explain: 'Profesjonalny audytor kalibruje: exception ≠ automatyczny High; mówi o rozszerzeniu testu.',
  },
];
