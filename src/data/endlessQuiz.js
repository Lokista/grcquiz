import { LESSONS } from './lessons/index.js';
import { SCENARIOS } from './scenarios.js';
import { CASE_STUDIES } from './caseStudies.js';
import { FLASHCARDS } from './flashcards.js';
import { getRichQuizExplain } from './quizRichExplains.js';
import { ENDLESS_EXTRA_MCQ } from './endless/extraMcq.js';
import { ENDLESS_ORDER_QUESTIONS } from './endless/orderQuestions.js';
import { ENDLESS_BUCKET_QUESTIONS } from './endless/bucketQuestions.js';
import { createEndlessSession, pickFromDeck, deckProgress, refillDeck } from './endless/deck.js';

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

function asChoice(q) {
  return { type: 'choice', ...q };
}

function lessonQuestions() {
  return LESSONS.filter((l) => l.quiz).map((l) => asChoice({
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
  return SCENARIOS.map((sc) => asChoice({
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
      out.push(asChoice({
        id: `${cs.id}-${q.id}`,
        topicKey: cs.topicKey,
        title: cs.title,
        question: q.prompt,
        options: q.options,
        correct: q.correct,
        explain: explainFromText(q.explain),
      }));
    }
  }
  return out;
}

function flashcardQuestions() {
  return FLASHCARDS.map((card) => {
    const others = FLASHCARDS.filter((c) => c.id !== card.id);
    const distractors = shuffle(others).slice(0, 3).map((c) => c.definition);
    const options = shuffle([card.definition, ...distractors]);
    return asChoice({
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
    });
  });
}

function extraMcqQuestions() {
  return ENDLESS_EXTRA_MCQ.map((q) => asChoice(q));
}

function orderQuestions() {
  return ENDLESS_ORDER_QUESTIONS.map((q) => ({ ...q, type: 'order' }));
}

function bucketQuestions() {
  return ENDLESS_BUCKET_QUESTIONS.map((q) => ({ ...q, type: 'bucket' }));
}

/** Pełna pula — ~180+ unikalnych pytań, talia bez powtórki do wyczerpania. */
export const ENDLESS_POOL = [
  ...lessonQuestions(),
  ...extraMcqQuestions(),
  ...scenarioQuestions(),
  ...caseSingleQuestions(),
  ...flashcardQuestions(),
  ...orderQuestions(),
  ...bucketQuestions(),
];

export const ENDLESS_POOL_BY_ID = Object.fromEntries(ENDLESS_POOL.map((q) => [q.id, q]));

export { createEndlessSession, deckProgress, refillDeck };

export function initEndlessSession(session) {
  refillDeck(session, ENDLESS_POOL.map((q) => q.id));
}

export function pickQuestion(session) {
  if (!session.deck.length) {
    initEndlessSession(session);
  }
  return pickFromDeck(session, ENDLESS_POOL_BY_ID);
}

export function formatCorrectAnswer(q) {
  if (q.type === 'order') {
    return q.correctOrder.map((idx, i) => `${i + 1}. ${q.items[idx]}`).join(' → ');
  }
  if (q.type === 'bucket') {
    return q.buckets.map((name, bi) => {
      const items = q.items.filter((it) => it.bucket === bi).map((it) => it.text);
      return `${name}: ${items.join('; ')}`;
    }).join(' | ');
  }
  return q.options[q.correct];
}

export const ENDLESS_UNLIMITED = true;
