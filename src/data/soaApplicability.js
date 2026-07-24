/**
 * SoA applicability — Statement of Applicability (ISO 27001).
 * Include / Exclude + justify.
 */

export const SOA_DECISIONS = [
  { id: 'include', label: 'Include', tip: 'Kontrola w zakresie ISMS — wdrażamy / utrzymujemy' },
  { id: 'exclude', label: 'Exclude', tip: 'Poza zakresem — wymaga uzasadnienia (nie „bo wygodnie”)' },
];

export const SOA_CASES = [
  {
    id: 'soa-mfa',
    control: 'A.8.5 — Secure authentication (MFA / silne uwierzytelnianie)',
    context: 'ISMS obejmuje corp Microsoft 365 + VPN do ERP. Są remote workers.',
    correct: 'include',
    justifyOk: [
      'Remote access i cloud w scope — MFA jest adekwatne do ryzyka.',
      'Kontrola mapuje się na zidentyfikowane ryzyko nieautoryzowanego dostępu.',
    ],
    justifyBad: [
      'Exclude bo MFA jest drogie.',
      'Exclude bo „u nas nikt nie atakuje”.',
    ],
    explain: 'Access remote/cloud w scope → include. Koszt nie jest uzasadnieniem exclude.',
  },
  {
    id: 'soa-cctv',
    control: 'A.7.4 — Physical security monitoring (np. CCTV)',
    context: 'Firma 100% cloud, brak własnych serwerowni; biuro shared WeWork (ochrona budynku + karty).',
    correct: 'exclude',
    justifyOk: [
      'Brak własnych obszarów zabezpieczanych; physical security u landlorda / cloud provider (CUEC).',
      'Ryzyka physical dla własnego DC nie istnieją w scope — monitoring landlorda + clear desk.',
    ],
    justifyBad: [
      'Exclude bez uzasadnienia.',
      'Include i udajemy że mamy kamery w WeWork których nie kontrolujemy jako ISMS control owner.',
    ],
    explain: 'Exclude OK przy braku assetów physical + uzasadnienie i zależności od trzeciej strony.',
  },
  {
    id: 'soa-crypto',
    control: 'A.8.24 — Use of cryptography',
    context: 'Przetwarzacie dane osobowe klientów w SaaS; TLS + szyfrowanie at-rest u providera w umowie.',
    correct: 'include',
    justifyOk: [
      'Wymagane przez ryzyko poufności i umowy/RODO — polityka crypto + weryfikacja konfiguracji.',
      'Include: egzekwujemy TLS1.2+, KMS u cloud, zakaz własnych słabych algorytmów.',
    ],
    justifyBad: [
      'Exclude bo cloud „sam szyfruje” — bez włączenia kontroli w SoA i weryfikacji.',
      'Exclude bo nie mamy HSM on-prem.',
    ],
    explain: 'Nawet w cloud crypto policy + verification = include (część CUEC/provider assurance).',
  },
  {
    id: 'soa-secure-dev',
    control: 'A.8.25 — Secure development life cycle',
    context: 'Firma tylko odsprzedaje gotowy produkt white-label; zero własnego kodu / pipeline.',
    correct: 'exclude',
    justifyOk: [
      'Brak działalności development w scope ISMS; ryzyko SDLC u vendora produktu (TPRM).',
      'Exclude z uzasadnieniem: no in-house software development; vendor SDLC assessed.',
    ],
    justifyBad: [
      'Exclude mimo że macie wewnętrzny zespół budujący aplikacje mobilne.',
      'Include „na papierze” bez procesu — gorsze niż uczciwy exclude.',
    ],
    explain: 'Exclude tylko gdy naprawdę nie ma dev; jeśli jest jakikolwiek kod własny → include.',
  },
  {
    id: 'soa-logging',
    control: 'A.8.15 — Logging',
    context: 'ISMS scope: produkcyjne API + IdP. Macie SIEM, ale retention 3 dni „bo drogo”.',
    correct: 'include',
    justifyOk: [
      'Include z wymaganym retention zgodnym z ryzykiem/regulacją; 3 dni to luka OE do naprawienia, nie exclude.',
      'Kontrola w SoA + finding na retention — nie wyrzucamy logowania ze scope.',
    ],
    justifyBad: [
      'Exclude bo retencja jest krótka.',
      'Exclude bo SIEM jest w chmurze.',
    ],
    explain: 'Słabe wykonanie ≠ exclude. Include + remediate retention.',
  },
  {
    id: 'soa-malware',
    control: 'A.8.7 — Protection against malware',
    context: 'Corp laptops + VDI; BYOD do poczty zabronione polityką.',
    correct: 'include',
    justifyOk: [
      'Endpointy w scope — EDR/AV + web filtering + restrict install.',
      'Include mapped to malware risk on managed devices.',
    ],
    justifyBad: [
      'Exclude bo „używamy tylko Chromebooków” (a macie też Windowsy).',
      'Exclude bo antivirus spowalnia.',
    ],
    explain: 'Standard include dla endpointów w scope.',
  },
  {
    id: 'soa-supplier',
    control: 'A.5.19 — Information security in supplier relationships',
    context: 'Korzystacie z 40 SaaS, w tym payroll i IdP.',
    correct: 'include',
    justifyOk: [
      'TPRM obowiązkowy przy critical suppliers — include + tiering.',
      'Include: due diligence, contracts, SOC review, CUEC.',
    ],
    justifyBad: [
      'Exclude bo „ufamy big tech”.',
      'Exclude bo za dużo vendorów do ogarnięcia.',
    ],
    explain: 'Supplier control practically zawsze include w nowoczesnym ISMS.',
  },
  {
    id: 'soa-home-cabling',
    control: 'A.7.x — physical cabling security (przykład kontroli stricte facility)',
    context: '100% remote, brak biur i DC; sprzęt to laptops szyfrowane + MDM.',
    correct: 'exclude',
    justifyOk: [
      'Brak własnej infrastruktury kablowej w scope; ryzyka physical przesunięte na endpoint + home working policy.',
      'Exclude justified: no owned facilities; compensating A.6/A.8 endpoint controls.',
    ],
    justifyBad: [
      'Include i generujemy fałszywe evidence „inspekcji kabli” których nie ma.',
      'Exclude wszystkich A.7 bez uzasadnienia per kontrola.',
    ],
    explain: 'Exclude konkretnych physical controls OK; unikaj ślepego „exclude całego Annex A”.',
  },
  {
    id: 'soa-backup',
    control: 'A.8.13 — Information backup',
    context: 'Krytyczne dane w SaaS z native backup + własny export tygodniowy do immutable storage.',
    correct: 'include',
    justifyOk: [
      'Include: polityka backup/RTO/RPO + test restore (SaaS + własne kopie).',
      'Nawet przy SaaS responsibility matrix — kontrola backup w SoA i CUEC.',
    ],
    justifyBad: [
      'Exclude bo „SaaS robi backup”.',
      'Exclude bo nigdy nie było awarii.',
    ],
    explain: 'Backup/availability zawsze w grze przy krytycznych danych — include.',
  },
  {
    id: 'soa-pentest',
    control: 'A.8.29 — Security testing in development and acceptance (uproszczenie)',
    context: 'Budujecie publiczne API fintech; CI/CD własny.',
    correct: 'include',
    justifyOk: [
      'Include: SAST/DAST/dependency scan + periodowy pentest przed major release.',
      'Kontrola testów bezpieczeństwa jest adekwatna do ryzyka API.',
    ],
    justifyBad: [
      'Exclude bo pentest jest drogi — bez alternative testing.',
      'Exclude bo „mamy WAF”.',
    ],
    explain: 'Własny development high-risk → include security testing.',
  },
];

export function scoreSoa(caseItem, decision, justifyId) {
  const decOk = decision === caseItem.correct;
  const goodIds = caseItem.justifyOk.map((_, i) => `ok-${i}`);
  const badIds = caseItem.justifyBad.map((_, i) => `bad-${i}`);
  const justifyOk = goodIds.includes(justifyId);
  let pct = 0;
  if (decOk) pct += 50;
  if (justifyOk) pct += 50;
  return { pct, decOk, justifyOk, perfect: decOk && justifyOk, goodIds, badIds };
}

export function soaJustifyOptions(caseItem) {
  const opts = [
    ...caseItem.justifyOk.map((label, i) => ({ id: `ok-${i}`, label, good: true })),
    ...caseItem.justifyBad.map((label, i) => ({ id: `bad-${i}`, label, good: false })),
  ];
  // deterministic shuffle by id string
  return opts.sort((a, b) => a.id.localeCompare(b.id)).reverse();
}
