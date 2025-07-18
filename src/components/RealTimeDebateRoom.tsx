import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Globe, Shield, ArrowLeft, Target, Trophy, Video, MessageCircle } from 'lucide-react';
import LanguageSelection from './LanguageSelection';
import DifficultySelection from './DifficultySelection';
import LiveDebateRoomV3 from './LiveDebateRoomV3';
import { LiveDebateTopic } from '@/data/liveDebateTopics';

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

interface RealTimeDebateRoomProps {
  onBack: () => void;
}

const RealTimeDebateRoom = ({ onBack }: RealTimeDebateRoomProps) => {
  const [currentStep, setCurrentStep] = useState<'format' | 'language' | 'difficulty' | 'room'>('format');
  const [selectedFormat, setSelectedFormat] = useState<'1v1' | '3v3' | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<LiveDebateTopic | null>(null);

  const handleFormatSelect = (format: '1v1' | '3v3') => {
    setSelectedFormat(format);
    setCurrentStep('language');
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setCurrentStep('difficulty');
  };

  const handleDifficultySelect = (difficulty: 'Easy' | 'Medium' | 'Hard', theme: string) => {
    setSelectedDifficulty(difficulty);
    setSelectedTheme(theme);
    setCurrentStep('room');
  };

  const handleStartDebate = (topic: LiveDebateTopic, opponent?: OnlineUser, team?: Team) => {
    setSelectedTopic(topic);
    console.log('Starting real-time debate:', { topic, opponent, team, format: selectedFormat, language: selectedLanguage });
  };

  const handleBackToFormats = () => {
    setCurrentStep('format');
    setSelectedFormat(null);
  };

  const handleBackToLanguage = () => {
    setCurrentStep('language');
  };

  const handleBackToDifficulty = () => {
    setCurrentStep('difficulty');
  };

  // If a topic is selected, render the actual debate room
  if (selectedTopic) {
    return (
      <LiveDebateRoomV3
        topic={selectedTopic}
        format={selectedFormat!}
        language={selectedLanguage}
        onBack={() => setSelectedTopic(null)}
        onComplete={(result) => {
          console.log('Debate completed:', result);
          setSelectedTopic(null);
          onBack();
        }}
      />
    );
  }

  if (currentStep === 'room') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToDifficulty}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Join Real-Time Debate</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Room */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-500" />
                Create Debate Room
              </CardTitle>
              <CardDescription>
                Start a new debate room and invite others to join
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p><strong>Format:</strong> {selectedFormat}</p>
                  <p><strong>Language:</strong> {selectedLanguage}</p>
                  <p><strong>Difficulty:</strong> {selectedDifficulty}</p>
                  <p><strong>Theme:</strong> {selectedTheme}</p>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => {
                    // Create a sample topic for now
                    const sampleTopic: LiveDebateTopic = {
                      id: 'real-time-1',
                      title: 'Real-Time Debate Topic',
                      description: 'A dynamically generated debate topic for real-time discussion',
                      difficulty: selectedDifficulty,
                      theme: selectedTheme,
                      time_estimate: '15-20 min',
                      status: 'approved',
                      format: selectedFormat as '1v1' | '3v3',
                      aiArguments: {
                        pro: ['Argument in favor'],
                        con: ['Argument against']
                      }
                    };
                    handleStartDebate(sampleTopic);
                  }}
                >
                  Create Room
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Join Room */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
                Join Debate Room
              </CardTitle>
              <CardDescription>
                Enter a room ID to join an existing debate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter Room ID (e.g., ABC123)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={6}
                />
                <Button className="w-full" variant="outline">
                  Join Room
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Match */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Quick Match
            </CardTitle>
            <CardDescription>
              Find an opponent automatically based on your preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              onClick={() => {
                // Create a sample topic for quick match
                const sampleTopic: LiveDebateTopic = {
                  id: 'quick-match-1',
                  title: 'Quick Match Debate',
                  description: 'An automatically matched debate topic',
                  difficulty: selectedDifficulty,
                  theme: selectedTheme,
                  time_estimate: '15-20 min',
                  status: 'approved',
                  format: selectedFormat as '1v1' | '3v3',
                  aiArguments: {
                    pro: ['Argument in favor'],
                    con: ['Argument against']
                  }
                };
                handleStartDebate(sampleTopic);
              }}
            >
              Find Match
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'difficulty') {
    return (
      <DifficultySelection
        onDifficultySelect={handleDifficultySelect}
        onBack={handleBackToLanguage}
      />
    );
  }

  if (currentStep === 'language') {
    return (
      <LanguageSelection
        onLanguageSelect={handleLanguageSelect}
        onBack={handleBackToFormats}
      />
    );
  }

  // Format selection (default view)
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Real-Time Debate</h1>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">Choose Debate Format</h2>
        <p className="text-gray-600">Select how you want to debate with other users in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1v1 Format */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
          onClick={() => handleFormatSelect('1v1')}
        >
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle>1 vs 1 Debate</CardTitle>
            <CardDescription>
              Classic one-on-one debate format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>15-20 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Participants:</span>
                <span>2 debaters</span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span>Turn-based</span>
              </div>
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="mr-2">Popular</Badge>
              <Badge variant="outline">Quick</Badge>
            </div>
          </CardContent>
        </Card>

        {/* 3v3 Format */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300"
          onClick={() => handleFormatSelect('3v3')}
        >
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>3 vs 3 Team Debate</CardTitle>
            <CardDescription>
              Team-based debate with strategic collaboration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>25-30 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Participants:</span>
                <span>6 debaters</span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span>Team-based</span>
              </div>
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="mr-2">Teamwork</Badge>
              <Badge variant="outline">Strategic</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeDebateRoom;
