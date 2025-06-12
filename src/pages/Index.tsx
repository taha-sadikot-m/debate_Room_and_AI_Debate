
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
import FamousSpeeches from '@/components/FamousSpeeches';
import ScoresTokens from '@/components/ScoresTokens';
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

const Index = () => {
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [userTokens, setUserTokens] = useState(156);
  const [currentView, setCurrentView] = useState<'dashboard' | 'difficulty' | 'topics' | 'opponents' | 'debate' | 'mun-committees' | 'mun' | 'pricing' | 'speeches' | 'scores'>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedCommittee, setSelectedCommittee] = useState<MunCommittee | null>(null);
  const [selectedLiveSession, setSelectedLiveSession] = useState<LiveMunSession | null>(null);
  const [debateType, setDebateType] = useState<'ai' | '1v1' | 'mun'>('ai');

  const handleStartDebate = () => {
    setCurrentView('difficulty');
  };

  const handleJoinMUN = () => {
    setCurrentView('mun-committees');
  };

  const handleViewScores = () => {
    setCurrentView('scores');
  };

  const handleLearnSpeeches = () => {
    setCurrentView('speeches');
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

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTopic(null);
    setSelectedCommittee(null);
    setSelectedLiveSession(null);
  };

  const handleBackToCommittees = () => {
    setCurrentView('mun-committees');
    setSelectedCommittee(null);
    setSelectedLiveSession(null);
  };

  const handleGetPremium = () => {
    setCurrentView('pricing');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        userTokens={userTokens} 
        userRole={userRole} 
        onRoleSwitch={setUserRole}
        onGetPremium={handleGetPremium}
      />
      
      <main className="animate-fade-in">
        {currentView === 'dashboard' && userRole === 'student' && (
          <StudentDashboard 
            userTokens={userTokens} 
            onStartDebate={handleStartDebate}
            onJoinMUN={handleJoinMUN}
            onViewScores={handleViewScores}
            onLearnSpeeches={handleLearnSpeeches}
          />
        )}
        
        {currentView === 'dashboard' && userRole === 'teacher' && (
          <TeacherDashboard />
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

        {currentView === 'speeches' && (
          <FamousSpeeches onBack={handleBackToDashboard} />
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
