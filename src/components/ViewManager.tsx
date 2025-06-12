
import { Button } from '@/components/ui/button';
import StudentDashboard from '@/components/StudentDashboard';
import TeacherDashboard from '@/components/TeacherDashboard';
import DifficultySelection from '@/components/DifficultySelection';
import TopicSelection from '@/components/TopicSelection';
import OpponentSelection from '@/components/OpponentSelection';
import DebateRoom from '@/components/DebateRoom';
import MunCommitteeSelection from '@/components/MunCommitteeSelection';
import MunArena from '@/components/MunArena';
import PricingPage from '@/components/PricingPage';
import Resources from '@/components/Resources';
import ScoresTokens from '@/components/ScoresTokens';
import ProcedureSelection from '@/components/ProcedureSelection';
import RulesPage from '@/components/RulesPage';
import ForeignPolicyLearning from '@/components/ForeignPolicyLearning';
import CreateCommittee from '@/components/CreateCommittee';
import { MunCommittee, LiveMunSession } from '@/data/munCommittees';

interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeEstimate: string;
  theme: string;
  aiArguments: {
    pro: string[];
    con: string[];
  };
}

interface ViewManagerProps {
  currentView: string;
  userRole: 'student' | 'teacher';
  userTokens: number;
  selectedTopic: Topic | null;
  selectedDifficulty: 'Easy' | 'Medium' | 'Hard';
  selectedTheme: string;
  selectedCommittee: MunCommittee | null;
  selectedLiveSession: LiveMunSession | null;
  debateType: 'ai' | '1v1' | 'mun';
  selectedProcedureType: 'UNA-USA' | 'Indian Parliamentary' | null;
  handlers: {
    handleStartDebate: () => void;
    handleJoinMUN: () => void;
    handleCreateDebateRoom: () => void;
    handleViewEvents: () => void;
    handleResources: () => void;
    handleDifficultySelect: (difficulty: 'Easy' | 'Medium' | 'Hard', theme: string) => void;
    handleTopicSelect: (topic: Topic) => void;
    handleOpponentSelect: (type: 'ai' | '1v1' | 'mun') => void;
    handleCommitteeSelect: (committee: MunCommittee) => void;
    handleJoinLiveSession: (session: LiveMunSession) => void;
    handleExitDebate: () => void;
    handleBackToTopics: () => void;
    handleBackToDifficulty: () => void;
    handleProcedureSelect: (procedureType: 'UNA-USA' | 'Indian Parliamentary') => void;
    handleBackToDashboard: () => void;
    handleBackToCommittees: () => void;
  };
}

const ViewManager = ({ 
  currentView, 
  userRole, 
  userTokens, 
  selectedTopic, 
  selectedDifficulty, 
  selectedTheme, 
  selectedCommittee, 
  selectedLiveSession, 
  debateType, 
  selectedProcedureType,
  handlers 
}: ViewManagerProps) => {
  const {
    handleStartDebate,
    handleJoinMUN,
    handleCreateDebateRoom,
    handleViewEvents,
    handleResources,
    handleDifficultySelect,
    handleTopicSelect,
    handleOpponentSelect,
    handleCommitteeSelect,
    handleJoinLiveSession,
    handleExitDebate,
    handleBackToTopics,
    handleBackToDifficulty,
    handleProcedureSelect,
    handleBackToDashboard,
    handleBackToCommittees
  } = handlers;

  switch (currentView) {
    case 'dashboard':
      return userRole === 'student' ? (
        <StudentDashboard 
          userTokens={userTokens} 
          onStartDebate={handleStartDebate}
          onJoinMUN={handleJoinMUN}
          onCreateDebateRoom={handleCreateDebateRoom}
          onViewEvents={handleViewEvents}
          onResources={handleResources}
        />
      ) : (
        <TeacherDashboard />
      );

    case 'create-debate-room':
      return <CreateCommittee onBack={handleBackToDashboard} />;

    case 'events':
      return (
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎪 Recent MUN Events</h1>
              <p className="text-gray-600 mt-2">Upcoming and recent Model UN conferences</p>
            </div>
            <Button variant="outline" onClick={handleBackToDashboard}>
              Back
            </Button>
          </div>
          <div className="text-center text-gray-500 mt-20">
            <p>Events feature coming soon!</p>
          </div>
        </div>
      );

    case 'procedure-selection':
      return <ProcedureSelection onProcedureSelect={handleProcedureSelect} onBack={handleBackToDashboard} />;

    case 'rules':
      return <RulesPage procedureType={selectedProcedureType} onBack={handleBackToDashboard} />;

    case 'foreign-policy':
      return <ForeignPolicyLearning onBack={handleBackToDashboard} />;

    case 'create-committee':
      return <CreateCommittee onBack={handleBackToDashboard} />;

    case 'difficulty':
      return <DifficultySelection onDifficultySelect={handleDifficultySelect} onBack={handleBackToDashboard} />;

    case 'topics':
      return (
        <TopicSelection 
          difficulty={selectedDifficulty}
          theme={selectedTheme}
          onTopicSelect={handleTopicSelect}
          onBack={handleBackToDifficulty}
        />
      );

    case 'opponents':
      return selectedTopic ? (
        <OpponentSelection 
          topic={selectedTopic}
          onOpponentSelect={handleOpponentSelect}
          onBack={handleBackToTopics}
        />
      ) : null;

    case 'debate':
      return selectedTopic ? (
        <DebateRoom 
          debateType={debateType}
          topic={selectedTopic.title}
          onExit={handleExitDebate}
        />
      ) : null;

    case 'mun-committees':
      return (
        <MunCommitteeSelection
          onCommitteeSelect={handleCommitteeSelect}
          onJoinLiveSession={handleJoinLiveSession}
          onBack={handleBackToDashboard}
        />
      );

    case 'mun':
      return (
        <MunArena 
          committee={selectedCommittee || undefined}
          liveSession={selectedLiveSession || undefined}
          onExit={handleExitDebate}
          onBackToCommittees={handleBackToCommittees}
        />
      );

    case 'pricing':
      return <PricingPage onBack={handleBackToDashboard} />;

    case 'resources':
      return <Resources onBack={handleBackToDashboard} />;

    case 'scores':
      return <ScoresTokens userTokens={userTokens} onBack={handleBackToDashboard} />;

    default:
      return null;
  }
};

export default ViewManager;
