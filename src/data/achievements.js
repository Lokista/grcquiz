import {
  Star, Flame, Zap, BookOpen, HelpCircle, MessagesSquare, Briefcase,
  Layers, Brain, Trophy, Target, Crown, ShieldCheck, Award, GraduationCap,
} from 'lucide-react';

// Definicje odznak. check(stats) -> bool. stats liczone w selectors.buildAchievementStats.
export const ACHIEVEMENTS = [
  { id: 'first_star', title: 'Pierwsza gwiazdka', desc: 'Zdobądź swoją pierwszą gwiazdkę.', icon: Star, check: (s) => s.totalStars >= 1 },
  { id: 'ten_stars', title: 'Zaczynamy grę', desc: 'Zdobądź 10 gwiazdek.', icon: Zap, check: (s) => s.totalStars >= 10 },
  { id: 'fifty_stars', title: 'Gwiazdor', desc: 'Zdobądź 50 gwiazdek.', icon: Star, check: (s) => s.totalStars >= 50 },
  { id: 'hundred_stars', title: 'Gwiezdny audytor', desc: 'Zdobądź 100 gwiazdek.', icon: Crown, check: (s) => s.totalStars >= 100 },
  { id: 'first_lesson', title: 'Pierwsza lekcja', desc: 'Ukończ pierwszą lekcję.', icon: BookOpen, check: (s) => s.lessonsDone >= 1 },
  { id: 'scholar', title: 'Uczeń', desc: 'Ukończ 20 lekcji.', icon: BookOpen, check: (s) => s.lessonsDone >= 20 },
  { id: 'quiz_master', title: 'Mistrz quizów', desc: 'Odpowiedz poprawnie na 20 quizów.', icon: HelpCircle, check: (s) => s.quizCorrect >= 20 },
  { id: 'interview_ready', title: 'Gotowy do rozmowy', desc: 'Odpowiedz na 10 pytań rekrutacyjnych.', icon: MessagesSquare, check: (s) => s.interviewAnswered >= 10 },
  { id: 'interview_pro', title: 'Pro rozmowy', desc: 'Osiągnij średnią najlepszych ≥80% na ≥5 pytaniach.', icon: MessagesSquare, check: (s) => s.interviewBestAvg >= 80 && s.interviewAnswered >= 5 },
  { id: 'case_solver', title: 'Rozwiązywacz case’ów', desc: 'Ukończ pierwszy case study.', icon: Briefcase, check: (s) => s.casesCompleted >= 1 },
  { id: 'case_master', title: 'Mistrz case’ów', desc: 'Zdobądź 3 gwiazdki w case study (≥80%).', icon: Briefcase, check: (s) => s.caseBestScore >= 80 },
  { id: 'flashcard_pro', title: 'Pojęciowy', desc: 'Oznacz 15 fiszek jako znane.', icon: Layers, check: (s) => s.flashcardsKnown >= 15 },
  { id: 'think_auditor', title: 'Myśl jak audytor', desc: 'Odpowiedz poprawnie na 6 scenariuszy.', icon: Brain, check: (s) => s.scenariosCorrect >= 6 },
  { id: 'combo_5', title: 'Combo x5', desc: 'Osiągnij combo 5 poprawnych z rzędu.', icon: Zap, check: (s) => s.maxCombo >= 5 },
  { id: 'streak_3', title: 'Seria 3 dni', desc: 'Ćwicz 3 dni z rzędu.', icon: Flame, check: (s) => s.streak >= 3 },
  { id: 'streak_7', title: 'Seria 7 dni', desc: 'Ćwicz 7 dni z rzędu.', icon: Flame, check: (s) => s.streak >= 7 },
  { id: 'level_5', title: 'Awans', desc: 'Osiągnij 5 poziom.', icon: ShieldCheck, check: (s) => s.level >= 5 },
  { id: 'level_10', title: 'Senior', desc: 'Osiągnij 10 poziom.', icon: Trophy, check: (s) => s.level >= 10 },
  { id: 'chapter_3star', title: 'Perfekcyjny rozdział', desc: 'Zdobądź 3 gwiazdki we wszystkich misjach jakiegoś rozdziału.', icon: Award, check: (s) => s.chaptersFully3Star >= 1 },
  { id: 'daily_first', title: 'Wyzwanie dnia', desc: 'Ukończ dzisiejsze wyzwanie.', icon: Target, check: (s) => s.dailyDoneToday },
  { id: 'all_done', title: 'Komplet', desc: 'Ukończ wszystkie misje (≥1 gwiazdka).', icon: GraduationCap, check: (s) => s.allMissionsDone },
];

export const ACHIEVEMENT_MAP = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

export function achievementById(id) { return ACHIEVEMENT_MAP[id] || null; }

// Zwraca listę ID nowo odblokowanych odznak (check true, a nie były w state.achievements)
export function checkAchievements(state, stats) {
  const owned = new Set(state.achievements || []);
  const newly = [];
  for (const a of ACHIEVEMENTS) {
    if (!owned.has(a.id) && a.check(stats)) newly.push(a.id);
  }
  return newly;
}
