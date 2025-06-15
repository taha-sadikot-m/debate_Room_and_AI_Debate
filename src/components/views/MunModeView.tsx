
import { Button } from '@/components/ui/button';

interface MunModeViewProps {
  handlers: {
    handleProcedureSelect: (procedureType: 'UNA-USA' | 'Indian Parliamentary') => void;
    handleBackToDashboard: () => void;
  };
}

const MunModeView = ({ handlers }: MunModeViewProps) => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🌍 Welcome to MUN Mode</h1>
        <p className="text-xl text-gray-600 mb-8">Experience Model United Nations with Gavel Bro, your AI moderator</p>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-200 rounded-xl p-8">
        <div className="text-center mb-6">
          <div className="mx-auto bg-indigo-600 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
            <span className="text-3xl">🌍</span>
          </div>
          <h2 className="text-2xl font-bold text-indigo-900 mb-2">Meet Gavel Bro</h2>
          <p className="text-indigo-700">Your AI-powered MUN moderator and parliamentary procedure expert</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-indigo-800 mb-2">🌍 Global Committees</h3>
            <p className="text-sm text-gray-600">Join UN Security Council, General Assembly, and specialized agencies</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-indigo-800 mb-2">🇮🇳 Indian Parliament</h3>
            <p className="text-sm text-gray-600">Experience Lok Sabha and Rajya Sabha sessions with current issues</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-indigo-800 mb-2">⚖️ Real-time Moderation</h3>
            <p className="text-sm text-gray-600">Gavel Bro ensures proper parliamentary procedures and fair debates</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-indigo-800 mb-2">🏆 Token Rewards</h3>
            <p className="text-sm text-gray-600">Earn 25-50 tokens based on your diplomatic performance</p>
          </div>
        </div>

        <div className="text-center">
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg"
            onClick={() => handlers.handleProcedureSelect('UNA-USA')}
          >
            Enter MUN Chambers
          </Button>
        </div>
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={handlers.handleBackToDashboard} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default MunModeView;
