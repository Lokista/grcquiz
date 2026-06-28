# Auditor Quest — gra do nauki IT Audytu

**Edukacyjna gra webowa** do nauki IT Audytu, GRC i rozmowy rekrutacyjnej na stanowisko
**Junior IT Auditor** (style Big4 / EY GDS). Gra uczy **praktycznego myślenia audytora**,
a nie tylko suchych definicji.

Po polsku, ciemny motyw, nowoczesny dashboard w stylu platformy GRC/audit, pełna grywalizacja:
**mapa misji, światy i rozdziały, gwiazdki (1–3), odblokowywanie poziomów, XP, rangi, combo,
wyzwanie dnia, osiągnięcia, konfetti i dźwięk**.

## Jak grać

Jesteś początkującym IT Auditorem i wspinasz się na szczyt kariery. Wybierz **świat** (domenę)
na **Mapie misji**, przechodź misje po kolei i zdobywaj gwiazdki:

- **1 gwiazdka** — misja ukończona
- **2 gwiazdki** — dobry wynik (np. ≥50% w case/egzamin, ≥60% w treningu fiszek)
- **3 gwiazdki** — mistrzostwo (≥80% / poprawna odpowiedź / ≥90% fiszek)

Gwiazdki i XP odblokowują kolejne misje i światy oraz awanse na wyższe rangi
(Stażysta Audytu → Partner GRC). Codzienne **Wyzwanie dnia** daje duże XP i buduje serię dni z rzędu.
**Combo** rośnie przy kolejnych poprawnych odpowiedziach w jednej sesji.

## Tryby

- **Mapa misji (kampania)** — 6 światów (rozdziały) = domeny IT Audytu, łącznie **59 misji**:
  lekcje, treningi fiszek, sytuacje „Myśl jak audytor”, bossowie (case study) i egzaminy (rozmowa).
- **Wyzwanie dnia** — 5 losowych pytań rekrutacyjnych, jedna próba dziennie, duży bonus XP.
- **Osiągnięcia** — 21 odznak (pierwsza gwiazdka, combo x5, seria 7 dni, awans, perfekcyjny rozdział…).
- **Tryb swobodny** — nauka/rozmowa/case/fiszki/myśl jak audytor bez blokad (menu boczne).
- **Statystyki** — poziom, XP, gwiazdki, mastery tematów, słabe tematy, kolejka powtórek.

## Domeny (światy)

Podstawy audytu i ryzyka · Kontrole IT (ITGC/ITAC) · Identity & Access · Frameworki i regulacje ·
AI w audycie i privacy · Narzędzia audytora (Excel).

Zawiera: ITGC, ITAC, risk/threat/vulnerability, asset, likelihood, impact, risk score, residual risk,
risk treatment, Access/Change/Backup/Incident/Patch Management, Logging & Monitoring, SoD, Least Privilege,
Active Directory, shared admin, MFA, PAM, IAM, ISO 27001/27002, NIST CSF, COBIT, CIS Controls, SOC 2, PCI DSS,
RODO, CIA Triad, AI Governance, Privacy by Design, AI w audycie, Excel dla audytora.

## Uruchomienie

```bash
npm install
npm run dev      # http://localhost:5174 (lub kolejny wolny port)
npm run build    # build produkcyjny -> dist/
npm run preview  # podgląd buildu
npm run lint
```

Wymaga Node 18+. Brak backendu — cały postęp zapisuje się w `localStorage` przeglądarki.

## Stack

Vite + React 18 + Tailwind CSS + lucide-react + canvas-confetti. Bez backendu (MVP), deploy jako strona statyczna.

## Struktura (modułowa — łatwa do rozbudowy)

```
src/
  data/                       # treść + definicje gry (zwykłe pliki JS)
    topics.js                 # kategorie/światy
    shape.js                  # helpery L/F/I/C + scoring
    lessons/                  # lekcje pogrupowane domenowo (basics/controls/identity/frameworks/ai/tools)
    interview.js              # pytania rekrutacyjne + karty odpowiedzi (klik/przeciągnij)
    caseStudies.js            # scenariusze case study
    flashcards.js             # fiszki
    scenarios.js              # „Myśl jak audytor”
    missions.js               # kampania: rozdziały → misje + gwiazdki + odblokowywanie
    achievements.js           # definicje odznak + checker
  state/
    progress.js               # czysta logika postępu (XP, rangi, gwiazdki, osiągnięcia, daily, combo)
    ProgressContext.jsx       # provider React + hook + toasty + detekcja awansu/osiągnięć
    MissionContext.jsx        # rozgrywka misji + ekran końcowy (gwiazdki, konfetti, next)
    NavContext.jsx            # prosty router widoków
    selectors.js              # agregaty statystyk + logika misji/rozdziałów
  components/                 # Layout/HUD, QuestMap, AnswerBuilder, ChapterView, DailyChallenge, Achievements, ui
  modules/                    # 5 modułów rozgrywki (wpiętych w useMission)
  utils/
    juice.js                  # konfetti, dźwięk WebAudio, mute, pływające +XP
    markdown.js               # lekki renderer MD
```

## Jak dodawać treść

- **Nowa lekcja:** dopisz `L({...})` w `src/data/lessons/<domena>.js` — automatycznie stanie się misją w kampanii.
- **Nowe pytanie rekrutacyjne:** dopisz `I({...})` w `src/data/interview.js` — trafia do egzaminu tematu.
- **Nowy case study:** dopisz `C({...})` w `src/data/caseStudies.js` — staje się bossem w swoim rozdziale.
- **Nowa fiszka:** dopisz `F({...}) ` w `src/data/flashcards.js` — trafia do treningu tematu.
- **Nowy scenariusz „Myśl jak audytor”:** dopisz obiekt w `src/data/scenarios.js`.
- **Nowy świat/domena:** dodaj obiekt w `src/data/topics.js` i używaj jego `key` w treści.
- **Nowe osiągnięcie:** dopisz definicję w `src/data/achievements.js` z funkcją `check(stats)`.

Misje, rozdziały i odblokowywanie generują się automatycznie z treści — nie trzeba ręcznie budować mapy.

## Jak działa ocena odpowiedzi (rozmowa/egzamin)

**Zero wpisywania** — gracz buduje odpowiedź z kart (klik lub przeciągnij do strefy „Twoja odpowiedź”).
Każde pytanie ma pulę kart: poprawne elementy (`keyPoints`) + dystraktory (typowe błędy, elementy z innych
tematów). Ocena: trafione kluczowe elementy minus kara za błędne karty → procent → gwiazdki.
Działa offline. Po rundzie gra pokazuje idealną odpowiedź słowną (do nauki na rozmowę).

## Sugerowane następne kroki (opcjonalnie)

- Import/eksport postępu JSON + sync między urządzeniami.
- „Tryb egzaminu” z limitem czasu i losowanymi misjami z wielu światów.
- Więcej case studies, pytań i scenariuszy (struktura gotowa — dopisuj obiekty).
- Licznik żyć/energii w wyzwaniu dnia dla dodatkowego napięcia.
