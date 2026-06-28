import { F } from './shape.js';

// Fiszki: pojęcie + definicja + przykład + wersja na rozmowę.
// Aby dodać fiszkę: dopisz F({...}).
export const FLASHCARDS = [
  F({
    id: 'fc-itgc', topicKey: 'controls', term: 'ITGC',
    definition: 'IT General Controls — ogólne kontrole środowiska IT: access, change, backup, incident, patch, monitoring.',
    example: 'Audyt finansowy sprawdza ITGC w ERP, by ufać danym: czy zmiany miały approval, czy dostęp nadawany z akceptacją.',
    interview: 'ITGC to ogólne kontrole IT wspierające wiele systemów i dające fundament zaufania do danych.',
  }),
  F({
    id: 'fc-itac', topicKey: 'controls', term: 'ITAC',
    definition: 'IT Application Controls — kontrole wewnątrz konkretnej aplikacji: walidacja, pola obowiązkowe, workflow akceptacji, auto-wyliczenia, ograniczenia ról.',
    example: 'System HR: walidacja PESEL, salary edytowalne tylko przez HR Manager, akceptacja zmiany wynagrodzenia przez drugą osobę.',
    interview: 'ITAC to kontrole wbudowane w aplikację; opierają się na ITGC (bez Change Management nie ufać im).',
  }),
  F({
    id: 'fc-sod', topicKey: 'controls', term: 'SoD',
    definition: 'Segregation of Duties — rozdzielenie obowiązków tak, by jedna osoba nie kontrolowała całego krytycznego procesu.',
    example: 'Developer ≠ wdrażający na produkcję ≠ audytujący. Finanse: tworzenie dostawcy ≠ akceptacja płatności ≠ księgowanie.',
    interview: 'SoD zmniejsza ryzyko błędów, nadużyć i nieautoryzowanych działań; sprawdzam konflikty narzędziowo.',
  }),
  F({
    id: 'fc-mfa', topicKey: 'identity', term: 'MFA',
    definition: 'Multi-Factor Authentication — hasło + drugi czynnik (token/telefon/biometria). Drastycznie obniża ryzyko przejęcia konta.',
    example: 'FIDO2/klucz sprzętowy > TOTP > SMS (SIM swap). Enforcement 100% kont + zarządzane wyjątki.',
    interview: 'MFA to minimum; jakość czynnika ma znaczenie — SMS najsłabszy, FIDO2 phishing-resistant.',
  }),
  F({
    id: 'fc-pam', topicKey: 'identity', term: 'PAM',
    definition: 'Privileged Access Management — vaulting haseł (rotowane), JIT access, nagrywanie sesji, allowlist komend, MFA przed elwacją.',
    example: 'Admin loguje się do PAM, MFA, dostaje JIT do jednego serwera na 1h, sesja nagrana, hasło rotowane po sesji.',
    interview: 'PAM przywraca rozliczalność dla kont uprzywilejowanych; bez niego shared admin = brak accountability.',
  }),
  F({
    id: 'fc-iam', topicKey: 'identity', term: 'IAM',
    definition: 'Identity & Access Management — procesy i technologie cyklu życia tożsamości: provisioning, autentykacja, autoryzacja, SSO, governance.',
    example: 'HR jako źródło prawdy → provisioning w AD/SaaS; odejście w HR triggeruje offboarding; access review wykrywa SoD.',
    interview: 'IAM automatyzuje joiner-mover-leaver i governance; bez niego ręczne syncing = zombie konta.',
  }),
  F({
    id: 'fc-least-privilege', topicKey: 'controls', term: 'Least Privilege',
    definition: 'Zasada minimalnych uprawnień potrzebnych do zadań — i tylko na czas ich trwania.',
    example: 'Użytkownik: "report viewer" (odczyt); elwatowany dostęp do prod przez PAM JIT, 2h, z powodem i logowaniem.',
    interview: 'Least Privilege = minimum + czasowo; realizuję przez RBAC, access review, PAM/JIT.',
  }),
  F({
    id: 'fc-risk', topicKey: 'basics', term: 'Risk',
    definition: 'Możliwość, że zagrożenie wykorzysta podatność i negatywnie wpłynie na cele; L × I.',
    example: 'Wyciek danych: L=4, I=4 → 16 (wysokie). Po MFA/szkoleniach residual 8.',
    interview: 'Ryzyko to funkcja prawdopodobieństwa i wpływu; oceniam inherent przed kontrolami, residual po.',
  }),
  F({
    id: 'fc-threat', topicKey: 'basics', term: 'Threat',
    definition: 'Zagrożenie — potencjalne działanie/zdarzenie mogące wyrządzić szkodę (atakujący, malware, pożar).',
    example: 'Ransomware jako threat wykorzystuje podatność (brak MFA) → ryzyko utraty danych.',
    interview: 'Threat to "co może uderzyć"; nie myl z risk (skutek) ani vulnerability (słabość).',
  }),
  F({
    id: 'fc-vulnerability', topicKey: 'basics', term: 'Vulnerability',
    definition: 'Podatność — słabość, którą zagrożenie może wykorzystać (brak MFA, niezałatany system, misconfig).',
    example: 'Publiczny S3 bucket = podatność; zagrożenie (atakujący) ją wykorzystuje → ryzyko wycieku.',
    interview: 'Vulnerability to "dziura"; kontrole ją zamykają lub kompensują, obniżając ryzyko.',
  }),
  F({
    id: 'fc-residual-risk', topicKey: 'basics', term: 'Residual Risk',
    definition: 'Ryzyko pozostałe po wdrożeniu kontroli. Nigdy nie zerowe; porównywane z apetytem na ryzyko.',
    example: 'Inherentne 16 → po kontrolach residual 8; apetyt 6 → potrzebny plan dodatkowy lub akceptacja zarządu.',
    interview: 'Residual to co zostaje po kontrolach; jeśli > apetyt → mitigat lub formalna accept z terminem.',
  }),
  F({
    id: 'fc-iso27001', topicKey: 'frameworks', term: 'ISO 27001',
    definition: 'Wymagania dla systemu zarządzania bezpieczeństwem informacji (ISMS). Certyfikowalny; klauzule 4–10 + Annex A.',
    example: 'Certyfikacja wymaga rejestru ryzyk, SoA, polityk, audytów wewnętrznych, management review z decyzjami.',
    interview: 'ISO 27001 to wymagania ISMS (certyfikowalny); 27002 to praktyki. SoA uzasadnia wybór kontroli.',
  }),
  F({
    id: 'fc-iso27002', topicKey: 'frameworks', term: 'ISO 27002',
    definition: 'Dobre praktyki wdrażania kontroli — przewodnik "jak" realizować Annex A ISO 27001. Referencyjny, nie certyfikowalny.',
    example: 'Dla kontroli A.5.17 (auth info) 27002 tłumaczy: MFA, polityka haseł, revok przy kompromitacji.',
    interview: '27002 to materiał referencyjny; auditor używa go jako źródła dobrych praktyk przy ocenie skuteczności.',
  }),
  F({
    id: 'fc-nist-csf', topicKey: 'frameworks', term: 'NIST CSF',
    definition: 'Framework cyberbezpieczeństwa o funkcjach: Govern, Identify, Protect, Detect, Respond, Recover. Nie certyfikowalny.',
    example: 'Profil current vs target pokazuje luki; Govern (2.0) obejmuje politykę, role, nadzór.',
    interview: 'NIST CSF to elastyczna struktura dojrzałości; używam by pokazać zarządowi priorytety.',
  }),
  F({
    id: 'fc-cobit', topicKey: 'frameworks', term: 'COBIT',
    definition: 'Framework governance IT — łączy cele biznesowe z celami IT i procesami (EDM/APO/BAI/DSS/MEA). Ocena dojrzałości 0–5.',
    example: 'Cel "zaufanie klientów do danych" → proces DSS05 (bezpieczeństwo) z metrykami (liczba incydentów).',
    interview: 'COBIT to governance IT, nie sam security; używam do oceny dojrzałości procesów i wpływu na biznes.',
  }),
  F({
    id: 'fc-cis-controls', topicKey: 'frameworks', term: 'CIS Controls',
    definition: 'Praktyczna lista najważniejszych zabezpieczeń (18 w v8): inwentaryzacja, bezpieczna konfiguracja, MFA, logi, IR. Poziomy IG1–IG3.',
    example: 'Control 1: inwentaryzacja urządzeń; bez niej trudno łatać i chronić.',
    interview: 'CIS to konkretne zabezpieczenia (co zrobić), dobre jako szybki test higieny; mapuję do NIST/ISO.',
  }),
  F({
    id: 'fc-soc2', topicKey: 'frameworks', term: 'SOC 2',
    definition: 'Raport AICPA oceniający kontrole usług chmurowych wg Trust Services Criteria: Security, Availability, Processing Integrity, Confidentiality, Privacy.',
    example: 'Type II testuje operating effectiveness w okresie (6–12 mies.); Type I tylko design na dany dzień.',
    interview: 'SOC 2 to raport (nie certyfikat); Type II wymaga enterprise od dostawców SaaS.',
  }),
  F({
    id: 'fc-pci-dss', topicKey: 'frameworks', term: 'PCI DSS',
    definition: 'Standard bezpieczeństwa danych kart płatniczych; dotyczy każdego w łańcuchu płatności. Segmentacja CDE, MFA, szyfrowanie, skany ASV, audyt QSA.',
    example: 'E-commerce: nie przechowuj CVV, segmentuj CDE, szyfruj TLS, skany quarterly, roczny QSA.',
    interview: 'PCI DSS obowiązuje każdego przetwarzającego dane kart; niezgodność = kary, utrata przyjmowania kart.',
  }),
  F({
    id: 'fc-gdpr', topicKey: 'frameworks', term: 'GDPR / RODO',
    definition: 'Unijne rozporządzenie o ochronie danych osobowych. Zasady: minimalizacja, celowość, retencja. Kary do 4% obrotu. Notyfikacja UODO 72h.',
    example: 'Wyciek bazy klientów: ocena ryzyka → notyfikacja UODO 72h + komunikat do osób; DPIA przy monitoring.',
    interview: 'RODO: minimalizacja, DPIA, DPA, notyfikacja 72h, ZISD; w audycie IT sprawdzam kontrole techniczne wspierające.',
  }),
  F({
    id: 'fc-cia-triad', topicKey: 'basics', term: 'CIA Triad',
    definition: 'Confidentiality, Integrity, Availability — trzy fundamenty bezpieczeństwa informacji.',
    example: 'Szyfrowanie = C; sumy kontrolne = I; backup/DR = A. Każdą kontrolę mapuję do celów.',
    interview: 'CIA to podstawa; pytają np. "test restore to który cel?" — Availability.',
  }),
  F({
    id: 'fc-evidence', topicKey: 'basics', term: 'Evidence',
    definition: 'Dowód audytowy — weryfikowalny artefakt potwierdzający, że kontrola działała w okresie. Kompletny, wiarygodny, istotny.',
    example: 'Raport IAM + podpisy managerów + tickety revoku = silny; screenshot bez daty = słaby.',
    interview: 'Bez dowodu kontrola "nie istnieje"; proszę o artefakty, nie deklaracje.',
  }),
  F({
    id: 'fc-control-deficiency', topicKey: 'basics', term: 'Control Deficiency',
    definition: 'Brak lub nieskuteczność kontroli; minor (ograniczona) lub major (systemowa). Wymaga rekomendacji, właściciela, terminu.',
    example: 'Polityka MFA istnieje, ale 3/15 kont bez MFA → deficiency (operating effectiveness).',
    interview: 'Deficiency oceniam jako minor/major; każda ma remediację z ownerem i terminem.',
  }),
  F({
    id: 'fc-remediation-plan', topicKey: 'basics', term: 'Remediation Plan',
    definition: 'Plan naprawy ustalenia: działania, właściciel, termin, weryfikacja skuteczności. Zamykam dowodem, nie deklaracją.',
    example: 'Finding "brak MFA": remediacja — wdrożyć MFA dla 100% do 30 dni, owner Head of IT, weryfikacja raportem MFA.',
    interview: 'Remediation ma ownera, termin i test skuteczności; zamknięcie wymaga dowodu, nie deklaracji.',
  }),
];

export const FLASHCARD_MAP = Object.fromEntries(FLASHCARDS.map((c) => [c.id, c]));

export function flashcardsByTopic(topicKey) {
  return FLASHCARDS.filter((c) => c.topicKey === topicKey);
}

export const FLASHCARDS_PER_TOPIC = (() => {
  const map = {};
  for (const c of FLASHCARDS) {
    map[c.topicKey] = (map[c.topicKey] || 0) + 1;
  }
  return map;
})();

export const FLASHCARD_IDS_PER_TOPIC = (() => {
  const map = {};
  for (const c of FLASHCARDS) {
    if (!map[c.topicKey]) map[c.topicKey] = [];
    map[c.topicKey].push(c.id);
  }
  return map;
})();
