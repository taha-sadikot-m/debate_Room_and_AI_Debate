import { useState, useCallback } from 'react';
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

interface DebateConfig {
  topic: string;
  userPosition: 'for' | 'against';
  firstSpeaker: 'user' | 'ai';
}

interface UseAppHandlersProps {
  setCurrentView: (view: string) => void;
  setSelectedDifficulty: (difficulty: 'Easy' | 'Medium' | 'Hard') => void;
  setSelectedTheme: (theme: string) => void;
  setSelectedTopic: (topic: Topic | null) => void;
  setDebateType: (type: 'ai' | '1v1' | 'mun') => void;
  setSelectedCommittee: (committee: MunCommittee | null) => void;
  setSelectedLiveSession: (session: LiveMunSession | null) => void;
  setSelectedProcedureType: (type: 'UNA-USA' | 'Indian Parliamentary' | null) => void;
  setUserTokens: (tokens: number | ((prev: number) => number)) => void;
  setSelectedLanguage: (language: string) => void;
  setSelectedDebateFormat: (format: '1v1' | '3v3') => void;
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
    setCurrentView('debate');
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
    setCurrentView('instant-debate-history');
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

  return {
    handleStartDebate,
    handleInstantDebate,
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
    handleDebateLive,
    handlePublicSpeaking,
    handleDebatesHub,
    handleInstantDebateStart,
    handleInstantDebateBack,
    handleInstantDebateComplete,
    handleInstantDebateHistory,
    handleStartNewDebate,
    handleViewDebate
  };
};
