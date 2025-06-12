import { Button } from '@/components/ui/button';
import StudentDashboard from '@/components/StudentDashboard';
import TeacherDashboard from '@/components/TeacherDashboard';
import DifficultySelection from '@/components/DifficultySelection';
import TopicSelection from '@/components/TopicSelection';
import OpponentSelection from '@/components/OpponentSelection';
import DebateRoom from '@/components/DebateRoom';
import PricingPage from '@/components/PricingPage';
import Resources from '@/components/Resources';
import ScoresTokens from '@/components/ScoresTokens';
import CreateCommittee from '@/components/CreateCommittee';
import LiveDebateSelection from '@/components/LiveDebateSelection';
import PublicSpeakingActivities from '@/components/PublicSpeakingActivities';

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
  selectedCommittee: any;
  selectedLiveSession: any;
  debateType: 'ai' | '1v1' | 'mun';
  selectedProcedureType: 'UNA-USA' | 'Indian Parliamentary' | null;
  selectedLanguage: string;
  selectedDebateFormat: '1v1' | '3v3';
  handlers: {
    handleStartDebate: () => void;
    handleDebateLive: () => void;
    handleJoinMUN: () => void;
    handleCreateDebateRoom: () => void;
    handleViewEvents: () => void;
    handleResources: () => void;
    handleViewTokens: () => void;
    handleDifficultySelect: (difficulty: 'Easy' | 'Medium' | 'Hard', theme: string) => void;
    handleTopicSelect: (topic: Topic) => void;
    handleOpponentSelect: (type: 'ai' | '1v1' | 'mun') => void;
    handleCommitteeSelect: (committee: any) => void;
    handleJoinLiveSession: (session: any) => void;
    handleExitDebate: () => void;
    handleBackToTopics: () => void;
    handleBackToDifficulty: () => void;
    handleProcedureSelect: (procedureType: 'UNA-USA' | 'Indian Parliamentary') => void;
    handleBackToDashboard: () => void;
    handleBackToCommittees: () => void;
    handleLiveDebateFormatSelect: (format: '1v1' | '3v3', language: string) => void;
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
  selectedLanguage,
  selectedDebateFormat,
  handlers 
}: ViewManagerProps) => {
  const {
    handleStartDebate,
    handleDebateLive,
    handleJoinMUN,
    handleCreateDebateRoom,
    handleViewEvents,
    handleResources,
    handleViewTokens,
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
    handleBackToCommittees,
    handleLiveDebateFormatSelect
  } = handlers;

  switch (currentView) {
    case 'dashboard':
      return userRole === 'student' ? (
        <StudentDashboard 
          userTokens={userTokens} 
          onStartDebate={handleStartDebate}
          onDebateLive={handleDebateLive}
          onJoinMUN={handleJoinMUN}
          onCreateDebateRoom={handleCreateDebateRoom}
          onViewEvents={handleViewEvents}
          onResources={handleResources}
          onViewTokens={handleViewTokens}
        />
      ) : (
        <TeacherDashboard />
      );

    case 'live-debate-selection':
      return (
        <LiveDebateSelection
          onFormatSelect={handleLiveDebateFormatSelect}
          onBack={handleBackToDashboard}
        />
      );

    case 'create-debate-room':
      return <CreateCommittee onBack={handleBackToDashboard} />;

    case 'events':
      return (
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎪 Recent Debate Events</h1>
              <p className="text-gray-600 mt-2">Upcoming and recent debate competitions</p>
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
          language={selectedLanguage}
          onExit={handleExitDebate}
        />
      ) : null;

    case 'pricing':
      return <PricingPage onBack={handleBackToDashboard} />;

    case 'resources':
      return <Resources onBack={handleBackToDashboard} />;

    case 'scores':
      return <ScoresTokens userTokens={userTokens} onBack={handleBackToDashboard} />;

    case 'public-speaking':
      return <PublicSpeakingActivities onBack={handleBackToDashboard} />;

    default:
      return null;
  }
};

export default ViewManager;
