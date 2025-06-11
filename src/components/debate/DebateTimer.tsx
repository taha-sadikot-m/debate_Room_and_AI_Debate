
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface DebateTimerProps {
  timeRemaining: number;
  isTimerRunning: boolean;
  currentSpeaker: 'student' | 'opponent';
  onTimerToggle: () => void;
  onTimerReset: () => void;
}

const DebateTimer = ({ 
  timeRemaining, 
  isTimerRunning, 
  currentSpeaker, 
  onTimerToggle, 
  onTimerReset 
}: DebateTimerProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="card-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{formatTime(timeRemaining)}</div>
              <div className="text-sm text-gray-500">Time Remaining</div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {currentSpeaker === 'student' ? 'Your Turn' : 'Opponent Speaking'}
              </div>
              <div className="text-sm text-gray-500">Current Speaker</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant={isTimerRunning ? "destructive" : "default"}
              onClick={onTimerToggle}
            >
              {isTimerRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isTimerRunning ? 'Pause' : 'Start'}
            </Button>
            
            <Button variant="outline" onClick={onTimerReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebateTimer;
