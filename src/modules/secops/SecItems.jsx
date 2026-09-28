import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { sfx } from '../../utils/juice.js';

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Tekst poprawnej odpowiedzi — do podsumowań. */
export function correctText(item) {
  if (item.t === 'tf') return item.a ? 'Prawda' : 'Fałsz';
  if (item.t === 'order') return item.o.join(' → ');
  if (item.t === 'match') return item.p.map((p) => `${p[0]} — ${p[1]}`).join('; ');
  return item.o[item.a];
}

function useNumberKeys(count, onPick, enabled) {
  const ref = useRef(onPick);
  ref.current = onPick;
  useEffect(() => {
    if (!enabled) return undefined;
    const h = (e) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= count) ref.current(n - 1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [count, enabled]);
}

const optBase = 'flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-[15px] leading-snug transition-colors disabled:cursor-default';
function optTone(state) {
  if (state === 'ok') return 'border-emerald-500/70 bg-emerald-500/15 text-slate-100';
  if (state === 'no') return 'border-rose-500/70 bg-rose-500/15 text-slate-100';
  if (state === 'picked') return 'border-accent/70 bg-accent/15 text-slate-100';
  return 'border-ink-600/70 bg-ink-900/50 text-slate-200 hover:border-accent/60 hover:bg-ink-800/80';
}

function Key({ n }) {
  return <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border border-ink-600/70 bg-ink-850 font-mono text-xs text-slate-400">{n}</span>;
}

/** ABCD, „dokończ zdanie” i „najlepsza odpowiedź”. */
function Choice({ item, reveal, onDone }) {
  const order = useMemo(() => shuffle(item.o.map((text, idx) => ({ text, idx }))), [item]);
  const [picked, setPicked] = useState(null);
  const done = picked != null;

  const pick = (k) => {
    if (done) return;
    setPicked(k);
    const ok = order[k].idx === item.a;
    if (reveal) (ok ? sfx.correct : sfx.wrong)();
    onDone(ok, { mistakes: ok ? 0 : 1 });
  };
  useNumberKeys(order.length, pick, !done);

  const stateOf = (k) => {
    if (!done) return null;
    if (!reveal) return k === picked ? 'picked' : null;
    if (order[k].idx === item.a) return 'ok';
    return k === picked ? 'no' : null;
  };

  const blankText = done ? order[picked].text : '…';
  const blankTone = !done ? 'border-accent text-slate-400' : !reveal ? 'border-accent text-accent-soft' : order[picked].idx === item.a ? 'border-emerald-500 text-emerald-400' : 'border-rose-500 text-rose-400';
  const [before, after] = item.t === 'fill' ? item.q.split('___') : [null, null];

  return (
    <div className="space-y-4">
      {item.t === 'fill' ? (
        <p className="text-lg leading-relaxed text-slate-100">
          {before}
          <span className={`mx-1 inline-block min-w-[7rem] border-b-2 border-dashed px-2 text-center font-semibold ${blankTone}`}>{blankText}</span>
          {after}
        </p>
      ) : (
        <p className="text-lg font-semibold leading-snug text-slate-100 text-balance">{item.q}</p>
      )}
      <div className={item.t === 'fill' ? 'grid gap-2 sm:grid-cols-2' : 'grid gap-2'}>
        {order.map((o, k) => {
          const st = stateOf(k);
          return (
            <button key={o.text} type="button" disabled={done} onClick={() => pick(k)} className={`${optBase} ${optTone(st)}`}>
              <Key n={k + 1} />
              <span className="flex-1">{o.text}</span>
              {st === 'ok' && <Check className="h-5 w-5 shrink-0 text-emerald-400" />}
              {st === 'no' && <X className="h-5 w-5 shrink-0 text-rose-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TrueFalse({ item, reveal, onDone }) {
  const [picked, setPicked] = useState(null);
  const vals = [true, false];
  const done = picked != null;
  const pick = (k) => {
    if (done) return;
    setPicked(k);
    const ok = vals[k] === item.a;
    if (reveal) (ok ? sfx.correct : sfx.wrong)();
    onDone(ok, { mistakes: ok ? 0 : 1 });
  };
  useNumberKeys(2, pick, !done);
  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold leading-snug text-slate-100 text-balance">{item.q}</p>
      <div className="grid grid-cols-2 gap-3">
        {vals.map((v, k) => {
          let st = null;
          if (done) st = !reveal ? (k === picked ? 'picked' : null) : v === item.a ? 'ok' : k === picked ? 'no' : null;
          return (
            <button key={String(v)} type="button" disabled={done} onClick={() => pick(k)} className={`${optBase} ${optTone(st)} justify-center py-5 text-lg font-bold`}>
              {v ? 'Prawda' : 'Fałsz'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function shakeCls(n) {
  if (!n) return '';
  return n % 2 ? 'sec-shake-a' : 'sec-shake-b';
}

function useShake() {
  const [shake, setShake] = useState({});
  const trigger = (keys) => {
    setShake((s) => {
      const n = { ...s };
      keys.forEach((k) => { n[k] = (n[k] || 0) + 1; });
      return n;
    });
  };
  return [shake, trigger];
}

function Match({ item, onDone }) {
  const right = useMemo(() => shuffle(item.p.map((p, idx) => ({ text: p[1], idx }))), [item]);
  const [sel, setSel] = useState(null);
  const [done, setDone] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [shake, trigger] = useShake();

  const clickRight = (r) => {
    if (done.includes(r.idx)) return;
    if (sel == null) { trigger(item.p.map((_, i) => `l${i}`)); return; }
    if (sel === r.idx) {
      const nd = [...done, r.idx];
      setDone(nd);
      setSel(null);
      sfx.click();
      if (nd.length === item.p.length) {
        const ok = mistakes <= 1;
        (ok ? sfx.correct : sfx.wrong)();
        onDone(ok, { mistakes });
      }
    } else {
      setMistakes((m) => m + 1);
      trigger([`l${sel}`, `r${r.idx}`]);
    }
  };

  const cell = (active, isDone) => `w-full min-h-[3rem] rounded-xl border px-3 py-2.5 text-left text-sm leading-snug transition-colors ${
    isDone ? 'border-emerald-500/60 bg-emerald-500/10 text-slate-300' : active ? 'border-accent bg-accent/15 text-slate-100' : 'border-ink-600/70 bg-ink-900/50 text-slate-200 hover:border-accent/60'
  }`;

  return (
    <div className="space-y-3">
      <p className="text-lg font-semibold leading-snug text-slate-100 text-balance">{item.q}</p>
      <p className="text-xs text-slate-400">Kliknij pojęcie po lewej, potem pasujący opis po prawej. Jedna pomyłka jest w porządku.</p>
      <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-2">
        <div className="grid content-start gap-2">
          {item.p.map((p, i) => (
            <button key={p[0]} type="button" disabled={done.includes(i)} onClick={() => setSel(i)}
              className={`${cell(sel === i, done.includes(i))} ${shakeCls(shake[`l${i}`])}`}>
              <span className="mr-1.5 font-mono text-xs text-slate-500">{i + 1}</span>{p[0]}
            </button>
          ))}
        </div>
        <div className="grid content-start gap-2">
          {right.map((r) => (
            <button key={r.text} type="button" disabled={done.includes(r.idx)} onClick={() => clickRight(r)}
              className={`${cell(false, done.includes(r.idx))} ${shakeCls(shake[`r${r.idx}`])}`}>
              {r.text}
            </button>
          ))}
        </div>
      </div>
      {mistakes > 0 && <p className="text-xs text-slate-500">Pomyłki: {mistakes}</p>}
    </div>
  );
}

function Order({ item, onDone }) {
  const pool = useMemo(() => shuffle(item.o.map((text, idx) => ({ text, idx }))), [item]);
  const [placed, setPlaced] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [shake, trigger] = useShake();

  const click = (p) => {
    if (placed.includes(p.idx)) return;
    if (p.idx === placed.length) {
      const np = [...placed, p.idx];
      setPlaced(np);
      sfx.click();
      if (np.length === item.o.length) {
        const ok = mistakes <= 1;
        (ok ? sfx.correct : sfx.wrong)();
        onDone(ok, { mistakes });
      }
    } else {
      setMistakes((m) => m + 1);
      trigger([`p${p.idx}`]);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-lg font-semibold leading-snug text-slate-100 text-balance">{item.q}</p>
      <p className="text-xs text-slate-400">Klikaj w dobrej kolejności. Pomyłka tylko mignie, próbujesz dalej.</p>
      <ol className="grid gap-1.5">
        {item.o.map((text, i) => (
          <li key={text} className={`flex min-h-[2.6rem] items-center gap-3 rounded-xl border px-3 py-2 text-sm ${
            i < placed.length ? 'border-emerald-500/60 bg-emerald-500/10 text-slate-100' : 'border-dashed border-ink-600/70 text-slate-500'
          }`}>
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-ink-800 font-mono text-xs text-slate-400">{i + 1}</span>
            {i < placed.length ? text : '…'}
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        {pool.filter((p) => !placed.includes(p.idx)).map((p) => (
          <button key={p.text} type="button" onClick={() => click(p)}
            className={`flex-1 basis-56 rounded-xl border border-ink-600/70 bg-ink-900/50 px-3 py-2.5 text-left text-sm text-slate-200 hover:border-accent/60 ${shakeCls(shake[`p${p.idx}`])}`}
           >
            {p.text}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Renderuje zadanie dowolnego typu. `reveal=false` = tryb egzaminu (bez podpowiedzi). */
export default function SecItem({ item, reveal = true, onDone }) {
  if (item.t === 'tf') return <TrueFalse item={item} reveal={reveal} onDone={onDone} />;
  if (item.t === 'match') return <Match item={item} onDone={onDone} />;
  if (item.t === 'order') return <Order item={item} onDone={onDone} />;
  return <Choice item={item} reveal={reveal} onDone={onDone} />;
}
