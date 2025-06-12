
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Users, Clock, Globe, Trophy, Coins } from 'lucide-react';
import { allTopics, Topic } from '@/data/topics';

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tokens: number;
  country: string;
  status: 'available' | 'in-debate' | 'away';
}

interface LiveDebateRoomProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  theme: string;
  onBack: () => void;
  onStartDebate: (topic: Topic, opponent: OnlineUser) => void;
}

// Mock online users data
const mockOnlineUsers: OnlineUser[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    level: 'Advanced',
    tokens: 1250,
    country: 'India',
    status: 'available'
  },
  {
    id: '2',
    name: 'Priya Patel',
    level: 'Intermediate',
    tokens: 890,
    country: 'India',
    status: 'available'
  },
  {
    id: '3',
    name: 'Rahul Kumar',
    level: 'Beginner',
    tokens: 420,
    country: 'India',
    status: 'in-debate'
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    level: 'Advanced',
    tokens: 1580,
    country: 'USA',
    status: 'available'
  },
  {
    id: '5',
    name: 'Li Wei',
    level: 'Intermediate',
    tokens: 750,
    country: 'China',
    status: 'available'
  },
  {
    id: '6',
    name: 'Ahmed Hassan',
    level: 'Advanced',
    tokens: 1320,
    country: 'Egypt',
    status: 'away'
  }
];

const LiveDebateRoom = ({ difficulty, theme, onBack, onStartDebate }: LiveDebateRoomProps) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<OnlineUser | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>(mockOnlineUsers);

  // Filter topics by theme and difficulty
  const filteredTopics = allTopics.filter(topic => 
    topic.theme === theme && topic.difficulty === difficulty
  );

  // Filter available users
  const availableUsers = onlineUsers.filter(user => user.status === 'available');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'in-debate': return 'bg-orange-100 text-orange-700';
      case 'away': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-blue-100 text-blue-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStartDebate = () => {
    if (selectedTopic && selectedOpponent) {
      onStartDebate(selectedTopic, selectedOpponent);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Debate Arena</h1>
          <p className="text-gray-600 mt-2">{theme} • {difficulty} Level • Guaranteed tokens for every debate</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Token Guarantee Banner */}
      <Card className="card-shadow border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-3">
            <Coins className="h-6 w-6 text-yellow-600" />
            <span className="text-lg font-semibold text-gray-900">
              🎯 Guaranteed 5-20 tokens for every live debate completion!
            </span>
            <Trophy className="h-6 w-6 text-yellow-600" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topics Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <span>Select Debate Topic</span>
              </CardTitle>
              <CardDescription>
                Choose from {filteredTopics.length} available topics for {theme} debates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTopic?.id === topic.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTopic(topic)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{topic.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {topic.timeEstimate}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {topic.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Selected Topic Preview */}
          {selectedTopic && (
            <Card className="card-shadow border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Topic Preview: {selectedTopic.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Arguments FOR:</h4>
                    <ul className="space-y-1">
                      {selectedTopic.aiArguments.pro.slice(0, 3).map((arg, index) => (
                        <li key={index} className="text-sm text-gray-600">• {arg}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">Arguments AGAINST:</h4>
                    <ul className="space-y-1">
                      {selectedTopic.aiArguments.con.slice(0, 3).map((arg, index) => (
                        <li key={index} className="text-sm text-gray-600">• {arg}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Online Users */}
        <div className="space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <span>Online Debaters</span>
                <Badge className="bg-green-100 text-green-700">
                  {availableUsers.length} available
                </Badge>
              </CardTitle>
              <CardDescription>
                Select an opponent for your live debate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {onlineUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedOpponent?.id === user.id
                      ? 'border-blue-500 bg-blue-50'
                      : user.status === 'available'
                      ? 'border-gray-200 hover:border-gray-300'
                      : 'border-gray-100 opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => user.status === 'available' && setSelectedOpponent(user)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <Badge className={getStatusColor(user.status)} size="sm">
                          {user.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getLevelColor(user.level)} size="sm">
                          {user.level}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Coins className="h-3 w-3 mr-1" />
                          {user.tokens}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{user.country}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Start Debate Button */}
          {selectedTopic && selectedOpponent && (
            <Card className="card-shadow border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Ready to Debate!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Topic: {selectedTopic.title}
                  <br />
                  Opponent: {selectedOpponent.name}
                </p>
                <Button
                  onClick={handleStartDebate}
                  className="w-full bg-green-500 hover:bg-green-600"
                  size="lg"
                >
                  Start Live Debate
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveDebateRoom;
