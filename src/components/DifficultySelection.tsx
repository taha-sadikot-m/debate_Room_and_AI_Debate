
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  Target,
  ArrowRight,
  Star
} from 'lucide-react';

interface DifficultySelectionProps {
  onDifficultySelect: (difficulty: 'Easy' | 'Medium' | 'Hard', theme: string) => void;
  onBack: () => void;
}

const DifficultySelection = ({ onDifficultySelect, onBack }: DifficultySelectionProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const difficulties = [
    {
      level: 'Easy' as const,
      icon: <Star className="h-6 w-6" />,
      description: 'Perfect for beginners',
      details: 'Simple topics, basic arguments, friendly AI',
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      level: 'Medium' as const,
      icon: <Target className="h-6 w-6" />,
      description: 'Balanced challenge',
      details: 'Complex topics, structured arguments, adaptive AI',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    },
    {
      level: 'Hard' as const,
      icon: <Brain className="h-6 w-6" />,
      description: 'Advanced debaters',
      details: 'Complex topics, expert-level arguments, challenging AI',
      color: 'bg-red-100 text-red-700 border-red-200'
    }
  ];

  const themes = [
    { name: 'Politics', emoji: '🏛️', description: 'Government, policies, elections' },
    { name: 'Technology', emoji: '💻', description: 'AI, social media, innovation' },
    { name: 'Environment', emoji: '🌍', description: 'Climate change, sustainability' },
    { name: 'Education', emoji: '📚', description: 'School systems, online learning' },
    { name: 'Health', emoji: '🏥', description: 'Healthcare, mental health, fitness' },
    { name: 'Cinema', emoji: '🎬', description: 'Movies, entertainment, culture' },
    { name: 'Sports', emoji: '⚽', description: 'Athletes, competitions, fairness' },
    { name: 'Food', emoji: '🍔', description: 'Nutrition, culture, industry' },
    { name: 'Society', emoji: '👥', description: 'Social issues, relationships' },
    { name: 'Economics', emoji: '💰', description: 'Markets, inequality, trade' }
  ];

  const handleContinue = () => {
    if (selectedDifficulty && selectedTheme) {
      onDifficultySelect(selectedDifficulty, selectedTheme);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Choose Your Challenge</h1>
          <p className="text-gray-600">Select difficulty level and theme for your debate</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Dashboard
        </Button>
      </div>

      {/* Difficulty Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Difficulty Level</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {difficulties.map((difficulty) => (
            <Card 
              key={difficulty.level}
              className={`card-shadow hover:card-shadow-lg transition-all duration-300 cursor-pointer border-2 ${
                selectedDifficulty === difficulty.level 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedDifficulty(difficulty.level)}
            >
              <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  {difficulty.icon}
                  <CardTitle className="text-lg">{difficulty.level}</CardTitle>
                </div>
                <CardDescription>{difficulty.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">{difficulty.details}</p>
                <div className="mt-3 text-center">
                  <Badge className={difficulty.color}>{difficulty.level}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Theme Selection */}
      {selectedDifficulty && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-800">Choose Your Theme</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {themes.map((theme) => (
              <Card 
                key={theme.name}
                className={`card-shadow hover:card-shadow-lg transition-all duration-300 cursor-pointer border-2 ${
                  selectedTheme === theme.name 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTheme(theme.name)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{theme.emoji}</div>
                  <h3 className="font-medium text-sm">{theme.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{theme.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      {selectedDifficulty && selectedTheme && (
        <div className="text-center animate-fade-in">
          <Button 
            size="lg" 
            onClick={handleContinue}
            className="px-8"
          >
            Continue to Topics
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DifficultySelection;
