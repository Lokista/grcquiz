import { ProgressProvider } from './state/ProgressContext.jsx';
import { NavProvider, useNav } from './state/NavContext.jsx';
import { MissionProvider } from './state/MissionContext.jsx';
import Layout from './components/Layout.jsx';
import QuestMap from './components/QuestMap.jsx';
import ChapterView from './components/ChapterView.jsx';
import DailyChallenge from './components/DailyChallenge.jsx';
import Achievements from './components/Achievements.jsx';
import LearnModule from './modules/LearnModule.jsx';
import InterviewModule from './modules/InterviewModule.jsx';
import CaseStudyModule from './modules/CaseStudyModule.jsx';
import FlashcardsModule from './modules/FlashcardsModule.jsx';
import ThinkLikeAuditorModule from './modules/ThinkLikeAuditorModule.jsx';
import EndlessQuizModule from './modules/EndlessQuizModule.jsx';
import ProgressModule from './modules/ProgressModule.jsx';

function Router() {
  const { view } = useNav();
  switch (view) {
    case 'chapter': return <ChapterView />;
    case 'daily': return <DailyChallenge />;
    case 'achievements': return <Achievements />;
    case 'endless': return <EndlessQuizModule />;
    case 'stats': return <ProgressModule />;
    case 'learn': return <LearnModule />;
    case 'interview': return <InterviewModule />;
    case 'cases': return <CaseStudyModule />;
    case 'flashcards': return <FlashcardsModule />;
    case 'think': return <ThinkLikeAuditorModule />;
    case 'quest':
    default: return <QuestMap />;
  }
}

export default function App() {
  return (
    <ProgressProvider>
      <NavProvider>
        <MissionProvider>
          <Layout>
            <Router />
          </Layout>
        </MissionProvider>
      </NavProvider>
    </ProgressProvider>
  );
}
