
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play,
  Trophy,
  TrendingUp,
  Clock,
  Target,
  Star,
  Award,
  Brain,
  MessageSquare
} from 'lucide-react';

interface StudentDashboardProps {
  userTokens: number;
  onStartDebate: () => void;
}

const StudentDashboard = ({ userTokens, onStartDebate }: StudentDashboardProps) => {
  const skillProgress = [
    { skill: 'Confidence', level: 75, color: 'bg-blue-500' },
    { skill: 'Clarity', level: 62, color: 'bg-green-500' },
    { skill: 'Logic', level: 88, color: 'bg-purple-500' },
    { skill: 'Emotion', level: 45, color: 'bg-red-500' },
  ];

  const recentDebates = [
    { topic: 'Climate Change Policy', opponent: 'AI Assistant', result: 'Win', score: 92, tokens: 15 },
    { topic: 'Space Exploration', opponent: 'Sarah M.', result: 'Loss', score: 78, tokens: 10 },
    { topic: 'Digital Privacy', opponent: 'AI Assistant', result: 'Win', score: 85, tokens: 12 },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back, Hari!</h1>
        <p className="text-lg text-gray-600">Ready to speak your mind and sharpen your debate skills?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{userTokens}</p>
                <p className="text-sm text-gray-500">Tokens Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">23</p>
                <p className="text-sm text-gray-500">Debates Won</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">85%</p>
                <p className="text-sm text-gray-500">Win Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">87</p>
                <p className="text-sm text-gray-500">Avg. Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Start Debate Section */}
      <Card className="card-shadow-lg border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
        <CardHeader className="text-center">
          <div className="mx-auto gradient-indigo p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Ready to Start Debating?</CardTitle>
          <CardDescription className="text-base">
            Choose your topic, select your opponent, and dive into intelligent discussions
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            size="lg" 
            onClick={onStartDebate}
            className="px-8 py-4 text-lg"
          >
            <Play className="h-5 w-5 mr-2" />
            Start New Debate
          </Button>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <Brain className="h-4 w-4 text-indigo-600" />
              <span>AI-Powered Arguments</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Target className="h-4 w-4 text-indigo-600" />
              <span>Topic Selection</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Award className="h-4 w-4 text-indigo-600" />
              <span>Skill Assessment</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span>Skill Progression</span>
            </CardTitle>
            <CardDescription>Your debate skills development</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillProgress.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                  <span className="text-sm text-gray-500">{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Recent Debates</span>
            </CardTitle>
            <CardDescription>Your latest debate performances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDebates.map((debate, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{debate.topic}</p>
                  <p className="text-xs text-gray-500">vs {debate.opponent}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={debate.result === 'Win' ? 'default' : 'secondary'}
                    className={debate.result === 'Win' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                  >
                    {debate.result}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium">{debate.score}</p>
                    <p className="text-xs text-yellow-600">+{debate.tokens} tokens</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
