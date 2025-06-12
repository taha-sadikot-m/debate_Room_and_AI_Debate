
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Trophy,
  TrendingUp,
  ArrowLeft,
  Star,
  Award,
  Brain,
  Calendar,
  Target,
  Gift,
  Crown,
  Zap,
  BookOpen,
  Users
} from 'lucide-react';

interface ScoresTokensProps {
  userTokens: number;
  onBack: () => void;
}

const ScoresTokens = ({ userTokens, onBack }: ScoresTokensProps) => {
  // Indian Mythical Achievement Badges
  const mythicalBadges = [
    { 
      name: 'Saraswati\'s Blessing', 
      icon: '🪶', 
      earned: true, 
      description: 'First debate completed - Blessed by the goddess of knowledge',
      tokens: 10,
      rarity: 'Common'
    },
    { 
      name: 'Hanuman\'s Courage', 
      icon: '🐒', 
      earned: true, 
      description: '5 consecutive wins - Embodies unwavering courage',
      tokens: 50,
      rarity: 'Rare'
    },
    { 
      name: 'Arjuna\'s Focus', 
      icon: '🏹', 
      earned: true, 
      description: '10 perfect rebuttals - Master archer\'s precision',
      tokens: 25,
      rarity: 'Uncommon'
    },
    { 
      name: 'Krishna\'s Wisdom', 
      icon: '🪈', 
      earned: false, 
      description: 'Score 9+ in all Freud categories - Divine strategist',
      tokens: 100,
      rarity: 'Epic'
    },
    { 
      name: 'Garuda\'s Speed', 
      icon: '🦅', 
      earned: false, 
      description: 'Win 3 blitz debates under 2 minutes - Swift as the eagle',
      tokens: 75,
      rarity: 'Rare'
    },
    { 
      name: 'Bhima\'s Strength', 
      icon: '💪', 
      earned: true, 
      description: 'Defeat 20 opponents - Mighty warrior\'s power',
      tokens: 30,
      rarity: 'Uncommon'
    },
    { 
      name: 'Vikramaditya\'s Justice', 
      icon: '⚖️', 
      earned: false, 
      description: 'Win parliamentary debate - Legendary king\'s fairness',
      tokens: 150,
      rarity: 'Legendary'
    },
    { 
      name: 'Chanakya\'s Strategy', 
      icon: '🧠', 
      earned: false, 
      description: 'Top monthly leaderboard - Master strategist\'s mind',
      tokens: 200,
      rarity: 'Legendary'
    }
  ];

  // Token History
  const tokenHistory = [
    { date: '2025-01-12', activity: 'Won debate: "Climate Change Policy"', tokens: +15, balance: 156 },
    { date: '2025-01-11', activity: 'Perfect rebuttal in AI debate', tokens: +12, balance: 141 },
    { date: '2025-01-10', activity: 'Daily practice bonus', tokens: +5, balance: 129 },
    { date: '2025-01-09', activity: 'Premium feature unlock', tokens: -20, balance: 124 },
    { date: '2025-01-08', activity: 'MUN participation bonus', tokens: +25, balance: 144 },
    { date: '2025-01-07', activity: 'Hanuman\'s Courage badge earned', tokens: +50, balance: 119 },
    { date: '2025-01-06', activity: 'Lost debate: "Space Exploration"', tokens: +8, balance: 69 },
    { date: '2025-01-05', activity: 'POI approved by moderator', tokens: +6, balance: 61 },
  ];

  // Redemption Options
  const redemptionOptions = [
    {
      title: 'Premium Access (1 Month)',
      description: 'Unlock advanced AI opponents, voice analysis, and premium features',
      tokens: 200,
      icon: Crown,
      available: userTokens >= 200,
      category: 'Premium'
    },
    {
      title: 'Scholarship Application',
      description: 'Apply for debate scholarship programs and competitions',
      tokens: 150,
      icon: Award,
      available: userTokens >= 150,
      category: 'Education'
    },
    {
      title: 'Personal Mentor Session',
      description: '1-on-1 coaching session with professional debate coach',
      tokens: 100,
      icon: Users,
      available: userTokens >= 100,
      category: 'Coaching'
    },
    {
      title: 'Tournament Entry',
      description: 'Free entry to national debate tournaments',
      tokens: 75,
      icon: Trophy,
      available: userTokens >= 75,
      category: 'Competition'
    },
    {
      title: 'Advanced Speech Analysis',
      description: 'Detailed AI analysis of your speaking patterns and improvement tips',
      tokens: 50,
      icon: Brain,
      available: userTokens >= 50,
      category: 'Analysis'
    },
    {
      title: 'Debate Resources Pack',
      description: 'Exclusive access to premium debate materials and templates',
      tokens: 30,
      icon: BookOpen,
      available: userTokens >= 30,
      category: 'Resources'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Uncommon': return 'bg-green-100 text-green-700 border-green-300';
      case 'Rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const totalEarnedTokens = mythicalBadges.filter(badge => badge.earned).reduce((sum, badge) => sum + badge.tokens, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🏆 My Tokens & Achievements</h1>
          <p className="text-gray-600 mt-2">Unlock mythical powers through debate mastery</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Token Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{userTokens}</p>
                <p className="text-sm text-gray-500">Current Tokens</p>
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
                <p className="text-3xl font-bold text-gray-900">{totalEarnedTokens}</p>
                <p className="text-sm text-gray-500">Total Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{mythicalBadges.filter(b => b.earned).length}</p>
                <p className="text-sm text-gray-500">Badges Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{redemptionOptions.filter(r => r.available).length}</p>
                <p className="text-sm text-gray-500">Available Rewards</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indian Mythical Achievement Badges */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-orange-600" />
            <span>🕉️ Mythical Achievement Badges</span>
          </CardTitle>
          <CardDescription>Unlock legendary powers inspired by Indian mythology</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mythicalBadges.map((badge, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 text-center ${badge.earned ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h4 className={`font-bold text-sm ${badge.earned ? 'text-orange-800' : 'text-gray-500'}`}>
                  {badge.name}
                </h4>
                <p className="text-xs text-gray-600 mt-1 mb-2">{badge.description}</p>
                <div className="flex justify-center space-x-2 mb-2">
                  <Badge className={`text-xs ${getRarityColor(badge.rarity)}`}>
                    {badge.rarity}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                    {badge.tokens} tokens
                  </Badge>
                </div>
                {badge.earned && (
                  <Badge variant="default" className="bg-green-100 text-green-700 text-xs">
                    ✓ Earned
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Token Redemption Options */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5 text-blue-600" />
            <span>🎁 Token Redemption Store</span>
          </CardTitle>
          <CardDescription>Use your tokens to unlock premium features and opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {redemptionOptions.map((option, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${option.available ? 'bg-white border-indigo-200 hover:border-indigo-300' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${option.available ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                    <option.icon className={`h-6 w-6 ${option.available ? 'text-indigo-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-sm ${option.available ? 'text-gray-900' : 'text-gray-500'}`}>
                      {option.title}
                    </h4>
                    <Badge variant="outline" className="text-xs mt-1">
                      {option.category}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3">{option.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`font-bold ${option.available ? 'text-indigo-600' : 'text-gray-400'}`}>
                    {option.tokens} tokens
                  </span>
                  <Button 
                    size="sm" 
                    disabled={!option.available}
                    className={option.available ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                  >
                    {option.available ? 'Redeem' : 'Locked'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Token History */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <span>📈 Token History</span>
          </CardTitle>
          <CardDescription>Track your token earnings and spending</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead className="text-right">Tokens</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokenHistory.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell className="text-sm text-gray-600">{entry.date}</TableCell>
                  <TableCell className="text-sm">{entry.activity}</TableCell>
                  <TableCell className={`text-right font-medium ${entry.tokens > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {entry.tokens > 0 ? '+' : ''}{entry.tokens}
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-900">{entry.balance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoresTokens;
