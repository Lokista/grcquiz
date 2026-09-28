import { lazy, Suspense } from 'react';
import { ProgressProvider } from './state/ProgressContext.jsx';
import { NavProvider, useNav } from './state/NavContext.jsx';
import { MissionProvider } from './state/MissionContext.jsx';
import Layout from './components/Layout.jsx';
import QuestMap from './components/QuestMap.jsx';
import ChapterView from './components/ChapterView.jsx';
import DailyChallenge from './components/DailyChallenge.jsx';
import Achievements from './components/Achievements.jsx';
import TrackPicker from './components/TrackPicker.jsx';
import { TrackProvider, useTrack } from './state/TrackContext.jsx';
import { SecopsProvider } from './state/SecopsContext.jsx';

/** Core game views stay eager; free-mode / heavy drills lazy for smaller initial JS. */
const LearnModule = lazy(() => import('./modules/LearnModule.jsx'));
const InterviewModule = lazy(() => import('./modules/InterviewModule.jsx'));
const CaseStudyModule = lazy(() => import('./modules/CaseStudyModule.jsx'));
const FlashcardsModule = lazy(() => import('./modules/FlashcardsModule.jsx'));
const ThinkLikeAuditorModule = lazy(() => import('./modules/ThinkLikeAuditorModule.jsx'));
const EndlessQuizModule = lazy(() => import('./modules/EndlessQuizModule.jsx'));
const ProgressModule = lazy(() => import('./modules/ProgressModule.jsx'));
const MockInterviewModule = lazy(() => import('./modules/MockInterviewModule.jsx'));
const BlindFindingModule = lazy(() => import('./modules/BlindFindingModule.jsx'));
const RequestListModule = lazy(() => import('./modules/RequestListModule.jsx'));
const ExamModule = lazy(() => import('./modules/ExamModule.jsx'));
const ProWordsModule = lazy(() => import('./modules/ProWordsModule.jsx'));
const FrameworkPickerModule = lazy(() => import('./modules/FrameworkPickerModule.jsx'));
const SeverityCalibratorModule = lazy(() => import('./modules/SeverityCalibratorModule.jsx'));
const CheatSheetModule = lazy(() => import('./modules/CheatSheetModule.jsx'));
const SodFinderModule = lazy(() => import('./modules/SodFinderModule.jsx'));
const EvidenceWalkthroughModule = lazy(() => import('./modules/EvidenceWalkthroughModule.jsx'));
const ControlMappingModule = lazy(() => import('./modules/ControlMappingModule.jsx'));
const ExceptionClassifierModule = lazy(() => import('./modules/ExceptionClassifierModule.jsx'));
const ManagerToneModule = lazy(() => import('./modules/ManagerToneModule.jsx'));
const SamplingDrillModule = lazy(() => import('./modules/SamplingDrillModule.jsx'));
const ProcessTimelineModule = lazy(() => import('./modules/ProcessTimelineModule.jsx'));
const InterviewDayPlanModule = lazy(() => import('./modules/InterviewDayPlanModule.jsx'));
const WeakTopicTrainerModule = lazy(() => import('./modules/WeakTopicTrainerModule.jsx'));
const FindingTriageModule = lazy(() => import('./modules/FindingTriageModule.jsx'));
const PolicyPracticeModule = lazy(() => import('./modules/PolicyPracticeModule.jsx'));
const RiskRegisterModule = lazy(() => import('./modules/RiskRegisterModule.jsx'));
const SoaApplicabilityModule = lazy(() => import('./modules/SoaApplicabilityModule.jsx'));
const SecopsHome = lazy(() => import('./modules/secops/SecopsHome.jsx'));
const SecopsPlay = lazy(() => import('./modules/secops/SecopsPlay.jsx'));

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="rounded-xl border border-ink-700/60 bg-ink-850/60 px-5 py-4 text-sm text-slate-400">
        Ładowanie modułu…
      </div>
    </div>
  );
}

function Router() {
  const { view, params } = useNav();
  const { track } = useTrack();
  let page;
  switch (view) {
    case 'chapter': page = <ChapterView />; break;
    case 'daily': page = <DailyChallenge />; break;
    case 'achievements': page = <Achievements />; break;
    case 'endless': page = <EndlessQuizModule />; break;
    case 'stats': page = <ProgressModule />; break;
    case 'learn': page = <LearnModule />; break;
    case 'interview': page = <InterviewModule />; break;
    case 'cases': page = <CaseStudyModule />; break;
    case 'flashcards': page = <FlashcardsModule />; break;
    case 'think': page = <ThinkLikeAuditorModule />; break;
    case 'mock': page = <MockInterviewModule />; break;
    case 'blind': page = <BlindFindingModule />; break;
    case 'requestlist': page = <RequestListModule />; break;
    case 'exam': page = <ExamModule />; break;
    case 'prowords': page = <ProWordsModule />; break;
    case 'frameworks': page = <FrameworkPickerModule />; break;
    case 'severity': page = <SeverityCalibratorModule />; break;
    case 'cheatsheet': page = <CheatSheetModule />; break;
    case 'sod': page = <SodFinderModule />; break;
    case 'evidence': page = <EvidenceWalkthroughModule />; break;
    case 'controlmap': page = <ControlMappingModule />; break;
    case 'classify': page = <ExceptionClassifierModule />; break;
    case 'manager': page = <ManagerToneModule />; break;
    case 'sampling': page = <SamplingDrillModule />; break;
    case 'timeline': page = <ProcessTimelineModule />; break;
    case 'dayplan': page = <InterviewDayPlanModule />; break;
    case 'weak': page = <WeakTopicTrainerModule />; break;
    case 'triage': page = <FindingTriageModule />; break;
    case 'policy': page = <PolicyPracticeModule />; break;
    case 'risk': page = <RiskRegisterModule />; break;
    case 'soa': page = <SoaApplicabilityModule />; break;
    case 'tracks': page = <TrackPicker embedded />; break;
    case 'sec': page = <SecopsHome />; break;
    case 'sec-stage': case 'sec-quick': case 'sec-giga': case 'sec-exam': case 'sec-review':
      page = <SecopsPlay key={view + JSON.stringify(params)} mode={view === 'sec-stage' ? 'stage' : view.slice(4)} stageId={params.stageId} />;
      break;
    case 'quest':
    default: page = track === 'secops' ? <SecopsHome /> : <QuestMap />; break;
  }

  const eager = view === 'chapter' || view === 'daily' || view === 'achievements' || view === 'tracks' || ((view === 'quest' || !view) && track !== 'secops');
  if (eager) return page;
  return <Suspense fallback={<RouteFallback />}>{page}</Suspense>;
}

function Shell() {
  const { track } = useTrack();
  if (!track) return <TrackPicker />;
  return (
    <Layout>
      <Router />
    </Layout>
  );
}

export default function App() {
  return (
    <TrackProvider>
      <ProgressProvider>
        <SecopsProvider>
          <NavProvider>
            <MissionProvider>
              <Shell />
            </MissionProvider>
          </NavProvider>
        </SecopsProvider>
      </ProgressProvider>
    </TrackProvider>
  );
}
