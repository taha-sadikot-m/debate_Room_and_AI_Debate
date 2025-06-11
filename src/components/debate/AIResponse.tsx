
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, MessageSquare } from 'lucide-react';

interface AIResponseProps {
  aiResponse: string;
  onNextRound: () => void;
}

const AIResponse = ({ aiResponse, onNextRound }: AIResponseProps) => {
  if (!aiResponse) return null;

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>AI Opponent Response</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-purple-800">{aiResponse}</p>
        </div>
        <div className="mt-4 text-center">
          <Button onClick={onNextRound}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Continue Debate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIResponse;
