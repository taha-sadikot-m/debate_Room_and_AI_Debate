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
import MunCommitteeSelection from './MunCommitteeSelection';
import MunArena from './MunArena';
import ProcedureSelection from './ProcedureSelection';
import DebatesHub from '@/components/DebatesHub';

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
    handlePublicSpeaking: () => void;
    handleDebatesHub: () => void;
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
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return userRole === 'student' ? (
          <StudentDashboard 
            userTokens={userTokens} 
            onStartDebate={handlers.handleStartDebate}
            onDebateLive={handlers.handleDebateLive}
            onJoinMUN={handlers.handleJoinMUN}
            onCreateDebateRoom={handlers.handleCreateDebateRoom}
            onViewEvents={handlers.handleViewEvents}
            onResources={handlers.handleResources}
            onViewTokens={handlers.handleViewTokens}
            onPublicSpeaking={handlers.handlePublicSpeaking}
            onDebatesHub={handlers.handleDebatesHub}
          />
        ) : (
          <TeacherDashboard />
        );

      case 'mun-mode':
        return (
          <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">🌍 Welcome to MUN Mode</h1>
              <p className="text-xl text-gray-600 mb-8">Experience Model United Nations with Gavel Bro, your AI moderator</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-200 rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="mx-auto bg-indigo-600 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                  <span className="text-3xl">🌍</span>
                </div>
                <h2 className="text-2xl font-bold text-indigo-900 mb-2">Meet Gavel Bro</h2>
                <p className="text-indigo-700">Your AI-powered MUN moderator and parliamentary procedure expert</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <h3 className="font-semibold text-indigo-800 mb-2">🌍 Global Committees</h3>
                  <p className="text-sm text-gray-600">Join UN Security Council, General Assembly, and specialized agencies</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <h3 className="font-semibold text-indigo-800 mb-2">🇮🇳 Indian Parliament</h3>
                  <p className="text-sm text-gray-600">Experience Lok Sabha and Rajya Sabha sessions with current issues</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <h3 className="font-semibold text-indigo-800 mb-2">⚖️ Real-time Moderation</h3>
                  <p className="text-sm text-gray-600">Gavel Bro ensures proper parliamentary procedures and fair debates</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <h3 className="font-semibold text-indigo-800 mb-2">🏆 Token Rewards</h3>
                  <p className="text-sm text-gray-600">Earn 25-50 tokens based on your diplomatic performance</p>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg"
                  onClick={() => handlers.handleProcedureSelect('UNA-USA')}
                >
                  Enter MUN Chambers
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Button variant="outline" onClick={handlers.handleBackToDashboard} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                Back to Dashboard
              </Button>
            </div>
          </div>
        );

      case 'live-debate-selection':
        return (
          <LiveDebateSelection
            onFormatSelect={handlers.handleLiveDebateFormatSelect}
            onBack={handlers.handleBackToDashboard}
          />
        );

      case 'create-debate-room':
        return <CreateCommittee onBack={handlers.handleBackToDashboard} />;

      case 'events':
        return (
          <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">🎪 Recent Debate Events</h1>
                <p className="text-gray-600 mt-2">Upcoming and recent debate competitions</p>
              </div>
              <Button variant="outline" onClick={handlers.handleBackToDashboard}>
                Back
              </Button>
            </div>
            <div className="text-center text-gray-500 mt-20">
              <p>Events feature coming soon!</p>
            </div>
          </div>
        );

      case 'difficulty':
        return <DifficultySelection onDifficultySelect={handlers.handleDifficultySelect} onBack={handlers.handleBackToDashboard} />;

      case 'topics':
        return (
          <TopicSelection 
            difficulty={selectedDifficulty}
            theme={selectedTheme}
            onTopicSelect={handlers.handleTopicSelect}
            onBack={handlers.handleBackToDifficulty}
          />
        );

      case 'opponents':
        return selectedTopic ? (
          <OpponentSelection 
            topic={selectedTopic}
            onOpponentSelect={handlers.handleOpponentSelect}
            onBack={handlers.handleBackToTopics}
          />
        ) : null;

      case 'debate':
        return selectedTopic ? (
          <DebateRoom 
            debateType={debateType}
            topic={selectedTopic.title}
            language={selectedLanguage}
            onExit={handlers.handleExitDebate}
          />
        ) : null;

      case 'debates-hub':
        return <DebatesHub onBack={handlers.handleBackToDashboard} />;

      case 'pricing':
        return <PricingPage onBack={handlers.handleBackToDashboard} />;

      case 'resources':
        return <Resources onBack={handlers.handleBackToDashboard} />;

      case 'scores':
        return <ScoresTokens userTokens={userTokens} onBack={handlers.handleBackToDashboard} />;

      case 'public-speaking':
        return <PublicSpeakingActivities onBack={handlers.handleBackToDashboard} />;

      case 'procedure-selection':
        return <ProcedureSelection onProcedureSelect={handlers.handleProcedureSelect} onBack={handlers.handleBackToDashboard} />;

      case 'mun-committees':
        return (
          <MunCommitteeSelection
            onCommitteeSelect={handlers.handleCommitteeSelect}
            onJoinLiveSession={handlers.handleJoinLiveSession}
            onBack={handlers.handleBackToDashboard}
          />
        );

      case 'mun':
        return (
          <MunArena
            committee={selectedCommittee}
            liveSession={selectedLiveSession}
            onExit={handlers.handleExitDebate}
            onBackToCommittees={handlers.handleBackToCommittees}
          />
        );

      default:
        return null;
    }
  };

  return renderView();
};

export default ViewManager;
