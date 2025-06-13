
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ViewManager from '@/components/ViewManager';
import { useAppHandlers } from '@/hooks/useAppHandlers';
import { useAuth } from '@/hooks/useAuth';
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

const AuthenticatedApp = () => {
  const { user, signOut } = useAuth();
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [userTokens, setUserTokens] = useState(156);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedCommittee, setSelectedCommittee] = useState<MunCommittee | null>(null);
  const [selectedLiveSession, setSelectedLiveSession] = useState<LiveMunSession | null>(null);
  const [debateType, setDebateType] = useState<'ai' | '1v1' | 'mun'>('ai');
  const [selectedProcedureType, setSelectedProcedureType] = useState<'UNA-USA' | 'Indian Parliamentary' | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [selectedDebateFormat, setSelectedDebateFormat] = useState<'1v1' | '3v3'>('1v1');

  const handlers = useAppHandlers({
    setCurrentView,
    setSelectedDifficulty,
    setSelectedTheme,
    setSelectedTopic,
    setDebateType,
    setSelectedCommittee,
    setSelectedLiveSession,
    setSelectedProcedureType,
    setUserTokens,
    setSelectedLanguage,
    setSelectedDebateFormat
  });

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
        onSignOut={signOut}
        user={user}
      />
      
      <main className="animate-fade-in">
        <ViewManager
          currentView={currentView}
          userRole={userRole}
          userTokens={userTokens}
          selectedTopic={selectedTopic}
          selectedDifficulty={selectedDifficulty}
          selectedTheme={selectedTheme}
          selectedCommittee={selectedCommittee}
          selectedLiveSession={selectedLiveSession}
          debateType={debateType}
          selectedProcedureType={selectedProcedureType}
          selectedLanguage={selectedLanguage}
          selectedDebateFormat={selectedDebateFormat}
          handlers={handlers}
        />
      </main>
    </div>
  );
};

export default AuthenticatedApp;
