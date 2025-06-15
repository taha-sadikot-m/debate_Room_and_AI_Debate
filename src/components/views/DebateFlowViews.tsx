
import DifficultySelection from '@/components/DifficultySelection';
import TopicSelection from '@/components/TopicSelection';
import OpponentSelection from '@/components/OpponentSelection';
import DebateRoom from '@/components/DebateRoom';

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

interface DebateFlowViewsProps {
  currentView: string;
  selectedTopic: Topic | null;
  selectedDifficulty: 'Easy' | 'Medium' | 'Hard';
  selectedTheme: string;
  debateType: 'ai' | '1v1' | 'mun';
  selectedLanguage: string;
  handlers: {
    handleDifficultySelect: (difficulty: 'Easy' | 'Medium' | 'Hard', theme: string) => void;
    handleTopicSelect: (topic: Topic) => void;
    handleOpponentSelect: (type: 'ai' | '1v1' | 'mun') => void;
    handleExitDebate: () => void;
    handleBackToTopics: () => void;
    handleBackToDifficulty: () => void;
    handleBackToDashboard: () => void;
  };
}

const DebateFlowViews = ({ 
  currentView, 
  selectedTopic, 
  selectedDifficulty, 
  selectedTheme, 
  debateType, 
  selectedLanguage, 
  handlers 
}: DebateFlowViewsProps) => {
  switch (currentView) {
    case 'difficulty':
      return (
        <DifficultySelection 
          onDifficultySelect={handlers.handleDifficultySelect} 
          onBack={handlers.handleBackToDashboard} 
        />
      );

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

    default:
      return null;
  }
};

export default DebateFlowViews;
