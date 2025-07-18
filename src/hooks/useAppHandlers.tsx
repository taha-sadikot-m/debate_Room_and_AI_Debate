import { useState, useCallback } from 'react';
import { MunCommittee, LiveMunSession } from '@/data/munCommittees';
import { LiveDebateTopic } from '@/data/liveDebateTopics';

// Add TypeScript declaration for the window object to include selectedDebateTopic
declare global {
  interface Window {
    selectedDebateTopic?: LiveDebateTopic;
  }
}

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

interface UseAppHandlersProps {
  setCurrentView: (view: string) => void;
  setSelectedDifficulty: (difficulty: 'Easy' | 'Medium' | 'Hard') => void;
  setSelectedTheme: (theme: string) => void;
  setSelectedTopic: (topic: Topic | LiveDebateTopic | null) => void;
  setDebateType: (type: 'ai' | '1v1' | 'mun') => void;
  setSelectedCommittee: (committee: MunCommittee | null) => void;
  setSelectedLiveSession: (session: LiveMunSession | null) => void;
  setSelectedProcedureType: (type: 'UNA-USA' | 'Indian Parliamentary' | null) => void;
  setUserTokens: (tokens: number | ((prev: number) => number)) => void;
  setSelectedLanguage: (language: string) => void;
  setSelectedDebateFormat: (format: '1v1' | '3v3') => void;
  setSelectedOpponent: (opponent: any) => void;
  setSelectedTeam: (team: any) => void;
  setSelectedDebateRoomId?: (roomId: string | undefined) => void;
  setInstantDebateConfig: (config: DebateConfig) => void;
  setCurrentDebateData: (data: {config: DebateConfig; messages: any[]} | null) => void;
  setSelectedDebateRecord: (record: any) => void;
}

export const useAppHandlers = ({
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
  setSelectedDebateFormat,
  setSelectedOpponent,
  setSelectedTeam,
  setSelectedDebateRoomId,
  setInstantDebateConfig,
  setCurrentDebateData,
  setSelectedDebateRecord
}: UseAppHandlersProps) => {
  const handleStartDebate = () => {
    setCurrentView('difficulty');
  };

  const handleInstantDebate = () => {
    // Navigate to instant debate history first (better UX)
    console.log('handleInstantDebate called - navigating to instant-debate-history');
    setCurrentView('instant-debate-history');
  };

  const handleEnhancedTopicSelection = () => {
    console.log('handleEnhancedTopicSelection called - navigating to enhanced topic selection');
    setCurrentView('enhanced-topic-selection');
  };

  const handleAdvancedTopicManager = () => {
    console.log('handleAdvancedTopicManager called - navigating to advanced topic manager');
    setCurrentView('advanced-topic-manager');
  };

  const handleJoinMUN = () => {
    setCurrentView('mun-mode');
  };

  const handleCreateDebateRoom = () => {
    setCurrentView('create-debate-room');
  };

  const handleViewEvents = () => {
    setCurrentView('events');
  };

  const handleResources = () => {
    setCurrentView('resources');
  };

  const handleViewTokens = () => {
    setCurrentView('scores');
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

  const handleLiveDebateFormatSelect = (format: '1v1' | '3v3', language: string) => {
    setSelectedDebateFormat(format);
    setSelectedLanguage(language);
    setDebateType('1v1'); // Set debate type for live debates
    
    // Get the topic from the window temporary storage if it exists
    if (window.selectedDebateTopic) {
      console.log('Using topic from window storage:', window.selectedDebateTopic);
      const topic = window.selectedDebateTopic;
      
      // Set the topic in state first
      setSelectedTopic(topic);
      
      // Only clean up after we're sure the state has been updated
      // and after we've navigated to the debate view
      setTimeout(() => {
        console.log('Setting current view to live-debate-active');
        setCurrentView('live-debate-active');
        
        // Clean up the window object after a longer delay
        setTimeout(() => {
          delete window.selectedDebateTopic;
        }, 500);
      }, 200);
    } else {
      console.warn('No debate topic found in window storage!');
      setCurrentView('live-debate-active'); // Still navigate, LiveDebateRoomV3 will handle the error
    }
  };

  const handleLiveDebateStart = (topic: any, opponent?: any, team?: any, roomId?: string) => {
    console.log('Starting live debate:', { topic, opponent, team, roomId });
    // Store the debate configuration
    setSelectedTopic(topic);
    setSelectedOpponent(opponent);
    setSelectedTeam(team);
    
    // Set room ID if provided
    if (roomId && setSelectedDebateRoomId) {
      console.log('Setting debate room ID:', roomId);
      setSelectedDebateRoomId(roomId);
      
      // Also add roomId to window storage for safety
      // @ts-ignore - Adding custom property
      window.debateRoomId = roomId;
    }
    
    setCurrentView('live-debate-active');
  };

  const handleLiveDebateComplete = (result: any) => {
    console.log('Live debate completed:', result);
    // Handle completion - could show results, update tokens, etc.
    setCurrentView('live-debate-selection');
  };

  const handleBackToLiveDebateSelection = () => {
    setCurrentView('live-debate-selection');
  };

  const handleDebateLive = () => {
    setCurrentView('live-debate-selection');
  };

  const handlePublicSpeaking = () => {
    setCurrentView('public-speaking');
  };

  const handleDebatesHub = () => {
    console.log('Navigating to Debates & MUNs Hub');
    setCurrentView('debates-hub');
  };
  
  const handleRealTimeDebate = () => {
    console.log('Navigating to Real-Time Debate Room');
    setCurrentView('real-time-debate-room');
  };

  const handleInstantDebateStart = (config: DebateConfig) => {
    setInstantDebateConfig(config);
    setCurrentView('instant-debate-room');
  };

  const handleInstantDebateBack = () => {
    console.log('handleInstantDebateBack called');
    setCurrentView('instant-debate-setup');
  };

  const handleInstantDebateComplete = (config: DebateConfig, messages: any[]) => {
    console.log('handleInstantDebateComplete called with:', { config, messages });
    // Store the debate data for evaluation
    const debateData = { config, messages };
    setCurrentDebateData(debateData);
    setCurrentView('instant-debate-evaluation');
  };

  const handleInstantDebateHistory = () => {
    console.log('handleInstantDebateHistory called');
    setCurrentView('debate-history-viewer');
  };

  const handleDetailedDebateHistory = () => {
    console.log('handleDetailedDebateHistory called');
    setCurrentView('debate-history-viewer');
  };

  const handleStartNewDebate = () => {
    console.log('handleStartNewDebate called - navigating to setup');
    setCurrentView('instant-debate-setup');
  };

  const handleViewDebate = (debate: any) => {
    console.log('handleViewDebate called with:', debate);
    // Store the selected debate for viewing
    setSelectedDebateRecord(debate);
    setCurrentView('instant-debate-viewer');
  };

  const handleHumanDebateHistory = () => {
    setCurrentView('human-debate-history');
  };

  const handleViewHumanDebate = (debate: any) => {
    setSelectedDebateRecord(debate);
    setCurrentView('human-debate-viewer');
  };

  return {
    handleStartDebate,
    handleInstantDebate,
    handleEnhancedTopicSelection,
    handleAdvancedTopicManager: () => setCurrentView('advanced-topic-manager'),
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
    handleLiveDebateFormatSelect,
    handleLiveDebateStart,
    handleLiveDebateComplete,
    handleBackToLiveDebateSelection,
    handleDebateLive,
    handlePublicSpeaking,
    handleRealTimeDebate,
    handleInstantDebateStart,
    handleInstantDebateBack,
    handleInstantDebateComplete,
    handleInstantDebateHistory,
    handleDetailedDebateHistory,
    handleStartNewDebate,
    handleViewDebate,
    handleHumanDebateHistory,
    handleViewHumanDebate
  };
};
