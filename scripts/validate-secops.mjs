// Sprawdza format i jakość danych ścieżki „Bezpieczeństwo IT” (src/data/secops/*.js).
// Użycie: node scripts/validate-secops.mjs [plik.js ...]
import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'src', 'data', 'secops');
const args = process.argv.slice(2);
const files = args.length ? args.map((f) => path.resolve(f)) : readdirSync(dir).filter((f) => f.endsWith('.js') && f !== 'index.js').map((f) => path.join(dir, f));

const TYPES = { abcd: 1, tf: 1, fill: 1, match: 1, order: 1, best: 1 };
const PRIVATE = /damian|nowacki|merito|copernicus|auditflow|centrum usług informatycznych|\bCUI\b/i;
let errors = 0, total = 0;
const err = (f, i, m) => { errors++; console.log(`✗ ${path.basename(f)} #${i}: ${m}`); };
const str = (v) => typeof v === 'string' && v.trim().length > 0;

for (const f of files) {
  const mod = await import(pathToFileURL(f).href);
  const s = mod.default;
  if (!s || !str(s.id) || !str(s.name) || !str(s.sub) || !['S', 'A', 'B', 'C', 'D'].includes(s.tier) || !Array.isArray(s.items)) { err(f, '-', 'zły nagłówek etapu (id, name, sub, tier S–D, items[])'); continue; }
  const seen = new Set();
  s.items.forEach((it, i) => {
    total++;
    if (!TYPES[it.t]) return err(f, i, `nieznany typ ${it.t}`);
    if (!str(it.q)) err(f, i, 'brak q');
    if (!str(it.ex)) err(f, i, 'brak ex (wyjaśnienia)');
    const key = it.q.trim().toLowerCase();
    if (seen.has(key)) err(f, i, 'zdublowane pytanie'); seen.add(key);
    if (PRIVATE.test(JSON.stringify(it))) err(f, i, 'dane prywatne / nazwa pracodawcy');
    if (it.t === 'abcd' || it.t === 'fill' || it.t === 'best') {
      const n = it.t === 'best' ? [3, 4] : [4];
      if (!Array.isArray(it.o) || !n.includes(it.o.length) || !it.o.every(str)) err(f, i, `o musi mieć ${n.join(' lub ')} niepuste opcje`);
      else if (!Number.isInteger(it.a) || it.a < 0 || it.a >= it.o.length) err(f, i, 'a poza zakresem');
      else if (new Set(it.o).size !== it.o.length) err(f, i, 'powtórzone opcje');
      if (it.t === 'fill' && (it.q.match(/___/g) || []).length !== 1) err(f, i, 'fill: q musi mieć dokładnie jedno ___');
    }
    if (it.t === 'tf' && typeof it.a !== 'boolean') err(f, i, 'tf: a musi być true/false');
    if (it.t === 'match') {
      if (!Array.isArray(it.p) || it.p.length !== 4 || !it.p.every((p) => Array.isArray(p) && p.length === 2 && p.every(str))) err(f, i, 'match: p = 4 pary [lewa, prawa]');
      else if (new Set(it.p.map((p) => p[1])).size !== 4 || new Set(it.p.map((p) => p[0])).size !== 4) err(f, i, 'match: powtórzone elementy');
    }
    if (it.t === 'order' && (!Array.isArray(it.o) || it.o.length < 3 || it.o.length > 7 || !it.o.every(str))) err(f, i, 'order: 3–7 kroków');
  });
  // poprawna odpowiedź nie może być systematycznie najdłuższa (za łatwe zgadywanie)
  const choice = s.items.filter((it) => (it.t === 'abcd' || it.t === 'fill') && Array.isArray(it.o) && it.o.length === 4);
  const longest = choice.filter((it) => it.o[it.a].length >= Math.max(...it.o.map((o) => o.length))).length;
  const share = choice.length ? longest / choice.length : 0;
  const types = s.items.reduce((m, it) => ((m[it.t] = (m[it.t] || 0) + 1), m), {});
  console.log(`• ${s.id}: ${s.items.length} zadań ${JSON.stringify(types)} · poprawna=najdłuższa w ${Math.round(share * 100)}% ABCD/fill`);
  if (choice.length >= 8 && share > 0.5) err(f, '-', `poprawna odpowiedź jest najdłuższa w ${Math.round(share * 100)}% pytań — wyrównaj długości dystraktorów`);
}
console.log(errors ? `\n${errors} błędów w ${total} zadaniach` : `\nOK: ${total} zadań`);
process.exit(errors ? 1 : 0);
