// Czysta logika postępu + warstwa persystencji (localStorage).
// Bez React — testowalna i wielokrotnego użytku.

export const STORAGE_KEY = 'auditor-quest-v1';
export const SCHEMA_VERSION = 1;

// Nagrody XP — zawsze dodatnie, bez kar
export const XP = {
  LESSON_DONE: 10,
  QUIZ_CORRECT: 5,
  QUIZ_TRY: 5, // ta sama nagroda za próbę — bez kary za błąd
  FLASHCARD_KNOWN: 3,
  FLASHCARD_UNKNOWN: 2,
  INTERVIEW_PER_POINT: 3,
  INTERVIEW_ATTEMPT: 8, // flat za każde pytanie
  CASE_COMPLETE: 15,
  CASE_PER_ANSWER: 3, // za każde pytanie, niezależnie od wyniku
  SCENARIO_CORRECT: 8,
  SCENARIO_TRY: 6,
};

const LEVEL_TITLES = [
  'Stażysta Audytu',
  'Młodszy Asystent Audytu',
  'Asystent Audytora',
  'Audytor Junior',
  'Audytor IT',
  'Starszy Audytor IT',
  'Lead Auditor',
  'Manager Audytu',
  'Director GRC',
  'Partner GRC',
];

// Całkowite XP wymagane do OSIĄGNIĘCIA poziomu L (L=1 -> 0).
export function xpForLevel(L) {
  if (L <= 1) return 0;
  return 100 * (L - 1) + 25 * (L - 1) * (L - 2);
}

export function levelFromXp(xp) {
  let level = 1;
  // bezpieczna górna granica
  while (level < 100 && xpForLevel(level + 1) <= xp) level += 1;
  return level;
}

export function levelTitle(level) {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)] || 'Mistrz GRC';
}

// Progres (0..1) do następnego poziomu + brakujące XP.
export function levelProgress(xp) {
  const level = levelFromXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const span = next - base || 1;
  const into = xp - base;
  return {
    level,
    title: levelTitle(level),
    intoLevel: into,
    span,
    pct: Math.max(0, Math.min(1, into / span)),
    toNext: Math.max(0, next - xp),
  };
}

export function defaultState() {
  return {
    version: SCHEMA_VERSION,
    xp: 0,
    topics: {}, // [topicKey]: { lessons: {id:true}, quizCorrect, quizTotal }
    flashcards: {}, // [cardId]: { seen, known, last }
    interview: {}, // [qId]: { attempts, best, last, lastAt }
    cases: {}, // [caseId]: { completed, best, last }
    scenarios: {}, // [scenarioId]: { correct, total }
    retryQueue: [], // [{ type, id, topic, at }]
    streak: 0,
    lastActiveDate: null,
    // --- warstwa gry ---
    stars: {}, // [missionId]: bestStars (0..3)
    achievements: [], // [achievementId]
    daily: { date: null, completed: false, bestScore: 0, attempts: 0 },
    maxCombo: 0,
  };
}

export function load() {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

export function save(state) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / prywatność — ignorujemy */
  }
}

export function reset() {
  if (typeof window === 'undefined') return defaultState();
  window.localStorage.removeItem(STORAGE_KEY);
  return defaultState();
}

// --- helpers mutacji (zwracają NOWY stan) ---

function topic(state, key) {
  return state.topics[key] || { lessons: {}, quizCorrect: 0, quizTotal: 0 };
}

function withXp(state, delta) {
  return { ...state, xp: state.xp + delta };
}

function touchStreak(state) {
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastActiveDate === today) return state;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;
  return { ...state, lastActiveDate: today, streak };
}

export function recordLessonDone(state, topicKey, lessonId) {
  const t = topic(state, topicKey);
  if (t.lessons[lessonId]) return state; // już zaliczone — bez duplikatu XP
  const lessons = { ...t.lessons, [lessonId]: true };
  const next = {
    ...state,
    topics: { ...state.topics, [topicKey]: { ...t, lessons } },
  };
  return touchStreak(withXp(next, XP.LESSON_DONE));
}

export function recordQuiz(state, topicKey, _isCorrect) {
  const t = topic(state, topicKey);
  const next = {
    ...state,
    topics: {
      ...state.topics,
      [topicKey]: {
        ...t,
        quizCorrect: t.quizCorrect + 1,
        quizTotal: t.quizTotal + 1,
      },
    },
  };
  return touchStreak(withXp(next, XP.QUIZ_CORRECT));
}

export function recordFlashcard(state, cardId, rating /* 'known' | 'unknown' */, topicKey) {
  const prev = state.flashcards[cardId] || { seen: 0, known: 0, last: null };
  const rec = {
    seen: prev.seen + 1,
    known: prev.known + (rating === 'known' ? 1 : 0),
    last: rating,
  };
  const xp = rating === 'known' ? XP.FLASHCARD_KNOWN : XP.FLASHCARD_UNKNOWN;
  const t = topic(state, topicKey);
  const next = {
    ...state,
    flashcards: { ...state.flashcards, [cardId]: rec },
    topics: { ...state.topics, [topicKey]: { ...t } },
  };
  return touchStreak(withXp(next, xp));
}

export function recordInterview(state, qId, _covered, total, topicKey) {
  const score = 100;
  const prev = state.interview[qId] || { attempts: 0, best: 0, last: 0, lastAt: null };
  const rec = {
    attempts: prev.attempts + 1,
    best: 100,
    last: score,
    lastAt: new Date().toISOString(),
  };
  const xp = XP.INTERVIEW_ATTEMPT + (total || 1) * XP.INTERVIEW_PER_POINT;
  const t = topic(state, topicKey);
  const next = {
    ...state,
    interview: { ...state.interview, [qId]: rec },
    topics: { ...state.topics, [topicKey]: { ...t } },
  };
  return touchStreak(withXp(next, xp));
}

export function recordCase(state, caseId, _correctCount, totalSub, topicKey) {
  const score = 100;
  const prev = state.cases[caseId] || { completed: false, best: 0, last: 0 };
  const firstTime = !prev.completed;
  const rec = {
    completed: true,
    best: 100,
    last: score,
  };
  const xp = (firstTime ? XP.CASE_COMPLETE : 8) + totalSub * XP.CASE_PER_ANSWER;
  const t = topic(state, topicKey);
  const next = {
    ...state,
    cases: { ...state.cases, [caseId]: rec },
    topics: { ...state.topics, [topicKey]: { ...t } },
  };
  return touchStreak(withXp(next, xp));
}

export function recordScenario(state, scenarioId, _isCorrect, topicKey) {
  const prev = state.scenarios[scenarioId] || { correct: 0, total: 0 };
  const rec = {
    correct: prev.correct + 1,
    total: prev.total + 1,
  };
  const xp = XP.SCENARIO_CORRECT;
  const t = topic(state, topicKey);
  const next = {
    ...state,
    scenarios: { ...state.scenarios, [scenarioId]: rec },
    topics: { ...state.topics, [topicKey]: { ...t } },
  };
  return touchStreak(withXp(next, xp));
}

// --- kolejka powtórek (pytania, na które odp. źle) ---

export function pushRetry(state, item) {
  // unikaj duplikatów (ten sam type+id)
  const exists = state.retryQueue.some((r) => r.type === item.type && r.id === item.id);
  if (exists) return state;
  return { ...state, retryQueue: [...state.retryQueue, { ...item, at: Date.now() }] };
}

export function removeRetry(state, type, id) {
  return {
    ...state,
    retryQueue: state.retryQueue.filter((r) => !(r.type === type && r.id === id)),
  };
}

export function clearRetry(state) {
  return { ...state, retryQueue: [] };
}

// --- selektory mastery ---

// mastery dla tematu: średnia z (lekcje zaliczone, quiz accuracy, fiszki known ratio)
// counts: { lessons: liczba lekcji w temacie, cards: liczba fiszek w temacie }
export function topicMastery(state, topicKey, counts) {
  const t = state.topics[topicKey] || { lessons: {}, quizCorrect: 0, quizTotal: 0 };
  const lessonRatio = counts.lessons > 0
    ? Object.keys(t.lessons).filter((k) => t.lessons[k]).length / counts.lessons
    : 0;
  const quizRatio = t.quizTotal > 0 ? t.quizCorrect / t.quizTotal : 0;
  // fiszki: liczymy po kartach przypisanych do tematu
  let cardKnown = 0;
  let cardSeen = 0;
  if (counts.cardIds) {
    for (const id of counts.cardIds) {
      const c = state.flashcards[id];
      if (c) {
        cardSeen += 1;
        if (c.last === 'known') cardKnown += 1;
      }
    }
  }
  const cardRatio = cardSeen > 0 ? cardKnown / cardSeen : 0;
  // waga: jeśli temat nie ma fiszek/quizu, liczymy po tym co jest
  const parts = [];
  if (counts.lessons > 0) parts.push(lessonRatio);
  if (t.quizTotal > 0) parts.push(quizRatio);
  if (cardSeen > 0) parts.push(cardRatio);
  if (parts.length === 0) return 0;
  return parts.reduce((a, b) => a + b, 0) / parts.length;
}

export function overallMastery(state, topicCounts) {
  // topicCounts: { [topicKey]: counts }
  const keys = Object.keys(topicCounts);
  if (keys.length === 0) return 0;
  let sum = 0;
  for (const k of keys) sum += topicMastery(state, k, topicCounts[k]);
  return sum / keys.length;
}

// Słabe tematy: mastery < 0.5 i temat rozpoczęty LUB wszystkie tematy posortowane rosnąco (top N)
export function weakTopics(state, topicCounts, maxN = 5) {
  const entries = Object.entries(topicCounts).map(([key, counts]) => ({
    key,
    mastery: topicMastery(state, key, counts),
  }));
  // tematy z mastery < 0.6, posortowane rosnąco; jeśli brak — najniższe ogółem
  const weak = entries.filter((e) => e.mastery < 0.6);
  const pool = weak.length > 0 ? weak : entries;
  return pool.sort((a, b) => a.mastery - b.mastery).slice(0, maxN);
}

// --- WARSTWA GRY: gwiazdki, osiągnięcia, wyzwanie dnia, combo ---

export function recordStars(state, missionId, stars) {
  const prev = state.stars[missionId] || 0;
  if (stars <= prev) return state; // brak poprawy — bez duplikatu XP bonus
  const next = { ...state, stars: { ...state.stars, [missionId]: stars } };
  const bonus = (stars - prev) * 5; // XP za każdą nową gwiazdkę
  return touchStreak(withXp(next, bonus));
}

export function totalStars(state) {
  return Object.values(state.stars || {}).reduce((a, b) => a + b, 0);
}

export function bestStars(state, missionId) {
  return state.stars?.[missionId] || 0;
}

export function unlockAchievements(state, ids) {
  if (!ids || ids.length === 0) return state;
  const owned = new Set(state.achievements || []);
  const add = ids.filter((id) => !owned.has(id));
  if (add.length === 0) return state;
  const next = { ...state, achievements: [...(state.achievements || []), ...add] };
  return withXp(next, add.length * 15); // 15 XP za odznakę
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function isDailyAvailable(state) {
  const d = state.daily || {};
  return d.date !== todayStr() || !d.completed;
}

export function isDailyDoneToday(state) {
  const d = state.daily || {};
  return d.date === todayStr() && !!d.completed;
}

export function recordDaily(state, score) {
  const today = todayStr();
  const d = state.daily || { date: null, completed: false, bestScore: 0, attempts: 0 };
  const firstToday = d.date !== today;
  const rec = {
    date: today,
    completed: true,
    bestScore: Math.max(d.bestScore || 0, score),
    attempts: (firstToday ? 0 : d.attempts || 0) + 1,
  };
  const xp = firstToday ? 25 : 0; // jednorazowa nagroda za pierwsze ukończenie dnia
  return touchStreak(withXp({ ...state, daily: rec }, xp));
}

export function recordCombo(state, combo) {
  if (combo <= (state.maxCombo || 0)) return state;
  return { ...state, maxCombo: combo };
}
