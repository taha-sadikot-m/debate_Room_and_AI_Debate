
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import StudentDashboard from '@/components/StudentDashboard';
import TeacherDashboard from '@/components/TeacherDashboard';
import TopicSelection from '@/components/TopicSelection';
import OpponentSelection from '@/components/OpponentSelection';
import DebateRoom from '@/components/DebateRoom';
import MunArena from '@/components/MunArena';
import PricingPage from '@/components/PricingPage';
import FamousSpeeches from '@/components/FamousSpeeches';
import ScoresTokens from '@/components/ScoresTokens';

interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeEstimate: string;
  aiArguments: {
    pro: string[];
    con: string[];
  };
}

const Index = () => {
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [userTokens, setUserTokens] = useState(156);
  const [currentView, setCurrentView] = useState<'dashboard' | 'topics' | 'opponents' | 'debate' | 'mun' | 'pricing' | 'speeches' | 'scores'>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [debateType, setDebateType] = useState<'ai' | '1v1' | 'mun'>('ai');

  const handleStartDebate = () => {
    setCurrentView('topics');
  };

  const handleJoinMUN = () => {
    setCurrentView('mun');
  };

  const handleViewScores = () => {
    setCurrentView('scores');
  };

  const handleLearnSpeeches = () => {
    setCurrentView('speeches');
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentView('opponents');
  };

  const handleOpponentSelect = (type: 'ai' | '1v1' | 'mun') => {
    setDebateType(type);
    if (type === 'mun') {
      setCurrentView('mun');
    } else {
      setCurrentView('debate');
    }
  };

  const handleExitDebate = () => {
    setCurrentView('dashboard');
    setSelectedTopic(null);
    // Award tokens after debate completion
    setUserTokens(prev => prev + Math.floor(Math.random() * 15) + 5);
  };

  const handleBackToTopics = () => {
    setCurrentView('topics');
    setSelectedTopic(null);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTopic(null);
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

        {currentView === 'topics' && (
          <TopicSelection 
            onTopicSelect={handleTopicSelect}
            onBack={handleBackToDashboard}
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
        
        {currentView === 'mun' && (
          <MunArena onExit={handleExitDebate} />
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
