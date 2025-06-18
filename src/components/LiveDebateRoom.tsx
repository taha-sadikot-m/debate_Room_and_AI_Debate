import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, ArrowLeft, Target, Trophy } from 'lucide-react';

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tokens: number;
  country: string;
  status: 'available' | 'in-debate' | 'away';
}

interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeEstimate: string;
  theme: string;
  aiArguments: {
    pro: string[];
    con: string[];
  };
}

interface LiveDebateRoomProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  theme: string;
  onBack: () => void;
  onStartDebate: (topic: Topic, opponent: OnlineUser) => void;
}

const LiveDebateRoom = ({ difficulty, theme, onBack, onStartDebate }: LiveDebateRoomProps) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<OnlineUser | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {
        const { data, error } = await supabase
          .from('debate_topics')
          .select('*')
          .eq('status', 'approved')
          .eq('difficulty', difficulty)
          .eq('theme', theme)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTopics(data || []);
      } catch (err) {
        console.error('Error fetching topics:', err);
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, [difficulty, theme]);

  const mockUsers: OnlineUser[] = [
    {
      id: 'user-1',
      name: 'Alice Johnson',
      avatar: '/path/to/alice-avatar.jpg',
      level: 'Intermediate',
      tokens: 120,
      country: 'USA',
      status: 'available',
    },
    {
      id: 'user-2',
      name: 'Bob Williams',
      avatar: '/path/to/bob-avatar.jpg',
      level: 'Beginner',
      tokens: 85,
      country: 'Canada',
      status: 'available',
    },
    {
      id: 'user-3',
      name: 'Charlie Brown',
      avatar: '/path/to/charlie-avatar.jpg',
      level: 'Advanced',
      tokens: 210,
      country: 'UK',
      status: 'in-debate',
    },
  ];

  const availableUsers = mockUsers.filter(user => user.status === 'available');

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Debate Room</h1>
          <p className="text-gray-600 mt-2">Select a topic and an opponent to start a live debate</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topics Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-blue-600" />
              <span>Available Topics</span>
              <Badge className="bg-blue-100 text-blue-700">
                {loadingTopics ? 'Loading...' : `${topics.length} topics`}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingTopics ? (
              <p className="text-gray-500">Fetching topics...</p>
            ) : (
              <div className="space-y-3">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTopic?.id === topic.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{topic.title}</h4>
                      <Badge className="bg-gray-100 text-gray-700">{topic.timeEstimate}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-700">{topic.category}</Badge>
                      <Badge
                        className={
                          topic.difficulty === 'Easy'
                            ? 'bg-green-100 text-green-700'
                            : topic.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }
                      >
                        {topic.difficulty}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Online Users Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-green-600" />
              <span>Online Opponents</span>
              <Badge className="bg-green-100 text-green-700">
                {availableUsers.length} available
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedOpponent?.id === user.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedOpponent(user)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{user.name}</h4>
                        <Badge
                          className={
                            user.status === 'available'
                              ? 'bg-green-100 text-green-700'
                              : user.status === 'in-debate'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        >
                          {user.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-600">{user.country}</span>
                        <Badge
                          className={
                            user.level === 'Beginner'
                              ? 'bg-blue-100 text-blue-700'
                              : user.level === 'Intermediate'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-purple-100 text-purple-700'
                          }
                        >
                          {user.level}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{user.tokens} tokens</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token Guarantee Section */}
      <Card className="card-shadow border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <span>Token Guarantee</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Engage in live debates and earn tokens based on your performance.
            Tokens can be used to unlock premium features and access exclusive content.
          </p>
        </CardContent>
      </Card>

      {/* Start Debate Button */}
      <div className="flex justify-center">
        <Button
          className="bg-green-500 hover:bg-green-600"
          size="lg"
          disabled={!selectedTopic || !selectedOpponent}
          onClick={() => {
            if (selectedTopic && selectedOpponent) {
              onStartDebate(selectedTopic, selectedOpponent);
            }
          }}
        >
          Start Debate
        </Button>
      </div>
    </div>
  );
};

export default LiveDebateRoom;
