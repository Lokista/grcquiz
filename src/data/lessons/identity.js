import { L } from '../shape.js';

// Identity & Access.
export const IDENTITY_LESSONS = [
  L({
    id: 'active-directory',
    topicKey: 'identity',
    title: 'Active Directory',
    minutes: 7,
    definition: `Active Directory (AD) to usługa katalogowa Microsoft zarządzająca tożsamościami, grupami i dostępem w domenie. Kluczowe obiekty: użytkownicy, grupy, OU, GPO. Dostęp nadawany przez członkostwo w grupach (role). W audycie sprawdzamy: konta administratorów (Domain Admins, Enterprise Admins), konta serwisowe, polityki haseł, GPO, zaufania między domenami, krbtgt (klucz po ataku).`,
    example: `Audyt AD: lista Domain Admins = 40 kont (za dużo — powinno być kilka). Konta serwisowe z hasłami niezmienianymi od 2 lat. Brak LAPS na endpointach (lokalni adminowie z tym samym hasłem). GPO wyłączające zaporę. Konta wyłączone, ale nie usunięte.`,
    interviewAnswer: `Active Directory to katalogowa usługa Microsoft zarządzająca tożsamościami i dostępem przez grupy i GPO. W audycie sprawdzam: liczebność grup uprzywilejowanych (Domain/Enterprise Admins), konta serwisowe (stare hasła, brak RBAC), polityki haseł, LAPS na endpointach, zaufania między domenami i stan krbtgt po ewentualnym incydencie. Każde nadmiarowe konto admin = zwiększona powierzchnia ataku.`,
    commonMistakes: [
      'Za dużo kont w Domain Admins (powinno być kilka).',
      'Konta serwisowe z niezmienianymi hasłami i bez RBAC/gMSA.',
      'Brak LAPS — ten sam lokalny admin na wszystkich endpointach.',
      'Konta wyłączone, ale nie usunięte (kradzież konta).',
    ],
    quiz: {
      question: 'Podczas audytu AD 40 kont jest w Domain Admins. To:',
      options: ['Poprawna praktyka', 'Zbyt dużo — powinno być kilka, to zwiększa powierzchnię ataku', 'Wymóg regulacyjny', 'Bez znaczenia'],
      correct: 1,
      explain: 'Domain Admins to najwyższy przywilej — powinno być minimalnie kont, używanych tylko do zadań admin domeny. 40 = nadmiar i ryzyko.',
    },
  }),

  L({
    id: 'shared-admin-accounts',
    topicKey: 'identity',
    title: 'Współdzielone konta administratora',
    minutes: 6,
    definition: `Współdzielone konto admina to jedno konto używane przez wiele osób. Problemem jest brak rozliczalności — jeśli kilka osób używa jednego konta, nie da się jednoznacznie ustalić, kto wykonał daną zmianę. Rekomendacją są osobne konta imienne, MFA, monitoring działań i PAM.`,
    example: `Wszyscy adminowie logują się kontem "Administrator". W logach: "Administrator usunął bazę". Kto? Nie wiadomo. Po incydencie brak rozliczalności. Rekomendacja: osobne konta admin (j.kowalski-admin), MFA, PAM z sesjami nagrywanymi, logi powiązane z człowiekiem.`,
    interviewAnswer: `Problemem współdzielonego konta administratora jest brak rozliczalności. Jeśli kilka osób używa jednego konta, nie da się jednoznacznie ustalić, kto wykonał daną zmianę. Rekomendacją są osobne konta imienne, MFA, monitoring działań i PAM z sesjami nagrywanymi i just-in-time access. To przywraca accountability i ogranicza nadużycia.`,
    commonMistakes: [
      'Jedno konto "Administrator" dla całego zespołu.',
      'Hasło współdzielone znane wielu osobom, bez rotacji przy odejściu.',
      'Brak MFA na koncie współdzielonym.',
      'Traktowanie wygody jako usprawiedliwienia braku rozliczalności.',
    ],
    quiz: {
      question: 'Głównym problemem współdzielonego konta administratora jest:',
      options: ['Zbyt silne hasło', 'Brak rozliczalności (nie wiadomo, kto działał)', 'Zbyt wolne logowanie', 'Brak limitu znaków hasła'],
      correct: 1,
      explain: 'Brak rozliczalności — kilka osób na jednym koncie uniemożliwia ustalenie sprawcy działań w logach. Rozwiązanie: konta imienne + MFA + PAM.',
    },
  }),

  L({
    id: 'mfa',
    topicKey: 'identity',
    title: 'MFA (Multi-Factor Authentication)',
    minutes: 5,
    definition: `MFA to uwierzytelnianie wieloskładnikowe: coś, co wiesz (hasło) + coś, co masz (token/telefon) + coś, co jesteś (biometria). Drastycznie obniża ryzyko przejęcia konta przez phishing/credential stuffing. Kontrole wokół MFA: enforcement dla 100% użytkowników (nie tylko admin), rejestrowane wyjątki, ochrona przed MFA fatigue i phishing-resistant (FIDO2).`,
    example: `Klasyfikacja MFA od najsłabszej: SMS OTP (przejęcie SIM swap) < push bez numeru < push z numerem < TOTP app < FIDO2/klucz sprzętowy. Audytor: raport 100% kont z MFA, lista wyjątków z akceptacją i terminem, alerty o "MFA fatigue" (wiele odrzuconych push).`,
    interviewAnswer: `MFA to uwierzytelnianie wieloskładnikowe — hasło plus drugi czynnik (token, telefon, biometria). Drastycznie obniża ryzyko przejęcia konta. W audycie sprawdzam enforcement (100% kont, w tym adminowie), jakość czynnika (FIDO2 > TOTP > SMS), zarządzanie wyjątkami i ochronę przed MFA fatigue/phishing. SMS uznaję za najsłabszy czynnik.`,
    commonMistakes: [
      'MFA tylko dla adminów, pomijanie zwykłych użytkowników.',
      'SMS jako jedyny czynnik (SIM swap).',
      'Wyjątki od MFA bez akceptacji, terminu i kompensacji.',
      'Brak ochrony przed MFA fatigue (brak limitu push/numeru).',
    ],
    quiz: {
      question: 'Najmniej bezpieczny drugi czynnik MFA to:',
      options: ['Klucz sprzętowy FIDO2', 'TOTP w aplikacji', 'SMS OTP', 'Push z numerem'],
      correct: 2,
      explain: 'SMS jest podatny na SIM swap i przejęcie. FIDO2/klucz sprzętowy jest phishing-resistant i najsilniejszy.',
    },
  }),

  L({
    id: 'pam',
    topicKey: 'identity',
    title: 'PAM (Privileged Access Management)',
    minutes: 6,
    definition: `PAM to zarządzanie dostępem uprzywilejowanym: kontrola, monitorowanie i rejestrowanie sesji administratorów. Funkcje: vaulting haseł (hasła nie znane adminowi, rotowane po użyciu), just-in-time access (elwatowany dostęp na czas zadania), sesje nagrywane, komendy na allowlist/blocklist, MFA przed każdym elwacją. Klucz dla kont Domain Admin, root, serwisowych.`,
    example: `Bez PAM: admin ma hasło roota do 50 serwerów, zawsze. Z PAM: admin loguje się do PAM, autoryzuje MFA, dostaje JIT dostęp do jednego serwera na 1h, sesja nagrana, hasło rotowane po sesji. W logach: kto, kiedy, jakie komendy.`,
    interviewAnswer: `PAM to zarządzanie dostępem uprzywilejowanym: vaulting haseł (nieznanych adminowi, rotowanych po użyciu), just-in-time access, nagrywanie sesji i allowlist komend, MFA przed elwacją. Klucz dla kont root/Domain Admin/serwisowych. W audycie sprawdzam pokrycie (czy wszystkie konta uprzywilejowane przechodzą przez PAM), czy sesje są nagrywane i przeglądane, i czy hasła są rotowane.`,
    commonMistakes: [
      'PAM wdrożone, ale tylko dla części kont uprzywilejowanych.',
      'Sesje nagrywane, ale nikt ich nie przegląda.',
      'Brak JIT — elwatowany dostęp dostępny stale.',
      'Hasła nie rotowane po użyciu (vaulting bez rotacji).',
    ],
    quiz: {
      question: 'Hasło rotowane po każdej sesji i nieznane adminowi to funkcja:',
      options: ['MFA', 'PAM (vaulting)', 'RBAC', 'SSO'],
      correct: 1,
      explain: 'Vaulting z rotacją haseł to rdzeń PAM — admin dostaje dostęp, ale nie zna hasła, a po sesji hasło się zmienia.',
    },
  }),

  L({
    id: 'iam',
    topicKey: 'identity',
    title: 'IAM (Identity & Access Management)',
    minutes: 6,
    definition: `IAM to zestaw procesów i technologii zarządzających tożsamością i dostępem w całym cyklu życia: provisioning, autentykacja, autoryzacja, federacja (SSO/SAML/OIDC), governance (access review, SoD), audyt. Łączy AD, systemy HR (źródło prawdy o zatrudnieniu), aplikacje SaaS i PAM. Celem jest prawidłowa osoba, właściwy dostęp, właściwy czas.`,
    example: `IAM joins HR → AD → aplikacje: nowy pracownik w HR triggeruje provisioning w AD i SaaS. Odejście w HR triggeruje offboarding. Access review automatycznie identyfikuje nadmiarowe uprawnienia i konflikty SoD. SSO (SAML) eliminuje lokalne hasła w aplikacjach.`,
    interviewAnswer: `IAM to zestaw procesów i technologii zarządzających tożsamością i dostępem w cyklu życia: provisioning, autentykacja, autoryzacja, federacja (SSO/SAML), governance (access review, SoD) i audyt. Integruje HR jako źródło prawdy, AD, aplikacje i PAM. W audycie sprawdzam, czy IAM automatyzuje provisioning/offboarding (nie ręcznie), czy są access review i wykrywanie konfliktów SoD.`,
    commonMistakes: [
      'Provisioning ręczny, zsynchronizowany z HR tylko częściowo (zombie konta).',
      'Brak governance — brak access review i wykrywania SoD.',
      'Lokalne hasła w aplikacjach mimo SSO.',
      'Brak jednego źródła prawdy o zatrudnieniu (HR vs IT rozjazd).',
    ],
    quiz: {
      question: 'Źródłem prawdy o zatrudnieniu w dojrzałym IAM powinien być:',
      options: ['System HR', 'Active Directory', 'Excel administratora', 'Konto administratora AD'],
      correct: 0,
      explain: 'HR jest źródłem prawdy o zatrudnieniu; IAM na tej podstawie provisionuje/odbiera dostęp w AD i aplikacjach (joiner-mover-leaver).',
    },
  }),
];
