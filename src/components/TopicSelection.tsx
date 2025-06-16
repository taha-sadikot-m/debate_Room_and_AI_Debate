
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shuffle } from 'lucide-react';
import { allTopics, Topic } from '@/data/topics';
import TopicCard from '@/components/TopicCard';
import ArgumentsDisplay from '@/components/ArgumentsDisplay';
import TopicSuggestDialog from '@/components/TopicSuggestDialog';

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

  // Pre-filled topics for each theme
  const preFilledTopics: Record<string, string[]> = {
    'Politics': ["Should voting be mandatory?", "Is democracy still the best?", "Should politicians be allowed on social media?"],
    'Technology': ["Is AI a threat to jobs?", "Should social media be regulated?", "Is tech addiction real?"],
    'Environment': ["Should plastic be banned?", "Can individuals fight climate change?", "Should countries be penalized for pollution?"],
    'Education': ["Should exams be scrapped?", "Online vs Traditional Learning", "Should students grade teachers?"],
    'Health': ["Is mental health equal to physical health?", "Should healthcare be free?", "Are fitness influencers misleading?"],
    'Cinema': ["Should movies be censored?", "Do biopics need to be accurate?", "Are awards shows outdated?"],
    'Sports': ["Are esports real sports?", "Should athletes be role models?", "Should PEDs be legal?"],
    'Food': ["Should junk food ads be banned?", "Is veganism the future?", "Should lab-grown meat be promoted?"],
    'Society': ["Is cancel culture needed?", "Should marriages have expiry?", "Do social media likes define worth?"],
    'Economics': ["Should billionaires exist?", "Is UBI realistic?", "Should crypto be banned?"]
  };

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
          <TopicSuggestDialog />
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
          {/* Pre-filled topic suggestions */}
          {preFilledTopics[theme] && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-indigo-900 mb-3">
                Popular {theme} Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {preFilledTopics[theme].map((topic, index) => (
                  <button
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-white border border-indigo-300 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer"
                    onClick={() => {
                      // For now, just show the topic - we'll wire this up later
                      console.log('Selected pre-filled topic:', topic);
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.map((topic) => (
              <TopicCard 
                key={topic.id} 
                topic={topic} 
                onSelect={handleTopicSelect}
              />
            ))}
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
