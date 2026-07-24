/**
 * Mock rozmowy 45 min — sekwencja faz ze ściągi (soft → case bankowy → pressure).
 * Moduł tylko orkiestruje istniejące tryby (interview / cases / think).
 */

export const MOCK_INTERVIEW = {
  id: 'mock-45',
  title: 'Mock rozmowy 45 min',
  subtitle: 'Soft → case bankowy → presja (klient / nie wiem)',
  totalMinutes: 45,
  phases: [
    {
      id: 'soft',
      label: 'Faza 1 — Soft skills',
      minutes: 10,
      blurb: 'O sobie / dlaczego GRC / dlaczego bank / co zabezpieczałeś jako FE. Buduj odpowiedzi z kart.',
      action: {
        view: 'interview',
        params: {
          mode: 'run',
          queue: ['iv-about-you', 'iv-why-grc', 'iv-why-bank', 'iv-dev-security'],
          startIndex: 0,
          mockReturn: true,
        },
      },
    },
    {
      id: 'case',
      label: 'Faza 2 — Case bankowy',
      minutes: 25,
      blurb: 'Wybierz jeden boss: offboarding, hotfix płatności, Entra lub vendor. Potem wróć tu.',
      choices: [
        { label: 'Offboarding / leaver', view: 'cases', params: { caseId: 'case-bank-leaver', mockReturn: true } },
        { label: 'Hotfix płatności', view: 'cases', params: { caseId: 'case-bank-hotfix', mockReturn: true } },
        { label: 'Microsoft Entra / M365', view: 'cases', params: { caseId: 'case-entra-bank', mockReturn: true } },
        { label: 'Vendor / DPA', view: 'cases', params: { caseId: 'case-vendor-bank', mockReturn: true } },
        { label: 'Incident / RCA', view: 'cases', params: { caseId: 'case-incident-bank', mockReturn: true } },
        { label: 'Blind finding (leaver)', view: 'blind', params: { findingId: 'bf-leaver-active', mockReturn: true } },
      ],
    },
    {
      id: 'pressure',
      label: 'Faza 3 — Presja',
      minutes: 10,
      blurb: 'Klient nie zgadza się z findingiem + profesjonalne „nie wiem”.',
      steps: [
        {
          label: 'Klient nie zgadza się',
          view: 'think',
          params: { mode: 'run', queue: ['sc-client-disagrees'], startIndex: 0, mockReturn: true },
        },
        {
          label: 'Evidence quality (gdy „nie wiem co poprosić”)',
          view: 'interview',
          params: { mode: 'run', queue: ['iv-evidence-quality', 'iv-client-disagrees', 'iv-i-dont-know'], startIndex: 0, mockReturn: true },
        },
      ],
    },
  ],
  debrief: [
    'Soft: zwięźle, most dev→audyt, bez historii życia.',
    'Case: scope → owner → request list → próbka → finding (condition/criteria/cause/risk/rec).',
    'Presja: evidence > deklaracje; nie kłóć się; management response; nie zgaduj.',
    'Pro słowa: residual risk, design/operating, control owner, compensating control, PBC.',
  ],
};
