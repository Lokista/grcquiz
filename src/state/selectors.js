import * as P from './progress.js';
import { TOPICS } from '../data/topics.js';
import { LESSONS, LESSONS_PER_TOPIC, lessonsByTopic } from '../data/lessons/index.js';
import { FLASHCARDS, FLASHCARD_IDS_PER_TOPIC, FLASHCARDS_PER_TOPIC } from '../data/flashcards.js';
import { INTERVIEW_QUESTIONS } from '../data/interview.js';
import { CASE_STUDIES } from '../data/caseStudies.js';
import { SCENARIOS } from '../data/scenarios.js';
import { CHAPTERS, MISSIONS, missionsByChapter, chapterMaxStars, chapterStars, isChapterUnlocked, isMissionUnlocked } from '../data/missions.js';

// counts per topic do obliczeń mastery
export function topicCounts() {
  const map = {};
  for (const t of TOPICS) {
    map[t.key] = {
      lessons: LESSONS_PER_TOPIC[t.key] || 0,
      cards: FLASHCARDS_PER_TOPIC[t.key] || 0,
      cardIds: FLASHCARD_IDS_PER_TOPIC[t.key] || [],
    };
  }
  return map;
}

export function overallMastery(state) {
  return P.overallMastery(state, topicCounts());
}

export function weakTopics(state, maxN = 5) {
  return P.weakTopics(state, topicCounts(), maxN);
}

export function masteryPerTopic(state) {
  const counts = topicCounts();
  return TOPICS.map((t) => ({
    topic: t,
    mastery: P.topicMastery(state, t.key, counts[t.key]),
    lessonsDone: Object.keys(state.topics[t.key]?.lessons || {}).filter((k) => state.topics[t.key].lessons[k]).length,
    lessonsTotal: counts[t.key].lessons,
  }));
}

export function lessonsCompletedTotal(state) {
  let n = 0;
  for (const t of TOPICS) {
    const lessons = state.topics[t.key]?.lessons || {};
    n += Object.keys(lessons).filter((k) => lessons[k]).length;
  }
  return n;
}

export function quizStats(state) {
  let correct = 0;
  let total = 0;
  for (const t of TOPICS) {
    const tk = state.topics[t.key];
    if (tk) {
      correct += tk.quizCorrect || 0;
      total += tk.quizTotal || 0;
    }
  }
  return { correct, total, accuracy: total > 0 ? Math.round((correct / total) * 100) : 0 };
}

export function interviewStats(state) {
  const entries = Object.values(state.interview || {});
  const answered = entries.length;
  const total = INTERVIEW_QUESTIONS.length;
  const avg = answered > 0
    ? Math.round(entries.reduce((a, e) => a + (e.last || 0), 0) / answered)
    : 0;
  const bestAvg = answered > 0
    ? Math.round(entries.reduce((a, e) => a + (e.best || 0), 0) / answered)
    : 0;
  return { answered, total, avg, bestAvg };
}

export function casesStats(state) {
  const entries = Object.values(state.cases || {});
  const completed = entries.filter((e) => e.completed).length;
  return { completed, total: CASE_STUDIES.length };
}

export function scenariosStats(state) {
  const entries = Object.values(state.scenarios || {});
  const correct = entries.reduce((a, e) => a + (e.correct || 0), 0);
  const total = entries.reduce((a, e) => a + (e.total || 0), 0);
  return { correct, total, accuracy: total > 0 ? Math.round((correct / total) * 100) : 0, attempted: entries.length, totalScenarios: SCENARIOS.length };
}

export function flashcardsStats(state) {
  const entries = Object.values(state.flashcards || {});
  const seen = entries.length;
  const known = entries.filter((e) => e.last === 'known').length;
  return { seen, known, total: FLASHCARDS.length };
}

export function totals() {
  return {
    lessons: LESSONS.length,
    interview: INTERVIEW_QUESTIONS.length,
    cases: CASE_STUDIES.length,
    flashcards: FLASHCARDS.length,
    scenarios: SCENARIOS.length,
  };
}

// Pomocnicze: lista lekcji dla tematu (UI)
export { lessonsByTopic };

// --- WARSTWA GRY ---

export function totalStars(state) {
  return P.totalStars(state);
}

export function starsMap(state) {
  return state.stars || {};
}

export function bestStarsFor(state, missionId) {
  return P.bestStars(state, missionId);
}

export function chapterList(state) {
  const sm = starsMap(state);
  return CHAPTERS.map((c, idx) => {
    const ms = c.missions;
    const prog = ms.reduce((a, m) => {
      const st = sm[m.id] || 0;
      a.stars += st;
      if (st > 0) a.done += 1;
      if (st === 3) a.perfect += 1;
      return a;
    }, { stars: 0, done: 0, perfect: 0 });
    return {
      topic: c.topic,
      index: idx,
      missions: ms,
      done: prog.done,
      total: ms.length,
      stars: prog.stars,
      max: ms.length * 3,
      perfect: prog.perfect,
      unlocked: isChapterUnlocked(sm, c.topic.key, idx),
    };
  });
}

export function missionListForChapter(state, topicKey) {
  const sm = starsMap(state);
  const idx = CHAPTERS.findIndex((c) => c.topic.key === topicKey);
  const chapterUnlocked = isChapterUnlocked(sm, topicKey, idx);
  return missionsByChapter(topicKey).map((m) => ({
    mission: m,
    stars: sm[m.id] || 0,
    unlocked: chapterUnlocked && isMissionUnlocked(sm, m, idx),
    chapterUnlocked,
  }));
}

export function overallMissionProgress(state) {
  const sm = starsMap(state);
  const done = MISSIONS.filter((m) => (sm[m.id] || 0) > 0).length;
  return { done, total: MISSIONS.length, stars: totalStars(state), max: MISSIONS.length * 3 };
}

export function buildAchievementStats(state) {
  const quiz = quizStats(state);
  const interview = interviewStats(state);
  const cases = casesStats(state);
  const fc = flashcardsStats(state);
  const scen = scenariosStats(state);
  const sm = starsMap(state);
  const chaptersFully3Star = CHAPTERS.filter((c) => c.missions.length > 0 && c.missions.every((m) => (sm[m.id] || 0) === 3)).length;
  const allMissionsDone = MISSIONS.every((m) => (sm[m.id] || 0) >= 1);
  const caseBestScore = Math.max(0, ...Object.values(state.cases || {}).map((c) => c.best || 0));
  return {
    totalStars: totalStars(state),
    level: P.levelFromXp(state.xp),
    streak: state.streak || 0,
    lessonsDone: lessonsCompletedTotal(state),
    quizCorrect: quiz.correct,
    interviewAnswered: interview.answered,
    interviewBestAvg: interview.bestAvg,
    casesCompleted: cases.completed,
    caseBestScore,
    flashcardsKnown: fc.known,
    scenariosCorrect: scen.correct,
    chaptersFully3Star,
    allMissionsDone,
    maxCombo: state.maxCombo || 0,
    dailyDoneToday: P.isDailyDoneToday(state),
    totalMissions: MISSIONS.length,
  };
}

export { MISSIONS, CHAPTERS, missionsByChapter, chapterMaxStars, chapterStars, isChapterUnlocked, isMissionUnlocked };
