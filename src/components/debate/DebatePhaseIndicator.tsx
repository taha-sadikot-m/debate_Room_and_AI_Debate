
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, RefreshCw, Target } from 'lucide-react';

interface DebatePhaseIndicatorProps {
  currentRound: number;
  phase: 'opening' | 'rebuttal' | 'closing';
  assignedSide: 'FOR' | 'AGAINST';
}

const DebatePhaseIndicator = ({ currentRound, phase, assignedSide }: DebatePhaseIndicatorProps) => {
  const getPhaseIcon = () => {
    switch (phase) {
      case 'opening':
        return <MessageSquare className="h-4 w-4" />;
      case 'rebuttal':
        return <RefreshCw className="h-4 w-4" />;
      case 'closing':
        return <Target className="h-4 w-4" />;
    }
  };

  const getPhaseDescription = () => {
    switch (phase) {
      case 'opening':
        return 'Present your main arguments';
      case 'rebuttal':
        return 'Address counterarguments';
      case 'closing':
        return 'Summarize your position';
    }
  };

  return (
    <Card className="card-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {getPhaseIcon()}
              <div>
                <h3 className="font-medium capitalize">{phase} Statement</h3>
                <p className="text-sm text-gray-600">{getPhaseDescription()}</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Round {currentRound}
            </Badge>
            <Badge 
              variant="outline" 
              className={assignedSide === 'FOR' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
            >
              {assignedSide}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebatePhaseIndicator;
