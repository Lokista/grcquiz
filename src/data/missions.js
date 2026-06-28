import {
  BookOpen, Layers, Brain, Ghost, GraduationCap, Swords, Star, Target,
} from 'lucide-react';
import { TOPICS, topicByKey } from './topics.js';
import { lessonsByTopic, lessonById } from './lessons/index.js';
import { flashcardsByTopic } from './flashcards.js';
import { SCENARIOS, scenarioById } from './scenarios.js';
import { CASE_STUDIES, caseById } from './caseStudies.js';
import { INTERVIEW_QUESTIONS } from './interview.js';

// Typy misji i ich metadane
export const MISSION_TYPES = {
  lesson: { label: 'Lekcja', icon: BookOpen, accent: 'blue' },
  drill: { label: 'Trening', icon: Layers, accent: 'cyan' },
  scenario: { label: 'Sytuacja', icon: Brain, accent: 'violet' },
  case: { label: 'Boss', icon: Ghost, accent: 'rose' },
  exam: { label: 'Egzamin', icon: GraduationCap, accent: 'amber' },
};

// Reguły gwiazdek — zawsze nagroda za ukończenie, bez kar (szybka progresja)
export function starsFor(type, metric) {
  void type;
  void metric;
  return 3;
}

// Buduj kampanię: dla każdego tematu (rozdziału) list misji w kolejności:
// lekcje → trening fiszek → sytuacje → boss (case) → egzamin (interview).
function buildCampaign() {
  const chapters = [];
  for (const t of TOPICS) {
    const missions = [];
    const lessons = lessonsByTopic(t.key);
    lessons.forEach((l) => {
      missions.push({
        id: `m-lesson-${l.id}`,
        chapterKey: t.key,
        type: 'lesson',
        title: l.title,
        subtitle: 'Lekcja + mini-quiz',
        contentId: l.id,
        route: { view: 'learn', params: { missionId: `m-lesson-${l.id}` } },
      });
    });
    if (flashcardsByTopic(t.key).length > 0) {
      missions.push({
        id: `m-drill-${t.key}`,
        chapterKey: t.key,
        type: 'drill',
        title: `Trening fiszek: ${t.label}`,
        subtitle: `${flashcardsByTopic(t.key).length} pojęć`,
        contentId: t.key,
        route: { view: 'flashcards', params: { missionId: `m-drill-${t.key}` } },
      });
    }
    SCENARIOS.filter((s) => s.topicKey === t.key).forEach((s) => {
      missions.push({
        id: `m-scenario-${s.id}`,
        chapterKey: t.key,
        type: 'scenario',
        title: s.title,
        subtitle: 'Wybierz reakcję audytora',
        contentId: s.id,
        route: { view: 'think', params: { missionId: `m-scenario-${s.id}` } },
      });
    });
    const cc = CASE_STUDIES.find((c) => c.topicKey === t.key);
    if (cc) {
      missions.push({
        id: `m-case-${cc.id}`,
        chapterKey: t.key,
        type: 'case',
        title: `Boss: ${cc.title}`,
        subtitle: 'Case study — pełna analiza',
        contentId: cc.id,
        route: { view: 'cases', params: { missionId: `m-case-${cc.id}` } },
      });
    }
    const iqs = INTERVIEW_QUESTIONS.filter((q) => q.topicKey === t.key);
    if (iqs.length > 0) {
      missions.push({
        id: `m-exam-${t.key}`,
        chapterKey: t.key,
        type: 'exam',
        title: `Egzamin: ${t.label}`,
        subtitle: `${iqs.length} pytań rekrutacyjnych`,
        contentId: t.key,
        route: { view: 'interview', params: { missionId: `m-exam-${t.key}` } },
      });
    }
    chapters.push({ topic: t, missions });
  }
  return chapters;
}

export const CHAPTERS = buildCampaign();

export const MISSIONS = CHAPTERS.flatMap((c) => c.missions);
export const MISSION_MAP = Object.fromEntries(MISSIONS.map((m) => [m.id, m]));

export function missionById(id) { return MISSION_MAP[id] || null; }

export function missionsByChapter(topicKey) {
  const c = CHAPTERS.find((x) => x.topic.key === topicKey);
  return c ? c.missions : [];
}

export function chapterByKey(topicKey) {
  return CHAPTERS.find((c) => c.topic.key === topicKey) || null;
}

// Rozwiązanie treści misji (do użycia przez moduły)
export function resolveMissionContent(mission) {
  if (!mission) return null;
  switch (mission.type) {
    case 'lesson': return { lesson: lessonById(mission.contentId) };
    case 'drill': return { cards: flashcardsByTopic(mission.contentId), queue: flashcardsByTopic(mission.contentId).map((c) => c.id) };
    case 'scenario': return { scenario: scenarioById(mission.contentId), queue: [mission.contentId] };
    case 'case': return { caseStudy: caseById(mission.contentId) };
    case 'exam': return { questions: INTERVIEW_QUESTIONS.filter((q) => q.topicKey === mission.contentId), queue: INTERVIEW_QUESTIONS.filter((q) => q.topicKey === mission.contentId).map((q) => q.id) };
    default: return null;
  }
}

// --- Gwiazdki / odblokowywanie (czyste, na podstawie mapy gwiazdek) ---

export function chapterMaxStars(topicKey) {
  return missionsByChapter(topicKey).length * 3;
}

export function chapterStars(starsMap, topicKey) {
  return missionsByChapter(topicKey).reduce((a, m) => a + (starsMap[m.id] || 0), 0);
}

export function chapterProgress(starsMap, topicKey) {
  const ms = missionsByChapter(topicKey);
  const done = ms.filter((m) => (starsMap[m.id] || 0) > 0).length;
  return { done, total: ms.length, stars: chapterStars(starsMap, topicKey), max: ms.length * 3 };
}

// Rozdział odblokowany: pierwszy zawsze; następny gdy poprzedni ma ≥1 ukończoną misję
export function isChapterUnlocked(starsMap, topicKey, chapterIndex) {
  if (chapterIndex <= 0) return true;
  const prev = CHAPTERS[chapterIndex - 1];
  if (!prev) return true;
  return missionsByChapter(prev.topic.key).some((m) => (starsMap[m.id] || 0) > 0);
}

// Misja odblokowana: pierwsza w rozdziale (jeśli rozdział odblokowany); kolejne gdy poprzednia ma >=1 gwiazdkę
export function isMissionUnlocked(starsMap, mission, chapterIndex) {
  if (!isChapterUnlocked(starsMap, mission.chapterKey, chapterIndex)) return false;
  const ms = missionsByChapter(mission.chapterKey);
  const idx = ms.findIndex((m) => m.id === mission.id);
  if (idx <= 0) return true;
  return (starsMap[ms[idx - 1].id] || 0) >= 1;
}

export function nextMission(mission) {
  if (!mission) return null;
  const ms = missionsByChapter(mission.chapterKey);
  const idx = ms.findIndex((m) => m.id === mission.id);
  if (idx < 0 || idx + 1 >= ms.length) {
    // następny rozdział, pierwsza misja
    const cIdx = CHAPTERS.findIndex((c) => c.topic.key === mission.chapterKey);
    if (cIdx + 1 < CHAPTERS.length) return CHAPTERS[cIdx + 1].missions[0] || null;
    return null;
  }
  return ms[idx + 1];
}

export { topicByKey, Star, Target, Swords };
export const MISSION_ICONS = { BookOpen, Layers, Brain, Ghost, GraduationCap, Swords, Star, Target };
