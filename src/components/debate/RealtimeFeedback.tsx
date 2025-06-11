
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, Zap } from 'lucide-react';

interface FeedbackData {
  fluency: number;
  clarity: number;
  relevance: number;
  confidence: number;
}

interface RealtimeFeedbackProps {
  feedback: FeedbackData;
}

const RealtimeFeedback = ({ feedback }: RealtimeFeedbackProps) => {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-green-600" />
          <span>Real-time Feedback</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Fluency</span>
              <span className="text-sm text-gray-500">{feedback.fluency}%</span>
            </div>
            <Progress value={feedback.fluency} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Clarity</span>
              <span className="text-sm text-gray-500">{feedback.clarity}%</span>
            </div>
            <Progress value={feedback.clarity} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Relevance</span>
              <span className="text-sm text-gray-500">{feedback.relevance}%</span>
            </div>
            <Progress value={feedback.relevance} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Confidence</span>
              <span className="text-sm text-gray-500">{feedback.confidence}%</span>
            </div>
            <Progress value={feedback.confidence} className="h-2" />
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Potential Score: 87/100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeFeedback;
