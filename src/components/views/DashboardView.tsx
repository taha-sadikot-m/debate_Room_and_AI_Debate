
import React from 'react';
import StudentDashboard from '@/components/StudentDashboard';
import TeacherDashboard from '@/components/TeacherDashboard';

interface DashboardViewProps {
  userRole: 'student' | 'teacher';
  userTokens: number;
  handlers: {
    handleStartDebate: () => void;
    handleInstantDebate: () => void;
    handleDebateLive: () => void;
    handleJoinMUN: () => void;
    handleCreateDebateRoom: () => void;
    handleViewEvents: () => void;
    handleResources: () => void;
    handleViewTokens: () => void;
    handlePublicSpeaking: () => void;
    handleDebatesHub: () => void;
    handleEnhancedTopicSelection: () => void;
    handleAdvancedTopicManager: () => void;
    handleRealTimeDebate: () => void;
  };
}

const DashboardView = ({ userRole, userTokens, handlers }: DashboardViewProps) => {
  return userRole === 'student' ? (
    <StudentDashboard 
      userTokens={userTokens} 
      onStartDebate={handlers.handleStartDebate}
      onInstantDebate={handlers.handleInstantDebate}
      onDebateLive={handlers.handleDebateLive}
      onJoinMUN={handlers.handleJoinMUN}
      onCreateDebateRoom={handlers.handleCreateDebateRoom}
      onViewEvents={handlers.handleViewEvents}
      onResources={handlers.handleResources}
      onViewTokens={handlers.handleViewTokens}
      onPublicSpeaking={handlers.handlePublicSpeaking}
      onDebatesHub={handlers.handleDebatesHub}
      onEnhancedTopicSelection={handlers.handleEnhancedTopicSelection}
      onAdvancedTopicManager={handlers.handleAdvancedTopicManager}
      onRealTimeDebate={handlers.handleRealTimeDebate}
    />
  ) : (
    <TeacherDashboard />
  );
};

export default DashboardView;
