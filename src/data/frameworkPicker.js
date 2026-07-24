/**
 * Framework picker — ten sam fakt mapujesz na frameworki ze ściągi (różnice).
 * Źródło: FRAMEWORKI - ROZNICE + opisy ISO/NIST/COBIT/CIS/PCI/RODO/NIS2.
 */

export const FRAMEWORKS = [
  {
    id: 'iso27001',
    label: 'ISO 27001',
    oneLiner: 'ISMS — governance, ryzyka, SoA, audyty, ciągłe doskonalenie; certyfikowalny.',
  },
  {
    id: 'iso27002',
    label: 'ISO 27002',
    oneLiner: 'Praktyczny przewodnik kontroli (jak wdrożyć access, logging, backup, IR…).',
  },
  {
    id: 'nist',
    label: 'NIST CSF',
    oneLiner: 'Cykl cyber: Govern → Identify → Protect → Detect → Respond → Recover.',
  },
  {
    id: 'cobit',
    label: 'COBIT',
    oneLiner: 'Governance i management IT — czy IT wspiera cele biznesowe i ma role/metryki.',
  },
  {
    id: 'cis',
    label: 'CIS Controls',
    oneLiner: 'Praktyczna checklista higieny (inventory, MFA, logging, backup…).',
  },
  {
    id: 'pci',
    label: 'PCI DSS',
    oneLiner: 'Dane kart płatniczych — CDE, szyfrowanie, segmentacja, access, monitoring.',
  },
  {
    id: 'rodo',
    label: 'RODO / GDPR',
    oneLiner: 'Dane osobowe — legalność, minimalizacja, retencja, privacy by design, prawa osób.',
  },
  {
    id: 'nis2',
    label: 'NIS2',
    oneLiner: 'Regulacja UE: cyber risk management, incident reporting, supply chain, odpowiedzialność managementu.',
  },
];

export const FRAMEWORK_CASES = [
  {
    id: 'fc-no-mfa-admin',
    fact: 'Administratorzy systemu płatności w banku nie mają MFA.',
    prompt: 'Zaznacz frameworki, które naturalnie mapujesz na ten fakt (i jak — w głowie: kryterium / faza / higiena / regulacja).',
    correctIds: ['iso27001', 'iso27002', 'nist', 'cis', 'nis2'],
    explain: {
      iso27001: 'ISMS / access control w SoA i risk assessment — luka w kontroli dostępu.',
      iso27002: 'Praktyka wdrożenia MFA / privileged access.',
      nist: 'Protect (i Detect, jeśli brak monitoringu logowań).',
      cis: 'Account management / MFA — higiena CIS.',
      nis2: 'Cyber risk management + odpowiedzialność managementu za dostęp do krytycznych usług.',
      cobit: 'Można (governance dostępu), ale nie pierwszy „naturalny” hit jak CIS/NIST/ISO.',
      pci: 'Tylko jeśli w scope są dane kart — tu fakt mówi o płatnościach, ale nie wprost o CHD.',
      rodo: 'Pośrednio (bezpieczeństwo danych), ale fakt jest o admin MFA, nie o legalności przetwarzania.',
    },
    // correct = primary mappings ze ściągi; cobit/pci/rodo jako dystraktory „możliwe ale nie core”
    primaryIds: ['iso27001', 'iso27002', 'nist', 'cis', 'nis2'],
  },
  {
    id: 'fc-vendor-no-dpa',
    fact: 'SaaS z danymi klientów banku startuje bez DPA i bez SOC2/ISO.',
    prompt: 'Które frameworki/regulacje są tu kluczowe?',
    correctIds: ['rodo', 'nis2', 'iso27001'],
    explain: {
      rodo: 'DPA / powierzenie — dane osobowe klientów.',
      nis2: 'Supply chain security + management accountability.',
      iso27001: 'Supplier security / risk w ISMS, evidence (SOC2/ISO) w due diligence.',
      pci: 'Jeśli SaaS przetwarza dane kart — tak; fakt nie mówi wprost o CHD.',
      cis: 'Higiena wewnętrzna, nie umowa DPA.',
      nist: 'Govern/Identify third party — wspierająco.',
      cobit: 'Governance vendorów — wspierająco.',
      iso27002: 'Supplier controls — praktyka, ale rdzeń to RODO+NIS2+ISMS.',
    },
    primaryIds: ['rodo', 'nis2', 'iso27001'],
  },
  {
    id: 'fc-backup-no-restore',
    fact: 'Backup ma logi success, nigdy nie było restore testu; RTO/RPO tylko na papierze.',
    prompt: 'Co mapujesz?',
    correctIds: ['iso27001', 'iso27002', 'nist', 'cis'],
    explain: {
      iso27001: 'Availability / continuity w ISMS — recoverability.',
      iso27002: 'Jak robić backup i testy odtworzenia.',
      nist: 'Recover (+ Protect dla kopii).',
      cis: 'Backup — pozycja higieny; test restore potwierdza skuteczność.',
      nis2: 'Ciągłość / cyber risk — wspierająco.',
      rodo: 'Dostępność danych osobowych — pośrednio.',
      pci: 'Jeśli CDE — tak; fakt ogólny.',
      cobit: 'Operations / continuity governance — wspierająco.',
    },
    primaryIds: ['iso27001', 'iso27002', 'nist', 'cis'],
  },
  {
    id: 'fc-card-data',
    fact: 'E-commerce przechowuje numery kart w bazie aplikacji sklepu (brak segmentacji CDE).',
    prompt: 'Który framework jest tu „pierwszym wyborem” + co jeszcze?',
    correctIds: ['pci', 'iso27001', 'nist'],
    explain: {
      pci: 'Rdzeń — cardholder data, segmentacja, access, monitoring.',
      iso27001: 'ISMS i risk dla danych wrażliwych płatności.',
      nist: 'Protect/Detect w cyklu cyber.',
      rodo: 'Jeśli karty powiązane z osobami — tak, ale PCI jest specjalizacją kart.',
      cis: 'Higiena, nie zastępuje PCI.',
      nis2: 'Jeśli podmiot objęty — cyber risk, ale PCI jest wprost o kartach.',
      cobit: 'Governance IT — wspierająco.',
      iso27002: 'Praktyki kontroli — wspierająco przy PCI controls.',
    },
    primaryIds: ['pci', 'iso27001', 'nist'],
  },
  {
    id: 'fc-incident-late',
    fact: 'Incydent P1 kanału mobilnego: ticket po 90 min, brak RCA i lessons learned.',
    prompt: 'Mapowanie frameworków:',
    correctIds: ['nist', 'iso27001', 'iso27002', 'nis2'],
    explain: {
      nist: 'Detect / Respond / Recover — słaba faza Respond.',
      iso27001: 'Incident management w ISMS, continuous improvement.',
      iso27002: 'Jak prowadzić IR, RCA, komunikację.',
      nis2: 'Incident reporting / cyber risk management — opóźniona reakcja.',
      cis: 'Monitoring/alerting jako higiena — wspierająco.',
      cobit: 'Incident/Problem management processes.',
      rodo: 'Jeśli naruszenie danych osobowych — osobny tor notyfikacji.',
      pci: 'Jeśli CDE — IR requirements; fakt nie precyzuje CHD.',
    },
    primaryIds: ['nist', 'iso27001', 'iso27002', 'nis2'],
  },
  {
    id: 'fc-saas-start',
    fact: 'Firma SaaS 50 osób pyta: „Od czego zacząć formalnie bezpieczeństwo?”',
    prompt: 'Według różnic ze ściągi — sensowny zestaw startowy (nie wszystko naraz):',
    correctIds: ['iso27001', 'cis', 'nist'],
    explain: {
      iso27001: 'Ramy ISMS / ryzyka / SoA — „co trzeba mieć”.',
      cis: 'Szybka higiena operacyjna na start.',
      nist: 'Uporządkowanie cyklu Govern→Recover dla zarządu.',
      cobit: 'Gdy trzeba mocniej governance IT vs cele biznesowe.',
      pci: 'Tylko jeśli karty.',
      rodo: 'Jeśli dane osobowe — obowiązkowo równolegle, ale to regulacja nie „start ISMS”.',
      nis2: 'Jeśli podmiot objęty dyrektywą.',
      iso27002: 'Wsparcie „jak” przy wdrażaniu kontroli z SoA.',
    },
    primaryIds: ['iso27001', 'cis', 'nist'],
  },
];

export function frameworksByIds(ids) {
  return FRAMEWORKS.filter((f) => ids.includes(f.id));
}
