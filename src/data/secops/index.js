// Ścieżka „Bezpieczeństwo IT — sektor publiczny”: etapy (kolejki) w kolejności nauki.
// Każdy etap to osobny plik z zadaniami. Walidacja: node scripts/validate-secops.mjs
import podstawy from './podstawy.js';
import narzedzia from './narzedzia.js';
import incydenty from './incydenty.js';
import ksc from './ksc.js';
import podatnosci from './podatnosci.js';
import edr from './edr.js';
import rozmowa from './rozmowa.js';
import logi from './logi.js';
import szbi from './szbi.js';
import ryzyko from './ryzyko.js';
import dokumenty from './dokumenty.js';
import owasp from './owasp.js';
import architektura from './architektura.js';
import ludzie from './ludzie.js';
import dfir from './dfir.js';

export const SEC_STAGES = [podstawy, narzedzia, incydenty, ksc, podatnosci, edr, rozmowa, logi, szbi, ryzyko, dokumenty, owasp, architektura, ludzie, dfir];

/** Wszystkie zadania z unikalnym id `<etap>-<nr>` i odnośnikiem do etapu. */
export const SEC_ITEMS = {};
for (const s of SEC_STAGES) {
  s.items.forEach((it, i) => {
    it.id = `${s.id}-${i}`;
    it.stage = s.id;
    SEC_ITEMS[it.id] = it;
  });
}

export const SEC_TOTAL = Object.keys(SEC_ITEMS).length;

export const TIER_INFO = {
  S: { label: 'prawie pewne', chip: 'bg-rose-500 text-white', bar: 'bg-rose-500' },
  A: { label: 'bardzo prawdopodobne', chip: 'bg-orange-500 text-white', bar: 'bg-orange-500' },
  B: { label: 'prawdopodobne', chip: 'bg-amber-400 text-ink-950', bar: 'bg-amber-400' },
  C: { label: 'możliwe', chip: 'bg-emerald-500 text-white', bar: 'bg-emerald-500' },
  D: { label: 'mało prawdopodobne', chip: 'bg-slate-500 text-white', bar: 'bg-slate-500' },
};

export const KIND_LABEL = {
  abcd: 'Wybierz odpowiedź',
  tf: 'Prawda czy fałsz',
  match: 'Dopasuj pary',
  order: 'Ułóż kolejność',
  fill: 'Dokończ zdanie',
  best: 'Najlepsza odpowiedź',
};

export function stageById(id) {
  return SEC_STAGES.find((s) => s.id === id) || null;
}
