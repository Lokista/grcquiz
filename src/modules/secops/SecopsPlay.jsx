import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Heart, Timer, Star, Flame, ChevronRight, Trophy } from 'lucide-react';
import { useNav } from '../../state/NavContext.jsx';
import { useSecops } from '../../state/SecopsContext.jsx';
import { SEC_STAGES, SEC_ITEMS, KIND_LABEL, TIER_INFO, stageById } from '../../data/secops/index.js';
import { stageUnlocked, missedItems } from '../../state/secops.js';
import { sfx, burst, spawnFloat } from '../../utils/juice.js';
import SecItem, { shuffle, correctText } from './SecItems.jsx';

const ROUND = 8;
const QUICK = 10;
const EXAM_N = 30;
const EXAM_SECONDS = 20 * 60;
const GIGA_LIVES = 3;

const HEADS_OK = ['Dobrze!', 'Trafione.', 'Zgadza się.', 'Tak jest.', 'Czysto.'];

/** Buduje sesję dla trybu. Giga dobiera zadania w locie. */
function buildSession(mode, stageId, state) {
  const all = Object.values(SEC_ITEMS);
  if (mode === 'stage') {
    const s = stageById(stageId);
    return { title: s.name, stage: s, items: shuffle(s.items).slice(0, s.boss ? 7 : ROUND) };
  }
  if (mode === 'quick') {
    const pool = SEC_STAGES.filter((_, i) => stageUnlocked(state, i)).flatMap((s) => s.items);
    return { title: 'Szybka zmiana', items: shuffle(pool).slice(0, QUICK) };
  }
  if (mode === 'review') {
    return { title: 'Powtórka błędów', items: shuffle(missedItems(state)).slice(0, QUICK) };
  }
  if (mode === 'exam') {
    const pool = all.filter((it) => it.t !== 'match' && it.t !== 'order');
    return { title: 'Egzamin', items: shuffle(pool).slice(0, EXAM_N) };
  }
  // giga: talia ze wszystkiego, bez powtórek do wyczerpania
  return { title: 'Giga Quiz', deck: shuffle(all), items: [] };
}

function fmtTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function SecopsPlay({ mode, stageId }) {
  const { go } = useNav();
  const sec = useSecops();
  const [session] = useState(() => {
    const s = buildSession(mode, stageId, sec.state);
    if (mode === 'giga') s.items = [s.deck.shift()];
    return s;
  });
  const [i, setI] = useState(0);
  const [results, setResults] = useState([]); // { item, ok, picked? }
  const [answered, setAnswered] = useState(null); // { ok, mistakes }
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [lives, setLives] = useState(GIGA_LIVES);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(EXAM_SECONDS);
  const [finished, setFinished] = useState(null);
  const cardRef = useRef(null);
  const nextRef = useRef(null);

  const { startSession } = sec;
  useEffect(() => { startSession(); }, [startSession]);

  const isExam = mode === 'exam';
  const isGiga = mode === 'giga';
  const item = session.items[i];
  const total = session.items.length;

  const finish = useCallback((res) => {
    const list = res || results;
    const good = list.filter((r) => r.ok).length;
    const n = isGiga ? list.length : total;
    const pct = n ? good / n : 0;
    let extra = {};
    if (session.stage) extra = sec.finishStage(session.stage.id, pct);
    if (isExam) sec.recordExam(pct);
    if (isGiga) sec.recordGiga(score);
    setFinished({ good, n, pct, ...extra });
    if (pct >= 0.75 || (isGiga && score > (sec.state.gigaBest || 0) && score > 0)) {
      sfx.fanfare();
      burst({ stars: pct === 1 ? 3 : 2 });
    }
    document.getElementById('main-scroll')?.scrollTo({ top: 0 });
  }, [results, isGiga, isExam, total, session.stage, sec, score]);

  // zegar egzaminu
  useEffect(() => {
    if (!isExam || finished) return undefined;
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, [isExam, finished]);
  useEffect(() => {
    if (isExam && left <= 0 && !finished) finish();
  }, [left, isExam, finished, finish]);

  const onDone = (ok, info) => {
    const nextCombo = ok ? combo + 1 : 0;
    setCombo(nextCombo);
    setBestCombo((b) => Math.max(b, nextCombo));
    const gain = sec.answer(item.id, ok, nextCombo);
    setXpGained((x) => x + gain);
    const rec = { item, ok, mistakes: info?.mistakes || 0 };
    const nextResults = [...results, rec];
    setResults(nextResults);

    if (isGiga) {
      const mult = Math.min(1 + Math.floor(nextCombo / 3), 5);
      if (ok) setScore((s) => s + 10 * mult);
      else setLives((l) => l - 1);
    }
    if (ok && gain && cardRef.current && !isExam) {
      const r = cardRef.current.getBoundingClientRect();
      spawnFloat(`+${gain} XP`, r.right - 60, r.top + 24);
    }
    if (isExam) {
      // bez informacji zwrotnej: krótka pauza i następne pytanie
      setTimeout(() => {
        if (i < total - 1) setI((v) => v + 1);
        else finish(nextResults);
      }, 280);
      return;
    }
    setAnswered({ ok, mistakes: info?.mistakes || 0 });
  };

  const advance = useCallback(() => {
    if (!answered) return;
    if (isGiga) {
      if (lives <= 0) { finish(); return; }
      if (!session.deck.length) session.deck = shuffle(Object.values(SEC_ITEMS));
      session.items.push(session.deck.shift());
    } else if (i >= total - 1) {
      finish();
      return;
    }
    setAnswered(null);
    setI((v) => v + 1);
    document.getElementById('main-scroll')?.scrollTo({ top: 0 });
  }, [answered, isGiga, lives, session, i, total, finish]);

  useEffect(() => {
    if (!answered) return undefined;
    nextRef.current?.focus({ preventScroll: true });
    const h = (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [answered, advance]);

  const stageOf = useMemo(() => (it) => stageById(it.stage), []);

  if (!session.items.length || !item) {
    return (
      <div className="card card-pad text-center">
        <p className="text-slate-300">Brak zadań w tym trybie.</p>
        <button type="button" className="btn-primary mt-4" onClick={() => go('sec')}>Wróć do kolejek</button>
      </div>
    );
  }

  if (finished) return <Result {...{ session, finished, results, xpGained, bestCombo, isGiga, isExam, score, mode, stageId, go }} gigaBest={sec.state.gigaBest} />;

  const st = stageOf(item);
  const livesLeft = isGiga ? lives : null;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => go('sec')} className="btn-ghost px-3 py-1.5"><ArrowLeft className="h-4 w-4" /> Kolejki</button>
        {isGiga ? (
          <div className="flex flex-1 items-center gap-3">
            <span className="inline-flex gap-1" aria-label={`Życia: ${livesLeft}`}>
              {Array.from({ length: GIGA_LIVES }).map((_, k) => <Heart key={k} className={`h-5 w-5 ${k < livesLeft ? 'fill-rose-500 text-rose-500' : 'text-ink-600'}`} />)}
            </span>
            <span className="font-mono text-sm text-gold">{score} pkt</span>
            <span className="text-xs text-slate-500">mnożnik ×{Math.min(1 + Math.floor(combo / 3), 5)}</span>
          </div>
        ) : (
          <div className="flex flex-1 gap-1" aria-label="Postęp">
            {session.items.map((_, k) => (
              <span key={k} className={`h-2 flex-1 rounded-full ${
                k < results.length ? (isExam ? 'bg-accent' : results[k].ok ? 'bg-emerald-500' : 'bg-rose-500') : k === i ? 'bg-accent/70' : 'bg-ink-700'
              }`} />
            ))}
          </div>
        )}
        {isExam ? (
          <span className={`chip border font-mono ${left < 120 ? 'border-rose-500/50 text-rose-300' : 'border-ink-600/60 text-slate-300'}`}><Timer className="h-3.5 w-3.5" /> {fmtTime(Math.max(left, 0))}</span>
        ) : (
          <span className={`chip border font-mono ${combo >= 3 ? 'border-gold/50 text-gold' : 'border-ink-600/60 text-slate-400'}`}><Flame className="h-3.5 w-3.5" /> ×{combo}</span>
        )}
      </div>

      <div ref={cardRef} className="card card-pad animate-pop" key={`${item.id}-${i}`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-accent-soft">{KIND_LABEL[item.t]}</span>
          <span className="flex items-center gap-2 text-[0.6875rem] text-slate-500">
            {st && <span className={`rounded px-1.5 font-bold ${TIER_INFO[st.tier].chip}`}>{st.tier}</span>}
            <span>{st?.name}</span>
            <span className="font-mono">{isGiga ? `#${i + 1}` : `${i + 1}/${total}`}</span>
          </span>
        </div>

        <SecItem item={item} reveal={!isExam} onDone={onDone} />

        {answered && (
          <div role="status" className={`mt-5 grid gap-2 rounded-xl border p-4 ${answered.ok ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-rose-500/50 bg-rose-500/10'}`}>
            <div className={`font-bold ${answered.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
              {answered.ok
                ? (answered.mistakes ? 'Dobrze, z jedną pomyłką.' : HEADS_OK[(i + item.q.length) % HEADS_OK.length])
                : (item.t === 'match' || item.t === 'order') ? `Za dużo pomyłek (${answered.mistakes}).` : isGiga ? `Tracisz życie. Zostało: ${lives}.` : 'Nie tym razem.'}
            </div>
            {!answered.ok && item.t !== 'match' && item.t !== 'order' && (
              <div className="text-sm text-slate-300">Poprawnie: <b className="text-slate-100">{correctText(item)}</b></div>
            )}
            <div className="text-sm leading-relaxed text-slate-300">{item.ex}</div>
            <button ref={nextRef} type="button" onClick={advance} className="btn-primary justify-self-end">
              {isGiga && lives <= 0 ? 'Koniec gry — wynik' : !isGiga && i >= total - 1 ? 'Zobacz wynik' : 'Dalej'} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      {!answered && !isExam && <p className="text-center text-[0.6875rem] text-slate-600">Klawisze 1–4 wybierają odpowiedź, Enter przechodzi dalej.</p>}
    </div>
  );
}

function Result({ session, finished, results, xpGained, bestCombo, isGiga, isExam, score, mode, stageId, go, gigaBest }) {
  const wrong = results.filter((r) => !r.ok);
  const idx = session.stage ? SEC_STAGES.indexOf(session.stage) : -1;
  const next = idx >= 0 && idx < SEC_STAGES.length - 1 ? SEC_STAGES[idx + 1] : null;
  const pct = Math.round(finished.pct * 100);
  const msg = isGiga
    ? (score >= gigaBest && score > 0 ? 'Nowy rekord!' : `Rekord: ${gigaBest} pkt. Następnym razem.`)
    : pct === 100 ? 'Czysta zmiana. Zero błędów.'
      : pct >= 75 ? 'Bardzo dobrze. Jeszcze chwila i będzie komplet.'
        : pct >= 50 ? 'Solidnie. Błędy są niżej, przeczytaj je raz.'
          : 'To dopiero rozgrzewka. Przeczytaj wyjaśnienia i spróbuj jeszcze raz.';
  const again = () => go(mode === 'stage' ? 'sec-stage' : `sec-${mode}`, { stageId, rerun: Date.now() });

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="card card-pad text-center">
        {session.stage && (
          <div className="mb-2 flex justify-center gap-2">
            {[0, 1, 2].map((k) => <Star key={k} className={`h-10 w-10 ${k < finished.stars ? 'fill-gold text-gold' : 'text-ink-600'}`} />)}
          </div>
        )}
        {isGiga && <Trophy className="mx-auto mb-2 h-10 w-10 text-gold" />}
        <h2 className="text-2xl font-bold text-slate-100">
          {session.title}: {isGiga ? `${score} pkt` : `${finished.good}/${finished.n}`}
        </h2>
        <p className="mt-1 text-sm text-slate-400">{msg}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-ink-700/70 bg-ink-900/50 p-3"><div className="text-xl font-bold text-slate-100">{pct}%</div><div className="text-[0.6875rem] text-slate-500">trafność</div></div>
          <div className="rounded-xl border border-ink-700/70 bg-ink-900/50 p-3"><div className="text-xl font-bold text-accent-soft">+{xpGained + (finished.bonus || 0)}</div><div className="text-[0.6875rem] text-slate-500">XP{finished.bonus ? ` (bonus ${finished.bonus})` : ''}</div></div>
          <div className="rounded-xl border border-ink-700/70 bg-ink-900/50 p-3"><div className="text-xl font-bold text-gold">{isGiga ? results.length : bestCombo}</div><div className="text-[0.6875rem] text-slate-500">{isGiga ? 'zadań' : 'najdłuższa seria'}</div></div>
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button type="button" className="btn-ghost" onClick={again}>Jeszcze raz</button>
          {next && <button type="button" className="btn-primary" onClick={() => go('sec-stage', { stageId: next.id })}>Następna: {next.name}</button>}
          <button type="button" className={next ? 'btn-ghost' : 'btn-primary'} onClick={() => go('sec')}>Kolejki</button>
        </div>
      </div>

      {wrong.length > 0 && (
        <div className="card card-pad space-y-3">
          <h3 className="section-title">{isExam ? 'Omówienie błędów' : 'Do zapamiętania'}</h3>
          {wrong.map((r, k) => (
            <div key={`${r.item.id}-${k}`} className="rounded-xl border border-ink-700/70 bg-ink-900/40 p-3 text-sm">
              <div className="text-slate-200">{r.item.q.replace('___', '…')}</div>
              <div className="mt-1 font-semibold text-emerald-400">→ {correctText(r.item)}</div>
              <div className="mt-1 text-slate-400">{r.item.ex}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
