
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy,
  TrendingUp,
  ArrowLeft,
  Star,
  Award,
  Brain,
  Calendar,
  Target
} from 'lucide-react';

interface ScoresTokensProps {
  userTokens: number;
  onBack: () => void;
}

const ScoresTokens = ({ userTokens, onBack }: ScoresTokensProps) => {
  const badges = [
    { name: 'First Debate', icon: '🎤', earned: true, description: 'Completed your first debate' },
    { name: 'Quick Thinker', icon: '⚡', earned: true, description: '5 successful rebuttals' },
    { name: 'POI Master', icon: '✋', earned: true, description: '10 approved Points of Information' },
    { name: 'Balanced Debater', icon: '⚖️', earned: false, description: 'Score 8+ in all Freud categories' },
    { name: 'Weekly Champion', icon: '👑', earned: false, description: 'Top of weekly rankings' },
    { name: 'MUN Diplomat', icon: '🌍', earned: true, description: 'Participated in MUN session' },
  ];

  const weeklyRankings = [
    { rank: 1, name: 'Sarah Chen', tokens: 245, avatar: 'SC' },
    { rank: 2, name: 'Alex Kumar', tokens: 189, avatar: 'AK' },
    { rank: 3, name: 'Hari (You)', tokens: userTokens, avatar: 'H', isCurrentUser: true },
    { rank: 4, name: 'Priya Singh', tokens: 142, avatar: 'PS' },
    { rank: 5, name: 'David Park', tokens: 128, avatar: 'DP' },
  ];

  const tokenEarningMethods = [
    { method: 'Good Rebuttal', tokens: '5-15', description: 'Well-structured counter-arguments' },
    { method: 'Valid POI', tokens: '3-8', description: 'Approved Point of Information' },
    { method: 'Balanced Freud Score', tokens: '10-20', description: 'Score 7+ in all three categories' },
    { method: 'Daily Practice', tokens: '2-5', description: 'Complete daily speech practice' },
    { method: 'MUN Participation', tokens: '15-25', description: 'Active MUN session participation' },
  ];

  const freudProgress = [
    { category: 'Id (Instinctive)', current: 7.5, target: 8.0, color: 'bg-red-500' },
    { category: 'Ego (Rational)', current: 8.8, target: 9.0, color: 'bg-blue-500' },
    { category: 'Superego (Moral)', current: 6.2, target: 8.0, color: 'bg-green-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 My Scores & Tokens</h1>
          <p className="text-gray-600 mt-2">Track your progress and achievements</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Token Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{userTokens}</p>
                <p className="text-sm text-gray-500">Total Tokens</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">32</p>
                <p className="text-sm text-gray-500">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">3rd</p>
                <p className="text-sm text-gray-500">Weekly Rank</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Freud Scores Progress */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>Freud Theory Progress</span>
          </CardTitle>
          <CardDescription>Your development in each psychological category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {freudProgress.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{item.category}</span>
                <span className="text-sm text-gray-500">{item.current}/10 (Target: {item.target})</span>
              </div>
              <Progress value={item.current * 10} className="h-3" />
              <div className="text-xs text-gray-500">
                {item.current >= item.target ? '✅ Target achieved!' : `${(item.target - item.current).toFixed(1)} points to target`}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Badges & Achievements */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-purple-600" />
            <span>Badges & Achievements</span>
          </CardTitle>
          <CardDescription>Unlock badges by completing challenges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((badge, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 text-center ${badge.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-2xl mb-2">{badge.icon}</div>
                <h4 className={`font-medium text-sm ${badge.earned ? 'text-green-800' : 'text-gray-500'}`}>
                  {badge.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                {badge.earned && (
                  <Badge variant="default" className="mt-2 bg-green-100 text-green-700">
                    Earned
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Token Earning Methods & Weekly Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span>How to Earn Tokens</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tokenEarningMethods.map((method, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{method.method}</p>
                  <p className="text-xs text-gray-500">{method.description}</p>
                </div>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  {method.tokens} tokens
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Weekly Rankings</span>
            </CardTitle>
            <CardDescription>This week's top performers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {weeklyRankings.map((user, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${user.isCurrentUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${user.rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-700'}`}>
                    {user.rank}
                  </div>
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-medium text-indigo-700">
                    {user.avatar}
                  </div>
                  <span className={`font-medium text-sm ${user.isCurrentUser ? 'text-blue-800' : 'text-gray-700'}`}>
                    {user.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600">{user.tokens} tokens</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScoresTokens;
