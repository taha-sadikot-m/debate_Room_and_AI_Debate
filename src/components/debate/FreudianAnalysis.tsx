
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Lightbulb } from 'lucide-react';
import { FreudAnalysis } from '@/data/debatePrompts';

interface FreudianAnalysisProps {
  analysis: FreudAnalysis;
  isVisible: boolean;
}

const FreudianAnalysis = ({ analysis, isVisible }: FreudianAnalysisProps) => {
  if (!isVisible) return null;

  return (
    <Card className="card-shadow border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>Freudian Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-red-700">Id (Instinctive)</span>
              <span className="text-sm text-gray-500">{analysis.id}/10</span>
            </div>
            <Progress value={analysis.id * 10} className="h-2" />
            <p className="text-xs text-gray-600 mt-1">Emotional/Impulsive arguments</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-blue-700">Ego (Rational)</span>
              <span className="text-sm text-gray-500">{analysis.ego}/10</span>
            </div>
            <Progress value={analysis.ego * 10} className="h-2" />
            <p className="text-xs text-gray-600 mt-1">Logic & structured reasoning</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-green-700">Superego (Moral)</span>
              <span className="text-sm text-gray-500">{analysis.superego}/10</span>
            </div>
            <Progress value={analysis.superego * 10} className="h-2" />
            <p className="text-xs text-gray-600 mt-1">Ethics & moral reasoning</p>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200 space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Psychological Breakdown</h4>
            <p className="text-sm text-gray-600">{analysis.breakdown}</p>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Lightbulb className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Improvement Tip</span>
            </div>
            <p className="text-sm text-purple-800">{analysis.tip}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreudianAnalysis;
