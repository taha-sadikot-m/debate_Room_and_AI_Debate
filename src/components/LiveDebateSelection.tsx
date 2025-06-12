
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Globe, Shield, ArrowLeft, Target, Trophy } from 'lucide-react';
import LanguageSelection from './LanguageSelection';
import DifficultySelection from './DifficultySelection';
import LiveDebateRoom from './LiveDebateRoom';
import { Topic } from '@/data/topics';

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tokens: number;
  country: string;
  status: 'available' | 'in-debate' | 'away';
}

interface LiveDebateSelectionProps {
  onFormatSelect: (format: '1v1' | '3v3', language: string) => void;
  onBack: () => void;
}

const LiveDebateSelection = ({ onFormatSelect, onBack }: LiveDebateSelectionProps) => {
  const [currentStep, setCurrentStep] = useState<'format' | 'language' | 'difficulty' | 'room'>('format');
  const [selectedFormat, setSelectedFormat] = useState<'1v1' | '3v3' | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [selectedTheme, setSelectedTheme] = useState<string>('');

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

  const handleStartDebate = (topic: Topic, opponent: OnlineUser) => {
    // Here you would typically navigate to the actual debate room
    console.log('Starting debate:', { topic, opponent, format: selectedFormat, language: selectedLanguage });
    onFormatSelect(selectedFormat!, selectedLanguage);
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

  if (currentStep === 'room') {
    return (
      <LiveDebateRoom
        difficulty={selectedDifficulty}
        theme={selectedTheme}
        onBack={handleBackToDifficulty}
        onStartDebate={handleStartDebate}
      />
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

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Choose Live Debate Format</h1>
          <p className="text-gray-600 mt-2">Select your debate format and connect with real opponents</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1v1 Format */}
        <Card className="card-shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-xl transition-all cursor-pointer">
          <CardHeader className="text-center">
            <div className="mx-auto bg-blue-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">1 vs 1 Debate</CardTitle>
            <CardDescription className="text-lg">
              Classic one-on-one debate format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration</span>
                <Badge variant="outline">15-20 min</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Participants</span>
                <Badge variant="outline">2 debaters</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Token Reward</span>
                <Badge className="bg-yellow-100 text-yellow-700">
                  <Trophy className="h-3 w-3 mr-1" />
                  5-15 tokens
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">AI Moderation</span>
                <Badge className="bg-green-100 text-green-700">
                  <Shield className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Languages</span>
                <Badge variant="outline">
                  <Globe className="h-3 w-3 mr-1" />
                  All Supported
                </Badge>
              </div>
            </div>
            <Button 
              className="w-full mt-6" 
              onClick={() => handleFormatSelect('1v1')}
            >
              Select 1v1 Format
            </Button>
          </CardContent>
        </Card>

        {/* 3v3 Format */}
        <Card className="card-shadow-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-xl transition-all cursor-pointer">
          <CardHeader className="text-center">
            <div className="mx-auto bg-purple-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">3 vs 3 Debate</CardTitle>
            <CardDescription className="text-lg">
              Team-based debate format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration</span>
                <Badge variant="outline">25-35 min</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Participants</span>
                <Badge variant="outline">6 debaters</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Token Reward</span>
                <Badge className="bg-yellow-100 text-yellow-700">
                  <Trophy className="h-3 w-3 mr-1" />
                  10-20 tokens
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">AI Moderation</span>
                <Badge className="bg-green-100 text-green-700">
                  <Shield className="h-3 w-3 mr-1" />
                  Enhanced
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Languages</span>
                <Badge variant="outline">
                  <Globe className="h-3 w-3 mr-1" />
                  All Supported
                </Badge>
              </div>
            </div>
            <Button 
              className="w-full mt-6 bg-purple-500 hover:bg-purple-600" 
              onClick={() => handleFormatSelect('3v3')}
            >
              Select 3v3 Format
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Moderation Features */}
      <Card className="card-shadow border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-green-600" />
            <span>AI-Based Moderation Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-lg mb-2">
                <Shield className="h-6 w-6 text-green-600 mx-auto" />
              </div>
              <h4 className="font-medium">Real-time Fact Checking</h4>
              <p className="text-sm text-gray-600">AI verifies claims during debate</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-lg mb-2">
                <Users className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-medium">Fair Time Management</h4>
              <p className="text-sm text-gray-600">Automatic speaking time allocation</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-lg mb-2">
                <Target className="h-6 w-6 text-purple-600 mx-auto" />
              </div>
              <h4 className="font-medium">Performance Scoring</h4>
              <p className="text-sm text-gray-600">Instant feedback and token rewards</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveDebateSelection;
