
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Lightbulb, 
  ArrowRight,
  Shuffle,
  Clock,
  Users
} from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeEstimate: string;
  aiArguments: {
    pro: string[];
    con: string[];
  };
}

interface TopicSelectionProps {
  onTopicSelect: (topic: Topic) => void;
  onBack: () => void;
}

const TopicSelection = ({ onTopicSelect, onBack }: TopicSelectionProps) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showArguments, setShowArguments] = useState(false);

  const topics: Topic[] = [
    {
      id: '1',
      title: "Should artificial intelligence be regulated by international law?",
      description: "Debate the need for global AI governance and oversight",
      difficulty: 'Hard',
      category: 'Technology',
      timeEstimate: '15-20 min',
      aiArguments: {
        pro: [
          "AI poses existential risks that require coordinated global response",
          "International standards would prevent a 'race to the bottom' in AI safety",
          "Global regulation ensures equitable AI development across all nations"
        ],
        con: [
          "Innovation thrives best with minimal regulatory interference",
          "National sovereignty should determine each country's AI policies",
          "Technology evolves faster than international law can adapt"
        ]
      }
    },
    {
      id: '2',
      title: "Is social media harmful to teenage mental health?",
      description: "Examine the psychological impacts of social platforms on youth",
      difficulty: 'Medium',
      category: 'Health & Society',
      timeEstimate: '12-15 min',
      aiArguments: {
        pro: [
          "Studies show correlation between social media use and depression in teens",
          "Cyberbullying and online harassment are rampant on these platforms",
          "Constant comparison with others damages self-esteem and body image"
        ],
        con: [
          "Social media provides vital connections for isolated teenagers",
          "Platforms offer educational resources and creative outlets",
          "Digital literacy skills are essential for modern life and careers"
        ]
      }
    },
    {
      id: '3',
      title: "Should school uniforms be mandatory?",
      description: "Discuss the pros and cons of standardized school dress codes",
      difficulty: 'Easy',
      category: 'Education',
      timeEstimate: '10-12 min',
      aiArguments: {
        pro: [
          "Uniforms reduce peer pressure and eliminate clothing-based bullying",
          "They create a sense of school unity and pride among students",
          "Uniforms level the economic playing field between rich and poor students"
        ],
        con: [
          "Students have a fundamental right to express their individuality",
          "Uniforms don't address the root causes of bullying or inequality",
          "The cost burden of uniforms often falls hardest on low-income families"
        ]
      }
    },
    {
      id: '4',
      title: "Is renewable energy the complete solution to climate change?",
      description: "Evaluate renewable energy's role in addressing global warming",
      difficulty: 'Medium',
      category: 'Environment',
      timeEstimate: '15-18 min',
      aiArguments: {
        pro: [
          "Solar and wind power are now cheaper than fossil fuels in many markets",
          "Renewable energy creates more jobs per dollar invested than fossil fuels",
          "Technology advances are rapidly solving storage and reliability issues"
        ],
        con: [
          "Intermittency issues require backup power that often comes from fossil fuels",
          "Manufacturing renewable infrastructure has significant environmental costs",
          "Complete transition requires massive infrastructure changes that may not be feasible"
        ]
      }
    },
    {
      id: '5',
      title: "Should video games be considered a sport?",
      description: "Debate whether esports deserves recognition as legitimate sports",
      difficulty: 'Easy',
      category: 'Entertainment',
      timeEstimate: '10-15 min',
      aiArguments: {
        pro: [
          "Esports require intense skill, strategy, and hours of dedicated practice",
          "Professional gaming has organized leagues, sponsors, and millions of viewers",
          "Mental athleticism and quick reflexes are as valuable as physical prowess"
        ],
        con: [
          "Sports traditionally require physical exertion and athletic ability",
          "Video games promote sedentary lifestyles rather than physical fitness",
          "Gaming lacks the character-building aspects of traditional team sports"
        ]
      }
    }
  ];

  const handleRandomTopic = () => {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    setSelectedTopic(randomTopic);
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
          <p className="text-gray-600">Select from curated topics with AI-powered arguments</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleRandomTopic}>
            <Shuffle className="h-4 w-4 mr-2" />
            Random Topic
          </Button>
          <Button variant="outline" onClick={onBack}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {!selectedTopic ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((topic) => (
            <Card 
              key={topic.id} 
              className="card-shadow hover:card-shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => {
                setSelectedTopic(topic);
                setShowArguments(true);
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight">{topic.title}</CardTitle>
                  <Badge className={getDifficultyColor(topic.difficulty)}>
                    {topic.difficulty}
                  </Badge>
                </div>
                <CardDescription className="text-sm">{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{topic.category}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{topic.timeEstimate}</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-shadow border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-700">
                    <Lightbulb className="h-5 w-5" />
                    <span>Pro Arguments (Supporting)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedTopic.aiArguments.pro.map((argument, index) => (
                    <div key={index} className="bg-green-50 p-3 rounded-lg">
                      <p className="text-green-800 text-sm">{argument}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="card-shadow border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-700">
                    <Brain className="h-5 w-5" />
                    <span>Con Arguments (Opposing)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedTopic.aiArguments.con.map((argument, index) => (
                    <div key={index} className="bg-red-50 p-3 rounded-lg">
                      <p className="text-red-800 text-sm">{argument}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
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
