
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shuffle } from 'lucide-react';
import { allTopics, Topic } from '@/data/topics';
import TopicCard from '@/components/TopicCard';
import ArgumentsDisplay from '@/components/ArgumentsDisplay';
import SuggestTopicDialog from '@/components/SuggestTopicDialog';

interface TopicSelectionProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  theme: string;
  onTopicSelect: (topic: Topic) => void;
  onBack: () => void;
}

const TopicSelection = ({ difficulty, theme, onTopicSelect, onBack }: TopicSelectionProps) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showArguments, setShowArguments] = useState(false);

  // Filter topics by theme and difficulty
  const filteredTopics = allTopics.filter(topic => 
    topic.theme === theme && topic.difficulty === difficulty
  );

  // If no topics match exactly, show all topics from the theme
  const topics = filteredTopics.length > 0 ? filteredTopics : allTopics.filter(topic => topic.theme === theme);

  const handleRandomTopic = () => {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    setSelectedTopic(randomTopic);
    setShowArguments(true);
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowArguments(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Choose Your Debate Topic</h1>
          <p className="text-gray-600">
            {theme} • {difficulty} Level • AI-powered arguments included
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleRandomTopic}>
            <Shuffle className="h-4 w-4 mr-2" />
            Random Topic
          </Button>
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
      </div>

      {!selectedTopic ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.map((topic) => (
              <TopicCard 
                key={topic.id} 
                topic={topic} 
                onSelect={handleTopicSelect}
              />
            ))}
          </div>
          
          {/* Topic suggestion section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Don't see a topic you like?
                </h3>
                <p className="text-gray-600">
                  Suggest a new topic for future debates
                </p>
              </div>
              
              <div className="max-w-sm mx-auto">
                <SuggestTopicDialog />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl">{selectedTopic.title}</CardTitle>
                  <CardDescription className="mt-2">{selectedTopic.description}</CardDescription>
                </div>
                <div className="flex flex-col space-y-2">
                  <Badge className={getDifficultyColor(selectedTopic.difficulty)}>
                    {selectedTopic.difficulty}
                  </Badge>
                  <Badge variant="secondary">{selectedTopic.category}</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {showArguments && (
            <ArgumentsDisplay topic={selectedTopic} />
          )}

          <div className="text-center">
            <Button 
              size="lg" 
              onClick={() => onTopicSelect(selectedTopic)}
              className="px-8"
            >
              Continue with This Topic
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicSelection;
