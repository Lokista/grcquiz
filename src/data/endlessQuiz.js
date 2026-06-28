import { LESSONS } from './lessons/index.js';
import { SCENARIOS } from './scenarios.js';
import { CASE_STUDIES } from './caseStudies.js';
import { FLASHCARDS } from './flashcards.js';
import { getRichQuizExplain } from './quizRichExplains.js';

const RECENT_AVOID = 12;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function explainFromText(text) {
  if (!text) return { why: '' };
  if (typeof text === 'object') return text;
  return { why: text };
}

function lessonQuestions() {
  return LESSONS.filter((l) => l.quiz).map((l) => ({
    id: l.id,
    topicKey: l.topicKey,
    title: l.title,
    question: l.quiz.question,
    options: l.quiz.options,
    correct: l.quiz.correct,
    explain: getRichQuizExplain(l.id, l.quiz.explain),
  }));
}

function scenarioQuestions() {
  return SCENARIOS.map((sc) => ({
    id: `sc-${sc.id}`,
    topicKey: sc.topicKey,
    title: sc.title,
    question: sc.situation,
    options: sc.options.map((o) => o.text),
    correct: sc.bestIndex,
    explain: {
      why: sc.options[sc.bestIndex]?.why || '',
      audit: sc.auditorLesson || '',
    },
  }));
}

function caseSingleQuestions() {
  const out = [];
  for (const cs of CASE_STUDIES) {
    for (const q of cs.questions) {
      if (q.type !== 'single') continue;
      out.push({
        id: `${cs.id}-${q.id}`,
        topicKey: cs.topicKey,
        title: cs.title,
        question: q.prompt,
        options: q.options,
        correct: q.correct,
        explain: explainFromText(q.explain),
      });
    }
  }
  return out;
}

function flashcardQuestions() {
  return FLASHCARDS.map((card) => {
    const others = FLASHCARDS.filter((c) => c.id !== card.id);
    const distractors = shuffle(others).slice(0, 3).map((c) => c.definition);
    const options = shuffle([card.definition, ...distractors]);
    return {
      id: `fc-${card.id}`,
      topicKey: card.topicKey,
      title: card.term,
      question: `Co oznacza pojęcie: ${card.term}?`,
      options,
      correct: options.indexOf(card.definition),
      explain: {
        why: card.definition,
        traps: card.example ? `Przykład: ${card.example}` : '',
        audit: card.interview ? `Na rozmowie: ${card.interview}` : '',
      },
    };
  });
}

/** Pełna pula — lekcje, scenariusze, case (single), fiszki. Gra bez końca, z powtórkami. */
export const ENDLESS_POOL = [
  ...lessonQuestions(),
  ...scenarioQuestions(),
  ...caseSingleQuestions(),
  ...flashcardQuestions(),
];

export function pickQuestion(excludeId = null, recentIds = []) {
  let pool = ENDLESS_POOL;
  if (excludeId && pool.length > 1) {
    pool = pool.filter((q) => q.id !== excludeId);
  }
  const recent = new Set(recentIds.slice(-RECENT_AVOID));
  const fresh = pool.filter((q) => !recent.has(q.id));
  const pickFrom = fresh.length > 0 ? fresh : pool;
  return pickFrom[Math.floor(Math.random() * pickFrom.length)];
}

export const ENDLESS_UNLIMITED = true;
