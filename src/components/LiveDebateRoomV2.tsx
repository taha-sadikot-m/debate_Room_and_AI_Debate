import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Clock, Trophy, Flag, MessageSquare, Zap } from 'lucide-react';
import { LiveDebateTopic } from '@/data/liveDebateTopics';
import DebateRoom from './DebateRoom';

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tokens: number;
  country: string;
  status: 'available' | 'in-debate' | 'away';
}

interface Team {
  id: string;
  name: string;
  members: OnlineUser[];
  rating: number;
  wins: number;
  losses: number;
}

interface LiveDebateRoomV2Props {
  topic: LiveDebateTopic;
  format: '1v1' | '3v3';
  opponent?: OnlineUser;
  team?: Team;
  language: string;
  onBack: () => void;
  onComplete: (result: any) => void;
}

const LiveDebateRoomV2 = ({ 
  topic, 
  format, 
  opponent, 
  team, 
  language,
  onBack, 
  onComplete 
}: LiveDebateRoomV2Props) => {
  const [currentPhase, setCurrentPhase] = useState<'waiting' | 'active' | 'complete'>('waiting');
  const [timeUntilStart, setTimeUntilStart] = useState(10);
  const [assignedSide, setAssignedSide] = useState<'FOR' | 'AGAINST'>('FOR');

  useEffect(() => {
    // Randomly assign side
    setAssignedSide(Math.random() > 0.5 ? 'FOR' : 'AGAINST');
  }, []);

  useEffect(() => {
    if (currentPhase === 'waiting' && timeUntilStart > 0) {
      const timer = setInterval(() => {
        setTimeUntilStart(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeUntilStart === 0 && currentPhase === 'waiting') {
      setCurrentPhase('active');
    }
  }, [currentPhase, timeUntilStart]);

  const handleDebateComplete = (result: any) => {
    setCurrentPhase('complete');
    onComplete(result);
  };

  if (currentPhase === 'active') {
    return (
      <DebateRoom
        debateType={format === '1v1' ? '1v1' : '1v1'} // For now, use existing DebateRoom logic
        topic={topic.title}
        language={language}
        onExit={onBack}
      />
    );
  }

  if (currentPhase === 'waiting') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Live Debate Starting</h1>
            <p className="text-gray-600 mt-2">Get ready for your {format} debate</p>
          </div>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Leave Room
          </Button>
        </div>

        {/* Countdown */}
        <Card className="text-center py-8">
          <CardContent>
            <div className="text-6xl font-bold text-blue-600 mb-4">{timeUntilStart}</div>
            <p className="text-xl text-gray-600">Seconds until debate starts</p>
          </CardContent>
        </Card>

        {/* Topic Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-purple-600" />
              <span>Debate Topic</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{topic.title}</h3>
            <p className="text-gray-600 mb-4">{topic.description}</p>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {topic.time_estimate}
              </Badge>
              <Badge 
                className={`${
                  topic.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  topic.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}
              >
                {topic.difficulty}
              </Badge>
              <Badge 
                className={`${
                  assignedSide === 'FOR' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                }`}
              >
                <Flag className="h-3 w-3 mr-1" />
                You argue {assignedSide}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Opponent/Team Info */}
        {format === '1v1' && opponent ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-green-600" />
                <span>Your Opponent</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{opponent.name}</h3>
                  <p className="text-gray-600">{opponent.country}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge 
                    className={`${
                      opponent.level === 'Beginner' ? 'bg-blue-100 text-blue-700' :
                      opponent.level === 'Intermediate' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {opponent.level}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{opponent.tokens}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : format === '3v3' && team ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-purple-600" />
                <span>Opposing Team</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                  <Badge className="bg-gray-100 text-gray-700">
                    Rating: {team.rating}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {team.members.map((member, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-600">{member.country}</div>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="outline" className="text-xs">
                          {member.level}
                        </Badge>
                        <span className="text-xs text-gray-500">{member.tokens} tokens</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600 text-center">
                  Record: {team.wins}W - {team.losses}L ({Math.round((team.wins / (team.wins + team.losses)) * 100)}% win rate)
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Debate Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-yellow-600" />
              <span>Debate Rules</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Format Rules</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {format === '1v1' ? 'Each speaker gets 3 minutes' : 'Each team member gets 2 minutes'}</li>
                  <li>• {format === '1v1' ? '2 rounds of rebuttals' : '3 rounds total per team'}</li>
                  <li>• AI moderator will track time</li>
                  <li>• No interruptions during speech</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Scoring Criteria</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Argument strength (30%)</li>
                  <li>• Evidence quality (25%)</li>
                  <li>• Delivery & style (25%)</li>
                  <li>• Rebuttals (20%)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Reward Preview */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-600" />
              <span>Potential Rewards</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {format === '1v1' ? '5-15' : '10-20'} tokens
                </div>
                <p className="text-sm text-gray-600">Base reward</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">+25%</div>
                <p className="text-sm text-gray-600">Win bonus</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">+10%</div>
                <p className="text-sm text-gray-600">Excellence bonus</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Debate Complete!</h1>
      <p className="text-gray-600 mb-8">Thank you for participating in the live debate.</p>
      <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
        Back to Lobby
      </Button>
    </div>
  );
};

export default LiveDebateRoomV2;
