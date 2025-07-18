import React from 'react';
import DashboardView from '@/components/views/DashboardView';
import MunModeView from '@/components/views/MunModeView';
import DebateFlowViews from '@/components/views/DebateFlowViews';
import UtilityViews from '@/components/views/UtilityViews';
import MunViews from '@/components/views/MunViews';
import InstantDebateSetup from '@/components/InstantDebateSetup';
import InstantDebateRoomV2 from '@/components/InstantDebateRoomV2';
import InstantDebateTest from '@/components/InstantDebateTest';
import InstantDebateEvaluation from '@/components/InstantDebateEvaluation';
import InstantDebateHistory from '@/components/InstantDebateHistory';
import InstantDebateViewer from '@/components/InstantDebateViewer';
import EnhancedTopicSelection from '@/components/EnhancedTopicSelection';
import AdvancedTopicManager from '@/components/AdvancedTopicManager';
import LiveDebateRoomV3 from '@/components/LiveDebateRoomV3';
import RealTimeDebateRoom from '@/components/RealTimeDebateRoom';
import HumanDebateRoom from '@/components/HumanDebateRoomNew';
import HumanDebateHistory from '@/components/HumanDebateHistory';
import HumanDebateViewer from '@/components/HumanDebateViewer';
import { LiveDebateTopic } from '@/data/liveDebateTopics';

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

interface DebateConfig {
  topic: string;
  userPosition: 'for' | 'against';
  firstSpeaker: 'user' | 'ai';
}

interface ViewManagerProps {
  currentView: string;
  userRole: 'student' | 'teacher';
  userTokens: number;
  selectedTopic: Topic | LiveDebateTopic | null;
  selectedDifficulty: 'Easy' | 'Medium' | 'Hard' | null;
  selectedTheme: string | null;
  selectedCommittee: any;
  selectedLiveSession: any;
  debateType: 'instant' | 'live' | 'mun' | null;
  selectedProcedureType: 'UNA-USA' | 'Indian Parliamentary' | null;
  selectedLanguage: string;
  selectedDebateFormat: '1v1' | '3v3';
  selectedOpponent: any;
  selectedTeam: any;
  selectedDebateRoomId?: string; // Added room ID
  instantDebateConfig: DebateConfig | null;
  currentDebateData?: {
    config: DebateConfig;
    messages: any[];
  } | null;
  selectedDebateRecord?: any;
  handlers: {
    handleStartDebate: () => void;
    handleInstantDebate: () => void;
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
    handleInstantDebateStart: (config: DebateConfig) => void;
    handleInstantDebateBack: () => void;
    handleInstantDebateComplete: (config: DebateConfig, messages: any[]) => void;
    handleInstantDebateHistory: () => void;
    handleStartNewDebate: () => void;
    handleViewDebate: (debate: any) => void;
    handleHumanDebateHistory: () => void;
    handleViewHumanDebate: (debate: any) => void;
    handleLiveDebateStart?: (topic: LiveDebateTopic, opponent?: any, team?: any, roomId?: string) => void;
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
  selectedOpponent,
  selectedTeam,
  selectedDebateRoomId,
  instantDebateConfig,
  currentDebateData,
  selectedDebateRecord,
  handlers
}: ViewManagerProps) => {
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView 
            userRole={userRole}
            userTokens={userTokens}
            handlers={handlers}
          />
        );

      case 'instant-debate-test':
        return <InstantDebateTest />;

      case 'instant-debate-setup':
        return (
          <InstantDebateSetup
            onStartDebate={handlers.handleInstantDebateStart}
            onBack={handlers.handleBackToDashboard}
          />
        );

      case 'enhanced-topic-selection':
        return (
          <EnhancedTopicSelection
            onStartDebate={handlers.handleInstantDebateStart}
            onBack={handlers.handleBackToDashboard}
          />
        );

      case 'advanced-topic-manager':
        return (
          <AdvancedTopicManager
            onTopicSelect={(topic, category) => {
              // Handle topic selection for instant debates
              console.log('Topic selected:', topic, category);
            }}
            onCreateDebate={handlers.handleInstantDebateStart}
          />
        );

      case 'instant-debate-room':
        console.log('ViewManager rendering instant-debate-room with config:', instantDebateConfig);
        if (!instantDebateConfig) {
          console.error('No instant debate config available, redirecting to setup');
          // Use useEffect or return a component that handles navigation to avoid setState during render
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <p className="text-gray-600 mb-4">No debate configuration found.</p>
                <button 
                  onClick={() => handlers.handleInstantDebate()}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Go to Setup
                </button>
              </div>
            </div>
          );
        }
        return (
          <InstantDebateRoomV2
            config={instantDebateConfig}
            onBack={handlers.handleInstantDebateBack}
            onExit={handlers.handleExitDebate}
            onDebateComplete={handlers.handleInstantDebateComplete}
          />
        );

      case 'instant-debate-evaluation':
        if (!currentDebateData) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <p className="text-gray-600 mb-4">No debate data available for evaluation.</p>
                <button 
                  onClick={() => handlers.handleInstantDebate()}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Start New Debate
                </button>
              </div>
            </div>
          );
        }
        return (
          <InstantDebateEvaluation
            config={currentDebateData.config}
            messages={currentDebateData.messages}
            onBack={handlers.handleInstantDebateBack}
            onNewDebate={handlers.handleStartNewDebate}
            onViewHistory={handlers.handleInstantDebateHistory}
          />
        );

      case 'instant-debate-history':
        return (
          <InstantDebateHistory
            onBack={handlers.handleBackToDashboard}
            onViewDebate={handlers.handleViewDebate}
            onNewDebate={handlers.handleStartNewDebate}
          />
        );

      case 'instant-debate-viewer':
        if (!selectedDebateRecord) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <p className="text-gray-600 mb-4">No debate selected for viewing.</p>
                <button 
                  onClick={() => handlers.handleInstantDebateHistory()}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View History
                </button>
              </div>
            </div>
          );
        }
        return (
          <InstantDebateViewer
            debate={selectedDebateRecord}
            onBack={handlers.handleInstantDebateHistory}
            onViewEvaluation={() => {}} // Could be extended later
          />
        );

      case 'mun-mode':
        return (
          <MunModeView handlers={handlers} />
        );

      case 'difficulty':
      case 'topics':
      case 'opponents':
      case 'debate':
        return (
          <DebateFlowViews
            currentView={currentView}
            selectedTopic={selectedTopic}
            selectedDifficulty={selectedDifficulty}
            selectedTheme={selectedTheme}
            debateType={debateType}
            selectedLanguage={selectedLanguage}
            handlers={handlers}
          />
        );

      case 'procedure-selection':
      case 'mun-committees':
      case 'mun':
        return (
          <MunViews
            currentView={currentView}
            selectedCommittee={selectedCommittee}
            selectedLiveSession={selectedLiveSession}
            handlers={handlers}
          />
        );

      case 'live-debate-active':
        if (!selectedTopic) {
          console.error('No topic selected for live debate, redirecting to selection');
          // Automatically redirect back to selection if no topic
          setTimeout(() => {
            // Use handlers.handleBackToDashboard as a fallback if live debate handler doesn't exist
            if ('handleBackToLiveDebateSelection' in handlers) {
              (handlers as any).handleBackToLiveDebateSelection();
            } else {
              handlers.handleBackToDashboard();
            }
          }, 100);
          return (
            <div className="max-w-4xl mx-auto p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Redirecting...</h2>
              <p className="text-gray-600">No topic selected. Returning to topic selection.</p>
            </div>
          );
        }
        return (
          <LiveDebateRoomV3
            topic={selectedTopic}
            format={selectedDebateFormat}
            opponent={selectedOpponent}
            team={selectedTeam}
            language={selectedLanguage}
            roomId={selectedDebateRoomId}
            onBack={() => {
              // Use handlers.handleBackToDashboard as a fallback if live debate handler doesn't exist
              if ('handleBackToLiveDebateSelection' in handlers) {
                (handlers as any).handleBackToLiveDebateSelection();
              } else {
                handlers.handleBackToDashboard();
              }
            }}
            onComplete={(result) => {
              // Use handlers.handleBackToDashboard as a fallback if live debate handler doesn't exist
              if ('handleLiveDebateComplete' in handlers) {
                (handlers as any).handleLiveDebateComplete(result);
              } else {
                console.log('Live debate complete:', result);
                handlers.handleBackToDashboard();
              }
            }}
          />
        );

      case 'live-debate-selection':
        return (
          <RealTimeDebateRoom
            onBack={handlers.handleBackToDashboard}
          />
        );
        
      case 'real-time-debate-room':
        return (
          <HumanDebateRoom
            onBack={handlers.handleBackToDashboard}
            onViewHistory={handlers.handleHumanDebateHistory}
          />
        );

      case 'human-debate-history':
        return (
          <HumanDebateHistory
            onBack={handlers.handleBackToDashboard}
            onNewDebate={handlers.handleCreateDebateRoom}
            onViewDebate={handlers.handleViewHumanDebate}
          />
        );

      case 'human-debate-viewer':
        if (!selectedDebateRecord) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">No Debate Selected</h2>
                <p className="text-gray-600 mb-4">Please select a debate to view.</p>
                <button
                  onClick={handlers.handleHumanDebateHistory}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Back to History
                </button>
              </div>
            </div>
          );
        }
        return (
          <HumanDebateViewer
            debate={selectedDebateRecord}
            onBack={handlers.handleHumanDebateHistory}
          />
        );
        
      case 'create-debate-room':
      case 'events':
      case 'debates-hub':
      case 'pricing':
      case 'resources':
      case 'scores':
      case 'public-speaking':
        return (
          <UtilityViews
            currentView={currentView}
            userTokens={userTokens}
            handlers={handlers}
          />
        );

      default:
        return null;
    }
  };

  return renderView();
};

export default ViewManager;
