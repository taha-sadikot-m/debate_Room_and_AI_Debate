
import QuickStatsCard from '@/components/dashboard/QuickStatsCard';
import MainMenuCard from '@/components/dashboard/MainMenuCard';
import FreudAnalysisCard from '@/components/dashboard/FreudAnalysisCard';
import RecentDebatesCard from '@/components/dashboard/RecentDebatesCard';

interface StudentDashboardProps {
  userTokens: number;
  onStartDebate: () => void;
  onJoinMUN: () => void;
  onCreateDebateRoom: () => void;
  onViewEvents: () => void;
  onResources: () => void;
}

const StudentDashboard = ({ 
  userTokens, 
  onStartDebate,
  onJoinMUN,
  onCreateDebateRoom,
  onViewEvents,
  onResources
}: StudentDashboardProps) => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Stage. Your Voice. Your Growth</h1>
        <p className="text-lg text-gray-600">Welcome Back!</p>
      </div>

      {/* Quick Stats */}
      <QuickStatsCard userTokens={userTokens} />

      {/* Main Menu Options */}
      <MainMenuCard 
        onStartDebate={onStartDebate}
        onCreateDebateRoom={onCreateDebateRoom}
        onViewEvents={onViewEvents}
        onResources={onResources}
      />

      {/* Freud Theory Skills Progress & Recent Debates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FreudAnalysisCard />
        <RecentDebatesCard />
      </div>
    </div>
  );
};

export default StudentDashboard;
