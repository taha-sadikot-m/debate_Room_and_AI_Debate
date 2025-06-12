
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
  MessageSquare,
  Mic,
  GraduationCap,
  BarChart,
  BookOpen,
  Globe,
  Users,
  Settings,
  Calendar,
  Sword,
  Bot,
  User
} from 'lucide-react';

interface StudentDashboardProps {
  userTokens: number;
  onStartDebate: () => void;
  onJoinMUN: () => void;
  onCreateDebateRoom: () => void;
  onViewEvents: () => void;
  onResources: () => void;
}

const StudentDashboard = ({ 
  userTokens, 
  onStartDebate,
  onJoinMUN,
  onCreateDebateRoom,
  onViewEvents,
  onResources
}: StudentDashboardProps) => {
  const skillProgress = [
    { skill: 'Id (Instinctive)', level: 75, color: 'bg-red-500', description: 'Aggressive/Impulsive arguments' },
    { skill: 'Ego (Rational)', level: 88, color: 'bg-blue-500', description: 'Structure & Logic' },
    { skill: 'Superego (Moral)', level: 62, color: 'bg-green-500', description: 'Ethics & Empathy' },
  ];

  const recentDebates = [
    { topic: 'Climate Change Policy', opponent: 'AI Assistant', result: 'Win', freudScore: { id: 8, ego: 9, superego: 7 }, tokens: 15 },
    { topic: 'Space Exploration', opponent: 'Sarah M.', result: 'Loss', freudScore: { id: 6, ego: 8, superego: 8 }, tokens: 10 },
    { topic: 'Digital Privacy', opponent: 'AI Assistant', result: 'Win', freudScore: { id: 7, ego: 9, superego: 6 }, tokens: 12 },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Stage. Your Voice. Your Growth</h1>
        <p className="text-lg text-gray-600">Welcome Back!</p>
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
                <p className="text-2xl font-bold text-gray-900">8.5</p>
                <p className="text-sm text-gray-500">Avg Freud Score</p>
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
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-500">Badges Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Menu Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card-shadow-lg border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white hover:shadow-xl transition-all cursor-pointer" onClick={onStartDebate}>
          <CardHeader className="text-center">
            <div className="mx-auto gradient-indigo p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">🤖 Debate with AI</CardTitle>
            <CardDescription>
              Challenge AI opponents with various difficulty levels
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="card-shadow-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-xl transition-all cursor-pointer" onClick={onStartDebate}>
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">👥 Debate with User</CardTitle>
            <CardDescription>
              1v1 debates with other students and debaters
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="card-shadow-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-xl transition-all cursor-pointer" onClick={onCreateDebateRoom}>
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">🏛️ Create Debate Room</CardTitle>
            <CardDescription>
              Set up custom topics and debate formats
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="card-shadow-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white hover:shadow-xl transition-all cursor-pointer" onClick={onViewEvents}>
          <CardHeader className="text-center">
            <div className="mx-auto bg-orange-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">🎪 Events</CardTitle>
            <CardDescription>
              Recent debates, competitions, and tournaments
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="card-shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-xl transition-all cursor-pointer" onClick={onResources}>
          <CardHeader className="text-center">
            <div className="mx-auto bg-blue-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">📚 Resources</CardTitle>
            <CardDescription>
              Rules, techniques, blogs, videos & speech feedback
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Freud Theory Skills Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>Freud Theory Analysis</span>
            </CardTitle>
            <CardDescription>Your debate personality based on Freud's theory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillProgress.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                    <p className="text-xs text-gray-500">{skill.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">{skill.level}/10</span>
                </div>
                <Progress value={skill.level * 10} className="h-2" />
              </div>
            ))}
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700">Latest Summary:</p>
              <p className="text-sm text-gray-600">"Strong ego and logic, work on empathy and moral arguments"</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Recent Debates</span>
            </CardTitle>
            <CardDescription>Your latest debate performances with Freud scores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDebates.map((debate, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{debate.topic}</p>
                    <p className="text-xs text-gray-500">vs {debate.opponent}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={debate.result === 'Win' ? 'default' : 'secondary'}
                      className={debate.result === 'Win' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                    >
                      {debate.result}
                    </Badge>
                    <p className="text-xs text-yellow-600 mt-1">+{debate.tokens} tokens</p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-2">
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Id: {debate.freudScore.id}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Ego: {debate.freudScore.ego}</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Superego: {debate.freudScore.superego}</span>
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
