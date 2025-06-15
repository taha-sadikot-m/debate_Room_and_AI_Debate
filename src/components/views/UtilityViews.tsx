
import { Button } from '@/components/ui/button';
import LiveDebateSelection from '@/components/LiveDebateSelection';
import CreateCommittee from '@/components/CreateCommittee';
import PricingPage from '@/components/PricingPage';
import Resources from '@/components/Resources';
import ScoresTokens from '@/components/ScoresTokens';
import PublicSpeakingActivities from '@/components/PublicSpeakingActivities';
import DebatesHub from '@/components/DebatesHub';

interface UtilityViewsProps {
  currentView: string;
  userTokens: number;
  handlers: {
    handleLiveDebateFormatSelect: (format: '1v1' | '3v3', language: string) => void;
    handleBackToDashboard: () => void;
  };
}

const UtilityViews = ({ currentView, userTokens, handlers }: UtilityViewsProps) => {
  switch (currentView) {
    case 'live-debate-selection':
      return (
        <LiveDebateSelection
          onFormatSelect={handlers.handleLiveDebateFormatSelect}
          onBack={handlers.handleBackToDashboard}
        />
      );

    case 'create-debate-room':
      return <CreateCommittee onBack={handlers.handleBackToDashboard} />;

    case 'events':
      return (
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎪 Recent Debate Events</h1>
              <p className="text-gray-600 mt-2">Upcoming and recent debate competitions</p>
            </div>
            <Button variant="outline" onClick={handlers.handleBackToDashboard}>
              Back
            </Button>
          </div>
          <div className="text-center text-gray-500 mt-20">
            <p>Events feature coming soon!</p>
          </div>
        </div>
      );

    case 'debates-hub':
      return <DebatesHub onBack={handlers.handleBackToDashboard} />;

    case 'pricing':
      return <PricingPage onBack={handlers.handleBackToDashboard} />;

    case 'resources':
      return <Resources onBack={handlers.handleBackToDashboard} />;

    case 'scores':
      return <ScoresTokens userTokens={userTokens} onBack={handlers.handleBackToDashboard} />;

    case 'public-speaking':
      return <PublicSpeakingActivities onBack={handlers.handleBackToDashboard} />;

    default:
      return null;
  }
};

export default UtilityViews;
