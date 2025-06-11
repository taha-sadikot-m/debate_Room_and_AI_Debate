
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import StudentDashboard from '@/components/StudentDashboard';
import TeacherDashboard from '@/components/TeacherDashboard';
import DebateRoom from '@/components/DebateRoom';
import MunArena from '@/components/MunArena';

const Index = () => {
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [userTokens, setUserTokens] = useState(156);
  const [currentView, setCurrentView] = useState<'dashboard' | 'debate' | 'mun'>('dashboard');
  const [debateType, setDebateType] = useState<'ai' | '1v1' | 'mun'>('ai');

  const handleStartDebate = (type: 'ai' | '1v1' | 'mun') => {
    setDebateType(type);
    if (type === 'mun') {
      setCurrentView('mun');
    } else {
      setCurrentView('debate');
    }
  };

  const handleExitDebate = () => {
    setCurrentView('dashboard');
    // Award tokens after debate completion
    setUserTokens(prev => prev + Math.floor(Math.random() * 15) + 5);
  };

  const debateTopics = [
    "Should artificial intelligence be regulated by international law?",
    "Is renewable energy the solution to climate change?",
    "Should social media platforms be held responsible for user content?",
    "Is space exploration worth the investment?",
    "Should genetic engineering be used to enhance human capabilities?"
  ];

  const randomTopic = debateTopics[Math.floor(Math.random() * debateTopics.length)];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        userTokens={userTokens} 
        userRole={userRole} 
        onRoleSwitch={setUserRole}
      />
      
      <main className="animate-fade-in">
        {currentView === 'dashboard' && userRole === 'student' && (
          <StudentDashboard 
            userTokens={userTokens} 
            onStartDebate={handleStartDebate}
          />
        )}
        
        {currentView === 'dashboard' && userRole === 'teacher' && (
          <TeacherDashboard />
        )}
        
        {currentView === 'debate' && (
          <DebateRoom 
            debateType={debateType}
            topic={randomTopic}
            onExit={handleExitDebate}
          />
        )}
        
        {currentView === 'mun' && (
          <MunArena onExit={handleExitDebate} />
        )}
      </main>
    </div>
  );
};

export default Index;
