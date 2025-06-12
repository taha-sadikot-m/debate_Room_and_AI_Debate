
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FreudAnalysisProps {
  sessionId: string;
  speechText: string;
  onAnalysisComplete: (analysis: FreudAnalysisResult) => void;
}

interface FreudAnalysisResult {
  idScore: number;
  egoScore: number;
  superegoScore: number;
  overallScore: number;
  feedbackText: string;
  analysisReasoning: string;
}

const FreudAnalysis = ({ sessionId, speechText, onAnalysisComplete }: FreudAnalysisProps) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<FreudAnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeFreudianAspects = async () => {
    if (!speechText.trim()) {
      toast({
        title: "Error",
        description: "No speech text to analyze",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-freud', {
        body: {
          speechText,
          sessionId
        }
      });

      if (error) {
        throw error;
      }

      const analysisResult: FreudAnalysisResult = data;
      setAnalysis(analysisResult);
      onAnalysisComplete(analysisResult);

      toast({
        title: "Analysis Complete",
        description: "Your Freudian debate analysis is ready!"
      });
    } catch (error) {
      console.error('Error analyzing speech:', error);
      toast({
        title: "Error",
        description: "Failed to analyze speech. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>Freudian Debate Analysis</span>
        </CardTitle>
        <CardDescription>
          AI-powered analysis of your debate style based on Freud's theory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis && (
          <Button 
            onClick={analyzeFreudianAspects}
            disabled={loading || !speechText.trim()}
            className="w-full gradient-indigo text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Speech...
              </>
            ) : (
              'Analyze My Debate Style'
            )}
          </Button>
        )}

        {analysis && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Id (Instinctive)</span>
                  <span className="text-sm text-gray-500">{analysis.idScore}/10</span>
                </div>
                <Progress value={analysis.idScore * 10} className="h-2" />
                <p className="text-xs text-gray-600 mt-1">Aggressive/Impulsive arguments</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Ego (Rational)</span>
                  <span className="text-sm text-gray-500">{analysis.egoScore}/10</span>
                </div>
                <Progress value={analysis.egoScore * 10} className="h-2" />
                <p className="text-xs text-gray-600 mt-1">Structure & Logic</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Superego (Moral)</span>
                  <span className="text-sm text-gray-500">{analysis.superegoScore}/10</span>
                </div>
                <Progress value={analysis.superegoScore * 10} className="h-2" />
                <p className="text-xs text-gray-600 mt-1">Ethics & Empathy</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Analysis Summary</h4>
              <p className="text-sm text-gray-600 mb-3">{analysis.feedbackText}</p>
              
              <h4 className="font-semibold text-gray-900 mb-2">Detailed Reasoning</h4>
              <p className="text-sm text-gray-600">{analysis.analysisReasoning}</p>
              
              <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm font-medium text-indigo-900">
                  Overall Score: {analysis.overallScore}/100
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FreudAnalysis;
