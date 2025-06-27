import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Zap } from 'lucide-react';

interface InstantDebateSetupProps {
  onStartDebate: (config: DebateConfig) => void;
  onBack: () => void;
}

interface DebateConfig {
  topic: string;
  userPosition: 'for' | 'against';
  firstSpeaker: 'user' | 'ai';
}

const InstantDebateSetup = ({ onStartDebate, onBack }: InstantDebateSetupProps) => {
  const [topic, setTopic] = useState('');
  const [userPosition, setUserPosition] = useState<'for' | 'against'>('for');
  const [firstSpeaker, setFirstSpeaker] = useState<'user' | 'ai'>('user');

  const handleStartDebate = () => {
    console.log('handleStartDebate called with:', { topic, userPosition, firstSpeaker });
    
    if (!topic.trim()) {
      alert('Please enter a debate topic');
      return;
    }

    const config = {
      topic: topic.trim(),
      userPosition,
      firstSpeaker
    };
    
    console.log('Starting debate with config:', config);
    onStartDebate(config);
  };

  const suggestedTopics = [
    "Should artificial intelligence be regulated by government?",
    "Is remote work better than office work?",
    "Should social media platforms be held responsible for misinformation?",
    "Is nuclear energy the key to solving climate change?",
    "Should university education be free for everyone?"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Zap className="h-8 w-8 text-yellow-500 mr-2" />
            Instant AI Debate
          </h1>
          <p className="text-gray-600 mt-2">Choose your topic and position to start debating instantly</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="card-shadow-lg">
        <CardHeader>
          <CardTitle>Debate Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Topic Input */}
          <div className="space-y-2">
            <Label htmlFor="topic">Debate Topic</Label>
            <Input
              id="topic"
              placeholder="Enter your debate topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="text-lg p-4"
            />
          </div>

          {/* Suggested Topics */}
          <div className="space-y-2">
            <Label>Quick Suggestions</Label>
            <div className="grid grid-cols-1 gap-2">
              {suggestedTopics.map((suggestedTopic, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left justify-start h-auto p-3 text-sm"
                  onClick={() => setTopic(suggestedTopic)}
                >
                  {suggestedTopic}
                </Button>
              ))}
            </div>
          </div>

          {/* Position Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>My Position</Label>
              <Select value={userPosition} onValueChange={(value: 'for' | 'against') => setUserPosition(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="for">In Favor</SelectItem>
                  <SelectItem value="against">Against</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>First Speaker</Label>
              <Select value={firstSpeaker} onValueChange={(value: 'user' | 'ai') => setFirstSpeaker(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">I speak first</SelectItem>
                  <SelectItem value="ai">AI speaks first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Start Button */}
          <Button 
            onClick={handleStartDebate}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 text-lg font-semibold"
            size="lg"
          >
            <Zap className="h-5 w-5 mr-2" />
            Begin Instant Debate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstantDebateSetup;
