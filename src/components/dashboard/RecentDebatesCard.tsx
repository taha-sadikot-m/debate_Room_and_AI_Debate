
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

const RecentDebatesCard = () => {
  const recentDebates = [
    { topic: 'Climate Change Policy', opponent: 'AI Assistant', result: 'Win', freudScore: { id: 8, ego: 9, superego: 7 }, tokens: 15 },
    { topic: 'Space Exploration', opponent: 'Sarah M.', result: 'Loss', freudScore: { id: 6, ego: 8, superego: 8 }, tokens: 10 },
    { topic: 'Digital Privacy', opponent: 'AI Assistant', result: 'Win', freudScore: { id: 7, ego: 9, superego: 6 }, tokens: 12 },
  ];

  return (
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
  );
};

export default RecentDebatesCard;
