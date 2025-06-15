
import MunCommitteeSelection from '@/components/MunCommitteeSelection';
import MunArena from '@/components/MunArena';
import ProcedureSelection from '@/components/ProcedureSelection';

interface MunViewsProps {
  currentView: string;
  selectedCommittee: any;
  selectedLiveSession: any;
  handlers: {
    handleProcedureSelect: (procedureType: 'UNA-USA' | 'Indian Parliamentary') => void;
    handleCommitteeSelect: (committee: any) => void;
    handleJoinLiveSession: (session: any) => void;
    handleExitDebate: () => void;
    handleBackToCommittees: () => void;
    handleBackToDashboard: () => void;
  };
}

const MunViews = ({ currentView, selectedCommittee, selectedLiveSession, handlers }: MunViewsProps) => {
  switch (currentView) {
    case 'procedure-selection':
      return (
        <ProcedureSelection 
          onProcedureSelect={handlers.handleProcedureSelect} 
          onBack={handlers.handleBackToDashboard} 
        />
      );

    case 'mun-committees':
      return (
        <MunCommitteeSelection
          onCommitteeSelect={handlers.handleCommitteeSelect}
          onJoinLiveSession={handlers.handleJoinLiveSession}
          onBack={handlers.handleBackToDashboard}
        />
      );

    case 'mun':
      return (
        <MunArena
          committee={selectedCommittee}
          liveSession={selectedLiveSession}
          onExit={handlers.handleExitDebate}
          onBackToCommittees={handlers.handleBackToCommittees}
        />
      );

    default:
      return null;
  }
};

export default MunViews;
