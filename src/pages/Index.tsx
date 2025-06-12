import { useState } from 'react';
import Navigation from '@/components/Navigation';
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

// Mock user object for navigation - fixed to match User type
const mockUser = {
  id: 'mock-user-id',
  email: 'user@example.com',
  user_metadata: {
    full_name: 'Demo User'
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString()
};

const Index = () => {
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [userTokens, setUserTokens] = useState(156);
  const [currentView, setCurrentView] = useState<'dashboard' | 'difficulty' | 'topics' | 'opponents' | 'debate' | 'mun-committees' | 'mun' | 'pricing' | 'resources' | 'scores' | 'procedure-selection' | 'rules' | 'foreign-policy' | 'create-committee' | 'create-debate-room' | 'events'>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedCommittee, setSelectedCommittee] = useState<MunCommittee | null>(null);
  const [selectedLiveSession, setSelectedLiveSession] = useState<LiveMunSession | null>(null);
  const [debateType, setDebateType] = useState<'ai' | '1v1' | 'mun'>('ai');
  const [selectedProcedureType, setSelectedProcedureType] = useState<'UNA-USA' | 'Indian Parliamentary' | null>(null);

  const handleStartDebate = () => {
    setCurrentView('difficulty');
  };

  const handleJoinMUN = () => {
    setCurrentView('procedure-selection');
  };

  const handleCreateDebateRoom = () => {
    setCurrentView('create-debate-room');
  };

  const handleViewEvents = () => {
    setCurrentView('events');
  };

  const handleViewScores = () => {
    setCurrentView('scores');
  };

  const handleResources = () => {
    setCurrentView('resources');
  };

  const handleDifficultySelect = (difficulty: 'Easy' | 'Medium' | 'Hard', theme: string) => {
    setSelectedDifficulty(difficulty);
    setSelectedTheme(theme);
    setCurrentView('topics');
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentView('opponents');
  };

  const handleOpponentSelect = (type: 'ai' | '1v1' | 'mun') => {
    setDebateType(type);
    if (type === 'mun') {
      setCurrentView('mun-committees');
    } else {
      setCurrentView('debate');
    }
  };

  const handleCommitteeSelect = (committee: MunCommittee) => {
    setSelectedCommittee(committee);
    setSelectedLiveSession(null);
    setCurrentView('mun');
  };

  const handleJoinLiveSession = (session: LiveMunSession) => {
    setSelectedLiveSession(session);
    setSelectedCommittee(null);
    setCurrentView('mun');
  };

  const handleExitDebate = () => {
    setCurrentView('dashboard');
    setSelectedTopic(null);
    setSelectedCommittee(null);
    setSelectedLiveSession(null);
    // Award tokens after debate completion
    setUserTokens(prev => prev + Math.floor(Math.random() * 15) + 5);
  };

  const handleBackToTopics = () => {
    setCurrentView('topics');
    setSelectedTopic(null);
  };

  const handleBackToDifficulty = () => {
    setCurrentView('difficulty');
    setSelectedTopic(null);
  };

  const handleProcedureSelect = (procedureType: 'UNA-USA' | 'Indian Parliamentary') => {
    setSelectedProcedureType(procedureType);
    setCurrentView('mun-committees');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTopic(null);
    setSelectedCommittee(null);
    setSelectedLiveSession(null);
    setSelectedProcedureType(null);
  };

  const handleBackToCommittees = () => {
    setCurrentView('mun-committees');
    setSelectedCommittee(null);
    setSelectedLiveSession(null);
  };

  const handleGetPremium = () => {
    setCurrentView('pricing');
  };

  const handleSignOut = () => {
    // Mock sign out - just refresh the page
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        userTokens={userTokens} 
        userRole={userRole} 
        onRoleSwitch={setUserRole}
        onGetPremium={handleGetPremium}
        onSignOut={handleSignOut}
        user={mockUser}
      />
      
      <main className="animate-fade-in">
        {currentView === 'dashboard' && userRole === 'student' && (
          <StudentDashboard 
            userTokens={userTokens} 
            onStartDebate={handleStartDebate}
            onJoinMUN={handleJoinMUN}
            onCreateDebateRoom={handleCreateDebateRoom}
            onViewEvents={handleViewEvents}
            onResources={handleResources}
          />
        )}
        
        {currentView === 'dashboard' && userRole === 'teacher' && (
          <TeacherDashboard />
        )}

        {currentView === 'create-debate-room' && (
          <CreateCommittee 
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'events' && (
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
        )}

        {currentView === 'procedure-selection' && (
          <ProcedureSelection 
            onProcedureSelect={handleProcedureSelect}
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'rules' && (
          <RulesPage 
            procedureType={selectedProcedureType}
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'foreign-policy' && (
          <ForeignPolicyLearning 
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'create-committee' && (
          <CreateCommittee 
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'difficulty' && (
          <DifficultySelection 
            onDifficultySelect={handleDifficultySelect}
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'topics' && (
          <TopicSelection 
            difficulty={selectedDifficulty}
            theme={selectedTheme}
            onTopicSelect={handleTopicSelect}
            onBack={handleBackToDifficulty}
          />
        )}

        {currentView === 'opponents' && selectedTopic && (
          <OpponentSelection 
            topic={selectedTopic}
            onOpponentSelect={handleOpponentSelect}
            onBack={handleBackToTopics}
          />
        )}
        
        {currentView === 'debate' && selectedTopic && (
          <DebateRoom 
            debateType={debateType}
            topic={selectedTopic.title}
            onExit={handleExitDebate}
          />
        )}

        {currentView === 'mun-committees' && (
          <MunCommitteeSelection
            onCommitteeSelect={handleCommitteeSelect}
            onJoinLiveSession={handleJoinLiveSession}
            onBack={handleBackToDashboard}
          />
        )}
        
        {currentView === 'mun' && (
          <MunArena 
            committee={selectedCommittee || undefined}
            liveSession={selectedLiveSession || undefined}
            onExit={handleExitDebate}
            onBackToCommittees={handleBackToCommittees}
          />
        )}

        {currentView === 'pricing' && (
          <PricingPage onBack={handleBackToDashboard} />
        )}

        {currentView === 'resources' && (
          <Resources onBack={handleBackToDashboard} />
        )}

        {currentView === 'scores' && (
          <ScoresTokens 
            userTokens={userTokens} 
            onBack={handleBackToDashboard} 
          />
        )}
      </main>
    </div>
  );
};

export default Index;
