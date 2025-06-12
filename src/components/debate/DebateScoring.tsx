
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Target } from 'lucide-react';
import { DebateScores } from '@/data/debatePrompts';

interface DebateScoringProps {
  scores: DebateScores;
  isVisible: boolean;
}

const DebateScoring = ({ scores, isVisible }: DebateScoringProps) => {
  if (!isVisible) return null;

  const totalScore = Math.round((scores.confidence + scores.clarity + scores.logic + scores.relevance + scores.emotionalImpact) / 5 * 10);

  return (
    <Card className="card-shadow border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          <span>Round Scoring</span>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            {totalScore}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Confidence</span>
            <span className="text-sm text-gray-500">{scores.confidence}/10</span>
          </div>
          <Progress value={scores.confidence * 10} className="h-2" />

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Clarity</span>
            <span className="text-sm text-gray-500">{scores.clarity}/10</span>
          </div>
          <Progress value={scores.clarity * 10} className="h-2" />

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Logic</span>
            <span className="text-sm text-gray-500">{scores.logic}/10</span>
          </div>
          <Progress value={scores.logic * 10} className="h-2" />

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Relevance</span>
            <span className="text-sm text-gray-500">{scores.relevance}/10</span>
          </div>
          <Progress value={scores.relevance * 10} className="h-2" />

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Emotional Impact</span>
            <span className="text-sm text-gray-500">{scores.emotionalImpact}/10</span>
          </div>
          <Progress value={scores.emotionalImpact * 10} className="h-2" />
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Feedback</span>
          </div>
          <p className="text-sm text-gray-600">{scores.feedback}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebateScoring;
