import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Zap, Pause, ChevronRight, ListOrdered, LayoutGrid } from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { useProgress } from '../state/ProgressContext.jsx';
import { Card, TopicBadge, Pill } from '../components/ui.jsx';
import QuizExplain from '../components/QuizExplain.jsx';
import EndlessOrderQuiz from '../components/endless/EndlessOrderQuiz.jsx';
import EndlessBucketQuiz from '../components/endless/EndlessBucketQuiz.jsx';
import {
  pickQuestion,
  createEndlessSession,
  initEndlessSession,
  deckProgress,
  formatCorrectAnswer,
  ENDLESS_POOL,
} from '../data/endlessQuiz.js';
import { sfx, spawnFloat } from '../utils/juice.js';

const AUTO_MS = 3000;

const TYPE_LABELS = {
  choice: { label: 'ABCD', icon: CheckCircle2 },
  order: { label: 'Kolejność', icon: ListOrdered },
  bucket: { label: 'Segreguj', icon: LayoutGrid },
};

export default function EndlessQuizModule() {
  const { go } = useNav();
  const { recordQuiz } = useProgress();
  const sessionRef = useRef(null);
  if (!sessionRef.current) {
    sessionRef.current = createEndlessSession();
    initEndlessSession(sessionRef.current);
  }

  const [current, setCurrent] = useState(() => pickQuestion(sessionRef.current));
  const [deckInfo, setDeckInfo] = useState(() => deckProgress(sessionRef.current));
  const [picked, setPicked] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [barPct, setBarPct] = useState(100);
  const [total, setTotal] = useState(0);
  const timerRef = useRef(null);
  const tickRef = useRef(null);
  const startTimeRef = useRef(0);
  const remainingRef = useRef(AUTO_MS);

  const qType = current.type || 'choice';
  const typeMeta = TYPE_LABELS[qType] || TYPE_LABELS.choice;

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
    timerRef.current = null;
    tickRef.current = null;
  }, []);

  const loadNext = useCallback(() => {
    clearTimers();
    const next = pickQuestion(sessionRef.current);
    setCurrent(next);
    setDeckInfo(deckProgress(sessionRef.current));
    setPicked(null);
    setRevealed(false);
    setPaused(false);
    setBarPct(100);
  }, [clearTimers]);

  const startAutoAdvance = useCallback((ms = AUTO_MS) => {
    clearTimers();
    setPaused(false);
    remainingRef.current = ms;
    startTimeRef.current = Date.now();
    setBarPct(100);

    tickRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const left = Math.max(0, ms - elapsed);
      remainingRef.current = left;
      setBarPct((left / ms) * 100);
    }, 50);

    timerRef.current = setTimeout(() => loadNext(), ms);
  }, [clearTimers, loadNext]);

  const revealAnswer = useCallback((e) => {
    setRevealed(true);
    setTotal((t) => t + 1);
    recordQuiz(current.topicKey, true);
    sfx.click();
    if (e?.clientX != null) spawnFloat('+5 XP', e.clientX, e.clientY - 20);
    startAutoAdvance(AUTO_MS);
  }, [current.topicKey, recordQuiz, startAutoAdvance]);

  const pauseTimer = useCallback(() => {
    if (paused || !revealed) return;
    clearTimers();
    setPaused(true);
    setBarPct((remainingRef.current / AUTO_MS) * 100);
    sfx.click();
  }, [paused, revealed, clearTimers]);

  const goNext = useCallback(() => {
    if (!revealed) return;
    loadNext();
  }, [revealed, loadNext]);

  const choose = useCallback((idx, e) => {
    setPicked(idx);
    revealAnswer(e);
  }, [revealAnswer]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === 'Escape') { go('quest'); return; }
      if (revealed && ev.key === ' ') {
        ev.preventDefault();
        if (paused) goNext();
        else pauseTimer();
        return;
      }
      if (revealed && paused && ev.key === 'Enter') {
        ev.preventDefault();
        goNext();
        return;
      }
      if (revealed || qType !== 'choice') return;
      const n = parseInt(ev.key, 10);
      if (n >= 1 && n <= (current.options?.length || 0)) choose(n - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [revealed, paused, qType, current.options?.length, go, pauseTimer, goNext, choose]);

  return (
    <div className="space-y-4 animate-slidein max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" /> Mapa
        </button>
        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">∞ Unlimited</span>
          <span className="inline-flex items-center gap-1 text-amber-400 font-semibold"><Zap className="h-3.5 w-3.5" /> {total} w sesji</span>
          <span className="text-slate-500">{ENDLESS_POOL.length} w puli · {deckInfo.left} do końca tury</span>
        </div>
      </div>

      <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-b from-accent/5 to-transparent">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Pill tone="accent">Endless Quiz</Pill>
          <Pill tone="neutral" className="inline-flex items-center gap-1">
            <typeMeta.icon className="h-3 w-3" /> {typeMeta.label}
          </Pill>
          <TopicBadge topicKey={current.topicKey} />
          <span className="text-[0.6875rem] text-slate-500 truncate ml-auto">{current.title}</span>
        </div>

        <div className="font-semibold text-lg text-slate-100 mb-4 leading-snug">{current.question}</div>

        {qType === 'choice' && (
          <div className="space-y-2">
            {current.options.map((opt, idx) => {
              const isCorrect = idx === current.correct;
              const isPicked = idx === picked;
              let cls = 'border-ink-700/60 bg-ink-850/40 hover:bg-ink-700/50 hover:border-accent/30 active:scale-[0.99]';
              if (revealed) {
                if (isCorrect) cls = 'border-emerald-500/50 bg-emerald-500/10';
                else if (isPicked) cls = 'border-accent/30 bg-accent/5';
                else cls = 'border-ink-700/30 bg-ink-900/20 opacity-50';
              }
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => choose(idx, e)}
                  disabled={revealed}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${cls}`}
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${revealed && isCorrect ? 'bg-emerald-500 text-white' : 'bg-ink-700 text-slate-300'}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-slate-100">{opt}</span>
                  {revealed && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-400 ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        {qType === 'order' && (
          <EndlessOrderQuiz
            key={current.id}
            question={current}
            revealed={revealed}
            onComplete={revealAnswer}
          />
        )}

        {qType === 'bucket' && (
          <EndlessBucketQuiz
            key={current.id}
            question={current}
            revealed={revealed}
            onComplete={revealAnswer}
          />
        )}

        {revealed && (
          <div className="mt-4 animate-pop">
            <button
              type="button"
              onClick={pauseTimer}
              disabled={paused}
              className={`w-full text-left rounded-xl border p-4 transition-colors ${
                paused
                  ? 'border-amber-500/30 bg-amber-500/5 cursor-default'
                  : 'border-accent/25 bg-ink-900/50 cursor-pointer hover:bg-ink-800/60 hover:border-accent/40'
              }`}
            >
              <div className="h-1 w-full overflow-hidden rounded-full bg-ink-700/70 mb-3">
                <div
                  className={`h-full rounded-full origin-left transition-none ${paused ? 'bg-amber-400/80' : 'bg-accent/80'}`}
                  style={{ width: `${barPct}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-xs mb-2">
                {paused ? (
                  <span className="text-amber-400 inline-flex items-center gap-1"><Pause className="h-3.5 w-3.5" /> Wstrzymano — czytaj spokojnie</span>
                ) : (
                  <span className="text-accent-soft inline-flex items-center gap-1"><Pause className="h-3.5 w-3.5" /> Kliknij tutaj, żeby wstrzymać auto-dalej</span>
                )}
              </div>
              <div className="text-sm text-emerald-400 font-semibold mb-2">
                {qType === 'order' ? 'Poprawna kolejność:' : qType === 'bucket' ? 'Poprawny podział:' : 'Odpowiedź:'}{' '}
                <span className="text-slate-200 font-normal block mt-1 leading-relaxed">{formatCorrectAnswer(current)}</span>
              </div>
              <QuizExplain explain={current.explain} />
            </button>

            {paused && (
              <button type="button" onClick={goNext} className="btn-primary w-full mt-3">
                Dalej <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </Card>

      {!revealed && qType === 'choice' && (
        <p className="text-center text-[0.6875rem] text-slate-500">Klawisze 1–4 · po odpowiedzi Spacja = wstrzymaj / dalej</p>
      )}
      {!revealed && qType !== 'choice' && (
        <p className="text-center text-[0.6875rem] text-slate-500">Ukończ zadanie · potem Spacja = wstrzymaj wyjaśnienie</p>
      )}
    </div>
  );
}
