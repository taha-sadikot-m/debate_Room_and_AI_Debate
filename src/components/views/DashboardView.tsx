
import StudentDashboard from '@/components/StudentDashboard';
import TeacherDashboard from '@/components/TeacherDashboard';

interface DashboardViewProps {
  userRole: 'student' | 'teacher';
  userTokens: number;
  handlers: {
    handleStartDebate: () => void;
    handleDebateLive: () => void;
    handleJoinMUN: () => void;
    handleCreateDebateRoom: () => void;
    handleViewEvents: () => void;
    handleResources: () => void;
    handleViewTokens: () => void;
    handlePublicSpeaking: () => void;
    handleDebatesHub: () => void;
  };
}

const DashboardView = ({ userRole, userTokens, handlers }: DashboardViewProps) => {
  return userRole === 'student' ? (
    <StudentDashboard 
      userTokens={userTokens} 
      onStartDebate={handlers.handleStartDebate}
      onDebateLive={handlers.handleDebateLive}
      onJoinMUN={handlers.handleJoinMUN}
      onCreateDebateRoom={handlers.handleCreateDebateRoom}
      onViewEvents={handlers.handleViewEvents}
      onResources={handlers.handleResources}
      onViewTokens={handlers.handleViewTokens}
      onPublicSpeaking={handlers.handlePublicSpeaking}
      onDebatesHub={handlers.handleDebatesHub}
    />
  ) : (
    <TeacherDashboard />
  );
};

export default DashboardView;
