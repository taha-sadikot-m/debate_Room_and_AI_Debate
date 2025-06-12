
import { useState } from 'react';
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
  setSelectedDebateFormat
}: UseAppHandlersProps) => {
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

  return {
    handleStartDebate,
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
    handleDebateLive
  };
};
