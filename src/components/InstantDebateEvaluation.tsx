import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Trophy, Target, Star, BookOpen, ChevronRight } from 'lucide-react';

interface Message {
  id: string;
  speaker: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface DebateConfig {
  topic: string;
  userPosition: 'for' | 'against';
  firstSpeaker: 'user' | 'ai';
}

interface DebateEvaluation {
  score: number;
  breakdown: {
    logical_consistency: number;
    evidence_quality: number;
    rebuttal_effectiveness: number;
    persuasiveness: number;
    rhetorical_skill: number;
  };
  strengths: string[];
  improvements: string[];
  argument_analysis: {
    argument: string;
    feedback: string;
    suggestion: string;
  }[];
  final_remarks: string;
}

interface InstantDebateEvaluationProps {
  config: DebateConfig;
  messages: Message[];
  onBack: () => void;
  onNewDebate: () => void;
  onViewHistory: () => void;
}

const InstantDebateEvaluation = ({ 
  config, 
  messages, 
  onBack, 
  onNewDebate,
  onViewHistory 
}: InstantDebateEvaluationProps) => {
  const [evaluation, setEvaluation] = useState<DebateEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Save debate to history and generate evaluation
    saveDebateToHistory();
    generateEvaluation();
  }, []);

  const saveDebateToHistory = () => {
    const debateRecord = {
      id: Date.now().toString(),
      topic: config.topic,
      userPosition: config.userPosition,
      aiPosition: config.userPosition === 'for' ? 'against' : 'for',
      messages: messages,
      createdAt: new Date(),
      evaluation: null // Will be set after evaluation
    };

    // Get existing debates from localStorage
    const existingDebates = JSON.parse(localStorage.getItem('instant_debates') || '[]');
    existingDebates.unshift(debateRecord); // Add to beginning
    
    // Keep only last 50 debates
    if (existingDebates.length > 50) {
      existingDebates.splice(50);
    }
    
    localStorage.setItem('instant_debates', JSON.stringify(existingDebates));
  };

  const generateEvaluation = async () => {
    setIsLoading(true);
    
    // Extract user arguments
    const userArguments = messages.filter(msg => msg.speaker === 'user').map(msg => msg.text);
    
    // Simulate AI evaluation (in real app, this would call an AI service)
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
    
    const mockEvaluation: DebateEvaluation = {
      score: Math.floor(Math.random() * 25) + 70, // Score between 70-95
      breakdown: {
        logical_consistency: Math.floor(Math.random() * 30) + 70,
        evidence_quality: Math.floor(Math.random() * 30) + 65,
        rebuttal_effectiveness: Math.floor(Math.random() * 25) + 70,
        persuasiveness: Math.floor(Math.random() * 30) + 68,
        rhetorical_skill: Math.floor(Math.random() * 25) + 72
      },
      strengths: [
        "Strong logical structure in presenting arguments",
        "Effective use of evidence to support claims",
        "Good counter-arguments against opposing viewpoints"
      ],
      improvements: [
        "Could strengthen emotional appeal in arguments",
        "More specific examples would enhance credibility",
        "Consider addressing potential counter-arguments earlier"
      ],
      argument_analysis: userArguments.slice(0, 2).map((arg, index) => ({
        argument: arg.substring(0, 100) + (arg.length > 100 ? '...' : ''),
        feedback: `This argument shows ${index === 0 ? 'strong analytical thinking' : 'good persuasive techniques'} but could be enhanced.`,
        suggestion: `Consider ${index === 0 ? 'adding more concrete examples' : 'strengthening the logical flow'} to make this point more compelling.`
      })),
      final_remarks: `Your debate performance on "${config.topic}" demonstrates solid understanding of the topic and good argumentation skills. Focus on the improvement areas to enhance your future debates.`
    };

    setEvaluation(mockEvaluation);
    
    // Update the saved debate with evaluation
    const debates = JSON.parse(localStorage.getItem('instant_debates') || '[]');
    if (debates.length > 0) {
      debates[0].evaluation = mockEvaluation;
      localStorage.setItem('instant_debates', JSON.stringify(debates));
    }
    
    setIsLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 80) return { text: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 70) return { text: 'Average', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Work', color: 'bg-red-100 text-red-800' };
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Evaluating Your Performance</h2>
          <p className="text-gray-600">Our AI is analyzing your debate arguments...</p>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Evaluation Error</h2>
          <p className="text-gray-600 mb-4">Unable to generate evaluation. Please try again.</p>
          <Button onClick={onBack}>Back to Debate</Button>
        </div>
      </div>
    );
  }

  const scoreBadge = getScoreBadge(evaluation.score);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Debate Performance Evaluation</h1>
          <p className="text-gray-600 mt-2">Topic: {config.topic}</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Overall Score Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-500 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold text-gray-900 mb-2">
            {evaluation.score}/100
          </CardTitle>
          <Badge className={scoreBadge.color}>
            {scoreBadge.text}
          </Badge>
        </CardHeader>
      </Card>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-blue-600" />
            <span>Performance Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(evaluation.breakdown).map(([category, score]) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium capitalize">
                  {category.replace(/_/g, ' ')}
                </span>
                <span className={`font-bold ${getScoreColor(score)}`}>
                  {score}%
                </span>
              </div>
              <Progress value={score} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-green-600" />
              <span>Strengths</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {evaluation.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="bg-green-100 p-1 rounded-full mt-1">
                    <ChevronRight className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-orange-600" />
              <span>Areas for Improvement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {evaluation.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="bg-orange-100 p-1 rounded-full mt-1">
                    <ChevronRight className="h-3 w-3 text-orange-600" />
                  </div>
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Argument Analysis */}
      {evaluation.argument_analysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-purple-600" />
              <span>Argument Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {evaluation.argument_analysis.map((analysis, index) => (
              <div key={index} className="border-l-4 border-purple-200 pl-4 space-y-2">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">Argument {index + 1}:</h4>
                  <p className="text-gray-700 italic">"{analysis.argument}"</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Feedback:</h5>
                  <p className="text-gray-700">{analysis.feedback}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Suggestion:</h5>
                  <p className="text-gray-700">{analysis.suggestion}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Final Remarks */}
      <Card>
        <CardHeader>
          <CardTitle>Final Remarks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{evaluation.final_remarks}</p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pt-6">
        <Button onClick={onNewDebate} className="bg-green-500 hover:bg-green-600">
          Start New Debate
        </Button>
        <Button variant="outline" onClick={onViewHistory}>
          View Debate History
        </Button>
      </div>
    </div>
  );
};

export default InstantDebateEvaluation;
