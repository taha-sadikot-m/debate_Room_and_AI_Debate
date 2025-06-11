
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Swords, 
  Users, 
  Crown, 
  Trophy,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Star,
  Award
} from 'lucide-react';

interface StudentDashboardProps {
  userTokens: number;
  onStartDebate: (type: 'ai' | '1v1' | 'mun') => void;
}

const StudentDashboard = ({ userTokens, onStartDebate }: StudentDashboardProps) => {
  const [selectedDebateType, setSelectedDebateType] = useState<'ai' | '1v1' | 'mun' | null>(null);

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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back, Debater!</h1>
        <p className="text-lg text-gray-600">Ready to sharpen your argumentative skills?</p>
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

      {/* Debate Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-shadow hover:card-shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => onStartDebate('ai')}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="gradient-indigo p-3 rounded-lg">
                <Swords className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Debate vs AI</CardTitle>
                <CardDescription>Practice with our advanced AI opponent</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Difficulty</span>
                <Badge variant="secondary">Adaptive</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="text-sm font-medium">10-15 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tokens</span>
                <span className="text-sm font-medium text-yellow-600">+5-15</span>
              </div>
              <Button className="w-full mt-4">Start AI Debate</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow hover:card-shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => onStartDebate('1v1')}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="gradient-indigo p-3 rounded-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">1v1 Debate</CardTitle>
                <CardDescription>Challenge a peer student</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Players Online</span>
                <Badge variant="secondary">12 active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="text-sm font-medium">15-20 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tokens</span>
                <span className="text-sm font-medium text-yellow-600">+10-25</span>
              </div>
              <Button className="w-full mt-4">Find Opponent</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow hover:card-shadow-lg transition-all duration-300 cursor-pointer border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white"
              onClick={() => onStartDebate('mun')}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="gradient-indigo-dark p-3 rounded-lg">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">MUN Arena</CardTitle>
                <CardDescription>Model United Nations simulation</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Sessions</span>
                <Badge variant="secondary">3 ongoing</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="text-sm font-medium">30-60 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tokens</span>
                <span className="text-sm font-medium text-yellow-600">+25-50</span>
              </div>
              <Button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700">
                Enter MUN Arena
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
