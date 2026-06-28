// Wspólny "kształt" rekordów danych — normalizacja + czytelność w plikach treści.
// Aby dodać lekcję: dopisz obiekt przez L({...}) w odpowiednim pliku domenowym.

export function L(o) {
  if (!o.id || !o.topicKey || !o.title) {
    throw new Error('Lekcja wymaga id, topicKey, title');
  }
  return {
    id: o.id,
    topicKey: o.topicKey,
    title: o.title,
    minutes: o.minutes || 6,
    definition: o.definition || '',
    example: o.example || '',
    interviewAnswer: o.interviewAnswer || '',
    commonMistakes: o.commonMistakes || [],
    quiz: o.quiz || null, // { question, options[], correct, explain }
  };
}

// Fiszka
export function F(o) {
  if (!o.id || !o.topicKey || !o.term) {
    throw new Error('Fiszka wymaga id, topicKey, term');
  }
  return {
    id: o.id,
    topicKey: o.topicKey,
    term: o.term,
    definition: o.definition || '',
    example: o.example || '',
    interview: o.interview || '',
  };
}

// Pytanie rekrutacyjne (ocena przez dopasowanie do kluczowych punktów)
export function I(o) {
  if (!o.id || !o.topicKey || !o.question || !o.keyPoints) {
    throw new Error('Pytanie wymaga id, topicKey, question, keyPoints');
  }
  return {
    id: o.id,
    topicKey: o.topicKey,
    difficulty: o.difficulty || 'tech', // 'soft' | 'tech' | 'mixed'
    question: o.question,
    keyPoints: o.keyPoints, // [{ label, keywords: [string, ...] }]
    idealAnswer: o.idealAnswer || '',
    whyGood: o.whyGood || '',
    commonMistakes: o.commonMistakes || [],
    followUp: o.followUp || null,
  };
}

// Case study — scenariusz + pytania strukturyzowane + analiza wzorcowa.
export function C(o) {
  if (!o.id || !o.topicKey || !o.title || !o.questions) {
    throw new Error('Case study wymaga id, topicKey, title, questions');
  }
  return {
    id: o.id,
    topicKey: o.topicKey,
    title: o.title,
    difficulty: o.difficulty || 'junior',
    minutes: o.minutes || 12,
    scenario: o.scenario || { context: '', facts: [] },
    questions: o.questions, // [{ id, type, prompt, options, correct, points, explain }]
    modelAnalysis: o.modelAnalysis || '',
  };
}

// Każda odpowiedź = pełne punkty (gra bez kar i odejmowania).
export function scoreCaseQuestion(q, selected) {
  if (selected === undefined || selected === null) return 0;
  if (Array.isArray(selected) && selected.length === 0) return 0;
  return q.points;
}
