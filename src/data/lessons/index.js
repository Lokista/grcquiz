import { BASICS_LESSONS } from './basics.js';
import { CONTROLS_LESSONS } from './controls.js';
import { IDENTITY_LESSONS } from './identity.js';
import { FRAMEWORKS_LESSONS } from './frameworks.js';
import { AI_LESSONS } from './ai.js';
import { TOOLS_LESSONS } from './tools.js';
import { TOPICS } from '../topics.js';

// Aby dodać lekcję: dopisz L({...}) w pliku domenowym (np. frameworks.js).
export const LESSONS = [
  ...BASICS_LESSONS,
  ...CONTROLS_LESSONS,
  ...IDENTITY_LESSONS,
  ...FRAMEWORKS_LESSONS,
  ...AI_LESSONS,
  ...TOOLS_LESSONS,
];

export const LESSON_MAP = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

export function lessonById(id) {
  return LESSON_MAP[id] || null;
}

export function lessonsByTopic(topicKey) {
  return LESSONS.filter((l) => l.topicKey === topicKey);
}

// Liczba lekcji per temat (do obliczeń mastery)
export const LESSONS_PER_TOPIC = Object.fromEntries(
  TOPICS.map((t) => [t.key, lessonsByTopic(t.key).length])
);
